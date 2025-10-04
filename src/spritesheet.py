from PIL import Image


def create_icon_strip(input_path, output_path):
    with Image.open(input_path) as img:
        original_size = img.size
        print(f"Original Bildgröße: {original_size}")

        resized_images = {
            "64x64": img.resize((64, 64), Image.NEAREST),
            "32x32": img.resize((32, 32), Image.NEAREST),
            "16x16": img.resize((16, 16), Image.NEAREST),
            "8x8": img.resize((8, 8), Image.NEAREST),
        }

        strip_width = 64 + 32 + 16 + 8
        strip_height = max(64, 32, 16, 8)

        strip = Image.new("RGBA", (strip_width, strip_height))

        strip.paste(resized_images["64x64"], (0, 0))
        strip.paste(resized_images["32x32"], (64, 0))
        strip.paste(resized_images["16x16"], (64 + 32, 0))
        strip.paste(resized_images["8x8"], (64 + 32 + 16, 0))

        strip.save(output_path)
        strip.show()
        print(f"Fertig gespeichert: {output_path}")


def create_tech_strip(input_path, output_path):
    with Image.open(input_path) as img:
        original_size = img.size
        print(f"Original Bildgröße: {original_size}")

        resized_images = {
            "256x256": img.resize((256, 256), Image.NEAREST),
            "128x128": img.resize((128, 128), Image.NEAREST),
            "64x64": img.resize((64, 64), Image.NEAREST),
            "32x32": img.resize((32, 32), Image.NEAREST),
        }

        strip_width = 256 + 128 + 64 + 32
        strip_height = max(256, 128, 64, 32)

        strip = Image.new("RGBA", (strip_width, strip_height))

        strip.paste(resized_images["256x256"], (0, 0))
        strip.paste(resized_images["128x128"], (256, 0))
        strip.paste(resized_images["64x64"], (256 + 128, 0))
        strip.paste(resized_images["32x32"], (256 + 128 + 64, 0))

        strip.save(output_path)
        strip.show()
        print(f"Fertig gespeichert: {output_path}")


if __name__ == "__main__":
    create_icon_strip(
        "../projects/defaultProject/graphics/icons/iron-spring.png",
        "../projects/defaultProject/graphics/icons/iron-spring-strip.png",
    )
