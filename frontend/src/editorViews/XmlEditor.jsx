import React, {useImperativeHandle, forwardRef, useRef} from "react";

import { xml } from "@codemirror/lang-xml";
import CodeMirror from "../components/CodeMirror";

export default forwardRef(function XmlEditor({ defaultValue, handleChange }, ref) {
  const editorRef = useRef();

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current?.getContent();
    },
  }));
  return (
    <CodeMirror
      ref={editorRef}
      key={"xml-editor"}
      defaultValue={defaultValue}
      mode={xml}
      modeType="cm6"
      onChange={handleChange}
    />
  );
});