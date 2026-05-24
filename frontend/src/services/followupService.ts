/**
 * Followup Service
 * Handles all followup-related API calls
 */

import apiClient from "./api";
import type { Followup, CreateFollowupData, CategorizedFollowups } from "../types";

export const followupService = {
  /**
   * Get all followups
   */
  getAll: async (): Promise<Followup[]> => {
    try {
      const response = await apiClient.get<any>("/api/followups");
      return response.data.followups;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get followups categorized by category/status
   */
  getCategorized: async (): Promise<CategorizedFollowups> => {
    try {
      const response = await apiClient.get<CategorizedFollowups>(
        "/api/followups/categorized"
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new followup
   */
  create: async (data: CreateFollowupData): Promise<Followup> => {
    try {
      const response = await apiClient.post<Followup>("/api/followups", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Mark a followup as done
   */
  markDone: async (id: string): Promise<Followup> => {
    try {
      const response = await apiClient.put<Followup>(
        `/api/followups/${id}/done`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a followup
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/followups/${id}`);
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
