import React from 'react';
import dummyResponse from "../../util/dummyResponse.json";
import type { TabDoc } from "../../types/editor.types";
import { useViewingTabDoc } from '../../stores/viewing-doc-store';

const HeadersTabContent: React.FC = () => {
  // Live data from store + dummy fallback
  const tabDoc = useViewingTabDoc() as TabDoc | null;
  const headers: Record<string, string> = tabDoc?.lastResponse?.headers ?? dummyResponse.headers;

  return (
    <div className="space-y-2">
      {Object.entries(headers).map(([key, value]) => (
        <div key={key} className="flex items-start space-x-3">
          <span className="w-28 font-mono text-surface-500 text-xs">{key}:</span>
          <span className="flex-1 font-mono text-sm break-all">{value}</span>
        </div>
      ))}
      {Object.keys(headers).length === 0 && (
        <div className="text-surface-400 p-4 text-center text-sm">
          No headers
        </div>
      )}
    </div>
  );
};

export default HeadersTabContent;
