from flask import Blueprint, render_template, request
from flask import current_app as app
from app import db
from app.data.models import Role
from app.utils import api_response
from app.data.permissions import permissions
import json

# Blueprint Configuration
role_bp = Blueprint('role', __name__)

@role_bp.route('/getRoles')
def getRoles():
    try:
        roles = Role.query.all()
        return api_response(False, 'Roles successfully retrieved', [role.serialize() for role in roles])
    except Exception as error:
        return api_response(True, 'Failed to get roles', str(error))


@role_bp.route('/createRole', methods=['POST'])
def createRole():
    try:
        body = json.loads(request.data)

        if 'name' not in body.keys():
            raise Exception('Required properties not specified')
        name = body['name']

        if 'permission' not in body.keys():
            raise Exception('Required properties not specified')
        permission = body['permission']
        
        if permission not in permissions.keys():
            raise Exception('Incorrect data supplied')

        role = Role(name, permission)
        db.session.add(role)
        db.session.commit()

        return api_response(False, 'Role created successfully', role.serialize())
    except Exception as error:
        return api_response(True, 'Failed to create role', str(error))

@role_bp.route('/updateRole/<int:id>', methods=['PATCH'])
def updateRole(id: int):
    try:
        role = Role.query.get(id)
        if not role:
            raise Exception('Object does not exist')
            
        body = request.get_json()
        if len(body.keys()) == 0:
            raise Exception('Update data not provided')

        if 'name' in body.keys() and getattr(role, 'name') != body['name']:
            setattr(role, 'name', body['name'])
        
        if 'permission' in body.keys() and getattr(role, 'permission') != body['permission']:
            new_permission = body['permission']
            if new_permission not in permissions.keys():
                raise Exception('Incorrect data provided')
            setattr(role, 'permission', permissions[new_permission])

        db.session.commit()
        return api_response(False, 'Successfully updated role', role.serialize())
    except Exception as error:
        return api_response(True, 'Failed to update Role', str(error))

@role_bp.route('/deleteRole/<int:id>', methods=['DELETE'])
def deleteRole(id: int):
    try:
        role = Role.query.get(id)
        if not role:
            raise Exception('Object does not exist')
            
        db.session.delete(role)
        db.session.commit()
        return api_response(False, 'Successfully deleted role')
    except Exception as error:
        return api_response(True, 'Failed to delete Role', str(error))