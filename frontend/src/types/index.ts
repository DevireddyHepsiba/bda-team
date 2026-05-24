/**
 * TypeScript Types and Interfaces
 * All types used across the application
 */

// ============ AUTH TYPES ============
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  fullName: string;
  phone: string;
  confirmPassword: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
}

// ============ LEAD TYPES ============
export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  value: number;
  probability: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status?: string;
  value?: number;
  probability?: number;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {}

// ============ PIPELINE TYPES ============
export interface PipelineStage {
  stage: string;
  count: number;
  value: number;
}

export interface Pipeline {
  stages: PipelineStage[];
  total: number;
  totalValue: number;
}

export interface PipelineStats {
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  won: number;
  lost: number;
  totalValue: number;
}

// ============ FOLLOWUP TYPES ============
export interface Followup {
  _id: string;
  leadId: string;
  leadName: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "done";
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFollowupData {
  leadId: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category?: string;
}

export interface CategorizedFollowups {
  [category: string]: Followup[];
}

// ============ COMMUNICATION TYPES ============
export interface Communication {
  _id: string;
  leadId: string;
  leadName: string;
  type: "call" | "email" | "meeting" | "note";
  content: string;
  date: string;
  duration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunicationData {
  leadId: string;
  type: "call" | "email" | "meeting" | "note";
  content: string;
  date: string;
  duration?: number;
  notes?: string;
}

export interface CommunicationStats {
  totalCalls: number;
  totalEmails: number;
  totalMeetings: number;
  averageCallDuration: number;
}

// ============ ANALYTICS TYPES ============
export interface RevenueTrendData {
  date: string;
  revenue: number;
}

export interface EmployeeRevenueData {
  employee: string;
  revenue: number;
  deals: number;
}

export interface LeadTrendData {
  date: string;
  leads: number;
}

export interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  totalLeads: number;
  totalRevenue: number;
  conversionRate: number;
  averageDealSize: number;
  newLeadsThisMonth: number;
  dealsWonThisMonth: number;
}

// ============ PERFORMANCE TYPES ============
export interface PerformanceSummary {
  totalRevenue: number;
  totalDeals: number;
  conversionRate: number;
  averageDealSize: number;
  topPerformer: string;
}

export interface PerformanceRanking {
  rank: number;
  employee: string;
  revenue: number;
  deals: number;
  conversionRate: number;
}

export interface TopPerformer {
  employee: string;
  revenue: number;
  deals: number;
}

export interface EmployeePerformance {
  employee: string;
  totalRevenue: number;
  totalDeals: number;
  conversionRate: number;
  dealsThisMonth: number;
  revenueThisMonth: number;
}

// ============ REPORT TYPES ============
export interface ReportExport {
  filename: string;
  url: string;
}

// ============ SETTINGS TYPES ============
export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  department?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
}

export interface UserSettings {
  theme: "light" | "dark";
  language: string;
  notifications: NotificationSettings;
}

// ============ API ERROR RESPONSE ============
export interface ApiError {
  message: string;
  status: number;
  data?: any;
}
