import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { RefreshCcw } from "lucide-react";

function BuildLog({ socket, projectId, projectInfo, reconnectSocket }) {
  const [buildLog, setBuildLog] = useState([
    { content: "Initializing Build...", logType: "default" },
  ]);

  const logContainerRef = useRef(null);

  const addLog = (content, logType = "default") => {
    const newLog = {
      content: content,
      logType: logType,
    };
    setBuildLog((prevLogs) => [...prevLogs, newLog]);
  };

  const logClassNames = {
    info: "bg-blue/20 text-blue",
    default: "text-white",
    error: "bg-red/20 text-red",
    success: "bg-green-light/30 text-green-light",
  };

  const handleReconnect = () => {
    addLog("Reconnecting to server...", "info");
    reconnectSocket();
  };

  useEffect(() => {
    if (!socket) return;

    const handler = (s) => addLog(s.content, s.logType);
    socket.on("build_log", handler);

    socket.emit("start_build", { abc: "abc" }, (response) => {
      if (response === "ok") {
        addLog("Build initialized", "default");
      } else {
        addLog("[ERROR] Server Responded: " + response, "error");
        addLog("Build Canceled", "error");
      }
    });

    // Proper cleanup
    return () => socket.off("build_log", handler);
  }, [socket]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [buildLog]);

  return (
    <div
      className="relative flex flex-col overflow-y-auto h-[25rem] scroll-gray bg-black p-4 px-6"
      ref={logContainerRef}
    >
      <div className="w-full sticky top-0 flex items-end justify-end">
        <Button
          size={"sm"}
          className={"w-fit"}
          title={"Reconnect to server"}
          onClick={handleReconnect}
        >
          <RefreshCcw />
        </Button>
      </div>
      {buildLog.map((log, index, array) => {
        return (
          <div
            key={index}
            className={`${logClassNames[log.logType]} px-5 py-1`}
          >
            <h1>{log.content}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default BuildLog;
