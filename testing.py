recipes = [
    {
        "name": "fmc-wood-stone-recipe",
        "enabled": True,
        "energy_required": 1,
        "ingredients": [
            {
                "type": "item",
                "name": "wood",
                "amount": 1,
            }
        ],
        "results": [{"type": "item", "name": "stone", "amount": 1}],
    },
    {
        "name": "fmc-iron-copper-circuit-recipe",
        "enabled": True,
        "energy_required": 2,
        "ingredients": [
            {
                "type": "item",
                "name": "iron-plate",
                "amount": 2,
            },
            {
                "type": "item",
                "name": "copper-plate",
                "amount": 1,
            },
        ],
        "results": [{"type": "item", "name": "electronic-circuit", "amount": 1}],
    },
]


def lua_item_list(items, indent=12):
    spaces = " " * indent
    return f",\n{spaces}".join(
        f'{{ type = "item", name = "{item["name"]}", amount = {item["amount"]} }}'
        for item in items
    )


def lua_recipe(recipe, indent=4):
    spaces = " " * indent
    enabled = "true" if recipe["enabled"] else "false"
    return (
        f"{spaces}{{\n"
        f'{spaces}    type = "recipe",\n'
        f'{spaces}    name = "{recipe["name"]}",\n'
        f"{spaces}    enabled = {enabled},\n"
        f"{spaces}    energy_required = {recipe['energy_required']},\n"
        f"{spaces}    ingredients = {{\n"
        f"{spaces}        {lua_item_list(recipe['ingredients'], indent + 8)}\n"
        f"{spaces}    }},\n"
        f"{spaces}    results = {{\n"
        f"{spaces}        {lua_item_list(recipe['results'], indent + 8)}\n"
        f"{spaces}    }}\n"
        f"{spaces}}}"
    )


def lua_data_extend(recipes):
    return "data:extend({\n" + ",\n".join(lua_recipe(r) for r in recipes) + "\n})"


print(lua_data_extend(recipes))
