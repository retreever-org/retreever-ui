// src/storage/layoutRepository.ts
import { layoutDB } from "./layoutStorage";
import type {
  UtilityLayoutPersisted,
  RightPanelLayoutPersisted,
  DockLayoutPersisted,
  SidebarLayoutPersisted,
} from "../types/layout.types";

// Keys for each slice
const KEYS = {
  utility: "utility-view",
  rightPanel: "right-panel",
  dock: "dock-layout",
  sidebar: "sidebar-layout",
} as const;

// ------------------- Utility State Operations -------------------
export const saveUtilityLayout = async (
  state: UtilityLayoutPersisted,
) => {
  await layoutDB.setItem<UtilityLayoutPersisted>(KEYS.utility, state);
};

export const loadUtilityLayout = async () => {
  const data = await layoutDB.getItem<UtilityLayoutPersisted>(KEYS.utility);
  return data ?? { viewMode: "attached", title: null };
};

// ------------------- Side Panel Operations -------------------
export const saveRightPanelLayout = async (
  state: RightPanelLayoutPersisted,
) => {
  await layoutDB.setItem<RightPanelLayoutPersisted>(KEYS.rightPanel, state);
};

export const loadRightPanelLayout = async () => {
  const data = await layoutDB.getItem<RightPanelLayoutPersisted>(
    KEYS.rightPanel,
  );
  return data ?? { isPanelOpen: false, width: 360, maxWidth: 700 };
};

// ------------------ Floating Panel Operations -------------------
export const saveDockLayout = async (state: DockLayoutPersisted) => {
  await layoutDB.setItem<DockLayoutPersisted>(KEYS.dock, state);
};

export const loadDockLayout = async () => {
  const data = await layoutDB.getItem<DockLayoutPersisted>(KEYS.dock);
  return (
    data ?? {
      open: false,
      x: 260,
      y: 60,
      width: 580,
      height: 700,
      hasMoved: false,
    }
  );
};

// ------------------ Sidebar Operations -------------------
export const saveSidebarLayout = async (state: SidebarLayoutPersisted) => {
  await layoutDB.setItem<SidebarLayoutPersisted>(KEYS.sidebar, state);
};

export const loadSidebarLayout = async () => {
  const data = await layoutDB.getItem<SidebarLayoutPersisted>(KEYS.sidebar);
  return data ?? { width: 288 }; // default
};