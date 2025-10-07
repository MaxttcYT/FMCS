import React from "react";
import { Link } from "react-router-dom";

const ButtonLink = ({ children, href, type, target, className, size }) => {
  let color = "";
  let padding = "";

  switch (type) {
    case "success":
      color = "bg-green hover:glow-green hover:bg-green-light";
      break;
    case "danger":
      color = "bg-red hover:glow-red hover:bg-red-light";
      break;
    default:
      color = "bg-gray-light hover:glow-orange hover:bg-orange";
  }

  switch (size) {
    case "sm":
      padding = "py-1 px-2";
      break;
    default:
      padding = "py-2 px-4";
  }

  return (
    <Link
      to={href}
      target={target}
      className={`${className ? className : null} ${color} ${padding} inline-block accentuated text-black font-bold`}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
