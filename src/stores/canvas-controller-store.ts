import { create } from "zustand";

interface CanvasState {
  displayApiDoc: boolean;

  setDisplayApiDoc: (b: boolean) => void;
}

export const useCanvasState = create<CanvasState>()((set) => ({
  displayApiDoc: false,

  setDisplayApiDoc: (b: boolean) => set({ displayApiDoc: b }),
}));
