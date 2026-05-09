import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import type { AppIconName } from "../icons/AppIcon";
import { AppIcon } from "../icons/AppIcon";
import { useAuth } from "../../context/AuthContext";
import { useDepartment } from "../../context/DepartmentContext";
import FloatingAIWidget from "../ai/FloatingAIWidget";

interface NavItem {
  label: string;
  icon: AppIconName;
  path: string;
  end?: boolean;
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const location = useLocation();
  const navigate = useNavigate();
  const mainScrollRef = useRef<HTMLElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    mainScrollRef.current?.scrollTo(0, 0);
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navItems = useMemo<NavItem[]>(() => {
    if (!user) return [];
    const base = user.role === "hod" ? "/hod" : user.role === "supervisor" ? "/supervisor" : "/staff";

    const common: NavItem[] = [
      { label: "Dashboard", icon: "dashboard", path: `${base}/dashboard`, end: true },
      { label: "Patients", icon: "patients", path: `${base}/patients` },
    ];

    if (user.role === "hod") {
      return [
        ...common,
        { label: "SOP Validation", icon: "sops", path: "/hod/sop-validation" },
        { label: "QC Log", icon: "qc", path: "/hod/qc-log" },
        { label: "Reports", icon: "reports", path: "/hod/reports" },
      ];
    }

    if (user.role === "supervisor") {
      return [
        ...common,
        { label: "SOPs", icon: "sops", path: "/supervisor/sops" },
        { label: "SOP Reviews", icon: "alerts", path: "/supervisor/sop-reviews" },
        { label: "Tests", icon: "tests", path: "/supervisor/tests" },
        { label: "Job Aids", icon: "job-aids", path: "/supervisor/job-aids" },
        { label: "QC Log", icon: "qc", path: "/supervisor/qc-log" },
      ];
    }

    return [
      ...common,
      { label: "SOPs", icon: "sops", path: "/staff/sops" },
      { label: "Tests", icon: "tests", path: "/staff/tests" },
      { label: "Job Aids", icon: "job-aids", path: "/staff/job-aids" },
      { label: "QC Log", icon: "qc", path: "/staff/qc-log" },
    ];
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const base = user.role === "hod" ? "/hod" : user.role === "supervisor" ? "/supervisor" : "/staff";

  return (
    <div className="flex h-screen w-full bg-[var(--surface-raised)] overflow-hidden font-sans antialiased text-[var(--text-primary)]">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--surface-border)] bg-[var(--surface-card)] transition-transform duration-300 lg:static lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center px-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(`${base}/dashboard`)}
          >
            <div className="grid size-9 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--kl-primary),#0059c1)] text-white shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-[18px] font-black tracking-tighter">KL</span>
            </div>
            <div>
              <p className="text-[15px] font-black tracking-tight text-[var(--text-primary)]">Knowlab</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">{user.role} workspace</p>
            </div>
          </div>
        </div>

        {/* Bench Selector (Staff/Supervisor Only) */}
        {user.role !== "hod" && (
          <div className="px-4 mb-4">
            <button className="flex w-full items-center gap-3 rounded-[20px] bg-[var(--surface-raised)] p-3 border border-[var(--surface-border)] hover:bg-[var(--surface-card)] transition-all text-left">
              <div 
                className="grid size-9 shrink-0 place-items-center rounded-xl text-white shadow-sm"
                style={{ backgroundColor: activeDepartment.color }}
              >
                <AppIcon name="tests" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">{activeDepartment.shortName}</p>
                <p className="truncate text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">{activeBench.shortName} bench</p>
              </div>
              <AppIcon name="chevron-down" size={14} className="text-[var(--text-tertiary)]" />
            </button>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4 scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] font-bold transition-all
                ${isActive 
                  ? "bg-[var(--kl-primary)] bg-opacity-10 text-[var(--kl-primary)] shadow-sm border border-[var(--kl-primary)] border-opacity-20" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <AppIcon name={item.icon} size={18} className={isActive ? "text-[var(--kl-primary)]" : "opacity-60"} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--surface-border)] p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface-raised)] p-3 border border-[var(--surface-border)]">
            <div 
              className="grid size-9 shrink-0 place-items-center rounded-xl text-white font-black text-[14px] shadow-sm"
              style={{ backgroundColor: user.color }}
            >
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">{user.name}</p>
              <p className="truncate text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-tight leading-none mt-0.5">{user.unit.split('&')[0]}</p>
            </div>
            <button 
              onClick={logout}
              className="grid size-8 place-items-center rounded-lg text-[var(--text-tertiary)] hover:bg-white dark:hover:bg-black hover:text-[#b14343] transition-all"
              title="Sign out"
            >
              <AppIcon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col min-w-0">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface-card)] px-6 lg:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="grid size-10 place-items-center rounded-xl bg-[var(--surface-raised)] border border-[var(--surface-border)]"
            >
              <AppIcon name="dashboard" size={20} />
            </button>
          </div>
          
          <div className="flex flex-1 items-center justify-end gap-3 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-raised)] border border-[var(--surface-border)]">
                <div className={`size-1.5 rounded-full bg-[#1c7b56] shadow-[0_0_8px_rgba(28,123,86,0.4)]`}></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Cloud Sync</span>
            </div>
            
            <button className="grid size-10 place-items-center rounded-xl bg-[var(--surface-raised)] border border-[var(--surface-border)] text-[var(--text-secondary)] hover:bg-[var(--surface-card)] transition-all">
                <AppIcon name="alerts" size={18} />
            </button>
          </div>
        </header>

        <main ref={mainScrollRef} className="flex-1 overflow-y-auto scrollbar-none">
          <Outlet />
        </main>
      </div>
      <FloatingAIWidget />
    </div>
  );
}
