from flask import Blueprint
from controllers.driver_controller import (
    get_all_buses,
    move_to_next_stop,
    reset_route
)

driver_bp = Blueprint("driver", __name__)

# Get all buses
@driver_bp.route("/driver/buses", methods=["GET"])
def get_buses():
    return get_all_buses()

# Move bus to next stop
@driver_bp.route("/driver/bus/<int:bus_id>/next-stop", methods=["POST"])
def next_stop(bus_id):
    return move_to_next_stop(bus_id)

# 🔁 RESET ROUTE (THIS WAS MISSING)
@driver_bp.route("/driver/bus/<int:bus_id>/reset", methods=["POST"])
def reset_bus(bus_id):
    return reset_route(bus_id)
