// UtilityBar.tsx
import React, { useCallback, useEffect } from "react";
import { DocumentIcon, ShortcutIcon, VariableIcon } from "../svgs/svgs";
import { useRightPanelStore } from "../stores/right-panel-store";
import { useUtilityViewState } from "../stores/utility-view-store";
import { useDockStore } from "../stores/dock-store";

export type UtilityItem =
  | "Documentation"
  | "Environment Variables"
  | "Shortcuts";

const UtilityBar: React.FC = () => {
  const { closePanel, openPanel } = useRightPanelStore();
  const { openDock, closeDock } = useDockStore();
  const { viewMode, title, setTitle, clearView } = useUtilityViewState();

  const viewInSidePanel = useCallback(
    (newPanelName: UtilityItem) => {
      if (title === newPanelName) {
        closePanel();
        clearView();
        return;
      }

      setTitle(newPanelName);
      openPanel();
    },
    [title, closePanel, openPanel, setTitle, clearView],
  );

  const viewInFloatingPanel = useCallback(
    (newPanelName: UtilityItem) => {
      if (title === newPanelName) {
        closeDock();
        clearView();
        return;
      }

      setTitle(newPanelName);
      openDock();
    },
    [title, closeDock, openDock, setTitle, clearView],
  );

  const handleSelect = (newPanelName: UtilityItem) => {
    if (viewMode === "attached") {
      viewInSidePanel(newPanelName);
    } else {
      viewInFloatingPanel(newPanelName);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isTextInput) return;

      if (e.ctrlKey && (e.key === "/" || e.code === "Slash")) {
        e.preventDefault();
        handleSelect("Shortcuts");
        return;
      }

      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        handleSelect("Environment Variables");
        return;
      }

      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleSelect("Documentation");
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSelect]);

  return (
    <div
      id="utility-drawer"
      className="absolute z-20 bg-linear-to-b from-surface-700 to-surface-800 top-0 right-0 h-full w-12 border-l border-surface-500/30 flex flex-col items-center"
    >
      <Button icon={<DocumentIcon />} onClick={() => handleSelect("Documentation")} />
      <Button icon={<VariableIcon />} onClick={() => handleSelect("Environment Variables")} />
      <Button icon={<ShortcutIcon />} onClick={() => handleSelect("Shortcuts")} />
    </div>
  );
};

export default UtilityBar;

function Button({
  icon,
  onClick,
}: {
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full border-surface-500/30 
        flex justify-center items-center 
        hover:bg-surface-800 
        transition-all
        cursor-pointer
      "
    >
      <span className="text-surface-300/80 w-full py-4 hover:text-surface-200 flex justify-center items-center transition-transform active:scale-90 active:-translate-y-[0.05px]">
        {icon}
      </span>
    </button>
  );
}
