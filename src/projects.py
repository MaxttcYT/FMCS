import os
import json
main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def getProjectRegister():
    project_dir = os.path.join(main_dir, "projects")
    register_dir = os.path.join(project_dir, "register.json")
    os.makedirs(project_dir, exist_ok=True)
    defaultProjectsFile = []
    # Check if the file exists, if not, create it
    if not os.path.exists(register_dir):
        with open(register_dir, "w") as f:
            json.dump(defaultProjectsFile, f, indent=4)

    with open(register_dir, "r+") as f:
        content = f.read()
        try:
            data = json.loads(content)
            return data
        except Exception:
            f.seek(0)
            json.dump(defaultProjectsFile, f, indent=4)
            return defaultProjectsFile