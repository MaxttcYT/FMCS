import React, { useRef, useEffect, useState } from "react";

const AnimatedSpriteSheet = ({
  filename,
  initialFrame = 0,
  frameSize,
  rows = 1,
  columns = 1,
  isPlaying,
  loop,
  fps = 12,
  showBoxSizeDebug = false,
}) => {
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(initialFrame);
  const imageRef = useRef(null);
  const totalFrames = rows * columns;

  useEffect(() => {
    const image = new Image();
    image.src = filename;
    imageRef.current = image;
  }, [filename]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = 1000 / fps;

    const timer = setInterval(() => {
      setFrame((prev) => {
        const nextFrame = prev + 1;
        if (nextFrame >= totalFrames) return loop ? 0 : prev;
        return nextFrame;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [fps, isPlaying, loop, totalFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawFrame = () => {
      if (!imageRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate row and column of the current frame
      const row = Math.floor(frame / columns);
      const col = frame % columns;

      const srcX = col * frameSize.width;
      const srcY = row * frameSize.height;

      ctx.drawImage(
        imageRef.current,
        srcX,
        srcY, // source x, y
        frameSize.width,
        frameSize.height, // source width, height
        0,
        0, // destination x, y
        frameSize.width,
        frameSize.height // destination width, height
      );
    };

    drawFrame();
  }, [frame, frameSize, columns]);

  return (
    <canvas
      ref={canvasRef}
      width={frameSize.width}
      height={frameSize.height}
      className={showBoxSizeDebug ? "outline outline-1 outline-red" : ""}
    />
  );
};

export default AnimatedSpriteSheet;
