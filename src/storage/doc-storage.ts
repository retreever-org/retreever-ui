import localForage from 'localforage'
import type { RetreeverDoc } from '../types/response.types'

const docStore = localForage.createInstance({
  name: 'retreever-docs',
  storeName: 'docs'
})

export const docStorage = {
  // Save/Replace RetreeverDoc
  saveDoc: async (doc: RetreeverDoc): Promise<void> => {
    await docStore.setItem('doc', doc)
  },

  // Get RetreeverDoc
  getDoc: async (): Promise<RetreeverDoc | null> => {
    return docStore.getItem('doc')
  },

  // Clear everything
  clear: async (): Promise<void> => {
    await docStore.clear()
  },
}
