import { FileQuestion, X } from "lucide-react";
import React, { useCallback, useState } from "react";

const TabTitle = ({
  title,
  setSelectedTab,
  index,
  isActive,
  className,
  onTabClose,
  icon = <FileQuestion />,
  hoverIcon = icon,
  TypeIcon = null,
  tabType = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const onClick = useCallback(() => {
    setSelectedTab(index);
  }, [setSelectedTab, index]);

  const handleTabClose = (e) => {
    e.stopPropagation();
    if (onTabClose) onTabClose();
  };

  return (
    <div
      className={`inline-flex space-x-2 items-center cursor-pointer px-3 py-2 rounded-t font-bold relative accentuated-2 ${
        isActive
          ? `z-20 text-dirty-white bg-gray-dark active ${className || ""}`
          : `z-0 text-black bg-gray-light hover:glow-orange2 hover:bg-orange ${
              className || ""
            }`
      }`}
      onClick={onClick}
    >
      <span>{TypeIcon}</span>
      <span>{title}</span>
      <span
        className="ml-2 hover:text-blue hover:bg-gray-medium rounded-lg w-6 h-6 flex items-center justify-center"
        onClick={handleTabClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? hoverIcon : icon}
      </span>
    </div>
  );
};

export default TabTitle;
