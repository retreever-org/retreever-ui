import React, { useState, useEffect } from "react";
import ResponsePayloadDisplay from "./ResponsePayloadDisplay";
import { useViewingTabDoc } from "../../stores/viewing-doc-store";
import { ALLOW_PLACEHOLDER_RESPONSE_RENDERING, RESPONSE_CONTENT_TYPE_TESTING } from "../../config/env-vars";
import { getDummyResponse } from "../../services/dummy-response-registry";

type ViewMode = "json" | "xml" | "html" | "text" | "raw";

const BodyTabContent: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("json");
  const [showOptions, setShowOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const tabDoc = useViewingTabDoc();
  
  const response = tabDoc?.lastResponse 
    ? tabDoc.lastResponse 
    : (ALLOW_PLACEHOLDER_RESPONSE_RENDERING ? getDummyResponse(RESPONSE_CONTENT_TYPE_TESTING) : null);

  // Helper to map Content-Type to ViewMode
  const getAutoViewMode = (contentType?: string): ViewMode => {
    if (!contentType) return "raw";
    const type = contentType.toLowerCase();
    if (type.includes("application/json")) return "json";
    if (type.includes("text/html")) return "html";
    if (type.includes("application/xml") || type.includes("text/xml")) return "xml";
    if (type.includes("text/plain")) return "text";
    return "raw";
  };

  /**
   * AUTOMATIC RESOLUTION
   * This triggers ONLY when the response object or the unique requestId changes.
   * Once it sets the state, the user is free to change viewMode manually.
   */
  useEffect(() => {
    if (response) {
      const detectedMode = getAutoViewMode(response.contentType);
      setViewMode(detectedMode);
    }
  }, [response?.requestId]); 

  // Reset preview toggle if mode is no longer HTML
  useEffect(() => {
    if (viewMode !== "html") {
      setShowPreview(false);
    }
  }, [viewMode]);

  if (!response) return null;

  return (
    <div className="h-full flex flex-col text-surface-400 overflow-hidden">
      <div className="flex sticky top-0 z-10 p-2 items-center bg-surface-950/50 backdrop-blur-sm">
        {/* View Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-xs border border-surface-500/30 rounded-lg text-surface-300 hover:text-surface-200 px-3 hover:bg-surface-500/5 py-1 transition-colors flex items-center gap-1"
          >
            {viewMode.toUpperCase()}
            <svg className={`w-3 h-3 transition-transform ${showOptions ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showOptions && (
            <div className="absolute top-full left-0 mt-1 bg-surface-700 backdrop-blur-2xl border border-surface-500/30 rounded-md shadow-xl z-20 min-w-[100px] py-1">
              {(["json", "xml", "html", "text", "raw"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode); // User manual override
                    setShowOptions(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-all ${
                    viewMode === mode ? "text-primary-400 bg-surface-800" : "text-surface-300 hover:bg-surface-800 hover:text-surface-200"
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preview Toggle for HTML */}
        {viewMode === "html" && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`ml-3 text-xs px-2 py-1 transition-all border rounded-lg ${
              showPreview 
                ? "border-primary-400 bg-primary-400/10 text-primary-400" 
                : "border-surface-500/30 text-surface-300 hover:border-surface-400"
            }`}
          >
            Preview
          </button>
        )}
      </div>

      {/* Main Display Area */}
      <div className="flex-1 min-h-0 overflow-hidden pb-2">
        {showPreview && viewMode === "html" ? (
          <div className="w-full h-full p-2">
             <iframe
              title="Response Preview"
              srcDoc={response.body}
              className="w-full h-full border border-surface-500/20 bg-white rounded"
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          <div className="h-full overflow-auto scroll-thin m-2">
            <ResponsePayloadDisplay viewMode={viewMode} content={response.body} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyTabContent;