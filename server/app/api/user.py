from flask import Blueprint, render_template, request
from flask import current_app as app
from app import db
from app.data.models import Role, User
from app.utils import api_response, get_fields
import json
import re

# Blueprint Configuration
user_bp = Blueprint('user', __name__)

@user_bp.route('/getUsers')
def getUsers():
    try:
        fields = get_fields(request)
        print(fields)
        users = User.query.all()
        return api_response(False, 'Users successfully retrieved', [user.serialize(fields) for user in users])
    except Exception as error:
        return api_response(True, 'Failed to get users', str(error))


@user_bp.route('/createUser', methods=['POST'])
def createUser():
    try:
        fields = get_fields(request, request.method)
        body = json.loads(request.data)

        if 'email' not in body.keys():
            raise Exception('Required properties not specified')
        email = body['email']
        regex = '^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'
        if not (re.search(regex, email)):
            raise Exception('Invalid email format')

        if 'role_id' not in body.keys():
            raise Exception('Required properties not specified')
        role_id = body['role_id']

        if not Role.query.get(role_id):
            raise Exception('Specified role does not exist')

        user = User(email, role_id)
        db.session.add(user)
        db.session.commit()

        return api_response(False, 'User created successfully', user.serialize(fields))
    except Exception as error:
        return api_response(True, 'Failed to create user', str(error))

@user_bp.route('/updateUser/<int:id>', methods=['PATCH'])
def updateUser(id: int):
    try:
        fields = get_fields(request, request.method)
        user = User.query.get(id)

        body = request.get_json()
        if len(body.keys()) == 0:
            raise Exception('Update data not provided')

        if 'email' in body.keys() and user.email != body['email']:
            user.email = body['email']
        
        if 'role_id' in body.keys() and user.role_id != body['role_id']:
            if not Role.query.get(body['role_id']):
                raise Exception('Specified role does not exist')
            user.role_id = body['role_id']

        db.session.commit()
        return api_response(False, 'Successfully updated user', user.serialize(fields))
    except Exception as error:
        return api_response(True, 'Failed to update User', str(error))

@user_bp.route('/deleteUser/<int:id>', methods=['DELETE'])
def deleteUser(id: int):
    try:
        user = User.query.get(id)
        if not user:
            raise Exception('Object does not exist')
            
        db.session.delete(user)
        db.session.commit()
        return api_response(False, 'Successfully deleted user')
    except Exception as error:
        return api_response(True, 'Failed to delete User', str(error))