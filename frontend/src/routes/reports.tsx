import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { reportService } from "@/services";
import { FileText, Download, FileSpreadsheet, FileType2, Loader } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — ForgeCRM" }] }),
  component: Reports,
});

const reports = [
  { title: "Lead Report", desc: "Sources, status distribution and aging analysis", color: "info", type: "leads" },
  { title: "Revenue Report", desc: "Monthly revenue, quarterly growth and forecast", color: "success", type: "revenue" },
  { title: "Employee Report", desc: "Best performers, productivity and activity logs", color: "warning", type: "employees" },
  { title: "Pipeline Report", desc: "Deal velocity, stage conversion and value", color: "chart-2", type: "pipeline" },
  { title: "Client Report", desc: "Active accounts, churn risk and lifetime value", color: "chart-4", type: "clients" },
  { title: "Follow-up Report", desc: "Completion rate, overdue and SLA tracking", color: "chart-3", type: "followups" },
];

const toneMap: Record<string, string> = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  "chart-2": "bg-chart-2/15 text-chart-2",
  "chart-3": "bg-chart-3/15 text-chart-3",
  "chart-4": "bg-chart-4/15 text-chart-4",
};

function Reports() {
  const [exporting, setExporting] = useState<{ [key: string]: string | null }>({});

  const handleExport = async (reportType: string, format: "csv" | "excel" | "pdf") => {
    try {
      setExporting((prev) => ({ ...prev, [reportType + format]: "loading" }));
      
      switch (format) {
        case "csv":
          await reportService.exportCsv(reportType);
          break;
        case "excel":
          await reportService.exportExcel(reportType);
          break;
        case "pdf":
          await reportService.exportPdf(reportType);
          break;
      }
      
      setExporting((prev) => ({ ...prev, [reportType + format]: null }));
    } catch (err: any) {
      console.error(`Failed to export ${format}:`, err);
      setExporting((prev) => ({ ...prev, [reportType + format]: "error" }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and export business-ready reports</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div key={r.title} className="rounded-xl bg-card border border-border p-5 shadow-soft hover:shadow-md transition group">
            <div className={`h-10 w-10 rounded-lg grid place-items-center ${toneMap[r.color]}`}>
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mt-4">{r.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
              <button 
                onClick={() => handleExport(r.type, "pdf")}
                disabled={exporting[r.type + "pdf"] === "loading"}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md border border-border text-xs hover:bg-muted disabled:opacity-50"
              >
                {exporting[r.type + "pdf"] === "loading" ? (
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileType2 className="h-3.5 w-3.5" />
                )} PDF
              </button>
              <button 
                onClick={() => handleExport(r.type, "excel")}
                disabled={exporting[r.type + "excel"] === "loading"}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md border border-border text-xs hover:bg-muted disabled:opacity-50"
              >
                {exporting[r.type + "excel"] === "loading" ? (
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                )} Excel
              </button>
              <button 
                onClick={() => handleExport(r.type, "csv")}
                disabled={exporting[r.type + "csv"] === "loading"}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-success text-success-foreground text-xs font-medium disabled:opacity-50"
              >
                {exporting[r.type + "csv"] === "loading" ? (
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )} CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
