import type { AxiosRequestConfig } from "axios";
import { buildBinaryBody, buildFormDataBody, buildHeaders, buildRawBody, buildUrl, buildUrlEncodedBody, resolveEnvVars } from "./request-builder-helper";
import type { ResolvedVariable } from "../types/env.types";
import type { TabDoc } from "../types/editor.types";

export async function buildAxiosRequestFromTabDoc(
  tab: TabDoc,
  vars: ResolvedVariable[]
): Promise<AxiosRequestConfig> {
  const { uiRequest } = tab;

  const url = buildUrl(
    resolveEnvVars(uiRequest.url, vars),
    uiRequest.queryParams,
    vars
  );

  const headers = buildHeaders(uiRequest.headers, vars);

  let data: any = undefined;

  switch (uiRequest.bodyType) {
    case "raw":
      data = buildRawBody(uiRequest.body.raw, vars);
      break;

    case "x-www-form-urlencoded":
      data = buildUrlEncodedBody(uiRequest.body.urlEncoded, vars);
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      break;

    case "form-data":
      data = await buildFormDataBody(uiRequest.body.formData, vars);
      // Axios will set boundary automatically
      break;

    case "binary":
      data = await buildBinaryBody(uiRequest.body.binaryFileId);
      break;

    case "none":
    default:
      break;
  }

  return {
    method: tab.method,
    url,
    headers,
    data,
    responseType: "text", // IMPORTANT: normalize layer decides later
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: false,
    },
  };
}
