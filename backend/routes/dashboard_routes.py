from flask import Blueprint
from controllers.dashboard_controller import get_dashboard, get_journey_history
from middleware.auth import token_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
@token_required
def dashboard_route(user_id):
    return get_dashboard(user_id)

@dashboard_bp.route("/dashboard/journeys", methods=["GET"])
@token_required
def dashboard_journeys(user_id):
    return get_journey_history(user_id)
