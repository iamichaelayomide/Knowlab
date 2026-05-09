export const motionTokens = {
  durationFast: 120,
  durationBase: 180,
  durationSmooth: 240,
  durationSlow: 320,
  easingStandard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  easingSoft: "cubic-bezier(0.16, 1, 0.3, 1)",
  easingPress: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const interactionClasses = {
  card: "kl-card",
  interactiveCard: "kl-card kl-card-interactive",
  glassButton: "kl-button-glass",
  iconButton: "kl-icon-button",
  navItem: "kl-nav-item",
  filterPill: "kl-filter-pill",
  input: "kl-input",
  aiPanel: "kl-ai-panel",
  aiComposer: "kl-ai-composer",
  uploadControl: "kl-upload-control",
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
