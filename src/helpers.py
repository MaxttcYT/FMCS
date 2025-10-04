from flask import jsonify


def handle_error(message, status_code=400):
    return jsonify({"error": message}), status_code