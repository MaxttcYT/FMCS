from collections import OrderedDict
from flask import Flask, Response, render_template, jsonify, request, abort
from flask_apscheduler import APScheduler
from flask_cors import CORS
import os
import src.config as config
import src.factorio as factorio
import json
import colorama
from src.projects import getProjectRegister

from blueprints.filesystem import fs_bp
from blueprints.projects import project_bp
from blueprints.icons import icons_bp
from blueprints.items import items_bp

from blueprints.sockets import socketio

script_dir = os.path.dirname(os.path.abspath(__file__))

checkConfigResult = config.checkConfig()
if checkConfigResult:
    raise ValueError("[settings.yaml] " + checkConfigResult)


colorama.init(autoreset=True)
app = Flask(__name__)


class Config:
    SCHEDULER_API_ENABLED = True


app.config.from_object(Config())

CORS(app, origins="*")

scheduler = APScheduler()
scheduler.init_app(app)

app.register_blueprint(fs_bp)
app.register_blueprint(project_bp)
app.register_blueprint(icons_bp)
app.register_blueprint(items_bp)

socketio.init_app(app)

def find_pngs(base_path):
    png_paths = []
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.lower().endswith(".png"):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, "static")
                png_paths.append(rel_path.replace("\\", "/"))
    return png_paths



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


@app.route("/")
def func_name():
    return render_template("index.html")


@scheduler.task("interval", id="send_message_task", seconds=1, max_instances=1)
def send_message_task():
    socketio.emit("factorio_running", factorio.is_factorio_running())

@app.route("/api/inventory/items/<projectid>", methods=["GET"])
def get_inventory_items(projectid):
    dataRaw_path = os.path.join(script_dir, "dataRaw")
    file_path = os.path.join(dataRaw_path, "inv.json")
    project_dir = os.path.join(script_dir, "projects")
    register = getProjectRegister()

    with open(
        os.path.join(project_dir, register[int(projectid)], "project.hidden.json"), "r"
    ) as f:
        project_registry = json.load(f)

    project_items = project_registry["content"]["items"]
    for d in project_items:
        d["fmcs_item_type"] = "custom"
    project_items = {d["name"]: d for d in project_items}

    with open(file_path, "r") as f:
        content = json.load(f, object_pairs_hook=OrderedDict)

    content["mod_added"] = {}

    mod_added_group = content["mod_added"]
    mod_added_group["data"] = {
        "icon": "__base__/graphics/icons/signal/signal-plus.png",
        "icon_size": 64,
        "name": "mod_added",
        "order": "zz",
        "type": "item-group",
    }
    mod_added_group["subgroups"] = {}

    mod_added_group["subgroups"]["added_items"] = {}
    mod_added_group["subgroups"]["added_items"]["data"] = {
        "group": "mod_added",
        "name": "added_items",
        "order": "a",
        "type": "item-subgroup",
    }
    mod_added_group["subgroups"]["added_items"]["items"] = project_items

    json_content = json.dumps(content)
    return Response(json_content, mimetype="application/json")


@app.route("/api/inventory/science/<projectid>", methods=["GET"])
def get_inventory_science(projectid):
    dataRaw_path = os.path.join(script_dir, "dataRaw")
    file_path = os.path.join(dataRaw_path, "science.json")
    project_dir = os.path.join(script_dir, "projects")
    register = getProjectRegister()

    with open(
        os.path.join(project_dir, register[int(projectid)], "project.hidden.json"), "r"
    ) as f:
        project_registry = json.load(f)

    project_items = project_registry["content"]["items"]
    for d in project_items:
        d["fmcs_item_type"] = "custom"
    project_items = {d["name"]: d for d in project_items}

    with open(file_path, "r") as f:
        content = json.load(f, object_pairs_hook=OrderedDict)

    content["mod_added"] = {}

    mod_added_group = content["mod_added"]
    mod_added_group["data"] = {
        "icon": "__base__/graphics/icons/signal/signal-plus.png",
        "icon_size": 64,
        "name": "mod_added",
        "order": "zz",
        "type": "item-group",
    }
    mod_added_group["subgroups"] = {}

    mod_added_group["subgroups"]["added_items"] = {}
    mod_added_group["subgroups"]["added_items"]["data"] = {
        "group": "mod_added",
        "name": "added_items",
        "order": "a",
        "type": "item-subgroup",
    }
    mod_added_group["subgroups"]["added_items"]["items"] = project_items

    json_content = json.dumps(content)
    return Response(json_content, mimetype="application/json")

@app.route("/api/dataRaw/items/<itemName>/<projectid>", methods=["GET"])
def get_item_info(itemName, projectid):
    dataRaw_path = os.path.join(script_dir, "dataRaw")
    file_path = os.path.join(dataRaw_path, "items.json")
    project_dir = os.path.join(script_dir, "projects")
    register = getProjectRegister()

    with open(
        os.path.join(project_dir, register[int(projectid)], "project.hidden.json"), "r"
    ) as f:
        project_registry = json.load(f)

    with open(file_path, "r") as f:
        content = json.load(f)

    project_items = project_registry["content"]["items"]
    project_items = {d["name"]: d for d in project_items}
    content = {**content, **project_items}

    if itemName not in content:
        return abort(404)

    return Response(json.dumps(content[itemName]), mimetype="application/json")

if __name__ == "__main__":
    scheduler.start()
    socketio.run(app, host="127.0.0.1", port=8000, debug=True)
