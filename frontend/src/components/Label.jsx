import React from "react";

const Label = ({children, htmlFor}) => {
    return (
        <label
            className="flex gap-2 text-white text-sm font-bold mb-1 items-center" htmlFor={htmlFor}>
            {children}
        </label>
    )
}

export default Label;