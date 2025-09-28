import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  createContext,
  useContext,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Input from "./Input";

// Context for SelectOption
const SelectContext = createContext();

export const CustomSelect = forwardRef(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      disabled = false,
      className = "",
      children,
      searchable = true,
      noSelectionLabel = "Select...",
      showGroupIconAsIcon = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchBarRef = useRef(null);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : selected;

    // Sync defaultValue if uncontrolled
    useEffect(() => {
      if (!isControlled) setSelected(defaultValue);
    }, [defaultValue]);

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      get value() {
        return currentValue;
      },
      set value(val) {
        if (!isControlled) setSelected(val);
      },
      openDropdown() {
        setIsOpen(true);
      },
      closeDropdown() {
        setIsOpen(false);
      },
    }));

    const handleSelect = (value) => {
      if (!isControlled) setSelected(value);
      onChange?.(value);
      setIsOpen(false);
      setSearchTerm("");
    };

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input
    useEffect(() => {
      if (!searchable || !isOpen) return;
      if (searchBarRef.current) searchBarRef.current.focus();
    }, [isOpen, searchable]);

    // Inject group icons
    const injectGroupIcons = (childrenArray, parentIcon = null) =>
      React.Children.map(childrenArray, (child) => {
        if (!child) return null;
        if (child.type === SelectOption) {
          if (showGroupIconAsIcon && !child.props.icon && parentIcon) {
            return React.cloneElement(child, { icon: parentIcon });
          }
          return child;
        }
        if (child.type === SelectGroup) {
          return React.cloneElement(child, {
            children: injectGroupIcons(
              child.props.children,
              child.props.icon || parentIcon
            ),
          });
        }
        return child;
      });

    const childrenWithIcons = injectGroupIcons(children);

    // Find selected option
    const findSelectedOption = (childrenArray) => {
      for (let child of React.Children.toArray(childrenArray)) {
        if (!child) continue;
        if (child.type === SelectOption && String(child.props.value) === String(currentValue))
          return child;
        if (child.type === SelectGroup) {
          const found = findSelectedOption(child.props.children);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedOption = findSelectedOption(childrenWithIcons);

    // Filter options by search term
    const filterChildren = (childrenArray) =>
      React.Children.toArray(childrenArray)
        .map((child) => {
          if (!child) return null;
          if (child.type === SelectOption) {
            return child.props.children
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
              ? child
              : null;
          }
          if (child.type === SelectGroup) {
            const filteredChildren = filterChildren(child.props.children).filter(Boolean);
            if (
              child.props.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              filteredChildren.length > 0
            ) {
              return React.cloneElement(child, { children: filteredChildren });
            }
            return null;
          }
          return null;
        })
        .filter(Boolean);

    const filteredChildren = searchable ? filterChildren(children) : children;

    return (
      <SelectContext.Provider
        value={{
          selected: currentValue,
          handleSelect,
          isOpen,
          setIsOpen,
          disabled,
        }}
      >
        <div
          className={`relative w-full ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
          ref={dropdownRef}
        >
          <div
            className="accentuated-2 flex justify-between items-center bg-gray-light text-black py-2 px-3 cursor-pointer select-none"
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <span className="flex items-center gap-2">
              {selectedOption?.props.icon && (
                <img
                  src={selectedOption.props.icon.url}
                  width={selectedOption.props.icon.width || 32}
                  alt="icon"
                />
              )}
              {selectedOption ? selectedOption.props.children : noSelectionLabel}
            </span>
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4" />
          </div>

          {isOpen && (
            <div className="accentuated absolute z-10 w-full bg-gray-medium shadow max-h-[25rem] overflow-y-auto">
              {searchable && (
                <div className="w-full my-2 px-5">
                  <Input
                    ref={searchBarRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full"
                  />
                </div>
              )}
              {filteredChildren}
            </div>
          )}
        </div>
      </SelectContext.Provider>
    );
  }
);

export const LazyImage = ({ src, width = 32, alt = "icon" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{isVisible && <img src={src} width={width} alt={alt} />}</div>;
};

export const SelectOption = ({ value, children, icon }) => {
  const { selected, handleSelect, disabled } = useContext(SelectContext);
  return (
    <div
      className={`flex items-center gap-2 accentuated px-3 py-2 cursor-pointer bg-gray-light hover:bg-orange hover:glow-orange text-black ${
        selected === value ? "font-semibold" : ""
      }`}
      onClick={() => !disabled && handleSelect(value)}
    >
      {icon && <LazyImage src={icon.url} width={icon.width || 32} />}
      {children}
    </div>
  );
};

// Updated SelectGroup
export const SelectGroup = ({ label, children, icon }) => {
  return (
    <div className="accentuated bg-gray-medium p-2 select-group">
      <div className="flex items-center gap-4 px-3 py-1 font-semibold">
        {icon && <LazyImage src={icon.url} width={icon.width || 64} />}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
};