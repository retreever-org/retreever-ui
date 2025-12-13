import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { createTheme } from "@uiw/codemirror-themes";
import { tags } from "@lezer/highlight";

import { useViewingDocStore } from "../../stores/viewing-doc-store";
import type { RawBodyType } from "../../types/editor.types";

/* ---------------- language resolver ---------------- */

const getExtensions = (rawType: RawBodyType | undefined) => {
  switch (rawType) {
    case "JSON":
      return [json()];
    case "XML":
      return [xml()];
    case "HTML":
      return [html()];
    case "JavaScript":
      return [javascript()];
    default:
      return [];
  }
};

/* ---------------- custom theme ---------------- */

const retreeverDark = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    foreground: "#e5e7eb",
    caret: "#93c5fd",
    selection: "rgba(148, 163, 184, 0.25)",
    selectionMatch: "rgba(148, 163, 184, 0.2)",
    lineHighlight: "rgba(148, 163, 184, 0.08)",
    gutterBackground: "transparent",
    gutterForeground: "#6b7280",
  },
  styles: [
    { tag: tags.comment, color: "#9ca3af", fontStyle: "italic" },
    { tag: tags.string, color: "#CE9178" },
    { tag: tags.number, color: "#fbbf24" },
    { tag: tags.bool, color: "#f87171" },
    { tag: tags.null, color: "#f87171" },
    { tag: tags.keyword, color: "#60a5fa" },
    { tag: tags.operator, color: "#c084fc" },
    { tag: tags.propertyName, color: "#9CDCFE" },
  ],
});

const monoFont = EditorView.theme({
  "&": {
    fontFamily: "JetBrains Mono, Fira Code, Menlo, Monaco, Consolas, monospace",
    fontSize: "13px",
  },
  ".cm-content": {
    fontFamily: "inherit",
  },
});

/* ---------------- component ---------------- */

const CodeEditor: React.FC = () => {
  const { endpoint, tabDoc, updateUiRequest } = useViewingDocStore();
  if (!tabDoc) return null;

  const { rawType, body } = tabDoc.uiRequest;
  const { model, example_model } = endpoint?.request || {};

  const toPrettyString = (value: unknown): string => {
    if (value == null) return "";

    if (typeof value === "string") {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value.trim();
      }
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "";
    }
  };

  const editorValue = useMemo(() => {
    if (typeof body.raw === "string") return body.raw;
    if (body.raw == null) return "";

    try {
      return JSON.stringify(body.raw, null, 2);
    } catch {
      return "";
    }
  }, [body.raw]);

  const schemaValue = useMemo(() => toPrettyString(model), [model]);

  const editorCanonical = useMemo(
    () => toPrettyString(editorValue),
    [editorValue]
  );

  const extensions = useMemo(
    () => [...getExtensions(rawType), EditorView.lineWrapping, monoFont],
    [rawType]
  );

  const isDirty = useMemo(() => {
    if (!schemaValue) return false;
    return editorCanonical !== schemaValue;
  }, [editorCanonical, schemaValue]);

  const handleAutofill = () => {
    if (!example_model) return;

    let nextValue = "";

    try {
      nextValue =
        typeof example_model === "string"
          ? example_model
          : JSON.stringify(example_model, null, 2);
    } catch {
      nextValue = "";
    }

    updateUiRequest({
      body: {
        ...body,
        raw: nextValue,
      },
    });
  };

  const handleReset = () => {
    if (!model) return;

    updateUiRequest({
      body: {
        ...body,
        raw: schemaValue,
      },
    });
  };

  return (
    <div className="w-full">
      <div
        spellCheck={false}
        autoCorrect="off"
        className="
        relative
        w-full
        min-h-[350px]
        bg-transparent
        border border-surface-500/50
        rounded-md
        overflow-hidden
      "
      >
        <div className="absolute top-2 right-4 z-10 flex gap-2">
          {/* Reset */}
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              className="
                px-3 py-1
                text-xs
                text-surface-300
                border border-surface-500/30
                rounded-md
                bg-black/5
                backdrop-blur-md
                hover:bg-surface-800
                hover:text-surface-200
            "
            >
              Reset
            </button>
          )}

          {/* Autofill */}
          {example_model && (
            <button
              type="button"
              onClick={handleAutofill}
              className="
                px-3 py-1
                text-xs
                text-surface-300
                border border-surface-500/30
                rounded-md
                bg-black/5
                backdrop-blur-md
                hover:bg-surface-800
                hover:text-surface-200
            "
            >
              Autofill
            </button>
          )}
        </div>

        {/* Editor */}
        <CodeMirror
          value={editorValue}
          theme={retreeverDark}
          spellCheck={false}
          autoCorrect="off"
          extensions={extensions}
          height="350px"
          className="scroll-thin"
          onChange={(value) => {
            updateUiRequest({
              body: {
                ...body,
                raw: value,
              },
            });
          }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            highlightSelectionMatches: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
