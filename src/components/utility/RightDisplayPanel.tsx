import { useEffect, useRef, useState } from "react";
import { useRightPanelStore } from "../../stores/right-panel-store";
import { LeftDoubleIcon } from "../../svgs/svgs";

export function RightDisplayPanel() {
  const { isPanelOpen, content, maxWidth } = useRightPanelStore();

  const [width, setWidth] = useState(360);
  const [visible, setVisible] = useState(isPanelOpen);

  const NAVBAR_HEIGHT = 50; // your navbar height

  const panelRef = useRef<HTMLDivElement | null>(null);

  // ------------------------------------------
  // Visibility timing for slide animation
  // ------------------------------------------
  useEffect(() => {
    if (isPanelOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 220);
      return () => clearTimeout(timeout);
    }
  }, [isPanelOpen]);

  if (!visible) return null;

  // ------------------------------------------
  // Left-edge resize logic
  // ------------------------------------------
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
      className="fixed h-[calc(100vh-50px)]" // BELOW navbar
      style={{
        top: NAVBAR_HEIGHT,
        right: 48, // stays next to UtilityBar
        width,
        zIndex: 19,
        transform: isPanelOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.2s ease-out",
      }}
    >
      <div
        className="
          h-full flex
          bg-linear-to-b from-surface-700 to-surface-800
          border-l border-surface-500/40 shadow-xl
        "
      >

        {/* CONTENT */}
        <div className="overflow-auto h-full flex-1">{content}</div>

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
  );
}
