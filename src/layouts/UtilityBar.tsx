import React, { useCallback, useEffect } from "react";
import { DocumentIcon, ShortcutIcon, VariableIcon } from "../svgs/svgs";
import { useRightPanelStore } from "../stores/right-panel-store";
import { useDockStore } from "../stores/dock-store";
import Shortcut from "../components/utility/Shortcut";
import EnvironmentVars from "../components/utility/Environment";

const UtilityBar: React.FC = () => {
  const { closePanel, openPanel, panelName } = useRightPanelStore();
  const { open, openDock, closeDock } = useDockStore();

  const handleClick = useCallback(
    (element: React.ReactNode, newPanelName: string) => {
      if (panelName === newPanelName) {
        closePanel();
        return;
      }
      openPanel(element, newPanelName);
    },
    [panelName, closePanel, openPanel]
  );

  // Keyboard shortcuts: run once, use the stable handleClick
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isTextInput) return;

      // Ctrl + /
      if (e.ctrlKey && (e.key === "/" || e.code === "Slash")) {
        e.preventDefault();
        handleClick(<Shortcut />, "shortcut-btn");
        return;
      }

      // Alt + Shift + E
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        handleClick(<EnvironmentVars />, "env-btn");
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClick]);

  return (
    <div
      id="utility-drawer"
      className="absolute z-20 bg-linear-to-b from-surface-700 to-surface-800 top-0 right-0 h-full w-12 border-l border-surface-500/30 flex flex-col items-center"
    >
      
      <Button
        icon={<DocumentIcon />}
        onClick={() => (open ? closeDock() : openDock())}
      />
      <Button
        icon={<VariableIcon />}
        onClick={() => handleClick(<EnvironmentVars />, "env-btn")}
      />
      <Button
        icon={<ShortcutIcon />}
        onClick={() => handleClick(<Shortcut />, "shortcut-btn")}
      />
    </div>
  );
};

export default UtilityBar;

// ---------------------------- Button Component ----------------------------
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
      {/* Icon wrapper — only this animates */}
      <span className="text-surface-300/80 w-full py-4 hover:text-surface-200 flex justify-center items-center  transition-transform active:scale-90 active:-translate-y-[0.05px]">
        {icon}
      </span>
    </button>
  );
}
