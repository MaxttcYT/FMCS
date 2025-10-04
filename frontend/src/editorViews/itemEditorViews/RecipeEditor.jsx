import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
import { PipetteIcon, Trash2Icon } from "lucide-react";
import { ItemIconRenderer } from "@/components/ItemIconRenderer";
import ItemPicker from "@/components/ItemPicker";
import { InventoryItem } from "@/components/Inventory";
import Checkbox from "@/components/Checkbox";

const RecipeEditor = forwardRef(
  (
    {
      data: recipe,
      handleChange,
      handleSaveChanges,
      modalManagerRef,
      projectId,
    },
    ref
  ) => {
    console.log(recipe);
    const [values, setValues] = useState({
      name: recipe.name,
      energy_required: recipe.energy_required,
      results: recipe.results || [],
      ingredients: recipe.ingredients || [],
      enabled: recipe.enabled,
      fmcs_id: recipe.fmcs_id,
    });

    const itemPickerRef = useRef(null);

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

    const handleEnergyReqChange = (value) => {
      setValues((prev) => ({ ...prev, energy_required: value }));
      handleChange();
    };

    const handleIngredientsChange = (value) => {
      setValues((prev) => ({ ...prev, ingredients: value }));
      handleChange();
    };

    const handleResultsChange = (value) => {
      setValues((prev) => ({ ...prev, results: value }));
      handleChange();
    };

    const handleEnabledChange = (e) => {
      setValues((prev) => ({ ...prev, enabled: e.target.value }));
      handleChange();
    };

    const onChangeItemCountIngredients = (itemName, newCount) => {
      const updatedIngredients = values.ingredients.map((ingredient) => {
        if (ingredient.name === itemName) {
          return { ...ingredient, amount: newCount };
        }
        return ingredient;
      });

      setValues((prev) => ({ ...prev, ingredients: updatedIngredients }));
      handleChange();
    };

    const handleSelectNewItemIngredients = (oldItemName) => {
      itemPickerRef.current
        ?.open()
        .then((chosenItem) => {
          const updatedIngredients = values.ingredients.map((ingredient) => {
            if (chosenItem.fmcs_item_type === "base") {
              if (ingredient.name === oldItemName) {
                return {
                  amount: ingredient.amount,
                  type: ingredient.type,
                  name: chosenItem.name,
                };
              }
            } else {
              return {
                amount: ingredient.amount,
                type: ingredient.type,
                name: chosenItem.name,
                FMCS_REFERENCES: [
                  {
                    FMCS_ID: chosenItem.fmcs_id,
                    FIELDS: ["name"],
                  },
                ],
              };
            }
            return ingredient;
          });
          setValues((prev) => ({ ...prev, ingredients: updatedIngredients }));
          handleChange();
        })
        .catch((e) => {
          console.error(e);
          console.log("Rejected (canceled)");
        });
    };

    const addNewIngredient = () => {
      const updatedIngredients = [
        ...values.ingredients,
        { amount: 1, type: "item", name: "iron-plate" },
      ]; // Add a new empty ingredient
      setValues((prev) => ({ ...prev, ingredients: updatedIngredients }));
    };
    const addNewResult = () => {
      const updatedResults = [
        ...values.results,
        { amount: 1, type: "item", name: "copper-plate" },
      ]; // Add a new empty ingredient
      setValues((prev) => ({ ...prev, results: updatedResults }));
    };

    const onChangeItemCountResults = (itemName, newCount) => {
      const updatedResults = values.ingredients.map((result) => {
        if (result.name === itemName) {
          return { ...result, amount: newCount };
        }
        return result;
      });

      setValues((prev) => ({ ...prev, ingredients: updatedResults }));
      handleChange();
    };

    const handleSelectNewItemResults = (oldItemName) => {
      itemPickerRef.current
        ?.open()
        .then((chosenItem) => {
          console.log(chosenItem);
          const updatedResults = values.results.map((result) => {
            if (chosenItem.fmcs_item_type === "base") {
              if (result.name === oldItemName) {
                return {
                  amount: result.amount,
                  type: result.type,
                  name: chosenItem.name,
                };
              }
            } else {
              return {
                amount: result.amount,
                type: result.type,
                name: chosenItem.name,
                FMCS_REFERENCES: [
                  {
                    FMCS_ID: chosenItem.fmcs_id,
                    FIELDS: ["name"],
                  },
                ],
              };
            }
            return result;
          });
          setValues((prev) => ({ ...prev, results: updatedResults }));
          handleChange();
        })
        .catch((e) => {
          console.error(e);
          console.log("Rejected (canceled)");
        });
    };

    return (
      <div>
        <ItemPicker
          ref={itemPickerRef}
          modalManagerRef={modalManagerRef}
          projectId={projectId}
        />
        {/*<div className="absolute  top-[3rem] right-[4rem] z-[20] flex justify-end">
          <Button
            type="blue"
            title="Strg+S"
            onClick={() => handleSaveChanges()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="w-4 h-4" /> Save
          </Button>
        </div>*/}

        <div className="flex flex-col gap-4">
          <div>
            <Label>
              Recipe Name:
              <HelpIcon>
                Recipe name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input value={values.name} onChange={handleNameInput} />
          </div>
          <div>
            <Label>
              Energy Required (Base crafting time)
              <HelpIcon>
                Energy Required: Base value in seconds for calculating, how long
                it will take to craft item
              </HelpIcon>
            </Label>
            <NumberInput
              value={values.energy_required}
              onChange={handleEnergyReqChange}
            />
          </div>
          <div>
            <Label>
              Enabled from beginning:
              <HelpIcon>
                Enabled from beginning: If false, recipe will not show unless
                researched or otherwise unlocked
              </HelpIcon>
            </Label>
            <Checkbox checked={values.enabled} onChange={handleEnabledChange} className="w-fit" text={"Enabled from beginning"} />
          </div>
          <div>
            <Label>
              Ingredients
              <HelpIcon>
                Ingredients: Items that are consumed when crafting
              </HelpIcon>
            </Label>
            <ItemList
              value={values.ingredients}
              onChange={handleIngredientsChange}
              onChangeItemCount={onChangeItemCountIngredients}
              handleSelectNewItem={handleSelectNewItemIngredients}
              projectId={projectId}
              addNewRow={addNewIngredient}
            />
          </div>
          <div>
            <Label>
              Results
              <HelpIcon>
                Results: Items that are created when recipe used
              </HelpIcon>
            </Label>
            <ItemList
              value={values.results}
              onChange={handleResultsChange}
              onChangeItemCount={onChangeItemCountResults}
              handleSelectNewItem={handleSelectNewItemResults}
              projectId={projectId}
              addNewRow={addNewResult}
            />
          </div>
        </div>

        {false && (
          <div className="grid grid-cols-2 mt-5 gap-2">
            <Textarea
              value={"OLD \n" + JSON.stringify(recipe, null, 2)}
              key={1}
            />
            <Textarea
              value={"NEW \n" + JSON.stringify(values, null, 2)}
              key={2}
            />
          </div>
        )}
      </div>
    );
  }
);

