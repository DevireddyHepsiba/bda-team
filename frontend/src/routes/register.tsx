import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Factory, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { authService } from "@/services";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — ForgeCRM" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "BDA Employee",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });
      // Redirect to login after successful registration
      nav({ to: "/login" });
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-soft p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-success grid place-items-center shadow-glow-success">
            <Factory className="h-5 w-5 text-success-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold">ForgeCRM</div>
            <div className="text-xs text-muted-foreground">Create your account</div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-2">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            placeholder="John Doe"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="john@company.com"
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            placeholder="+91 98765 12345"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="••••••••"
            />
            <Input
              label="Confirm"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Role</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="mt-1.5 w-full h-11 px-3 rounded-lg bg-background border border-input focus:border-ring outline-none text-sm disabled:opacity-50"
            >
              <option>BDA Employee</option>
              <option>Sales Manager</option>
              <option>Admin</option>
            </select>
          </label>
          <button
            disabled={loading}
            className="w-full h-11 rounded-lg bg-success text-success-foreground text-sm font-semibold shadow-glow-success hover:opacity-95 transition inline-flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {loading ? "Creating Account…" : <>Create Account <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account? <Link to="/login" className="text-foreground font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required
        className="mt-1.5 w-full h-11 px-3 rounded-lg bg-background border border-input focus:border-ring outline-none text-sm disabled:opacity-50"
      />
    </label>
  );
}
