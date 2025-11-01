import Button from "@/components/Button";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

export default function ImgViewer({
  imageUrl = "",
  className,
  checkerBoard = true,
}) {
  const [zoom, setZoom] = useState(1);

  const changeZoom = useCallback((newZoom) => {
    if (newZoom < 0.25) newZoom = 0.25;
    if (newZoom > 3.5) newZoom = 3.5;
    setZoom(newZoom);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          changeZoom(zoom + 0.25);
        } else if (e.key === "-") {
          e.preventDefault();
          changeZoom(zoom - 0.25);
        }
      }
    },
    [zoom, changeZoom]
  );

  const handleWheel = useCallback(
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.25 : -0.25;
        changeZoom(zoom + delta);
      }
    },
    [zoom, changeZoom]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel]);

  const wrapperStyle = {
    ...(checkerBoard && {
      backgroundColor: "#ccc",
      backgroundImage:
        "linear-gradient(45deg, #bbb 25%, transparent 25%), linear-gradient(-45deg, #bbb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #bbb 75%), linear-gradient(-45deg, transparent 75%, #bbb 75%)",
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    }),
    transform: `scale(${zoom})`,
    transition: "transform 0.2s ease-in-out",
  };

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div
      className={`flex flex-col h-full w-full items-center justify-center text-white bg-gray-dark accentuated relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-evenly gap-2 absolute h-10 bottom-4 right-4">
        <Button className="rounded-none w-fit" onClick={() => changeZoom(zoom + 0.25)}>
          <ZoomInIcon />
        </Button>
        <span className="text-sm">{zoomPercentage}%</span>
        <Button className="rounded-none w-fit" onClick={() => changeZoom(zoom - 0.25)}>
          <ZoomOutIcon />
        </Button>
      </div>
      <div className="h-fit w-fit max-h-full max-w-full" style={wrapperStyle}>
        <img src={imageUrl} alt="Preview" className={"" + className} style={{imageRendering: "pixelated"}} />
      </div>
    </div>
  );
}
