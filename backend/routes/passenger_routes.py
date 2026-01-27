from flask import Blueprint
from controllers.passenger_controller import (
    face_passenger_entry,
    face_passenger_exit
)

passenger_bp = Blueprint("passenger", __name__)


@passenger_bp.route("/passenger/face-entry", methods=["POST"])
def face_entry_route():
    return face_passenger_entry()

@passenger_bp.route("/passenger/face-exit", methods=["POST"])
def face_exit_route():
    return face_passenger_exit()
