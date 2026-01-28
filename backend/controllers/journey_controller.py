from flask import jsonify, request
from psycopg2.extras import RealDictCursor
from db.database import get_db_connection
from middleware.auth import token_required


# =========================
# START JOURNEY (LEGACY / OPTIONAL)
# =========================
def start_journey(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO journey (user_id, entry_time, status)
        VALUES (%s, NOW(), 'IN_PROGRESS')
        RETURNING journey_id;
    """, (user_id,))

    journey_id = cur.fetchone()[0]
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "message": "Journey started",
        "journey_id": journey_id
    })


# =========================
# GET BUS ROUTE (PASSENGER VIEW)
# =========================
def get_bus_route(bus_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT
            rs.stop_id,
            rs.stop_name,
            CASE
                WHEN rs.stop_id = b.current_stop_id THEN true
                ELSE false
            END AS is_current
        FROM bus b
        JOIN route_stops rs ON rs.route_id = b.route_id
        WHERE b.bus_id = %s
        ORDER BY
            CASE WHEN b.direction = 'UP' THEN rs.stop_order END ASC,
            CASE WHEN b.direction = 'DOWN' THEN rs.stop_order END DESC;
    """, (bus_id,))

    stops = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(stops)


# =========================
# GET USER JOURNEY HISTORY (DASHBOARD)
# =========================
@token_required
def get_user_journeys():
    """
    Returns journey history for logged-in passenger
    Used in Passenger Dashboard -> Journey tab
    """

    user_id = request.user["user_id"]

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            b.bus_number,
            rs_entry.stop_name AS source,
            rs_exit.stop_name AS destination,
            j.entry_time::date AS journey_date,
            COALESCE(fr.fare_amount, 0) AS fare
        FROM journey j
        JOIN bus b ON b.bus_id = j.bus_id
        JOIN route_stops rs_entry ON rs_entry.stop_id = j.entry_stop_id
        JOIN route_stops rs_exit ON rs_exit.stop_id = j.exit_stop_id
        LEFT JOIN fare_record fr ON fr.journey_id = j.journey_id
        WHERE j.user_id = %s
          AND j.exit_time IS NOT NULL
        ORDER BY j.journey_id DESC
    """, (user_id,))

    journeys = []
    for row in cur.fetchall():
        journeys.append({
            "bus": row[0],
            "source": row[1],
            "destination": row[2],
            "date": str(row[3]),
            "fare": float(row[4])
        })

    cur.close()
    conn.close()

    return jsonify(journeys)
