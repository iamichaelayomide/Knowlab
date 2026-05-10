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
          { label: 'Settings', icon: <Settings size={18} />, path: `${base}/settings` },
        ],
      },
    ];
  }
  // HOD
  return [
    {
      section: 'OVERVIEW',
      items: [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: `${base}/dashboard` },
        { label: 'Staff', icon: <Users size={18} />, path: `${base}/staff` },
        { label: 'Training', icon: <GraduationCap size={18} />, path: `${base}/training` },
        { label: 'QC Overview', icon: <ClipboardList size={18} />, path: `${base}/qc` },
        { label: 'Results Entry', icon: <FlaskConical size={18} />, path: `${base}/results-entry` },
        { label: 'Reports', icon: <BarChart2 size={18} />, path: `${base}/reports` },
      ],
    },
    {
      section: 'MANAGEMENT',
      items: [
        { label: 'CAPA', icon: <ShieldAlert size={18} />, path: `${base}/capa` },
        { label: 'Alerts', icon: <Bell size={18} />, path: `${base}/alerts` },
        { label: 'Settings', icon: <Settings size={18} />, path: `${base}/settings` },
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="bg-[#1c5eff] rounded-[18px] size-[44px] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-[13px]">LK</span>
        </div>
        <div>
          <div className="text-[#11203b] font-semibold text-[15px] leading-tight">Knowlab</div>
          <div className="text-[#73839f] text-[12px]">{roleLabel(user.role)}</div>
        </div>
      </div>

      {/* Department Switcher */}
      <DepartmentSwitcher />

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        {navSections.map(section => (
          <div key={section.section}>
            <p className="text-[#73839f] font-semibold text-[11px] tracking-[1.98px] px-2 mb-2">{section.section}</p>
            <div className="space-y-1">
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-[18px] text-[14px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#e3edff] text-[#1c5eff]'
                        : 'text-[#475a7d] hover:bg-[#eef4ff] hover:text-[#1c5eff]'
                    }`
                  }
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Alerts' && unreadAlerts > 0 && (
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

      {/* User profile + logout */}
      <div className="px-3 pb-5">
        <div className="bg-white border border-[#d3def5] rounded-[18px] p-3.5 flex items-center gap-3">
          <div
            className="rounded-full size-[40px] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[#11203b] font-semibold text-[13px] truncate">{user.name}</div>
            <div className="text-[#73839f] text-[11px] truncate">{user.unit}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#73839f] hover:text-[#b14343] transition-colors p-1"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[272px] flex-shrink-0 bg-card border-r border-border h-full overflow-hidden transition-colors duration-200">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-[272px] bg-card border-r border-border h-full overflow-hidden z-10 transition-colors duration-200">
            <button
              className="absolute top-4 right-4 text-[#73839f] p-1"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-card/95 border-b border-border h-[68px] flex items-center px-4 sm:px-6 gap-4 flex-shrink-0 backdrop-blur-sm transition-colors duration-200">
          <button
            className="lg:hidden text-[#475a7d] p-1"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Dept + Bench breadcrumb */}
          <div className="flex items-center gap-2 flex-1">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-[12px] font-semibold"
              style={{ backgroundColor: activeDepartment.color + '18', color: activeDepartment.color }}
            >
              <Layers size={12} />
              {activeDepartment.shortName}
            </div>
            <ChevronRight size={12} className="hidden sm:block text-[#c5d0e4]" />
            <div className="hidden sm:flex items-center gap-1.5 bg-[#eef4ff] text-[#475a7d] text-[12px] font-medium px-2.5 py-1 rounded-[10px]">
              <span
                className="inline-block size-[6px] rounded-full flex-shrink-0"
                style={{ backgroundColor: activeBench.color }}
              />
              {activeBench.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to={`${base}/alerts`}
              className="relative safe-button bg-card border border-border rounded-[14px] px-3 py-2 text-foreground text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Bell size={14} />
              Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b14343] text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                  {unreadAlerts}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
