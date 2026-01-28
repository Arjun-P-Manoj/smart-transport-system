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
