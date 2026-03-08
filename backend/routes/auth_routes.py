from flask import Blueprint

from controllers.auth_controller import (
    register_user,
    login_user,
    send_email_otp_api,
    verify_email_otp_api
)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/send-email-otp", methods=["POST"])
def send_otp():
    return send_email_otp_api()


@auth_bp.route("/verify-email-otp", methods=["POST"])
def verify_otp():
    return verify_email_otp_api()


@auth_bp.route("/register", methods=["POST"])
def register():
    return register_user()


@auth_bp.route("/login", methods=["POST"])
def login():
    return login_user()