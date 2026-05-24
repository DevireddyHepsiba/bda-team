/**
 * Axios Instance
 * Base configuration for all API requests with retry logic
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { API_CONFIG, getAuthToken } from "../config/api";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track retry count
let retryCount = 0;

/**
 * Request Interceptor: Add authorization token and retry logic
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add request timeout for better error handling
    config.timeout = API_CONFIG.TIMEOUT;
    return config;
  },
  (error: AxiosError) => {
    console.error("Request configuration error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Handle errors with retry logic
 */
apiClient.interceptors.response.use(
  (response) => {
    retryCount = 0; // Reset on success
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { retryCount?: number };

    // Initialize retry count
    if (!config.retryCount) {
      config.retryCount = 0;
    }

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Retry logic for network errors and retryable status codes
    const isNetworkError = !error.response;
    const isRetryableStatus =
      error.response &&
      RETRYABLE_STATUSES.includes(error.response.status);

    if (
      (isNetworkError || isRetryableStatus) &&
      config.retryCount! < MAX_RETRIES
    ) {
      config.retryCount!++;
      const delayMs = RETRY_DELAY * config.retryCount!;

      console.warn(
        `API Request failed (${error.message}). Retrying in ${delayMs}ms... (Attempt ${config.retryCount!}/${MAX_RETRIES})`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));

      return apiClient(config);
    }

    // Log error details for debugging
    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error";

    console.error("API Error:", {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
      retries: config.retryCount,
    });

    // Return structured error
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status || 0,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default apiClient;

