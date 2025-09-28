import React from "react";

const Checkbox = ({ text, checked }) => {
  return (
      <label className="checkbox">
        <input type="checkbox" defaultChecked={checked} />
        <div className="checkmark"></div>
        <div className="w-full pl-2">
          {text}
        </div>
      </label>
  );
};

export default Checkbox;
