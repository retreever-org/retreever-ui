import { create } from 'zustand'

interface DockState {
  open: boolean
  x: number
  y: number
  width: number
  height: number

  // actions
  openDock: () => void
  closeDock: () => void
  toggleDock: () => void

  setPosition: (x: number, y: number) => void
  setSize: (width: number, height: number) => void
}

export const useDockStore = create<DockState>((set) => ({
  open: true,
  x: 120,
  y: 60,
  width: 420,
  height: 600,

  openDock: () => set({ open: true }),
  closeDock: () => set({ open: false }),
  toggleDock: () => set((s) => ({ open: !s.open })),

  setPosition: (x, y) => set({ x, y }),
  setSize: (width, height) => set({ width, height }),
}))
