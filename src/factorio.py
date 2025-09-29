import os
import subprocess
import psutil
import json
import shutil
from rich import print
import src.config as settings
import sys


project_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
factorio_data_path = settings.getSetting("FACTORIO_DATA_PATH")
factorio_path = settings.getSetting("FACTORIO_PATH")

last_status = False

def start_factorio():
    preview_path = os.path.join(project_dir, ".mod-preview")
    mod_dir = os.path.join(preview_path, "dev-mod")
    app_id = settings.getSetting("FACTORIO_STEAM_ID")

    steam_path = settings.getSetting("STEAM_PATH")

    if sys.platform.startswith("win"):
        if not steam_path:
            raise ValueError("Please set STEAM_PATH to steam.exe!")
        cmd = [
            steam_path,
            "-applaunch", str(app_id),
            "--mod-directory", mod_dir,
        ]
    elif sys.platform.startswith("linux"):
        cmd = [
            "steam",
            "-applaunch", str(app_id),
            "--mod-directory", mod_dir,
        ]
    elif sys.platform == "darwin":  # macOS
        cmd = [
            "open", "-a", "Steam", "--args",
            "-applaunch", str(app_id),
            "--mod-directory", mod_dir,
        ]
    else:
        raise RuntimeError(f"Unsupported platform: {sys.platform}")

    subprocess.run(cmd)


def kill_factorio():
    for proc in psutil.process_iter(["pid", "name"]):
        try:
            if "factorio" in proc.info["name"].lower():
                print(f"Found process: {proc.info['name']} (PID: {proc.info['pid']})")
                proc.kill()
                print("Process killed.")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass


def stop_factorio():
    for proc in psutil.process_iter(["pid", "name"]):
        try:
            if "factorio" in proc.info["name"].lower():
                print(f"Found process: {proc.info['name']} (PID: {proc.info['pid']})")
                proc.terminate()
                print("Process terminated.")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass


def is_factorio_running():
    global last_status
    running = False

    for proc in psutil.process_iter(["name"]):
        try:
            if proc.info["name"] and "factorio" in proc.info["name"].lower():
                running = True
                break
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    last_status = running
    return running


def append_or_update_mod(mods, name, enabled):
    for mod in mods:
        if mod["name"] == name:
            mod["enabled"] = enabled
            return mods
    mods.append({"name": name, "enabled": enabled})
    return mods


def modlist_preview(spaceAge):
    mods = [
        {"name": "base", "enabled": True},
        {"name": "fmcs-template", "enabled": True},
    ]

    if spaceAge:
        mods.extend(
            [
                {"name": "elevated-rails", "enabled": False},
                {"name": "quality", "enabled": False},
                {"name": "space-age", "enabled": False},
            ]
        )

    return {"mods": mods}


def delete_files_in_directory(directory_path):
    try:
        for file in os.listdir(directory_path):
            file_path = os.path.join(directory_path, file)
            if os.path.isfile(file_path):
                os.remove(file_path)
            elif os.path.isdir(file_path):  # Ensure directories are also deleted
                shutil.rmtree(file_path)
        print("All files and directories deleted successfully.")
    except OSError as e:
        print(f"Error occurred while deleting files: {e}")


def getSpaceAge():
    space_age_path = os.path.join(factorio_path, "data", "space-age")
    return os.path.exists(space_age_path)


def load_preview_mods(projectInfo):
    stop_factorio_preview(kill=True)

    preview_path = os.path.join(project_dir, ".mod-preview")
    devMod_path = os.path.join(preview_path, "dev-mod")
    list_path = os.path.join(devMod_path, "mod-list.json")
    os.makedirs(devMod_path, exist_ok=True)

    space_age = getSpaceAge()
    with open(list_path, "w") as f:
        json.dump(modlist_preview(space_age), f, indent=4)

def start_factorio_preview(projectInfo):
    load_preview_mods(projectInfo)
    start_factorio()


def stop_factorio_preview(kill):
    if kill:
        kill_factorio()
    else:
        stop_factorio()
