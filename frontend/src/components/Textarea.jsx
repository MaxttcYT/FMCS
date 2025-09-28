import React from "react";

// Forwarding ref to the textarea element
const Textarea = React.forwardRef(
  (
    {
      register,
      placeholder = undefined,
      type = "text",
      defaultValue = undefined,
      hasAutoComplete = true,
      onKeyDown = () => undefined,
      onChange = () => undefined,
      value = undefined,
      disabled = false,
      className = "",
      noShadow = false,
      rows = 12,
    },
    ref // ref is passed as a second argument
  ) => {
    return (
      <textarea
        ref={ref} // attaching the ref to the textarea element
        rows={rows} // default height
        className={
          "focus:outline-0 appearance-none placeholder-gray-medium/50 text-black leading-[1.5] text-base h-full bg-gray-light rounded px-3 py-2 border-0 w-full focus:bg-dirty-white " +
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
        value={value}
        disabled={disabled}
      />
    );
  }
);

export default Textarea;
