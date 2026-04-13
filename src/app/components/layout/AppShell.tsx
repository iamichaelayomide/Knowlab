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
        onCta: () => openFloatingAI(`Teach me ${activeBench.name} SOP steps with checkpoints.`),
      };
    }
    if (routeSegment === "tests") {
      return {
        title: "Test Support",
        body: `Need quick ranges or sample requirements for ${activeBench.shortName}?`,
        ctaLabel: "Ask Test AI",
        onCta: () => openFloatingAI(`Explain ${activeBench.name} tests step by step with specimen notes.`),
      };
    }
    if (routeSegment === "staff") {
      return {
        title: "People Insights",
        body: "Use AI to locate staff by unit/bench and jump directly to a profile.",
        ctaLabel: "Find Staff",
        onCta: () => openFloatingAI("Find a staff member by unit and bench and share profile links."),
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
      ctaLabel: "Open AI",
      onCta: () => openFloatingAI(),
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
    <div className="flex flex-col h-full bg-[var(--kl-surface-soft)]">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="bg-[var(--kl-primary)] rounded-[18px] size-[44px] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-[13px]">LK</span>
        </div>
        <div>
          <div className="text-[var(--kl-text)] font-semibold text-[15px] leading-tight">Knowlab</div>
          <div className="text-[var(--kl-text-muted)] text-[12px]">{roleLabel(user.role)}</div>
        </div>
      </div>

      <DepartmentSwitcher />

      <div className="px-3 mb-4">
        <div className="rounded-[16px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-3.5">
          <p className="text-[11px] uppercase tracking-[1.2px] text-[var(--kl-text-muted)] font-semibold mb-1.5">
            {contextPanel.title}
          </p>
          <p className="text-[12px] text-[var(--kl-text)] leading-relaxed">{contextPanel.body}</p>
          <button
            onClick={contextPanel.onCta}
            className="mt-3 inline-flex items-center gap-1.5 rounded-[10px] bg-[var(--kl-primary)] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[var(--kl-primary-hover)] transition-colors"
          >
            <AppIcon name="ai" size={12} />
            {contextPanel.ctaLabel}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.section}>
            <p className="text-[var(--kl-text-muted)] font-semibold text-[11px] tracking-[1.98px] px-2 mb-2">{section.section}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-[18px] text-[14px] font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--kl-surface-tinted)] text-[var(--kl-primary)]"
                        : "text-[var(--kl-text)]/85 hover:bg-[var(--kl-surface)] hover:text-[var(--kl-primary)]"
                    }`
                  }
                >
                  <AppIcon name={item.icon} size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.label === "Alerts" && unreadAlerts > 0 && (
                    <span className="bg-[#b14343] text-white text-[11px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
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
        <div className="bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[18px] p-3.5 flex items-center gap-3">
          <div
            className="rounded-full size-[40px] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[var(--kl-text)] font-semibold text-[13px] truncate">{user.name}</div>
            <div className="text-[var(--kl-text-muted)] text-[11px] truncate">{user.unit}</div>
          </div>
          <button onClick={handleLogout} className="text-[var(--kl-text-muted)] hover:text-[#b14343] transition-colors p-1" title="Log out">
            <AppIcon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh min-h-dvh bg-[var(--kl-bg)] overflow-hidden">
      <aside className="hidden xl:flex flex-col w-[280px] flex-shrink-0 border-r border-[var(--kl-border)] h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {mobileSidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-[280px] border-r border-[var(--kl-border)] h-full overflow-hidden z-10">
            <button className="absolute top-4 right-4 text-[var(--kl-text-muted)] p-1" onClick={() => setMobileSidebarOpen(false)}>
              <AppIcon name="close" size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-20 bg-[color:rgba(247,250,255,0.9)] dark:bg-[color:rgba(16,26,49,0.92)] border-b border-[var(--kl-border)] h-[68px] flex items-center px-3 sm:px-6 gap-3 sm:gap-4 flex-shrink-0 backdrop-blur-sm">
          <button className="xl:hidden text-[var(--kl-text)] p-1" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation menu">
            <AppIcon name="menu" size={20} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-[12px] font-semibold"
              style={{ backgroundColor: `${activeDepartment.color}18`, color: activeDepartment.color }}
            >
              <AppIcon name="department" size={12} />
              {activeDepartment.shortName}
            </div>
            <AppIcon name="chevronRight" size={12} className="hidden md:inline-flex text-[var(--kl-text-muted)]" />
            <div className="hidden md:flex items-center gap-1.5 bg-[var(--kl-surface-tinted)] text-[var(--kl-text)] text-[12px] font-medium px-2.5 py-1 rounded-[10px]">
              <span className="inline-block size-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: activeBench.color }} />
              {activeBench.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle
              compact
              className="rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-2.5 py-2 text-[var(--kl-text)] hover:bg-[var(--kl-surface-tinted)] transition-colors"
            />
            <button
              onClick={() => openFloatingAI()}
              className="rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-2.5 py-2 text-[var(--kl-text)] hover:bg-[var(--kl-surface-tinted)] transition-colors"
              title="Open AI assistant"
            >
              <AppIcon name="ai" size={14} />
            </button>
            <NavLink
              to={`${base}/alerts`}
              className="relative bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[14px] px-3 py-2 text-[var(--kl-text)] text-[14px] font-medium hover:bg-[var(--kl-surface-tinted)] transition-colors flex items-center gap-2"
            >
              <AppIcon name="alerts" size={14} />
              Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b14343] text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {!isOnline && (
          <div className="px-3 sm:px-6 py-2 bg-[#fff0db] border-b border-[#f5d99a] text-[#9a6115] text-[12px] font-medium">
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
