import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import Panel from "../components/Panel";
import remarkGfm from "remark-gfm";
import CodeMirror from "../components/CodeMirror";
import React, { useState, useImperativeHandle, forwardRef, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default forwardRef(function MdEditor({ defaultValue, handleChange }, ref) {
  const [markdownEditor, setMarkdown] = useState("# New MD File");
  const editorRef = useRef();

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current?.getContent();
    },
  }));
  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-0 h-full w-full">
      <CodeMirror
        ref={editorRef}
        key={"md-editor"}
        defaultValue={defaultValue}
        mode={markdown}
        modeType="cm6"
        onChange={(code) => {
          setMarkdown(code);
          handleChange(code);
        }}
      />
      <Panel
        title={"Markdown Preview"}
        className={"w-full overflow-auto"}
        content={
          <div className="markdown-preview p-4 prose text-sm prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg overflow-hidden">
            <div className="markdown-preview-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownEditor}
              </ReactMarkdown>
            </div>
          </div>
        }
      />
    </div>
  );
});
