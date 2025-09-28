import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import CodeMirror from "../components/CodeMirror";

export default forwardRef(function LuaEditor(
  { read_only = false, defaultValue, handleChange },
  ref
) {
  const editorRef = useRef();

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current?.getContent();
    },
  }));

  return (
      <CodeMirror
        ref={editorRef}
        key={"lua-editor"}
        defaultValue={defaultValue}
        mode={properties}
        modeType="legacy"
        onChange={handleChange}
        read_only={read_only}
      />
  );
});
