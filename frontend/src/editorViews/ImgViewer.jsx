import React, { useState } from "react";

export default function ImgViewer({ imageUrl="", className }) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center text-white bg-gray-dark accentuated">
      <img src={`${imageUrl}`} className={"" + className} />
      </div>
  );
}
