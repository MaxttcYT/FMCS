import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSkull, faStop } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button";
import MenuBar from "@/components/MenuBar";

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
  const navigate = useNavigate();

  const menuData = {
    File: {
      "Save File": {
        action: handleSave,
        keybind: "Ctrl+S",
      },
      Build: {
        Build: handleStartBuild,
        "Build and Run": handleStart,
      },
      "Reload Editor": {
        action: () => window.location.reload(),
      },
      "Close Editor": () => navigate("/"),
      New: {
        Project: () => navigate("/?newproject=true"),
      },
    },
    Server: {
      Reconnect: reconnectSocket,
    },
    Window: {
      [`${showFileTree ? "✓ " : ""}Show File Tree Panel`]: () =>
        setShowFileTree(!showFileTree),
    },
    Help: {
      "Open Docs": () => window.open("https://docs.fmcs.maxttc.me", "_blank"),
    },
  };

  return (
    <div className="col-span-5 row-start-1 row-end-2 bg-gray-dark p-2 text-dirty-white flex items-center justify-between">
      {/* Left: Menu Bar */}
      <div className="flex-1 flex items-center pl-10">
        <MenuBar menuData={menuData} />
      </div>

      {/* Center: Factorio Controls */}
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

      {/* Right: Project Info */}
      <div className="flex-1 flex items-center justify-center">
        <span className="pr-5">{projectInfo?.title || "LOADING..."}</span>
      </div>
    </div>
  );
}

export default TopNav;
