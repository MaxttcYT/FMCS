import subprocess
import os
import sys


def buildFrontend():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Define the path to the frontend directory
    frontend_path = os.path.join(script_dir, 'frontend')

    # Full path to npm (adjust to your system's actual path)
    npm_path = r'C:\Program Files\nodejs\npm.exe'

    # Save the current working directory to return to it later
    original_directory = os.getcwd()

    # Change working directory to the frontend directory
    os.chdir(frontend_path)

    # Run the Webpack build command with the full path to npm
    try:
        subprocess.run(['npm.cmd', 'run', 'build'], check=True)
        print(f"Webpack build completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while building the Webpack project: {e}")

    # Return to the original directory
    os.chdir(original_directory)


def build_exe():
    # Ensure you're in the right directory (where app.py is located)
    script_name = "app.py"  # Replace with the path to your main app file
    dist_dir = "dist"

    if not os.path.exists(dist_dir):
        os.makedirs(dist_dir)

    # Define the PyInstaller command
    pyinstaller_command = [
        "pyinstaller",
        "-w",
        "--onefile",  # Bundle everything into one executable
        "--add-data", "static;static",  # Adjust paths as necessary
        script_name
    ]

    # Run the command using subprocess
    try:
        subprocess.run(pyinstaller_command, check=True)
        print("Build complete. Executable is in the dist folder.")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred during build: {e}")
        sys.exit(1)


build_exe()
