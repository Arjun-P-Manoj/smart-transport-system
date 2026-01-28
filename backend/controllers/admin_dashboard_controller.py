from flask import Blueprint, request, jsonify
from db.database import get_db_connection

# ================= DASHBOARD STATS =================
def get_admin_dashboard_stats():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM users")
    total_users = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM bus WHERE status = 'ACTIVE'")
    active_buses = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM journey
        WHERE DATE(created_at) = CURRENT_DATE
    """)
    journeys_today = cur.fetchone()[0]

    cur.execute("""
        SELECT COALESCE(SUM(fare_amount), 0)
        FROM fare_record
        WHERE DATE(timestamp) = CURRENT_DATE
    """)
    fare_today = cur.fetchone()[0]

    cur.close()
    conn.close()

    return jsonify({
        "total_users": total_users,
        "active_buses": active_buses,
        "journeys_today": journeys_today,
        "fare_today": float(fare_today)
    })


# ================= ADMIN USERS =================
from flask import jsonify, request
from db.database import get_db_connection

def get_admin_users():
    conn = get_db_connection()
    cur = conn.cursor()

    search = request.args.get("search")
    face = request.args.get("face")
    wallet = request.args.get("wallet")
    due = request.args.get("due")  # ✅ NEW

    query = """
        SELECT
            u.user_id,
            u.name,
            u.mobile,
            COALESCE(w.balance, 0) AS wallet_balance,
            CASE
                WHEN f.user_id IS NOT NULL THEN TRUE
                ELSE FALSE
            END AS face_registered,
            COALESCE(d.total_due, 0) AS due_amount
        FROM users u
        LEFT JOIN wallet w ON u.user_id = w.user_id
        LEFT JOIN face_database f ON u.user_id = f.user_id
        LEFT JOIN (
            SELECT
                j.user_id,
                SUM(fr.due_amount) AS total_due
            FROM fare_record fr
            JOIN journey j ON fr.journey_id = j.journey_id
            WHERE fr.due_amount > 0
            GROUP BY j.user_id
        ) d ON u.user_id = d.user_id
        WHERE 1=1
    """

    params = []

    # 🔍 Search
    if search:
        query += " AND (u.name ILIKE %s OR u.mobile ILIKE %s)"
        params.extend([f"%{search}%", f"%{search}%"])

    # 👤 Face filters
    if face == "yes":
        query += " AND f.user_id IS NOT NULL"

    if face == "no":
        query += " AND f.user_id IS NULL"

    # 💰 Wallet filters
    if wallet == "zero":
        query += " AND COALESCE(w.balance, 0) = 0"

    if wallet == "nonzero":
        query += " AND COALESCE(w.balance, 0) > 0"

    # 🚨 Due filters (NEW)
    if due == "yes":
        query += " AND COALESCE(d.total_due, 0) > 0"

    if due == "no":
        query += " AND COALESCE(d.total_due, 0) = 0"

    query += " ORDER BY u.created_at DESC"

    cur.execute(query, params)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    users = []
    for r in rows:
        due_amount = float(r[5])
        users.append({
            "user_id": r[0],
            "name": r[1],
            "mobile": r[2],
            "wallet_balance": float(r[3]),
            "face_registered": r[4],
            "due_amount": due_amount,
            "due_status": "PENDING" if due_amount > 0 else "CLEAR"
        })

    return jsonify(users)


def get_admin_journeys():
    conn = get_db_connection()
    cur = conn.cursor()

    from_date = request.args.get("from_date")
    to_date = request.args.get("to_date")
    user_id = request.args.get("user_id")
    bus_id = request.args.get("bus_id")
    status = request.args.get("status")

    query = """
        SELECT
            j.journey_id,
            u.name,
            b.bus_number,
            rs1.stop_name AS entry_stop,
            rs2.stop_name AS exit_stop,
            j.status,
            j.distance_km,
            fr.fare_amount,
            j.created_at
        FROM journey j
        JOIN users u ON j.user_id = u.user_id
        JOIN bus b ON j.bus_id = b.bus_id
        LEFT JOIN route_stops rs1 ON j.entry_stop_id = rs1.stop_id
        LEFT JOIN route_stops rs2 ON j.exit_stop_id = rs2.stop_id
        LEFT JOIN fare_record fr ON j.journey_id = fr.journey_id
        WHERE 1=1
    """

    params = []

    if from_date:
        query += " AND DATE(j.created_at) >= %s"
        params.append(from_date)

    if to_date:
        query += " AND DATE(j.created_at) <= %s"
        params.append(to_date)

    if user_id:
        query += " AND j.user_id = %s"
        params.append(user_id)

    if bus_id:
        query += " AND j.bus_id = %s"
        params.append(bus_id)

    if status:
        query += " AND j.status = %s"
        params.append(status)

    query += " ORDER BY j.created_at DESC"

    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    journeys = []
    for r in rows:
        journeys.append({
            "journey_id": r[0],
            "user_name": r[1],
            "bus_number": r[2],
            "entry_stop": r[3],
            "exit_stop": r[4],
            "status": r[5],
            "distance_km": float(r[6]) if r[6] else 0,
            "fare_amount": float(r[7]) if r[7] else 0,
            "created_at": r[8].strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(journeys)

def get_admin_wallets():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            u.user_id,
            u.name,
            u.mobile,
            COALESCE(w.balance, 0) AS balance
        FROM users u
        LEFT JOIN wallet w ON u.user_id = w.user_id
        ORDER BY u.created_at DESC
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    wallets = []
    for r in rows:
        wallets.append({
            "user_id": r[0],
            "name": r[1],
            "mobile": r[2],
            "balance": float(r[3])
        })

    return jsonify(wallets)

def get_admin_transactions():
    conn = get_db_connection()
    cur = conn.cursor()

    search = request.args.get("search")
    tx_type = request.args.get("type")
    reason = request.args.get("reason")
    from_date = request.args.get("from_date")
    to_date = request.args.get("to_date")

    query = """
        SELECT
            t.transaction_id,
            u.name,
            t.amount,
            t.type,
            t.reason,
            t.created_at
        FROM transactions t
        JOIN wallet w ON t.wallet_id = w.wallet_id
        JOIN users u ON w.user_id = u.user_id
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND u.name ILIKE %s"
        params.append(f"%{search}%")

    if tx_type:
        query += " AND t.type = %s"
        params.append(tx_type)

    if reason:
        query += " AND t.reason = %s"
        params.append(reason)


    if from_date:
        query += " AND DATE(t.created_at) >= %s"
        params.append(from_date)

    if to_date:
        query += " AND DATE(t.created_at) <= %s"
        params.append(to_date)

    query += " ORDER BY t.created_at DESC"

    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    transactions = []
    for r in rows:
        transactions.append({
            "transaction_id": r[0],
            "user_name": r[1],
            "amount": float(r[2]),
            "type": r[3],
            "reason": r[4],
            "created_at": r[5].strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(transactions)

def get_admin_buses():
    conn = get_db_connection()
    cur = conn.cursor()

    status = request.args.get("status")
    direction = request.args.get("direction")
    route_id = request.args.get("route_id")
    search = request.args.get("search")

    query = """
        SELECT
            b.bus_id,
            b.bus_number,
            b.number_plate,
            r.route_name,
            rs.stop_name AS current_stop,
            b.direction,
            b.status
        FROM bus b
        LEFT JOIN route r ON b.route_id = r.route_id
        LEFT JOIN route_stops rs ON b.current_stop_id = rs.stop_id
        WHERE 1=1
    """
    params = []

    if status:
        query += " AND b.status = %s"
        params.append(status)

    if direction:
        query += " AND b.direction = %s"
        params.append(direction)

    if route_id:
        query += " AND b.route_id = %s"
        params.append(route_id)

    if search:
        query += " AND (b.bus_number ILIKE %s OR b.number_plate ILIKE %s)"
        params.extend([f"%{search}%", f"%{search}%"])

    query += " ORDER BY b.bus_id DESC"

    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    buses = []
    for r in rows:
        buses.append({
            "bus_id": r[0],
            "bus_number": r[1],
            "number_plate": r[2],
            "route_name": r[3],
            "current_stop": r[4],
            "direction": r[5],
            "status": r[6]
        })

    return jsonify(buses)

def get_bus_route_stops(bus_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            rs.stop_id,
            rs.stop_name,
            rs.stop_order,
            rs.distance_km
        FROM bus b
        JOIN route r ON b.route_id = r.route_id
        JOIN route_stops rs ON rs.route_id = r.route_id
        WHERE b.bus_id = %s
        ORDER BY rs.stop_order ASC
    """, (bus_id,))

    rows = cur.fetchall()

    stops = []
    for r in rows:
        stops.append({
            "stop_id": r[0],
            "stop_name": r[1],
            "stop_order": r[2],
            "distance_km": r[3],
        })

    return jsonify(stops)
    
def get_admin_revenue_chart():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            d::date AS day,
            COALESCE(SUM(fr.fare_amount), 0) AS total
        FROM generate_series(
            CURRENT_DATE - INTERVAL '6 days',
            CURRENT_DATE,
            INTERVAL '1 day'
        ) d
        LEFT JOIN fare_record fr
            ON DATE(fr.timestamp) = d::date
        GROUP BY d
        ORDER BY d;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    data = []
    for r in rows:
        data.append({
            "date": r[0].strftime("%d %b"),
            "amount": float(r[1])
        })

    return jsonify(data)


def get_admin_journey_chart():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            d::date AS day,
            COALESCE(COUNT(j.journey_id), 0) AS journeys
        FROM generate_series(
            CURRENT_DATE - INTERVAL '6 days',
            CURRENT_DATE,
            INTERVAL '1 day'
        ) d
        LEFT JOIN journey j
            ON DATE(j.created_at) = d::date
        GROUP BY d
        ORDER BY d;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    data = []
    for r in rows:
        data.append({
            "date": r[0].strftime("%d %b"),
            "count": r[1]
        })

    return jsonify(data)

def admin_global_search():
    conn = get_db_connection()
    cur = conn.cursor()

    q = request.args.get("q", "").strip()

    if not q:
        return jsonify([])

    cur.execute("""
        (
            SELECT
                'user' AS type,
                u.user_id AS id,
                u.name AS title,
                u.mobile AS subtitle
            FROM users u
            WHERE u.name ILIKE %s OR u.mobile ILIKE %s
            LIMIT 5
        )
        UNION ALL
        (
            SELECT
                'bus' AS type,
                b.bus_id AS id,
                b.bus_number AS title,
                b.number_plate AS subtitle
            FROM bus b
            WHERE b.bus_number ILIKE %s OR b.number_plate ILIKE %s
            LIMIT 5
        )
        UNION ALL
        (
            SELECT
                'journey' AS type,
                j.journey_id AS id,
                u.name AS title,
                b.bus_number AS subtitle
            FROM journey j
            JOIN users u ON j.user_id = u.user_id
            JOIN bus b ON j.bus_id = b.bus_id
            WHERE u.name ILIKE %s OR b.bus_number ILIKE %s
            LIMIT 5
        )
    """, (
        f"%{q}%", f"%{q}%",
        f"%{q}%", f"%{q}%",
        f"%{q}%", f"%{q}%"
    ))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "type": r[0],
            "id": r[1],
            "title": r[2],
            "subtitle": r[3]
        })

    return jsonify(results)

def create_route():
    data = request.json
    route_name = data.get("route_name")

    if not route_name:
        return jsonify({"error": "route_name is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO route (route_name) VALUES (%s) RETURNING route_id",
        (route_name,)
    )

    route_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "message": "Route created",
        "route_id": route_id
    }), 201


def create_bus():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO bus (
            bus_number,
            number_plate,
            route_id,
            current_stop_id,
            direction,
            status
        )
        VALUES (%s, %s, NULL, NULL, %s, 'INACTIVE')
        RETURNING bus_id
    """, (
        data["bus_number"],
        data["number_plate"],
        data["direction"]
    ))

    bus_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "message": "Bus created (route not assigned yet)",
        "bus_id": bus_id
    }), 201

