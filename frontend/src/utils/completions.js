import { getDefinedVariablesFromEditor } from "./helpers";
import { addIconsToCompletion } from "./icons";
import { core,demo,mathLib } from "./lua-completion-list";

function handleNestedCompletions(context, options, word) {
  const before = context.state.sliceDoc(0, word.from); // Get the text before the cursor
  const pathMatch = before.match(/([\w]+)\.$/); // Match a path followed by a dot (e.g., math.)

  if (!pathMatch) {
    return options; // No dot after the object, return regular completions
  }

  const path = pathMatch[1]; // The object name (e.g., 'math')
  let currentLevel = options;

  // Find the matching object (e.g., 'math')
  const entry = currentLevel.find(item => item.label === path);
  if (!entry || !entry.properties) {
    return []; // If no matching object or no properties, return empty completions
  }

  // Return the nested properties as completions, showing just the property (e.g., .abs)
  return entry.properties.map(item => ({
    label: `${item.label}`, // Only show the property with a dot (e.g., .abs)
    type: item.type,
    info: item.info,
  }));
}

export function luaCompletions(context) {
  const word = context.matchBefore(/\w*/); // Match the word being typed
  if (!word || (word.from === word.to && !context.explicit)) return null; // Don't trigger completion if no word is being typed

  // Get local variables from the editor
  const definedVars = getDefinedVariablesFromEditor(context.state);
  const locals = definedVars.map(variable => ({
    label: variable.name,
    type: variable.type,
    info: `Local variable: ${variable.name}`,
    section: "User variables",
  }));

  // Combine local variables and global completions (like math, string)
  const globalsAndFunctions = [
    ...core,   // Include demo completions for math, string
    ...locals, // Include local variables
  ];

  // Handle nested and flat completions
  const options = handleNestedCompletions(context, globalsAndFunctions, word);

  // Add icons to the completions if necessary
  const itemsWithIcons = addIconsToCompletion(options);
  itemsWithIcons.sort((a, b) => a.label.localeCompare(b.label)); // Sort completions

  return {
    from: word.from, // Return the start position of the word
    options: itemsWithIcons, // Return the sorted completions
  };
}

export function emptyCompletions(context) {
  let word = context.matchBefore(/\w*/);
  if (word.from === word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [],
  };
}
