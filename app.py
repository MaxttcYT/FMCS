from flask import Flask, Response, render_template, jsonify, send_file, request, abort
from flask_socketio import SocketIO
from flask_apscheduler import APScheduler
from flask_cors import CORS, cross_origin
import os
import shutil
import src.config as config
import src.build as modBuilder
import src.factorio as factorio
import requests
import json
from bs4 import BeautifulSoup, Tag
import re
from PIL import Image
import io
import stat
import colorama
from src.projects import getProjectRegister

app = Flask(__name__)

colorama.init(autoreset=True)

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, origins="*")

scheduler = APScheduler()
scheduler.init_app(app)


class Config:
    SCHEDULER_API_ENABLED = True


app.config.from_object(Config())

script_dir = os.path.dirname(os.path.abspath(__file__))

checkConfigResult = config.checkConfig()
if checkConfigResult:
    raise ValueError("[settings.yaml] " + checkConfigResult)

def fileIcons(filepath):
    filename = os.path.basename(filepath)
    extension = os.path.splitext(filename)[1].lower().strip(".") or filename
    if filename.startswith("."):
        extension = filename.strip(".")

    icons = {
        "lua": ("Lua", "extension/.lua"),
        "png": ("Image", "extension/.png"),
        "txt": ("Default", "extension/.txt"),
        "json": ("JSON", "extension/.json"),
        "gitignore": ("Git", "extension/.gitignore"),
        "cfg": ("Config", "extension/.cfg"),
        "license": ("License", "default"),
        "md": ("Markdown", "extension/.md"),
        "xml": ("XML", "extension/.xml"),
    }
    icon, ext = icons.get(extension.lower(), ("Default", "extension/.txt"))
    return {"icon": icon, "extension": ext}


ext_to_editor = {
    ".lua": "LuaEditor",
    ".md": "MdEditor",
    ".png": "ImgViewer",
    ".jpg": "ImgViewer",
    ".json": "JsonEditor",
    ".xml": "XmlEditor",
    ".cfg": "CfgEditor",
}


# Path normalization helper
def normalize_path(path):
    return path.replace("\\", "/")


# Error handler for consistency
def handle_error(message, status_code=400):
    return jsonify({"error": message}), status_code


# Helper function to get full file path
def get_full_file_path(relative_path, project):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.join(script_dir, "projects", getProjectRegister()[int(project)])
    if relative_path.startswith("//"):
        relative_path = relative_path[2:]
    if relative_path.startswith("/"):
        relative_path = relative_path[1:]
    return os.path.join(base_path, relative_path)


def get_file_tree(real_path, display_base):
    def is_readonly(path):
        return not os.access(path, os.W_OK)

    relative_path = os.path.relpath(real_path, display_base)
    is_root = relative_path == "." or os.path.abspath(real_path) == os.path.abspath(
        display_base
    )
    read_only = is_readonly(real_path)
    path = "/" if is_root else normalize_path(relative_path)

    if path == "prototypes/autogen":
        read_only = True

    tree = {
        "name": os.path.basename(os.path.abspath(real_path))
        if is_root
        else os.path.basename(real_path),
        "path": path,
        "type": "folder",
        "is_readonly": read_only,
        "children": [],
    }

    try:
        entries = os.listdir(real_path)
        sorted_entries = sorted(
            entries,
            key=lambda e: (
                not os.path.isdir(os.path.join(real_path, e)),  # Folders first
                e.lower(),  # Alphabetical
            ),
        )

        for entry in sorted_entries:
            full_path = os.path.join(real_path, entry)
            if os.path.isdir(full_path):
                tree["children"].append(get_file_tree(full_path, display_base))
            else:
                ext = os.path.splitext(full_path)[1].lower()
                read_only = is_readonly(full_path)
                hidden = False
                path = normalize_path(os.path.relpath(full_path, display_base))
                if "fmcs-auto-" in entry or path == "data.lua":
                    read_only = True
                if ".hidden." in entry:
                    hidden = True
                tree["children"].append(
                    {
                        "name": entry,
                        "path": path,
                        "type": "file",
                        "hidden": hidden,
                        "icon": fileIcons(full_path),
                        "preferred_editor": ext_to_editor.get(ext, "TextEditor"),
                        "is_readonly": read_only,
                    }
                )
    except PermissionError:
        pass

    return tree


# Unified route for file tree
@app.route("/api/files/<int:project>")
@cross_origin()
def files(project):
    real_root = get_full_file_path("", project)
    return jsonify(get_file_tree(real_root, real_root))


# Unified route for serving files
@app.route("/api/files/<project>/<path:subpath>")
def files_send(subpath, project):
    try:
        full_path = get_full_file_path(subpath, project)
        return send_file(full_path)
    except Exception as e:
        return handle_error(f"Error serving file: {str(e)}")


@app.route("/api/files/<project_id>/delete", methods=["POST"])
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


# Create folder
@app.route("/api/files/<project>/create-folder", methods=["POST"])
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


