import src.config as settings
import os
import random
from PIL import Image

factorio_path = settings.getSetting("FACTORIO_PATH")
script_path = os.path.dirname(os.path.realpath(__file__))

icon_dir = os.path.join(factorio_path,"data","base","graphics","icons")

# List PNG files
png_files = [f for f in os.listdir(icon_dir) if f.lower().endswith(".png")]

if not png_files:
    print("No PNG files found.")
else:
    # Pick a random file
    random_file = random.choice(png_files)
    full_path = os.path.join(icon_dir, random_file)

    # Open the image
    with Image.open(full_path) as img:
        # Extract 64x64 area (top-left corner)
        area_64 = img.crop((0, 0, 64, 64))

        # Extract 16x6 area directly to the right (starts at x=64, y=0)
        area_32x32 = img.crop((64, 0, 64 + 32, 32))
        
        area_16x16 = img.crop((96, 0, 96 + 16, 16))

        area_8x8 = img.crop((112, 0, 112 + 8, 8))


        # Show both
        area_64.show(title="64x64 area")
        area_32x32.show(title="32x32 area")
        area_16x16.show(title="16x16 area")
        area_8x8.show(title="8x8 area")
        Image.open(full_path).show()