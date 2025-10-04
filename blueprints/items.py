import json
from uuid import uuid4
from flask import Blueprint, jsonify, request

import os

from flask_cors import cross_origin

from src.helpers import handle_error
from src.projects import getProjectRegister

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

items_bp = Blueprint("items", __name__)

@items_bp.route("/api/items/<project>/save-item", methods=["POST"])
@cross_origin()
def save_item(project):
    data = request.get_json()
    name = data.get("name")
    item_type = data.get("type")
    content = data.get("content")

    if not name:
        return handle_error("No name provided")

    if not item_type:
        return handle_error("No type provided")

    if content is None:
        return handle_error("No content provided")

    try:
        project_dir = os.path.join(main_dir, "projects")
        register = getProjectRegister()

        with open(
            os.path.join(project_dir, register[int(project)], "project.hidden.json"),
            "r",
        ) as f:
            project_registry = json.load(f)

        if item_type not in ["item", "recipe", "command", "technology", "icon"]:
            return handle_error("Invalid type provided")

        registry_category_mapping = {
            "item": "items",
            "recipe": "recipes",
            "command": "commands",
            "technology": "tech",
            "icon": "icons",
        }

        item_category = registry_category_mapping[item_type]

        items_of_type = project_registry["content"].get(item_category, [])

        item = next((d for d in items_of_type if d.get("name") == name), None)

        if item is None:
            return handle_error("Invalid name provided")

        item.clear()
        item.update(content)

        with open(
            os.path.join(project_dir, register[int(project)], "project.hidden.json"),
            "w",
        ) as f:
            json.dump(project_registry, f, indent=4)

        return jsonify({"success": True, "updatedItem": content}), 200
    except Exception as e:
        print(e)
        return handle_error(f"Error saving file: {str(e)}")


@items_bp.route("/api/items/<project>/create-item", methods=["POST"])
@cross_origin()
def create_item(project):
    data = request.get_json()
    item_type = data.get("type")
    item_name = data.get("name")
    content = data.get("content")

    if not item_name:
        return handle_error("No name provided")

    if not item_type:
        return handle_error("No type provided")

    if content is None:
        return handle_error("No content provided")

    try:
        project_dir = os.path.join(main_dir, "projects")
        register = getProjectRegister()

        with open(
            os.path.join(project_dir, register[int(project)], "project.hidden.json"),
            "r",
        ) as f:
            project_registry = json.load(f)

        if item_type not in ["item", "recipe", "command", "technology", "icon"]:
            return handle_error("Invalid type provided")

        registry_category_mapping = {
            "item": "items",
            "recipe": "recipes",
            "command": "commands",
            "technology": "tech",
            "icon": "icons",
        }

        item_category = registry_category_mapping[item_type]

        content = {
            **content,
            "fmcs_id": str(uuid4()), # Add id for refrence in recipe, etc.
        }
        
        project_registry["content"][item_category].append(content)

        with open(
            os.path.join(project_dir, register[int(project)], "project.hidden.json"),
            "w",
        ) as f:
            json.dump(project_registry, f, indent=4)

        return jsonify({"success": True, "createdItem": content}), 200

    except Exception as e:
        print(e)
        return handle_error(f"Error saving file: {str(e)}")
