import React, { useMemo } from "react";
import { useDocStore } from "../../stores/doc-store";
import { CollectionIcon, FlameIcon } from "../../svgs/svgs";
import type { ApiGroup, Endpoint } from "../../types/response.types";

/**
 * Redesigned AppDocument
 * - preserves design tokens: bg-transparent, text-surface-*, border-surface-*
 * - improved responsiveness and spacing, uses useMemo for aggregated counts
 * - clearer visual hierarchy and accessible stats
 */

export const formatUtcToLocal = (utcString?: string | null): string => {
  if (!utcString) return "—";
  const date = new Date(utcString);
  if (isNaN(date.getTime())) return utcString;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const countVisibilityAndDeprecated = (endpoints?: Endpoint[] | null) => {
  const list = endpoints ?? [];
  let publicCount = 0;
  let privateCount = 0;
  let deprecatedCount = 0;

  for (const ep of list) {
    if (ep?.secured) privateCount++;
    else publicCount++;
    if (ep?.deprecated) deprecatedCount++;
  }

  return { publicCount, privateCount, deprecatedCount, total: list.length };
};

/* Small presentational pieces kept simple for reuse */
const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div
    role="group"
    aria-label={label}
    className="flex flex-col gap-1 px-4 py-3 bg-transparent border border-surface-500/30 rounded-xl min-w-40"
  >
    <div className="text-[10px] tracking-wide uppercase text-surface-300">
      {label}
    </div>
    <div className="text-xl font-semibold text-surface-100">{value}</div>
  </div>
);

const CollectionRow: React.FC<{ g: ApiGroup }> = ({ g }) => {
  const { publicCount, privateCount, deprecatedCount, total } =
    countVisibilityAndDeprecated(g.endpoints);

  const isDeprecated = g.deprecated || deprecatedCount > 0;

  return (
    <div
      className={`flex flex-col md:flex-row gap-3 items-start md:items-center p-4 rounded-lg transition-colors border ${
        isDeprecated ? "border-rose-400/30" : "border-surface-500/20"
      } bg-surface-900/20`}
    >
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div
          className={`p-2 rounded-md ${
            isDeprecated ? "bg-rose-500/10" : "bg-surface-800/30"
          }`}
        >
          <CollectionIcon />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-surface-100 font-medium text-sm truncate">
              {g.name}
            </h3>
            {isDeprecated && (
              <span className="rounded-md bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-400">
                Deprecated
              </span>
            )}
          </div>
          {g.description ? (
            <p className="text-surface-300 text-xs truncate max-w-3xl">
              {g.description}
            </p>
          ) : (
            <p className="text-surface-500 text-xs italic">
              No description available
            </p>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4 text-xs text-surface-400">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-surface-200">{publicCount}</span>
          <span className="text-surface-400">public</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-surface-200">{privateCount}</span>
          <span className="text-surface-400">private</span>
        </div>
        {deprecatedCount > 0 && (
          <div className="flex items-baseline gap-2 text-rose-400/80">
            <span className="font-semibold">{deprecatedCount}</span>
            <span className="text-surface-400">deprecated</span>
          </div>
        )}
        <div className="text-surface-500 font-medium">{total} endpoints</div>
      </div>
    </div>
  );
};

export const AppDocument: React.FC = () => {
  const { doc } = useDocStore();
  const groups: ApiGroup[] = doc?.groups ?? [];

  // aggregated totals memoized
  const totals = useMemo(() => {
    return groups.reduce(
      (acc, g) => {
        const { publicCount, privateCount, deprecatedCount, total } =
          countVisibilityAndDeprecated(g.endpoints);
        acc.public += publicCount;
        acc.private += privateCount;
        acc.deprecated += deprecatedCount;
        acc.total += total;
        return acc;
      },
      { public: 0, private: 0, deprecated: 0, total: 0 }
    );
  }, [groups]);

  return (
    <div className="w-full h-full flex items-start justify-center overflow-y-auto scroll-thin bg-transparent">
      <div className="w-full max-w-5xl px-6 py-10">
        {/* Top area: title + meta + stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 items-start">
          {/* Main title & meta (left) */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-semibold text-surface-200 tracking-tight">
              {doc?.name}
            </h1>
            {doc?.description && (
              <p className="text-sm text-surface-300/90 max-w-3xl mt-2">
                {doc.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-3 items-center text-xs font-medium">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-800/30 border border-surface-500/20">
                <span className="text-surface-400 uppercase tracking-wide">
                  Version
                </span>
                <span className="text-surface-100 font-mono">
                  {doc?.version}
                </span>
              </div>
              {doc?.uri_prefix && (
                <div className="px-3 py-2 rounded-md bg-surface-800/30 border border-surface-500/20">
                  <span className="text-surface-200 font-mono text-xs">
                    {doc.uri_prefix}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-800/30 border border-surface-500/20">
                <span className="text-surface-400 uppercase tracking-wide">
                  Uptime
                </span>
                <span className="text-surface-200 font-mono text-xs">
                  {formatUtcToLocal(doc?.up_time)}
                </span>
              </div>
            </div>
          </div>

          {/* Right summary panel (fixed width) */}
          <aside className="w-full">
            <div className="bg-transparent border border-surface-500/20 rounded-xl p-4 flex flex-col gap-4 sticky top-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-md bg-surface-800/30 flex items-center justify-center">
                  {/* constrain icon size */}
                  <div className="w-16 h-16 text-surface-200">
                    <FlameIcon />
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-surface-400">
                    Overview
                  </div>
                  <div className="text-sm font-semibold text-surface-100">
                    API Summary
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatCard label="Total Groups" value={groups.length} />
                <StatCard label="Total Endpoints" value={totals.total} />
                <StatCard label="Public Endpoints" value={totals.public} />
                <StatCard
                  label="Private / Deprecated"
                  value={
                    <div className="flex flex-col gap-0">
                      <span className="text-surface-100">
                        {totals.private}{" "}
                        <span className="text-surface-400 font-normal text-xs">
                          private
                        </span>
                      </span>
                      <span className="text-rose-400/90">
                        {totals.deprecated}{" "}
                        <span className="text-surface-400 font-normal text-xs">
                          deprecated
                        </span>
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
          </aside>
        </div>
        {/* Collections heading */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-semibold text-surface-400 tracking-widest uppercase">
              API Groups
            </h2>
            <div className="flex-1 h-px bg-surface-500/10" />
          </div>
        </div>
        {/* Collections list */}
        <div className="space-y-3">
          {groups.length === 0 && (
            <div className="text-sm text-surface-500 italic">
              No API groups found.
            </div>
          )}

          {groups.map((g) => (
            <CollectionRow key={g.name} g={g} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppDocument;
