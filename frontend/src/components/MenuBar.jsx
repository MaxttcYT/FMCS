import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

const MenuItem = ({ label, submenu, clickHandler, closeMenu, keybind }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const hasSubmenu = submenu && typeof submenu === "object";

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200); // Slight delay for smoother submenu hover
  };

  const handleClick = () => {
    if (clickHandler) {
      clickHandler();
      closeMenu(); // Close all menus after an action
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="min-w-[11rem] accentuated px-4 py-2 hover:bg-gray-dark hover:text-blue cursor-pointer whitespace-nowrap transition-colors duration-150 rounded flex justify-between items-center"
        onClick={handleClick}
      >
        {label}
        {keybind && (
          <span className="text-sm text-gray-light font-bold ml-4">{keybind}</span>
        )}
        {hasSubmenu && (
          <FontAwesomeIcon icon={faCaretRight} className="ml-2" />
        )}
      </div>

      {hasSubmenu && open && (
        <div
          className="absolute top-0 left-full ml-1 bg-gray-medium border border-gray-light rounded shadow-lg z-50 min-w-max"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {Object.entries(submenu).map(([subLabel, subValue]) => (
            <MenuItem
              key={subLabel}
              label={subLabel}
              submenu={
                typeof subValue === "object" && !("action" in subValue)
                  ? subValue
                  : undefined
              }
              clickHandler={
                typeof subValue === "function"
                  ? subValue
                  : subValue?.action || undefined
              }
              closeMenu={closeMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MenuBar = ({ menuData }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.closest(".relative")
    ) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="text-dirty-white flex px-2 py-1 space-x-4 select-none"
    >
      {Object.entries(menuData).map(([menu, items]) => (
        <div
          key={menu}
          className="relative"
          onMouseEnter={() => handleMouseEnter(menu)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`px-3 py-1 accentuated transition-colors duration-150 focus:outline-none ${
              activeMenu === menu ? "text-blue bg-gray-medium" : ""
            }`}
            onClick={() => handleMenuClick(menu)}
          >
            {menu}
          </button>

          {activeMenu === menu && (
            <div className="absolute top-full left-0 mt-1 bg-gray-medium border border-gray-light rounded shadow-lg z-50">
              {Object.entries(items).map(([label, value]) => (
                <MenuItem
                  key={label}
                  label={label}
                  submenu={
                    typeof value === "object" && !("action" in value)
                      ? value
                      : undefined
                  }
                  clickHandler={
                    typeof value === "function"
                      ? value
                      : value?.action || undefined
                  }
                  closeMenu={() => setActiveMenu(null)}
                  keybind={value?.keybind || undefined}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;
