import React, { useState } from 'react';

interface StatusTabsProps {}

type TabType = 'body' | 'headers' | 'cookies';

const StatusTabs: React.FC<StatusTabsProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>('body');
  
  // Static data
  const staticData = {
    status: 200 as number,
    statusText: 'OK' as string,
    durationMs: 127 as number,
    timestamp: Date.now() as number,
    sizeBytes: 2143 as number,
    headers: {
      'content-type': 'application/json',
      'content-length': '2143',
      'set-cookie': 'session=abc123; Path=/; HttpOnly',
      'x-request-id': 'req-xyz789'
    } as Record<string, string>,
    cookies: [
      { name: 'session', value: 'abc123', expires: '2026-01-05', path: '/', httpOnly: true },
      { name: 'theme', value: 'dark', expires: '2026-01-04', path: '/' }
    ]
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

  const parseCookies = (header: string) => {
    // Static parsed for demo
    return staticData.cookies;
  };

  return (
    <div className="space-y-3">
      {/* Status Row */}
      <div className="flex items-center justify-between">
        {/* Status + Metrics */}
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-mono border ${
            staticData.status >= 200 && staticData.status < 300
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : staticData.status >= 400
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {staticData.status} {staticData.statusText}
          </span>
          <span className="text-sm text-surface-400">
            <span className="text-green-400 font-mono">{staticData.durationMs}</span> ms
          </span>
          <span className="text-xs text-surface-500">
            {new Date(staticData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Size + Speed */}
        <div className="text-xs text-surface-400 space-x-2">
          <span>{formatBytes(staticData.sizeBytes)}</span>
          <span className="font-mono">↓ {formatSpeed(staticData.sizeBytes, staticData.durationMs)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border border-surface-500/30 rounded-lg overflow-hidden bg-surface-800/50">
        {(['body', 'headers', 'cookies'] as TabType[]).map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-xs font-medium flex-1 transition-all text-center ${
              activeTab === tab
                ? 'bg-primary-500/20 text-primary-300 border-b-2 border-primary-400'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'body' && <span className="ml-1 text-surface-500">(application/json)</span>}
          </button>
        ))}
      </div>

      {/* Tab Content - Static placeholders */}
      <div className="pt-3 text-sm">
        {activeTab === 'body' && (
          <div className="text-surface-400">Body content will render here (2.1 kB)</div>
        )}
        {activeTab === 'headers' && (
          <div className="space-y-1">
            <div className="flex"><span className="w-24 font-mono text-surface-500">content-type:</span><span>application/json</span></div>
            <div className="flex"><span className="w-24 font-mono text-surface-500">content-length:</span><span>2143</span></div>
          </div>
        )}
        {activeTab === 'cookies' && (
          <div className="space-y-1">
            <div className="flex justify-between"><span>session</span><span className="font-mono">abc123</span></div>
            <div className="flex justify-between text-xs text-surface-500"><span>Expires:</span><span>2026-01-05</span></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTabs;
