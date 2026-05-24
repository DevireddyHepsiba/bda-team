/**
 * Settings Service
 * Handles all user settings and profile-related API calls
 */

import apiClient from "./api";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  NotificationSettings,
  UserSettings,
} from "../types";

export const settingsService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>("/api/settings/profile");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    try {
      const response = await apiClient.put<UserProfile>(
        "/api/settings/profile",
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    try {
      const response = await apiClient.put<{ message: string }>(
        "/api/settings/password",
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update notification settings
   */
  updateNotifications: async (
    settings: NotificationSettings
  ): Promise<{ message: string }> => {
    try {
      const response = await apiClient.put<{ message: string }>(
        "/api/settings/notifications",
        settings
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update theme preference
   */
  updateTheme: async (theme: "light" | "dark"): Promise<{ message: string }> => {
    try {
      const response = await apiClient.put<{ message: string }>(
        "/api/settings/theme",
        { theme }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
