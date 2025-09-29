import src.tolua as tolua
import src.formatter as formatter
import os
from src.build_logging import sendBuildLog

save_prefix = "fmcs-auto-"

def process_recipes(socketio, recipes, output_dir):
    result_recipes = []

    for i, recipe in enumerate(recipes, start=1):
        sendBuildLog(socketio, f"{recipe['name']} - {i}/{len(recipes)}")
        recipe_lua = tolua.lua_recipe(recipe)
        result_recipes.append(recipe_lua)

    data_extend_block = tolua.lua_data_extend(result_recipes)
    formatted_out = formatter.format_lua(data_extend_block)

    with open(
        os.path.join(
            output_dir, "prototypes", "autogen", f"{save_prefix}recipes.lua"
        ),
        "w",
    ) as f:
        f.write(formatted_out)


def process_items(socketio, items, output_dir):
    result_items = []

    for i, item in enumerate(items, start=1):
        sendBuildLog(socketio, f"{item['name']} - {i}/{len(items)}")
        item_lua = tolua.lua_item(item)
        result_items.append(item_lua)

    data_extend_block = tolua.lua_data_extend(result_items)
    formatted_out = formatter.format_lua(data_extend_block)

    with open(
        os.path.join(
            output_dir, "prototypes", "autogen", f"{save_prefix}items.lua"
        ),
        "w",
    ) as f:
        f.write(formatted_out)


def process_tech(socketio, technologies, output_dir):
    result_technologies = []

    for i, technology in enumerate(technologies, start=1):
        sendBuildLog(socketio, f"{technology['name']} - {i}/{len(technologies)}")
        technology_lua = tolua.lua_technology(technology)
        result_technologies.append(technology_lua)

    data_extend_block = tolua.lua_data_extend(result_technologies)

    formatted_out = formatter.format_lua(data_extend_block)

    with open(
        os.path.join(
            output_dir, "prototypes", "autogen", f"{save_prefix}technologies.lua"
        ),
        "w",
    ) as f:
        f.write(formatted_out)
        
def process_command_control(socketio, commands, output_dir):
    result_commands = []

    for i, command in enumerate(commands, start=1):
        sendBuildLog(socketio, f"{command['name']} - {i}/{len(commands)}")
        command_lua = tolua.lua_command(command)
        result_commands.append(command_lua)
        

    final_lua = "\n".join(result_commands)
    formatted_out = formatter.format_lua(final_lua)

    with open(os.path.join(output_dir, "controls", "autogen", f"{save_prefix}commands.lua"), "w") as f:
        f.write(formatted_out)