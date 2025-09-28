import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function HelpIcon({ children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        className="w-5 h-5 flex items-center justify-center rounded-full text-gray-700 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <HelpCircle size={15} />
      </div>
      {isHovered && (
        <div className="absolute bottom-1/2 mb-2 left-1/2 transform -translate-x-1/2 bg-gray-dark text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {children}
        </div>
      )}
    </div>
  );
}
