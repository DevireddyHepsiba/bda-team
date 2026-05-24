import { LeadStatus } from "@/lib/mock-data";

const styles: Record<LeadStatus | string, string> = {
  new: "bg-info/10 text-info border-info/20",
  contacted: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  qualified: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  negotiation: "bg-warning/15 text-warning border-warning/30",
  won: "bg-success/15 text-success border-success/30",
  lost: "bg-destructive/10 text-destructive border-destructive/20",
};

const labels: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  negotiation: "Negotiation", won: "Won", lost: "Lost",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
