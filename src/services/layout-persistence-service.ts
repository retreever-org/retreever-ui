import { useDockStore } from "../stores/dock-store";
import { useRightPanelStore } from "../stores/right-panel-store";
import { useUtilityViewState } from "../stores/utility-view-store";

import {
  saveDockLayout,
  saveRightPanelLayout,
  saveUtilityLayout,
  loadDockLayout,
  loadRightPanelLayout,
  loadUtilityLayout,
} from "../storage/layoutRepository";

/**
 * Simple debounce helper for async persisters.
 */
const debounce = <T extends (...args: any[]) => void>(fn: T, delay = 150) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// ---- PERSIST SUBSCRIPTIONS ----

const persistDock = debounce(() => {
  const s = useDockStore.getState();
  void saveDockLayout({
    open: s.open,
    x: s.x,
    y: s.y,
    width: s.width,
    height: s.height,
    hasMoved: s.hasMoved,
  });
});

const persistRightPanel = debounce(() => {
  const s = useRightPanelStore.getState();
  void saveRightPanelLayout({
    isPanelOpen: s.isPanelOpen,
    width: s.width,
    maxWidth: s.maxWidth,
  });
});

const persistUtilityView = debounce(() => {
  const s = useUtilityViewState.getState();
  void saveUtilityLayout({
    viewMode: s.viewMode,
    title: s.title,
  });
});

// ---- PUBLIC API ----

/**
 * Call once on app startup (e.g. in App.tsx or root layout).
 * Sets up subscriptions and hydrates initial state from IndexedDB.
 */
export const initLayoutPersistence = async () => {
  const [dockLayout, rightPanelLayout, utilityLayout] = await Promise.all([
    loadDockLayout(),
    loadRightPanelLayout(),
    loadUtilityLayout(),
  ]);

  // Merge layout
  useDockStore.setState((prev) => ({
    ...prev,
    open: dockLayout.open,
    x: dockLayout.x,
    y: dockLayout.y,
    width: dockLayout.width,
    height: dockLayout.height,
    hasMoved: dockLayout.hasMoved,
  }));

  useRightPanelStore.setState((prev) => ({
    ...prev,
    isPanelOpen: rightPanelLayout.isPanelOpen,
    width: rightPanelLayout.width,
    maxWidth: rightPanelLayout.maxWidth,
  }));

  useUtilityViewState.setState((prev) => ({
    ...prev,
    viewMode: utilityLayout.viewMode,
    title: utilityLayout.title as any, // cast to UtilityItem | null if needed
  }));

  // subscriptions
  useDockStore.subscribe(persistDock);
  useRightPanelStore.subscribe(persistRightPanel);
  useUtilityViewState.subscribe(persistUtilityView);
};
