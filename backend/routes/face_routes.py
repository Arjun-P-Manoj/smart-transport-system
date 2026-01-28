from flask import Blueprint, request
from middleware.auth import token_required
from controllers.face_controller import face_login, register_face

face_bp = Blueprint("face", __name__)

@face_bp.route("/face-login", methods=["POST"])
def face_login_route():
    return face_login()

@face_bp.route("/re-register-face", methods=["POST"])
@token_required
def re_register_face_route(user_id):
    return register_face(user_id)