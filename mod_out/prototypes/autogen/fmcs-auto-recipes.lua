data:extend({
    {
        type = "recipe",
        name = "fmc-wood-stone-recipe",
        enabled = true,
        energy_required = 1,
        ingredients = {
            { type = "item", name = "wood", amount = 1 },
        },
        results = {
            { type = "item", name = "stone", amount = 1 },
        },
    },
    {
        type = "recipe",
        name = "fmc-iron-copper-circuit-recipe",
        enabled = true,
        energy_required = 2,
        ingredients = {
            { type = "item", name = "iron-plate", amount = 2 },
            { type = "item", name = "copper-plate", amount = 1 },
        },
        results = {
            { type = "item", name = "electronic-circuit", amount = 1 },
        },
    },
})