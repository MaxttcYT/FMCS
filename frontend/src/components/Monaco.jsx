import React, { useEffect, useRef } from "react";

import "@codingame/monaco-vscode-python-default-extension";
import "@codingame/monaco-vscode-theme-defaults-default-extension";

// default monaco-editor imports
import * as monaco from "monaco-editor";

// utilities to override Monaco services
import { initialize } from "@codingame/monaco-vscode-api";
import getConfigurationServiceOverride, {
  updateUserConfiguration,
} from "@codingame/monaco-vscode-configuration-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextMateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";

const workerLoaders = {
  TextEditorWorker: () =>
    new Worker(
      new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
      { type: "module" },
    ),
  TextMateWorker: () =>
    new Worker(
      new URL(
        "@codingame/monaco-vscode-textmate-service-override/worker",
        import.meta.url,
      ),
      { type: "module" },
    ),
};

window.MonacoEnvironment = {
  getWorker: function (_workerId, label) {
    console.log("WORKER", _workerId, label);
    const workerFactory = workerLoaders[label];
    if (workerFactory != null) {
      return workerFactory();
    }
    throw new Error(`Worker ${label} not found`);
  },
};

const MonacoEditor = ({
  value,
  language = "python",
  theme,
  options,
  onChange,
}) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    const setupEditor = async () => {
      console.log("SETUP EDITOR");
      await initialize({
        ...getTextMateServiceOverride(),
        ...getThemeServiceOverride(),
        ...getLanguagesServiceOverride(),
        ...getConfigurationServiceOverride(),
      });
      updateUserConfiguration(`{
    "editor.fontSize": 20,
    "editor.lineHeight": 20,
    "editor.fontFamily": "monospace",
    "editor.fontWeight": "bold",
    "editor.letterSpacing": 0,
}`);

      editorInstance.current = monaco.editor.create(editorRef.current, {
        value: "",
        language: "python",
        automaticLayout: true,
        wordBasedSuggestions: "currentDocument",
        ...options,
      });

      editorInstance.current.onDidChangeModelContent(() => {
        const newValue = editorInstance.current.getValue();
        if (onChange) onChange(newValue);
      });
    };

    setupEditor();

    return () => {
      if (editorInstance.current) {
        editorInstance.current.dispose();
      }
    };
  }, [value, language, theme, options, onChange]);

  return <div ref={editorRef} style={{ height: "100%", width: "100%" }} />;
};

export default MonacoEditor;
