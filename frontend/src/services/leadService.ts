/**
 * Lead Service
 * Handles all lead-related API calls
 */

import apiClient from "./api";
import type { Lead, CreateLeadData, UpdateLeadData } from "../types";

export const leadService = {
  /**
   * Get all leads
   */
  getAll: async (): Promise<Lead[]> => {
    try {
      const response = await apiClient.get<Lead[]>("/api/leads");
      return response.data.leads;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single lead by ID
   */
  getById: async (id: string): Promise<Lead> => {
    try {
      const response = await apiClient.get<Lead>(`/api/leads/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new lead
   */
  create: async (data: CreateLeadData): Promise<Lead> => {
    try {
      const response = await apiClient.post<Lead>("/api/leads", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a lead
   */
  update: async (id: string, data: UpdateLeadData): Promise<Lead> => {
    try {
      const response = await apiClient.put<Lead>(`/api/leads/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a lead
   */
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/leads/${id}`);
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Hide a lead (soft delete)
   */
  hide: async (id: string): Promise<Lead> => {
    try {
      const response = await apiClient.put<Lead>(`/api/leads/hide/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export leads to CSV
   */
  exportCsv: async (): Promise<Blob> => {
    try {
      const response = await apiClient.get("/api/leads/export/csv", {
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
