from flask import jsonify, request
from psycopg2.extras import RealDictCursor
from db.database import get_db_connection
from decimal import Decimal


# =========================
# WALLET RECHARGE
# =========================
def wallet_recharge(user_id):
    data = request.json or {}
    amount = data.get("amount")

    if amount is None or amount <= 0:
        return jsonify({
            "success": False,
            "message": "Invalid recharge amount"
        }), 400

    # 🔒 Always convert input to Decimal
    amount = Decimal(str(amount))

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 🔐 LOCK WALLET ROW
        cur.execute("""
            SELECT wallet_id, balance
            FROM wallet
            WHERE user_id = %s
            FOR UPDATE
        """, (user_id,))

        wallet = cur.fetchone()
        if not wallet:
            return jsonify({
                "success": False,
                "message": "Wallet not found"
            }), 404

        wallet_id, balance = wallet
        balance = Decimal(balance)

        # 1️⃣ CREDIT transaction (RECHARGE)
        cur.execute("""
            INSERT INTO transactions (wallet_id, amount, type, reason)
VALUES (%s, %s, 'CREDIT', 'RECHARGE')
        """, (wallet_id, amount))

        # 2️⃣ Update wallet balance
        new_balance = balance + amount
        cur.execute("""
            UPDATE wallet
            SET balance = %s
            WHERE wallet_id = %s
        """, (new_balance, wallet_id))

        # 3️⃣ Check latest pending due
        cur.execute("""
            SELECT j.journey_id, fr.due_amount
            FROM journey j
            JOIN fare_record fr ON fr.journey_id = j.journey_id
            WHERE j.user_id = %s
              AND j.status = 'COMPLETED_WITH_DUE'
              AND fr.due_amount > 0
            ORDER BY j.journey_id DESC
            LIMIT 1
        """, (user_id,))

        row = cur.fetchone()
        cleared_due = Decimal("0.00")

        if row:
            journey_id, due_amount = row
            due_amount = Decimal(due_amount)

            # 🔑 CORE SETTLEMENT LOGIC
            paid = min(new_balance, due_amount)

            if paid > 0:
                # 4️⃣ DEBIT transaction (due settlement)
                cur.execute("""
    INSERT INTO transactions (wallet_id, journey_id, amount, type, reason)
    VALUES (%s, %s, %s, 'DEBIT', 'DUE_SETTLEMENT')
""", (wallet_id, journey_id, paid))


                # update wallet
                new_balance = new_balance - paid
                cur.execute("""
                    UPDATE wallet
                    SET balance = %s
                    WHERE wallet_id = %s
                """, (new_balance, wallet_id))

                # update fare record
                cur.execute("""
                    UPDATE fare_record
                    SET paid_amount = paid_amount + %s,
                        due_amount = due_amount - %s
                    WHERE journey_id = %s
                """, (paid, paid, journey_id))

                # update journey status
                if paid == due_amount:
                    cur.execute("""
                        UPDATE journey
                        SET status = 'COMPLETED'
                        WHERE journey_id = %s
                    """, (journey_id,))
                else:
                    cur.execute("""
                        UPDATE journey
                        SET status = 'COMPLETED_WITH_DUE'
                        WHERE journey_id = %s
                    """, (journey_id,))

                cleared_due = paid

        conn.commit()

        return jsonify({
            "success": True,
            "recharged_amount": float(amount),
            "due_cleared": float(cleared_due),
            "current_balance": float(new_balance)
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# =========================
# WALLET TRANSACTIONS
# =========================
def get_wallet_transactions(user_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT
            transaction_id,
            created_at AS timestamp,
            type,
            amount,
            CASE
                WHEN reason = 'RECHARGE' THEN 'Wallet Recharge'
                WHEN reason = 'DUE_SETTLEMENT' THEN 'Due Settlement'
                WHEN reason = 'JOURNEY_FARE' THEN 'Journey Fare'
                ELSE 'Transaction'
            END AS status
        FROM transactions
        WHERE wallet_id = (
            SELECT wallet_id FROM wallet WHERE user_id = %s
        )
        ORDER BY transaction_id DESC
    """, (user_id,))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(rows)