import jwt
from flask import request, jsonify
from functools import wraps

def token_required(app):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            auth_header = request.headers.get("Authorization")

            if not auth_header:
                return jsonify({"error": "Token missing"}), 401

            try:
                token = auth_header.split(" ")[1]
                data = jwt.decode(
                    token,
                    app.config["SECRET_KEY"],
                    algorithms=["HS256"]
                )
                request.user = data
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except Exception:
                return jsonify({"error": "Invalid token"}), 401

            return f(*args, **kwargs)
        return wrapped
    return decorator
