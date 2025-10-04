import { Loader2Icon, X } from "lucide-react";
import { toast } from "react-toastify";
import React from "react";
import { DotFilled } from "@/components/CustomIcons";
import * as editorViews from "@/editorViews";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as itemEditorViews from "@/editorViews/itemEditorViews";

export const handleItemSave = async (
  tabControlRef,
  setFsStatus,
  projectId,
  refreshProjectInfo
) => {
  console.log("ITEM SAVE");
  const tab = tabControlRef.current.getSelectedTab();

  if (tab?.dataStorage?.isEditor && tab?.dataStorage?.editorRef?.current) {
    setFsStatus("Saving");
    tabControlRef.current.updateTabIcon(
      tab.id,
      <Loader2Icon className="animate-spin" />
    );
    const content = tab.dataStorage.editorRef.current.getContent();
    const item = tab.dataStorage.item;

    if (content !== null) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/items/${projectId}/save-item`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content,
              name: item.name,
              type: item.type,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to save file");

        const responseData = await response.json();
        const updatedItem = { ...responseData.updatedItem, type: item.type };

        if (!responseData.success) {
          alert("save error");
          return;
        }

        refreshProjectInfo();
        tabControlRef.current?.updateTabData(tab.id, { item: updatedItem });
        tabControlRef.current?.updateTabTitle(tab.id, updatedItem.name);
        tabControlRef.current.updateTabIcon(tab.id, <X />);
        tabControlRef.current.updateTabCloseEvent(tab.id, () => {
          tabControlRef.current.removeTab(tab.id);
        });
        tabControlRef.current?.updateTabId(
          tab.id,
          updatedItem.name + "_" + updatedItem.type
        );
        setFsStatus("Idle");
      } catch (error) {
        console.error("Save error:", error);
        toast.error(`Couldn't save ${tab.dataStorage.item.name}!`, {
          position: "top-right",
          autoClose: false,
          closeOnClick: true,
          theme: "dark",
        });
      }
    }
  }
};

export const handleFileSave = async (
  tabControlRef,
  setFsStatus,
  projectId,
  refreshProjectInfo
) => {
  const tab = tabControlRef.current.getSelectedTab();

  //Check if Tab is an editor and has an editorRef
  if (tab?.dataStorage?.isEditor && tab?.dataStorage?.editorRef?.current) {
    setFsStatus("Saving");
    const content = tab.dataStorage.editorRef.current.getContent();

    //Check if tab is empty
    if (content !== null) {
      try {
        //Fetch save
        const response = await fetch(
          `http://localhost:8000/api/files/${projectId}/save-file`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: content,
              path: tab.dataStorage.file.path,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save file");
        }

        // Log the response for debugging
        const responseData = await response.json();

        if (!responseData.success) {
          alert("save error");
          return;
        }
        // Update Tab icon to X on both hover and idle
        tabControlRef.current.updateTabIcon(tab.id, <X />);

        // Reset Close event to close the tab
        tabControlRef.current.updateTabCloseEvent(tab.id, () => {
          tabControlRef.current.removeTab(tab.id);
        });
      } catch (error) {
        console.error("Save error:", error);
        toast.error(`Couldn't save ${tab.dataStorage.file.name}!`, {
          position: "top-right",
          autoClose: false,
          closeOnClick: true,
          theme: "dark",
        });
      }
      setFsStatus("Idle");
    }
  }
};

export const handleEditorChange = (
  tabControlRef,
  handleSave,
  modalManagerRef
) => {
  //Check if tabControlRef is there
  if (tabControlRef.current) {
    const tab = tabControlRef.current.getSelectedTab();

    //Sets the tabs icon to DOT and on hover to X
    tabControlRef.current.updateTabIcon(tab.id, <DotFilled />, <X />);

    //Updates close event of tab
    tabControlRef.current.updateTabCloseEvent(tab.id, () => {
      //On close show "Are you sure?" modal
      modalManagerRef.current?.addSaveConfirmModal({
        fileName: tab.dataStorage?.file?.name || tab.dataStorage.item.name,
        onDontSave: () => {
          tabControlRef.current.removeTab(tab.id);
        },
        onSave: () => {
          handleSave();
          tabControlRef.current.removeTab(tab.id);
        },
      });
    });
  }
};

