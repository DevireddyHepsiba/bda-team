import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { pipelineService } from "@/services";
import { Plus, MoreHorizontal, Loader, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Sales Pipeline — ForgeCRM" }] }),
  component: Pipeline,
});

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

const STATUS_ORDER = ["new", "contacted", "qualified", "negotiation", "won", "lost"];

const columnTone: Record<string, string> = {
  new: "border-t-info",
  contacted: "border-t-chart-3",
  qualified: "border-t-chart-2",
  negotiation: "border-t-warning",
  won: "border-t-success",
  lost: "border-t-destructive",
};

function Pipeline() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        setLoading(true);
        const data = await pipelineService.getOverview();
        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to load pipeline:", err);
        setError("Failed to load pipeline. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPipeline();
  }, []);

  const byStatus = (s: string) => items.filter((l) => l.status === s);
  const totalValue = items.filter((l) => l.status !== "lost").reduce((s: number, l: any) => s + (l.budget || 0), 0);
  const wonValue = items.filter((l) => l.status === "won").reduce((s: number, l: any) => s + (l.budget || 0), 0);
  const conv = items.length > 0 ? ((items.filter((l) => l.status === "won").length / items.length) * 100).toFixed(1) : "0";

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      await pipelineService.updateLeadStatus(leadId, newStatus);
      setItems((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
    } catch (err: any) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading pipeline...</p>
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag cards across stages to update status</p>
        </div>
        <div className="flex gap-3">
          <Stat label="Pipeline" value={`₹${(totalValue / 100000).toFixed(1)}L`} />
          <Stat label="Won (MTD)" value={`₹${(wonValue / 100000).toFixed(1)}L`} tone="success" />
          <Stat label="Conversion" value={`${conv}%`} tone="info" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATUS_ORDER.map((s) => {
          const list = byStatus(s);
          const val = list.reduce((a: number, l: any) => a + (l.budget || 0), 0);
          return (
            <div
              key={s}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) {
                  handleUpdateStatus(dragId, s);
                  setItems((prev) => prev.map((l) => l._id === dragId ? { ...l, status: s } : l));
                }
                setDragId(null);
              }}
              className={`rounded-xl bg-card border border-border border-t-4 ${columnTone[s]} p-3 min-h-[400px] flex flex-col`}
            >
              <div className="flex items-center justify-between px-1 pb-2">
                <div>
                  <div className="text-sm font-semibold">{STATUS_LABELS[s]}</div>
                  <div className="text-[11px] text-muted-foreground">{list.length} · ₹{(val / 100000).toFixed(1)}L</div>
                </div>
                <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-muted text-muted-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 flex-1">
                {list.map((l) => (
                  <article
                    key={l._id}
                    draggable
                    onDragStart={() => setDragId(l._id)}
                    onDragEnd={() => setDragId(null)}
                    className="group rounded-lg bg-background border border-border p-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-ring/40 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{l.clientName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{l.company}</p>
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{l.product}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-semibold text-foreground">₹{l.budget || 0}</span>
                      <span className="h-6 w-6 rounded-full bg-gradient-brand text-primary-foreground text-[10px] grid place-items-center font-semibold">
                        {l.assignedTo?.split(" ").map((p: string) => p[0]).slice(0, 2).join("") || "--"}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
                      Next: {l.nextFollowUp || "Not set"}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "info" }) {
  const t = tone === "success" ? "text-success" : tone === "info" ? "text-info" : "text-foreground";
  return (
    <div className="rounded-lg bg-card border border-border px-4 py-2.5 shadow-soft">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`text-base font-semibold ${t}`}>{value}</div>
    </div>
  );
}
