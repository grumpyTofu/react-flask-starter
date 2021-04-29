from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Globally accessible libraries
db = SQLAlchemy()
login_manager = LoginManager()

def init_app():
    """Initialize the core application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('config.Config')

    # Initialize Plugins
    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        # Include our Routes
        from app.api.todo import todo_bp

        # Register Blueprints
        app.register_blueprint(todo_bp)

        # Create Database Models
        db.create_all()

        return app