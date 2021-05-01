from flask import Blueprint, render_template, request
from flask import current_app as app
from app import db
from app.data.models import Todo
from app.utils import api_response
import json

# Blueprint Configuration
todo_bp = Blueprint('todo', __name__)

@todo_bp.route('/getTodos')
def getTodos():
    try:
        uid = request.args['uid'] if len(request.args) > 0 and 'uid' in request.args else None
        todos = Todo.query.filter_by(uid=uid).all()
        return api_response(False, 'Todos successfully retrieved', [todo.serialize() for todo in todos])
    except Exception as error:
        return api_response(True, 'Failed to get todos', str(error))


@todo_bp.route('/createTodo', methods=['POST'])
def createTodo():
    try:
        body = json.loads(request.data)

        if 'title' not in body.keys():
            raise Exception('Required properties not specified')
        title = body['title']

        if 'description' not in body.keys():
            raise Exception('Required properties not specified')
        description = body['description']

        uid = body['uid'] if 'uid' in body.keys() else None
        
        todo = Todo(title, description, uid)
        db.session.add(todo)
        db.session.commit()

        return api_response(False, 'Todo created successfully', todo.serialize())
    except Exception as error:
        return api_response(True, 'Failed to create todo', str(error))

@todo_bp.route('/updateTodo/<int:id>', methods=['PATCH'])
def updateTodo(id: int):
    try:
        todo = Todo.query.filter_by(id=id).first()
        if not todo:
            raise Exception('Object does not exist')

        body = json.loads(request.data)

        if 'title' not in body.keys():
            raise Exception('Required properties not specified')
        title = body['title']

        if 'description' not in body.keys():
            raise Exception('Required properties not specified')
        description = body['description']

        uid = body['uid'] if 'uid' in body.keys() else None

        if title != todo.title:
            todo.title = title
        if description != todo.description:
            todo.description = description
        if uid != todo.uid:
            todo.uid = uid
        
        db.session.commit()
        
        return api_response(False, 'Successfully updated todo', todo.serialize())
    except Exception as error:
        return api_response(True, 'Failed to update todo', str(error))

@todo_bp.route('/deleteTodo/<int:id>', methods=['DELETE'])
def deleteTodo(id: int):
    try:
        todo = Todo.query.filter_by(id=id).first()
        if not todo:
            raise Exception('Object does not exist')
            
        db.session.delete(todo)
        db.session.commit()
        return api_response(False, 'Successfully deleted todo')
    except Exception as error:
        return api_response(True, 'Failed to delete todo', str(error))