import { useEffect } from 'react'
import { useApiHealthStore } from '../stores/api-state-store'
import { useDocStore } from '../stores/doc-store'
import { docStorage } from '../storage/doc-storage'
import { getRetreeverDoc } from '../api/services/get-retreever-doc'
import { ping } from '../api/services/ping'
import { getSidebarCollections } from '../services/sidebar-collections'
import type { RetreeverDoc } from '../types/response.types'

export const useAppInitializer = () => {
  const { setOnline, setOffline } = useApiHealthStore()
  const docStore = useDocStore()

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const initialize = async () => {
      docStore.setInitializing(true)

      try {
        const cachedDoc = await docStorage.getDoc()
        
        if (cancelled) return
        
        if (cachedDoc) {
          docStore.setDoc(cachedDoc)
          docStore.setCollections(getSidebarCollections(cachedDoc))
          
          // Background validation (fire-and-forget)
          validateDocCache(cachedDoc, controller.signal).catch(console.error)
        } else {
          const doc = await getRetreeverDoc()
          if (cancelled) return
          
          await docStorage.saveDoc(doc)
          docStore.setDoc(doc)
          docStore.setCollections(getSidebarCollections(doc))
          setOnline()
        }
      } catch (error) {
        if (cancelled) return
        
        console.error('App initialization failed:', error)
        const cachedDoc = await docStorage.getDoc()
        if (cachedDoc) {
          docStore.setDoc(cachedDoc)
          docStore.setCollections(getSidebarCollections(cachedDoc))
          setOnline()
        } else {
          setOffline()
        }
      } finally {
        docStore.setInitializing(false)
      }
    }

    initialize()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])
}

export const validateDocCache = async (cachedDoc: RetreeverDoc, signal: AbortSignal) => {
  try {
    const pingResponse = await ping()
    if (signal.aborted) return
    
    useApiHealthStore.getState().setOnline()
    
    if (cachedDoc.up_time !== pingResponse.uptime) {
      const freshDoc = await getRetreeverDoc()
      if (signal.aborted) return
      
      await docStorage.saveDoc(freshDoc)
      useDocStore.getState().setDoc(freshDoc)
      useDocStore.getState().setCollections(getSidebarCollections(freshDoc))
    }
  } catch (error: any) {
    if (error.name === 'AbortError') return
    if (!signal.aborted) {
      useApiHealthStore.getState().setOffline()
      console.warn('Cache validation failed:', error)
    }
  }
}
