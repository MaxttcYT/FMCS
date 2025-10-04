import React from "react";

const Checkbox = ({ text, checked, onChange, className="" }) => {
  const inputOnChange = (e) => {
    const value = e.target.checked;
    onChange?.(value)
  }
  return (
      <label className={`checkbox ${className}`}>
        <input type="checkbox" defaultChecked={checked} onChange={inputOnChange} />
        <div className="checkmark aspect-square"></div>
        <div className="w-full">
          {text}
        </div>
      </label>
  );
};

export default Checkbox;
