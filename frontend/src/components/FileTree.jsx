import React, { useEffect, useState, useRef } from "react";
import {
  faCaretRight,
  faFile,
  faFolder,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as setiIcons from "seti-icons-react";
import {
  EyeClosed,
  EyeOff,
  FilePlus,
  FolderPlus,
  RefreshCcw,
} from "lucide-react";
import { useProject } from "../context/ProjectContext";
import CustomContextMenu from "./CustomContextMenu";
import ModalManager from "./ModalManager";

function NewEntryInput({ parentPath, onDone, type = "file" }) {
  const [name, setName] = useState("");
  const PROJECT_ID = useProject();

  const createEntry = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return onDone();

    try {
      const endpoint =
        type === "folder"
          ? `${process.env.API_URL}/api/files/${PROJECT_ID}/create-folder`
          : `${process.env.API_URL}/api/files/${PROJECT_ID}/create-file`;

      const payload =
        type === "folder"
          ? { path: `${parentPath}/${trimmedName}` }
          : { path: `${parentPath}/${trimmedName}`, content: "" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Fehler beim Erstellen");
      onDone();
    } catch (err) {
      console.error("Fehler beim Erstellen:", err);
      onDone();
    }
  };

  return (
    <div className="pl-6 pt-1">
      <input
        autoFocus
        className="h-8 bg-gray-medium text-white px-2 py-1 rounded w-full outline-none border border-blue"
        value={name}
        placeholder={type === "folder" ? "New folder" : "New file"}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") createEntry();
          if (e.key === "Escape") onDone();
        }}
        onBlur={onDone}
      />
    </div>
  );
}

