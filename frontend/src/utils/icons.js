import ReactDOM from "react-dom/client";
import React, { useEffect, useRef } from "react";

import {
  Wrench,
  Variable,
  Lock,
  Boxes,
  ArrowDown,
  ArrowUp,
  XCircle,
  Quote,
  Hash,
  Brackets,
  Folder,
  Drill,
  Activity,
  Repeat,
  Sliders,
  Puzzle,
  CircleHelp,
  Ban,
  KeyRound,
  ChartCandlestick,
  Split,
  ToggleRight,
  Blocks,
  Settings,
  Container,
  Package,
} from "lucide-react";

export const customIcons = {
  function: Wrench,
  definition: Wrench,
  value: ChartCandlestick,
  flow: Split,
  variable: Variable,
  local_variable_constant: Lock,
  local_variable_close: "📦",
  variable_constant: Lock,
  variable_close: "📦",
  constant: Lock,
  class: Boxes,
  boolean: ToggleRight,
  string: Quote,
  number: Hash,
  array: Brackets,
  object: Folder,
  method: Wrench,
  constructor: Drill,
  import: ArrowDown,
  export: ArrowUp,
  event: Activity,
  error: XCircle,
  loop: Repeat,
  parameter: Sliders,
  table: Puzzle,
  condition: CircleHelp,
  keyword: KeyRound,
  block: Blocks,
  default: Ban,
  snippet: Puzzle,
  core_variable: Container,
  package: Package,
};

export function addIconsToCompletion(completionItems) {
  return (completionItems || [])
    .filter(Boolean) // filters out undefined/null
    .map((item) => {
      const type = item?.type;
      const icon = customIcons[type] || Settings;

      if (!item.info) {
        item.info = ""
      }

      let info = "";
      if (item.displaySnippet) {
        info = `${item.info} \n Code:\n\t${item.label}`;
      } else {
        info = item.info;
      }

      return {
        ...item,
        type,
        displayLabel: `${item.label || "unknown"}`,
        info: `${item.label || "?"} [--${type}--]\n\n ${info}`,
        icons: false,
        fmcsIcon: icon,
      };
    });
}

export const completionIconRenderer = {
  render(completion, state, view) {
    const Icon = completion.fmcsIcon;
    const wrapper = document.createElement("span");
    wrapper.className = "cm-completion-emoji";
    const root = ReactDOM.createRoot(wrapper);
    root.render(<Icon size={16} />);
    return wrapper;
  },
  position: 40,
};
