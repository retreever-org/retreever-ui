import React from 'react';
import dummyResponse from "../../util/dummyResponse.json";
import type { TabDoc } from "../../types/editor.types";
import { useViewingTabDoc } from '../../stores/viewing-doc-store';

const HeadersTabContent: React.FC = () => {
  const tabDoc = useViewingTabDoc() as TabDoc | null;
  const headers: Record<string, string> = tabDoc?.lastResponse?.headers ?? dummyResponse.headers;

  if (Object.keys(headers).length === 0) {
    return (
      <div className="text-surface-400 p-4 text-center text-sm">
        No headers
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs [&_tr:hover]:bg-surface-900/10 [&_td]:p-2 [&_td]:pr-4 [&_td]:align-top">
        <tbody>
          {Object.entries(headers).map(([key, value], i) => (
            <tr key={i}>
              <td className="w-28 font-mono text-surface-400 text-xs pr-4"> 
                {key}:
              </td>
              <td className="font-mono text-sm break-all flex-1">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeadersTabContent;
