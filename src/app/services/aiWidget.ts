const EVENT_NAME = "knowlab-ai:open";

export interface OpenAIWidgetDetail {
  prefill?: string;
}

export function openFloatingAI(prefill?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OpenAIWidgetDetail>(EVENT_NAME, { detail: { prefill } }));
}

export function getOpenFloatingAIEventName() {
  return EVENT_NAME;
}
