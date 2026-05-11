import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router';
import {
  LayoutDashboard, FileText, FlaskConical, BookOpen, GraduationCap,
  Sparkles, Bell, ClipboardList, Users, ShieldAlert, BarChart2,
  Settings, LogOut, ChevronRight, X, Menu, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { ALERTS } from '../../data/mockData';
import { DepartmentSwitcher } from './DepartmentSwitcher';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

function getNavItems(role: string, base: string): { section: string; items: NavItem[] }[] {
  if (role === 'staff') {
    return [
      {
        section: 'CORE',
        items: [
          { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: `${base}/dashboard` },
          { label: 'SOPs', icon: <FileText size={18} />, path: `${base}/sops` },
          { label: 'Tests', icon: <FlaskConical size={18} />, path: `${base}/tests` },
          { label: 'Job Aids', icon: <BookOpen size={18} />, path: `${base}/job-aids` },
          { label: 'Training', icon: <GraduationCap size={18} />, path: `${base}/training` },
        ],
      },
      {
        section: 'WORKSPACE',
        items: [
          { label: 'AI Assistant', icon: <Sparkles size={18} />, path: `${base}/ai-assistant` },
          { label: 'Alerts', icon: <Bell size={18} />, path: `${base}/alerts` },
          { label: 'Settings', icon: <Settings size={18} />, path: `${base}/settings` },
        ],
      },
    ];
  }
  if (role === 'supervisor') {
    return [
      {
        section: 'CORE',
        items: [
          { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: `${base}/dashboard` },
          { label: 'SOPs', icon: <FileText size={18} />, path: `${base}/sops` },
          { label: 'Tests', icon: <FlaskConical size={18} />, path: `${base}/tests` },
          { label: 'Job Aids', icon: <BookOpen size={18} />, path: `${base}/job-aids` },
          { label: 'Training', icon: <GraduationCap size={18} />, path: `${base}/training` },
          { label: 'QC Log', icon: <ClipboardList size={18} />, path: `${base}/qc-log` },
          { label: 'Results Entry', icon: <FlaskConical size={18} />, path: `${base}/results-entry` },
        ],
      },
      {
        section: 'OVERSIGHT',
        items: [
          { label: 'My Staff', icon: <Users size={18} />, path: `${base}/staff` },
          { label: 'CAPA Items', icon: <ShieldAlert size={18} />, path: `${base}/capa` },
          { label: 'Alerts', icon: <Bell size={18} />, path: `${base}/alerts` },
        ],
      },
    ];
  }
  return [
    {
      section: 'CORE',
      items: [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: `${base}/dashboard` },
        { label: 'SOPs', icon: <FileText size={18} />, path: `${base}/sops` },
        { label: 'Tests', icon: <FlaskConical size={18} />, path: `${base}/tests` },
      ],
    },
  ];
}

function roleBase(role: string) {
  if (role === 'staff') return '/staff';
  if (role === 'supervisor') return '/supervisor';
  return '/hod';
}

function roleLabel(role: string) {
  if (role === 'staff') return 'Staff workspace';
  if (role === 'supervisor') return 'Supervisor workspace';
  return 'HOD workspace';
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const base = roleBase(user.role);
  const navSections = getNavItems(user.role, base);
  const unreadAlerts = ALERTS.filter(a => !a.read && a.targetRoles.includes(user.role)).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // helper to ensure icons inherit color
  const renderIcon = (icon: React.ReactNode) => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, { className: 'flex-shrink-0 text-current' });
    }
    return icon;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="bg-[var(--primary)] rounded-[18px] size-[44px] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-[13px]">LK</span>
        </div>
        <div>
          <div className="text-[var(--foreground)] font-semibold text-[15px] leading-tight">Knowlab</div>
          <div className="text-[var(--muted)] text-[12px]">{roleLabel(user.role)}</div>
        </div>
      </div>

      {/* Department Switcher */}
      <DepartmentSwitcher />

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        {navSections.map(section => (
          <div key={section.section}>
            <p className="text-[var(--muted)] font-semibold text-[11px] tracking-[1.98px] px-2 mb-2">{section.section}</p>
            <div className="space-y-1">
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-[18px] text-[14px] font-medium transition-colors ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-[#475a7d] hover:bg-[#eef4ff] hover:text-[var(--primary)]'
                    }`
                  }
                >
                  {renderIcon(item.icon)}
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Alerts' && unreadAlerts > 0 && (
                    <span className="bg-[var(--danger)] text-white text-[11px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {unreadAlerts}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User profile + logout */}
      <div className="px-3 pb-5">
        <div className="bg-[var(--card)] rounded-[14px] border border-[var(--border)] p-3 flex items-center gap-3">
          <div className="size-[40px] rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: user.color }}>{user.initials}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[var(--foreground)] font-medium text-[14px] truncate">{user.name}</div>
            <div className="text-[var(--muted)] text-[12px] truncate">{roleLabel(user.role)} · {user.unit}</div>
          </div>
          <button onClick={handleLogout} className="text-[var(--muted)] hover:text-[var(--foreground)]">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex">
        <aside className="w-[260px] hidden md:block h-screen fixed left-0 top-0">
          <div className="h-full">
            {SidebarContent()}
          </div>
        </aside>

        <div className="flex-1 md:ml-[260px]">
          <header className="h-[72px] flex items-center justify-between px-4 border-b border-[var(--border)] bg-transparent">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-md">
                <Menu size={20} />
              </button>
              <div className="hidden md:block">
                <div className="text-sm font-semibold">{activeDepartment.shortName} · {activeBench.shortName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-[var(--card)] border border-[var(--border)]">{/* theme toggle placeholder */}
                <Layers size={16} />
              </button>
              <NavLink to={`${base}/alerts`} className="p-2 rounded-full bg-[var(--card)] border border-[var(--border)]">
                <Bell size={16} />
              </NavLink>
            </div>
          </header>

          <main className="p-4">
            <Outlet />
          </main>
        </div>

        {/* mobile sidebar sheet */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[80%] bg-[var(--card)] shadow-lg overflow-y-auto">{SidebarContent()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
