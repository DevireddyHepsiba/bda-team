import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { communicationService } from "@/services";
import { Phone, Mail, Users, MessageCircle, Plus, Loader, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/communications")({
  head: () => ({ meta: [{ title: "Communications — ForgeCRM" }] }),
  component: Communications,
});

const icons: Record<string, typeof Phone> = { call: Phone, email: Mail, meeting: Users, whatsapp: MessageCircle };
const tones: Record<string, string> = {
  call: "bg-info/10 text-info",
  email: "bg-chart-2/15 text-chart-2",
  meeting: "bg-warning/15 text-warning",
  whatsapp: "bg-success/10 text-success",
};

function Communications() {
  const [communications, setCommunications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLogForm, setNewLogForm] = useState({
    client: "",
    company: "",
    type: "Call",
    note: "",
    outcome: "",
    employee: "",
    status: "Interested"
  });

  const fetchData = async (currentPage = 1) => {
    try {
      setLoading(true);
      const data = await communicationService.getAll(currentPage, 5);
      setCommunications(data.communications || []);
      setTotalPages(data.totalPages || 1);
      
      const statsData = await communicationService.getStats();
      setStats(statsData);
    } catch (err: any) {
      console.error("Failed to load communications:", err);
      setError("Failed to load communications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await communicationService.create(newLogForm as any);
      setIsLogOpen(false);
      setNewLogForm({
        client: "",
        company: "",
        type: "Call",
        note: "",
        outcome: "",
        employee: "",
        status: "Interested"
      });
      setPage(1);
      fetchData(1);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to log communication");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading communications...</p>
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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Communications</h1>
          <p className="text-sm text-muted-foreground mt-1">All client touchpoints in one timeline</p>
        </div>
        <button onClick={() => setIsLogOpen(true)} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-success text-success-foreground text-sm font-medium shadow-glow-success">
          <Plus className="h-4 w-4" /> Log Communication
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Calls</p>
            <p className="text-2xl font-bold text-info">{stats.calls}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Emails</p>
            <p className="text-2xl font-bold text-chart-2">{stats.emails}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Meetings</p>
            <p className="text-2xl font-bold text-warning">{stats.meetings}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">WhatsApp</p>
            <p className="text-2xl font-bold text-success">{stats.whatsapp}</p>
          </div>
        </div>
      )}

      {communications.length > 0 ? (
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
            <ol className="space-y-6">
              {communications.map((c) => {
                const Icon = icons[c.type?.toLowerCase()] ?? Phone;
                return (
                  <li key={c._id} className="relative">
                    <div className={`absolute -left-[22px] top-1 h-8 w-8 rounded-full grid place-items-center ring-4 ring-card ${tones[c.type?.toLowerCase()] || 'bg-muted/10 text-muted-foreground'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg border border-border p-4 hover:border-ring/40 transition">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-medium">{c.client} <span className="text-muted-foreground font-normal">· {c.company}</span></div>
                          <div className="text-[11px] text-muted-foreground">{new Date(c.date || c.createdAt).toLocaleDateString()} · {c.type}</div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground">{c.outcome || "Pending"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{c.notes || c.note}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-border">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
          No communications logged yet. Start logging to track client interactions.
        </div>
      )}

      {/* Log Communication Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-xl border border-border">
            <h2 className="text-xl font-semibold mb-4">Log Communication</h2>
            <form onSubmit={handleCreateLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <input required type="text" value={newLogForm.client} onChange={(e) => setNewLogForm({...newLogForm, client: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input required type="text" value={newLogForm.company} onChange={(e) => setNewLogForm({...newLogForm, company: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={newLogForm.type} onChange={(e) => setNewLogForm({...newLogForm, type: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none">
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={newLogForm.status} onChange={(e) => setNewLogForm({...newLogForm, status: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none">
                    <option value="Interested">Interested</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Quotation Requested">Quotation Requested</option>
                    <option value="Awaiting Reply">Awaiting Reply</option>
                    <option value="Deal Won">Deal Won</option>
                    <option value="Deal Lost">Deal Lost</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <input required type="text" value={newLogForm.employee} onChange={(e) => setNewLogForm({...newLogForm, employee: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <textarea required rows={3} value={newLogForm.note} onChange={(e) => setNewLogForm({...newLogForm, note: e.target.value})} className="w-full p-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Outcome</label>
                <input required type="text" value={newLogForm.outcome} onChange={(e) => setNewLogForm({...newLogForm, outcome: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsLogOpen(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm bg-success text-success-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 shadow-glow-success transition">
                  {isSubmitting ? "Logging..." : "Log Communication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
