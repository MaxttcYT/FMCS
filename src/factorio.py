import os
import subprocess
import psutil
import json
import shutil
from rich import print
import src.config as settings

project_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
factorio_data_path = settings.getSetting("FACTORIO_DATA_PATH")
factorio_path = settings.getSetting("FACTORIO_PATH")

last_status = False

def launch_steam_game(app_id):
    steam_path = settings.getSetting("STEAM_PATH")
    if not steam_path:
        raise ValueError("Steam is not installed or not in the expected path.")
    
    subprocess.run([steam_path, f"steam://rungameid/{app_id}"])

def start_factorio():
    launch_steam_game(settings.getSetting("FACTORIO_STEAM_ID"))

def kill_factorio():
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            if 'factorio' in proc.info['name'].lower():
                print(f"Found process: {proc.info['name']} (PID: {proc.info['pid']})")
                proc.kill()
                print("Process killed.")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

def stop_factorio():
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            if 'factorio' in proc.info['name'].lower():
                print(f"Found process: {proc.info['name']} (PID: {proc.info['pid']})")
                proc.terminate()
                print("Process terminated.")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

def is_factorio_running():
    global last_status
    running = False

    for proc in psutil.process_iter(['name']):
        try:
            if proc.info['name'] and 'factorio' in proc.info['name'].lower():
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
    mods = [{"name": "base", "enabled": True}, {"name": "fmcs-template", "enabled": True}]
    
    if spaceAge:
        mods.extend([
            {"name": "elevated-rails", "enabled": False},
            {"name": "quality", "enabled": False},
            {"name": "space-age", "enabled": False}
        ])
    
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
    kill_factorio()
    
    mods_path = os.path.join(factorio_data_path, "mods")
    list_path = os.path.join(factorio_data_path, "mods", "mod-list.json")
    preview_path = os.path.join(project_dir, ".mod-preview")
    mod_backup_path = os.path.join(preview_path, "mods")

    os.makedirs(mod_backup_path, exist_ok=True)
    delete_files_in_directory(mod_backup_path)

    shutil.copytree(mods_path, mod_backup_path, dirs_exist_ok=True)
    
    os.makedirs(mods_path, exist_ok=True)
    delete_files_in_directory(mods_path)
    
    if not os.path.exists(list_path):
        new_modlist = modlist_preview(False)
        with open(list_path, "w") as f:
            json.dump(new_modlist, f, indent=4)
    
    space_age = getSpaceAge()
    with open(list_path, "r+") as f:
        #content = json.load(f)
        #mods = content.get("mods", [])
        f.seek(0)
        json.dump(modlist_preview(space_age), f, indent=4)
    
    shutil.copy(os.path.join(preview_path, "dev-mod", f"{projectInfo["name"]}_{projectInfo["version"]}.zip"), mods_path)

def load_user_mods():
    mods_path = os.path.join(factorio_data_path, "mods")
    shutil.copytree(os.path.join(project_dir, ".mod-preview", "mods"), mods_path, dirs_exist_ok=True)

def start_factorio_preview(projectInfo):
    load_preview_mods(projectInfo)
    start_factorio()

def stop_factorio_preview(kill):
    load_user_mods()
    if kill:
        kill_factorio()
    else:
        stop_factorio()