function ItemList({
  value,
  onChange = () => {},
  onChangeItemCount = () => {},
  handleSelectNewItem = () => {},
  addNewRow = () => {},
  projectId,
}) {
  return (
    <div className="flex flex-col w-full gap-2">
      {value.map((item, index) => (
        <ItemRow
          key={item.name + index}
          item={item}
          onRemove={() => {
            const newItems = [...value];
            newItems.splice(index, 1);
            onChange(newItems);
          }}
          onChangeItemCount={(newCount) =>
            onChangeItemCount(item.name, newCount)
          }
          handleSelectNewItem={() => {
            handleSelectNewItem(item.name);
          }}
          projectId={projectId}
        />
      ))}
      <Button size={"sm"} onClick={addNewRow}>
        + Add
      </Button>
    </div>
  );
}

function ItemRow({
  item,
  onRemove,
  onChangeItemCount,
  handleSelectNewItem,
  projectId,
}) {
  const [fetchedItem, setFetchedItem] = useState(item);

  // Fetch item details whenever the item name changes
  useEffect(() => {
    fetch(`${process.env.API_URL}/api/dataRaw/items/${item.name}/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setFetchedItem((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => console.error("Failed to fetch item", err));
  }, [item.name]);

  return (
    <div className="flex gap-3 justify-between w-full">
      <div className="flex gap-3">
        <NumberInput
          value={item.amount || 1}
          onChange={(value) => {
            onChangeItemCount(value);
          }}
        />
        <span className="h-fit text-center self-center">X</span>
        <div className="flex gap-2 self-center items-center">
          <InventoryItem data={fetchedItem} onClick={handleSelectNewItem} />
          <span className="h-fit">{fetchedItem.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button size="sm" className="h-fit" onClick={handleSelectNewItem}>
          <PipetteIcon className="stroke-gray-medium" />
        </Button>
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
export default RecipeEditor;
