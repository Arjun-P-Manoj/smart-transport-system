from flask import jsonify, request
from db.database import get_db_connection
from utils.ml_runner import recognize_face

MIN_BALANCE = 50


def face_passenger_entry():
    """
    Face-based passenger entry logic

    Flow:
    1. Face verification (registered or not)
    2. Wallet balance check (>= 50)
    3. Check if already inside bus
    4. Get current stop from bus table
    5. Insert journey entry
    """

    # 1️⃣ FACE VERIFICATION (registration check)
    user_id = recognize_face()

    if not user_id:
        return jsonify({
            "success": False,
            "message": "Please register to use our service"
        }), 401

    conn = get_db_connection()
    cur = conn.cursor()

    # 2️⃣ WALLET BALANCE CHECK
    cur.execute(
        "SELECT balance FROM wallet WHERE user_id = %s",
        (user_id,)
    )
    wallet = cur.fetchone()

    if not wallet:
        cur.close()
        conn.close()
        return jsonify({
            "success": False,
            "message": "Wallet not found. Please register."
        }), 403

    balance = float(wallet[0])

    if balance < MIN_BALANCE:
        cur.close()
        conn.close()
        return jsonify({
            "success": False,
            "message": "Insufficient balance. Minimum ₹50 required"
        }), 403

    # 3️⃣ CHECK IF PASSENGER IS ALREADY INSIDE BUS
    cur.execute("""
        SELECT journey_id
        FROM journey
        WHERE user_id = %s
        AND exit_time IS NULL
    """, (user_id,))

    if cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({
            "success": True,
            "message": "Passenger already inside bus"
        })

    # 4️⃣ GET BUS CURRENT STOP
    bus_id = request.json.get("bus_id")

    if not bus_id:
        cur.close()
        conn.close()
        return jsonify({
            "success": False,
            "message": "bus_id is required"
        }), 400

    cur.execute(
        "SELECT current_stop_id FROM bus WHERE bus_id = %s",
        (bus_id,)
    )
    row = cur.fetchone()

    if not row or not row[0]:
        cur.close()
        conn.close()
        return jsonify({
            "success": False,
            "message": "Current stop not available for this bus"
        }), 400

    entry_stop_id = row[0]

    # 5️⃣ MARK PASSENGER ENTRY
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
    cur.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Passenger entry recorded",
        "user_id": user_id,
        "entry_stop_id": entry_stop_id
    })
