from src.factorio import start_factorio_preview
import shutil
import zipfile
import os

def zip_dir(zip_filename, dir_to_zip): 
    top_folder = os.path.splitext(os.path.basename(zip_filename))[0]

    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dir_to_zip):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, dir_to_zip)
                arcname = os.path.join(top_folder, rel_path)
                zipf.write(file_path, arcname)
                
script_dir = os.path.dirname(os.path.abspath(__file__))
source_dir = os.path.join(script_dir, "static", "defaultProject")
renamed_dir = os.path.join(script_dir, ".mod-preview", "dev-mod", "fmcs-template_1.0.0")
zip_path = os.path.join(script_dir, ".mod-preview", "dev-mod", "fmcs-template_1.0.0.zip")

#Remove old build zip
if os.path.exists(zip_path):
    os.remove(zip_path)

#Remove old build folder
if os.path.exists(renamed_dir):
    shutil.rmtree(renamed_dir)
    
#Copy project to build dir
shutil.copytree(source_dir, renamed_dir)

#Package project to zip
zip_dir(zip_path, renamed_dir)

#Remove the build folder
shutil.rmtree(renamed_dir)

start_factorio_preview()