import { create } from "zustand";

interface RightPanelState {
  isPanelOpen: boolean;
  content: React.ReactNode | null;
  width: number;
  panelName: string | null;
  maxWidth: number;

  openPanel: (content: React.ReactNode, panelName: string) => void;
  closePanel: () => void;
  setWidth: (w: number) => void;
  setMaxWidth: (mw: number) => void;
}

export const useRightPanelStore = create<RightPanelState>((set) => ({
  isPanelOpen: false,
  content: null,
  width: 360,
  panelName: null,
  maxWidth: 700,

  openPanel: (content, panelName) => set({ isPanelOpen: true, content, panelName: panelName }),
  closePanel: () => set({ isPanelOpen: false, panelName: null }),
  setWidth: (width) => set({ width }),
  setMaxWidth: (max) => set({maxWidth: max})
}));
