import React, { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/Button";
import { Wizard, WizardContent, WizardStep } from "@/components/Wizard";
import Input from "@/components/Input";
import Label from "@/components/Label";
import HelpIcon from "@/components/HelpIcon";
import {
  GraphicConfigWizardStep,
  ItemConfigWizardStep,
  RecipeConfigWizardStep,
  SelectWizardStep,
} from "./AddItemWizardSteps";
import SliderInput from "@/components/SliderInput";

function AddItemWizard({
  open,
  setOpen,
  iconMapping,
  modalManagerRef,
  refreshProjectInfo,
}) {
  const debug = { enabled: false, selected: "item" };
  const initalSelected = debug.enabled ? debug.selected : null;

  const [selected, setSelected] = React.useState(initalSelected);

  const resetWizard = () => {
    setSelected(null);
  };

  const handleWizardFinish = () => {
    resetWizard();
  };
  return (
    <Wizard
      open={open}
      setOpen={setOpen}
      title="Add new content"
      onFinish={handleWizardFinish}
      onCancle={resetWizard}
      startStep={debug.enabled ? 1 : 0}
    >
      <SelectWizardStep
        setSelected={setSelected}
        selected={selected}
        iconMapping={iconMapping}
      />
      {selected == "item" && (
        <ItemConfigWizardStep
          asStep={true}
          refreshProjectInfo={refreshProjectInfo}
        />
      )}
      {selected == "graphic" && (
        <GraphicConfigWizardStep
          asStep={true}
          modalManagerRef={modalManagerRef}
          refreshProjectInfo={refreshProjectInfo}
        />
      )}
      {selected == "recipe" && (
        <RecipeConfigWizardStep
          asStep={true}
          refreshProjectInfo={refreshProjectInfo}
        />
      )}
    </Wizard>
  );
}

function LeftSidebar({
  loadingInfo,
  projectInfo,
  handleEditItem,
  modalManagerRef,
  refreshProjectInfo,
}) {
  const [wizardOpen, setWizardOpen] = useState(false);

  if (loadingInfo) {
    return null;
  }
  const content = [
    ...projectInfo.registry.content.commands.map((c) => ({
      ...c,
      type: "command",
      editor: "CommandEditor",
    })),
    ...projectInfo.registry.content.items.map((i) => ({
      ...i,
      type: "item",
      editor: "ItemEditor",
    })),
    ...projectInfo.registry.content.recipes.map((r) => ({
      ...r,
      type: "recipe",
      editor: "RecipeEditor",
    })),
    ...projectInfo.registry.content.tech.map((t) => ({
      ...t,
      type: "technology",
      editor: "TechEditor",
    })),
    ...projectInfo.registry.content.icons.map((t) => ({
      ...t,
      type: "icon",
      editor: "IconEditor",
    })),
  ];

  const iconMapping = {
    item: `${process.env.API_URL}/icon/base/icons/wooden-chest.png`,
    command: `${process.env.API_URL}/icon/base/icons/constant-combinator.png`,
    recipe: `${process.env.API_URL}/icon/base/icons/assembling-machine-1.png`,
    technology: `${process.env.API_URL}/icon/base/icons/lab.png`,
    custom: `${process.env.API_URL}/icon/base/icons/repair-pack.png`,
    graphic: `${process.env.API_URL}/icon/base/icons/blueprint.png`,
    icon: `${process.env.API_URL}/icon/base/icons/blueprint.png`,
  };

  return (
    <div className="row-start-2 row-end-6 col-start-1 col-end-2 bg-gray-dark p-1 overflow-auto overflow-x-hidden accentuated box-content pr-8 text-dirty-white">
      <div>
        <div className="flex flex-col w-full">
          <div className="relative w-full flex items-center py-2">
            <span className="absolute left-1/2 transform -translate-x-1/2">
              Contents:
            </span>
            <span
              className="text-white rounded-lg p-1 hover:text-blue hover:bg-gray-medium ml-auto"
              onClick={() => setWizardOpen(true)}
            >
              <Plus />
            </span>
          </div>

          <AddItemWizard
            setOpen={setWizardOpen}
            open={wizardOpen}
            iconMapping={iconMapping}
            modalManagerRef={modalManagerRef}
            refreshProjectInfo={refreshProjectInfo}
          />

          <div className="flex flex-col gap-1 pl-4">
            {content.map((element, index, array) => {
              return (
                <div
                  className="flex items-center gap-3 border-2 border-transparent hover:accentuated p-2 select-none"
                  onClick={() => handleEditItem(element)}
                  key={index}
                >
                  <img src={iconMapping[element.type]} className="h-8" />
                  <span>{element.name || "item-no-name"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
