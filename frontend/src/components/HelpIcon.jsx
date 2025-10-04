import React, { useState } from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";

export default function HelpIcon({ children }) {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
      height: rect.height,
    });
    setIsHovered(true);
  };

  return (
    <div className="relative inline-block">
      <div
        className="w-5 h-5 flex items-center justify-center rounded-full text-gray-700 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <HelpCircle size={15} className="stroke-white" />
      </div>

      {isHovered &&
        createPortal(
          <div
            style={{
              position: "absolute",
              left: coords.left,
              top: coords.top, // small offset from icon
              transform: "translate(-50%, -100%)", // moves tooltip above the icon
              backgroundColor: "#333",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "14px",
              whiteSpace: "normal", // allows text to wrap
              textAlign: "center",
              maxWidth: "20rem",
              zIndex: 9999,
              outline: "white 1px solid"
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
}
