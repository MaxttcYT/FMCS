import React from "react";

export const DotFilled = ({ fill, className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={fill || "currentColor"} className={className}>
    <circle cx="12" cy="12" r="6" />
  </svg>
);