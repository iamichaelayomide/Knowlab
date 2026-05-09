import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import type { AppIconName } from "../icons/AppIcon";
import { AppIcon } from "../icons/AppIcon";
import { useAuth } from "../../context/AuthContext";
import { useDepartment } from "../../context/DepartmentContext";
import { ALERTS } from "../../data/mockData";
import { getWorkflowState } from "../../services/workflowStore";
import { openFloatingAI } from "../../services/aiWidget";
import FloatingAIWidget from "../ai/FloatingAIWidget";
import { DepartmentSwitcher } from "./DepartmentSwitcher";
import { ThemeToggle } from "../theme/ThemeToggle";

interface NavItem {
  label: string;
  icon: AppIconName;
  path: string;
}

interface ContextPanelConfig {
  title: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
}

function getNavItems(role: string, base: string): { section: string; items: NavItem[] }[] {
  if (role === "staff") {
    return [
      {
        section: "CORE",
        items: [
          { label: "Dashboard", icon: "dashboard", path: `${base}/dashboard` },
          { label: "SOPs", icon: "sops", path: `${base}/sops` },
          { label: "Tests", icon: "tests", path: `${base}/tests` },
          { label: "Job Aids", icon: "jobAids", path: `${base}/job-aids` },
          { label: "Training", icon: "training", path: `${base}/training` },
        ],
      },
      {
        section: "WORKSPACE",
        items: [
          { label: "Alerts", icon: "alerts", path: `${base}/alerts` },
          { label: "Settings", icon: "settings", path: `${base}/settings` },
        ],
      },
    ];
  }

  if (role === "supervisor") {
    return [
      {
        section: "CORE",
        items: [
          { label: "Dashboard", icon: "dashboard", path: `${base}/dashboard` },
          { label: "SOPs", icon: "sops", path: `${base}/sops` },
          { label: "SOP Reviews", icon: "qc", path: `${base}/sops/review` },
          { label: "Tests", icon: "tests", path: `${base}/tests` },
          { label: "Job Aids", icon: "jobAids", path: `${base}/job-aids` },
          { label: "Training", icon: "training", path: `${base}/training` },
          { label: "QC Log", icon: "qc", path: `${base}/qc-log` },
        ],
      },
      {
        section: "OVERSIGHT",
        items: [
          { label: "My Staff", icon: "staff", path: `${base}/staff` },
          { label: "User Requests", icon: "users", path: `${base}/user-requests` },
          { label: "CAPA Items", icon: "capa", path: `${base}/capa` },
          { label: "Alerts", icon: "alerts", path: `${base}/alerts` },
          { label: "Settings", icon: "settings", path: `${base}/settings` },
        ],
      },
    ];
  }

  return [
    {
      section: "OVERVIEW",
      items: [
        { label: "Dashboard", icon: "dashboard", path: `${base}/dashboard` },
        { label: "Staff", icon: "staff", path: `${base}/staff` },
        { label: "Users", icon: "users", path: `${base}/users` },
        { label: "SOP Validation", icon: "qc", path: `${base}/sops/validation` },
        { label: "Training", icon: "training", path: `${base}/training` },
        { label: "QC Overview", icon: "qc", path: `${base}/qc` },
        { label: "Reports", icon: "reports", path: `${base}/reports` },
      ],
    },
    {
      section: "MANAGEMENT",
      items: [
        { label: "CAPA", icon: "capa", path: `${base}/capa` },
        { label: "Alerts", icon: "alerts", path: `${base}/alerts` },
        { label: "Settings", icon: "settings", path: `${base}/settings` },
      ],
    },
  ];
}

function roleBase(role: string) {
  if (role === "staff") return "/staff";
  if (role === "supervisor") return "/supervisor";
  return "/hod";
}

function roleLabel(role: string) {
  if (role === "staff") return "Staff workspace";
  if (role === "supervisor") return "Supervisor workspace";
  return "HOD workspace";
}

