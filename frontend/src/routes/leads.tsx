import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, Download, Eye, Pencil, Trash2, Loader, AlertCircle } from "lucide-react";
import { leadService, reportService } from "@/services";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads — ForgeCRM" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLeadId, setEditLeadId] = useState<string | null>(null);
  const [newLeadForm, setNewLeadForm] = useState({
    client: "",
    company: "",
    product: "",
    budget: "",
    status: "new",
    employee: user?.fullName || ""
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAll();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load leads:", err);
      setError("Failed to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (isEditing && editLeadId) {
        await leadService.update(editLeadId, {
          client: newLeadForm.client,
          company: newLeadForm.company,
          product: newLeadForm.product,
          budget: Number(newLeadForm.budget),
          status: newLeadForm.status,
        });
      } else {
        await leadService.create({
          client: newLeadForm.client,
          company: newLeadForm.company,
          product: newLeadForm.product,
          budget: Number(newLeadForm.budget),
          status: newLeadForm.status,
          employee: newLeadForm.employee || "Unassigned"
        } as any);
      }
      setIsNewLeadOpen(false);
      setIsEditing(false);
      setEditLeadId(null);
      setNewLeadForm({
        client: "",
        company: "",
        product: "",
        budget: "",
        status: "new",
        employee: user?.fullName || ""
      });
      fetchLeads();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadService.delete(id);
      fetchLeads();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to delete lead");
    }
  };

  const openEditModal = (lead: any) => {
    setIsEditing(true);
    setEditLeadId(lead._id);
    setNewLeadForm({
      client: lead.client || "",
      company: lead.company || "",
      product: lead.product || "",
      budget: lead.budget || "",
      status: lead.status || "new",
      employee: lead.employee || user?.fullName || ""
    });
    setIsNewLeadOpen(true);
  };

  const rows = useMemo(() => {
    const ql = q.toLowerCase();
    return leads.filter((l) =>
      (status === "all" || l.status === status) &&
      (l.client?.toLowerCase().includes(ql) || l.company?.toLowerCase().includes(ql) || l.product?.toLowerCase().includes(ql) || false)
    );
  }, [q, status, leads]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading leads...</p>
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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">{rows.length} of {leads.length} leads</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setEditLeadId(null);
            setNewLeadForm({
              client: "",
              company: "",
              product: "",
              budget: "",
              status: "new",
              employee: user?.fullName || ""
            });
            setIsNewLeadOpen(true);
          }}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-success text-success-foreground text-sm font-medium shadow-glow-success">
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="flex flex-wrap gap-3 p-4 border-b border-border">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search by client, company, product…"
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/60 border border-transparent focus:bg-card focus:border-ring outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              value={status} onChange={(e) => setStatus(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-lg bg-muted/60 border border-transparent focus:bg-card focus:border-ring outline-none text-sm capitalize"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <button 
            onClick={() => reportService.exportLeadsAsPDF()}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border text-sm hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Lead</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-right px-4 py-3 font-medium">Budget</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l._id} className="border-t border-border hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.client}</div>
                    <div className="text-xs text-muted-foreground">{l._id}</div>
                  </td>
                  <td className="px-4 py-3">{l.company}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.product}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{l.budget || 0}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => openEditModal(l)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteLead(l._id)} className="h-8 w-8 grid place-items-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No leads match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Modal */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-xl border border-border">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Lead" : "Add New Lead"}</h2>
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
                <button type="button" onClick={() => { setIsNewLeadOpen(false); setIsEditing(false); setEditLeadId(null); }} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm bg-success text-success-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 shadow-glow-success transition">
                  {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
