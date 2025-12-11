import { create } from "zustand";
import type { UtilityItem } from "../layouts/UtilityBar";

export interface UtilityViewingState {
  viewMode: "detached" | "attached";
  title: UtilityItem | null;

  attach: () => void;
  detach: () => void;
  setTitle: (title: UtilityItem | null) => void;
  clearView: () => void;
}

export const useUtilityViewState = create<UtilityViewingState>((set) => ({
  viewMode: "attached",
  title: null,

  attach: () => set({ viewMode: "attached" }),
  detach: () => set({ viewMode: "detached" }),
  setTitle: (title) => set({ title }),
  clearView: () => set({ title: null }),
}));
