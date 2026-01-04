import React from "react";
import dummyResponse from "../../util/dummyResponse.json";
import type { CookieEntry } from "../../types/editor.types";
import { useViewingTabDoc } from "../../stores/viewing-doc-store";

export const CookiesTabContent: React.FC = () => {
  const tabDoc = useViewingTabDoc();
  const rawCookies = tabDoc?.lastResponse?.cookies ?? dummyResponse.cookies;
  const cookies: CookieEntry[] = Array.isArray(rawCookies)
    ? rawCookies.map((c) => ({
        ...c,
        sameSite: (["Lax", "Strict", "None"] as const).includes(c.sameSite as any)
          ? (c.sameSite as CookieEntry["sameSite"])
          : undefined,
      }))
    : [];

  if (cookies.length === 0) {
    return (
      <div className="text-surface-400 p-4 text-center text-sm">
        No cookies set
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs [&_td]:p-2 [&_th]:p-2 [&_th]:font-medium [&_th]:text-surface-400 [&_tr]:border-b [&_tr]:border-b-surface-500/50 [&_tr:last-child]:border-b-0 [&_tr]:hover:bg-surface-900/10 [&_tr]:transition-colors">
        <thead>
          <tr>
            <th className="w-20 text-left">Name</th>
            <th className="w-40 text-left">Value</th>
            <th className="w-[100px] text-left">Domain</th>
            <th className="w-16 text-left">Path</th>
            <th className="w-[90px] text-left">Expires</th>
            <th className="w-20 text-left">Flags</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie, i) => (
            <tr key={i}>
              <td className="font-mono font-medium">{cookie.name}</td>
              <td className="font-mono truncate">{cookie.value}</td>
              <td className="text-surface-500">{cookie.domain ?? "-"}</td>
              <td className="text-surface-500">{cookie.path}</td>
              <td className="text-surface-500">
                {cookie.expires ?? cookie.maxAge 
                  ? `${cookie.maxAge}s` 
                  : "Session"}
              </td>
              <td>
                <div className="flex items-center gap-1 flex-wrap">
                  {cookie.sameSite && (
                    <span className="px-1.5 py-0.5 bg-surface-500/20 text-xs rounded font-mono">
                      {cookie.sameSite}
                    </span>
                  )}
                  {cookie.secure && <span className="px-1.5 py-0.5 bg-primary-400/10 text-primary-400 text-xs rounded font-mono">Secure</span>}
                  {cookie.httpOnly && <span className="px-1.5 py-0.5 bg-orange-800/10 text-orange-400 text-xs rounded font-mono">HttpOnly</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
