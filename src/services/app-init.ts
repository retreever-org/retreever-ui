import { getRetreeverDoc } from '../api/services/get-retreever-doc'
import { ping } from '../api/services/ping'
import { docStorage } from '../storage/doc-storage'
import { useDocStore } from '../stores/doc-store'
import type { RetreeverDoc } from '../types/response.types'
import { getSidebarCollections } from './sidebar-collections'

export class AppInitializer {
  static async initialize(): Promise<void> {
    const store = useDocStore.getState()
    store.setInitializing(true)

    try {
      // 1. FIRST check cache (offline-first)
      const cachedDoc = await docStorage.getDoc()
      
      if (cachedDoc) {
        // 2. Cache exists → Try validate in BACKGROUND
        store.setDoc(cachedDoc)
        store.setCollections(getSidebarCollections(cachedDoc))
        
        // Background validation (non-blocking)
        this.validateCache(cachedDoc).catch(console.error)
      } else {
        // 3. No cache → Fetch fresh (blocking)
        const doc = await getRetreeverDoc()
        await docStorage.saveDoc(doc)
        store.setDoc(doc)
        store.setCollections(getSidebarCollections(doc))
      }
      
    } catch (error) {
      console.error('App initialization failed:', error)
      // Fallback: try cache again
      const cachedDoc = await docStorage.getDoc()
      if (cachedDoc) {
        store.setDoc(cachedDoc)
        store.setCollections(getSidebarCollections(cachedDoc))
      }
    } finally {
      store.setInitializing(false)
    }
  }

  // Background cache validation (non-blocking)
  private static async validateCache(cachedDoc: RetreeverDoc): Promise<void> {
    try {
      const pingResponse = await ping()
      if (cachedDoc.up_time !== pingResponse.uptime) {
        // Cache stale → Refresh
        const freshDoc = await getRetreeverDoc()
        await docStorage.saveDoc(freshDoc)
        useDocStore.getState().setDoc(freshDoc)
        useDocStore.getState().setCollections(getSidebarCollections(freshDoc))
      }
    } catch (error) {
      // Network error? Keep stale cache (offline resilience)
      console.warn('Cache validation failed, using stale cache:', error)
    }
  }
}
