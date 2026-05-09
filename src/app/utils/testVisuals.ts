import type { CSSProperties } from "react";

const COLOR_BY_LABEL: Record<string, string> = {
  red: "#d14343",
  pink: "#ec4899",
  purple: "#9333ea",
  lavender: "#8b5cf6",
  blue: "#2563eb",
  "light blue": "#60a5fa",
  green: "#16a34a",
  yellow: "#f59e0b",
  orange: "#ea580c",
  grey: "#6b7280",
  gray: "#6b7280",
  black: "#111827",
  plain: "#64748b",
};

function normalizeToken(token: string) {
  return token.trim().toLowerCase();
}

export function parseTubeColorTokens(containerColor: string) {
  const normalized = containerColor
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/\//g, " or ")
    .split(/\bor\b|,|&|\+/g)
    .map(normalizeToken)
    .filter(Boolean);
  return normalized;
}

export function resolveTubeColors(containerColor: string) {
  const tokens = parseTubeColorTokens(containerColor);
  const colors = tokens
    .map((token) => {
      if (COLOR_BY_LABEL[token]) return COLOR_BY_LABEL[token];
      const match = Object.entries(COLOR_BY_LABEL).find(([key]) => token.includes(key));
      return match?.[1];
    })
    .filter((color): color is string => Boolean(color));

  if (!colors.length) return ["#64748b"];
  return Array.from(new Set(colors));
}

export function getTubeColorStyle(containerColor: string): CSSProperties {
  const colors = resolveTubeColors(containerColor);
  if (colors.length === 1) return { backgroundColor: colors[0] };

  const gradientStops = colors
    .map((color, index) => `${color} ${(index / colors.length) * 100}% ${(index + 1) / colors.length * 100}%`)
    .join(", ");

  return {
    background: `conic-gradient(${gradientStops})`,
  };
}

export function getContainerToneClass(containerColor: string) {
  const colors = resolveTubeColors(containerColor);
  if (colors.includes("#60a5fa") || colors.includes("#2563eb")) {
    return "text-[#1e40af] bg-[#eff6ff] dark:text-[#bfdbfe] dark:bg-[rgba(59,130,246,0.16)]";
  }
  if (colors.includes("#9333ea") || colors.includes("#8b5cf6")) {
    return "text-[#6d28d9] bg-[#f5f3ff] dark:text-[#ddd6fe] dark:bg-[rgba(139,92,246,0.16)]";
  }
  if (colors.includes("#16a34a")) {
    return "text-[#166534] bg-[#ecfdf3] dark:text-[#bbf7d0] dark:bg-[rgba(22,163,74,0.16)]";
  }
  if (colors.includes("#ea580c") || colors.includes("#f59e0b")) {
    return "text-[#9a3412] bg-[#fff7ed] dark:text-[#fed7aa] dark:bg-[rgba(245,158,11,0.16)]";
  }
  if (colors.includes("#d14343") || colors.includes("#ec4899")) {
    return "text-[#9f1239] bg-[#fff1f2] dark:text-[#fda4af] dark:bg-[rgba(225,29,72,0.16)]";
  }
  return "text-[#475a7d] bg-[#f4f8ff] dark:text-[#c7d2fe] dark:bg-[rgba(99,102,241,0.14)]";
}
