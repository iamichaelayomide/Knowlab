import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AppIcon } from "../icons/AppIcon";

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

  if (compact) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={className}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AppIcon name={isDark ? "themeLight" : "themeDark"} size={15} />
      </button>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-1.5 text-[12px] text-[var(--kl-text)] hover:bg-[var(--kl-surface-soft)] transition-colors"
      >
        <AppIcon name={isDark ? "themeLight" : "themeDark"} size={14} />
        {isDark ? "Light mode" : "Dark mode"}
      </button>
    </div>
  );
}
