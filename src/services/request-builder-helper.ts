import type { AxiosResponseHeaders, RawAxiosRequestHeaders } from "axios";
import { getFile } from "../storage/file-storage";
import type { FormEntry, RequestKeyValueEntry } from "../types/editor.types";
import type { ResolvedVariable } from "../types/env.types";

export function resolveEnvVars(
  input: string,
  vars: ResolvedVariable[]
): string {
  return input.replace(/\{\{([^}]+)\}\}/g, (_, name) => {
    const v = vars.find(v => v.name === name);
    return v?.value ?? "";
  });
}

export function buildUrl(
  baseUrl: string,
  queryParams: RequestKeyValueEntry[],
  vars: ResolvedVariable[]
): string {
  const qp = queryParams
    .filter(q => !q.ignore && q.key)
    .map(q =>
      `${encodeURIComponent(q.key)}=${encodeURIComponent(
        resolveEnvVars(q.value, vars)
      )}`
    );

  if (!qp.length) return baseUrl;
  return `${baseUrl}?${qp.join("&")}`;
}

export function buildHeaders(
  headers: RequestKeyValueEntry[],
  vars: ResolvedVariable[]
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const h of headers) {
    if (h.ignore || !h.key) continue;
    out[h.key] = resolveEnvVars(h.value, vars);
  }

  return out;
}

export function normalizeAxiosHeaders(
  headers: AxiosResponseHeaders | Partial<RawAxiosRequestHeaders>
): Record<string, string> {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      normalized[key.toLowerCase()] = value.join(", ");
    } else {
      normalized[key.toLowerCase()] = String(value);
    }
  }

  return normalized;
}


export function buildRawBody(
  raw: string | undefined,
  vars: ResolvedVariable[]
): string | undefined {
  if (!raw) return undefined;
  return resolveEnvVars(raw, vars);
}

export function buildUrlEncodedBody(
  entries: RequestKeyValueEntry[],
  vars: ResolvedVariable[]
): URLSearchParams {
  const params = new URLSearchParams();

  for (const e of entries) {
    if (e.ignore || !e.key) continue;
    params.append(e.key, resolveEnvVars(e.value, vars));
  }

  return params;
}

function resolveFileIds(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return [value];
  }
}


export async function buildFormDataBody(
  entries: FormEntry[],
  vars: ResolvedVariable[]
): Promise<FormData> {
  const fd = new FormData();

  for (const e of entries) {
    if (e.ignore || !e.key) continue;

    if (e.type === "file") {
      const fileIds = resolveFileIds(e.value);

      for (const id of fileIds) {
        const blob = await getFile(id);
        if (blob) {
          fd.append(e.key, blob);
        }
      }
    } else {
      fd.append(e.key, resolveEnvVars(e.value, vars));
    }
  }

  return fd;
}


export async function buildBinaryBody(fileId?: string): Promise<Blob | null> {
  if (!fileId) return null;
  return await getFile(fileId);
}

//------------------------------------------ Format time ------------------------------------------
export function formatDuration(ms?: number): number {
  if (ms == null) return 0;
  return Number(ms.toFixed(1));
}

export function formatTransferSpeed(bytes?: number, ms?: number): string {
  if (!bytes || !ms || ms === 0) return "-";

  const bytesPerSec = (bytes / ms) * 1000;

  if (bytesPerSec < 1024)
    return `${bytesPerSec.toFixed(1)} B/s`;

  if (bytesPerSec < 1024 * 1024)
    return `${(bytesPerSec / 1024).toFixed(2)} KB/s`;

  return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`;
}
