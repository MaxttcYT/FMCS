import os
import yaml
import sys

# Get the directory where the script is located
project_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

# Construct the full path to the YAML file
settings_file_path = os.path.join(project_dir, "settings.yaml")


def loadSettings(filepath):
    # Load the YAML file
    with open(filepath, "r") as file:
        data = yaml.safe_load(file)
    return data


def getSetting(key):
    settings = loadSettings(settings_file_path)
    return settings.get(key)


def settingsToDict():
    return loadSettings(settings_file_path)


def check_factorio_data_path_valid(data_path):
    if not (os.path.isdir(data_path) and os.path.exists(data_path)):
        return "FACTORIO_DATA_PATH is not valid!"


def check_factorio_path_valid(factorio_path):
    if not (os.path.isdir(factorio_path) and os.path.exists(factorio_path)):
        return "FACTORIO_PATH is not valid!"


def checkConfig():
    """Returns True or string when found error, else returns False"""
    settings_dict = settingsToDict()
    base_setting_keys = ["FACTORIO_PATH", "FACTORIO_DATA_PATH", "STARTUP_MODE"]
    steam_setting_keys_general = ["FACTORIO_STEAM_ID"]
    steam_setting_keys_win = ["FACTORIO_STEAM_ID", "STEAM_PATH"]

    binary_setting_keys = ["FACTORIO_BINARY_PATH"]

    missing_settings = [k for k in base_setting_keys if k not in settings_dict]

    # Missing base settings (every plattform, every installation)
    if missing_settings:
        return f"Some setting keys are missing!: {missing_settings}"

    # Wrong STARTUP_MODE
    if settings_dict["STARTUP_MODE"] not in ["STEAM", "BINARY"]:
        return f"STARTUP_MODE has to be one of STEAM, BINARY! Current value: {settings_dict['STARTUP_MODE']}"

    # STARTUP_MODE = "STEAM" specific checks
    if settings_dict["STARTUP_MODE"] == "STEAM":
        if sys.platform.startswith("win"):
            missing_steam_settings = [
                k for k in steam_setting_keys_win if k not in settings_dict
            ]
        else:
            missing_steam_settings = [
                k for k in steam_setting_keys_general if k not in settings_dict
            ]

        if missing_steam_settings:
            return f"Some setting keys are missing [STARTUP_MODE=STEAM SPECIFIC]!: {missing_steam_settings}"

        # Validate steam path on windows
        if sys.platform.startswith("win"):
            steam_path = settings_dict["STEAM_PATH"]
            if not (os.path.isfile(steam_path) and os.path.exists(steam_path)):
                return "STEAM_PATH is not valid [STARTUP_MODE=STEAM, PLATTFORM=WINDOWS SPECIFIC]!"

    # STARTUP_MODE = "BINARY" specific checks
    elif settings_dict["STARTUP_MODE"] == "BINARY":
        missing_binary_settings = [
            k for k in binary_setting_keys if k not in settings_dict
        ]

        if missing_binary_settings:
            return f"Some setting keys are missing [STARTUP_MODE=STEAM SPECIFIC]!: {missing_steam_settings}"

        # Validate binary path
        factorio_binary_path = settings_dict["FACTORIO_BINARY_PATH"]
        if not (
            os.path.isfile(factorio_binary_path)
            and os.path.exists(factorio_binary_path)
        ):
            return "FACTORIO_BINARY_PATH is not valid [STARTUP_MODE=BINARY SPECIFIC]!"

    factorio_data_path_problem = check_factorio_data_path_valid(
        settings_dict["FACTORIO_DATA_PATH"]
    )
    if factorio_data_path_problem:
        return factorio_data_path_problem

    factorio_path_problem = check_factorio_path_valid(settings_dict["FACTORIO_PATH"])
    if factorio_path_problem:
        return factorio_data_path_problem
    
    return False
