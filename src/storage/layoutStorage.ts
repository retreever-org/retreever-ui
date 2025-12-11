// src/storage/layoutStorage.ts
import localforage from "localforage";

export const layoutDB = localforage.createInstance({
  name: "retreever-layout",
  storeName: "layout_state",
});
