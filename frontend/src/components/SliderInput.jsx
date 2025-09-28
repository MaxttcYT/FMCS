import React, { useState, useEffect } from "react";

const SliderInput = ({
  min = 0,
  max = 100,
  defaultValue = 50,
  jagged = false,
  showSteps = true,
}) => {
  // Initialize state with defaultValue
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const stepCount = 5; // Number of steps for jagged slider
  const step = jagged ? (max - min) / (stepCount - 1) : 1;

  return (
    <div className="w-full slider-container">
      <div className="slider-step-container">
        {jagged &&
          showSteps &&
          Array.from({ length: stepCount }).map((_, index) => (
            <div key={index} className="slider-step-indicator"></div>
          ))}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value} // Set value to state
        step={step} // Use step based on jagged prop
        className={`w-full slider-input ${jagged ? "jagged" : ""}`}
        style={{ "--value": `${(value / max) * 100}%` }}
        onChange={handleChange}
      />
    </div>
  );
};

export default SliderInput;
