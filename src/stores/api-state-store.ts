import { create } from "zustand";

interface ApiHealthState {
  isOnline: boolean;
  lastHeartbeat: string | null;

  setOnline: () => void;
  setOffline: () => void;
}

export const useApiHealthStore = create<ApiHealthState>()((set) => ({
  isOnline: false,
  lastHeartbeat: null,

  setOnline: () =>
    set({ isOnline: true, lastHeartbeat: new Date().toISOString() }),
    
  setOffline: () => set({ isOnline: false }),
}));

// Selectors
export const useIsApiOnline = () => 
  useApiHealthStore((state) => state.isOnline);

export const useApiLastHeartbeat = () => 
  useApiHealthStore((state) => state.lastHeartbeat);
