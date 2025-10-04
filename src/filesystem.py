import os

from src.fs_config import fileIcons, ext_to_editor
from src.projects import getProjectRegister

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def normalize_path(path):
    return path.replace("\\", "/")

def get_full_file_path(relative_path, project):
    base_path = os.path.join(main_dir, "projects", getProjectRegister()[int(project)])
    if relative_path.startswith("//"):
        relative_path = relative_path[2:]
    if relative_path.startswith("/"):
        relative_path = relative_path[1:]
    return os.path.join(base_path, relative_path)


def get_file_tree(real_path, display_base):
    def is_readonly(path):
        return not os.access(path, os.W_OK)

    relative_path = os.path.relpath(real_path, display_base)
    is_root = relative_path == "." or os.path.abspath(real_path) == os.path.abspath(
        display_base
    )
    read_only = is_readonly(real_path)
    path = "/" if is_root else normalize_path(relative_path)

    if path == "prototypes/autogen":
        read_only = True

    tree = {
        "name": os.path.basename(os.path.abspath(real_path))
        if is_root
        else os.path.basename(real_path),
        "path": path,
        "type": "folder",
        "is_readonly": read_only,
        "children": [],
    }

    try:
        entries = os.listdir(real_path)
        sorted_entries = sorted(
            entries,
            key=lambda e: (
                not os.path.isdir(os.path.join(real_path, e)),  # Folders first
                e.lower(),  # Alphabetical
            ),
        )

        for entry in sorted_entries:
            full_path = os.path.join(real_path, entry)
            if os.path.isdir(full_path):
                tree["children"].append(get_file_tree(full_path, display_base))
            else:
                ext = os.path.splitext(full_path)[1].lower()
                read_only = is_readonly(full_path)
                hidden = False
                path = normalize_path(os.path.relpath(full_path, display_base))
                if "fmcs-auto-" in entry or path == "data.lua":
                    read_only = True
                if ".hidden." in entry:
                    hidden = True
                tree["children"].append(
                    {
                        "name": entry,
                        "path": path,
                        "type": "file",
                        "hidden": hidden,
                        "icon": fileIcons(full_path),
                        "preferred_editor": ext_to_editor.get(ext, "TextEditor"),
                        "is_readonly": read_only,
                        "extension": ext,
                    }
                )
    except PermissionError:
        pass

    return tree
