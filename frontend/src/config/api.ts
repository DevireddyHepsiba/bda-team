/**
 * API Configuration
 * Centralized configuration for all API calls
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Validate API URL
if (!API_BASE_URL) {
  console.warn(
    "⚠ VITE_API_URL is not set. Defaulting to http://localhost:5000"
  );
}

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 15000, // 15 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * Get the authorization token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

/**
 * Set the authorization token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

/**
 * Remove the authorization token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

