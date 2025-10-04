import HelpIcon from "@/components/HelpIcon";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { WizardContent, WizardStep } from "@/components/Wizard";
import { useState, useEffect, useRef } from "react";
import SubGroupSelect from "@/components/selects/SubGroupSelect";
import NumberInput from "@/components/NumberInput";
import IconSelect from "@/components/selects/IconSelect";
import React from "react";
import { CheckIcon, Trash2Icon } from "lucide-react";
import FileTree from "@/components/FileTree";
import Button from "@/components/Button";
import FilePicker, { FilePickerButton } from "@/components/FilePicker";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const typeToEditor = {
  command: "CommandEditor",
  item: "ItemEditor",
  recipe: "RecipeEditor",
  technology: "TechEditor",
  icon: "IconEditor",
};

const handleCreateItem = async (
  values,
  itemType,
  itemName,
  refreshProjectInfo,
  projectId,
  openItemEditor
) => {
  const content = values;
  const item = {
    type: itemType,
    ...values,
  };

  if (content !== null) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/items/${projectId}/create-item`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            name: itemName,
            type: itemType,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create item");

      const responseData = await response.json();
      const createdItem = {
        ...responseData.createdItem,
        type: item.type,
        editor: typeToEditor[item.type],
      };

      if (!responseData.success) {
        alert("create error");
        return;
      }

      console.log(refreshProjectInfo);
      openItemEditor?.(createdItem);
      refreshProjectInfo();
    } catch (error) {
      console.error("create error:", error);
      toast.error(`Couldn't create ${itemName}!`, {
        position: "top-right",
        autoClose: false,
        closeOnClick: true,
        theme: "dark",
      });
    }
  }
};

export function RecipeConfigWizardStep({
  refreshProjectInfo,
  openItemEditor,
  ...props
}) {
  const [values, setValues] = useState({
    name: "",
    energy_required: 1,
    ingredients: [],
    results: [],
    enabled: true,
  });
  const { projectId } = useParams();

  const handleChange = (field) => (value) => {
    setValues((prev) => {
      const newValues = { ...prev, [field]: value };
      return newValues;
    });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z0-9-]+$/;

    if (!values.name.trim()) return "Recipe name is required";
    if (!nameRegex.test(values.name))
      return "Name can only contain letters, numbers, and hyphens";
    if (!values.energy_required || values.energy_required <= 0)
      return "energy_required must be one or more";

    handleCreateItem(
      values,
      "recipe",
      values.name,
      refreshProjectInfo,
      projectId,
      openItemEditor
    );

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
            <Label htmlFor="newRecipe-name">
              Recipe Name:
              <HelpIcon>
                Recipe name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input
              id="newRecipe-name"
              value={values.name}
              onChange={(e) => {
                handleChange("name")(e.target.value);
                handleNameChange(e);
              }}
            />
          </div>

          <div>
            <Label htmlFor="newRecipe-energy_required">
              Energy Required (Base crafting time):
              <HelpIcon>
                Energy Required: Base value in seconds for calculating, how long
                it will take to craft item
                Example: Recipe [Energy Required=2] in Assembler [Crafting Speed=1] = 2s
              </HelpIcon>
            </Label>
              <NumberInput
              id="newRecipe-energy_required"
              value={values.energy_required}
              onChange={handleChange("energy_required")}
              max={9999}
              min={1}
            />
          </div>
        </div>
      </WizardContent>
    </WizardStep>
  );
}

export function ItemConfigWizardStep({
  modalManagerRef,
  refreshProjectInfo,
  openItemEditor,
  ...props
}) {
  const [values, setValues] = useState({
    name: "",
    subgroup: "",
    icon: "",
    stack_size: 100,
  });
  const { projectId } = useParams();

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
    if (!values.stack_size || values.stack_size <= 0)
      return "Stack size must be one or more";

    handleCreateItem(
      values,
      "item",
      values.name,
      refreshProjectInfo,
      projectId,
      openItemEditor
    );

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
              value={values.stack_size}
              onChange={handleChange("stack_size")}
              max={99999}
              min={1}
            />
          </div>
        </div>
      </WizardContent>
    </WizardStep>
  );
}

