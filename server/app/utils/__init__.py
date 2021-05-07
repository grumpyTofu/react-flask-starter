from flask import jsonify
import json

def api_response(error: bool, message: str, data=None):
    return jsonify({
        'error': error,
        'message': message,
        'data': data
    })


def credentials_to_dict(credentials):
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

def get_fields(request, method='GET'):
    fields = None
    if len(request.args) == 0:
        return fields
    elif method == 'GET' and 'fields' in request.args:
        fields = request.args.get('fields').split(',')
    else:
        body = request.get_json()
        if 'fields' in body.keys():
            fields = body['fields']
    return fields