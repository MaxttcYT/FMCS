// utils.js
export const getDefinedVariablesFromEditor = (state) => {
  const definedVariables = [];
  const docContent = state.doc.toString();
  let nestingLevel = 0;

  docContent.split("\n").forEach((line) => {
    // Track nesting with `{` and `}` (naively, line-based)
    nestingLevel += (line.match(/{/g) || []).length;
    nestingLevel -= (line.match(/}/g) || []).length;

    // Only process lines at top-level scope
    if (nestingLevel === 0) {
      const match = line.match(/^\s*(\w+)\s*=\s*/);
      if (match) {
        definedVariables.push({ name: match[1], type: "variable" });
      }
    }
  });

  return definedVariables;
};