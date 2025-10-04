import os

def fileIcons(filepath):
    filename = os.path.basename(filepath)
    extension = os.path.splitext(filename)[1].lower().strip(".") or filename
    if filename.startswith("."):
        extension = filename.strip(".")

    icons = {
        "lua": ("Lua", "extension/.lua"),
        "png": ("Image", "extension/.png"),
        "txt": ("Default", "extension/.txt"),
        "json": ("JSON", "extension/.json"),
        "gitignore": ("Git", "extension/.gitignore"),
        "cfg": ("Config", "extension/.cfg"),
        "license": ("License", "default"),
        "md": ("Markdown", "extension/.md"),
        "xml": ("XML", "extension/.xml"),
    }
    icon, ext = icons.get(extension.lower(), ("Default", "extension/.txt"))
    return {"icon": icon, "extension": ext}


ext_to_editor = {
    ".lua": "LuaEditor",
    ".md": "MdEditor",
    ".png": "ImgViewer",
    ".jpg": "ImgViewer",
    ".json": "JsonEditor",
    ".xml": "XmlEditor",
    ".cfg": "CfgEditor",
}
