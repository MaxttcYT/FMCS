import React, {useImperativeHandle, forwardRef, useRef} from "react";

import CodeMirror from "../components/CodeMirror";

export default forwardRef(function TextEditor({ defaultValue, handleChange }, ref) {
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
      onChange={handleChange}
    />
  );
});
