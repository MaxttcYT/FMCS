import React from "react";

function transformPath(inputPath) {
  return inputPath
    .replace(/^__/, "")
    .replace(/\/?__(?=\/|$)/g, "")
    .replace(/graphics/, "")
    .replace(/\/+/g, "/")
    .replace(/^\/?/, "/icon/");
}

export function ItemIconRenderer({ icons, itemData }) {
  if (!icons || icons.length === 0) return null;

  const single = icons.length === 1;

  function renderIcon(iconData, index = 0) {
    const icon_size = itemData.icon_size || 64;
    const hasTint = !!iconData?.tint;

    const src = `${process.env.API_URL}${transformPath(
      iconData.icon ?? iconData
    )}${
      hasTint
        ? `?tint=${iconData.tint.r ?? 0},${iconData.tint.g ?? 0},${
            iconData.tint.b ?? 0
          },${iconData.tint.a ?? 1}&crop=${icon_size}x${icon_size}`
        : `?crop=${icon_size}x${icon_size}`
    }`;

    return (
      <img
        key={index}
        src={src}
        width={32}
        height={32}
        className="h-auto w-[32px]"
        style={{
          position: single ? "static" : "absolute",
          top: 0,
          left: 0,
          filter: "drop-shadow(0px 0px 4px #000)",
        }}
      />
    );
  }

  return single ? (
    renderIcon(icons[0], 0)
  ) : (
    <div className="relative w-8 h-8">
      {icons.map((iconData, i) => renderIcon(iconData, i))}
    </div>
  );
}
