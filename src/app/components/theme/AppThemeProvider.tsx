import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

export function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange storageKey="knowlab-theme">
      {children}
    </ThemeProvider>
  );
}
