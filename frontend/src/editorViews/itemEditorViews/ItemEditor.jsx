import React, { useState, forwardRef, useImperativeHandle } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Label from "@/components/Label";
import HelpIcon from "@/components/HelpIcon";
import SubGroupSelect from "@/components/selects/SubGroupSelect";
import IconSelect from "@/components/selects/IconSelect";
import NumberInput from "@/components/NumberInput";

const ItemEditor = forwardRef(
  ({ item, handleChange, handleSaveChanges }, ref) => {
    const [values, setValues] = useState({
      name: item.name,
      subgroup: item.subgroup,
      icon: item.icon,
      icon_size: 64,
      order: item.order,
      stack_size: Number(item.stack_size),
    });

    // Imperative handlers
    useImperativeHandle(ref, () => ({
      getContent: () => values,
      validate: () => {
        const nameRegex = /^[A-Za-z0-9-]+$/;
        if (!values.name.trim()) return "Item name is required";
        if (!nameRegex.test(values.name))
          return "Name can only contain letters, numbers, and hyphens";
        if (!values.subgroup) return "Please select a sub group";
        if (!values.icon) return "Please select an icon";
        if (!values.stack_size || values.stack_size <= 0)
          return "Stack size must be one or more";
        return true;
      },
    }));

    const handleNameInput = (e) => {
      const value = e.target.value.replace(/[^A-Za-z0-9-]/g, "");
      setValues((prev) => ({ ...prev, name: value }));
      handleChange();
    };

    const handleSubGroupChange = (value) => {
      setValues((prev) => ({ ...prev, subgroup: value }));
      handleChange();
    };

    const handleIconChange = (value) => {
      setValues((prev) => ({ ...prev, icon: value }));
      handleChange();
    };

    const handleStackSizeChange = (value) => {
      setValues((prev) => ({ ...prev, stack_size: value }));
      handleChange();
    };

    return (
      <div>
        <div className="flex justify-end w-full">
          <Button
            type="blue"
            title="Strg+S"
            onClick={() => handleSaveChanges()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="w-4 h-4" /> Save
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Label>
              Item Name:
              <HelpIcon>
                Item name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input value={values.name} onChange={handleNameInput} />
          </div>

          <div>
            <Label>
              Sub Group:
              <HelpIcon>The tab where the item is shown in inventory</HelpIcon>
            </Label>
            <SubGroupSelect
              value={values.subgroup}
              onChange={handleSubGroupChange}
            />
          </div>

          <div>
            <Label>
              Icon:
              <HelpIcon>The icon representing this item</HelpIcon>
            </Label>
            <IconSelect value={values.icon} onChange={handleIconChange} />
          </div>

          <div>
            <Label>
              Stack Size:
              <HelpIcon>How many of the item can be in one slot</HelpIcon>
            </Label>
            <NumberInput
              value={values.stack_size}
              onChange={handleStackSizeChange}
              max={99999}
              min={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 mt-5 gap-2">
          <Textarea value={"OLD \n" + JSON.stringify(item, null, 2)} />
          <Textarea value={"NEW \n" + JSON.stringify(values, null, 2)} />
        </div>
      </div>
    );
  }
);

export default ItemEditor;
