import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { EditorState, Transaction } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import { linter, forEachDiagnostic } from "@codemirror/lint";
import { foldService, foldGutter, StreamLanguage } from "@codemirror/language";

import { emptyCompletions } from "../utils/completions";
import { betterAutocomplete } from "../utils/theme";
import { androidStudio } from "@fsegurai/codemirror-theme-android-studio";
import { completionIconRenderer } from "../utils/icons";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

export default forwardRef(function CodeMirror(
  {
    defaultValue,
    completion = emptyCompletions,
    mode,
    modeType = "legacy",
    cmLinter,
    onChange = () => {},
    read_only,
    extensions: passedExtensions = [],
  },
  ref
) {
  const editor = useRef();
  const viewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (viewRef.current) {
        return viewRef.current.state.doc.toString();
      }
      return null;
    },
    getView: () => viewRef.current,
    getDiagnostics: () => {
      if (!viewRef.current) return [];
      const diagnostics = [];
      forEachDiagnostic(viewRef.current.state, (diagnostic) => {
        diagnostics.push(diagnostic);
      });
      return diagnostics;
    },
  }));

  // build the autocompletion extension
  const autocompleteExtension =
    completion &&
    autocompletion({
      override: [completion],
      activateOnTyping: true,
      icons: false,
      addToOptions: [completionIconRenderer],
    });

  // optional language
  const language = mode
    ? modeType === "legacy"
      ? StreamLanguage.define(mode)
      : mode()
    : null;

  // only fire onChange if the transaction carries a userEvent annotation
  const updateListener = EditorView.updateListener.of((update) => {
    if (
      update.docChanged &&
      update.transactions.some((tr) => tr.annotation(Transaction.userEvent))
    ) {
      onChange(update.state.doc.toString());
    }
  });

  useEffect(() => {
    const extensions = [
      basicSetup,
      language,
      lineNumbers(),
      androidStudio,
      betterAutocomplete,
      autocompleteExtension,
      updateListener,
      EditorView.theme({
        "&": { height: "100%", width: "100%" },
        ".cm-scroller": { overflow: "auto" },
        ".cm-foldGutter": { width: "16px" }, // styling gutter
        ".cm-gutterElement": { cursor: "pointer" },
      }),
      cmLinter ? linter(cmLinter) : null,
      EditorState.readOnly.of(read_only),
      indentationMarkers(),
      ...passedExtensions,
    ].filter(Boolean);

    const state = EditorState.create({
      doc: defaultValue,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editor.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, [defaultValue, mode, modeType, cmLinter, onChange]);

  return (
    <div
      ref={editor}
      className="h-full"
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
});
