from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import re

from utils.email_otp_service import send_email_otp, verify_email_otp
from utils.ml_runner import capture_face
from db.database import get_db_connection
from config.config import Config


# =============================
# SEND EMAIL OTP
# =============================
def send_email_otp_api():

    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    send_email_otp(email)

    return jsonify({
        "message": "OTP sent to email"
    })


# =============================
# VERIFY EMAIL OTP
# =============================
def verify_email_otp_api():

    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    if not verify_email_otp(email, otp):
        return jsonify({"error": "Invalid or expired OTP"}), 400

    return jsonify({
        "message": "OTP verified"
    })


# =============================
# REGISTER USER (AFTER OTP)
# =============================
def register_user():

    data = request.json or {}

    name = data.get("name")
    mobile = data.get("mobile")
    password = data.get("password")
    email = data.get("email")
    aadhar = data.get("aadhar")

    if not all([name, mobile, password, email, aadhar]):
        return jsonify({"error": "All fields required"}), 400

    # Aadhaar validation
    if not re.fullmatch(r"\d{12}", aadhar):
        return jsonify({"error": "Aadhaar must be exactly 12 digits"}), 400

    # Mobile validation
    if not re.fullmatch(r"[6-9]\d{9}", mobile):
        return jsonify({"error": "Invalid mobile number"}), 400

    password_hash = generate_password_hash(
        password,
        method="pbkdf2:sha256",
        salt_length=16
    )

    conn = get_db_connection()
    conn.autocommit = False
    cur = conn.cursor()

    try:

        # -------------------------
        # Duplicate checks
        # -------------------------

        cur.execute("SELECT 1 FROM users WHERE mobile=%s", (mobile,))
        if cur.fetchone():
            return jsonify({"error": "Mobile number already registered"}), 400

        cur.execute("SELECT 1 FROM users WHERE email=%s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email already registered"}), 400

        cur.execute("SELECT 1 FROM users WHERE aadhar=%s", (aadhar,))
        if cur.fetchone():
            return jsonify({"error": "Aadhaar already registered"}), 400

        # -------------------------
        # FACE CAPTURE
        # -------------------------
        embedding = capture_face()

        if embedding is None:
            raise Exception("Face capture failed")

        embedding = embedding.tolist()

        # -------------------------
        # CREATE USER
        # -------------------------
        cur.execute("""
            INSERT INTO users (name, mobile, email, aadhar, password_hash)
            VALUES (%s,%s,%s,%s,%s)
            RETURNING user_id
        """, (name, mobile, email, aadhar, password_hash))

        user_id = cur.fetchone()[0]

        # -------------------------
        # CREATE WALLET
        # -------------------------
        cur.execute("""
            INSERT INTO wallet (user_id, balance)
            VALUES (%s,%s)
        """, (user_id, 100.0))

        # -------------------------
        # STORE FACE
        # -------------------------
        cur.execute("""
            INSERT INTO face_database (user_id, embedding)
            VALUES (%s,%s)
        """, (user_id, embedding))

        conn.commit()

        return jsonify({
            "message": "User registered successfully",
            "user_id": user_id
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        cur.close()
        conn.close()


# =============================
# LOGIN USER
# =============================
def login_user():

    data = request.json or {}

    mobile = data.get("mobile")
    password = data.get("password")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT user_id, name, password_hash
        FROM users
        WHERE mobile=%s
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
        "user": {
            "user_id": user_id,
            "name": name,
            "mobile": mobile
        }
    })