import React, { forwardRef } from "react";

const Input = forwardRef(({
  register,
  placeholder = undefined,
  type = "text",
  defaultValue = undefined,
  hasAutoComplete = true,
  onKeyDown = () => undefined,
  onChange = () => undefined,
  onBlur = () => undefined,
  min = undefined,
  max = undefined,
  value = undefined,
  disabled = false,
  className = "",
  noShadow = false,
  ...props
}, ref) => {
  // Conditionally apply the value and onChange props only if they exist
  const isControlled = value !== undefined;

  return (
    <input
      ref={ref}
      className={
        "focus:outline-0 appearance-none placeholder-gray-medium/50 text-black leading-[1.2] text-[105%] h-9 bg-gray-light rounded px-[6px] border-0 w-full pl-3 focus:bg-dirty-white " +
        className +
        " " +
        (noShadow ? "" : "input-boxshadow")
      }
      placeholder={placeholder}
      {...register}
      type={type}
      onKeyDown={onKeyDown}
      onChange={onChange}
      autoComplete={hasAutoComplete ? "on" : "off"}
      defaultValue={defaultValue}
      min={min}
      max={max}
      onBlur={onBlur}
      value={isControlled ? value : undefined} // Only apply value if controlled
      disabled={disabled}
      {...props}
    />
  );
});

export default Input;
