import { parse } from "luaparse";

export function luaLinter(view) {
  let diagnostics = [];
  try {
    parse(view.state.doc.toString(), { luaVersion: "5.2" });
  } catch (e) {
    const line = e.line;
    const col = e.column;
    let lineInfo = view.state.doc.line(line);
    diagnostics.push({
      from: lineInfo.from + col,
      to: lineInfo.from + col + 1,
      severity: "error",
      message: e.message,
      actions: [
        {
          name: "Fix",
          apply(view, from, to) {
            view.dispatch({ changes: { from, to, insert: "" } });
          },
        },
      ],
    });
  }
  return diagnostics;
}
