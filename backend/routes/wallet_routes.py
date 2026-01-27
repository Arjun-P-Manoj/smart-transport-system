from flask import Blueprint
from controllers.wallet_controller import wallet_recharge

wallet_bp = Blueprint("wallet", __name__)

@wallet_bp.route("/wallet/recharge", methods=["POST"])
def recharge_wallet():
    return wallet_recharge()
