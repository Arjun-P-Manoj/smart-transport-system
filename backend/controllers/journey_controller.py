from flask import jsonify
from psycopg2.extras import RealDictCursor
from db.database import get_db_connection


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
