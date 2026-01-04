import React, { useState, useEffect } from "react";
import ResponsePayloadDisplay from "./ResponsePayloadDisplay";

type ViewMode = "json" | "xml" | "html" | "text" | "raw";

const BodyTabContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("json");
  const [showOptions, setShowOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (viewMode !== "html") {
      setShowPreview(false);
    }
  }, [viewMode]);

  return (
    <div className="h-full flex flex-col text-surface-400 overflow-hidden">
      {/* Fixed Controls */}
      <div className="flex sticky top-0 z-10 p-2 items-center">
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-xs border border-surface-500/30 rounded-lg text-surface-300 hover:text-surface-200 px-3 hover:bg-surface-500/5 py-1 transition-colors flex items-center gap-1"
          >
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            <svg
              className={`w-3 h-3 transition-transform ${
                showOptions ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showOptions && (
            <div className="absolute top-full left-0 mt-1 bg-surface-900/50 backdrop-blur-2xl border border-surface-500/30 rounded-md shadow-xl z-20 min-w-[100px] py-1">
              {(["json", "xml", "html", "text", "raw"] as ViewMode[]).map(
                (mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setViewMode(mode);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-surface-300 hover:bg-surface-800/50 hover:text-surface-200 transition-all first:rounded-t-md last:rounded-b-md"
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {viewMode === "html" && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`
            ml-3 text-xs px-2 py-1 transition-all flex items-center
            border rounded-lg
            ${
              showPreview
                ? "border-primary-400 bg-primary-400/10 text-primary-400 shadow-sm"
                : "border-surface-500/30 text-surface-300 hover:text-surface-200 hover:border-surface-400/50"
            }
          `}
          >
            Preview
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-hidden pb-2">
        {showPreview && viewMode === "html" ? (
          <div className="w-full h-full overflow-auto bg-surface-950">
            {/* HTML Preview */}
            <div
              className="w-full h-full p-4"
              dangerouslySetInnerHTML={{ __html: "" }} // tabDoc.lastResponse.body
            />
          </div>
        ) : (
          <div className="h-full overflow-auto scroll-thin m-2">
            <ResponsePayloadDisplay viewMode={viewMode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyTabContent;
