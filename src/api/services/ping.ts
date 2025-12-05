import type { PingResponse } from "../../types/response.types";
import { apiClient } from "../axios/axios-instance";



export const ping = async (): Promise<PingResponse> => {
  try {
    const response = await apiClient.get<PingResponse>("/retreever/ping");

    if (response.status === 200) {
      return response.data;
    }

    // non-200 status codes
    throw new Error(`Ping failed | status: ${response.status}`);
  } catch (error) {
    throw new Error(
      `Ping request failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};