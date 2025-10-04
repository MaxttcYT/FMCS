import json

import os

from src.build_logging import sendBuildLog
import src.factorio as factorio
from src.projects import getProjectRegister
import src.build as modBuilder
from flask_socketio import SocketIO

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

socketio = SocketIO(cors_allowed_origins="*")

@socketio.on("start_factorio")
def start_factorio_socket(data):
    projectId = data["projectId"]
    project_dir = os.path.join(main_dir, "projects")
    register = getProjectRegister()
    with open(
        os.path.join(project_dir, register[int(projectId)], "info.json"), "r"
    ) as f:
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

def build_with_error_handling(socketio, projectId):
    try:
        modBuilder.startBuild(socketio, projectId)
    except Exception as e:
        tb = e.__traceback__
        while tb.tb_next:  # go to the last traceback frame
            tb = tb.tb_next
        filename = tb.tb_frame.f_code.co_filename
        lineno = tb.tb_lineno
        error_string = f"{type(e).__name__} in {filename}:{lineno} - {e}"
        sendBuildLog(socketio, str(error_string), logType="error")
        sendBuildLog(socketio, "TO GET DETAILED INFO, LOOK IN CONSOLE!", logType="info")
        sendBuildLog(socketio, str("BUILD FAILED!"), logType="error")
        raise e
        
@socketio.on("start_build")
def start_build_socket(data):
    print("start build for: " + str(data))
    socketio.start_background_task(
        target=build_with_error_handling, socketio=socketio, projectId=data["projectId"]
    )
    return "ok"

