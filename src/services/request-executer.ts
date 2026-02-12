import { type AxiosRequestConfig } from "axios";
import type { RawHttpResponse, ResponseTiming, TabDoc } from "../types/editor.types";
import { useEnvVarsStore } from "../stores/env-vars-store";
import { buildAxiosRequestFromTabDoc } from "./request-builder";
import { normalizeHttpResponse } from "./normalize-http-response";
import { useViewingDocStore } from "../stores/viewing-doc-store";
import { formatDuration, normalizeAxiosHeaders } from "./request-builder-helper";
import { apiClient } from "../api/axios/axios-instance";
import { defaultStatusText } from "../util/status-text";

export async function executeHttpRequest(
  config: AxiosRequestConfig
): Promise<{ res: RawHttpResponse; timing: ResponseTiming }> {
  const start = performance.now();

  try {
    const response = await apiClient.request(config);

    const durationMs = performance.now() - start;
    const trimmedDuration = formatDuration(durationMs);

    return {
      res: {
        status: response.status,
        statusText: defaultStatusText(response.status),
        headers: normalizeAxiosHeaders(response.headers),
        data: response.data,
        request: response.request,
      },
      timing: {
        durationMs: trimmedDuration,
        timestamp: Date.now(),
      },
    };

  } catch (error: any) {
    const durationMs = performance.now() - start;
    const trimmedDuration = formatDuration(durationMs);

    // Axios error with response (4xx/5xx usually handled by interceptor)
    if (error.response) {
      return {
        res: {
          status: error.response.status,
          statusText: defaultStatusText(error.response.status),
          headers: normalizeAxiosHeaders(error.response.headers),
          data: error.response.data,
          request: error.response.request,
        },
        timing: {
          durationMs: trimmedDuration,
          timestamp: Date.now(),
        },
      };
    }

    // Pure network failure
    return {
      res: {
        status: 0,
        statusText: "NETWORK_ERROR",
        headers: {},
        data: error.message ?? "Unknown network error",
      },
      timing: {
        durationMs,
        timestamp: Date.now(),
      },
    };
  }
}


export async function runTabRequest(tab: TabDoc) {
  const vars = useEnvVarsStore.getState().vars;

  const axiosConfig = await buildAxiosRequestFromTabDoc(tab, vars);

  const { res, timing } = await executeHttpRequest(axiosConfig);

  const lastResponse = normalizeHttpResponse(res, timing);

  useViewingDocStore.getState().setLastResponse(lastResponse);
}
