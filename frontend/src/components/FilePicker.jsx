import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
} from "react";
import { Inventory } from "./Inventory";
import Button from "./Button";
import FileTree from "./FileTree";
import { FolderOpenIcon } from "lucide-react";

const FilePicker = forwardRef(
  ({ modalManagerRef, projectId, ...props }, ref) => {
    const promiseRef = useRef({ resolve: null, reject: null });
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClose = () => {
      modalManagerRef.current?.closeModal({ id: "file_picker" });
    };

    const handleCancel = () => {
      console.log("[FILE PICKER] Cancel");
      handleClose();
      promiseRef.current.reject?.();
      promiseRef.current = { resolve: null, reject: null };
    };

    const handleChoose = (chosen) => {
      console.log("[FILE PICKER] Chosen:", chosen.name);
      handleClose();
      promiseRef.current.resolve?.(chosen);
      promiseRef.current = { resolve: null, reject: null };
    };

    const handleSelectFile = (selected) => {
      setSelectedFile(selected);
      modalManagerRef.current?.updateModal({
        id: "file_picker",
        actions: (
           <>
              <div className="flex w-full gap-3 justify-between">
                <span className="text-white">
                  {selected?.path || "No file selected"}
                </span>
                <div className="flex gap-4">
                     <Button type="success" onClick={() => handleChoose(selected)}>
              Use {selected?.name}
            </Button>
            <Button type="danger" onClick={handleCancel}>
              Cancel
            </Button>
                </div>
              </div>
            </>
        ),
      });
    };

    useImperativeHandle(ref, () => ({
      open() {
        modalManagerRef.current?.addModal({
          id: "file_picker",
          title: `File Picker`,
          noInnerPadding: true,
          panelCN: "!w-[600px]",
          content: (
            <div>
              <FileTree
                mode="selector"
                selectorType="file"
                onFileOpen={handleSelectFile}
                {...props}
              />
            </div>
          ),
          actions: (
            <>
              <div className="flex w-full gap-3 justify-between">
                <span className="text-white">
                  {selectedFile?.name || "No file selected"}
                </span>
                <div className="flex gap-4">
                  <Button type="danger" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ),
        });

        // Return a promise that resolves/rejects based on user action
        return new Promise((resolve, reject) => {
          promiseRef.current = { resolve, reject };
        });
      },
    }));

    return null;
  }
);

export function FilePickerButton({openFilePicker=()=>{}, value="Click on button to select"}) {
    return (
        <div className="flex items-center gap-2">
            <Button onClick={openFilePicker}>
                <FolderOpenIcon size={20} className="stroke-gray-medium" />
            </Button>
            <span>{value}</span>
        </div>
    );
}

export default FilePicker;
