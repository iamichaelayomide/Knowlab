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

  useEffect(() => {
    if (resolvedTheme === "dark" || resolvedTheme === "light") {
      localStorage.setItem("knowlab-theme", resolvedTheme);
    }
  }, [resolvedTheme]);

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
        className={cn(
          "group relative inline-flex h-9 w-[74px] shrink-0 items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-base)] p-1 text-[var(--text-primary)] shadow-xs transition-all duration-fast hover:bg-[var(--surface-card)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]",
          className,
        )}
        aria-label={nextModeLabel}
        aria-pressed={isDark}
      >
        <span className="absolute left-2.5 inline-flex items-center text-[var(--text-tertiary)] transition-opacity duration-200 group-hover:text-[var(--text-secondary)]">
          <AppIcon name="themeLight" size={11} />
        </span>
        <span className="absolute right-2.5 inline-flex items-center text-[var(--text-tertiary)] transition-opacity duration-200 group-hover:text-[var(--text-secondary)]">
          <AppIcon name="themeDark" size={11} />
        </span>
        <span
          className={cn(
            "relative z-10 grid size-7 place-items-center rounded-full bg-[var(--surface-card)] shadow-sm transition-transform duration-slow ease-spring group-active:rotate-[25deg] group-active:scale-[0.85]",
            isDark && "translate-x-[36px]",
          )}
        >
          <AppIcon name={isDark ? "themeLight" : "themeDark"} size={13} />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex min-w-[132px] items-center justify-between gap-3 rounded-md border border-[var(--surface-border)] bg-[var(--surface-base)] px-3 py-2 text-[13px] font-medium text-[var(--text-primary)] shadow-xs transition-all hover:bg-[var(--surface-card)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] active:[&_svg]:rotate-[25deg] active:[&_svg]:scale-[0.85]",
        className,
      )}
      aria-label={nextModeLabel}
      aria-pressed={isDark}
    >
      <span className="inline-flex items-center gap-2">
        <AppIcon name={isDark ? "themeLight" : "themeDark"} size={14} />
        <span>{isDark ? "Light mode" : "Dark mode"}</span>
      </span>
      <span className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-tertiary)] uppercase">
        {isDark ? "On" : "Off"}
      </span>
    </button>
  );
}
