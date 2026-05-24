import { Bell, Search, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Topbar() {
  const [dark, setDark] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  
  const initials = user?.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center gap-4 px-4 md:px-6">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search leads, clients, products…"
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/60 border border-transparent focus:bg-card focus:border-ring outline-none text-sm transition"
        />
      </div>
      <div className="hidden lg:block text-xs text-muted-foreground">{today}</div>
      <button
        onClick={() => setDark((v) => !v)}
        className="h-10 w-10 grid place-items-center rounded-lg hover:bg-muted transition"
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <button className="relative h-10 w-10 grid place-items-center rounded-lg hover:bg-muted transition">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-success" />
      </button>
      <div className="flex items-center gap-3 pl-3 border-l border-border">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium leading-tight">{user?.fullName || "User"}</div>
          <div className="text-[11px] text-muted-foreground">{user?.role || "BDA"}</div>
        </div>
        <div className="h-9 w-9 rounded-full bg-gradient-brand grid place-items-center text-primary-foreground text-sm font-semibold">
          {initials}
        </div>
      </div>
    </header>
  );
}