# Create file
@app.route("/api/files/<project>/create-file", methods=["POST"])
@cross_origin()
def create_file(project):
    data = request.get_json()
    rel_path = data.get("path", "")
    content = data.get("content", "")

    if not rel_path:
        return handle_error("No path provided")

    try:
        full_path = get_full_file_path(rel_path, project)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return jsonify({"success": True, "path": rel_path}), 200
    except Exception as e:
        return handle_error(str(e))


# Move file
@app.route("/api/files/<project>/move-file", methods=["POST"])
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


@app.route("/api/files/<project>/save-file", methods=["POST"])
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


@app.route("/api/items/<project>/save-item", methods=["POST"])
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
        project_dir = os.path.join(script_dir, "projects")
        register = getProjectRegister()

        with open(
            os.path.join(project_dir, register[int(project)], "project.hidden.json"),
            "r",
        ) as f:
            project_registry = json.load(f)

        if item_type not in ["item", "recipe", "command", "technology"]:
            return handle_error("Invalid type provided")

        registry_category_mapping = {
            "item": "items",
            "recipe": "recipes",
            "command": "commands",
            "technology": "tech",
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


def find_pngs(base_path):
    png_paths = []
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.lower().endswith(".png"):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, "static")
                png_paths.append(rel_path.replace("\\", "/"))
    return png_paths


def find_icons(base_path, scope="base"):
    """
    Recursively find PNG files in base_path and return info usable for /api/icon/<scope>/<path>.
    Keeps subfolders intact.
    """
    icon_list = []
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.lower().endswith(".png"):
                # Get relative path including subfolders inside base_path
                rel_path = os.path.relpath(
                    os.path.join(root, file), os.path.dirname(base_path)
                )
                rel_path = rel_path.replace("\\", "/")  # normalize Windows paths
                icon_list.append(
                    {
                        "path": f"/icon/{scope}/{rel_path}",
                        "name": os.path.splitext(file)[0],
                        "scope": scope,
                        "rel_path": rel_path,
                        "value": f"__{scope}__/graphics/{rel_path}",
                    }
                )
    return icon_list


def relevance_score(query, path):
    path = path.lower()
    if query == path:
        return 100
    if query in path:
        return 100 - path.index(query)
    return 0


@app.route("/search_images")
def search_images():
    query = request.args.get("q", "").lower()
    if not query:
        return jsonify([])

    base_path = os.path.join(script_dir, "static", "factorioAssets")
    all_images = find_pngs(base_path)

    scored = [
        (img, relevance_score(query, img)) for img in all_images if query in img.lower()
    ]
    scored.sort(key=lambda x: x[1], reverse=True)
    top_images = [img for img, _ in scored[:900]]
    return jsonify(top_images)


@app.route("/api/list_icons")
def list_icons():
    base_path = os.path.join(script_dir, "static", "factorioAssets", "base", "graphics")
    all_icons = find_icons(os.path.join(base_path, "icons"))
    return jsonify(all_icons)


@app.route("/")
def func_name():
    return render_template("index.html")

@app.route("/icon/<scope>/<path:subpath>")
def icon_provider(subpath, scope):
    image_path = os.path.join(
        script_dir, "static", "factorioAssets", scope, "graphics", subpath
    )

    if not os.path.exists(image_path):
        abort(404)

    try:
        with Image.open(image_path).convert("RGBA") as img:
            # --- Crop ---
            crop_param = request.args.get("crop", "64x64")
            if crop_param.lower() != "false":
                try:
                    right, lower = map(int, crop_param.upper().split("X"))
                    img = img.crop((0, 0, right, lower))
                except ValueError:
                    img = img.crop((0, 0, 64, 64))

            # --- Tint visible pixels ---
            tint_param = request.args.get("tint")
            if tint_param:
                try:
                    r, g, b, strength = map(float, tint_param.split(","))
                    r, g, b = [int(x * 255) for x in (r, g, b)]
                    strength = max(0.0, min(1.0, strength))  # clamp
            
                    img = img.convert("RGBA")
                    pixels = img.load()
            
                    for y in range(img.height):
                        for x in range(img.width):
                            pr, pg, pb, pa = pixels[x, y]
                            if pa > 0:
                                # Multiply original by tint, scaled by strength
                                new_r = int(pr * ((r / 255) * strength + (1 - strength)))
                                new_g = int(pg * ((g / 255) * strength + (1 - strength)))
                                new_b = int(pb * ((b / 255) * strength + (1 - strength)))
                                pixels[x, y] = (new_r, new_g, new_b, pa)
                except Exception:
                    pass

            # --- Send image ---
            img_io = io.BytesIO()
            img.save(img_io, format="PNG")
            img_io.seek(0)
            return send_file(img_io, mimetype="image/png")
    except Exception:
        abort(500)


@app.route("/asset/<scope>/<path:subpath>")
def asset_provider(subpath, scope):
    return send_file(
        os.path.join(script_dir, "static", "factorioAssets", scope, "graphics", subpath)
    )


