import HelpIcon from "@/components/HelpIcon";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { WizardContent, WizardStep } from "@/components/Wizard";
import { useState, useEffect } from "react";
import SubGroupSelect from "@/components/selects/SubGroupSelect";
import NumberInput from "@/components/NumberInput";
import IconSelect from "@/components/selects/IconSelect";
import React from "react";
import { CheckIcon } from "lucide-react";

export function ItemConfigWizardStep({ ...props }) {
  const [values, setValues] = useState({
    name: "",
    subgroup: "",
    icon: "",
    stackSize: 100,
  });

  const handleChange = (field) => (value) => {
    setValues((prev) => {
      const newValues = { ...prev, [field]: value };
      return newValues;
    });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z0-9-]+$/;

    if (!values.name.trim()) return "Item name is required";
    if (!nameRegex.test(values.name))
      return "Name can only contain letters, numbers, and hyphens";
    if (!values.subgroup) return "Please select a sub group";
    if (!values.icon) return "Please select an icon";
    if (!values.stackSize || values.stackSize <= 0)
      return "Stack size must be one or more";
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow letters, numbers, and hyphens
    const filtered = value.replace(/[^A-Za-z0-9-]/g, "");
    setValues((prev) => ({ ...prev, name: filtered }));
  };

  return (
    <WizardStep validate={validate} {...props}>
      <WizardContent>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="newItem-name">
              Item Name:
              <HelpIcon>
                Item name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input
              id="newItem-name"
              value={values.name}
              onChange={(e) => {
                handleChange("name")(e.target.value);
                handleNameChange(e);
              }}
            />
          </div>

          <div>
            <Label htmlFor="newItem-subgroup">
              Sub Group:
              <HelpIcon>The tab where the item is shown in inventory</HelpIcon>
            </Label>
            <SubGroupSelect
              id="newItem-subgroup"
              value={values.subgroup}
              onChange={handleChange("subgroup")}
            />
          </div>

          <div>
            <Label htmlFor="newItem-icon">
              Icon:
              <HelpIcon>The icon representing this item</HelpIcon>
            </Label>
            <IconSelect
              id="newItem-icon"
              value={values.icon}
              onChange={handleChange("icon")}
            />
          </div>

          <div>
            <Label htmlFor="newItem-stacksize">
              Stack Size:
              <HelpIcon>How many of the item can be in one slot</HelpIcon>
            </Label>
            <NumberInput
              id="newItem-stacksize"
              value={values.stackSize}
              onChange={handleChange("stackSize")}
              max={99999}
              min={1}
            />
          </div>
        </div>
      </WizardContent>
    </WizardStep>
  );
}

export function RecipeConfigWizardStep({ ...props }) {
  const [values, setValues] = useState({
    name: "",
    energy_required: 1,
    ingredients: [],
    results: [],
  });

  const handleChange = (field) => (value) => {
    setValues((prev) => {
      const newValues = { ...prev, [field]: value };
      return newValues;
    });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z0-9-]+$/;

    if (!values.name.trim()) return "Item name is required";
    if (!nameRegex.test(values.name))
      return "Name can only contain letters, numbers, and hyphens";
    if (!values.subgroup) return "Please select a sub group";
    if (!values.icon) return "Please select an icon";
    if (!values.stackSize || values.stackSize <= 0)
      return "Stack size must be one or more";
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow letters, numbers, and hyphens
    const filtered = value.replace(/[^A-Za-z0-9-]/g, "");
    setValues((prev) => ({ ...prev, name: filtered }));
  };

  return (
    <WizardStep validate={validate} {...props}>
      <WizardContent>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="newItem-name">
              Item Name:
              <HelpIcon>
                Item name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input
              id="newItem-name"
              value={values.name}
              onChange={(e) => {
                handleChange("name")(e.target.value);
                handleNameChange(e);
              }}
            />
          </div>

          <div>
            <Label htmlFor="newItem-subgroup">
              Sub Group:
              <HelpIcon>The tab where the item is shown in inventory</HelpIcon>
            </Label>
            <SubGroupSelect
              id="newItem-subgroup"
              value={values.subgroup}
              onChange={handleChange("subgroup")}
            />
          </div>

          <div>
            <Label htmlFor="newItem-icon">
              Icon:
              <HelpIcon>The icon representing this item</HelpIcon>
            </Label>
            <IconSelect
              id="newItem-icon"
              value={values.icon}
              onChange={handleChange("icon")}
            />
          </div>

          <div>
            <Label htmlFor="newItem-stacksize">
              Stack Size:
              <HelpIcon>How many of the item can be in one slot</HelpIcon>
            </Label>
            <NumberInput
              id="newItem-stacksize"
              value={values.stackSize}
              onChange={handleChange("stackSize")}
              max={99999}
              min={1}
            />
          </div>
        </div>
      </WizardContent>
    </WizardStep>
  );
}

