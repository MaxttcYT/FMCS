import React, { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { luaCompletions } from "../utils/completions";
import { luaLinter } from "../utils/linter";
import CodeMirror from "../components/CodeMirror";
import { foldService } from "@codemirror/language";

const luaFold = foldService.of((state, lineStart) => {
  const line = state.doc.lineAt(lineStart);
  const text = line.text.trim();

  const patterns = [
    { regex: /(^|\W)(local\s+)?function\b/, end: /\bend\b/ },
    { regex: /(^|\W)if\b.*\bthen\b/, end: /\bend\b/ },
    { regex: /(^|\W)for\b.*\bdo\b/, end: /\bend\b/ },
    { regex: /(^|\W)while\b.*\bdo\b/, end: /\bend\b/ },
    { regex: /(^|\W)do\b/, end: /\bend\b/ },
    // catch anonymous functions inside parentheses
    { regex: /function\s*\(/, end: /\bend\b/ },
  ];

  for (let { regex, end } of patterns) {
    if (regex.test(text)) {
      let cursor = line.number + 1;
      let depth = 1;
      while (cursor <= state.doc.lines) {
        const nextLine = state.doc.line(cursor).text.trim();

        if (patterns.some((p) => p.regex.test(nextLine))) depth++;
        if (end.test(nextLine)) {
          depth--;
          if (depth === 0) {
            return {
              from: line.to,
              to: state.doc.line(cursor).from,
            };
          }
        }
        cursor++;
      }
    }
  }

  return null;
});

export default forwardRef(function LuaEditor(
  { read_only = false, defaultValue, handleChange=()=>{} },
  ref
) {
  const editorRef = useRef();
  console.log(handleChange)

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current?.getContent();
    },
    setContent: () => {
      return editorRef.current?.setContent();
    },
  }));
  useEffect(() => {
    console.log("REOUNT LUAEDITOR")
  }, [])
  useEffect(() => {
    console.log("DEFAULTVALUECHANGE LUAEDITOR")
  }, [defaultValue])
  

  return (
    <CodeMirror
      ref={editorRef}
      key={"lua-editor"}
      defaultValue={defaultValue}
      mode={lua}
      completion={luaCompletions}
      modeType="legacy"
      cmLinter={luaLinter}
      onChange={handleChange}
      read_only={read_only}
      extensions={[luaFold]}
    />
  );
});
