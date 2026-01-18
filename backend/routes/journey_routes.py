from flask import Blueprint, request
from middleware.auth import token_required
from controllers.journey_controller import start_journey

journey_bp = Blueprint("journey", __name__)

@journey_bp.route("/api/entry", methods=["POST"])
@token_required
def entry_journey_route():
    user_id = request.user["user_id"]
    return start_journey(user_id)
