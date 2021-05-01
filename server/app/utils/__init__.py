from flask import jsonify


def api_response(error: bool, message: str, data=None):
    return jsonify({
        'error': error,
        'message': message,
        'data': data
    })


def credentials_to_dict(credentials):
      return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}