function GraphicConfigSizesList({ value, onChange = () => {} }) {
  return (
    <div className="flex flex-col w-full gap-2">
      {value.map((size, index) => (
        <GraphicConfigSizesRow
          key={size + index}
          size={size}
          onRemove={() => {
            const newItems = [...value];
            newItems.splice(index, 1);
            onChange(newItems);
          }}
          onChange={(newSize) => {
            const newItems = [...value];
            newItems[index] = newSize;
            onChange(newItems);
          }}
        />
      ))}
    </div>
  );
}

function GraphicConfigSizesRow({ size, onRemove, onChange }) {
  return (
    <div className="flex gap-3 justify-between w-full">
      <div className="flex gap-3">
        <NumberInput
          value={size || 64}
          onChange={(value) => {
            onChange(value);
          }}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="danger"
          size="sm"
          className="h-fit self-center"
          onClick={onRemove}
        >
          <Trash2Icon className="stroke-[#a12b2b]" />
        </Button>
      </div>
    </div>
  );
}

export function GraphicConfigWizardStep({
  modalManagerRef,
  refreshProjectInfo,
  openItemEditor,
  ...props
}) {
  const [values, setValues] = useState({
    name: "",
    selectedFile: {},
    path: "",
    sizes: [64, 32, 16, 8],
  });
  const fileSelectorRef = useRef(null);
  const { projectId } = useParams();

  const handleChange = (field) => (value) => {
    setValues((prev) => {
      const newValues = { ...prev, [field]: value };
      return newValues;
    });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z0-9-]+$/;

    if (!values.name.trim()) return "Icon name is required";
    if (!nameRegex.test(values.name))
      return "Name can only contain letters, numbers, and hyphens";
    if (!values.selectedFile?.path) return "Please select a file";

    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => key !== "selectedFile")
    );

    handleCreateItem(
      filteredValues,
      "icon",
      values.name,
      refreshProjectInfo,
      projectId,
      openItemEditor
    );
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow letters, numbers, and hyphens
    const filtered = value.replace(/[^A-Za-z0-9-]/g, "");
    setValues((prev) => ({ ...prev, name: filtered }));
  };

  const handleSelectFile = (node) => {
    setValues((prev) => ({ ...prev, selectedFile: node }));
    setValues((prev) => ({ ...prev, path: `/graphics/${node.path}` }));
  };

  const handleChangeSizes = (sizes) => {
    setValues((prev) => ({ ...prev, sizes: sizes }));
  };

  return (
    <WizardStep validate={validate} {...props}>
      <WizardContent>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="newIcon-name">
              Icon Name:
              <HelpIcon>
                Item name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input
              id="newIcon-name"
              value={values.name}
              onChange={(e) => {
                handleChange("name")(e.target.value);
                handleNameChange(e);
              }}
            />
          </div>
          <div>
            <Label>
              Icon spritesheet (input sizes below)
              <HelpIcon>
                Icon spritesheet: stripe of images that are [64x64, 32x32,
                16x16, 8x8] all next to each other, one file (.png)
              </HelpIcon>
            </Label>
            <div className="max-h-200px overflow-y-auto overflow-x-hidden w-[30rem]">
              <FilePickerButton
                openFilePicker={() => {
                  fileSelectorRef?.current
                    ?.open()
                    .then((file) => {
                      handleSelectFile(file);
                    })
                    .catch((e) => {
                      console.error(e);
                    });
                }}
                value={values.selectedFile?.name || "No file selected"}
              />
              <FilePicker
                modalManagerRef={modalManagerRef}
                selectorExtensions={[".png"]}
                rootPath="graphics"
                ref={fileSelectorRef}
              />
            </div>
          </div>

          {/*<div>
            <Label htmlFor="newItem-subgroup">
              Icon Sizes:
              <HelpIcon>
                The size of the diffrent icons included in the spritesheet,
                defaults to: [64,32,16,8], has to include a 64x64 version
              </HelpIcon>
            </Label>
            <GraphicConfigSizesList
              value={values.sizes}
              onChange={handleChangeSizes}
            />
          </div>*/}
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
      title: "Icon",
      name: "graphic",
      icon: iconMapping.graphic,
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
