from flask import Blueprint
from controllers.passenger_view_controller import (
    get_passenger_buses,
    get_passenger_bus_detail
)

passenger_view_bp = Blueprint("passenger_view", __name__)

@passenger_view_bp.route("/passenger/buses", methods=["GET"])
def passenger_buses():
    return get_passenger_buses()

@passenger_view_bp.route("/passenger/bus/<int:bus_id>", methods=["GET"])
def passenger_bus(bus_id):
    return get_passenger_bus_detail(bus_id)
