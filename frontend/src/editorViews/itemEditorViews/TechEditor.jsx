import React, { useState, forwardRef, useImperativeHandle } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import Button from "@/components/Button";
import Textarea from "@/components/Textarea";

const TechEditor = forwardRef(
  ({ data: techData, handleChange, handleSaveChanges }, ref) => {
    const [values, setValues] = useState({
      name: techData.name,
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

    return (
      <div>
        {/*<div className="flex justify-end w-full">
          <Button
            type="blue"
            title="Strg+S"
            onClick={() => handleSaveChanges()}
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="w-4 h-4" /> Save
          </Button>
        </div>*/}

        {true && <div className="grid grid-cols-2 mt-5 gap-2">
          <Textarea rows={24} value={"OLD \n" + JSON.stringify(techData, null, 2)} />
          <Textarea rows={24} value={"NEW \n" + JSON.stringify(values, null, 2)} />
        </div>}
      </div>
    );
  }
);

export default TechEditor;
