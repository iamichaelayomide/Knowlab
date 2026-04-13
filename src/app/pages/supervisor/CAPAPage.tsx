import { useMemo, useState } from "react";
import type { CAPAItem } from "../../data/mockData";
import { CAPA_ITEMS, getUserById } from "../../data/mockData";
import { AppIcon } from "../../components/icons/AppIcon";
import { TEXT_TOKENS } from "../../utils/textTokens";

const STORE_KEY = "knowlab_capa_updates_v1";

const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "text-[#b14343]", bg: "bg-[#fde9e9]", dot: "bg-[#b14343]" },
  high: { label: "High", color: "text-[#9a6115]", bg: "bg-[#fff0db]", dot: "bg-[#9a6115]" },
  medium: { label: "Medium", color: "text-[#1c5eff]", bg: "bg-[#e3edff]", dot: "bg-[#1c5eff]" },
  low: { label: "Low", color: "text-[#73839f]", bg: "bg-[#f4f8ff]", dot: "bg-[#73839f]" },
} as const;

const STATUS_CONFIG = {
  open: { label: "Open", color: "text-[#b14343]", bg: "bg-[#fde9e9]" },
  in_progress: { label: "In Progress", color: "text-[#9a6115]", bg: "bg-[#fff0db]" },
  completed: { label: "Completed", color: "text-[#1c7b56]", bg: "bg-[#e8f8f1]" },
  overdue: { label: "Overdue", color: "text-[#b14343]", bg: "bg-[#fde9e9]" },
} as const;

function loadItems() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return CAPA_ITEMS;
  try {
    return JSON.parse(raw) as CAPAItem[];
  } catch {
    return CAPA_ITEMS;
  }
}

function saveItems(items: CAPAItem[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(items));
}

function valueOrPlaceholder(value?: string) {
  return value && value.trim().length ? value : "Not documented yet.";
}

