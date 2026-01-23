from flask import jsonify
from db.database import get_db_connection
from psycopg2.extras import RealDictCursor


# =========================
# GET ALL BUSES (DRIVER UI)
# =========================
def get_all_buses():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT 
            b.bus_id,
            b.bus_number,
            b.number_plate,
            r.route_name,
            rs.stop_name AS current_stop,
            rs.distance_km AS current_distance_km
        FROM bus b
        JOIN route r ON b.route_id = r.route_id
        LEFT JOIN route_stops rs ON b.current_stop_id = rs.stop_id;
    """)

    buses = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(buses)



# =========================
# MOVE TO NEXT STOP (UP/DOWN)
# =========================
def move_to_next_stop(bus_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE bus
        SET current_stop_id = COALESCE(
            (
                SELECT rs_next.stop_id
                FROM route_stops rs_current
                JOIN route_stops rs_next
                  ON rs_next.route_id = rs_current.route_id
                 AND (
                      (SELECT direction FROM bus WHERE bus_id = %s) = 'UP'
                      AND rs_next.stop_order = rs_current.stop_order + 1
                   OR
                      (SELECT direction FROM bus WHERE bus_id = %s) = 'DOWN'
                      AND rs_next.stop_order = rs_current.stop_order - 1
                 )
                WHERE rs_current.stop_id = (
                    SELECT current_stop_id FROM bus WHERE bus_id = %s
                )
            ),
            current_stop_id
        )
        WHERE bus_id = %s;
    """, (bus_id, bus_id, bus_id, bus_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Bus moved to next stop"})


# =========================
# RESET ROUTE (REVERSE DIRECTION)
# =========================
def reset_route(bus_id):
    conn = get_db_connection()
    cur = conn.cursor()

    # Flip direction
    cur.execute("""
        UPDATE bus
        SET direction = CASE
            WHEN direction = 'UP' THEN 'DOWN'
            ELSE 'UP'
        END
        WHERE bus_id = %s;
    """, (bus_id,))

    # Set current stop based on new direction
    cur.execute("""
        UPDATE bus
        SET current_stop_id = (
            SELECT stop_id
            FROM route_stops
            WHERE route_id = (
                SELECT route_id FROM bus WHERE bus_id = %s
            )
            ORDER BY
                CASE
                    WHEN (SELECT direction FROM bus WHERE bus_id = %s) = 'UP'
                    THEN stop_order
                END ASC,
                CASE
                    WHEN (SELECT direction FROM bus WHERE bus_id = %s) = 'DOWN'
                    THEN stop_order
                END DESC
            LIMIT 1
        )
        WHERE bus_id = %s;
    """, (bus_id, bus_id, bus_id, bus_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Route direction reversed"})
