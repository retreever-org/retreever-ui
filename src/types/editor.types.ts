import type { HttpMethod } from "./response.types";

export interface TabDoc {
  key: string;
  method: HttpMethod;
  path: string;

  uiRequest: {
    url: string;
    headers: RequestKeyValueEntry[];
    queryParams: RequestKeyValueEntry[];
    consumes: string[];

    editing: EditingType;
    bodyType: BodyType;
    rawType: RawBodyType | undefined;

    body: {
      raw: string | undefined;

      formData: FormEntry[];
      urlEncoded: RequestKeyValueEntry[];

      binaryFileId?: string; // references IndexedDB blob
    };
  };

  lastResponse?: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;  // Raw headers unchanged
    cookies?: CookieEntry[];           // NEW: Parsed cookies array
    body?: string;
    durationMs?: number;
    timestamp?: number;
    sizeBytes?: number;
    transferSpeed?: number;
    requestId?: string;

    // Response rendering
    contentType?: string;
    viewMode?: ResponseViewMode;
  };

  createdAt: number;
  updatedAt: number;
}

export type ResponseViewMode =
  | "json"
  | "text"
  | "html"
  | "xml"
  | "raw" // Textual
  | "auto"; // Media: image/video/audio/pdf/csv → preview only

// Media MIME patterns (implicit handling)
const MEDIA_TYPES = {
  image: ["image/"],
  video: ["video/"],
  audio: ["audio/"],
  pdf: ["application/pdf"],
  csv: ["text/csv"],
  excel: ["application/vnd.", "application/excel"],
  multipart: ["multipart/"],
};

export interface TabOrderItem {
  tabKey: string;
  order: number; // 0-based index
  name: string; // label for TabBar
}

export interface RequestKeyValueEntry {
  key: string;
  value: string;

  editable: boolean; // can the key be edited?
  local: boolean; // was this added by user?
  ignore: boolean; // exclude from request send
}

export interface FormEntry {
  key: string;

  type: InputType;
  value: string; // text OR fileId OR fileIDs JSON string array "[]"

  editable: boolean;
  local: boolean;
  ignore: boolean;
}

export type InputType = "text" | "file";

export type TabOrderList = TabOrderItem[];

export type EditingType = "params" | "headers" | "body";

export type BodyType =
  | "none"
  | "form-data"
  | "x-www-form-urlencoded"
  | "binary"
  | "raw";

export type RawBodyType = "text" | "JSON" | "XML" | "HTML" | "JavaScript";

export interface CookieEntry {
  name: string;
  value: string;
  domain?: string;
  path: string;
  expires?: string; // ISO date string
  maxAge?: number;  // seconds
  secure: boolean;
  httpOnly: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  local: boolean;   // parsed from response (vs user-added)
}