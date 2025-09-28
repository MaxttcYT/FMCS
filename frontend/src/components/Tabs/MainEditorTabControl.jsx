import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import TabTitle from "./TabTitle";
import { X } from "lucide-react";

const MainEditorTabControl = forwardRef(
  ({ className = "", defaultTabs = [] }, ref) => {
    const [tabs, setTabs] = useState(defaultTabs);
    const [selectedTab, setSelectedTab] = useState(0);
    const [tabHistory, setTabHistory] = useState([]);

    const tabContainerRef = useRef(null);
    const lastTabRef = useRef(null);
    const tabRefs = useRef({});

    const pushToHistory = (index) => {
      setTabHistory((prev) => [...prev.filter((i) => i !== index), index]);
    };

    useEffect(() => {
      console.log(tabs[selectedTab])
    }, [tabs])
    

    useImperativeHandle(ref, () => ({
      addTab: (newTab) => {
        setTabs((prevTabs) => {
          const existingIndex = prevTabs.findIndex((t) => t.id === newTab.id);
          if (existingIndex !== -1) {
            setSelectedTab(existingIndex);
            pushToHistory(existingIndex);
            return prevTabs;
          }
          const newIndex = prevTabs.length;
          setSelectedTab(newIndex);
          pushToHistory(newIndex);
          return [...prevTabs, newTab];
        });
      },
      removeTab: (tabId) => {
        setTabs((prevTabs) => {
          const index = prevTabs.findIndex((tab) => tab.id === tabId);
          const newTabs = prevTabs.filter((tab) => tab.id !== tabId);

          if (index === selectedTab) {
            const validIndices = newTabs.map((_, i) => i);
            const updatedHistory = tabHistory.filter(
              (i) => i !== index && validIndices.includes(i)
            );
            const fallbackTab =
              updatedHistory.length > 0
                ? updatedHistory[updatedHistory.length - 1]
                : 0;
            setSelectedTab(fallbackTab);
            setTabHistory(updatedHistory);
          } else if (index < selectedTab) {
            setSelectedTab((prev) => prev - 1);
            setTabHistory((prev) =>
              prev
                .map((i) => (i > index ? i - 1 : i))
                .filter((i) => i !== index)
            );
          } else {
            setTabHistory((prev) => prev.filter((i) => i !== index));
          }

          return newTabs;
        });
      },
      updateTabContent: (id, content) => {
        setTabs((tabs) =>
          tabs.map((tab) => (tab.id === id ? { ...tab, content } : tab))
        );
      },
      updateTabIcon: (id, icon, hoverIcon) => {
        setTabs((tabs) =>
          tabs.map((tab) => (tab.id === id ? { ...tab, icon, hoverIcon } : tab))
        );
      },
      updateTabCloseEvent: (id, handleClose) => {
        setTabs((tabs) =>
          tabs.map((tab) => (tab.id === id ? { ...tab, handleClose } : tab))
        );
      },
      updateTabData: (id, data) => {
        setTabs((tabs) =>
          tabs.map((tab) =>
            tab.id === id
              ? { ...tab, dataStorage: { ...tab.dataStorage, ...data } }
              : tab
          )
        );
      },
      updateTabId: (oldId, newId) => {
        setTabs((tabs) =>
          tabs.map((tab) => (tab.id === oldId ? { ...tab, id: newId } : tab))
        );
      },
      updateTabTitle: (id, title) => {
        console.log("NEW TITLE ",title, " FOR ID ", id)
        setTabs((tabs) =>
          tabs.map((tab) => (tab.id === id ? { ...tab, title } : tab))
        );
      },
      setSelectedTab: (index) => {
        if (index >= 0 && index < tabs.length) {
          setSelectedTab(index);
          pushToHistory(index);
        } else {
          console.warn(`setActiveTab: index ${index} is out of bounds`);
        }
      },
      getTabs: () => tabs,
      getSelectedTab: () => tabs[selectedTab],
    }));

    const handleClose = (tabId) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab.handleClose) {
        ref.current?.removeTab(tabId);
      } else {
        tab.handleClose?.();
      }
    };

    const handleSelect = (index) => {
      setSelectedTab(index);
      pushToHistory(index);
    };

    const selectedChild = tabs[selectedTab];
    const tabHasSmallPadding = selectedChild?.smallPadding || false;
    const tabInnerClassName = selectedChild?.tabInnerClassName || "";

    useEffect(() => {
      if (tabRefs.current[selectedTab]) {
        tabRefs.current[selectedTab].scrollIntoView({
          behavior: "smooth",
          inline: "center", // center or end as you prefer
        });
      }
    }, [selectedTab, tabs]);

    return (
      <div
        className={`h-full w-full flex flex-col ${className} tab-bar-scrollbar`}
        style={{ overflow: "hidden" }}
      >
        <div
          ref={tabContainerRef}
          className="px-4 pt-3 flex-shrink-0 flex-nowrap overflow-x-auto overflow-y-hidden"
          style={{ whiteSpace: "nowrap" }}
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              style={{ display: "inline-block" }}
            >
              <TabTitle
              key={tab.id + tab.title}
                className={`${tab.className || ""}`}
                title={tab.title}
                index={index}
                isActive={index === selectedTab}
                setSelectedTab={handleSelect}
                onTabClose={() => handleClose(tab.id)}
                icon={tab.icon || <X />}
                hoverIcon={tab.hoverIcon || tab.icon}
              />
            </div>
          ))}
        </div>

        <div className="z-10 relative accentuated bg-gray-dark p-4 flex-grow overflow-hidden">
          <div
            className={`text-white rounded-sm bg-gray-medium shadow-inner h-full ${tabInnerClassName} ${
              tabHasSmallPadding ? "" : " px-5 pt-4 pb-4"
            } ${selectedChild?.message ? "pb-7" : ""}`}
            style={{ overflow: "hidden" }}
          >
            <span className="text-gray-light">{selectedChild?.message}</span>
            <div
              className="h-full overflow-auto"
              style={{ padding: tabHasSmallPadding ? "0" : "0.5rem" }}
            >
              {selectedChild ? (
                selectedChild.content
              ) : (
                <h1 className="text-gray-light text-xl text-center">
                  No Tab Open
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MainEditorTabControl.displayName = "TabControl";

export default MainEditorTabControl;
