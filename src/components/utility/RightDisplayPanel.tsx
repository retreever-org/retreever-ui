import { useEffect, useRef, useState } from "react";
import { useRightPanelStore } from "../../stores/right-panel-store";
import { DetachIcon, LeftDoubleIcon } from "../../svgs/svgs";
import { useUtilityViewState } from "../../stores/utility-view-store";
import { useDockStore } from "../../stores/dock-store";
import UtilityHeader from "./UtilityHeader";

export function RightDisplayPanel() {
  const { isPanelOpen, maxWidth, closePanel } = useRightPanelStore();
  const { content, detach, title } = useUtilityViewState();
  const { openDock } = useDockStore();

  const [width, setWidth] = useState(360);
  const [visible, setVisible] = useState(isPanelOpen);

  const NAVBAR_HEIGHT = 49; // your navbar height

  const panelRef = useRef<HTMLDivElement | null>(null);

  // ------------------------ Visibility timing for slide animation ------------------------
  useEffect(() => {
    if (isPanelOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 220);
      return () => clearTimeout(timeout);
    }
  }, [isPanelOpen]);

  if (!visible) return null;

  // ------------------------- Left-edge resize logic -------------------------
  function startResize(e: React.MouseEvent) {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = width;

    function onMove(ev: MouseEvent) {
      const delta = startX - ev.clientX;
      let newWidth = startWidth + delta;

      newWidth = Math.max(420, Math.min(maxWidth, newWidth));
      setWidth(newWidth);
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      ref={panelRef}
      className="fixed h-[calc(100vh-49px)] bg-linear-to-b from-surface-700 to-surface-800 
          border-l border-surface-500/40 shadow-xl" // BELOW navbar
      style={{
        top: NAVBAR_HEIGHT,
        right: 48, // stays next to UtilityBar
        width,
        zIndex: 19,
        transform: isPanelOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.2s ease-out",
      }}
    >
      <div className="overflow-auto scroll-thin h-full">
        {/* <div className="flex justify-end px-4 py-2 ">
          <button
            className="cursor-pointer text-surface-300 hover:text-surface-200"
            onClick={() => {
              detach();
              closePanel();
              openDock();
            }}
          >
            <DetachIcon />
          </button>
        </div> */}
        <UtilityHeader
          title={title}
          onSwitchView={() => {
            detach();
            closePanel();
            openDock();
          }}
        />
        <div
          className="
          h-full flex
        "
        >
          {/* CONTENT */}
          <div className="flex-1">{content}</div>

          {/* LEFT RESIZE HANDLE */}
          <div
            className="
          absolute left-0 top-0 h-full 
          flex justify-center items-center
          w-2.5 
          cursor-ew-resize 
          bg-transparent
          hover:bg-surface-500/20 
          active:bg-surface-500/40
        "
            onMouseDown={startResize}
          >
            <LeftDoubleIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
