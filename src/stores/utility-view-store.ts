import type React from "react";
import { create } from "zustand";

interface UtilityViewingState {
  viewMode: "detached" | "attached";
  content: React.ReactNode | null;
  title: string | null;

  attach: () => void;
  detach: () => void;
  setContent: (content: React.ReactNode) => void;
  setTitle: (title: string) => void;
  clearView: () => void;
}

export const useUtilityViewState = create<UtilityViewingState>((set) => ({
  viewMode: "attached",
  content: null,
  title: null,

  attach: () => set({ viewMode: "attached" }),
  detach: () => set({ viewMode: "detached" }),
  setContent: (content: React.ReactNode) => set({ content }),
  setTitle: (title: string) => set({ title }),
  clearView: () => set({ content: null, title: null }),
}));
