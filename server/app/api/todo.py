from flask import Blueprint, render_template, request
from flask import current_app as app
from app import db
from app.data.models import Todo
from app.utils import api_response, get_fields
import json

# Blueprint Configuration
todo_bp = Blueprint('todo', __name__)

@todo_bp.route('/getTodos')
def getTodos():
    try:
        fields = get_fields(request)
        uid = request.args['uid'] if len(request.args) > 0 and 'uid' in request.args else None
        todos = Todo.query.filter_by(uid=uid).all()
        return api_response(False, 'Todos successfully retrieved', [todo.serialize(fields) for todo in todos])
    except Exception as error:
        return api_response(True, 'Failed to get todos', str(error))


@todo_bp.route('/createTodo', methods=['POST'])
def createTodo():
    try:
        fields = get_fields(request, request.method)
        body = request.get_json()

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

        return api_response(False, 'Todo created successfully', todo.serialize(fields))
    except Exception as error:
        return api_response(True, 'Failed to create todo', str(error))

@todo_bp.route('/updateTodo/<int:id>', methods=['PATCH'])
def updateTodo(id: int):
    try:
        fields = get_fields(request, request.method)
        todo = Todo.query.get(id)
        if not todo:
            raise Exception('Object does not exist')

        body = request.get_json()
        if len(body.keys()) == 0:
            raise Exception('Update data not provided')

        if 'title' in body.keys() and getattr(todo, 'title') != body['title']:
            setattr(todo, 'title', body['title'])
        
        if 'description' in body.keys() and getattr(todo, 'description') != body['description']:
            setattr(todo, 'description', body['description'])

        if 'uid' in body.keys() and getattr(todo, 'uid') != body['uid']:
            setattr(todo, 'uid', body['uid'])
        
        db.session.commit()
        
        return api_response(False, 'Successfully updated todo', todo.serialize(fields))
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