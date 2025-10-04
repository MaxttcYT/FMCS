import React, { useState, useEffect, useRef } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import MainEditorTabControl from "@/components/Tabs/MainEditorTabControl";
import FileTree from "@/components/FileTree";

import { DotFilled } from "@/components/CustomIcons";
import ModalManager from "@/components/ModalManager";
import { useParams } from "react-router-dom";
import { ProjectProvider } from "@/context/ProjectContext";
import TopNav from "./components/TopNav";
import LeftSidebar from "./components/LeftSidebar";
import useSocketIO from "@/hooks/useSocketIO";
import useFactorioStatus from "@/hooks/useFactorioStatus";
import useProjectInfo from "@/hooks/useProjectInfo";
import {
  handleFileOpening,
  handleFileSave,
  handleItemSave,
  handleOpenItemEditor,
} from "@/utils/editors";
import * as editorViews from "@/editorViews";
import Button from "@/components/Button";
import BuildLog from "@/components/BuildLog";
import { Inventory } from "@/components/Inventory";
import ItemPicker from "@/components/ItemPicker";
import CommandPalette from "@/components/CommandPalette";
import SciencePicker from "@/components/SciencePicker";

export default function Home() {
  const { socket, reconnectSocket } = useSocketIO();
  const { projectId } = useParams();

  const tabControlRef = useRef(null);
  const modalManagerRef = useRef(null);
  const itemPickerRef = useRef(null);

  const {
    projectInfo,
    loading: loadingProjectInfo,
    error,
    refresh: refreshProjectInfo,
  } = useProjectInfo(projectId);

  useEffect(() => {
    if (!loadingProjectInfo) {
      console.group("PROJECT INFO");
      console.log("PROJECT INFO");
      console.log(projectInfo);
      console.groupEnd();
    }
  }, [loadingProjectInfo]);

  const {
    status: factorioStatus,
    start: handleStartFactorio,
    stop: handleStop,
    kill: handleKill,
  } = useFactorioStatus(socket, projectInfo);

  const [showFileTree, setShowFileTree] = useState(true);

  const [fsStatus, setFsStatus] = useState("Idle");

  const handleSave = async () => {
    const tab = tabControlRef.current.getSelectedTab();

    // Check if tab is an editor with a valid editorRef and editorType
    if (
      tab?.dataStorage?.isEditor &&
      tab?.dataStorage?.editorRef?.current &&
      tab?.dataStorage.editorType
    ) {
      const { editorType } = tab.dataStorage;

      switch (editorType) {
        case "file":
          await handleFileSave(
            tabControlRef,
            setFsStatus,
            projectId,
            refreshProjectInfo
          );
          break;
        case "item":
          await handleItemSave(
            tabControlRef,
            setFsStatus,
            projectId,
            refreshProjectInfo
          );
          break;
        default:
          console.warn(`Unknown editorType: ${editorType}`);
          break;
      }
    } else {
      console.warn("No editor available to save.");
    }
  };

  const changeActiveTabByOffset = (offset) => {
    const tabs = tabControlRef.current.getTabs();
    const activeTab = tabControlRef.current.getSelectedTab();

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab.id);

    let newIndex = currentIndex + offset;

    newIndex = ((newIndex % tabs.length) + tabs.length) % tabs.length;

    tabControlRef.current.setSelectedTab(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
      if (event.shiftKey && event.key === "ArrowLeft") {
        event.preventDefault();
        changeActiveTabByOffset(-1);
      }
      if (event.shiftKey && event.key === "ArrowRight") {
        event.preventDefault();
        changeActiveTabByOffset(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const statusColors = {
    Idle: "fill-green",
    Saving: "fill-orange",
    Error: "fill-red",
  };

  const handleStartBuild = () => {
    return new Promise((resolve, reject) => {
      modalManagerRef.current?.addModal({
        id: "build_modal",
        title: `Building: ${projectInfo.name} [${projectInfo.version}]`,
        content: (
          <BuildLog
            socket={socket}
            projectId={projectId}
            projectInfo={projectInfo}
            reconnectSocket={reconnectSocket}
            onBuildComplete={(result) => {
              resolve(result);
              modalManagerRef.current.updateModal({
                id: "build_modal",
                actions: (
                  <Button
                    size="sm"
                    type="danger"
                    onClick={() => {
                      modalManagerRef.current.closeModal({ id: "build_modal" });
                    }}
                  >
                    Close
                  </Button>
                ),
              });
            }}
            onBuildError={(error) => {
              reject(error);
              modalManagerRef.current.updateModal({
                id: "build_modal",
                actions: (
                  <Button
                    size="sm"
                    type="danger"
                    onClick={() => {
                      modalManagerRef.current.closeModal({ id: "build_modal" });
                    }}
                  >
                    Close
                  </Button>
                ),
              });
            }}
          />
        ),
      });
    });
  };
  const handleStart = async () => {
    try {
      await handleStartBuild(); // will throw if it fails
      handleStartFactorio(); // only runs if build succeeds
    } catch (error) {
      console.error("Build failed, Factorio will not start:", error);
    }
  };

  useEffect(() => {
    itemPickerRef.current
      ?.open()
      .then((chosenItem) => {
        console.log("Accepted:", chosenItem);
      })
      .catch(() => {
        console.log("Rejected (canceled)");
      });
  }, []);

  return (
    <ProjectProvider projectId={projectId}>
      <SciencePicker ref={itemPickerRef} modalManagerRef={modalManagerRef} projectId={projectId} />
      <CommandPalette getTabs={()=>tabControlRef.current?.getTabs()} setActiveTab={(id)=>tabControlRef.current?.setSelectedTab(id)} />
      <div className="grid grid-cols-5 grid-rows-[60px_repeat(4,_1fr)] w-full h-screen overflow-hidden">
        <ModalManager ref={modalManagerRef} />
        {/* Top Nav */}
        <TopNav
          showFileTree={showFileTree}
          setShowFileTree={setShowFileTree}
          factorioStatus={factorioStatus}
          projectInfo={projectInfo}
          handleStart={handleStart}
          handleStop={handleStop}
          handleKill={handleKill}
          reconnectSocket={reconnectSocket}
          handleSave={handleSave}
          handleStartBuild={handleStartBuild}
        />

        <LeftSidebar
          modalManagerRef={modalManagerRef}
          projectInfo={projectInfo}
          loadingInfo={loadingProjectInfo}
          projectId={projectId}
          refreshProjectInfo={refreshProjectInfo}
          tabControlRef={tabControlRef}
          handleEditItem={(item) =>
            handleOpenItemEditor(
              item,
              tabControlRef,
              setFsStatus,
              projectId,
              refreshProjectInfo,
              handleSave,
              modalManagerRef
            )
          }
        />

        {/* Right Sidebar */}
        {showFileTree && (
          <div className="row-start-2 row-end-6 col-start-5 col-end-6 bg-gray-dark p-1 overflow-auto overflow-x-hidden accentuated box-content pr-8">
            <div>
              <span className="flex items-center justify-center text-center text-dirty-white">
                Status: {fsStatus}{" "}
                <DotFilled className={statusColors[fsStatus]} />
              </span>
              <FileTree
                onFileOpen={(file) =>
                  handleFileOpening(
                    file,
                    projectId,
                    tabControlRef,
                    handleSave,
                    modalManagerRef
                  )
                }
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`row-start-2 row-end-6 col-start-2 ${
            showFileTree ? "col-end-5" : "col-end-6"
          } h-full overflow-hidden`}
        >
          <MainEditorTabControl
            ref={tabControlRef}
            className="w-full h-full"
            defaultTabs={[
              {
                id: "welcome",
                title: "Welcome!",
                dataStorage: {
                  isEditor: false,
                },
                content: (
                  <editorViews.ImgViewer
                    key="test"
                    imageUrl="http://localhost:8000/static/img/logo_gray.svg"
                    className="h-[200px]"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Toasts */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
          progressClassName="custom-progress-bar"
        />
      </div>
    </ProjectProvider>
  );
}