export function GraphicConfigWizardStep({ ...props }) {
  const [values, setValues] = useState({
    name: "",
    subgroup: "",
    icon: "",
    stackSize: 100,
  });

  const handleChange = (field) => (value) => {
    setValues((prev) => {
      const newValues = { ...prev, [field]: value };
      return newValues;
    });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z0-9-]+$/;

    if (!values.name.trim()) return "Item name is required";
    if (!nameRegex.test(values.name))
      return "Name can only contain letters, numbers, and hyphens";
    if (!values.subgroup) return "Please select a sub group";
    if (!values.icon) return "Please select an icon";
    if (!values.stackSize || values.stackSize <= 0)
      return "Stack size must be one or more";
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow letters, numbers, and hyphens
    const filtered = value.replace(/[^A-Za-z0-9-]/g, "");
    setValues((prev) => ({ ...prev, name: filtered }));
  };

  return (
    <WizardStep validate={validate} {...props}>
      <WizardContent>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="newItem-name">
              Item Name:
              <HelpIcon>
                Item name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input
              id="newItem-name"
              value={values.name}
              onChange={(e) => {
                handleChange("name")(e.target.value);
                handleNameChange(e);
              }}
            />
          </div>

          <div>
            <Label htmlFor="newItem-subgroup">
              Sub Group:
              <HelpIcon>The tab where the item is shown in inventory</HelpIcon>
            </Label>
            <SubGroupSelect
              id="newItem-subgroup"
              value={values.subgroup}
              onChange={handleChange("subgroup")}
            />
          </div>

          <div>
            <Label htmlFor="newItem-icon">
              Icon:
              <HelpIcon>The icon representing this item</HelpIcon>
            </Label>
            <IconSelect
              id="newItem-icon"
              value={values.icon}
              onChange={handleChange("icon")}
            />
          </div>

          <div>
            <Label htmlFor="newItem-stacksize">
              Stack Size:
              <HelpIcon>How many of the item can be in one slot</HelpIcon>
            </Label>
            <NumberInput
              id="newItem-stacksize"
              value={values.stackSize}
              onChange={handleChange("stackSize")}
              max={99999}
              min={1}
            />
          </div>
        </div>
      </WizardContent>
    </WizardStep>
  );
}

export function SelectWizardStep({
  setSelected,
  selected,
  iconMapping,
  ...props
}) {
  const createableOptions = [
    {
      title: "Item",
      name: "item",
      icon: iconMapping.item,
      disabled: false,
    },
    {
      title: "Recipe",
      name: "recipe",
      icon: iconMapping.recipe,
      disabled: false,
    },
    {
      title: "Command",
      name: "command",
      icon: iconMapping.command,
      disabled: true,
    },
    {
      title: "Technology",
      name: "technology",
      icon: iconMapping.technology,
      disabled: true,
    },
    {
      title: "Custom",
      name: "custom",
      icon: iconMapping.custom,
      disabled: true,
    },
    {
      title: "Icon",
      name: "graphic",
      icon: iconMapping.graphic,
      disabled: true,
    },
  ];

  return (
    <WizardStep
      validate={() => {
        // return true if valid, or error message string
        return selected ? true : "Please Select One";
      }}
      {...props}
    >
      <WizardContent>
        <h1 className="text-dirty-white text-xl mb-4">
          What do you want to add:
        </h1>
        <div className="grid grid-cols-3 gap-3">
          {createableOptions.map((element, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 accentuated p-1 hover:bg-gray-dark cursor-pointer ${
                selected === element.name ? "bg-gray-dark" : ""
              } ${
                element.disabled
                  ? "bg-gray-light hover:bg-gray-light !cursor-not-allowed"
                  : ""
              }`}
              disabled={element.disabled}
              onClick={() => {
                if (!element.disabled) {
                  setSelected(element.name);
                }
              }}
            >
              <img src={element.icon} className="h-8" />
              <span>{element.title}</span>
            </div>
          ))}
        </div>
      </WizardContent>
    </WizardStep>
  );
}
