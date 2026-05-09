import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Bell,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FlaskConical,
  GraduationCap,
  Info,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Pencil,
  Save,
  Search,
  Send,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { cn } from "../ui/utils";

export type AppIconName =
  | "dashboard"
  | "sops"
  | "tests"
  | "jobAids"
  | "training"
  | "ai"
  | "alerts"
  | "settings"
  | "staff"
  | "capa"
  | "qc"
  | "reports"
  | "users"
  | "department"
  | "bench"
  | "menu"
  | "close"
  | "logout"
  | "edit"
  | "save"
  | "search"
  | "send"
  | "themeLight"
  | "themeDark"
  | "arrowRight"
  | "chevronRight"
  | "chevronDown"
  | "check"
  | "warning"
  | "info";

const ICONS: Record<AppIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  sops: FileText,
  tests: FlaskConical,
  jobAids: BookOpen,
  training: GraduationCap,
  ai: Sparkles,
  alerts: Bell,
  settings: Settings,
  staff: Users,
  capa: ShieldAlert,
  qc: ClipboardCheck,
  reports: BarChart2,
  users: UserCog,
  department: Layers,
  bench: FlaskConical,
  menu: Menu,
  close: X,
  logout: LogOut,
  edit: Pencil,
  save: Save,
  search: Search,
  send: Send,
  themeLight: Sun,
  themeDark: Moon,
  arrowRight: ArrowRight,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  check: Check,
  warning: AlertTriangle,
  info: Info,
};

interface AppIconProps {
  name: AppIconName;
  size?: number;
  className?: string;
  title?: string;
  forceFallback?: boolean;
}

export function AppIcon({ name, size = 16, className, title }: AppIconProps) {
  const Icon = ICONS[name] ?? Bot;

  return (
    <Icon
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("inline-flex shrink-0", className)}
      focusable="false"
      size={size}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.65}
    />
  );
}
