from slpp import slpp as lua
import json

lua_table = """
{
    name = "Max",
    age = 25,
    skills = {"Python", "Lua", "JS"}
}
"""

with open("data_raw.txt", 'r', encoding='utf-8') as f:
    data = f.read()


# Convert Lua table string to Python dict
python_dict = lua.decode(data)

# Convert Python dict to JSON
with open("dataRaw.json", "w") as f:
    json.dump(python_dict, f, indent=4)
    
for key in python_dict.keys():
    print(key)
    
print(python_dict["item"])
print("\n\n\n")
print(json.dumps(python_dict["item"]))
item_keys=list(python_dict["item"].keys())
print(item_keys)
print(len(item_keys))
print("\n\n\n")
print(json.dumps(item_keys[5]))
print(json.dumps(python_dict["item"]["assembling-machine-1"]))