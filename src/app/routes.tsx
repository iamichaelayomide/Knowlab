import { createBrowserRouter, Navigate } from 'react-router';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import StaffDashboard from './pages/staff/StaffDashboard';
import SOPsPage from './pages/staff/SOPsPage';
import SOPDetailPage from './pages/staff/SOPDetailPage';
import TestsPage from './pages/staff/TestsPage';
import TestDetailPage from './pages/staff/TestDetailPage';
import JobAidsPage from './pages/staff/JobAidsPage';
import TrainingPage from './pages/staff/TrainingPage';
import AIAssistantPage from './pages/staff/AIAssistantPage';
import AlertsPage from './pages/staff/AlertsPage';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import MyStaffPage from './pages/supervisor/MyStaffPage';
import QCLogPage from './pages/supervisor/QCLogPage';
import CAPAPage from './pages/supervisor/CAPAPage';
import TrainingMgmtPage from './pages/supervisor/TrainingMgmtPage';
import HODDashboard from './pages/hod/HODDashboard';
import HODStaffPage from './pages/hod/HODStaffPage';
import HODReportsPage from './pages/hod/HODReportsPage';
import SettingsPage from './pages/shared/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  // ─── Staff Routes ────────────────────────────────────────────────────────────
  {
    path: '/staff',
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="/staff/dashboard" replace /> },
      { path: 'dashboard', Component: StaffDashboard },
      { path: 'sops', Component: SOPsPage },
      { path: 'sops/:id', Component: SOPDetailPage },
      { path: 'tests', Component: TestsPage },
      { path: 'tests/:id', Component: TestDetailPage },
      { path: 'job-aids', Component: JobAidsPage },
      { path: 'training', Component: TrainingPage },
      { path: 'ai-assistant', Component: AIAssistantPage },
      { path: 'alerts', Component: AlertsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  // ─── Supervisor Routes ───────────────────────────────────────────────────────
  {
    path: '/supervisor',
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="/supervisor/dashboard" replace /> },
      { path: 'dashboard', Component: SupervisorDashboard },
      { path: 'sops', Component: SOPsPage },
      { path: 'sops/:id', Component: SOPDetailPage },
      { path: 'tests', Component: TestsPage },
      { path: 'tests/:id', Component: TestDetailPage },
      { path: 'job-aids', Component: JobAidsPage },
      { path: 'training', Component: TrainingMgmtPage },
      { path: 'qc-log', Component: QCLogPage },
      { path: 'staff', Component: MyStaffPage },
      { path: 'staff/:staffId', Component: MyStaffPage },
      { path: 'capa', Component: CAPAPage },
      { path: 'alerts', Component: AlertsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  // ─── HOD Routes ──────────────────────────────────────────────────────────────
  {
    path: '/hod',
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="/hod/dashboard" replace /> },
      { path: 'dashboard', Component: HODDashboard },
      { path: 'staff', Component: HODStaffPage },
      { path: 'training', Component: TrainingMgmtPage },
      { path: 'qc', Component: QCLogPage },
      { path: 'reports', Component: HODReportsPage },
      { path: 'capa', Component: CAPAPage },
      { path: 'alerts', Component: AlertsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  // ─── Catch all ───────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
