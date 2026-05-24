import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { analyticsService, performanceService } from "@/services";
import { Loader, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — ForgeCRM" }] }),
  component: Analytics,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--warning)"];

function Analytics() {
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [leadTrend, setLeadTrend] = useState<any[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<any[]>([]);
  const [employeeRevenue, setEmployeeRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [revenue, leads, funnel, empRevenue] = await Promise.all([
          analyticsService.getRevenueTrend().catch(() => []),
          analyticsService.getLeadTrend().catch(() => []),
          analyticsService.getConversionFunnel().catch(() => []),
          analyticsService.getEmployeeRevenue().catch(() => []),
        ]);

        setRevenueTrend(Array.isArray(revenue) ? revenue : []);
        setLeadTrend(Array.isArray(leads) ? leads : []);
        setConversionFunnel(Array.isArray(funnel) ? funnel : []);
        setEmployeeRevenue(Array.isArray(empRevenue) ? empRevenue : []);
      } catch (err: any) {
        console.error("Failed to load analytics:", err);
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
        <AlertCircle className="h-4 w-4 inline mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep-dive metrics across your sales funnel</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Monthly Revenue Trend">
          {Array.isArray(revenueTrend) && revenueTrend.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </Card>
        <Card title="Revenue by Employee">
          {Array.isArray(employeeRevenue) && employeeRevenue.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={employeeRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={11} width={110} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </Card>
        <Card title="Lead Volume Trend">
          {Array.isArray(leadTrend) && leadTrend.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={leadTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="leads" name="New Leads" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </Card>
        <Card title="Conversion Funnel">
          {Array.isArray(conversionFunnel) && conversionFunnel.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={conversionFunnel}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conversionFunnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-soft">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="h-72">{children}</div>
    </div>
  );
}
