import { create } from "zustand"
import type { Endpoint } from "../types/response.types"

interface ViewingDocState {
  endpoint: Endpoint | null

  // actions
  setEndpoint: (ep: Endpoint | null) => void
  clear: () => void
}

export const useViewingDocStore = create<ViewingDocState>((set) => ({
  endpoint: null,

  setEndpoint: (endpoint) => set({ endpoint }),

  clear: () => set({ endpoint: null }),
}))

// Optional helper selectors (cleaner access)
export const useViewingEndpoint = () =>
  useViewingDocStore((s) => s.endpoint)
