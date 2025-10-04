from flask import Blueprint, jsonify, request

import os
import re
import shutil
import json
import stat

from src.items import resolve_project_registry
from src.projects import getProjectRegister, add_project_to_register, remove_project_from_register

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

project_bp = Blueprint("projects", __name__)

@project_bp.route("/api/projects/create", methods=["POST"])
def create_project():
    data = request.get_json()

    # Sanitize name
    name = re.sub(r"[^a-zA-Z0-9_-]", "-", data["name"])

    # Build info.json data
    info = {
        "name": name,
        "author": data["author"],
        "version": data["version"],
        "title": data["name"],
        "description": data["description"],
        "factorio_version": data["factorioVersion"],
        "dependencies": [f"base >= {data['factorioVersion']}"],
    }

    # Register project and create directory
    new_proj_id = add_project_to_register(name)
    new_proj_path = os.path.join(main_dir, "projects", name)

    if os.path.exists(new_proj_path):
        return jsonify({"success": False, "message": "Project already exists!"}), 409

    # Create project folder structure
    os.makedirs(new_proj_path)

    shutil.copytree(
        os.path.join(main_dir, "static", "defaultProject"),
        new_proj_path,
        dirs_exist_ok=True,
    )

    # Write info.json
    with open(os.path.join(new_proj_path, "info.json"), "w") as f:
        json.dump(info, f, indent=4)

    # Final response
    return jsonify({"success": True, "id": new_proj_id}), 200


@project_bp.route("/api/projects/list", methods=["GET"])
def list_projects():
    project_dir = os.path.join(main_dir, "projects")
    register = getProjectRegister()
    result = []
    for i, project in enumerate(register):
        info_path = os.path.join(project_dir, project, "info.json")
        if not os.path.exists(info_path):
            project_info = {}
            project_info["path"] = os.path.join(project_dir, project)
            project_info["id"] = i
            result.append(project_info)
        else:
            with open(info_path, "r") as f:
                project_info = json.load(f)
                project_info["path"] = os.path.join(project_dir, project)
                project_info["id"] = i
                result.append(project_info)
    return jsonify(result)


@project_bp.route("/api/projects/<project>/info", methods=["GET"])
def project_info(project):
    project_dir = os.path.join(main_dir, "projects")
    register = getProjectRegister()
    with open(os.path.join(project_dir, register[int(project)], "info.json"), "r") as f:
        project_info = json.load(f)
        project_info["path"] = os.path.join(project_dir, register[int(project)])
        project_info["id"] = project

    with open(
        os.path.join(project_dir, register[int(project)], "project.hidden.json"), "r"
    ) as f:
        project_registry = json.load(f)
        
    project_registry = resolve_project_registry(project_registry)

    project_info["registry"] = project_registry
    return jsonify(project_info)

def del_rw(action, name, exc):
    os.chmod(name, stat.S_IWRITE)
    os.remove(name)


@project_bp.route("/api/projects/<project>/delete", methods=["GET"])
def project_delete(project):
    projects_dir = os.path.join(main_dir, "projects")
    register = getProjectRegister()
    project_dir = os.path.join(projects_dir, register[int(project)])
    shutil.rmtree(project_dir, onexc=del_rw)
    remove_project_from_register(int(project))
    return "OK"