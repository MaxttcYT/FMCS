import shutil
import time
import zipfile
import os
import json

import src.build_lua as build_lua
from src.build_logging import sendBuildLog
from src.projects import getProjectRegister

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
save_prefix = "fmcs-auto-"
dev_mod_dir = os.path.join(main_dir, ".mod-preview", "dev-mod")
        
def copy_files(socketio, fromDir, toDir):
    os.makedirs(toDir, exist_ok=True)
    os.makedirs(fromDir, exist_ok=True)

    files = []
    for root, _, filenames in os.walk(fromDir):
        for f in filenames:
            files.append(os.path.join(root, f))

    total = len(files)
    for i, src in enumerate(files, start=1):
        rel_path = os.path.relpath(src, fromDir)
        dst = os.path.join(toDir, rel_path)

        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)

        sendBuildLog(socketio, f"Copying {i}/{total}", overrideLast=True)
        time.sleep(0.0001)  # Intentional delay to prevent client lag

    sendBuildLog(socketio, "Copying Done", overrideLast=True)

def retriveProjectInfo(projectId):
    project_dir = os.path.join(main_dir, "projects")
    register = getProjectRegister()
    with open(
        os.path.join(project_dir, register[int(projectId)], "info.json"), "r"
    ) as f:
        project_info = json.load(f)
        project_info["path"] = os.path.join(project_dir, register[int(projectId)])
        project_info["id"] = projectId

    with open(
        os.path.join(project_dir, register[int(projectId)], "project.hidden.json"), "r"
    ) as f:
        project_registry = json.load(f)

    project_info["registry"] = project_registry
    return project_info

def zip_dir(zip_filename, dir_to_zip): 
    top_folder = os.path.splitext(os.path.basename(zip_filename))[0]

    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dir_to_zip):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, dir_to_zip)
                arcname = os.path.join(top_folder, rel_path)
                zipf.write(file_path, arcname)

def format_elapsed(seconds: float) -> str:
    if seconds < 1:
        return f"{seconds * 1000:.1f} ms"
    elif seconds < 60:
        return f"{seconds:.3f} s"
    else:
        m, s = divmod(seconds, 60)
        return f"{int(m)}m {s:.3f}s"


def startBuild(socketio, projectId):
    os.makedirs(dev_mod_dir, exist_ok=True)
    
    start = time.perf_counter()
    project_info = retriveProjectInfo(projectId)
    project_content = project_info["registry"]["content"]
    project_path = project_info["path"]
    build_output_zip_path = os.path.join(main_dir, dev_mod_dir, f"{project_info["name"]}_{project_info["version"]}.zip")

    #Remove old build zip
    if os.path.exists(build_output_zip_path):
        os.remove(build_output_zip_path)
        
    if os.path.exists(dev_mod_dir):
        shutil.rmtree(dev_mod_dir, ignore_errors=True)
        os.makedirs(dev_mod_dir, exist_ok=True)

    os.makedirs(os.path.join(project_path, "prototypes", "autogen"), exist_ok=True)
    os.makedirs(os.path.join(project_path, "controls", "autogen"), exist_ok=True)
    sendBuildLog(
        socketio, f"Build starting for project with id: {projectId}", logType="info"
    )
    sendBuildLog(
        socketio,
        f"""Retrived Project Registry:
        -{len(project_content["items"])} Item/s
        -{len(project_content["recipes"])} Recipes/s
        -{len(project_content["tech"])} Technology/s
        -{len(project_content["commands"])} Command/s
    """,
    )
    sendBuildLog(socketio, f"Building into: {project_path}", logType="info")
    sendBuildLog(socketio, "Building Items...")
    build_lua.process_items(socketio, project_content["items"], project_path)
    sendBuildLog(socketio, "Building Recipes...")
    build_lua.process_recipes(socketio, project_content["recipes"], project_path)
    sendBuildLog(socketio, "Building Research...")
    build_lua.process_tech(socketio, project_content["tech"], project_path)
    sendBuildLog(socketio, "Building Commands...")
    build_lua.process_command_control(socketio, project_content["commands"], project_path)
    
    #packaging the mod
    sendBuildLog(socketio, "Packaging...")
    zip_dir(build_output_zip_path, project_path)
    sendBuildLog(socketio, "Packaged!", overrideLast=True)

    end = time.perf_counter()
    elapsed = end - start
    sendBuildLog(
        socketio, f"BUILD DONE! TOOK {format_elapsed(elapsed)}", logType="success"
    )
