import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";


const MonacoEditor = ({ value, language, theme, options, onChange }) => {
  const editorRef = useRef(null); // Reference to the div where Monaco will be rendered

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current, {
      value: value || "", // Default value, or use the passed-in value
      language: language || "javascript", // Default language
      theme: theme || "vs-dark", // Default theme
      ...options, // Additional Monaco options (e.g., fontSize, automaticLayout, etc.)
    });

    // Handle editor change (optional)
    editor.onDidChangeModelContent((event) => {
      const newValue = editor.getValue();
      if (onChange) {
        onChange(newValue); // Pass the new value to parent
      }
    });

    // Initialize FactorioAutocomplete
    const factorioAutocomplete = new FactorioAutocomplete(
      "./data"
    );

    // Register Monaco completion provider for Lua
    monaco.languages.registerCompletionItemProvider("lua", {
      provideCompletionItems: (model, position) => {
        return factorioAutocomplete.provideCompletionItems(model, position);
      },
    });

    // Cleanup editor on unmount
    return () => {
      editor.dispose();
    };
  }, [value, language, theme, options, onChange]);

  return <div ref={editorRef} style={{ height: "100%", width: "100%" }} />;
};

export default MonacoEditor;
