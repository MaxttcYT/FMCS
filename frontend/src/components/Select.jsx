import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const CustomDropdown = forwardRef(
  (
    {
      options = [],
      defaultValue = "",
      onChange,
      disabled = false,
      className = "",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue);
    const dropdownRef = useRef(null);

    // Expose the .value property and functions to the parent component via ref
    useImperativeHandle(ref, () => ({
      get value() {
        return selected;
      },
      set value(val) {
        setSelected(val);
      },
      openDropdown() {
        setIsOpen(true);
      },
      closeDropdown() {
        setIsOpen(false);
      },
    }));

    const handleSelect = (value) => {
      setSelected(value);
      onChange?.(value);
      setIsOpen(false);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === selected);

    return (
      <div
        className={`relative w-full ${
          disabled ? "opacity-50 pointer-events-none" : ""
        } ${className}`}
        ref={dropdownRef}
      >
        <div
          className="accentuated-2 flex justify-between items-center bg-gray-light text-black py-2 px-3 cursor-pointer select-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption ? selectedOption.name : "Select..."}</span>
          <div className="flex gap-1 items-center">
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4" />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full bg-gray-light shadow max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`accentuated px-3 py-2 cursor-pointer hover:bg-orange-light hover:glow-orange hover:bg-orange text-black ${
                  option.value === selected ? "" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default CustomDropdown;
