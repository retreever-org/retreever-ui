// ResponseViewer.tsx (updated)
import React, { useState } from "react";
import BodyTabContent from "../components/response/BodyTabContent";
import HeadersTabContent from "../components/response/HeadersTabContent";
import { CookiesTabContent } from "../components/response/CookiesTabContent";

type TabType = "body" | "headers" | "cookies";

interface ResponseViewerProps {}

const ResponseViewer: React.FC<ResponseViewerProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>("body");

  // Static data (replace with Zustand later)
  const staticData = {
    status: 200 as number,
    statusText: 'OK' as string,
    // status: 404 as number,
    // statusText: "Not Found" as string,
    // status: 302 as number,
    // statusText: "Found" as string,
    // status: 100 as number,
    // statusText: "Optional" as string,
    durationMs: 127 as number,
    timestamp: Date.now() as number,
    sizeBytes: 2143 as number,
    headers: {
      "content-type": "application/json",
      "content-length": "2143",
      "set-cookie": "session=abc123; Path=/; HttpOnly",
      "x-request-id": "req-xyz789",
    } as Record<string, string>,
    cookies: [
      {
        name: "session",
        value: "abc123",
        expires: "2026-01-05",
        path: "/",
        httpOnly: true,
      },
      { name: "theme", value: "dark", expires: "2026-01-04", path: "/" },
    ],
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatSpeed = (bytes: number, ms: number) => {
    const mb = bytes / (1024 * 1024);
    const seconds = ms / 1000;
    return `${(mb / seconds).toFixed(1)} MB/s`;
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
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono border ${
                staticData.status >= 200 && staticData.status < 300
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : staticData.status >= 400 
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  : staticData.status >= 300 && staticData.status < 400
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                  : "bg-surface-500/20 text-surface-300 border-surface-500/50"
              }`}
            >
              {staticData.status} {staticData.statusText}
            </span>
            <span className="text-sm text-surface-400">
              <span className="text-surface-400 font-mono">
                {staticData.durationMs}
              </span>{" "}
              ms
            </span>
            <span className="text-xs text-surface-500">
              {new Date(staticData.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Size + Speed */}
          <div className="text-xs text-surface-400 space-x-1">
            <span>{formatBytes(staticData.sizeBytes)}</span>
            <span className="font-mono">
              ↓ {formatSpeed(staticData.sizeBytes, staticData.durationMs)}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 pt-3 min-h-0 overflow-auto scroll-thin text-sm p-3">
        {activeTab === "body" && <BodyTabContent />}
        {activeTab === "headers" && (
          <HeadersTabContent data={staticData.headers} />
        )}
        {activeTab === "cookies" && (
          <CookiesTabContent data={staticData.cookies} />
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;
