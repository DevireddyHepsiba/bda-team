# Frontend API Integration Guide

This frontend is fully connected to your backend CRM API. Here's how to use the API services in your components.

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root of your project:

```env
VITE_API_URL=http://localhost:5000
```

For production, update to your production URL:

```env
VITE_API_URL=https://api.yourdomain.com
```

### 2. Using API Services

All API services are organized by module in `src/services/`:

```typescript
import { authService, leadService, analyticsService } from "@/services";

// Login
const response = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Get all leads
const leads = await leadService.getAll();

// Get analytics data
const revenue = await analyticsService.getRevenueTrend();
```

## API Services Reference

### Authentication (`authService`)

```typescript
// Register
await authService.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "sales",
});

// Login
await authService.login({
  email: "john@example.com",
  password: "password123",
});

// Logout
authService.logout();
```

### Leads (`leadService`)

```typescript
// Get all leads
const leads = await leadService.getAll();

// Get single lead
const lead = await leadService.getById("leadId");

// Create lead
await leadService.create({
  name: "New Lead",
  email: "lead@example.com",
  phone: "123-456-7890",
  company: "Acme Corp",
  status: "new",
  value: 50000,
  probability: 30,
});

// Update lead
await leadService.update("leadId", {
  status: "contacted",
  probability: 50,
});

// Delete lead
await leadService.delete("leadId");

// Hide lead (soft delete)
await leadService.hide("leadId");

// Export leads as CSV
await leadService.exportCsv();
```

### Pipeline (`pipelineService`)

```typescript
// Get pipeline overview
const pipeline = await pipelineService.getOverview();

// Get pipeline stats
const stats = await pipelineService.getStats();

// Update lead status in pipeline
await pipelineService.updateLeadStatus("leadId", "won");
```

### Followups (`followupService`)

```typescript
// Get all followups
const followups = await followupService.getAll();

// Get categorized followups
const categorized = await followupService.getCategorized();

// Create followup
await followupService.create({
  leadId: "leadId",
  description: "Follow up on proposal",
  dueDate: "2024-06-30",
  priority: "high",
  category: "proposal",
});

// Mark followup as done
await followupService.markDone("followupId");

// Delete followup
await followupService.delete("followupId");
```

### Communications (`communicationService`)

```typescript
// Get all communications
const communications = await communicationService.getAll();

// Search communications
const results = await communicationService.search("John");

// Filter by type
const calls = await communicationService.filterByType("call");

// Create communication
await communicationService.create({
  leadId: "leadId",
  type: "call",
  content: "Discussion about pricing",
  date: "2024-06-15",
  duration: 30,
});

// Get communication stats
const stats = await communicationService.getStats();
```

### Analytics (`analyticsService`)

```typescript
// Revenue trend (line chart)
const revenue = await analyticsService.getRevenueTrend();

// Employee revenue (bar chart)
const employeeRevenue = await analyticsService.getEmployeeRevenue();

// Lead trend
const leadTrend = await analyticsService.getLeadTrend();

// Conversion funnel
const funnel = await analyticsService.getConversionFunnel();

// Dashboard summary
const summary = await analyticsService.getDashboardSummary();
```

### Performance (`performanceService`)

```typescript
// Performance summary
const summary = await performanceService.getSummary();

// Employee ranking
const ranking = await performanceService.getRanking();

// Top performers
const topPerformers = await performanceService.getTopPerformers();

// Single employee performance
const employee = await performanceService.getEmployeePerformance("John Doe");
```

### Reports (`reportService`)

```typescript
// Export leads
await reportService.exportLeadsAsCSV();
await reportService.exportLeadsAsPDF();
await reportService.exportLeadsAsExcel();

// Export revenue
await reportService.exportRevenueAsCSV();
await reportService.exportRevenueAsPDF();

// Export followups
await reportService.exportFollowupsAsCSV();

// Export employee report
await reportService.exportEmployeeAsCSV();
```

### Settings (`settingsService`)

```typescript
// Get user profile
const profile = await settingsService.getProfile();

// Update profile
await settingsService.updateProfile({
  name: "John Doe",
  phone: "123-456-7890",
  department: "Sales",
});

// Change password
await settingsService.changePassword({
  currentPassword: "oldPassword123",
  newPassword: "newPassword456",
  confirmPassword: "newPassword456",
});

// Update notifications
await settingsService.updateNotifications({
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  dailyDigest: true,
  weeklyReport: true,
});

// Update theme
await settingsService.updateTheme("dark");
```

## Using with React Components

### Example: Login Page

```typescript
import { useState } from "react";
import { authService } from "@/services";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      console.log("Login successful:", response);
      // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
```

### Example: Leads List

```typescript
import { useState, useEffect } from "react";
import { leadService } from "@/services";
import type { Lead } from "@/types";

export function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getAll();
        setLeads(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id}>
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.status}</td>
            <td>${lead.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Authentication

The API client automatically handles authentication tokens:

1. **Token Storage**: Tokens are stored in localStorage after login
2. **Auto Headers**: The token is automatically added to all requests via interceptors
3. **Token Refresh**: If a 401 error occurs, the user is redirected to login
4. **Token Removal**: Calling `authService.logout()` removes the token

## Error Handling

All API services throw errors that you can catch:

```typescript
try {
  await authService.login({ email, password });
} catch (error: any) {
  console.error("Login error:", error.message);
  // error.message contains the error message from the backend
}
```

## TypeScript Support

All services are fully typed with TypeScript. Import types from `@/types`:

```typescript
import type {
  Lead,
  Followup,
  Communication,
  AnalyticsData,
  PerformanceData,
} from "@/types";
```

## CORS Configuration

Your backend has CORS enabled, so cross-origin requests are allowed. No additional configuration is needed.

## Need Help?

- Check the service file corresponding to what you're trying to do
- All functions have JSDoc comments explaining what they do
- Review the types in `src/types/index.ts` for data structures
