/**
 * Performance Service
 * Handles all performance-related API calls
 */

import apiClient from "./api";
import type {
  PerformanceSummary,
  PerformanceRanking,
  TopPerformer,
  EmployeePerformance,
} from "../types";

export const performanceService = {
  /**
   * Get performance summary cards
   */
  getSummary: async (): Promise<PerformanceSummary> => {
    try {
      const response = await apiClient.get<PerformanceSummary>(
        "/api/performance/summary"
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get employee ranking table
   */
  getRanking: async (): Promise<PerformanceRanking[]> => {
    try {
      const response = await apiClient.get<any>(
        "/api/performance/ranking"
      );
      return response.data.employees;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get top performers
   */
  getTopPerformers: async (): Promise<TopPerformer[]> => {
    try {
      const response = await apiClient.get<TopPerformer[]>(
        "/api/performance/top"
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get single employee performance
   */
  getEmployeePerformance: async (employee: string): Promise<EmployeePerformance> => {
    try {
      const response = await apiClient.get<EmployeePerformance>(
        `/api/performance/${encodeURIComponent(employee)}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
