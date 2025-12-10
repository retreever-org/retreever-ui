import {
  useApiLastHeartbeat,
  useIsApiOnline,
} from "../../stores/api-state-store";
import { useState } from "react";
import { motion } from "framer-motion";
import { RepeatIcon } from "../../svgs/svgs";
import { refreshAllStale } from "../../services/auto-refresh-service";

const ConnectionStatus: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isOnline = useIsApiOnline();
  const lastHeartbeat = useApiLastHeartbeat();

  const statusText = isOnline ? "Connected" : "Disconnected";

  const formatDateTime = (timestamp: string | null) => {
    if (!timestamp) return "Not yet connected";
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleClick = async () => {
    if (isOnline || isRefreshing) return;

    setIsRefreshing(true);

    // wait for the spin to finish before firing refresh
    const SPIN_DURATION_MS = 600;
    setTimeout(async () => {
      try {
        await refreshAllStale();
      } finally {
        setIsRefreshing(false);
      }
    }, SPIN_DURATION_MS);
  };

  return (
    <div className="relative inline-block">
      <div className="gap-1.5 flex justify-center items-center">
        {!isOnline && (
          <motion.span
            className="text-surface-400"
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <RepeatIcon />
          </motion.span>
        )}

        <motion.button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => {
            if (!isOnline && !isRefreshing) handleClick();
          }}
          // disabled={isOnline || isRefreshing}
          whileTap={!isOnline && !isRefreshing ? { scale: 0.96 } : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`
            hidden sm:inline-flex
            items-center gap-1
            rounded-md border px-2.5 py-1.5
            text-[11px] font-medium
            border-surface-500/80
            transition-colors duration-150
            hover:border-surface-500 
            ${!isOnline && !isRefreshing && "cursor-pointer"}
          `}
        >
          <span
            className={`
              h-1.5 w-1.5 rounded-full transition-colors duration-200
              ${isOnline ? "bg-success" : "bg-danger animate-pulse"}
            `}
          />
          <span className={isOnline ? "text-surface-200" : "text-surface-200"}>
            {statusText}
          </span>
        </motion.button>
      </div>

      {showTooltip && (
        <div
          className="
            absolute
            left-1/2 -translate-x-1/2
            top-full mt-4
            z-50 w-64
            bg-surface-800 border border-surface-500
            rounded-lg p-3 shadow-xl
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          <div className="text-[12px] font-medium text-surface-200 mb-1">
            {isOnline ? "Connection Healthy" : "Connection Failed"}
          </div>

          <div className="space-y-1 text-[11px] text-surface-400">
            <div>
              <span className="font-medium">Last Connected At:</span>{" "}
              <span>{formatDateTime(lastHeartbeat)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
