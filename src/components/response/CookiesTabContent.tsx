import React from 'react';

interface Cookie {
  name: string;
  value: string;
  expires: string;
  path: string;
  httpOnly?: boolean;
}

interface CookiesTabContentProps {
  data: Cookie[];
}

export const CookiesTabContent: React.FC<CookiesTabContentProps> = ({ data }) => (
  <div className="space-y-3">
    {data.map((cookie, i) => (
      <div key={i} className="p-3 bg-surface-900/50 rounded-lg space-y-1">
        <div className="flex justify-between items-center">
          <span className="font-medium">{cookie.name}</span>
          <span className="font-mono bg-surface-800 px-2 py-0.5 rounded text-xs">{cookie.value}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs text-surface-500">
          <div>Expires: {cookie.expires}</div>
          <div>Path: {cookie.path}</div>
          {cookie.httpOnly && <div className="text-orange-400">HttpOnly</div>}
        </div>
      </div>
    ))}
  </div>
);
