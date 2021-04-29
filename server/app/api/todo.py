from flask import Blueprint, render_template
from flask import current_app as app


# Blueprint Configuration
todo_bp = Blueprint('todo', __name__)


@todo_bp.route('/getTodos', methods=['GET'])
def getTodos():
    return "Many Todos"