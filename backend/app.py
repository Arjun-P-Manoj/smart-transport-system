from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
import subprocess
import sys
import pickle
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

# ---------------- LOAD ENV ----------------
load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# ✅ Proper CORS (includes OPTIONS)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------- DB ----------------
def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        host=os.getenv("DB_HOST")
    )

# Global connection (read-only usage)
conn = get_db_connection()
conn.autocommit = True
cursor = conn.cursor()

# ---------------- ML PATH ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.abspath(os.path.join(BASE_DIR, "../ml"))

# ---------------- OPTIONS HANDLER ----------------
@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        return "", 200

# ---------------- JWT MIDDLEWARE ----------------
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth:
            return jsonify({"error": "Token missing"}), 401
        try:
            token = auth.split(" ")[1]
            data = jwt.decode(
                token,
                app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )
            request.user = data
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return wrapper

# ---------------- HOME ----------------
@app.route("/")
def home():
    return jsonify({"message": "Backend running"})

# =================================================
# 🔹 REGISTER USER + FACE (ATOMIC / SAFE)
# =================================================
@app.route("/register", methods=["POST", "OPTIONS"])
def register():
    data = request.json or {}
    name = data.get("name")
    mobile = data.get("mobile")
    password = data.get("password")

    if not all([name, mobile, password]):
        return jsonify({"error": "All fields required"}), 400

    password_hash = generate_password_hash(
        password,
        method="pbkdf2:sha256"
    )

    # 🔑 Transaction-based connection
    conn = get_db_connection()
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # 1️⃣ Capture face FIRST
        result = subprocess.run(
            [sys.executable, "face_encode.py"],
            cwd=ML_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        if result.returncode != 0 or not result.stdout:
            raise Exception("Face capture failed")

        embedding = pickle.loads(result.stdout)
        if embedding is None:
            raise Exception("No face detected")

        embedding = embedding.tolist()

        # 2️⃣ Create user
        cur.execute("""
            INSERT INTO users (name, mobile, password_hash)
            VALUES (%s, %s, %s)
            RETURNING user_id
        """, (name, mobile, password_hash))
        user_id = cur.fetchone()[0]

        # 3️⃣ Create wallet
        cur.execute("""
            INSERT INTO wallet (user_id, balance)
            VALUES (%s, %s)
        """, (user_id, 100.0))

        # 4️⃣ Store face
        cur.execute("""
            INSERT INTO face_database (user_id, embedding)
            VALUES (%s, %s)
        """, (user_id, embedding))

        conn.commit()

        return jsonify({
            "message": "User and face registered successfully",
            "user_id": user_id
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400

    finally:
        cur.close()
        conn.close()

# =================================================
# 🔹 LOGIN (MOBILE + PASSWORD)
# =================================================
@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    mobile = data.get("mobile")
    password = data.get("password")

    if not mobile or not password:
        return jsonify({"error": "Mobile and password required"}), 400

    cursor.execute("""
        SELECT user_id, name, password_hash
        FROM users WHERE mobile=%s
    """, (mobile,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    user_id, name, password_hash = user

    if not check_password_hash(password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": user_id,
        "name": name,
        "exp": datetime.utcnow() + timedelta(hours=12)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "user_id": user_id,
            "name": name,
            "mobile": mobile
        }
    })

# =================================================
# 🔹 FACE LOGIN (ENTRY GATE)
# =================================================
@app.route("/face-login", methods=["POST"])
def face_login():
    result = subprocess.run(
        [sys.executable, "face_verify.py"],
        cwd=ML_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if "ACCESS GRANTED" in result.stdout:
        return jsonify({"success": True, "message": result.stdout})

    return jsonify({"success": False, "message": "Face not recognized"}), 401

# =================================================
# 🔹 JOURNEY ENTRY
# =================================================
@app.route("/api/entry", methods=["POST"])
@token_required
def entry_journey():
    user_id = request.user["user_id"]
    entry_gps = request.json.get("entry_gps")

    if not entry_gps:
        return jsonify({"error": "entry_gps required"}), 400

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

# =================================================
# 🔹 DASHBOARD
# =================================================
@app.route("/dashboard", methods=["GET"])
@token_required
def dashboard():
    user_id = request.user["user_id"]

    cursor.execute(
        "SELECT name, mobile FROM users WHERE user_id=%s",
        (user_id,)
    )
    user = cursor.fetchone()

    cursor.execute(
        "SELECT balance FROM wallet WHERE user_id=%s",
        (user_id,)
    )
    wallet = cursor.fetchone()

    cursor.execute(
        "SELECT 1 FROM face_database WHERE user_id=%s",
        (user_id,)
    )
    face_registered = cursor.fetchone() is not None

    return jsonify({
        "user_id": user_id,
        "name": user[0],
        "mobile": user[1],
        "wallet_balance": wallet[0] if wallet else 0,
        "face_registered": face_registered
    })

# =================================================
# 🔹 RE-REGISTER FACE (SECURE)
# =================================================
@app.route("/re-register-face", methods=["POST"])
@token_required
def re_register_face():
    user_id = request.user["user_id"]

    try:
        # 1️⃣ Capture new face
        result = subprocess.run(
            [sys.executable, "face_encode.py"],
            cwd=ML_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        if result.returncode != 0 or not result.stdout:
            return jsonify({"error": "Face capture failed"}), 400

        embedding = pickle.loads(result.stdout)
        if embedding is None:
            return jsonify({"error": "No face detected"}), 400

        embedding = embedding.tolist()

        # 2️⃣ Update face embedding
        cursor.execute("""
            UPDATE face_database
            SET embedding=%s
            WHERE user_id=%s
        """, (embedding, user_id))

        # 3️⃣ If face not exists (safety fallback)
        if cursor.rowcount == 0:
            cursor.execute("""
                INSERT INTO face_database (user_id, embedding)
                VALUES (%s, %s)
            """, (user_id, embedding))

        return jsonify({
            "success": True,
            "message": "Face re-registered successfully"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)
