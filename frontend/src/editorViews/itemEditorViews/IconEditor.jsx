import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import HelpIcon from "@/components/HelpIcon";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Alert from "@/components/Alert";
import { useParams } from "react-router-dom";
import FilePicker, { FilePickerButton } from "@/components/FilePicker";

const IconEditor = forwardRef(
  (
    { data: iconData, handleChange, handleSaveChanges, modalManagerRef },
    ref
  ) => {
    const [values, setValues] = useState({
      name: iconData.name,
      fmcs_id: iconData.fmcs_id,
      path: iconData.path,
      sizes: iconData.sizes,
      selectedFile: {
        path: iconData.path,
        name: iconData.path.split("/").pop(),
      },
    });

    const fileSelectorRef = useRef(null);
    const { projectId } = useParams();

    // Imperative handlers
    useImperativeHandle(ref, () => ({
      getContent: () =>
        Object.fromEntries(
          Object.entries(values).filter(([key]) => key !== "selectedFile")
        ),
      validate: () => {
        const nameRegex = /^[A-Za-z0-9-]+$/;

        if (!values.name.trim()) return "Icon name is required";
        if (!nameRegex.test(values.name))
          return "Name can only contain letters, numbers, and hyphens";
        if (!values.selectedFile?.path) return "Please select a file";

        return true;
      },
    }));

    const handleNameInput = (e) => {
      const value = e.target.value.replace(/[^A-Za-z0-9-]/g, "");
      setValues((prev) => ({ ...prev, name: value }));
      handleChange();
    };

    const handleSelectFile = (node) => {
      setValues((prev) => ({ ...prev, selectedFile: node }));
      setValues((prev) => ({ ...prev, path: `/graphics/${node.path}` }));
      handleChange();
    };

    return (
      <div>
        <Alert type="info">
          Icons are not registered in the game data, they are only used in FMCS
        </Alert>
        <div className="flex flex-col gap-4">
          <div>
            <Label>
              Icon Name:
              <HelpIcon>
                Icon name: Internal identifier used for reference and
                localization. Can contain: letters, numbers, hyphens
              </HelpIcon>
            </Label>
            <Input value={values.name} onChange={handleNameInput} />
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
        </div>
        {false && (
          <div className="grid grid-cols-2 mt-5 gap-2">
            <Textarea
              rows={13}
              value={"OLD \n" + JSON.stringify(iconData, null, 2)}
            />
            <Textarea
              rows={13}
              value={"NEW \n" + JSON.stringify(values, null, 2)}
            />
          </div>
        )}
      </div>
    );
  }
);

export default IconEditor;
