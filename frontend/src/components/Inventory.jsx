import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Panel from "./Panel";
import { DotFilled } from "./CustomIcons";

export const Inventory = forwardRef(({onSelect=()=>{}}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemTab, setSelectedItemTab] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.API_URL}/api/inventory/items`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        // Auto-select first tab
        const firstKey = Object.keys(data)[0];
        if (firstKey) setSelectedTab(firstKey);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Expose imperative methods to parent
  useImperativeHandle(ref, () => ({
    getSelectedItem: () => selectedItem,
  }));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-wrap w-full bg-gray-dark px-[1px]">
        {Object.entries(data).map(([key, value]) => (
          <InventoryTab
            key={key}
            label={key}
            icon={value.data.icon}
            isActive={selectedTab === key}
            onClick={() => setSelectedTab(key)}
            isActiveItemTab={selectedItemTab === key}
          />
        ))}
      </div>
      <Panel
        className={"bg-gray-medium"}
        contentWrapperClassName={"!bg-gray-dark shadow-none"}
        noInnerPadding={true}
        content={
          <>
            {selectedTab && (
              <div className="overflow-y-auto h-[31.8rem] scroll-gray">
                {(() => {
                  const columns = 10;
                  let allRowsCount = 0;

                  return (
                    <>
                      {Object.entries(data[selectedTab]["subgroups"]).map(
                        ([subKey, subgroup], subgroupIndex) => {
                          const itemsArray = Object.entries(subgroup.items);
                          const subgroupRows = Math.ceil(
                            itemsArray.length / columns
                          );
                          allRowsCount += subgroupRows;

                          const numSlots = subgroupRows * columns;

                          return (
                            <div
                              className="grid grid-cols-10 gap-[2px] mt-[2px] first:mt-0"
                              key={subKey + subgroupIndex}
                            >
                              {Array.from({ length: numSlots }).map((_, i) => {
                                const itemEntry = itemsArray[i];
                                if (itemEntry) {
                                  const [itemKey, item] = itemEntry;
                                  return (
                                    <InventoryItem
                                      data={item}
                                      key={itemKey + i}
                                      onClick={() => {
                                        setSelectedItem(item);
                                        setSelectedItemTab(selectedTab);
                                        onSelect?.(item)
                                      }}
                                      isActive={
                                        selectedItem?.name === item.name
                                      }
                                    />
                                  );
                                } else {
                                  return (
                                    <InventoryPlaceholder key={`empty-${i}`} />
                                  );
                                }
                              })}
                            </div>
                          );
                        }
                      )}

                      {allRowsCount < 10 && (
                        <div className="grid grid-cols-10 gap-[2px] mt-[2px]">
                          {Array.from({
                            length: (10 - allRowsCount) * columns,
                          }).map((_, i) => (
                            <InventoryPlaceholder key={`extra-${i}`} />
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        }
      />
    </div>
  );
});

export function InventoryTab({
  label,
  icon,
  isActive,
  isActiveItemTab,
  onClick,
}) {
  function transformPath(inputPath) {
    return inputPath
      .replace(/^__/, "") // Remove leading double underscores
      .replace(/\/?__(?=\/|$)/g, "") // Remove trailing double underscores before slash or end
      .replace(/graphics/, "") // Remove 'graphics'
      .replace(/\/+/g, "/") // Normalize multiple slashes
      .replace(/^\/?/, "/icon/"); // Ensure it starts with '/icon/'
  }

  return (
    <button
      className={`relative shadow-[0px_5px_0px_0px_#403f40] transition-colors flex-1 flex items-center justify-center px-4 py-2 bg-gray-light -mb-px ${
        isActive ? "bg-gray-medium border-2 border-gray-medium" : "accentuated"
      }`}
      onClick={onClick}
    >
      {isActiveItemTab && (
        <DotFilled
          fill={"orange"}
          className={"absolute top-1 right-1 w-5 h-5"}
        />
      )}
      <img
        src={`${process.env.API_URL}${transformPath(icon)}?crop=128x128`}
        width={66}
      />
    </button>
  );
}

export function InventoryItem({ data, isActive, onClick }) {
  function transformPath(inputPath) {
    return inputPath
      .replace(/^__/, "")
      .replace(/\/?__(?=\/|$)/g, "")
      .replace(/graphics/, "")
      .replace(/\/+/g, "/")
      .replace(/^\/?/, "/icon/");
  }

  function renderIcon(iconData, itemData, index = 0, single = false) {
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

  let iconsToRender;
  let single = false;

  if (data.icons && data.icons.length > 0) {
    iconsToRender = data.icons;
    single = data.icons.length === 1;
  } else if (data.icon) {
    iconsToRender = [data.icon];
    single = true;
  } else {
    iconsToRender = [];
  }

  return (
    <button
      className={`relative px-2 py-1 bg-gray-dark accentuated -mb-px transition-colors w-[50px] h-[50px] rounded-md ${
        isActive ? "bg-orange" : "accentuated"
      }`}
      onClick={onClick}
      title={data.name}
    >
      {iconsToRender.length > 0 ? (
        single ? (
          renderIcon(iconsToRender[0], data, 0, true)
        ) : (
          <div className="relative w-8 h-8">
            {iconsToRender.map((iconData, i) => renderIcon(iconData, data, i))}
          </div>
        )
      ) : (
        <h1>{data.name}</h1>
      )}
    </button>
  );
}

export function InventoryPlaceholder() {
  return (
    <div
      className={`relative p-2 bg-gray-dark -mb-px transition-colors w-[50px] h-[50px]`}
    >
      <div className="accentuated w-full aspect-square" />
    </div>
  );
}
