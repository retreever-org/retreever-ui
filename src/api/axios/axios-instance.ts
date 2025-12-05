import axios, { type AxiosInstance } from "axios";

const getBaseURL = (): string => {

  // Priority 1: .env VITE_BASE_URL
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }

  // Priority 2: Current window location origin (Spring Boot embedded)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Fallback for SSR/server-side
  return "http://localhost:8080";
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});
