export type UtilityLayoutPersisted = {
  viewMode: "detached" | "attached";
  title: string | null;
};

export type RightPanelLayoutPersisted = {
  isPanelOpen: boolean;
  width: number;
  maxWidth: number;
};

export type DockLayoutPersisted = {
  open: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  hasMoved: boolean;
};

export type SidebarLayoutPersisted = {
  width: number;
  openMap: Record<string, boolean>;
};

export type LayoutSnapshot = {
  utility: UtilityLayoutPersisted;
  rightPanel: RightPanelLayoutPersisted;
  dock: DockLayoutPersisted;
  sidebar: SidebarLayoutPersisted;
};
