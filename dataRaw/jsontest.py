import json

# Load JSON data
with open("dataRaw.json", "r", encoding="utf-8") as f:
    python_dict = json.load(f)


def sort_key(key, value):
    order = value.get("order", "")
    return (order, key)


item_dict = {
    **python_dict["item"],
    **python_dict["ammo"],
    **python_dict["gun"],
    **python_dict["ammo-turret"],
    **python_dict["rail-planner"],
    **python_dict["item-with-entity-data"],
    **python_dict["capsule"],
    **python_dict["repair-tool"],
    **python_dict["blueprint"],
    **python_dict["blueprint-book"],
    **python_dict["upgrade-item"],
    **python_dict["deconstruction-item"],
    **python_dict["module"],
    **python_dict["armor"],
}

item_name_filter = [
    "empty-module-slot",
    "science",
    "spidertron-rocket-launcher-1",
    "spidertron-rocket-launcher-2",
    "spidertron-rocket-launcher-3",
    "spidertron-rocket-launcher-4",
    "tank-cannon",
    "tank-flamethrower",
    "tank-machine-gun",
    "vehicle-machine-gun",
    "artillery-wagon-cannon",
    # WEIRD "OTHER" TAB STUFF
    "electric-energy-interface",
    "proxy-container",
    "bottomless-chest",
    "simple-entity-with-force",
    "simple-entity-with-owner",
]

# Step 1: sort groups
groups = sorted(
    python_dict["item-group"].items(), key=lambda item: sort_key(item[0], item[1])
)

# Step 2: sort subgroups
subgroups = sorted(
    python_dict["item-subgroup"].items(), key=lambda item: sort_key(item[0], item[1])
)

# Step 3: sort items
items = sorted(item_dict.items(), key=lambda item: sort_key(item[0], item[1]))

for i_key, i_val in items:
    i_val["fmcs_item_type"] = "base"

# Step 4: build hierarchy
hierarchy = {}

for g_key, g_val in groups:
    hierarchy[g_key] = {"data": g_val, "subgroups": {}}

    group_subgroups = [
        (sg_key, sg_val) for sg_key, sg_val in subgroups if sg_val.get("group") == g_key
    ]

    for sg_key, sg_val in group_subgroups:
        hierarchy[g_key]["subgroups"][sg_key] = {"data": sg_val, "items": {}}

        subgroup_items = [
            (i_key, i_val)
            for i_key, i_val in items
            if i_val.get("subgroup") == sg_key and i_key not in item_name_filter
        ]

        for i_key, i_val in subgroup_items:
            hierarchy[g_key]["subgroups"][sg_key]["items"][i_key] = i_val

# Step 5: filter out empty subgroups
for g_key in list(hierarchy.keys()):
    subgroups = hierarchy[g_key]["subgroups"]

    # remove subgroups with no items
    for sg_key in list(subgroups.keys()):
        if not subgroups[sg_key]["items"]:
            del subgroups[sg_key]

    # remove groups with no subgroups left
    if not subgroups:
        del hierarchy[g_key]


# Save hierarchy JSON
with open("inv.json", "w", encoding="utf-8") as f:
    json.dump(hierarchy, f, indent=2, ensure_ascii=False)


# Build Markdown content (alphabetically sorted with ~ fallback)
markdown_content = "# Data.raw\n"
for g_key, g_data in hierarchy.items():
    markdown_content += f"\n## {g_key}\n"

    for sg_key, sg_data in g_data["subgroups"].items():
        markdown_content += f"\n### {sg_key}\n"

        for i_key in sg_data["items"].keys():
            markdown_content += f"- {i_key}\n"

# Write Markdown file
with open("output.md", "w", encoding="utf-8") as md_file:
    md_file.write(markdown_content)

print("Markdown file 'output.md' created!")

items_json = {}

for i_key, i_val in items:
    if i_key not in item_name_filter:
        items_json[i_key] = i_val

with open("items.json", "w", encoding="utf-8") as f:
    json.dump(items_json, f, indent=2, ensure_ascii=False)

print("items.json created!")
