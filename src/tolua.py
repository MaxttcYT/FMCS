def lua_item_list(items):
    return ",".join(
        f'{{ type = "item", name = "{item["name"]}", amount = {item["amount"]} }}'
        for item in items
    )


def lua_effect_list(effects):
    return ",".join(
        f'{{ type = "{effect["type"]}", recipe = "{effect["recipe"]}" }}'
        for effect in effects
    )


def lua_unit_ingredient_list(ingredients):
    return ",".join(
        f'{{"{ingredient[0]}", {ingredient[1]} }}'
        for ingredient in ingredients
    )


def lua_recipe(recipe):
    enabled = "true" if recipe["enabled"] else "false"
    return (
        f"{{\n"
        f'    type = "recipe",\n'
        f'    name = "{recipe["name"]}",\n'
        f"    enabled = {enabled},\n"
        f"    energy_required = {recipe['energy_required']},\n"
        f"    ingredients = {{\n"
        f"        {lua_item_list(recipe['ingredients'])}\n"
        f"    }},\n"
        f"    results = {{\n"
        f"        {lua_item_list(recipe['results'])}\n"
        f"    }}\n"
        f"}}"
    )

def lua_command(command):
    return (
        f'    commands.add_command("hello", "Says hello", function(command)\n'
        f'        {command["code"]}\n'
        f'    end)\n'
    )

def lua_item(item):
    return (
        f"{{\n"
        f'    type = "item",\n'
        f'    name = "{item["name"]}",\n'
        f'    icon = "{item["icon"]}",\n'
        f"    icon_size = {item['icon_size']},\n"
        f'    subgroup = "{item["subgroup"]}",\n'
        f'    order = "{item["order"]}",\n'
        f"    stack_size = {item['stack_size']},\n"
        f"}}"
    )


def lua_technology(tech):
    prereq_str = ", ".join(f'"{p}"' for p in tech["prerequisites"])

    return (
        f"{{\n"
        f'    type = "technology",\n'
        f'    name = "{tech["name"]}",\n'
        f'    icon = "{tech["icon"]}",\n'
        f"    icon_size = {tech['icon_size']},\n"
        f"    prerequisites = {{ {prereq_str} }},\n"
        f"    effects = {{\n"
        f"        {lua_effect_list(tech['effects'])}\n"
        f"    }},\n"
        f"    unit = {{\n"
        f"        time = {tech['unit']['time']},\n"
        f"        ingredients = {{\n"
        f"            {lua_unit_ingredient_list(tech['unit']['ingredients'])}\n"
        f"        }},\n"
        f"        count = {tech['unit']['count']},\n"
        f"    }},\n"
        f'    order = "{tech["order"]}",\n'
        f"}}"
    )


def lua_data_extend(items):
    def indent_lines(s, level=1):
        indent = "    " * level
        return "\n".join(
            indent + line if line.strip() else line for line in s.splitlines()
        )

    indented_items = ",\n".join(indent_lines(e, 1) for e in items)
    return "data:extend({\n" + indented_items + "\n})"
