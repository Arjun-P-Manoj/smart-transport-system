from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
import subprocess
import sys
import pickle

app = Flask(__name__)
CORS(app)

# ---------- PATH CONFIG (IMPORTANT) ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.abspath(os.path.join(BASE_DIR, "../ml"))
# --------------------------------------------

# ---------- POSTGRES CONFIG ----------
conn = psycopg2.connect(
    dbname="smart_transport",
    user="arjunpmanoj",
    host="localhost"
)
conn.autocommit = True
cursor = conn.cursor()
# ------------------------------------

@app.route("/")
def home():
    return jsonify({"message": "Backend running"})


# 🔹 USER REGISTRATION
@app.route("/register-user", methods=["POST"])
def register_user():
    data = request.json or {}
    name = data.get("name")
    contact = data.get("contact")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    # ---------- CHECK / CREATE USER ----------
    cursor.execute(
        "SELECT user_id FROM users WHERE name=%s",
        (name,)
    )
    user = cursor.fetchone()

    if user:
        user_id = user[0]
        user_exists = True
    else:
        user_exists = False

        cursor.execute(
            "INSERT INTO users (name, contact) VALUES (%s, %s) RETURNING user_id",
            (name, contact)
        )
        user_id = cursor.fetchone()[0]

        cursor.execute(
            "INSERT INTO wallet (user_id, balance) VALUES (%s, %s)",
            (user_id, 100.00)
        )

    # ---------- FACE CAPTURE ----------
    result = subprocess.run(
        [sys.executable, "face_encode.py"],
        cwd=ML_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    if result.returncode != 0 or not result.stdout:
        print("Face encode error:", result.stderr.decode())
        conn.rollback()
        return jsonify({"error": "Face capture failed"}), 500

    try:
        embedding = pickle.loads(result.stdout)
    except Exception as e:
        print("Pickle load error:", e)
        conn.rollback()
        return jsonify({"error": "Invalid face data"}), 500

    if embedding is None:
        conn.rollback()
        return jsonify({"error": "No face detected"}), 400

    # numpy → list (Postgres compatible)
    embedding = embedding.tolist()

    # ---------- STORE / UPDATE FACE ----------
    cursor.execute(
        "SELECT face_id FROM face_database WHERE user_id=%s",
        (user_id,)
    )
    face = cursor.fetchone()

    if face:
        cursor.execute(
            "UPDATE face_database SET embedding=%s WHERE user_id=%s",
            (embedding, user_id)
        )
        face_action = "updated"
    else:
        cursor.execute(
            "INSERT INTO face_database (user_id, embedding) VALUES (%s, %s)",
            (user_id, embedding)
        )
        face_action = "stored"

    conn.commit()

    return jsonify({
        "message": "Registration successful",
        "user_id": user_id,
        "user_exists": user_exists,
        "face_action": face_action
    })


# 🔹 FACE LOGIN
@app.route("/face-login", methods=["POST"])
def face_login():
    result = subprocess.run(
        [sys.executable, "face_verify.py"],
        cwd=ML_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if result.returncode != 0:
        print("Face verify error:", result.stderr)
        return jsonify({
            "success": False,
            "message": "Face verification failed"
        }), 500

    output = result.stdout.strip()

    if "ACCESS GRANTED" in output:
        return jsonify({
            "success": True,
            "message": output
        })

    return jsonify({
        "success": False,
        "message": "Face not recognized"
    }), 401


if __name__ == "__main__":
    app.run(debug=True)
