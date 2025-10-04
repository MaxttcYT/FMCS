import React from "react";

const Checkbox = ({ text, checked, onChange, className="" }) => {
  return (
      <label className={`checkbox ${className}`}>
        <input type="checkbox" defaultChecked={checked} onChange={onChange} />
        <div className="checkmark aspect-square"></div>
        <div className="w-full">
          {text}
        </div>
      </label>
  );
};

export default Checkbox;
