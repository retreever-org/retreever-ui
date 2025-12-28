import { SHORTCUTS, type ShortcutItem } from "../../storage/shortcuts";

const Shortcut: React.FC = () => {
  const shortcuts: ShortcutItem[] = SHORTCUTS;

  return (
    <section className="h-full w-full px-4 py-6 pb-20 bg-transparent">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-3 text-left text-sm font-semibold text-slate-100/90 tracking-wide">
              Shortcuts
            </th>
            <th className="py-2 px-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-400/70">
              Productivity
            </th>
          </tr>
        </thead>

        <tbody>
          {shortcuts.map((shortcut) => (
            <tr
              key={shortcut.keys}
              className="hover:bg-surface-500/5 transition-colors"
            >
              {/* KEYS COLUMN */}
              <td className="py-2 px-3 align-top">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-200/90">
                  {shortcut.keys.split("+").map((key) => (
                    <kbd
                      key={key.trim()}
                      className="px-1.5 py-0.5 rounded border border-surface-500/60 
                             bg-surface-900/70 text-[10px] font-medium text-slate-100/90 
                             shadow-sm flex items-center justify-center"
                    >
                      {key.trim()}
                    </kbd>
                  ))}
                </div>
              </td>

              {/* DESCRIPTION COLUMN */}
              <td className="py-2 px-3 align-top text-right">
                <p className="text-xs text-slate-300/90 leading-snug">
                  {shortcut.description}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Shortcut;
