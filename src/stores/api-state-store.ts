import { create } from "zustand";

interface ApiHealthState {
  isOnline: boolean;
  lastHeartbeat: string | null;
  refreshRequired: boolean;

  setOnline: () => void;
  setOffline: () => void;
  setRefreshRequired: (b: boolean) => void;
}

export const useApiHealthStore = create<ApiHealthState>()((set) => ({
  isOnline: false,
  lastHeartbeat: null,
  refreshRequired: false,

  setOnline: () =>
    set({ isOnline: true, lastHeartbeat: new Date().toISOString() }),
    
  setOffline: () => set({ isOnline: false }),
  setRefreshRequired: (b: boolean) => set({refreshRequired: b})
}));

// Selectors
export const useIsApiOnline = () => 
  useApiHealthStore((state) => state.isOnline);

export const useApiLastHeartbeat = () => 
  useApiHealthStore((state) => state.lastHeartbeat);
