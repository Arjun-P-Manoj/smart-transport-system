from flask import jsonify, request
from db.database import get_db_connection


def wallet_recharge():
    """
    Wallet recharge with auto due settlement
    (User already authenticated via login)
    """

    data = request.json or {}
    user_id = data.get("user_id")
    amount = data.get("amount")

    if not user_id:
        return jsonify({
            "success": False,
            "message": "user_id is required"
        }), 400

    if not amount or amount <= 0:
        return jsonify({
            "success": False,
            "message": "Invalid recharge amount"
        }), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1️⃣ ADD RECHARGE AMOUNT
        cur.execute("""
            UPDATE wallet
            SET balance = balance + %s
            WHERE user_id = %s
            RETURNING balance
        """, (amount, user_id))

        new_balance = float(cur.fetchone()[0])

        # 2️⃣ CHECK FOR PENDING DUE (LATEST ONLY)
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
        cleared_due = 0

        if row:
            journey_id, due_amount = row
            due_amount = float(due_amount)

            if new_balance >= due_amount:
                # 3️⃣ CLEAR DUE
                cur.execute("""
                    UPDATE wallet
                    SET balance = balance - %s
                    WHERE user_id = %s
                """, (due_amount, user_id))

                cur.execute("""
                    UPDATE fare_record
                    SET paid_amount = paid_amount + %s,
                        due_amount = 0
                    WHERE journey_id = %s
                """, (due_amount, journey_id))

                cur.execute("""
                    UPDATE journey
                    SET status = 'COMPLETED'
                    WHERE journey_id = %s
                """, (journey_id,))

                cleared_due = due_amount
                new_balance -= due_amount

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Wallet recharged successfully",
            "recharged_amount": amount,
            "due_cleared": cleared_due,
            "current_balance": round(new_balance, 2)
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "success": False,
            "message": "Recharge failed",
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()