export const getEditorForFileComponent = async (
  file,
  projectId,
  tabControlRef,
  handleSave,
  modalManagerRef
) => {
  const EditorComponent = editorViews[file.preferred_editor];

  if (!EditorComponent) {
    console.error(`Editor for ${file.preferred_editor} not found`);
    alert(`Editor for ${file.preferred_editor} not found`);
    return null;
  }

  if (file.preferred_editor !== "ImgViewer") {
    try {
      const response = await fetch(
        `http://localhost:8000/api/files/${projectId}/${file.path}`
      );
      if (!response.ok) throw new Error("Failed to fetch file");
      const data = await response.text();

      console.log(file);
      // Create a new ref for this editor instance
      const editorRef = React.createRef();
      const component = (
        <EditorComponent
          ref={editorRef}
          defaultValue={data}
          handleChange={() =>
            handleEditorChange(tabControlRef, handleSave, modalManagerRef)
          }
          read_only={file.is_readonly}
        />
      );

      return {
        component,
        editorRef, // Return the ref instead of a getter function
      };
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }

  return {
    component: (
      <EditorComponent
        key={file.path}
        imageUrl={`http://localhost:8000/api/files/${projectId}/${file.path}`}
      />
    ),
    editorRef: null,
  };
};

export const handleFileOpening = async (
  file,
  projectId,
  tabControlRef,
  handleSave,
  modalManagerRef
) => {
  const tabId = file.path;

  const tabData = {
    id: tabId,
    title: file.name,
    dataStorage: {
      isEditor: true,
      file: file,
      editorType: "file",
    },
    message: file.is_readonly ? "Read only" : "",
    content: (
      <div className="w-full h-full flex items-center justify-center text-white">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    ),
  };

  tabControlRef.current?.addTab(tabData);

  const editorResult = await getEditorForFileComponent(
    file,
    projectId,
    tabControlRef,
    handleSave,
    modalManagerRef
  );
  if (editorResult) {
    tabControlRef.current?.updateTabContent(tabId, editorResult.component);
    tabControlRef.current?.updateTabData(tabId, {
      editorRef: editorResult.editorRef,
    });
  } else {
    tabControlRef.current?.updateTabContent(
      tabId,
      <div className="p-4 text-red-400">Error loading file "{file.path}"</div>
    );
  }
};

export const getEditorForItem = async (
  item,
  tabControlRef,
  setFsStatus,
  projectId,
  refreshProjectInfo,
  handleSave,
  modalManagerRef,
) => {
  const EditorComponent = itemEditorViews[item.editor];

  if (!EditorComponent) {
    console.error(`Editor for ${item.name} not found`);
    alert(`Editor for ${item.name} not found`);
    return null;
  }

  // Create a new ref for this editor instance
  const editorRef = React.createRef();
  const component = (
    <EditorComponent
      key={item.name + "_" + item.type}
      ref={editorRef}
      data={item}
      handleChange={() =>
        handleEditorChange(tabControlRef, handleSave, modalManagerRef)
      }
      read_only={false}
      handleSaveChanges={() =>
        handleItemSave(
          tabControlRef,
          setFsStatus,
          projectId,
          refreshProjectInfo
        )
      }
      modalManagerRef={modalManagerRef}
      projectId={projectId}
    />
  );

  return {
    component,
    editorRef, // Return the ref instead of a getter function
  };
};

export const handleOpenItemEditor = async (
  item,
  tabControlRef,
  setFsStatus,
  projectId,
  refreshProjectInfo,
  handleSave,
  modalManagerRef,
) => {
  const tabId = item.name + "_" + item.type;
  const tabData = {
    id: tabId,
    title: item.name,
    dataStorage: {
      isEditor: true,
      item: item,
      editorType: "item",
    },
    content: (
      <div className="w-full h-full flex items-center justify-center text-white">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    ),
  };

  tabControlRef.current?.addTab(tabData);

  const editorResult = await getEditorForItem(
    item,
    tabControlRef,
    setFsStatus,
    projectId,
    refreshProjectInfo,
    handleSave,
    modalManagerRef,
  );
  if (editorResult) {
    tabControlRef.current?.updateTabContent(tabId, editorResult.component);
    tabControlRef.current?.updateTabData(tabId, {
      editorRef: editorResult.editorRef,
    });
  } else {
    tabControlRef.current?.updateTabContent(
      tabId,
      <div className="p-4 text-red">Error loading editor for "{item.name}"</div>
    );
  }
};
