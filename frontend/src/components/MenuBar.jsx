import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";

const MenuItem = ({ label, submenu, clickHandler, closeMenu }) => {
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
    }, 200); // slight delay to allow moving into submenu
  };

  const handleClick = () => {
    if (clickHandler) {
      clickHandler(); // Trigger the click handler for this menu item
      closeMenu(); // Close the menu after the click handler finishes
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="accentuated px-4 py-2 hover:bg-gray-dark hover:text-blue cursor-pointer whitespace-nowrap transition-colors duration-150 rounded flex justify-between items-center"
        onClick={handleClick} // Add click handler here
      >
        {label}
        {hasSubmenu && (
          <span className="ml-2">
            <FontAwesomeIcon icon={faCaretRight}></FontAwesomeIcon>
          </span>
        )}
      </div>

      {hasSubmenu && open && (
        <div
          className="absolute top-0 left-full ml-1 bg-gray-medium border-gray-light border rounded shadow-lg z-50 min-w-max"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {Object.entries(submenu).map(([subLabel, subClickHandler]) => (
            <MenuItem
              key={subLabel}
              label={subLabel}
              submenu={typeof subClickHandler === "object" ? subClickHandler : undefined}
              clickHandler={typeof subClickHandler === "function" ? subClickHandler : undefined} // Correctly pass click handler
              closeMenu={closeMenu} // Pass the closeMenu function down
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
            <div className="absolute top-full left-0 mt-1 bg-gray-medium border-gray-light border rounded shadow-lg z-50">
              {Object.entries(items).map(([itemLabel, subMenu]) => (
                <MenuItem
                  key={itemLabel}
                  label={itemLabel}
                  submenu={typeof subMenu === "object" ? subMenu : undefined}
                  clickHandler={typeof subMenu === "function" ? subMenu : undefined}
                  closeMenu={() => setActiveMenu(null)}
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
