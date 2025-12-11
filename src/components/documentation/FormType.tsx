import React, { useEffect, useState } from "react";

interface FormTypeProps {
  code?: string | Record<string, unknown>;      // accept string or already-parsed object
  example?: string | Record<string, unknown>;   // accept string or already-parsed object
  swappable?: boolean;
  swapCodeBlock: (value: boolean) => void;
}

const FormType: React.FC<FormTypeProps> = ({
  code,
  example,
  swappable,
  swapCodeBlock,
}) => {
  const [view, setView] = useState<"json" | "json_ex">("json");

  useEffect(() => {
    setView("json");
  }, [code]);

  const raw = view === "json" ? code : example;

  type Row = { key: string; value: string };
  let rows: Row[] = [];

  const stringifySafe = (v: unknown) => {
    // If it's already a primitive string/number/boolean/null, convert to string simply.
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    // For objects/arrays/functions/symbols etc. fallback to JSON.stringify with replacer
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      // If stringify fails (circular refs), give a safe fallback
      return String(v);
    }
  };

  if (raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "")) {
    rows = [{ key: "-", value: "No Schema Documented" }];
  } else {
    // Try to get a plain object / array out of raw.
    let parsed: unknown = null;
    if (typeof raw === "string") {
      // try parse string as JSON
      try {
        parsed = JSON.parse(raw);
      } catch {
        // not valid JSON — treat as raw string (single row)
        rows = [{ key: "-", value: raw }];
      }
    } else {
      // raw is already an object/array
      parsed = raw;
    }

    if (parsed !== null && rows.length === 0) {
      // If parsed is an object or array, build rows from entries.
      if (typeof parsed === "object") {
        // For arrays and objects use Object.entries to generate rows.
        try {
          rows = Object.entries(parsed as Record<string, unknown>).map(
            ([k, v]) => ({ key: k, value: stringifySafe(v) })
          );
          // If no keys (empty object), show placeholder
          if (rows.length === 0) {
            rows = [{ key: "-", value: stringifySafe(parsed) }];
          }
        } catch {
          // fallback if entries fail
          rows = [{ key: "-", value: stringifySafe(parsed) }];
        }
      } else {
        // primitive (number/boolean), show single row
        rows = [{ key: "-", value: stringifySafe(parsed) }];
      }
    }
  }

  const canCopy = !!raw;

  const handleCopy = () => {
    if (!raw) return;
    // copy the original raw (if object, copy stringified)
    const toCopy = typeof raw === "string" ? raw : stringifySafe(raw);
    navigator.clipboard.writeText(toCopy);
  };

  return (
    <div className="group bg-black/10 border border-surface-500/50 px-2 pt-2 rounded-xl relative">
      {/* Header Row */}
      <div className="w-full flex justify-end items-center space-x-2">
        <div className="mr-auto flex items-center gap-2">
          <button
            onClick={() =>
              setView((prev) => (prev === "json" ? "json_ex" : "json"))
            }
            className="
              transition-opacity 
              text-[0.65rem] text-surface-200 px-1.5 py-0.5 rounded-sm border border-surface-500/50 
              hover:bg-surface-600/40
            "
          >
            {view === "json" ? "VIEW EXAMPLE" : "VIEW SCHEMA"}
          </button>

          {swappable && (
            <button
              onClick={() => swapCodeBlock(true)}
              className="
                transition-opacity 
                text-[0.65rem] text-surface-200 px-1.5 py-0.5 rounded-sm border border-surface-500/50 
                hover:bg-surface-600/40
              "
            >
              METADATA
            </button>
          )}
        </div>

        {canCopy && (
          <button
            onClick={handleCopy}
            className="
              opacity-0 group-hover:opacity-100 transition-opacity 
              text-[0.65rem] text-surface-200 px-1.5 py-0.5 rounded-sm border border-surface-500/50 
              hover:bg-surface-600/40
            "
          >
            Copy
          </button>
        )}

        <span className="text-[0.65rem] text-surface-300 px-1 py-0.5 border border-surface-500/50 rounded-sm">
          TABLE
        </span>
      </div>

      {/* Two-column table */}
      <div className="mt-2 max-h-80 overflow-auto scroll-thin scroll-bar-round">
        <table className="w-full text-[0.75rem] text-surface-100 border-collapse">
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={`${row.key}-${idx}`}
                className="border-b border-surface-700/60"
              >
                <td className="px-2 py-1 whitespace-nowrap text-surface-200 w-1/5 align-top">
                  {row.key}
                </td>
                <td className="px-2 py-1 text-surface-300 wrap-break-word align-top">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormType;
