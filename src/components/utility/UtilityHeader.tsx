import { useUtilityViewState } from "../../stores/utility-view-store";
import { DetachIcon, SidePanelIcon, XMarkIcon } from "../../svgs/svgs";

interface UtilityHeaderProps {
  title: string | null;
  onclose?: () => void;
  onSwitchView: () => void;
}

const UtilityHeader: React.FC<UtilityHeaderProps> = ({
  title,
  onclose,
  onSwitchView,
}) => {
  const { viewMode } = useUtilityViewState();
  return (
    <div className="dock-header flex items-center justify-between px-3 py-1.5 border-b border-surface-500/30 cursor-grab select-none">
      <span className="flex items-center gap-2 text-xs font-medium text-slate-200/80">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
        {title}
      </span>

      <div className="space-x-2 flex justify-center items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwitchView();
          }}
          className="h-6 w-6 inline-flex items-center justify-center rounded-md cursor-pointer"
        >
          <span className="text-surface-300 hover:text-surface-200 scale-95">
            {viewMode === "attached" ? <DetachIcon /> : <SidePanelIcon />}
          </span>
        </button>

        {/* {viewMode === "detached" && ( */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onclose && onclose();
            }}
            className="h-6 w-6 inline-flex items-center justify-center rounded-md border border-surface-500/30 hover:border-rose-500/10 hover:bg-rose-500/20 cursor-pointer"
          >
            <span className="text-surface-300 hover:text-rose-400 h-full w-full flex justify-center items-center">
              <XMarkIcon />
            </span>
          </button>
        {/* )} */}
      </div>
    </div>
  );
};

export default UtilityHeader;
