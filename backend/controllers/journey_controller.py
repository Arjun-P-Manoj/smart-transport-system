from flask import jsonify, request
from db.database import get_db_connection

def start_journey(user_id):
    entry_gps = request.json.get("entry_gps")
    if not entry_gps:
        return jsonify({"error": "entry_gps required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 1 FROM journey
        WHERE user_id=%s AND status='IN_PROGRESS'
    """, (user_id,))

    if cur.fetchone():
        return jsonify({"error": "Active journey exists"}), 409

    cur.execute("""
        INSERT INTO journey (user_id, entry_time, entry_gps, status)
        VALUES (%s, NOW(), %s, 'IN_PROGRESS')
    """, (user_id, entry_gps))

    return jsonify({"message": "Journey started"}), 201
