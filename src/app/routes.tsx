import { createBrowserRouter, Navigate } from "react-router";
import AppShell from "./components/layout/AppShell";
import LoginPage from "./pages/LoginPage";
import HODDashboard from "./pages/hod/HODDashboard";
import HODReportsPage from "./pages/hod/HODReportsPage";
import HODStaffPage from "./pages/hod/HODStaffPage";
import SOPValidationPage from "./pages/hod/SOPValidationPage";
import UserManagementPage from "./pages/hod/UserManagementPage";
import AIRouteRedirect from "./pages/shared/AIRouteRedirect";
import SettingsPage from "./pages/shared/SettingsPage";
import AIAssistantPage from "./pages/staff/AIAssistantPage";
import AlertsPage from "./pages/staff/AlertsPage";
import JobAidsPage from "./pages/staff/JobAidsPage";
import SOPCreatePage from "./pages/staff/SOPCreatePage";
import SOPDetailPage from "./pages/staff/SOPDetailPage";
import SOPsPage from "./pages/staff/SOPsPage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import TestDetailPage from "./pages/staff/TestDetailPage";
import TestsPage from "./pages/staff/TestsPage";
import TrainingPage from "./pages/staff/TrainingPage";
import CAPAPage from "./pages/supervisor/CAPAPage";
import MyStaffPage from "./pages/supervisor/MyStaffPage";
import QCLogPage from "./pages/supervisor/QCLogPage";
import SOPReviewQueuePage from "./pages/supervisor/SOPReviewQueuePage";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import TrainingMgmtPage from "./pages/supervisor/TrainingMgmtPage";
import UserRequestPage from "./pages/supervisor/UserRequestPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/staff",
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="/staff/dashboard" replace /> },
      { path: "dashboard", Component: StaffDashboard },
      { path: "sops", Component: SOPsPage },
      { path: "sops/new", Component: SOPCreatePage },
      { path: "sops/:id", Component: SOPDetailPage },
      { path: "tests", Component: TestsPage },
      { path: "tests/:id", Component: TestDetailPage },
      { path: "job-aids", Component: JobAidsPage },
      { path: "training", Component: TrainingPage },
      { path: "ai-assistant", Component: AIRouteRedirect },
      { path: "ai-assistant/legacy", Component: AIAssistantPage },
      { path: "alerts", Component: AlertsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
  {
    path: "/supervisor",
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="/supervisor/dashboard" replace /> },
      { path: "dashboard", Component: SupervisorDashboard },
      { path: "sops", Component: SOPsPage },
      { path: "sops/:id", Component: SOPDetailPage },
      { path: "sops/review", Component: SOPReviewQueuePage },
      { path: "tests", Component: TestsPage },
      { path: "tests/:id", Component: TestDetailPage },
      { path: "job-aids", Component: JobAidsPage },
      { path: "training", Component: TrainingMgmtPage },
      { path: "qc-log", Component: QCLogPage },
      { path: "staff", Component: MyStaffPage },
      { path: "staff/:staffId", Component: MyStaffPage },
      { path: "user-requests", Component: UserRequestPage },
      { path: "capa", Component: CAPAPage },
      { path: "alerts", Component: AlertsPage },
      { path: "settings", Component: SettingsPage },
      { path: "ai-assistant", Component: AIRouteRedirect },
      { path: "ai-assistant/legacy", Component: AIAssistantPage },
    ],
  },
  {
    path: "/hod",
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="/hod/dashboard" replace /> },
      { path: "dashboard", Component: HODDashboard },
      { path: "staff", Component: HODStaffPage },
      { path: "staff/:staffId", Component: HODStaffPage },
      { path: "users", Component: UserManagementPage },
      { path: "sops/validation", Component: SOPValidationPage },
      { path: "training", Component: TrainingMgmtPage },
      { path: "qc", Component: QCLogPage },
      { path: "reports", Component: HODReportsPage },
      { path: "capa", Component: CAPAPage },
      { path: "alerts", Component: AlertsPage },
      { path: "settings", Component: SettingsPage },
      { path: "ai-assistant", Component: AIRouteRedirect },
      { path: "ai-assistant/legacy", Component: AIAssistantPage },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
