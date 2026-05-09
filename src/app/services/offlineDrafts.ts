import type { OfflineResultDraft } from "../data/patients";

const DRAFT_KEY = "knowlab_patient_result_drafts";

export function readOfflineResultDrafts(): OfflineResultDraft[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOfflineResultDraft(draft: OfflineResultDraft) {
  const next = [draft, ...readOfflineResultDrafts().filter((item) => item.id !== draft.id)].slice(0, 50);
  localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  return next;
}

export function removeOfflineResultDraft(id: string) {
  const next = readOfflineResultDrafts().filter((item) => item.id !== id);
  localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  return next;
}
