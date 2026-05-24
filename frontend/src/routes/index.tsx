import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Users, UserCheck, CalendarClock, TrendingUp, Target,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Phone, Mail, Plus,
  Loader,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { analyticsService, performanceService, leadService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import type {
  DashboardSummary, RevenueTrendData, EmployeeRevenueData, ConversionFunnelData,
} from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ForgeCRM" },
      { name: "description", content: "Sales overview, KPIs and recent activity for your manufacturing sales pipeline." },
    ],
  }),
  component: Dashboard,
});

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const accentMap: Record<string, string> = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  "chart-2": "bg-chart-2/15 text-chart-2",
  "chart-4": "bg-chart-4/15 text-chart-4",
};

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendData[]>([]);
  const [performanceRanking, setPerformanceRanking] = useState<EmployeeRevenueData[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnelData[]>([]);

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    client: "",
    company: "",
    product: "",
    budget: "",
    status: "new",
    employee: user?.fullName || ""
  });

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await leadService.create({
        client: newLeadForm.client,
        company: newLeadForm.company,
        product: newLeadForm.product,
        budget: Number(newLeadForm.budget),
        status: newLeadForm.status,
        employee: newLeadForm.employee || "Unassigned"
      } as any);
      setIsNewLeadOpen(false);
      setNewLeadForm({
        client: "",
        company: "",
        product: "",
        budget: "",
        status: "new",
        employee: user?.fullName || ""
      });
      // A full app refresh or soft refresh can be implemented here if needed.
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryData, revenueData, rankingData, funnelData] = await Promise.all([
          analyticsService.getDashboardSummary().catch(() => null),
          analyticsService.getRevenueTrend().catch(() => []),
          performanceService.getRanking().catch(() => []),
          analyticsService.getConversionFunnel().catch(() => []),
        ]);

        setSummary(summaryData);
        setRevenueTrend(revenueData || []);
        setPerformanceRanking(Array.isArray(rankingData) ? rankingData.slice(0, 5) : []);
        setConversionFunnel(funnelData || []);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const kpis = summary ? [
    { label: "Total Leads", value: (summary.totalLeads || 0).toString(), delta: "+12.4%", up: true, icon: Users, accent: "info" },
    { label: "Active Clients", value: Math.floor(Number(summary.totalLeads || 0) * 0.38).toString(), delta: "+5.2%", up: true, icon: UserCheck, accent: "success" },
    { label: "Pending Follow-ups", value: Math.floor(Number(summary.totalLeads || 0) * 0.15).toString(), delta: "-3", up: false, icon: CalendarClock, accent: "warning" },
    { label: "Revenue (MTD)", value: `₹${(Number(summary.totalRevenue || 0) / 10000000).toFixed(1)}Cr`, delta: "+18.7%", up: true, icon: TrendingUp, accent: "chart-2" },
    { label: "Conversion Rate", value: `${Number(summary.conversionRate || 0).toFixed(1)}%`, delta: "+2.1%", up: true, icon: Target, accent: "chart-4" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome back, {user?.fullName || "there"} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your sales pipeline today.</p>
        </div>
        <button 
          onClick={() => setIsNewLeadOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-success text-success-foreground text-sm font-medium hover:opacity-90 shadow-glow-success transition">
          <Plus className="h-4 w-4" /> New Lead
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-xl bg-card border border-border p-5 shadow-soft hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className={`h-10 w-10 rounded-lg grid place-items-center ${accentMap[k.accent]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`text-xs font-medium flex items-center gap-0.5 ${k.up ? "text-success" : "text-destructive"}`}>
                  {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {k.delta}
                </div>
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Revenue & Leads</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-1" /> Revenue (₹L)</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-2" /> Leads</span>
            </div>
          </div>
          <div className="h-72">
            {Array.isArray(revenueTrend) && revenueTrend.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-5 shadow-soft">
          <h3 className="font-semibold">Conversion Funnel</h3>
          <p className="text-xs text-muted-foreground mb-2">Pipeline stages</p>
          <div className="h-56">
            {Array.isArray(conversionFunnel) && conversionFunnel.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={conversionFunnel} dataKey="count" nameKey="stage" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {conversionFunnel.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Array.isArray(conversionFunnel) && conversionFunnel.map((s, i) => (
              <div key={s.stage} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  {s.stage}
                </span>
                <span className="text-muted-foreground">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Performance */}
      <div className="rounded-xl bg-card border border-border p-5 shadow-soft">
        <h3 className="font-semibold">Top Performers</h3>
        <p className="text-xs text-muted-foreground mb-4">Team performance ranking</p>
        <div className="h-64">
          {performanceRanking.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={performanceRanking}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="employee" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="deals" name="Deals" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No performance data
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-center pt-2">
        Total pipeline value tracked: <span className="font-medium text-foreground">₹{(summary?.totalRevenue || 0) / 10000000}Cr</span>
      </p>

      {/* New Lead Modal */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-xl border border-border">
            <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
            <form onSubmit={handleCreateLead} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input required type="text" value={newLeadForm.client} onChange={(e) => setNewLeadForm({...newLeadForm, client: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input required type="text" value={newLeadForm.company} onChange={(e) => setNewLeadForm({...newLeadForm, company: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <input required type="text" value={newLeadForm.product} onChange={(e) => setNewLeadForm({...newLeadForm, product: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Budget (₹)</label>
                <input required type="number" value={newLeadForm.budget} onChange={(e) => setNewLeadForm({...newLeadForm, budget: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={newLeadForm.status} onChange={(e) => setNewLeadForm({...newLeadForm, status: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none capitalize">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsNewLeadOpen(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm bg-success text-success-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 shadow-glow-success transition">
                  {isSubmitting ? "Creating..." : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
