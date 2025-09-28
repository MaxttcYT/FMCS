import React, { useState, forwardRef, useImperativeHandle } from "react";
import TabTitle from "./TabTitle";

const TabControl = forwardRef(({ className = "", defaultTabs = [] }, ref) => {
  const [tabs, setTabs] = useState(defaultTabs);
  const [selectedTab, setSelectedTab] = useState(0);

  useImperativeHandle(ref, () => ({
    addTab: (newTab) => {
      setTabs((prevTabs) => {
        if (prevTabs.some((tab) => tab.id === newTab.id)) {
          // If tab exists, switch to it
          const existingIndex = prevTabs.findIndex(t => t.id === newTab.id);
          setSelectedTab(existingIndex);
          return prevTabs;
        }
        setSelectedTab(prevTabs.length); // Switch to new tab
        return [...prevTabs, newTab];
      });
    },
    removeTab: (tabId) => {
      setTabs((prevTabs) => {
        const index = prevTabs.findIndex(tab => tab.id === tabId);
        if (index === selectedTab) {
          // If removing selected tab, select previous tab (or next if no previous)
          setSelectedTab(Math.max(0, index - 1));
        } else if (index < selectedTab) {
          // If removing tab before selected, adjust selected index
          setSelectedTab(selectedTab - 1);
        }
        return prevTabs.filter(tab => tab.id !== tabId);
      });
    }
  }));

  const handleClose = (tabId) => {
    const index = tabs.findIndex(tab => tab.id === tabId);
    if (index !== -1) {
      setTabs((prevTabs) => {
        if (index === selectedTab) {
          setSelectedTab(Math.max(0, index - 1));
        } else if (index < selectedTab) {
          setSelectedTab(selectedTab - 1);
        }
        return prevTabs.filter((_, i) => i !== index);
      });
    }
  };

  const selectedChild = tabs[selectedTab];
  const tabHasSmallPadding = selectedChild?.smallPadding || false;
  const tabInnerClassName = selectedChild?.tabInnerClassName || "";

  return (
    <div
      className={`h-full w-full flex flex-col ${className} tab-bar-scrollbar`}
      style={{ overflow: "hidden" }}
    >
      {/* Tab Titles */}
      <div
        className="px-4 pt-3 flex-shrink-0 flex-nowrap overflow-x-auto overflow-y-hidden"
        style={{ whiteSpace: "nowrap" }}
      >
        {tabs.map((tab, index) => (
          <TabTitle
            className={`${tab.className || ""} mr-2`}
            key={tab.id}
            title={tab.title}
            index={index}
            isActive={index === selectedTab}
            setSelectedTab={setSelectedTab}
            onTabClose={() => handleClose(tab.id)}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className="z-10 relative accentuated bg-gray-dark p-4 flex-grow overflow-hidden">
        <div
          className={
            `text-white rounded-sm bg-gray-medium shadow-inner h-full ` +
            tabInnerClassName +
            (tabHasSmallPadding ? "" : " px-6 pt-4 pb-6")
          }
          style={{ overflow: "hidden" }}
        >
          <div
            className="h-full overflow-auto"
            style={{ padding: tabHasSmallPadding ? "0" : "1rem" }}
          >
            {selectedChild?.content}
          </div>
        </div>
      </div>
    </div>
  );
});

TabControl.displayName = "TabControl";

export default TabControl;