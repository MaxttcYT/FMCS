
import os

main_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

key_type_map = {
    "recipes": "recipe",
    "items": "item",
    "tech": "technology",
    "commands": "command",
    "icons": "icon",
}


def flatten_registry(obj):
    flat_list = []

    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, list):
                t = key_type_map.get(k, None)
                for item in v:
                    if isinstance(item, dict) and t and "type" not in item:
                        item["type"] = t
                    flat_list.extend(flatten_registry(item))
            elif isinstance(v, dict):
                flat_list.extend(flatten_registry(v))
        # Include the current dict itself if it has a type
        if "type" in obj:
            flat_list.append(obj)

    elif isinstance(obj, list):
        for item in obj:
            flat_list.extend(flatten_registry(item))

    return flat_list


def apply_fmcs_references(data):
    items_lookup = {}

    # Build a lookup table of all objects with FMCS_ID
    def build_lookup(obj):
        if isinstance(obj, dict):
            fmcs_id = obj.get("FMCS_ID") or obj.get("fmcs_id")
            # Only store objects that are not just references
            if fmcs_id and "FIELDS" not in obj and "FMCS_REFERENCES" not in obj:
                items_lookup[fmcs_id] = obj
            for value in obj.values():
                build_lookup(value)
        elif isinstance(obj, list):
            for item in obj:
                build_lookup(item)

    build_lookup(data)

    # Apply FMCS_REFERENCES before recursing
    def apply_references(obj):
        if isinstance(obj, dict):
            # Apply FMCS_REFERENCES first
            refs = obj.get("FMCS_REFERENCES")
            if refs and isinstance(refs, list):
                for ref in refs:
                    ref_id = ref.get("FMCS_ID")
                    fields_to_copy = ref.get("FIELDS", [])
   
                    if ref_id in items_lookup:
                        source_obj = items_lookup[ref_id]

                        for field in fields_to_copy:
                            # Field mapping ["source_field", "dest_field"]
                            if isinstance(field, list) and len(field) == 2:
                                src_field, dest_field = field
                                if src_field in source_obj:
                                    obj[dest_field] = source_obj[src_field]
                            # Single-field copy
                            elif isinstance(field, str):
                                if field in source_obj:
                                    obj[field] = source_obj[field]

            # Then recurse into all values
            for value in obj.values():
                apply_references(value)
        elif isinstance(obj, list):
            for item in obj:
                apply_references(item)

    apply_references(data)
    return data


def resolve_project_registry(registry):
    return apply_fmcs_references(registry)
