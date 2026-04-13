import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FlaskConical,
  GraduationCap,
  Info,
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
  Sun,
  Users,
  UserCog,
  BarChart2,
  FileText,
  Layers,
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

const ICONS8_PRIMARY_CLASS: Record<AppIconName, string> = {
  dashboard: "las la-th-large",
  sops: "las la-file-alt",
  tests: "las la-vial",
  jobAids: "las la-book-open",
  training: "las la-graduation-cap",
  ai: "las la-magic",
  alerts: "las la-bell",
  settings: "las la-cog",
  staff: "las la-users",
  capa: "las la-shield-alt",
  qc: "las la-clipboard-check",
  reports: "las la-chart-line",
  users: "las la-user-cog",
  department: "las la-layer-group",
  bench: "las la-dna",
  menu: "las la-bars",
  close: "las la-times",
  logout: "las la-sign-out-alt",
  edit: "las la-pen",
  save: "las la-save",
  search: "las la-search",
  send: "las la-paper-plane",
  themeLight: "las la-sun",
  themeDark: "las la-moon",
  arrowRight: "las la-arrow-right",
  chevronRight: "las la-angle-right",
  chevronDown: "las la-angle-down",
  check: "las la-check",
  warning: "las la-exclamation-triangle",
  info: "las la-info-circle",
};

const LUCIDE_FALLBACK: Record<AppIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  sops: FileText,
  tests: FlaskConical,
  jobAids: BookOpen,
  training: GraduationCap,
  ai: Bot,
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

export function AppIcon({ name, size = 16, className, title, forceFallback = false }: AppIconProps) {
  const fallback = LUCIDE_FALLBACK[name];
  const icons8Class = ICONS8_PRIMARY_CLASS[name];

  if (!forceFallback && icons8Class) {
    return (
      <span
        title={title}
        aria-hidden={title ? undefined : true}
        className={cn("inline-flex items-center justify-center leading-none", className)}
        style={{ fontSize: size, width: size, height: size }}
      >
        <i className={cn(icons8Class, "la-fw")} />
      </span>
    );
  }

  return fallback ? <fallback size={size} className={className} aria-hidden={title ? undefined : true} /> : null;
}
