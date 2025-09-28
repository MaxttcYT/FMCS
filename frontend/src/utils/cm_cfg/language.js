import {LRLanguage} from "@codemirror/language"

export const exampleLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: {line: ";"}
  }
})