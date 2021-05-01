from flask import Blueprint, request, redirect, url_for
from flask import current_app as app
from flask_login import login_required, login_user, logout_user
from app import db
import requests
from app.data.models import User
import json

# Blueprint Configuration
auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/auth")
def login():
    # Find out what URL to hit for Google login
    google_provider_cfg = requests.get(app.config.get('GOOGLE_DISCOVERY_URL')).json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = app.client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

@auth_bp.route("/auth/callback")
def callback():
    # Get authorization code Google sent back to you
    code = request.args.get("code")
    google_provider_cfg = requests.get(app.config.get('GOOGLE_DISCOVERY_URL')).json()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = app.client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(app.config.get('GOOGLE_CLIENT_ID'), app.config.get('GOOGLE_CLIENT_SECRET')),
    )

    # Parse the tokens!
    app.client.parse_request_body_response(json.dumps(token_response.json()))

    # Get User info
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = app.client.add_token(userinfo_endpoint)
    user_info = requests.get(uri, headers=headers, data=body)

    # Convert user infor to json
    user_info = user_info.json()
    if not user_info['email_verified']:
        raise Exception('User email not available or not verified by Google.')

    gid = user_info["sub"]
    email = user_info["email"]
    name = user_info["name"]
    
    user = User.query.filter_by(gid=gid).first()
    if not user:
        user = User(email=email, role_id=1, gid=gid, name=name)
        db.session.add(user)
        db.session.commit()

    # Begin user session by logging the user in
    login_user(user)

    # Send user back to homepage
    return redirect(url_for("auth.loginTest"))

@auth_bp.route('/auth/success')
@login_required
def loginTest():
    return 'Successfully authenticated. You may now close the browser.'

@auth_bp.route("/deauth")
@login_required
def deauth():
    logout_user()
    return "Successfully Deauthenticated. You may now close the browser."