import os
import yaml

# Get the directory where the script is located
project_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

# Construct the full path to the YAML file
settings_file_path = os.path.join(project_dir, 'settings.yaml')

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