import type { ResponseViewMode } from "../types/editor.types";

export const ALLOW_PLACEHOLDER_RESPONSE_RENDERING: boolean =
  import.meta.env.VITE_ALLOW_PLACEHOLDER_RESPONSE_RENDERING === "true";

export const RESPONSE_CONTENT_TYPE_TESTING: ResponseViewMode =
  import.meta.env.VITE_RESPONSE_CONTENT_TYPE_TESTING || "json";