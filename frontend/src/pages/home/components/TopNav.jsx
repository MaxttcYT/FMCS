import Button from "@/components/Button";
import MenuBar from "@/components/MenuBar";
import { faPlay, faSkull, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";

function TopNav({
  showFileTree,
  setShowFileTree,
  factorioStatus,
  projectInfo,
  handleStart,
  handleStop,
  handleKill,
  reconnectSocket,
  handleSave,
  handleStartBuild,
}) {
  const menuData = {
    File: {
      Save: () => handleSave(),
      Build: () => handleStartBuild(),
      "Build and Run": () => handleStart(),
      New: {
        Project: () => (window.location.href = "/?newproject=true"),
      },
      "Project Dashboard": () => (window.location.href = "/"),
      Restart: () => window.location.reload(),
    },
    Server: {
      Reconnect: () => {
        reconnectSocket();
      },
    },
    Window: {
      [`${showFileTree ? "✓ " : ""}Show File Viewer`]: () => {
        setShowFileTree(!showFileTree);
      },
    },
  };

  return (
    <div className="col-span-5 row-start-1 row-end-2 bg-gray-dark p-2 text-dirty-white flex items-center justify-between">
      <div className="flex-1 flex items-center pl-10">
        <MenuBar menuData={menuData} />
      </div>
      <div
        className="flex-none flex items-center justify-center gap-2"
        id="nav-preview_controlls"
      >
        {factorioStatus === null ? (
          <Button size="sm" isLoading title="Loading..." isDisabled />
        ) : factorioStatus ? (
          <>
            <Button
              onClick={handleKill}
              type="danger"
              size="sm"
              title="Kill Factorio"
              id="kill-factorio-button"
            >
              <FontAwesomeIcon icon={faSkull} size="xl" />
            </Button>
            <Button
              onClick={handleStop}
              type="danger"
              size="sm"
              title="Stop Factorio"
              id="stop-factorio-button"
            >
              <FontAwesomeIcon icon={faStop} size="xl" />
            </Button>
          </>
        ) : (
          <Button
            onClick={handleStart}
            type="success"
            size="sm"
            title="Start Factorio"
            id="start-factorio-button"
          >
            <FontAwesomeIcon icon={faPlay} size="xl" />
          </Button>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className="pr-5">{projectInfo?.title || "LOADING..."}</span>
      </div>
    </div>
  );
}

export default TopNav;
