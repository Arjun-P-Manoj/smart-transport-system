from flask import jsonify
from db.database import get_db_connection
from utils.ml_runner import capture_face, verify_face


# ---------------- FACE REGISTER / RE-REGISTER ----------------
def register_face(user_id):
    embedding = capture_face()

    if embedding is None:
        return jsonify({
            "success": False,
            "message": "Face capture failed"
        }), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO face_database (user_id, embedding)
            VALUES (%s, %s)
            ON CONFLICT (user_id)
            DO UPDATE SET embedding = EXCLUDED.embedding
        """, (user_id, embedding.tolist()))

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Face updated successfully"
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "success": False,
            "message": "Face update failed",
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# ---------------- FACE LOGIN ----------------
def face_login():
    result = verify_face()

    if not result or "USER_ID:" not in result:
        return jsonify({
            "success": False,
            "message": "Face not recognized"
        }), 401

    user_id = int(result.split("USER_ID:")[1].strip())

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "SELECT name FROM users WHERE user_id = %s",
            (user_id,)
        )
        row = cur.fetchone()

        if not row:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        return jsonify({
            "success": True,
            "user_id": user_id,
            "message": f"Welcome {row[0]}"
        })

    finally:
        cur.close()
        conn.close()