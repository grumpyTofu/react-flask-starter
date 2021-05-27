from os import access
from flask import Blueprint, request, redirect, url_for, jsonify
from flask import current_app as app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt, create_refresh_token, unset_jwt_cookies
from app import db
from app.data.models import User
from oauth2client import client
from datetime import datetime, timezone, timedelta
import json

from app.utils import api_response

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
        
        user = User.query.filter_by(gid=gid).first()
        if not user:
            user = User(email=email, role_id=1, gid=gid, name=name)
            db.session.add(user)
            db.session.commit()

        # Begin user session by logging the user in
        access_token = create_access_token(name, additional_claims=user.serialize(['id', 'name', 'email', 'role_id', 'gid']), fresh=True)
        refresh_token = create_refresh_token(name, additional_claims=user.serialize(['id', 'name', 'email', 'role_id', 'gid']))
        return api_response(False, "Authentication successful", {
            'access_token': access_token, 
            'refresh_token': refresh_token
        })
    except Exception as error:
        return api_response(True, "Failed to authenticate", str(error))

# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh=False)
    return jsonify(access_token=access_token)

# # Using an `after_request` callback, we refresh any token
# @app.after_request
# def refresh_expiring_jwts(response):
#     try:
#         access_token = create_access_token(identity=get_jwt_identity())
#         # set_access_cookies(response, access_token)
#         return jsonify(access_token=access_token)
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original respone
#         return response