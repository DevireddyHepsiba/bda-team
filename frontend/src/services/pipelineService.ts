/**
 * Pipeline Service
 * Handles all pipeline-related API calls
 */

import apiClient from "./api";
import type { Pipeline, PipelineStats } from "../types";

export const pipelineService = {
  /**
   * Get pipeline overview
   */
  getOverview: async (): Promise<Pipeline[]> => {
    try {
      const response = await apiClient.get<any>("/api/pipeline");
      const pipeline = response.data.pipeline;
      return Object.values(pipeline).flat() as Pipeline[];
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get pipeline statistics
   */
  getStats: async (): Promise<PipelineStats> => {
    try {
      const response = await apiClient.get<PipelineStats>("/api/pipeline/stats");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update lead status in pipeline
   */
  updateLeadStatus: async (
    leadId: string,
    status: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.put(
        `/api/pipeline/${leadId}/status`,
        { status }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
