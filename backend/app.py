from flask import Flask
from flask_cors import CORS
from config.config import Config

from routes.auth_routes import auth_bp
from routes.face_routes import face_bp
from routes.journey_routes import journey_bp
from routes.driver_routes import driver_bp
from routes.passenger_routes import passenger_bp
from routes.passenger_view_routes import passenger_view_bp



app = Flask(__name__)
app.config["SECRET_KEY"] = Config.SECRET_KEY

CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(face_bp)
app.register_blueprint(journey_bp)
app.register_blueprint(driver_bp, url_prefix="/api")
app.register_blueprint(passenger_bp, url_prefix="/api")
app.register_blueprint(passenger_view_bp, url_prefix="/api")



@app.route("/")
def home():
    return {"message": "Backend running"}
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)

