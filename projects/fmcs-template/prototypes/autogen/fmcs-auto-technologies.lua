data:extend({
    {
        type = "technology",
        name = "super-metallurgy",
        icon = "__base__/graphics/technology/steel-processing.png",
        icon_size = 256,
        prerequisites = { "steel-processing" },
        effects = {
            { type = "unlock-recipe", recipe = "fmc-test-item-recipe" },
        },
        unit = {
            time = 30,
            ingredients = {
                { "automation-science-pack", 1 },
                { "logistic-science-pack", 1 },
            },
            count = 50,
        },
        order = "c-a",
    },
})