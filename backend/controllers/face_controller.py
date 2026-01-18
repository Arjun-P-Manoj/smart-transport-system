from flask import jsonify, request
from db.database import get_db_connection
from utils.ml_runner import capture_face, verify_face

def register_face(user_id):
    embedding = capture_face()
    if embedding is None:
        return jsonify({"error": "Face capture failed"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO face_database (user_id, embedding)
        VALUES (%s, %s)
        ON CONFLICT (user_id)
        DO UPDATE SET embedding=EXCLUDED.embedding
    """, (user_id, embedding.tolist()))

    return jsonify({"message": "Face registered"})

def face_login():
    result = verify_face()
    if "ACCESS GRANTED" in result:
        return jsonify({"success": True, "message": result})
    return jsonify({"success": False}), 401
