from flask import Blueprint, jsonify, request, send_file
from flask_cors import cross_origin
import os
import shutil

from src.helpers import handle_error
from src.filesystem import get_file_tree, get_full_file_path


fs_bp = Blueprint("filesystem", __name__)

@fs_bp.route("/api/files/<int:project>")
@cross_origin()
def files(project):
    rootPath = request.args.get("rootPath", "")
    real_root = get_full_file_path(rootPath, project)
    return jsonify(get_file_tree(real_root, real_root))

# Unified route for serving files
@fs_bp.route("/api/files/<project>/<path:subpath>")
def files_send(subpath, project):
    try:
        full_path = get_full_file_path(subpath, project)
        return send_file(full_path)
    except Exception as e:
        return handle_error(f"Error serving file: {str(e)}")
    
@fs_bp.route("/api/files/<project>/create-folder", methods=["POST"])
@cross_origin()
def create_folder(project):
    data = request.get_json()
    rel_path = data.get("path")
    if not rel_path:
        return handle_error("No path provided")

    try:
        os.makedirs(get_full_file_path(rel_path, project), exist_ok=True)
        return jsonify({"success": True, "path": rel_path}), 200
    except Exception as e:
        return handle_error(str(e))
    
@fs_bp.route("/api/files/<project_id>/delete", methods=["POST"])
def delete_entry(project_id):
    data = request.get_json()
    path = data.get("path")

    if not path:
        return jsonify({"error": "No path provided"}), 400

    full_path = get_full_file_path(path, project_id)

    try:
        if os.path.isfile(full_path):
            os.remove(full_path)
            return jsonify({"status": "file deleted"}), 200
        elif os.path.isdir(full_path):
            shutil.rmtree(full_path)
            return jsonify({"status": "directory deleted"}), 200
        else:
            return jsonify({"error": "Path does not exist"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Create file
@fs_bp.route("/api/files/<project>/create-file", methods=["POST"])
@cross_origin()
def create_file(project):
    data = request.get_json()
    rel_path = data.get("path", "")
    content = data.get("content", "")

    if not rel_path:
        return handle_error("No path provided")

    try:
        full_path = get_full_file_path(rel_path, project)
        print(full_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return jsonify({"success": True, "path": rel_path}), 200
    except Exception as e:
        print(e)
        return handle_error(str(e))


# Move file
@fs_bp.route("/api/files/<project>/move-file", methods=["POST"])
def move_file(project):
    data = request.get_json()
    source = data.get("source")
    destination = data.get("destination")

    try:
        full_path_source = get_full_file_path(source, project)
        full_path_dest = get_full_file_path(destination, project)
        print(full_path_source)
        print(full_path_dest)

        if not os.path.exists(full_path_source):
            return handle_error("Source not found", 404)

        dest_dir = os.path.dirname(full_path_dest)
        os.makedirs(dest_dir, exist_ok=True)

        shutil.move(full_path_source, full_path_dest)
        return jsonify({"success": True}), 200
    except Exception as e:
        print(e)
        return handle_error(str(e))


@fs_bp.route("/api/files/<project>/save-file", methods=["POST"])
@cross_origin()
def save_file(project):
    data = request.get_json()
    rel_path = data.get("path")
    content = data.get("content")

    if not rel_path:
        return handle_error("No path provided")

    if content is None:
        return handle_error("No content provided")

    try:
        full_path = get_full_file_path(rel_path, project)
        os.makedirs(
            os.path.dirname(full_path), exist_ok=True
        )  # Ensure the directory exists
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return jsonify({"success": True, "path": rel_path}), 200
    except Exception as e:
        return handle_error(f"Error saving file: {str(e)}")