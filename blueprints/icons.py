from flask import Blueprint, abort, jsonify, request, send_file

import os
import json
import io
from PIL import Image

from src.projects import getProjectRegister

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

icons_bp = Blueprint("icons", __name__)


def create_icon(image_path, crop, tint):
    with Image.open(image_path).convert("RGBA") as img:
        # --- Crop ---
        if crop.lower() != "false":
            try:
                right, lower = map(int, crop.upper().split("X"))
                img = img.crop((0, 0, right, lower))
            except ValueError:
                img = img.crop((0, 0, 64, 64))

    # --- Tint visible pixels ---
    if tint:
        try:
            r, g, b, strength = map(float, tint.split(","))
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
    return img_io

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
                        "url": f"/icon/{scope}/{rel_path}",
                        "name": os.path.splitext(file)[0],
                        "scope": scope,
                        "rel_path": rel_path,
                        "value": f"__{scope}__/graphics/{rel_path}",
                    }
                )
    return icon_list

@icons_bp.route("/icon/<scope>/<path:subpath>")
def icon_provider(subpath, scope):
    project_dir = os.path.join(main_dir, "projects")

    if scope == "base" or scope == "core":
        image_path = os.path.join(
            main_dir, "static", "factorioAssets", scope, "graphics", subpath
        )
    else:
        image_path = os.path.join(project_dir, scope, "graphics", subpath)

    crop_param = request.args.get("crop", "64x64")
    tint_param = request.args.get("tint")

    if not os.path.exists(image_path):
        abort(404)

    try:
        return send_file(
            create_icon(
                image_path=image_path,
                crop=crop_param,
                tint=tint_param,
            ),
            mimetype="image/png",
        )
    except Exception:
        abort(500)


@icons_bp.route("/icon/custom/<projectId>/<path:subpath>")
def icon_provider_custom_icons(subpath, projectId):
    project_dir = os.path.join(main_dir, "projects")
    register = getProjectRegister()
    with open(
        os.path.join(project_dir, register[int(projectId)], "info.json"), "r"
    ) as f:
        project_info = json.load(f)
        project_info["path"] = os.path.join(project_dir, register[int(projectId)])

    image_path = os.path.join(project_info["path"], subpath)

    crop_param = request.args.get("crop", "64x64")
    tint_param = request.args.get("tint")
    
    if not os.path.exists(image_path):
        abort(404)

    try:
        return send_file(
            create_icon(
                image_path=image_path,
                crop=crop_param,
                tint=tint_param,
            ),
            mimetype="image/png",
        )
    except Exception:
        abort(500)


@icons_bp.route("/asset/<scope>/<path:subpath>")
def asset_provider(subpath, scope):
    return send_file(
        os.path.join(main_dir, "static", "factorioAssets", scope, "graphics", subpath)
    )

@icons_bp.route("/api/list_icons/<projectID>")
def list_icons(projectID):
    base_path = os.path.join(main_dir, "static", "factorioAssets", "base", "graphics")
    all_base_icons = find_icons(os.path.join(base_path, "icons"))
    project_dir = os.path.join(main_dir, "projects")
    register = getProjectRegister()

    with open(
        os.path.join(project_dir, register[int(projectID)], "info.json"), "r"
    ) as f:
        project_info = json.load(f)

    with open(
        os.path.join(project_dir, register[int(projectID)], "project.hidden.json"), "r"
    ) as f:
        project_registry = json.load(f)

    all_custom_icons = (
        project_registry["content"]["icons"]
        if "icons" in project_registry["content"]
        else []
    )

    for item in all_custom_icons:
        item["scope"] = project_info["name"]
        item["value"] = f"__{project_info['name']}__{item['path']}"
        item["url"] = f"/icon/custom/{projectID}{item['path']}"

    all_icons = [
        {
            "data": {"icon_url": "/icon/base/icons/blueprint.png", "title": "Custom"},
            "icons": all_custom_icons,
        },
        {
            "data": {
                "icon_url": "/icon/base/icons/iron-gear-wheel.png",
                "title": "Base",
            },
            "icons": all_base_icons,
        },
    ]
    return jsonify(all_icons)
