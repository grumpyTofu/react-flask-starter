from flask import jsonify

def api_response(error: bool, message: str, data=None):
    return jsonify({
        'error': error,
        'message': message,
        'data': data
    })