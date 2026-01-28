from flask import Blueprint
from controllers.wallet_controller import wallet_recharge, get_wallet_transactions
from middleware.auth import token_required

wallet_bp = Blueprint("wallet", __name__)

@wallet_bp.route("/wallet/recharge", methods=["POST"])
@token_required
def recharge(user_id):
    return wallet_recharge(user_id)

@wallet_bp.route("/wallet/transactions", methods=["GET"])
@token_required
def wallet_transactions(user_id):
    return get_wallet_transactions(user_id)
