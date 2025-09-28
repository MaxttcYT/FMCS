from PIL import Image

def create_icon_strip(input_path, output_path):
    with Image.open(input_path) as img:

        original_size = img.size
        print(f"Original Bildgröße: {original_size}")

        resized_images = {
            "original": img,
            "32x32": img.resize((32, 32), Image.NEAREST),
            "16x16": img.resize((16, 16), Image.NEAREST),
            "8x8": img.resize((8, 8), Image.NEAREST),
        }

        strip_width = original_size[0] + 32 + 16 + 8
        strip_height = max(original_size[1], 32, 16, 8)

        strip = Image.new("RGBA", (strip_width, strip_height))

        strip.paste(resized_images["original"], (0, 0))
        strip.paste(resized_images["32x32"], (original_size[0], 0))
        strip.paste(resized_images["16x16"], (original_size[0] + 32, 0))
        strip.paste(resized_images["8x8"], (original_size[0] + 32 + 16, 0))
        
        strip.save(output_path)
        strip.show()
        print(f"Fertig gespeichert: {output_path}")

create_icon_strip(
    "./static/defaultProject/graphics/fmcs-item.png",
    "./static/defaultProject/graphics/strip.png"
)
