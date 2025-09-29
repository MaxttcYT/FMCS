from colorama import Fore, Back

def sendBuildLog(socketio, content, logType="default", overrideLast=False):
    log_styles = {
        "info": Fore.BLUE
        + Back.BLUE,  # bg-blue/20 -> LIGHTBLACK_EX (approx), text-blue -> Fore.BLUE
        "default": Fore.WHITE,
        "error": Fore.RED
        + Back.RED,  # bg-red/20 -> LIGHTBLACK_EX (approx), text-red -> Fore.RED
        "success": Fore.GREEN
        + Back.GREEN,  # bg-green-light/30 -> LIGHTGREEN_EX, text-green-light -> Fore.GREEN
    }

    print("[BUILD LOG]: " + log_styles[logType] + content)
    print("", end="")
    socketio.emit(
        "build_log",
        {"content": content, "logType": logType, "overrideLast": overrideLast},
    )
