import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Factory, Mail, Lock, ArrowRight, TrendingUp, Users, Target, AlertCircle } from "lucide-react";
import { authService } from "@/services";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — ForgeCRM" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      login(response.user, response.token);
      nav({ to: "/" });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-brand text-primary-foreground p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 80px 80px",
        }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-success grid place-items-center shadow-glow-success">
              <Factory className="h-5 w-5 text-success-foreground" />
            </div>
            <div className="text-lg font-semibold">ForgeCRM</div>
          </div>
        </div>

        <div className="relative space-y-8 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-semibold leading-tight">
            Manage your manufacturing sales workflow efficiently.
          </h1>
          <p className="text-primary-foreground/70">
            One platform for leads, pipeline, follow-ups and team performance — built for BDA teams in industrial manufacturing.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: Users, label: "248", sub: "Leads" },
              { icon: TrendingUp, label: "₹6.1Cr", sub: "Revenue" },
              { icon: Target, label: "32%", sub: "Conv. Rate" },
            ].map((s) => {
              const I = s.icon;
              return (
                <div key={s.sub} className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-4">
                  <I className="h-4 w-4 text-success" />
                  <div className="mt-2 text-xl font-semibold">{s.label}</div>
                  <div className="text-[11px] text-primary-foreground/70">{s.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative text-xs text-primary-foreground/60">© 2026 ForgeCRM — Manufacturing Sales OS</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-success grid place-items-center">
              <Factory className="h-5 w-5 text-success-foreground" />
            </div>
            <div className="text-lg font-semibold">ForgeCRM</div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1.5">Sign in to your account to continue</p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="your@email.com"
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-background border border-input focus:border-ring outline-none text-sm disabled:opacity-50"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Password</span>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Your password"
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-background border border-input focus:border-ring outline-none text-sm disabled:opacity-50"
                />
              </div>
            </label>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-input accent-success" disabled={loading} /> Remember me
              </label>
              <a href="#" className="text-success font-medium hover:underline">Forgot password?</a>
            </div>

            <button disabled={loading} className="w-full h-11 rounded-lg bg-success text-success-foreground text-sm font-semibold shadow-glow-success hover:opacity-95 transition inline-flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? "Signing in…" : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/register" className="text-foreground font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
