import src.config as settings
import os
import shutil
from tqdm import tqdm

script_dir = os.path.dirname(os.path.abspath(__file__))

factorio_path = settings.getSetting("FACTORIO_PATH")

def copyGraphics(graphic_path, graphic_out_path):
    os.makedirs(graphic_out_path, exist_ok=True)

    # Delete all contents in the target directory
    for item in tqdm(os.listdir(graphic_out_path), desc=f"Cleaning {graphic_out_path}"):
        item_path = os.path.join(graphic_out_path, item)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)

    # Copy files with progress bar
    for item in tqdm(os.listdir(graphic_path), desc=f"Copying {graphic_path}"):
        src_path = os.path.join(graphic_path, item)
        dst_path = os.path.join(graphic_out_path, item)
        if os.path.isdir(src_path):
            shutil.copytree(src_path, dst_path, dirs_exist_ok=True)
        else:
            shutil.copy2(src_path, dst_path)

# Base graphics
graphic_path = os.path.join(factorio_path, "data", "base", "graphics")
graphic_out_path = os.path.join(script_dir, "static", "factorioAssets", "base", "graphics")
copyGraphics(graphic_path, graphic_out_path)

# Core graphics
graphic_path = os.path.join(factorio_path, "data", "core", "graphics")
graphic_out_path = os.path.join(script_dir, "static", "factorioAssets", "core", "graphics")
copyGraphics(graphic_path, graphic_out_path)
