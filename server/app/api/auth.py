from flask import Blueprint, request, redirect, url_for, jsonify
from flask import current_app as app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app import db
from app.data.models import User
from oauth2client import client

# Blueprint Configuration
auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/auth", methods=['POST'])
def auth():
    try:
        # (Receive auth_code by HTTPS POST)
        code = request.data

        # If this request does not have `X-Requested-With` header, this could be a CSRF
        if not request.headers.get('X-Requested-With'):
            raise Exception('Possible security issue')


        # Exchange auth code for access token, refresh token, and ID token
        credentials = client.credentials_from_clientsecrets_and_code(
            app.config.get('GOOGLE_CLIENT_SECRET_FILE'),
            ['profile', 'email'],
            code
            )

        # Get profile info from ID token
        gid = credentials.id_token['sub']
        email = credentials.id_token['email']
        name = credentials.id_token['name']

        print(email)
        
        user = User.query.filter_by(gid=gid).first()
        if not user:
            user = User(email=email, role_id=1, gid=gid, name=name)
            db.session.add(user)
            db.session.commit()

        # Begin user session by logging the user in
        access_token = create_access_token(name, additional_claims=user.serialize(['id', 'name', 'email', 'role_id', 'gid']))
        return jsonify(access_token=access_token)
    except Exception as error:
        print(error)
        return str(error)

@auth_bp.route('/auth/test')
@jwt_required()
def loginTest():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    claims = get_jwt()
    return jsonify(identity=current_user, data=claims)

@auth_bp.route("/deauth")
@jwt_required()
def deauth():
    return "Successfully Deauthenticated. You may now close the browser."