const FileTreeItem = ({
  node,
  openMap,
  setOpenMap,
  onFileOpen = () => {},
  isRoot = false,
  onRefresh = () => {},
  isRefreshing = false,
  selectedNode,
  setSelectedNode,
  addingEntry,
  setAddingEntry,
  draggedOverPath,
  setDraggedOverPath,
  onContextMenuNode,
}) => {
  const PROJECT_ID = useProject();
  const isOpen = openMap[node.path] || false;
  const isSelected = selectedNode.path === node.path;

  const normalizeFilePath = (filename) => filename?.replace(/\\/g, "/") || "";

  const toggle = () => {
    if (node.type === "folder") {
      setOpenMap((prev) => ({ ...prev, [node.path]: !isOpen }));
    } else {
      onFileOpen(node);
    }
    setSelectedNode(node);
  };

  const handleAddFile = (e) => {
    e.stopPropagation();
    setAddingEntry({ path: selectedNode.path, type: "file" });
    setOpenMap((prev) => ({ ...prev, [selectedNode.path]: true }));
  };

  const handleAddFolder = (e) => {
    e.stopPropagation();
    setAddingEntry({ path: selectedNode.path, type: "folder" });
    setOpenMap((prev) => ({ ...prev, [selectedNode.path]: true }));
  };

  const isAncestorOrSelf = (targetPath, currentPath) =>
    targetPath && currentPath && targetPath.startsWith(currentPath);

  return (
    <div
      className={`truncate ml-4 ${node.is_readonly ? "opacity-50" : ""} ${
        node.hidden ? "hidden " : "visible"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 cursor-pointer select-none px-2 py-1 rounded-lg transition-all duration-200 ease-in-out
        ${node.type === "folder" ? "hover:text-blue" : ""}
        ${isSelected ? "selected bg-gray-light/30" : ""}
        ${
          isAncestorOrSelf(draggedOverPath, node.path) && node.type === "folder"
            ? "bg-blue-light/30"
            : ""
        }`}
        onClick={toggle}
        onContextMenu={(e) => onContextMenuNode(e, node)}
        draggable={node.type === "file"}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", node.path);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDraggedOverPath(node.path);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setDraggedOverPath(null);
          }
        }}
        onDrop={async (e) => {
          e.preventDefault();
          const draggedPath = e.dataTransfer.getData("text/plain");
          const newParentPath =
            node.type === "folder"
              ? node.path
              : node.path.split("/").slice(0, -1).join("/");
          const fileName = draggedPath.split("/").pop();
          const destination = `${newParentPath}/${fileName}`;

          try {
            const res = await fetch(
              `${process.env.API_URL}/api/files/${PROJECT_ID}/move-file`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ source: draggedPath, destination }),
              }
            );

            if (!res.ok) throw new Error("Fehler beim Verschieben der Datei");

            setSelectedNode(node);
            setOpenMap((prev) => ({ ...prev, [newParentPath]: true }));
            setDraggedOverPath(null);
            onRefresh();
          } catch (err) {
            console.error("Move error:", err);
            setDraggedOverPath(null);
          }
        }}
      >
        <div
          className="flex items-center gap-1 w-full"
          title={node.hidden ? "This file is hidden" : node.path}
        >
          {node.type === "folder" && (
            <span
              className={`transition-transform duration-300 ease-in-out font-mono text-orange transform ${
                isOpen ? "rotate-90" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </span>
          )}
          <span className="w-[22px] h-[22px] flex items-center justify-center">
            {node.type === "folder" ? (
              <FontAwesomeIcon icon={faFolder} style={{ color: "#FFD43B" }} />
            ) : (
              (() => {
                const IconComponent = setiIcons[node.icon?.icon];
                const iconTheme = node.icon?.theme || node.icon?.extension;
                return IconComponent ? (
                  <IconComponent
                    theme={iconTheme}
                    style={{ width: 22, height: 22 }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faFile} />
                );
              })()
            )}
          </span>
          <span className="text-dirty-white overflow-hidden whitespace-nowrap text-ellipsis block w-full">
            {node.name}
          </span>
        </div>

        {isRoot && !node.is_readonly && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <span
              className="text-white rounded-lg p-1 hover:text-blue hover:bg-gray-medium"
              onClick={handleAddFile}
            >
              <FilePlus size={18} />
            </span>
            <span
              className="text-white rounded-lg p-1 hover:text-blue hover:bg-gray-medium"
              onClick={handleAddFolder}
            >
              <FolderPlus size={18} />
            </span>
            <span
              className="text-white rounded-lg p-1 hover:text-blue hover:bg-gray-medium"
              onClick={onRefresh}
            >
              <RefreshCcw
                size={18}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </span>
          </div>
        )}

        {node.hidden && <EyeOff className="text-white" size={18} />}
      </div>

      {isOpen &&
        node.children?.map((child) => (
          <FileTreeItem
            key={normalizeFilePath(child.path) || child.name}
            node={child}
            openMap={openMap}
            setOpenMap={setOpenMap}
            onFileOpen={onFileOpen}
            isRoot={false}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            addingEntry={addingEntry}
            setAddingEntry={setAddingEntry}
            draggedOverPath={draggedOverPath}
            setDraggedOverPath={setDraggedOverPath}
            onContextMenuNode={onContextMenuNode}
          />
        ))}

      {normalizeFilePath(addingEntry?.path) ===
        normalizeFilePath(node.path) && (
        <NewEntryInput
          parentPath={node.path}
          type={addingEntry.type}
          onDone={() => {
            setAddingEntry(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default function FileTree({ onFileOpen = () => {} }) {
  const PROJECT_ID = useProject();
  const [tree, setTree] = useState(null);
  const [openMap, setOpenMap] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [addingEntry, setAddingEntry] = useState(null);
  const [draggedOverPath, setDraggedOverPath] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const [contextNode, setContextNode] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modalManagrRef = useRef();

  const fetchTree = () => {
    setIsRefreshing(true);
    fetch(`${process.env.API_URL}/api/files/${PROJECT_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setTree(data);
        setOpenMap((prev) => {
          if (prev.hasOwnProperty(data.path)) return prev;
          return { ...prev, [data.path]: true };
        });
        if (!selectedNode) setSelectedNode(data);
        setAddingEntry(null);
      })
      .catch((err) => console.error("Failed to fetch file tree:", err))
      .finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      });
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const handleContextMenuNode = (e, node) => {
    e.preventDefault();
    setContextNode(node);
    const menuWidth = 200; // adjust this to your menu's width
    let x = e.pageX;
    let y = e.pageY;

    // Check if the menu would overflow the right edge
    if (x + menuWidth > window.innerWidth) {
      x -= 200; // shift left by 50 if it collides
    }

    setMenuPos({ x, y });
  };

  const closeMenu = () => {
    setMenuPos(null);
    setContextNode(null);
  };

  const deleteNode = (node) => {
    modalManagrRef.current.addConfirmModal({
      title: "Project Deletion",
      content: (
        <div className="flex flex-col gap-4 p-2">
          <h1 className="text-2xl text-red">
            Do you really want to delete "{node.path}"?
          </h1>
          <p className="text-xl">This is unreversable!</p>
        </div>
      ),
      onYes: () => {
        const payload = {
          path: node.path,
        };
        fetch(`${process.env.API_URL}/api/files/${PROJECT_ID}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => {
            fetchTree();
          })
          .catch((err) => console.error("Failed to delete entry:", err));
      },
    });
  };

  const getContextMenuItems = (node) => {
    if (!node) return [];

    if (node.type === "file") {
      return [
        { label: "Open", onClick: () => onFileOpen(node) },
        //{ label: "Rename", onClick: () => console.log("Rename file:", node) },
        { label: "Delete", onClick: () => deleteNode(node) },
      ];
    }

    if (node.type === "folder") {
      return [
        //{ label: "New File", onClick: () => setAddingEntry({ path: node.path, type: "file" }) },
        //{ label: "New Folder", onClick: () => setAddingEntry({ path: node.path + node.name, type: "folder" }) },
        { label: "Delete", onClick: () => deleteNode(node) },
      ];
    }

    return [];
  };

  return (
    <div
      className="p-2 text-sm box-content w-full overflow-hidden"
      style={{ overflowY: "auto", minHeight: "300px" }}
    >
      <ModalManager ref={modalManagrRef} />
      {tree ? (
        <>
          <FileTreeItem
            node={tree}
            openMap={openMap}
            setOpenMap={setOpenMap}
            onFileOpen={onFileOpen}
            isRoot={true}
            onRefresh={fetchTree}
            isRefreshing={isRefreshing}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            addingEntry={addingEntry}
            setAddingEntry={setAddingEntry}
            draggedOverPath={draggedOverPath}
            setDraggedOverPath={setDraggedOverPath}
            onContextMenuNode={handleContextMenuNode}
          />
          {menuPos && contextNode && (
            <CustomContextMenu
              x={menuPos.x}
              y={menuPos.y}
              node={contextNode}
              onClose={closeMenu}
              data={getContextMenuItems(contextNode)}
            />
          )}
        </>
      ) : (
        <div className="text-dirty-white p-2 text-sm flex items-center justify-center h-full w-full flex-col gap-2">
          <h1 className="text-lg">Loading...</h1>
          <FontAwesomeIcon icon={faSpinner} spin={true} size="2x" />
        </div>
      )}
    </div>
  );
}
