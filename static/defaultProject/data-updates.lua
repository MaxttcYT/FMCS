-- Update existing definitions here

--Example: updates iron ore to stack size 1000
local function update_item_prototype()
    local item = data.raw["item"]["iron-ore"]
    if item then
      item.stack_size = 1000
    end
  end
  
  update_item_prototype()