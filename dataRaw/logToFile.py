# Converts a factorio-current.log with the mod DataRawSerpent by Bilka
# into a json parsaple text snippet
# for further parsing use fileToJson.py and then jsontest.py to convert to inv.json used in item picker

file_path = './factorio-current.log'
output_path = 'data_raw.txt'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '@__DataRawSerpent__/data-final-fixes.lua:1:'
end_marker = '--[[incomplete output with shared/self-references skipped]]'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    extracted_section = content[start_idx + len(start_marker):end_idx].strip()
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(extracted_section)
    
    print(f"Data saved to {output_path}")
else:
    print("Markers not found in file.")
