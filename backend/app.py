from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
import subprocess   
import sys          
import pickle       

app = Flask(__name__)
CORS(app)

# ---------- POSTGRES CONFIG ----------
conn =psycopg2.connect(
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


# 🔹 STEP 1: USER REGISTRATION APIimport subprocess
@app.route("/register-user", methods=["POST"])
def register_user():
    data = request.json
    name = data.get("name")
    contact = data.get("contact")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    # ---------------- CHECK USER ----------------
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

    # ---------------- CAPTURE FACE ----------------
    result = subprocess.run(
        [sys.executable, "face_encode.py"],
        cwd=os.path.join(os.getcwd(), "../ml"),
        capture_output=True
    )

    if result.returncode != 0 or not result.stdout:
        conn.rollback()
        return jsonify({"error": "Face capture failed"}), 500

    embedding = pickle.loads(result.stdout)

    embedding = pickle.loads(result.stdout)

    if embedding is None or embedding.size == 0:
        conn.rollback()
        return jsonify({"error": "No face detected"}), 400

    # Convert numpy → Python list
    embedding = embedding.tolist()

    # ---------------- STORE / UPDATE FACE ----------------
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

    # ✅ COMMIT IS MANDATORY
    conn.commit()

    return jsonify({
        "message": "Registration successful",
        "user_id": user_id,
        "user_exists": user_exists,
        "face_action": face_action
    })

@app.route("/face-login", methods=["POST"])
def face_login():
    result = subprocess.run(
    [sys.executable, "face_verify.py"],
    cwd=os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml")),
    capture_output=True,
    text=True
)

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
