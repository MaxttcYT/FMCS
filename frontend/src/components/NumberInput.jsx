import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import Button from "./Button";
import Input from "./Input";

const NumberInput = React.forwardRef(
  (
    {
      value,
      onChange = () => {},
      min = 0,
      max = 100,
      step = 1,
      className = "",
    },
    ref
  ) => {
    const increment = () => {
      if ((value || 0) + step <= max) onChange((value || 0) + step);
    };

    const decrement = () => {
      if ((value || 0) - step >= min) onChange((value || 0) - step);
    };

    const handleChange = (e) => {
      const newValue = e.target.value;
      if (newValue === "") {
        onChange(""); // allow empty string
        return;
      }
      const parsed = parseInt(newValue, 10);
      if (!isNaN(parsed)) {
        const clampedValue = Math.min(Math.max(parsed, min), max);
        onChange(clampedValue);
      }
    };

    const handleBlur = () => {
      if (value === "" || value === null || value === undefined) {
        onChange(min); // reset to min if empty
      }
    };

    return (
      <div className={"relative w-24 rounded " + className}>
        <Input
          ref={ref}
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="!h-11"
          style={{ MozAppearance: "textfield" }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-[2px] flex flex-col justify-center">
          <Button type="default" size="xs" onClick={increment}>
            <ChevronUp size={14} />
          </Button>
          <Button type="default" size="xs" onClick={decrement}>
            <ChevronDown size={14} />
          </Button>
        </div>
        <style>
          {`
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          `}
        </style>
      </div>
    );
  }
);

export default NumberInput;
