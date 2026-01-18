from flask import Blueprint, request, jsonify
from middleware.auth import token_required
from db.database import get_db_connection

from controllers.auth_controller import register_user, login_user

auth_bp = Blueprint("auth", __name__)

# ---------------- REGISTER ----------------
@auth_bp.route("/register", methods=["POST"])
def register_route():
    return register_user()

# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login_route():
    return login_user()

# ---------------- DASHBOARD ----------------
@auth_bp.route("/dashboard", methods=["GET"])
@token_required
def dashboard_route():
    user_id = request.user["user_id"]

    conn = get_db_connection()
    cur = conn.cursor()

    # user
    cur.execute(
        "SELECT name, mobile FROM users WHERE user_id=%s",
        (user_id,)
    )
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # wallet
    cur.execute(
        "SELECT balance FROM wallet WHERE user_id=%s",
        (user_id,)
    )
    wallet = cur.fetchone()

    # face
    cur.execute(
        "SELECT 1 FROM face_database WHERE user_id=%s",
        (user_id,)
    )
    face_registered = cur.fetchone() is not None

    return jsonify({
        "user_id": user_id,
        "name": user[0],
        "mobile": user[1],
        "wallet_balance": wallet[0] if wallet else 0,
        "face_registered": face_registered
    })
