import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { html } from "@codemirror/lang-html";
import type { ResponseViewMode } from "../../types/editor.types";
import { monoFont, retreeverDark } from "../canvas/CodeEditor";

const getExtensions = (viewMode: ResponseViewMode) => {
  switch (viewMode) {
    case "json":
      return [json()];
    case "xml":
      return [xml()];
    case "html":
      return [html()];
    default:
      return [];
  }
};

/* Safe formatter - only if content matches */
const formatPayload = (body: string, viewMode: ResponseViewMode): string => {
  if (!body || body.trim() === "{}") return body;

  const trimmed = body.trim();

  try {
    switch (viewMode) {
      case "json":
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          return JSON.stringify(JSON.parse(body), null, 2);
        }
        return body;

      case "xml":
        if (
          trimmed.startsWith("<") &&
          (trimmed.includes("</") || trimmed.includes("/>"))
        ) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(body, "text/xml");
          if (doc.getElementsByTagName("parsererror").length === 0) {
            return new XMLSerializer().serializeToString(doc);
          }
        }
        return body;

      case "html":
        if (trimmed.startsWith("<") && trimmed.includes("</")) {
          const doc = new DOMParser().parseFromString(body, "text/html");
          if (!doc.getElementsByTagName("parsererror").length) {
            return new XMLSerializer().serializeToString(doc);
          }
        }
        return body;

      case "text":
      case "raw":
      default:
        return body;
    }
  } catch {
    return body;
  }
};

interface ResponsePayloadDisplayProps {
  viewMode: ResponseViewMode;
  content: string | undefined;
}

const ResponsePayloadDisplay: React.FC<ResponsePayloadDisplayProps> = ({
  viewMode, content
}) => {
  const rawBody = content ?? "";
  const body = useMemo(
    () => formatPayload(rawBody, viewMode),
    [rawBody, viewMode]
  );

  const extensions = useMemo(
    () => [...getExtensions(viewMode), EditorView.lineWrapping, monoFont],
    [viewMode]
  );

  if(!body || body.trim() === "") {
    return (
      <div className="h-full w-full space-y-1.5 flex flex-col justify-center items-center">
          <div className="text-surface-400">No content to display</div>
          <div className="text-surface-400/80">Response didn't include any payload!</div>
      </div>
    );
  }

  return (
    <CodeMirror
      value={body}
      theme={retreeverDark}
      readOnly
      spellCheck={false}
      extensions={extensions}
      className="h-full w-full"
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
  );
};

export default ResponsePayloadDisplay;
