import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Panel from "./Panel";
import { DotFilled } from "./CustomIcons";
import { ItemIconRenderer } from "./ItemIconRenderer";

export const Inventory = forwardRef(({ onSelect = () => {}, projectid, dataUrl=`${process.env.API_URL}/api/inventory/items/${projectid}` }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemTab, setSelectedItemTab] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(dataUrl)
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
            icon_size={value.data.icon_size}
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
                                        onSelect?.(item);
                                        console.log(item);
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
  icon_size=128,
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
        src={`${process.env.API_URL}${transformPath(icon)}?crop=${icon_size}x${icon_size}`}
        width={66}
      />
    </button>
  );
}

export function InventoryItem({ data, isActive, onClick }) {
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
        <ItemIconRenderer icons={iconsToRender} itemData={data} />
      ) : (
        <ItemIconRenderer icons={["__base__/graphics/icons/signal/signal-question-mark.png"]} itemData={data} />
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
