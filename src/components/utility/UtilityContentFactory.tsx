import React from "react";
import Shortcut from "./Shortcut";
import EnvironmentPanel from "./Environment";
import DocumentDisplay from "../../layouts/DocumentDisplay";
import type { UtilityItem } from "../../layouts/UtilityBar";

export function getUtilityContent(title: UtilityItem | null): React.ReactNode {
  switch (title) {
    case "Shortcuts":
      return <Shortcut />;
    case "Environment Variables":
      return <EnvironmentPanel />;
    case "Documentation":
      return <DocumentDisplay />;
    default:
      return null;
  }
}
