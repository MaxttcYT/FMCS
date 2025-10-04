import React, { useState, useEffect, useCallback } from "react";

export default function CommandPalette({ getTabs, setActiveTab=()=>{} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    const tabs = getTabs();

    const newCommands = tabs.map((tab, index) => ({
      id: tab.id,
      name: tab.title,
      action: () => setActiveTab(index),
    }));

    setCommands(newCommands);
  }, [isOpen]);

  // Filter commands based on query
  const filtered = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      // Ctrl + Shift + P toggles the palette
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowDown")
        setSelectedIndex((i) => (i + 1) % filtered.length);
      if (e.key === "ArrowUp")
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      if (e.key === "Enter" && filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    },
    [isOpen, filtered, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-40 z-50">
      <div className="bg-black w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border border-gray-light">
        <input
          type="text"
          placeholder="Search Tab by Name"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={()=>setIsOpen(false)}
          className="w-full bg-[#252526] text-white px-4 py-3 outline-none border-b border-[#333]"
        />
        <ul className="max-h-64 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((cmd, i) => (
              <li
                key={cmd.id}
                className={`px-4 py-2 cursor-pointer text-dirty-white ${
                  i === selectedIndex
                    ? "accentuated bg-gray-medium"
                    : "hover:bg-gray-medium/40"
                }`}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                }}
              >
                {cmd.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">No Tabs found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
