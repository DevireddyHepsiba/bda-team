/**
 * Analytics Service
 * Handles all analytics-related API calls
 */

import apiClient from "./api";
import type {
  RevenueTrendData,
  EmployeeRevenueData,
  LeadTrendData,
  ConversionFunnelData,
  DashboardSummary,
} from "../types";

export const analyticsService = {
  /**
   * Get revenue trend data for line chart
   */
getRevenueTrend: async () => {
   const response =
   await apiClient.get("/api/analytics/revenue-trend");

   return response.data.revenueTrend;
},

  /**
   * Get employee revenue data for bar chart
   */
 getEmployeeRevenue: async () => {
   const response =
   await apiClient.get("/api/analytics/employee-revenue");

   return response.data.employeeRevenue;
},

  /**
   * Get lead trend data for bar chart
   */
  getLeadTrend: async () => {
   const response =
   await apiClient.get("/api/analytics/lead-trend");

   return response.data.leadTrend;
},

  /**
   * Get conversion funnel data
   */
  getConversionFunnel: async () => {
    const response = await apiClient.get("/api/analytics/conversion-funnel");
    // Map backend { stage, count } to Recharts { name, value }
    return response.data.funnel?.map((item: any) => ({
      name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1),
      value: item.count || 0
    })) || [];
  },

  /**
   * Get dashboard summary
   */
  getDashboardSummary: async () => {
    const response = await apiClient.get("/api/analytics/summary");
    return response.data.summary || response.data;
  }
};
