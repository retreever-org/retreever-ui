import React from 'react';

interface HeadersTabContentProps {
  data: Record<string, string>;
}

const HeadersTabContent: React.FC<HeadersTabContentProps> = ({ data }) => (
  <div className="space-y-2">
    {Object.entries(data).map(([key, value]) => (
      <div key={key} className="flex items-start space-x-3">
        <span className="w-28 font-mono text-surface-500 text-xs">{key}:</span>
        <span className="flex-1 font-mono text-sm break-all">{value}</span>
      </div>
    ))}
  </div>
);

export default HeadersTabContent;