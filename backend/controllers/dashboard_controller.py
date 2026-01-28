from flask import jsonify
from psycopg2.extras import RealDictCursor
from db.database import get_db_connection


# =======================
# DASHBOARD MAIN DATA
# =======================
def get_dashboard(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    # User info
    cur.execute(
        "SELECT name FROM users WHERE user_id = %s",
        (user_id,)
    )
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Wallet
    cur.execute(
        "SELECT balance FROM wallet WHERE user_id = %s",
        (user_id,)
    )
    wallet = cur.fetchone()

    # Face status
    cur.execute(
        "SELECT 1 FROM face_database WHERE user_id = %s",
        (user_id,)
    )
    face_registered = cur.fetchone() is not None

# =======================
# Pending Due (LATEST)
# =======================
    cur.execute("""
        SELECT
            fr.due_amount,
            rs1.stop_name AS source,
            rs2.stop_name AS destination
        FROM journey j
        JOIN fare_record fr ON fr.journey_id = j.journey_id
        JOIN route_stops rs1 ON rs1.stop_id = j.entry_stop_id
        JOIN route_stops rs2 ON rs2.stop_id = j.exit_stop_id
        WHERE j.user_id = %s
        AND j.status = 'COMPLETED_WITH_DUE'
        AND fr.due_amount > 0
        ORDER BY j.journey_id DESC
        LIMIT 1
    """, (user_id,))

    due_row = cur.fetchone()


    cur.close()
    conn.close()

    return jsonify({
    "name": user[0],
    "wallet_balance": wallet[0] if wallet else 0,
    "face_registered": face_registered,
    "due": {
        "amount": float(due_row[0]),
        "source": due_row[1],
        "destination": due_row[2]
    } if due_row else None
})


# =======================
# JOURNEY HISTORY
# =======================
def get_journey_history(user_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT
            b.bus_number AS bus,
            es.stop_name AS source,
            xs.stop_name AS destination,
            j.created_at::date AS date,
            fr.fare_amount AS fare
        FROM journey j
        JOIN bus b ON b.bus_id = j.bus_id
        JOIN route_stops es ON es.stop_id = j.entry_stop_id
        JOIN route_stops xs ON xs.stop_id = j.exit_stop_id
        JOIN fare_record fr ON fr.journey_id = j.journey_id
        WHERE j.user_id = %s
          AND j.status IN ('COMPLETED', 'COMPLETED_WITH_DUE')
        ORDER BY j.journey_id DESC
    """, (user_id,))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(rows)
