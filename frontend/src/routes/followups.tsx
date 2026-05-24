
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { followupService } from "@/services";
import { CalendarClock, Phone, Mail, Users, CheckCircle2, Plus, Loader, AlertCircle, Trash2 } from "lucide-react";

export const Route = createFileRoute("/followups")({
  head: () => ({ meta: [{ title: "Follow-ups — ForgeCRM" }] }),
  component: FollowUps,
});

const typeIcon = { call: Phone, email: Mail, meeting: Users } as const;
const priorityTone: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/15 text-warning",
  low: "bg-info/10 text-info",
};

function FollowUps() {
  const [allFollowups, setAllFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newFollowupForm, setNewFollowupForm] = useState({
    client: "",
    company: "",
    date: "",
    time: "",
    type: "Call",
    priority: "High"
  });

  const fetchFollowups = async () => {
    try {
      setLoading(true);
      const data = await followupService.getAll();
      setAllFollowups(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load followups:", err);
      setError("Failed to load followups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const handleCreateFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await followupService.create(newFollowupForm as any);
      setIsScheduleOpen(false);
      setNewFollowupForm({
        client: "",
        company: "",
        date: "",
        time: "",
        type: "Call",
        priority: "High"
      });
      fetchFollowups();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to schedule follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todays = allFollowups.filter((f) => f.date?.split('T')[0] === today && !f.done);
  const upcoming = allFollowups.filter((f) => {
    const fDate = f.date?.split('T')[0];
    return fDate > today && fDate <= sevenDaysFromNow && !f.done;
  });
  const completed = allFollowups.filter((f) => f.done);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading followups...</p>
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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Follow-ups</h1>
          <p className="text-sm text-muted-foreground mt-1">Your tasks and scheduled client touchpoints</p>
        </div>
        <button 
          onClick={() => setIsScheduleOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-success text-success-foreground text-sm font-medium shadow-glow-success">
          <Plus className="h-4 w-4" /> Schedule
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Section title="Today" count={todays.length} tone="warning" items={todays} setAllFollowups={setAllFollowups} />
        <Section title="Upcoming (7 days)" count={upcoming.length} tone="info" items={upcoming} setAllFollowups={setAllFollowups} />
        <Section title="Completed" count={completed.length} tone="success" items={completed} done setAllFollowups={setAllFollowups} />
      </div>

      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-xl border border-border">
            <h2 className="text-xl font-semibold mb-4">Schedule Follow-up</h2>
            <form onSubmit={handleCreateFollowup} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium mb-1">Client Name</label>
                <input required type="text" value={newFollowupForm.client} onChange={(e) => setNewFollowupForm({...newFollowupForm, client: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input required type="text" value={newFollowupForm.company} onChange={(e) => setNewFollowupForm({...newFollowupForm, company: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input required type="date" value={newFollowupForm.date} onChange={(e) => setNewFollowupForm({...newFollowupForm, date: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input required type="time" value={newFollowupForm.time} onChange={(e) => setNewFollowupForm({...newFollowupForm, time: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={newFollowupForm.type} onChange={(e) => setNewFollowupForm({...newFollowupForm, type: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none">
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select value={newFollowupForm.priority} onChange={(e) => setNewFollowupForm({...newFollowupForm, priority: e.target.value})} className="w-full h-10 px-3 rounded-md bg-background border border-input focus:border-ring outline-none">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsScheduleOpen(false)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm bg-success text-success-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 shadow-glow-success transition">
                  {isSubmitting ? "Scheduling..." : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, count, tone, items, done, setAllFollowups }: { title: string; count: number; tone: string; items: any[]; done?: boolean; setAllFollowups: any }) {
  const toneMap: Record<string, string> = {
    warning: "bg-warning/15 text-warning",
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
  };

  const handleMarkDone = async (followupId: string) => {
    try {
      await followupService.markDone(followupId);
      setAllFollowups((prev: any[]) => prev.map((f) => f._id === followupId ? { ...f, done: true } : f));
    } catch (err: any) {
      console.error("Failed to mark followup done:", err);
    }
  };

  const handleDelete = async (followupId: string) => {
    if (!window.confirm("Are you sure you want to delete this follow-up?")) return;
    try {
      await followupService.delete(followupId);
      setAllFollowups((prev: any[]) => prev.filter((f) => f._id !== followupId));
    } catch (err: any) {
      console.error("Failed to delete followup:", err);
    }
  };

  return (
    <div className="rounded-xl bg-card border border-border shadow-soft">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" /> {title}
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${toneMap[tone]}`}>{count}</span>
      </div>
      <ul className="p-3 space-y-2">
        {items.length === 0 && <li className="text-sm text-muted-foreground text-center py-8">Nothing here.</li>}
        {items.map((f) => {
          const Icon = (typeIcon as Record<string, typeof Phone>)[f.type?.toLowerCase()] ?? Phone;
          return (
            <li key={f._id} className="group rounded-lg border border-border p-3 hover:border-ring/40 transition">
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg grid place-items-center ${done ? "bg-success/10 text-success" : "bg-muted text-foreground"}`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.leadName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{f.company} · {f.type}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityTone[f.priority?.toLowerCase()] || 'bg-muted/10 text-muted-foreground'}`}>{f.priority || "Normal"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{new Date(f.date).toLocaleDateString()} · {f.time || "Not set"}</span>
                <div className="flex items-center gap-2">
                  {!done && <button onClick={() => handleMarkDone(f._id)} className="text-success font-medium opacity-0 group-hover:opacity-100 transition">Mark done</button>}
                  <button onClick={() => handleDelete(f._id)} className="text-destructive font-medium opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
