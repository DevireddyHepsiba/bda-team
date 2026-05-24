/**
 * Authentication Service
 * Handles all auth-related API calls with improved error handling
 */

import apiClient from "./api";
import { setAuthToken, removeAuthToken } from "../config/api";
import type { AuthCredentials, RegisterData, AuthResponse } from "../types";

/**
 * Parse API error response
 */
const handleError = (error: any): never => {
  // Handle our custom error format
  if (error.message) {
    throw new Error(error.message);
  }

  // Handle axios error
  if (error.originalError?.response?.data?.message) {
    throw new Error(error.originalError.response.data.message);
  }

  // Fallback
  throw new Error(error?.message || "An error occurred");
};

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/register",
        data
      );

      if (response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: any) {
      handleError(error);
    }
  },

  /**
   * Login user
   */
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/login",
        credentials
      );

      if (response.data.token) {
        setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: any) {
      handleError(error);
    }
  },

  /**
   * Logout user
   */
  logout: (): void => {
    removeAuthToken();
  },
};