def add_route_stops(route_id):
    data = request.json
    stops = data.get("stops")

    if not stops or not isinstance(stops, list):
        return jsonify({"error": "stops array is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 1️⃣ Remove existing stops for this route (re-save safely)
        cur.execute(
            "DELETE FROM route_stops WHERE route_id = %s",
            (route_id,)
        )

        # 2️⃣ Insert new stops (stop_id is AUTO-GENERATED by DB)
        for s in stops:
            if not all(k in s for k in ("stop_name", "stop_order", "distance_km")):
                conn.rollback()
                return jsonify({"error": "Invalid stop format"}), 400

            cur.execute("""
                INSERT INTO route_stops (
                    route_id,
                    stop_name,
                    stop_order,
                    distance_km
                )
                VALUES (%s, %s, %s, %s)
            """, (
                route_id,
                s["stop_name"],
                s["stop_order"],
                s["distance_km"]
            ))

        # 3️⃣ Get FIRST stop (by order) → becomes current stop
        cur.execute("""
            SELECT stop_id
            FROM route_stops
            WHERE route_id = %s
            ORDER BY stop_order ASC
            LIMIT 1
        """, (route_id,))

        row = cur.fetchone()
        if not row:
            conn.rollback()
            return jsonify({"error": "No stops found after insert"}), 400

        first_stop_id = row[0]

        # 4️⃣ Update ALL buses using this route
        cur.execute("""
            UPDATE bus
            SET current_stop_id = %s
            WHERE route_id = %s
        """, (first_stop_id, route_id))

        conn.commit()

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()

    return jsonify({
        "message": "Stops added successfully",
        "current_stop_id": first_stop_id
    }), 200



def activate_bus(bus_id):
    conn = get_db_connection()
    cur = conn.cursor()

    # Get route of bus
    cur.execute("""
        SELECT route_id FROM bus WHERE bus_id = %s
    """, (bus_id,))
    row = cur.fetchone()

    if not row or not row[0]:
        return jsonify({"error": "Bus has no route assigned"}), 400

    route_id = row[0]

    # Get first stop
    cur.execute("""
        SELECT stop_id
        FROM route_stops
        WHERE route_id = %s
        ORDER BY stop_order ASC
        LIMIT 1
    """, (route_id,))
    stop = cur.fetchone()

    if not stop:
        return jsonify({"error": "Route has no stops"}), 400

    first_stop_id = stop[0]

    # Activate bus
    cur.execute("""
        UPDATE bus
        SET current_stop_id = %s,
            status = 'ACTIVE'
        WHERE bus_id = %s
    """, (first_stop_id, bus_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "message": "Bus activated",
        "current_stop_id": first_stop_id
    })
from flask import request, jsonify

def assign_route_to_bus(bus_id):
    # ✅ Handle preflight safely
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json(silent=True)
    if not data or "route_id" not in data:
        return jsonify({"error": "route_id required"}), 400

    route_id = data["route_id"]

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE bus
        SET route_id = %s
        WHERE bus_id = %s
    """, (route_id, bus_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Route assigned to bus"}), 200


def get_admin_routes():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT route_id, route_name
        FROM route
        ORDER BY route_id
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {
            "route_id": r[0],
            "route_name": r[1]
        }
        for r in rows
    ])
