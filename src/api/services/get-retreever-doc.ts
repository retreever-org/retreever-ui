import type { RetreeverDoc } from "../../types/response.types";
import { apiClient } from "../axios/axios-instance";

export const getRetreeverDoc = async (): Promise<RetreeverDoc> => {
  try {
    const response = await apiClient.get<RetreeverDoc>("/retreever/doc");

    if (response.status === 200) {
      return response.data;
    }

    throw new Error(
      `Failed to fetch RetreeverDoc | status: ${response.status}`
    );
  } catch (error) {
    throw new Error(
      `RetreeverDoc request failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};