import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import LuaEditor from "../LuaEditor";
import Label from "@/components/Label";
import HelpIcon from "@/components/HelpIcon";
import Input from "@/components/Input";

const CommandEditor = forwardRef(
  ({ data: commandData, handleChange, handleSaveChanges }, ref) => {
    const [values, setValues] = useState({
      name: commandData.name,
      description: commandData.description || "",
      code: commandData.code,
    });
    const codeEditorRef = useRef(null);

    useEffect(() => {
      console.log("COMMAND EDITOR MOUNT");
    }, []);

    // Imperative handlers
    useImperativeHandle(ref, () => ({
      getContent: () => values,
      validate: () => {
        const nameRegex = /^[A-Za-z0-9-]+$/;
        if (!values.name.trim()) return "Command name is required";
        if (!nameRegex.test(values.name))
          return "Name can only contain letters, numbers, and hyphens";
        if (!values.code) return "Please include code to be run";
        return true;
      },
    }));

    const handleCodeChange = () => {
      setValues((prev) => ({
        ...prev,
        code: codeEditorRef.current.getContent(),
      }));
      handleChange();
    };

    //No plan what this does, but it works!
    const handleCodeChangeMemo = useCallback(() => {
      handleCodeChange();
    }, []);

    const handleNameInput = (e) => {
      const value = e.target.value.replace(/[^A-Za-z0-9-]/g, "");
      setValues((prev) => ({ ...prev, name: value }));
      handleChange();
    };
    const handleDescriptionChange = (e) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, description: value }));
      handleChange();
    };

    return (
      <div className="grid grid-rows-[auto,1fr] gap-8 h-[95%]">
        <div className="flex flex-col gap-4">
          <div>
            <Label>
              Command Name:
              <HelpIcon>
                Command name: The command itself, used in chat via [Command
                Name]. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input value={values.name} onChange={handleNameInput} />
          </div>
          <div>
            <Label>
              Command Description:
              <HelpIcon>
                Command description: Short Description of command.
              </HelpIcon>
            </Label>
            <Textarea
              value={values.description}
              onChange={handleDescriptionChange}
              rows={5}
            />
          </div>
        </div>
        <div>
          <Label>
            Code:
            <HelpIcon>
              Code: Lua code thats run every time the command gets executed
            </HelpIcon>
          </Label>
          <div className="h-full">
            <LuaEditor
              ref={codeEditorRef}
              defaultValue={commandData.code}
              handleChange={handleCodeChangeMemo}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default CommandEditor;
