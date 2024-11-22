from flask import Flask
from flask_cors import CORS
from app.api.routes import api_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix="/api")

    return app
