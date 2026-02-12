import type { CookieEntry, RawHttpResponse, ResponseTiming, ResponseViewMode, TabDoc } from "../types/editor.types";

export function normalizeHttpResponse(
  res: RawHttpResponse,
  timing: ResponseTiming
): TabDoc["lastResponse"] {
  const contentType =
    res.headers["content-type"] ??
    res.headers["Content-Type"] ??
    "application/octet-stream";

  const body =
    typeof res.data === "string"
      ? res.data
      : safeStringify(res.data);

  const sizeBytes = body ? body.length : 0;

  return {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    cookies: parseSetCookie(res.headers),
    body,
    durationMs: timing.durationMs,
    timestamp: timing.timestamp,
    sizeBytes,
    transferSpeed:
      timing.durationMs > 0
        ? sizeBytes / timing.durationMs
        : undefined,
    contentType,
    viewMode: inferViewMode(contentType),
    requestId:
      res.headers["x-request-id"] ??
      res.headers["X-Request-Id"],
  };
}

function inferViewMode(ct: string): ResponseViewMode {
  const t = ct.toLowerCase();

  if (t.includes("application/json")) return "json";
  if (t.includes("application/xml") || t.includes("text/xml")) return "xml";
  if (t.includes("text/html")) return "html";
  if (t.startsWith("text/")) return "text";

  return "auto"; // media, binary, unknown
}

function parseSetCookie(
  headers: Record<string, string>
): CookieEntry[] {
  const raw = headers["set-cookie"] || headers["Set-Cookie"];
  if (!raw) return [];

  const cookies = Array.isArray(raw) ? raw : [raw];

  return cookies.map((c) => {
    const parts = c.split(";").map((p: string) => p.trim());
    const [name, value] = parts[0].split("=");

    const cookie: CookieEntry = {
      name,
      value,
      path: "/",
      secure: false,
      httpOnly: false,
      local: true,
    };

    for (const p of parts.slice(1)) {
      const [k, v] = p.split("=");
      switch (k.toLowerCase()) {
        case "path": cookie.path = v; break;
        case "domain": cookie.domain = v; break;
        case "secure": cookie.secure = true; break;
        case "httponly": cookie.httpOnly = true; break;
        case "samesite":
          cookie.sameSite = v as any;
          break;
        case "max-age":
          cookie.maxAge = Number(v);
          break;
        case "expires":
          cookie.expires = new Date(v).toISOString();
          break;
      }
    }

    return cookie;
  });
}

function safeStringify(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}
