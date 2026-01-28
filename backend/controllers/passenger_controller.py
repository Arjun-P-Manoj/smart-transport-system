from flask import jsonify, request
from db.database import get_db_connection
from utils.ml_runner import recognize_face

MIN_BALANCE = 50
PRICE_PER_KM = 8


# =========================
# FACE PASSENGER ENTRY
# =========================
def face_passenger_entry():
    user_id = recognize_face()

    if not user_id:
        return jsonify({
            "success": False,
            "message": "Please register to use our service"
        }), 401

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 🚫 BLOCK ENTRY IF PENDING DUE EXISTS
        cur.execute("""
            SELECT 1
            FROM journey
            WHERE user_id = %s
              AND status = 'COMPLETED_WITH_DUE'
        """, (user_id,))

        if cur.fetchone():
            return jsonify({
                "success": False,
                "message": "Pending dues found. Please recharge wallet to continue."
            }), 403

        # WALLET CHECK
        cur.execute("SELECT balance FROM wallet WHERE user_id = %s", (user_id,))
        wallet = cur.fetchone()

        if not wallet:
            return jsonify({
                "success": False,
                "message": "Wallet not found"
            }), 403

        balance = float(wallet[0])

        if balance < MIN_BALANCE:
            return jsonify({
                "success": False,
                "message": "Minimum ₹50 balance required to start journey"
            }), 403

        # ALREADY INSIDE BUS
        cur.execute("""
            SELECT 1
            FROM journey
            WHERE user_id = %s
              AND exit_time IS NULL
        """, (user_id,))

        if cur.fetchone():
            return jsonify({
                "success": True,
                "message": "Passenger already inside bus"
            })

        bus_id = request.json.get("bus_id")

        if not bus_id:
            return jsonify({
                "success": False,
                "message": "bus_id is required"
            }), 400

        cur.execute("""
            SELECT current_stop_id
            FROM bus
            WHERE bus_id = %s
        """, (bus_id,))
        row = cur.fetchone()

        if not row or not row[0]:
            return jsonify({
                "success": False,
                "message": "Current stop not available"
            }), 400

        entry_stop_id = row[0]

        # INSERT JOURNEY
        cur.execute("""
            INSERT INTO journey (
                user_id,
                bus_id,
                entry_stop_id,
                entry_time,
                status
            )
            VALUES (%s, %s, %s, NOW(), 'IN_PROGRESS')
        """, (user_id, bus_id, entry_stop_id))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Passenger entry recorded",
            "entry_stop_id": entry_stop_id
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "success": False,
            "message": "Entry failed",
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# =========================
# FACE PASSENGER EXIT
# =========================
def face_passenger_exit():
    user_id = recognize_face()

    if not user_id:
        return jsonify({"success": False, "message": "Face not recognized"}), 401

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 🔐 LOCK ACTIVE JOURNEY
        cur.execute("""
            SELECT journey_id, entry_stop_id, bus_id
            FROM journey
            WHERE user_id = %s
              AND exit_time IS NULL
              AND status = 'IN_PROGRESS'
            FOR UPDATE
        """, (user_id,))
        journey = cur.fetchone()

        if not journey:
            return jsonify({
                "success": False,
                "message": "Passenger is not inside any bus"
            }), 400

        journey_id, entry_stop_id, bus_id = journey

        # EXIT STOP
        cur.execute("""
            SELECT current_stop_id
            FROM bus
            WHERE bus_id = %s
        """, (bus_id,))
        exit_stop_id = cur.fetchone()[0]

        # DISTANCE
        cur.execute("""
            SELECT distance_km FROM route_stops WHERE stop_id = %s
        """, (entry_stop_id,))
        entry_km = float(cur.fetchone()[0])

        cur.execute("""
            SELECT distance_km FROM route_stops WHERE stop_id = %s
        """, (exit_stop_id,))
        exit_km = float(cur.fetchone()[0])

        journey_distance = abs(exit_km - entry_km)
        fare = round(journey_distance * PRICE_PER_KM, 2)

        # 🔐 LOCK WALLET
        cur.execute("""
            SELECT wallet_id, balance
            FROM wallet
            WHERE user_id = %s
            FOR UPDATE
        """, (user_id,))
        wallet_id, balance = cur.fetchone()
        balance = float(balance)

        # 🔑 CORE LOGIC
        paid = min(balance, fare)
        due = round(fare - paid, 2)

        # UPDATE WALLET (only what was paid)
        if paid > 0:
            cur.execute("""
                UPDATE wallet
                SET balance = balance - %s
                WHERE wallet_id = %s
            """, (paid, wallet_id))

        # UPDATE JOURNEY
        status = "COMPLETED_WITH_DUE" if due > 0 else "COMPLETED"
        cur.execute("""
            UPDATE journey
            SET exit_stop_id = %s,
                exit_time = NOW(),
                distance_km = %s,
                status = %s
            WHERE journey_id = %s
        """, (exit_stop_id, journey_distance, status, journey_id))

        # FARE RECORD
        cur.execute("""
            INSERT INTO fare_record (
                journey_id,
                distance,
                fare_amount,
                paid_amount,
                due_amount
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (journey_id, journey_distance, fare, paid, due))

        # ✅ TRANSACTION → JOURNEY FARE (IMPORTANT FIX)
        if paid > 0:
            cur.execute("""
                INSERT INTO transactions (
                    wallet_id,
                    journey_id,
                    amount,
                    type,
                    reason
                )
                VALUES (%s, %s, %s, 'DEBIT', 'JOURNEY_FARE')
            """, (wallet_id, journey_id, paid))

        conn.commit()

        return jsonify({
            "success": True,
            "fare": fare,
            "paid": paid,
            "due": due,
            "status": status
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "success": False,
            "message": "Exit failed",
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()
