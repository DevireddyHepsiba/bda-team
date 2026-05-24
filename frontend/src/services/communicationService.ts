/**
 * Communication Service
 * Handles all communication-related API calls
 */

import apiClient from "./api";
import type { Communication, CreateCommunicationData, CommunicationStats } from "../types";

export const communicationService = {
  /**
   * Get all communications
   */
  getAll: async (page = 1, limit = 5, search?: string, type?: string) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (type) params.append("type", type);

      const response = await apiClient.get<any>(
        `/api/communications?${params.toString()}`
      );
      // Return the whole response which likely contains { communications, totalPages, currentPage, etc. }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single communication by ID
   */
  getById: async (id: string): Promise<Communication> => {
    try {
      const response = await apiClient.get<Communication>(
        `/api/communications/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new communication
   */
  create: async (data: CreateCommunicationData): Promise<Communication> => {
    try {
      const response = await apiClient.post<Communication>(
        "/api/communications",
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get communication statistics
   */
  getStats: async (): Promise<any> => {
    try {
      const response = await apiClient.get<any>(
        "/api/communications/stats"
      );
      return response.data.stats || response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Search communications
   */
  search: async (query: string): Promise<Communication[]> => {
    try {
      const response = await apiClient.get<Communication[]>(
        `/api/communications?search=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Filter communications by type
   */
  filterByType: async (type: string): Promise<Communication[]> => {
    try {
      const response = await apiClient.get<Communication[]>(
        `/api/communications?type=${type}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
