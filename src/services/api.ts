import axios, { AxiosError, type AxiosInstance } from "axios";

export const BASE_URL = "https://monish.free.beeceptor.com";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ---- Request / response logging -----------------------------------------
api.interceptors.request.use((config) => {
  // eslint-disable-next-line no-console
  console.info(`[API →] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? "");
  return config;
});

api.interceptors.response.use(
  (res) => {
    // eslint-disable-next-line no-console
    console.info(`[API ←] ${res.status} ${res.config.method?.toUpperCase()} ${res.config.url}`);
    return res;
  },
  (err: AxiosError) => {
    // eslint-disable-next-line no-console
    console.warn(
      `[API ✕] ${err.response?.status ?? "NETWORK"} ${err.config?.method?.toUpperCase()} ${err.config?.url}`,
      err.message,
    );
    return Promise.reject(err);
  },
);

/** Normalize Axios errors into a readable message for toasts / UI. */
export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    if (err.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (!err.response) return "Network error — check your connection.";
    return `Server error (${err.response.status})`;
  }
  return fallback;
}
