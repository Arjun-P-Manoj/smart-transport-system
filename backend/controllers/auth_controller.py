from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt

from utils.ml_runner import capture_face
from db.database import get_db_connection
from config.config import Config

def register_user():
    data = request.json or {}
    name = data.get("name")
    mobile = data.get("mobile")
    password = data.get("password")

    if not all([name, mobile, password]):
        return jsonify({"error": "All fields required"}), 400

    password_hash = generate_password_hash(
        password,
        method="pbkdf2:sha256",
        salt_length=16
    )

    conn = get_db_connection()
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # 1️⃣ CAPTURE FACE FIRST
        embedding = capture_face()
        if embedding is None:
            raise Exception("Face capture failed or no face detected")

        embedding = embedding.tolist()

        # 2️⃣ CREATE USER
        cur.execute("""
            INSERT INTO users (name, mobile, password_hash)
            VALUES (%s, %s, %s)
            RETURNING user_id
        """, (name, mobile, password_hash))

        user_id = cur.fetchone()[0]

        # 3️⃣ CREATE WALLET
        cur.execute("""
            INSERT INTO wallet (user_id, balance)
            VALUES (%s, %s)
        """, (user_id, 100.0))

        # 4️⃣ STORE FACE
        cur.execute("""
            INSERT INTO face_database (user_id, embedding)
            VALUES (%s, %s)
        """, (user_id, embedding))

        conn.commit()

        return jsonify({
            "message": "User + Face registered successfully",
            "user_id": user_id
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        cur.close()
        conn.close()


def login_user():
    data = request.json or {}
    mobile = data.get("mobile")
    password = data.get("password")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT user_id, name, password_hash
        FROM users WHERE mobile=%s
    """, (mobile,))

    user = cur.fetchone()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    user_id, name, password_hash = user

    if not check_password_hash(password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": user_id,
        "name": name,
        "exp": datetime.utcnow() + timedelta(hours=12)
    }, Config.SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {"user_id": user_id, "name": name, "mobile": mobile}
    })
