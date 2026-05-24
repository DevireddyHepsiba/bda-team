/**
 * Report Service
 * Handles all report export-related API calls
 */

import apiClient from "./api";

export const reportService = {
  /**
   * General export function (CSV)
   */
  exportCsv: async (reportType: string): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL || "http://localhost:5000"}/api/reports/${reportType}/csv`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * General export function (Excel)
   */
  exportExcel: async (reportType: string): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL || "http://localhost:5000"}/api/reports/${reportType}/excel`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * General export function (PDF)
   */
  exportPdf: async (reportType: string): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL || "http://localhost:5000"}/api/reports/${reportType}/pdf`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export leads as CSV
   */
  exportLeadsAsCSV: async (): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL}/api/reports/leads/csv`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export leads as PDF
   */
  exportLeadsAsPDF: async (): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL}/api/reports/leads/pdf`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export leads as Excel
   */
  exportLeadsAsExcel: async (): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL}/api/reports/leads/excel`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export revenue as PDF
   */
  exportRevenueAsPDF: async (): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL}/api/reports/revenue/pdf`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export followups as CSV
   */
  exportFollowupsAsCSV: async (): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL}/api/reports/followups/csv`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export revenue as CSV
   */
  exportRevenueAsCSV: async (): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL}/api/reports/revenue/csv`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export employee report as CSV
   */
  exportEmployeeAsCSV: async (): Promise<void> => {
    try {
      window.open(`${apiClient.defaults.baseURL}/api/reports/employee/csv`, "_blank");
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
