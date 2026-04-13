import { useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { AppIcon } from "../../components/icons/AppIcon";
import { ThemeToggle } from "../../components/theme/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { TEXT_TOKENS } from "../../utils/textTokens";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    criticalValues: true,
    qcAlerts: true,
    trainingReminders: true,
    capaUpdates: true,
    documentUpdates: false,
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = user?.role === "staff" ? "Lab Scientist" : user?.role === "supervisor" ? "Unit Supervisor" : "Head of Department";

  return (
    <div className="w-full max-w-[760px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="mb-6">
        <h1 className="text-[var(--kl-text)] font-semibold text-[24px] mb-1">Settings</h1>
        <p className="text-[var(--kl-text-muted)] text-[14px]">Manage your profile, theme, and notification preferences.</p>
      </div>

      <section className="rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 mb-4 shadow-[var(--kl-shadow)]">
        <div className="flex items-center gap-2 mb-4">
          <AppIcon name="staff" size={15} className="text-[var(--kl-primary)]" />
          <h2 className="text-[var(--kl-text)] text-[16px] font-semibold">Profile</h2>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="size-[56px] rounded-full flex items-center justify-center text-white font-bold text-[18px]"
            style={{ backgroundColor: user?.color }}
          >
            {user?.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[var(--kl-text)] text-[17px] font-semibold truncate">{user?.name}</p>
            <p className="text-[var(--kl-text-muted)] text-[13px] truncate">
              {roleLabel}
              {TEXT_TOKENS.separator}
              {user?.unit}
            </p>
            <p className="text-[var(--kl-text-muted)] text-[12px] truncate">{user?.email}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-[12px] bg-[var(--kl-surface-tinted)] px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold mb-0.5">Department</p>
            <p className="text-[13px] text-[var(--kl-text)] font-medium">{user?.department}</p>
          </div>
          <div className="rounded-[12px] bg-[var(--kl-surface-tinted)] px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold mb-0.5">Joined</p>
            <p className="text-[13px] text-[var(--kl-text)] font-medium">
              {user?.joinDate
                ? new Date(user.joinDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                : "Not available"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <AppIcon name={resolvedTheme === "dark" ? "themeDark" : "themeLight"} size={15} className="text-[var(--kl-primary)]" />
          <h2 className="text-[var(--kl-text)] text-[16px] font-semibold">Appearance</h2>
        </div>
        <div className="rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2.5 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-[var(--kl-text)]">Color theme</p>
            <p className="text-[12px] text-[var(--kl-text-muted)]">This preference persists across sessions.</p>
          </div>
          <ThemeToggle className="rounded-[10px] border border-[var(--kl-border)] px-2.5 py-1.5" />
        </div>
      </section>

      <section className="rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <AppIcon name="alerts" size={15} className="text-[var(--kl-primary)]" />
          <h2 className="text-[var(--kl-text)] text-[16px] font-semibold">Notification Preferences</h2>
        </div>
        <div className="space-y-2">
          {Object.entries({
            criticalValues: "Critical value notifications",
            qcAlerts: "QC failure and warning alerts",
            trainingReminders: "Training due reminders",
            capaUpdates: "CAPA status updates",
            documentUpdates: "SOP workflow notifications",
          }).map(([key, label]) => (
            <div key={key} className="rounded-[12px] border border-[var(--kl-border)] px-3 py-2.5 flex items-center justify-between">
              <p className="text-[13px] text-[var(--kl-text)] font-medium">{label}</p>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                className={`relative h-5 w-10 rounded-full transition-colors ${
                  notifications[key as keyof typeof notifications] ? "bg-[var(--kl-primary)]" : "bg-[var(--kl-border)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
                    notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <AppIcon name="settings" size={15} className="text-[var(--kl-primary)]" />
          <h2 className="text-[var(--kl-text)] text-[16px] font-semibold">Security</h2>
        </div>
        <div className="space-y-2">
          <button className="w-full rounded-[12px] border border-[var(--kl-border)] px-3 py-2.5 text-left hover:bg-[var(--kl-surface-soft)]">
            <p className="text-[13px] text-[var(--kl-text)] font-medium">Change password</p>
            <p className="text-[12px] text-[var(--kl-text-muted)]">Update your account password</p>
          </button>
          <button className="w-full rounded-[12px] border border-[var(--kl-border)] px-3 py-2.5 text-left hover:bg-[var(--kl-surface-soft)]">
            <p className="text-[13px] text-[var(--kl-text)] font-medium">Active sessions</p>
            <p className="text-[12px] text-[var(--kl-text-muted)]">1 active session on this device</p>
          </button>
        </div>
      </section>

      <button
        onClick={handleLogout}
        className="w-full rounded-[16px] bg-[#fde9e9] text-[#b14343] hover:bg-[#f8d8d8] font-semibold text-[14px] py-3 inline-flex items-center justify-center gap-2"
      >
        <AppIcon name="logout" size={14} />
        Sign out of Knowlab
      </button>
    </div>
  );
}
