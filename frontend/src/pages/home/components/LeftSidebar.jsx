import React, { useState, useEffect, useRef } from "react";
import { PencilIcon, Plus, Trash2Icon } from "lucide-react";
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
import { toast } from "react-toastify";
import { contentItemIconMapping } from "@/config";

function AddItemWizard({
  open,
  setOpen,
  iconMapping,
  modalManagerRef,
  refreshProjectInfo,
  openItemEditor,
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
        iconMapping={contentItemIconMapping}
      />
      {selected == "item" && (
        <ItemConfigWizardStep
          asStep={true}
          refreshProjectInfo={refreshProjectInfo}
          openItemEditor={openItemEditor}
        />
      )}
      {selected == "graphic" && (
        <GraphicConfigWizardStep
          asStep={true}
          modalManagerRef={modalManagerRef}
          refreshProjectInfo={refreshProjectInfo}
          openItemEditor={openItemEditor}
        />
      )}
      {selected == "recipe" && (
        <RecipeConfigWizardStep
          asStep={true}
          refreshProjectInfo={refreshProjectInfo}
          openItemEditor={openItemEditor}
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
  tabControlRef,
  projectId,
}) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editing, setEditig] = useState(false);
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (!loadingInfo) {
      setContent([
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
      ]);
    }
  }, [loadingInfo]);

  if (loadingInfo) {
    return null;
  }

  const removeItem = (element) => {
    modalManagerRef.current.addConfirmModal({
      title: "Project Deletion",
      content: (
        <div className="flex flex-col gap-4 p-2">
          <h1 className="text-2xl text-red">
            Do you really want to delete the {element.type} "{element.name}"?
          </h1>
          <p className="text-xl">This is unreversable!</p>
        </div>
      ),
      onYes: async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/items/${projectId}/delete-item`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: element.name,
                type: element.type,
              }),
            }
          );

          if (!response.ok) throw new Error("Failed to remove item");

          const responseData = await response.json();

          if (!responseData.success) {
            alert("remove error");
            return;
          }

          tabControlRef.current.removeTab(element.name + "_" + element.type)
          refreshProjectInfo();
        } catch (error) {
          console.error("remove error:", error);
          toast.error(`Couldn't remove ${element.name}!`, {
            position: "top-right",
            autoClose: false,
            closeOnClick: true,
            theme: "dark",
          });
        }
      },
    });
  };

  return (
    <div className="row-start-2 row-end-6 col-start-1 col-end-2 bg-gray-dark p-1 overflow-auto overflow-x-hidden accentuated box-content pr-8 text-dirty-white">
      <div>
        <div className="flex flex-col w-full">
          <div className="relative w-full flex items-center justify-between py-2 px-10">
            <span
              className={`text-white rounded-lg p-1 hover:text-blue hover:bg-gray-medium ${
                editing ? "text-blue bg-gray-light" : ""
              }`}
              onClick={() => setEditig(!editing)}
            >
              <PencilIcon size={20} />
            </span>
            <span className="">Contents:</span>
            <span
              className="text-white rounded-lg p-1 hover:text-blue hover:bg-gray-medium"
              onClick={() => setWizardOpen(true)}
            >
              <Plus />
            </span>
          </div>

          <AddItemWizard
            setOpen={setWizardOpen}
            open={wizardOpen}
            iconMapping={contentItemIconMapping}
            modalManagerRef={modalManagerRef}
            refreshProjectInfo={refreshProjectInfo}
            openItemEditor={handleEditItem}
          />

          <div className="flex flex-col gap-1 pl-4">
            {content.map((element, index, array) => {
              return (
                <div
                  className="flex items-center justify-between gap-3 border-2 border-transparent hover:accentuated p-2 select-none"
                  onClick={() => {
                    if (!editing) {
                      handleEditItem(element);
                    }
                  }}
                  key={index}
                >
                  <div className="flex gap-3 items-center">
                    <img src={contentItemIconMapping[element.type]} className="h-8" />
                    <span>{element.name || "item-no-name"}</span>
                  </div>
                  {editing && (
                    <div className="h-fit">
                      <div
                        className="text-white rounded-lg p-1 hover:text-blue hover:bg-gray-medium"
                        onClick={() => {
                          removeItem(element);
                        }}
                      >
                        <Trash2Icon className="stroke-red" />
                      </div>
                    </div>
                  )}
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
