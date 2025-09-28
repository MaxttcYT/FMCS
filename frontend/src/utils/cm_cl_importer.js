import { snippetCompletion } from "@codemirror/autocomplete";

/**
 * Parses a list of completion items.
 * Filters and transforms items based on their `conversion_type`.
 * 
 * - If `conversion_type` is "same", keeps the item (minus the `conversion_type`).
 * - If `conversion_type` is "snippet", transforms it into `snippetCompletion(...)`.
 * 
 * @param {Array<Object>} data - The original list of completion items
 * @returns {Array<Object|string>} A transformed list of completion items
 */
export function parseCompletionList(data) {
  const result = data.map(item => {
    switch (item.conversion_type) {
      case "same": {
        const { conversion_type, ...rest } = item;
        return rest;
      }
      case "snippet": {
        const {
          conversion_type,
          code,
          ...options
        } = item;
        return snippetCompletion(code, options);
      }
      default:
        return null; // or filter out unknown types
    }
  }).filter(Boolean); // Remove null values
  console.log(result)
  return result;
}
