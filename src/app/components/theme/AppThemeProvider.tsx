import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { THEME_STORAGE_KEY } from "../../utils/theme";

export function AppThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const legacyTheme = window.localStorage.getItem("knowlab-theme");
    const currentTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!currentTheme && (legacyTheme === "dark" || legacyTheme === "light")) {
      window.localStorage.setItem(THEME_STORAGE_KEY, legacyTheme);
    }
  }, []);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange storageKey={THEME_STORAGE_KEY}>
      {children}
    </ThemeProvider>
  );
}