function getRouteSegment(pathname: string) {
  return pathname.split("/")[2] || "dashboard";
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const mainScrollRef = useRef<HTMLElement | null>(null);

  if (!user) return <Navigate to="/login" replace />;

  const base = roleBase(user.role);
  if (!location.pathname.startsWith(base)) {
    return <Navigate to={`${base}/dashboard`} replace />;
  }

  const navSections = getNavItems(user.role, base);
  const unreadAlerts = ALERTS.filter((a) => !a.read && a.targetRoles.includes(user.role)).length;
  const workflowState = useMemo(() => getWorkflowState(), []);
  const routeSegment = getRouteSegment(location.pathname);

  const contextPanel = useMemo<ContextPanelConfig>(() => {
    if (routeSegment === "sops") {
      return {
        title: "SOP Context",
        body: `Focused on ${activeBench.shortName}. Ask AI to break down procedure steps before execution.`,
        ctaLabel: "Ask SOP AI",
        onCta: () => openFloatingAI(`Walk me through ${activeBench.name} SOP steps with practical checkpoints.`),
      };
    }
    if (routeSegment === "tests") {
      return {
        title: "Test Support",
        body: `Need quick ranges or sample requirements for ${activeBench.shortName}?`,
        ctaLabel: "Ask Test AI",
        onCta: () => openFloatingAI(`Walk me through ${activeBench.name} tests with specimen notes.`),
      };
    }
    if (routeSegment === "staff") {
      return {
        title: "People Insights",
        body: "Use AI to locate staff by unit/bench and jump directly to a profile.",
        ctaLabel: "Find Staff",
        onCta: () => openFloatingAI("Help me find a staff member by unit and bench."),
      };
    }
    if (routeSegment === "capa") {
      return {
        title: "CAPA Command",
        body: "Read-only by default. Enter edit mode to update corrective/preventive actions.",
        ctaLabel: "Review CAPA",
        onCta: () => navigate(`${base}/capa`),
      };
    }
    if (user.role === "supervisor") {
      const pending = workflowState.reviewTasks.filter(
        (task) => task.assignedReviewerId === user.id && task.decision === "pending",
      ).length;
      return {
        title: "Supervisor Focus",
        body: `${pending} SOP review task(s) pending. ${unreadAlerts} unread alert(s) need follow-up.`,
        ctaLabel: "Open Reviews",
        onCta: () => navigate(`${base}/sops/review`),
      };
    }
    if (user.role === "hod") {
      const pending = workflowState.validationTasks.filter(
        (task) => task.assignedHodId === user.id && task.decision === "pending",
      ).length;
      return {
        title: "HOD Focus",
        body: `${pending} validation task(s) are waiting. Use AI for department-level synthesis.`,
        ctaLabel: "Open Validation",
        onCta: () => navigate(`${base}/sops/validation`),
      };
    }
    return {
      title: "Bench Focus",
      body: `${activeDepartment.shortName} / ${activeBench.shortName} context is active. Ask AI for guided help any time.`,
      ctaLabel: "Open chat",
      onCta: () => navigate(`${base}/ai-assistant/legacy`),
    };
  }, [
    activeBench.name,
    activeBench.shortName,
    activeDepartment.shortName,
    base,
    navigate,
    routeSegment,
    unreadAlerts,
    user.id,
    user.role,
    workflowState.reviewTasks,
    workflowState.validationTasks,
  ]);

  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="sidebar flex h-full flex-col bg-[var(--surface-card)]">
      <div className="sidebar-logo flex h-14 items-center gap-3 border-b border-[var(--surface-border)] px-3">
        <div className="bg-[linear-gradient(180deg,#2c2c2c,#050505)] rounded-[18px] size-[44px] flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_24px_rgba(0,0,0,0.22)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))]">
          <span className="text-white font-bold text-[13px]">LK</span>
        </div>
        <div>
          <div className="text-[var(--text-primary)] font-semibold text-[15px] leading-tight">Knowlab</div>
          <div className="text-[var(--text-secondary)] text-[12px]">{roleLabel(user.role)}</div>
        </div>
      </div>

      <DepartmentSwitcher />

      <div className="px-3 mb-4">
        <div className="kl-card rounded-[24px] border border-[var(--surface-border)] bg-[var(--surface-raised)] p-3.5 shadow-xs">
          <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)] font-semibold mb-1.5">
            {contextPanel.title}
          </p>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{contextPanel.body}</p>
          <button
            onClick={contextPanel.onCta}
            className="btn-primary mt-3 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold"
          >
            <AppIcon name="ai" size={12} />
            {contextPanel.ctaLabel}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.section}>
            <p className="text-[var(--text-tertiary)] font-semibold text-[11px] uppercase tracking-[0.06em] px-3 mb-2">{section.section}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `nav-${isActive ? "active" : "idle"}-pill kl-nav-item flex h-10 items-center gap-2.5 px-3 text-[14px] font-medium transition-all duration-fast ${
                      isActive
                        ? "bg-[#e9e9e9] text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_20px_rgba(0,0,0,0.08)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)]"
                    }`
                  }
                >
                  <AppIcon name={item.icon} size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.label === "Alerts" && unreadAlerts > 0 && (
                    <span className="bg-[var(--destructive)] text-white text-[11px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {unreadAlerts}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pb-5">
        <div className="kl-card bg-[var(--surface-raised)] border border-[var(--surface-border)] rounded-[24px] p-3.5 flex items-center gap-3 shadow-xs">
          <div
            className="rounded-full size-[40px] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[var(--text-primary)] font-semibold text-[13px] truncate">{user.name}</div>
            <div className="text-[var(--text-secondary)] text-[11px] truncate">{user.unit}</div>
          </div>
          <button onClick={handleLogout} className="kl-icon-button text-[var(--text-tertiary)] hover:text-[var(--destructive)] transition-colors" title="Log out" aria-label="Log out">
            <AppIcon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh min-h-dvh bg-[var(--surface-base)] overflow-hidden text-[var(--text-primary)]">
      <aside className="hidden xl:flex flex-col w-[240px] flex-shrink-0 shadow-[1px_0_0_var(--surface-border)] h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {mobileSidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-[280px] border-r border-[var(--surface-border)] h-full overflow-hidden z-10">
            <button className="kl-icon-button absolute top-4 right-4 text-[var(--text-secondary)]" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation menu">
              <AppIcon name="close" size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="breadcrumb-bar sticky top-0 z-20 flex h-[52px] flex-shrink-0 items-center gap-3 border-b border-[var(--surface-border)] bg-[var(--surface-overlay)] px-3 backdrop-blur-xl sm:px-6">
          <button className="kl-icon-button xl:hidden text-[var(--text-primary)]" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation menu">
            <AppIcon name="menu" size={20} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold"
              style={{ backgroundColor: `${activeDepartment.color}18`, color: activeDepartment.color }}
            >
              <AppIcon name="department" size={12} />
              {activeDepartment.shortName}
            </div>
            <AppIcon name="chevronRight" size={12} className="hidden md:inline-flex text-[var(--text-tertiary)]" />
            <div className="hidden md:flex items-center gap-1.5 bg-[var(--accent-glow)] text-[var(--text-primary)] text-[12px] font-medium px-2.5 py-1 rounded-full">
              <span className="inline-block size-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: activeBench.color }} />
              {activeBench.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle compact className="shrink-0" />
            <button
              onClick={() => openFloatingAI()}
              className="kl-icon-button border border-[var(--surface-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] shadow-glass backdrop-blur-md transition-all hover:bg-[var(--surface-card)] dark:bg-[rgba(255,255,255,0.08)] dark:hover:bg-[rgba(255,255,255,0.13)]"
              title="Open AI assistant"
              aria-label="Open AI assistant"
            >
              <AppIcon name="ai" size={14} />
            </button>
            <NavLink
              to={`${base}/alerts`}
              className="kl-button-soft relative flex h-10 items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--glass-bg)] px-3 text-[14px] font-medium text-[var(--text-primary)] shadow-xs transition-all hover:bg-[var(--surface-raised)] dark:bg-[rgba(255,255,255,0.08)] dark:hover:bg-[rgba(255,255,255,0.13)]"
            >
              <AppIcon name="alerts" size={14} />
              Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--destructive)] text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {!isOnline && (
          <div className="px-3 sm:px-6 py-2 bg-[rgba(245,166,35,0.12)] border-b border-[var(--surface-border)] text-[var(--warning)] text-[12px] font-medium">
            Offline mode: using cached app data. New cloud sync/remote AI updates will resume when internet returns.
          </div>
        )}
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <FloatingAIWidget />
    </div>
  );
}
