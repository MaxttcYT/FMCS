
data:extend({
  -- Example of a new item
  {
    type = "item",
    name = "fmcs-test-item",
    icon = "__fmcs-template__/graphics/icons/fmcs-item.png",
    icon_size = 64,
    subgroup = "raw-resource",
    order = "z[u]",
    stack_size = 100
  },
  {
    type = "recipe",
    name = "fmcs-test-item",
    enabled = true,
    energy_required = 1, -- time to craft in seconds (at crafting speed 1)
    ingredients = {
      {type = "item", name = "wood", amount = 1},
    },
    results = {{type = "item", name = "fmcs-test-item", amount = 1}}
  }
});