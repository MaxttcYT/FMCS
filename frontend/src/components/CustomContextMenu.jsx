import React, { useEffect, useRef } from "react";

export default function CustomContextMenu({
  x,
  y,
  onClose,
  data = [{ label: "Action 1", onClick: () => alert("Action 1!") }],
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute text-dirty-white flex flex-col select-none rounded border border-white shadow-lg"
      style={{ top: y, left: x, width: 200 }}
      role="menu"
      aria-orientation="vertical"
    >
      {data.map((item, index) => (
        <button
          key={index}
          className="accentuated px-4 py-2 bg-gray-medium hover:bg-gray-dark hover:text-blue cursor-pointer whitespace-nowrap transition-colors duration-150 rounded flex justify-between items-center"
          role="menuitem"
          onClick={() => {
            item.onClick?.();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
