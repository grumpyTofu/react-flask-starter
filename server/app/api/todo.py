from flask import Blueprint, render_template, request
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from app import db
from app.data.models import Todo
from app.utils import api_response, get_fields
import json

# Blueprint Configuration
todo_bp = Blueprint('todo', __name__)

@todo_bp.route('/getTodos')
@jwt_required(optional=True)
def getTodos():
    try:
        fields = get_fields(request)
        claims = get_jwt()
        user_id = claims['id']
        todos = Todo.query.filter((Todo.uid == None) | (Todo.uid == user_id)).all() if user_id else Todo.query.filter_by(uid=None).all()
        return api_response(False, 'Todos successfully retrieved', [todo.serialize(fields) for todo in todos])
    except Exception as error:
        return api_response(True, 'Failed to get todos', str(error))


@todo_bp.route('/createTodo', methods=['POST'])
@jwt_required(optional=True)
def createTodo():
    try:
        claims = get_jwt()
        fields = get_fields(request, request.method)

        body = request.get_json()

        if 'title' not in body.keys():
            raise Exception('Required properties not specified')

        title = body['title']

        if 'description' not in body.keys():
            raise Exception('Required properties not specified')
        description = body['description']
        
        user_id = claims['id'] if 'id' in claims.keys() else None

        print(title)
        print(description)
        print(user_id)

        todo = Todo(title, description, user_id)
        db.session.add(todo)
        db.session.commit()

        return api_response(False, 'Todo created successfully', todo.serialize(fields))
    except Exception as error:
        return api_response(True, 'Failed to create todo', str(error))


@todo_bp.route('/updateTodo/<int:id>', methods=['PATCH'])
@jwt_required(optional=True)
def updateTodo(id: int):
    try:
        claims = get_jwt()
        fields = get_fields(request, request.method)
        todo = Todo.query.get(id)
        if not todo:
            raise Exception('Object does not exist')

        user_id = claims['id'] if 'id' in claims.keys() else None

        if todo.uid and todo.uid != user_id:
            raise Exception('Insufficient permissions')

        body = request.get_json()

        if len(body.keys()) == 0:
            raise Exception('Update data not provided')

        if 'title' in body.keys() and getattr(todo, 'title') != body['title']:
            setattr(todo, 'title', body['title'])
        
        if 'description' in body.keys() and getattr(todo, 'description') != body['description']:
            setattr(todo, 'description', body['description'])

        # if 'uid' in body.keys() and getattr(todo, 'uid') != body['uid']:
        #     setattr(todo, 'uid', body['uid'])
        
        db.session.commit()
        
        return api_response(False, 'Successfully updated todo', todo.serialize(fields))
    except Exception as error:
        return api_response(True, 'Failed to update todo', str(error))


@todo_bp.route('/deleteTodos', methods=['DELETE'])
@jwt_required(optional=True)
def deleteTodos():
    try:
        claims = get_jwt()
        body = request.get_json()
        
        if 'ids' not in body.keys():
            raise Exception('Todo ids not provided')

        user_id = claims['id'] if 'id' in claims.keys() else None

        todo_ids = body['ids']
        deleted_ids = []
        for todo_id in todo_ids:

            todo = Todo.query.get(todo_id)
            if not todo:
                raise Exception('Object does not exist')

            if todo.uid and todo.uid != user_id:
                continue
                # raise Exception('Insufficient permissions')

            deleted_ids.append(todo.id)
            db.session.delete(todo)

        db.session.commit()
        return api_response(False, 'Successfully deleted todo', deleted_ids)
    except Exception as error:
        return api_response(True, 'Failed to delete todo', str(error))