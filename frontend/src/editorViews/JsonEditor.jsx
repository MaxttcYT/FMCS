import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useState,
} from "react";

import { json, jsonLanguage, jsonParseLinter } from "@codemirror/lang-json";
import CodeMirror from "../components/CodeMirror";
import { linter, lintGutter } from "@codemirror/lint";

export default forwardRef(function JsonEditor(
  { defaultValue, handleChange },
  ref
) {
  const editorRef = useRef();
  const [lintingErrors, setLintingErrors] = useState([]);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current?.getContent();
    },
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const errors = editorRef.current.getDiagnostics();
      console.log(errors);
      setLintingErrors(errors);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/*<div className="grid grid-cols-1 grid-rows-[1fr,10rem] gap-0 h-full w-full">
      <div className="overflow-y-auto">*/}
      <CodeMirror
        ref={editorRef}
        key={"json-editor"}
        defaultValue={defaultValue}
        mode={json}
        modeType="cm6"
        onChange={handleChange}
        extensions={[linter(jsonParseLinter())]}
      />
      {/*</div>
      <div className="h-30 bg-gray-dark w-full">
        <h1>Problems:</h1>
        {lintingErrors.map((diagnostic, index, array) => {
          return <>{diagnostic.message}</>;
        })}
      </div>
    </div>*/}
    </>
  );
});
