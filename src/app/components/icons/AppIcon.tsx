import type { Icon } from "iconsax-react";
import {
  Activity,
  Add,
  ArrowDown2,
  ArrowRight2,
  BookSaved,
  Category,
  Chart2,
  ClipboardText,
  ClipboardTick,
  CloseCircle,
  Data2,
  DocumentText,
  Drop,
  Eye,
  EyeSlash,
  ChemicalGlass,
  Health,
  Home2,
  Hospital,
  InfoCircle,
  Key,
  Layer,
  LogoutCurve,
  MagicStar,
  Menu,
  Microscope,
  Moon,
  Notification,
  Profile2User,
  Save2,
  SearchNormal1,
  Send2,
  Setting2,
  ShieldSecurity,
  Sun1,
  Teacher,
  TickCircle,
  Warning2,
} from "iconsax-react";
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
  | "haematology"
  | "chemistry"
  | "microbiology"
  | "histopathology"
  | "bloodBank"
  | "fbc"
  | "bloodFilm"
  | "coagulation"
  | "renal"
  | "lipid"
  | "electrolytes"
  | "bacteriology"
  | "molecular"
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
  | "info"
  | "eye"
  | "eyeSlash"
  | "key"
  | "add";

const ICONS: Record<AppIconName, Icon> = {
  dashboard: Home2,
  sops: DocumentText,
  tests: ChemicalGlass,
  jobAids: BookSaved,
  training: Teacher,
  ai: MagicStar,
  alerts: Notification,
  settings: Setting2,
  staff: Profile2User,
  capa: ShieldSecurity,
  qc: ClipboardTick,
  reports: Chart2,
  users: Profile2User,
  department: Hospital,
  bench: Activity,
  haematology: Drop,
  chemistry: ChemicalGlass,
  microbiology: Microscope,
  histopathology: Health,
  bloodBank: Data2,
  fbc: Activity,
  bloodFilm: SearchNormal1,
  coagulation: ShieldSecurity,
  renal: Health,
  lipid: Chart2,
  electrolytes: Category,
  bacteriology: Microscope,
  molecular: Layer,
  menu: Menu,
  close: CloseCircle,
  logout: LogoutCurve,
  edit: ClipboardText,
  save: Save2,
  search: SearchNormal1,
  send: Send2,
  themeLight: Sun1,
  themeDark: Moon,
  arrowRight: ArrowRight2,
  chevronRight: ArrowRight2,
  chevronDown: ArrowDown2,
  check: TickCircle,
  warning: Warning2,
  info: InfoCircle,
  eye: Eye,
  eyeSlash: EyeSlash,
  key: Key,
  add: Add,
};

interface AppIconProps {
  name: AppIconName;
  size?: number;
  className?: string;
  title?: string;
  forceFallback?: boolean;
}

export function AppIcon({ name, size = 16, className, title }: AppIconProps) {
  const Icon = ICONS[name] ?? Activity;

  return (
    <Icon
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("inline-flex shrink-0", className)}
      color="currentColor"
      focusable="false"
      size={size}
      strokeWidth={1.05}
      variant="Linear"
    />
  );
}
