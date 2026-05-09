export const THEME_STORAGE_KEY = "knowlab_theme";
const LEGACY_THEME_STORAGE_KEY = "knowlab-theme";

export type KnowlabTheme = "light" | "dark";

export const getInitialTheme = (): KnowlabTheme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyTheme = (theme: KnowlabTheme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const toggleTheme = () => {
  if (typeof document === "undefined") return;
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
};
