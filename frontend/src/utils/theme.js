import { EditorView } from "@codemirror/view";

export const betterAutocomplete = EditorView.theme(
  {
    ".cm-tooltip": {
      backgroundColor: "#1C1C1C !important",
      border: "1px solid #ccc",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    ".cm-tooltip-autocomplete > ul": {
      maxHeight: "20em !important",
      overflowY: "auto", // Make sure scrolling is enabled
    },
    ".cm-tooltip-autocomplete > *:not(.cm-completionInfo)": {
      margin: "10px !important",
    },
    ".cm-tooltip-autocomplete > .cm-completionInfo": {
      marginLeft: "5px !important",
    },

    // FLEX row and align items center
    ".cm-tooltip-autocomplete > ul > li": {
      display: "flex",
      alignItems: "center", // vertical center
      gap: "0.5rem",
    },

    // Emoji icon style (make sure all icons have the same height)
    ".cm-completion-emoji": {
      width: "1.5rem",
      minWidth: "1.5rem",
      height: "1.5rem", // Set a consistent height
      fontSize: "1rem", // Uniform size
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "0.5rem",
    },

    // Label aligned nicely
    ".cm-completionLabel": {
      marginLeft: "1rem !important",
    },

    // Custom scrollbar styles
    ".cm-tooltip-autocomplete > ul::-webkit-scrollbar": {
      width: "8px", // Adjust width of the scrollbar
    },
    ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb": {
      backgroundColor: "#2b5669", // Set thumb color
      borderRadius: "10px", // Rounded corners for the thumb
    },
    ".cm-tooltip-autocomplete > ul::-webkit-scrollbar-track": {
      backgroundColor: "#292929", // Set track color
      borderRadius: "10px", // Rounded corners for the track
    },
  },
  { dark: true }
);
