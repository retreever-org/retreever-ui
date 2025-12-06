import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const codeBlockStyle = {
  borderRadius: "8px",
  fontSize: "0.85rem",
  padding: "16px",
  background: "transparent",
};

interface CodeBlockProps {
  code?: string;
  example?: string;
  swappable?: boolean;
  swapCodeBlock: (value: boolean) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  example,
  swappable,
  swapCodeBlock,
}) => {
  const json = code ? JSON.stringify(code, null, 2) : "No Schema Documented";
  const json_ex = example
    ? JSON.stringify(example, null, 2)
    : "No Schema Example Documented";

  const [view, setView] = useState<"json" | "json_ex">("json");

  useEffect(() => {
    setView("json");
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
  };

  const canCopy: boolean =
    view === "json"
      ? code !== undefined && code !== null
      : example !== undefined && example !== null;

  return (
    <div className="group bg-black/10 border border-surface-500/50 px-2 pt-2 rounded-xl relative">
      {/* Header Row */}
      <div className="w-full flex justify-end items-center space-x-2">
        {/* View Switch */}
        <div className="mr-auto flex items-center gap-2">
          <button
            onClick={() =>
              view === "json" ? setView("json_ex") : setView("json")
            }
            className="
            transition-opacity 
            text-[0.65rem] text-surface-200 px-1.5 py-0.5 rounded-sm border border-surface-500/50 
            hover:bg-surface-600/40
          "
          >
            {view === "json" ? "VIEW EXAMPLE" : "VIEW SCHEMA"}
          </button>

          {swappable && (
            <button
              onClick={() => swapCodeBlock(true)}
              className="
            transition-opacity 
            text-[0.65rem] text-surface-200 px-1.5 py-0.5 rounded-sm border border-surface-500/50 
            hover:bg-surface-600/40
          "
            >
              METADATA
            </button>
          )}
        </div>

        {/* COPY BUTTON (only visible on hover) */}
        {canCopy && (
          <button
            onClick={handleCopy}
            className="
            opacity-0 group-hover:opacity-100 transition-opacity 
            text-[0.65rem] text-surface-200 px-1.5 py-0.5 rounded-sm border border-surface-500/50 
            hover:bg-surface-600/40
          "
          >
            Copy
          </button>
        )}
        {/* JSON Badge */}
        <span className="text-[0.65rem] text-surface-300 px-1 py-0.5 border border-surface-500/50 rounded-sm">
          JSON
        </span>
      </div>

      {/* Syntax Block */}
      <SyntaxHighlighter
        language="json"
        style={vscDarkPlus}
        customStyle={codeBlockStyle}
        className="scroll-thin scroll-bar-round"
      >
        {view === "json" ? json : json_ex}
      </SyntaxHighlighter>
    </div>
  );
};
