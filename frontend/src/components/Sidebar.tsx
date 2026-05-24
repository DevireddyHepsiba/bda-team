import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, KanbanSquare, CalendarClock, MessageSquare,
  BarChart3, Trophy, FileText, Settings, LogOut, Factory,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/followups", label: "Follow-ups", icon: CalendarClock },
  { to: "/communications", label: "Communications", icon: MessageSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3, adminOnly: true },
  { to: "/team", label: "Team Performance", icon: Trophy, adminOnly: true },
  { to: "/reports", label: "Reports", icon: FileText, adminOnly: true },
  { to: "/settings", label: "Settings", icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "admin";

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-gradient-success grid place-items-center shadow-glow-success">
          <Factory className="h-5 w-5 text-success-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">ForgeCRM</div>
          <div className="text-[11px] text-sidebar-foreground/60">Manufacturing Sales</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" /> Logout
        </Link>
      </div>
    </aside>
  );
}