# Factorio-related socket events
@socketio.on("start_factorio")
def start_factorio_socket(data):
    projectId = data["projectId"]
    project_dir = os.path.join(script_dir, "projects")
    register = getProjectRegister()
    with open(os.path.join(project_dir, register[int(projectId)], "info.json"), "r") as f:
        project_info = json.load(f)
        project_info["path"] = os.path.join(project_dir, register[int(projectId)])
        project_info["id"] = projectId
    factorio.start_factorio_preview(project_info)


@socketio.on("kill_factorio")
def kill_factorio_socket():
    factorio.stop_factorio_preview(True)


@socketio.on("stop_factorio")
def stop_factorio_socket():
    factorio.stop_factorio_preview(False)


@socketio.on("start_build")
def start_build_socket(data):
    print("start build for: " + str(data))
    socketio.start_background_task(
        target=modBuilder.startBuild,
        socketio=socketio,
        projectId=data["projectId"]
    )
    return "ok"

@scheduler.task("interval", id="send_message_task", seconds=1, max_instances=1)
def send_message_task():
    socketio.emit("factorio_running", factorio.is_factorio_running())


def add_project_to_register(project_data):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    register_path = os.path.join(script_dir, "projects", "register.json")

    # Lade bestehende Daten
    with open(register_path, "r+") as f:
        try:
            data = json.load(f)
        except Exception:
            data = []

        data.append(project_data)
        new_index = len(data) - 1

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()  # Entfernt evtl. übriggebliebene alte Daten

    return new_index


def remove_project_from_register(id):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    register_path = os.path.join(script_dir, "projects", "register.json")

    # Lade bestehende Daten
    with open(register_path, "r+") as f:
        try:
            data = json.load(f)
        except Exception:
            data = []

        data.pop(id)

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()


@app.route("/api/factorio/getFactorioVersions", methods=["GET"])
def getFactorioVersions():
    # URL of the Factorio Lua API documentation
    url = "https://lua-api.factorio.com/"

    # Send a GET request to the URL
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for HTTP errors

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the version selector element
    version_selector: Tag = soup.find("div", class_="panel-inset-lighter")

    # Check if the version selector exists
    if version_selector:
        # Extract all version options
        versions = [
            option.text.strip() for option in version_selector.find_all("option")
        ]
        print("Available Factorio Lua API Documentation Versions:")
        for version in versions:
            print(version)
    else:
        print("Version selector not found on the page.")

    return jsonify("expression")


@app.route("/api/projects/create", methods=["POST"])
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
        "homepage": "#Define your homepage here if you have one, if not delete this key#",
        "factorio_version": data["factorioVersion"],
        "dependencies": [f"base >= {data['factorioVersion']}"],
    }

    # Register project and create directory
    new_proj_id = add_project_to_register(name)
    new_proj_path = os.path.join(script_dir, "projects", name)

    if os.path.exists(new_proj_path):
        return jsonify({"success": False, "message": "Project already exists!"}), 409

    # Create project folder structure
    os.makedirs(new_proj_path)

    shutil.copytree(
        os.path.join(script_dir, "static", "defaultProject"),
        new_proj_path,
        dirs_exist_ok=True,
    )

    # Write info.json
    with open(os.path.join(new_proj_path, "info.json"), "w") as f:
        json.dump(info, f, indent=4)

    # Final response
    return jsonify({"success": True, "id": new_proj_id}), 200


@app.route("/api/projects/list", methods=["GET"])
def list_projects():
    project_dir = os.path.join(script_dir, "projects")
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


@app.route("/api/projects/<project>/info", methods=["GET"])
def project_info(project):
    project_dir = os.path.join(script_dir, "projects")
    register = getProjectRegister()
    with open(os.path.join(project_dir, register[int(project)], "info.json"), "r") as f:
        project_info = json.load(f)
        project_info["path"] = os.path.join(project_dir, register[int(project)])
        project_info["id"] = project

    with open(
        os.path.join(project_dir, register[int(project)], "project.hidden.json"), "r"
    ) as f:
        project_registry = json.load(f)

    project_info["registry"] = project_registry
    return jsonify(project_info)


@app.route("/api/inventory/items", methods=["GET"])
def get_inventory_items():
    dataRaw_path = os.path.join(script_dir, "dataRaw")
    file_path = os.path.join(dataRaw_path, "inv.json")

    with open(file_path, "r") as f:
        content = f.read()

    return Response(content, mimetype="application/json")

def del_rw(action, name, exc):
    os.chmod(name, stat.S_IWRITE)
    os.remove(name)


@app.route("/api/projects/<project>/delete", methods=["GET"])
def project_delete(project):
    projects_dir = os.path.join(script_dir, "projects")
    register = getProjectRegister()
    project_dir = os.path.join(projects_dir, register[int(project)])
    shutil.rmtree(project_dir, onexc=del_rw)
    remove_project_from_register(int(project))
    return "OK"


if __name__ == "__main__":
    scheduler.start()
    socketio.run(app, host="127.0.0.1", port=8000, debug=True)
