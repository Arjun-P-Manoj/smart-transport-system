from flask import jsonify
from db.database import get_db_connection


def _get_order_by_direction(direction):
    return "ASC" if direction == "UP" else "DESC"


# =========================
# PASSENGER HOME (BUS LIST)
# =========================
def get_passenger_buses():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT bus_id, bus_number, number_plate, route_id,
               current_stop_id, direction
        FROM bus
    """)
    buses = cur.fetchall()

    response = []

    for bus in buses:
        bus_id, bus_number, number_plate, route_id, current_stop_id, direction = bus
        order = _get_order_by_direction(direction)

        # Get ordered route stops (DIRECTION AWARE)
        cur.execute(f"""
            SELECT stop_id, stop_name
            FROM route_stops
            WHERE route_id = %s
            ORDER BY stop_order {order}
        """, (route_id,))
        stops = cur.fetchall()

        if not stops:
            continue

        from_stop = stops[0][1]
        to_stop = stops[-1][1]

        # Current stop
        cur.execute("""
            SELECT stop_name FROM route_stops WHERE stop_id = %s
        """, (current_stop_id,))
        row = cur.fetchone()
        current_stop = row[0] if row else None

        # Next stop
        next_stop = None
        for i in range(len(stops)):
            if stops[i][0] == current_stop_id and i + 1 < len(stops):
                next_stop = stops[i + 1][1]
                break

        response.append({
            "bus_id": bus_id,
            "bus_number": bus_number,
            "number_plate": number_plate,
            "from_stop": from_stop,
            "to_stop": to_stop,
            "current_stop": current_stop,
            "next_stop": next_stop,
            "direction": direction,
            "status": "LIVE"
        })

    cur.close()
    conn.close()
    return jsonify(response)


# =========================
# PASSENGER BUS DETAIL
# =========================
def get_passenger_bus_detail(bus_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT bus_id, bus_number, route_id, current_stop_id, direction
        FROM bus WHERE bus_id = %s
    """, (bus_id,))
    bus = cur.fetchone()

    if not bus:
        return jsonify({"message": "Bus not found"}), 404

    bus_id, bus_number, route_id, current_stop_id, direction = bus
    order = _get_order_by_direction(direction)

    # Route (DIRECTION AWARE)
    cur.execute(f"""
        SELECT stop_id, stop_name,
               CASE WHEN stop_id = %s THEN TRUE ELSE FALSE END AS is_current
        FROM route_stops
        WHERE route_id = %s
        ORDER BY stop_order {order}
    """, (current_stop_id, route_id))

    route = [
        {
            "stop_id": r[0],
            "stop_name": r[1],
            "is_current": r[2]
        }
        for r in cur.fetchall()
    ]

    cur.close()
    conn.close()

    return jsonify({
        "bus_id": bus_id,
        "bus_number": bus_number,
        "direction": direction,
        "route": route
    })
