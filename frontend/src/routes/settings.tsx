import { createFileRoute } from "@tanstack/react-router";
import { User, Bell, Palette, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { settingsService } from "@/services/settingsService";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ForgeCRM" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    followupReminders: true,
    weeklyDigest: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: string) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    try {
      if (formData.fullName !== user?.fullName || formData.email !== user?.email || formData.phone !== user?.phone) {
         await settingsService.updateProfile(formData);
      }
      
      if (passwordData.currentPassword && passwordData.newPassword) {
         await settingsService.changePassword(passwordData);
         setPasswordData({ currentPassword: "", newPassword: "" }); // Reset after success
      }
      
      await settingsService.updateNotifications(notifications);
      alert("Changes saved successfully!");
    } catch (error: any) {
      console.error("Failed to save settings", error);
      alert(error?.message || "Failed to save settings");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Section icon={User} title="Profile">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field 
            label="Full Name" 
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
          <Field 
            label="Email" 
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <Field 
            label="Phone" 
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          <Field 
            label="Role" 
            value={formData.role}
            disabled 
          />
        </div>
      </Section>

      <Section icon={Lock} title="Change Password">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field 
            label="Current Password" 
            type="password" 
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
          />
          <Field 
            label="New Password" 
            type="password" 
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
          />
        </div>
      </Section>

      <Section icon={Bell} title="Notifications">
        <Toggle 
          label="Email notifications" 
          checked={notifications.emailNotifications}
          onChange={() => handleToggle("emailNotifications")}
        />
        <Toggle 
          label="Follow-up reminders" 
          checked={notifications.followupReminders}
          onChange={() => handleToggle("followupReminders")}
        />
        <Toggle 
          label="Weekly performance digest"
          checked={notifications.weeklyDigest}
          onChange={() => handleToggle("weeklyDigest")}
        />
      </Section>

      <Section icon={Palette} title="Appearance">
        <p className="text-sm text-muted-foreground">Use the moon icon in the top bar to switch between light and dark themes.</p>
      </Section>

      <div className="flex justify-end gap-2">
        <button className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
        <button onClick={handleSave} className="h-10 px-5 rounded-lg bg-success text-success-foreground text-sm font-medium shadow-glow-success">Save Changes</button>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
      <h2 className="font-semibold flex items-center gap-2 mb-4">
        <span className="h-8 w-8 rounded-lg grid place-items-center bg-muted"><Icon className="h-4 w-4" /></span>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", disabled }: { label: string; value?: string; onChange?: (e: any) => void; type?: string; disabled?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1.5 w-full h-10 px-3 rounded-lg bg-background border border-input focus:border-ring outline-none text-sm disabled:opacity-60"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: () => void }) {
  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <input 
        type="checkbox" 
        checked={checked || false}
        onChange={onChange}
        className="h-5 w-9 appearance-none rounded-full bg-muted checked:bg-success relative cursor-pointer transition before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition checked:before:translate-x-4" 
      />
    </label>
  );
}
