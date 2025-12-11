import { create } from "zustand";

export interface RightPanelState {
  isPanelOpen: boolean;
  width: number;
  maxWidth: number;

  openPanel: () => void;
  closePanel: () => void;
  setWidth: (w: number) => void;
  setMaxWidth: (mw: number) => void;
}

export const useRightPanelStore = create<RightPanelState>((set) => ({
  isPanelOpen: false,
  width: 360,
  maxWidth: 700,

  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  setWidth: (width) => set({ width }),
  setMaxWidth: (max) => set({maxWidth: max})
}));
