from flask import Blueprint, request
from middleware.auth import token_required
from controllers.journey_controller import start_journey, get_bus_route

journey_bp = Blueprint("journey", __name__)

# ✅ ENTRY JOURNEY (PROTECTED)
@journey_bp.route("/api/entry", methods=["POST"])
@token_required
def entry_journey_route():
    user_id = request.user["user_id"]
    return start_journey(user_id)

# ✅ GET BUS ROUTE (PUBLIC – FOR METRO UI)
@journey_bp.route("/api/journey/bus/<int:bus_id>/route", methods=["GET"])
def bus_route(bus_id):
    return get_bus_route(bus_id)
