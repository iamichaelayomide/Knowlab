import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AppIcon } from "../icons/AppIcon";
import { cn } from "../ui/utils";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";
  const nextModeLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        data-state={isDark ? "dark" : "light"}
        className={cn(
          "theme-toggle group shrink-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--accent-glow)]",
          className,
        )}
        aria-label={nextModeLabel}
        aria-pressed={isDark}
      >
        <span className="relative z-10 ml-[11px] inline-flex items-center text-[var(--text-tertiary)] transition-colors group-hover:text-[var(--text-secondary)]">
          <AppIcon name="themeLight" size={13} />
        </span>
        <span className="relative z-10 mr-[11px] inline-flex items-center text-[var(--text-tertiary)] transition-colors group-hover:text-[var(--text-secondary)]">
          <AppIcon name="themeDark" size={13} />
        </span>
        <span className="theme-toggle-thumb">
          <AppIcon name={isDark ? "themeDark" : "themeLight"} size={14} />
        </span>
      </button>
    );
  }

  return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        data-state={isDark ? "dark" : "light"}
        className={cn(
        "inline-flex min-w-[148px] items-center justify-between gap-3 rounded-full border border-[var(--surface-border-strong)] bg-[var(--glass-bg)] px-3 py-2 text-[13px] font-medium text-[var(--text-primary)] shadow-glass backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-card)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--accent-glow)]",
        className,
      )}
      aria-label={nextModeLabel}
      aria-pressed={isDark}
    >
      <span className="inline-flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-[var(--glass-bg)]">
          <AppIcon name={isDark ? "themeDark" : "themeLight"} size={14} />
        </span>
        <span>{isDark ? "Dark mode" : "Light mode"}</span>
      </span>
      <span className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-tertiary)] uppercase">
        {isDark ? "On" : "Off"}
      </span>
    </button>
  );
}
