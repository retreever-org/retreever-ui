import React, { useState } from "react";
import BodyTabContent from "../components/response/BodyTabContent";
import HeadersTabContent from "../components/response/HeadersTabContent";
import dummyResponse from "../util/dummyResponse.json"; 
import { useViewingTabDoc } from "../stores/viewing-doc-store";
import { CookiesTabContent } from "../components/response/CookiesTabContent";
import { ALLOW_PLACEHOLDER_RESPONSE_RENDERING } from "../config/env-vars";
import { formatTransferSpeed } from "../services/request-builder-helper";

type TabType = "body" | "headers" | "cookies";

interface ResponseViewerProps {}

const ResponseViewer: React.FC<ResponseViewerProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>("body");
  
  // Live data from store + dev fallback
  const tabDoc = useViewingTabDoc();
  const lastResponse = tabDoc?.lastResponse ?? (ALLOW_PLACEHOLDER_RESPONSE_RENDERING ? dummyResponse : null);

  // Derive metrics with fallbacks
  const status = lastResponse?.status ?? undefined;
  const statusText = lastResponse?.statusText ?? "Response Status";
  const durationMs = lastResponse?.durationMs ?? 0;
  const timestamp = lastResponse?.timestamp ?? new Date().getTime();
  const sizeBytes = lastResponse?.sizeBytes ?? 0;
  const transferSpeed = formatTransferSpeed(lastResponse?.sizeBytes, lastResponse?.durationMs);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Status badge class logic
  const getStatusClass = (status: number | undefined) => {
    if(status) {
      if (status >= 200 && status < 300) return "bg-green-500/20 text-green-400 border-green-500/30";
      if (status >= 400) return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      if (status >= 300 && status < 400) return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      return "bg-surface-500/20 text-surface-300 border-surface-500/50";
    }
    return "bg-surface-500/20 text-surface-300 border-surface-500/50";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden text-sm">
      {/* Combined Header Row: Tabs (left) + Status (right) */}
      <div className="flex border-b border-surface-500/20 bg-transparent">
        {/* Tabs - Left side, compact */}
        <div className="flex overflow-hidden">
          {(["body", "headers", "cookies"] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1.5 text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === tab
                  ? "text-primary-300"
                  : "text-surface-400 hover:text-surface-200 hover:bg-surface-700/50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Status + Metrics - Right side */}
        <div className="ml-auto flex items-center justify-between p-2 space-x-3 shrink-0 min-w-[280px]">
          {/* Status */}
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-mono border ${getStatusClass(status)}`}>
              {status} {statusText}
            </span>
            <span className="text-sm text-surface-400">
              <span className="text-surface-400 font-mono">{durationMs}</span> ms
            </span>
            <span className="text-xs text-surface-500">
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Size + Speed */}
          <div className="text-xs text-surface-400 space-x-1">
            <span>{formatBytes(sizeBytes)}</span>
            <span className="font-mono">↓ {transferSpeed}</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {lastResponse ? (
        <div className="flex-1 min-h-0 overflow-auto scroll-thin text-sm">
          {activeTab === "body" && <BodyTabContent />}
          {activeTab === "headers" && <HeadersTabContent />}
          {activeTab === "cookies" && <CookiesTabContent />}
        </div>
      ) : (
        <div className="h-full w-full space-y-1.5 flex flex-col justify-center items-center">
          <div className="text-surface-400">Nothing to show</div>
          <div className="text-surface-400/80">You haven't made any request yet!</div>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;