export default function CAPAPage() {
  const [items, setItems] = useState<CAPAItem[]>(() => loadItems());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "completed">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, CAPAItem>>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filter === "all") return true;
      return item.status === filter || (filter === "open" && item.status === "overdue");
    });
  }, [filter, items]);

  const stats = useMemo(
    () => ({
      open: items.filter((item) => item.status === "open").length,
      in_progress: items.filter((item) => item.status === "in_progress").length,
      completed: items.filter((item) => item.status === "completed").length,
      critical: items.filter((item) => item.priority === "critical" && item.status !== "completed").length,
    }),
    [items],
  );

  const updatePersistedItems = (updater: (items: CAPAItem[]) => CAPAItem[]) => {
    setItems((prev) => {
      const next = updater(prev);
      saveItems(next);
      return next;
    });
  };

  const beginEdit = (item: CAPAItem) => {
    setEditingId(item.id);
    setDrafts((prev) => ({ ...prev, [item.id]: { ...item } }));
  };

  const cancelEdit = (itemId: string) => {
    setEditingId(null);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const saveEdit = (itemId: string) => {
    const draft = drafts[itemId];
    if (!draft) return;
    updatePersistedItems((prev) => prev.map((item) => (item.id === itemId ? { ...draft } : item)));
    setEditingId(null);
    setSavedId(itemId);
    setTimeout(() => setSavedId(null), 1200);
  };

  const updateDraft = (itemId: string, patch: Partial<CAPAItem>) => {
    setDrafts((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], ...patch },
    }));
  };

  const markComplete = (itemId: string) => {
    updatePersistedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "completed",
              closedDate: new Date().toISOString().slice(0, 10),
            }
          : item,
      ),
    );
  };

  return (
    <div className="kl-page">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">CAPA Items</h1>
        <p className="text-[#73839f] text-[14px]">Read-only by default. Use Edit Mode to make controlled changes.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Open", count: stats.open, color: "#b14343", bg: "#fde9e9", f: "open" as const },
          { label: "In Progress", count: stats.in_progress, color: "#9a6115", bg: "#fff0db", f: "in_progress" as const },
          { label: "Completed", count: stats.completed, color: "#1c7b56", bg: "#e8f8f1", f: "completed" as const },
          { label: "Critical", count: stats.critical, color: "#b14343", bg: "#fde9e9", f: "open" as const },
        ].map((entry) => (
          <button
            key={entry.label}
            onClick={() => setFilter(filter === entry.f ? "all" : entry.f)}
            className="rounded-[18px] p-4 text-left transition-all border-2"
            style={{ backgroundColor: entry.bg, borderColor: filter === entry.f ? entry.color : "transparent" }}
          >
            <p className="font-bold text-[22px]" style={{ color: entry.color }}>
              {entry.count}
            </p>
            <p className="text-[12px] font-medium" style={{ color: entry.color }}>
              {entry.label}
            </p>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          const isEditing = editingId === item.id;
          const current = drafts[item.id] ?? item;
          const priority = PRIORITY_CONFIG[item.priority];
          const status = STATUS_CONFIG[item.status];
          const assignee = getUserById(item.assignedTo);
          const isOverdue = new Date(item.dueDate) < new Date() && item.status !== "completed";

          return (
            <div
              key={item.id}
              className={`bg-white rounded-[20px] border overflow-hidden ${
                item.priority === "critical" && item.status !== "completed" ? "border-[#f5c0c0]" : "border-[#d3def5]"
              }`}
            >
              <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className="w-full p-5 text-left hover:bg-[#f9fbff] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${priority.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-[#11203b] font-semibold text-[14px] leading-snug">{item.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
                          {priority.label.toUpperCase()}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                        <AppIcon name={isExpanded ? "chevronDown" : "chevronRight"} size={15} className="text-[#73839f]" />
                      </div>
                    </div>
                    <p className="text-[#475a7d] text-[13px] leading-relaxed line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-[#73839f]">
                      <span>{item.code}</span>
                      <span>Assigned: {assignee?.name || "Unassigned"}</span>
                      <span className={isOverdue ? "text-[#b14343] font-semibold" : ""}>
                        Due: {new Date(item.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        {isOverdue ? `${TEXT_TOKENS.separator}OVERDUE` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[#f4f8ff] p-5 bg-[#f9fbff] space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f8ff] px-2.5 py-1 text-[11px] text-[#475a7d] border border-[#d3def5]">
                      <AppIcon name="info" size={11} />
                      {isEditing ? "Edit mode enabled" : "Read-only mode"}
                    </span>
                    {!isEditing ? (
                      <button
                        onClick={() => beginEdit(item)}
                        className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#1c5eff] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#1548e8]"
                      >
                        <AppIcon name="edit" size={12} />
                        Edit item
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#1c5eff] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#1548e8]"
                        >
                          <AppIcon name="save" size={12} />
                          {savedId === item.id ? "Saved" : "Save changes"}
                        </button>
                        <button
                          onClick={() => cancelEdit(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#eef5ff] text-[#475a7d] px-3 py-1.5 text-[12px] font-medium border border-[#d3def5]"
                        >
                          <AppIcon name="close" size={12} />
                          Cancel
                        </button>
                        {current.status !== "completed" && (
                          <button
                            onClick={() => markComplete(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#e8f8f1] text-[#1c7b56] px-3 py-1.5 text-[12px] font-medium"
                          >
                            <AppIcon name="check" size={12} />
                            Mark complete
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#73839f] font-semibold uppercase tracking-[0.8px] mb-1">Status</label>
                      {isEditing ? (
                        <select
                          value={current.status}
                          onChange={(event) => updateDraft(item.id, { status: event.target.value as CAPAItem["status"] })}
                          className="w-full border border-[#d3def5] rounded-[10px] px-2.5 py-2 text-[12px]"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="overdue">Overdue</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <p className="rounded-[10px] border border-[#d3def5] bg-white px-3 py-2 text-[12px] text-[#11203b]">{status.label}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#73839f] font-semibold uppercase tracking-[0.8px] mb-1">Due Date</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={current.dueDate}
                          onChange={(event) => updateDraft(item.id, { dueDate: event.target.value })}
                          className="w-full border border-[#d3def5] rounded-[10px] px-2.5 py-2 text-[12px]"
                        />
                      ) : (
                        <p className="rounded-[10px] border border-[#d3def5] bg-white px-3 py-2 text-[12px] text-[#11203b]">
                          {new Date(item.dueDate).toLocaleDateString("en-GB")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#73839f] font-semibold uppercase tracking-[0.8px] mb-1">Root Cause Analysis</label>
                    {isEditing ? (
                      <textarea
                        value={current.rootCause ?? ""}
                        onChange={(event) => updateDraft(item.id, { rootCause: event.target.value })}
                        rows={3}
                        className="w-full border border-[#d3def5] rounded-[10px] px-3 py-2 text-[12px]"
                      />
                    ) : (
                      <p className="rounded-[10px] border border-[#d3def5] bg-white px-3 py-2 text-[12px] text-[#475a7d] whitespace-pre-wrap">
                        {valueOrPlaceholder(item.rootCause)}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#73839f] font-semibold uppercase tracking-[0.8px] mb-1">Corrective Action</label>
                      {isEditing ? (
                        <textarea
                          value={current.correctiveAction ?? ""}
                          onChange={(event) => updateDraft(item.id, { correctiveAction: event.target.value })}
                          rows={4}
                          className="w-full border border-[#d3def5] rounded-[10px] px-3 py-2 text-[12px]"
                        />
                      ) : (
                        <p className="rounded-[10px] border border-[#d3def5] bg-white px-3 py-2 text-[12px] text-[#475a7d] whitespace-pre-wrap">
                          {valueOrPlaceholder(item.correctiveAction)}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#73839f] font-semibold uppercase tracking-[0.8px] mb-1">Preventive Action</label>
                      {isEditing ? (
                        <textarea
                          value={current.preventiveAction ?? ""}
                          onChange={(event) => updateDraft(item.id, { preventiveAction: event.target.value })}
                          rows={4}
                          className="w-full border border-[#d3def5] rounded-[10px] px-3 py-2 text-[12px]"
                        />
                      ) : (
                        <p className="rounded-[10px] border border-[#d3def5] bg-white px-3 py-2 text-[12px] text-[#475a7d] whitespace-pre-wrap">
                          {valueOrPlaceholder(item.preventiveAction)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

