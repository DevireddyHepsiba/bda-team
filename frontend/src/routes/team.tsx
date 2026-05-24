import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { performanceService } from "@/services";
import { Trophy, TrendingUp, Phone, Users, IndianRupee, Loader, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team Performance — ForgeCRM" }] }),
  component: Team,
});

function Team() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        const data = await performanceService.getRanking();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to load team performance:", err);
        setError("Failed to load team performance. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  const sorted = [...employees].sort((a, b) => (b.score || 0) - (a.score || 0));
  const totals = employees.reduce((a, e) => ({
    leads: a.leads + (e.leads || 0),
    converted: a.converted + (e.converted || 0),
    revenue: a.revenue + (e.revenue || 0),
  }), { leads: 0, converted: 0, revenue: 0 });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading team performance...</p>
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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Team Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">Ranking, KPIs and revenue contribution</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric icon={Users} label="Leads Assigned" value={totals.leads.toString()} tone="info" />
        <Metric icon={TrendingUp} label="Leads Converted" value={totals.converted.toString()} tone="success" />
        <Metric icon={IndianRupee} label="Revenue Generated" value={`₹${(totals.revenue / 100000).toFixed(1)}L`} tone="warning" />
        <Metric icon={Phone} label="Calls Made (MTD)" value="—" tone="chart-2" />
      </div>

      <div className="rounded-xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Trophy className="h-4 w-4 text-warning" />
          <h3 className="font-semibold">Employee Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Employee</th>
                <th className="text-right px-4 py-3 font-medium">Leads</th>
                <th className="text-right px-4 py-3 font-medium">Converted</th>
                <th className="text-right px-4 py-3 font-medium">Conv %</th>
                <th className="text-right px-4 py-3 font-medium">Revenue</th>
                <th className="text-left px-4 py-3 font-medium w-48">Score</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length > 0 ? (
                sorted.map((e, i) => {
                  const conv = e.leads > 0 ? ((e.converted / e.leads) * 100).toFixed(1) : "0";
                  return (
                    <tr key={e._id || e.name} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className={`inline-grid place-items-center h-7 w-7 rounded-full text-xs font-semibold ${
                          i === 0 ? "bg-warning text-warning-foreground" :
                          i === 1 ? "bg-muted text-foreground" :
                          i === 2 ? "bg-chart-3/30 text-chart-3" : "bg-muted text-muted-foreground"
                        }`}>{i + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-full bg-gradient-brand text-primary-foreground text-xs grid place-items-center font-semibold">
                            {(e.name || e.fullName || "").split(" ").map((p: string) => p[0]).slice(0, 2).join("")}
                          </span>
                          <div>
                            <div className="font-medium">{e.name || e.fullName}</div>
                            <div className="text-[11px] text-muted-foreground">{e.role || e.designation || "Employee"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{e.leads || 0}</td>
                      <td className="px-4 py-3 text-right">{e.converted || 0}</td>
                      <td className="px-4 py-3 text-right font-medium">{conv}%</td>
                      <td className="px-4 py-3 text-right font-medium">₹{(e.revenue || 0) / 100000}L</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-gradient-success" style={{ width: `${Math.min(e.score || 0, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold w-8 text-right">{e.score || 0}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No employee data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Trophy; label: string; value: string; tone: string }) {
  const toneMap: Record<string, string> = {
    info: "bg-info/10 text-info", success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning", "chart-2": "bg-chart-2/15 text-chart-2",
  };
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-soft">
      <div className={`h-10 w-10 rounded-lg grid place-items-center ${toneMap[tone]}`}><Icon className="h-5 w-5" /></div>
      <div className="mt-4 text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
