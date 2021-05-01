from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from oauthlib.oauth2 import WebApplicationClient
import os

# Globally accessible libraries
db = SQLAlchemy()
login_manager = LoginManager()

def init_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.DevConfig')
    app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

    # OAuth 2 client setup
    app.client = WebApplicationClient(app.config.get('GOOGLE_CLIENT_ID'))

    login_manager.init_app(app)

    # Initialize Plugins
    db.init_app(app)

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
