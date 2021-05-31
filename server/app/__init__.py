from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from oauthlib.oauth2 import WebApplicationClient
from flask_cors import CORS
import os

# Globally accessible libraries
db = SQLAlchemy()
jwt = JWTManager()

def init_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.DevConfig')
    #app.config.from_object('config.ShortAuthLife')

    # OAuth 2 client setup
    app.client = WebApplicationClient(app.config.get('GOOGLE_CLIENT_ID'))

    CORS(app)

    # Initialize Plugins
    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        # Include our Routes
        from app.api.todo import todo_bp
        from app.api.role import role_bp
        from app.api.user import user_bp
        from app.api.auth import auth_bp

        # Register Blueprints
        app.register_blueprint(todo_bp)
        app.register_blueprint(role_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(auth_bp)

        # Create Database Models
        db.create_all()

        return app
