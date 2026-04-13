import { useMemo, useState } from "react";
import { AppIcon } from "../../components/icons/AppIcon";
import { useAuth } from "../../context/AuthContext";
import { USERS } from "../../data/mockData";
import { assignSOPWritingTask, decideReviewTask, getWorkflowState } from "../../services/workflowStore";
import { TEXT_TOKENS } from "../../utils/textTokens";

const FILTERS = ["pending", "changes_requested", "approved", "rejected"] as const;

type FilterValue = (typeof FILTERS)[number];

function decisionTone(decision: FilterValue | "all") {
  if (decision === "approved") return "bg-[#e8f8f1] text-[#1c7b56]";
  if (decision === "changes_requested") return "bg-[#fff0db] text-[#9a6115]";
  if (decision === "rejected") return "bg-[#fde9e9] text-[#b14343]";
  return "bg-[#eef5ff] text-[#1c5eff]";
}

export default function SOPReviewQueuePage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterValue>("pending");
  const [refreshToken, setRefreshToken] = useState(0);
  const [commentByTask, setCommentByTask] = useState<Record<string, string>>({});
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDue, setAssignmentDue] = useState("");

  const state = useMemo(() => getWorkflowState(), [refreshToken]);
  const ownTasks = state.reviewTasks.filter((task) => task.assignedReviewerId === user?.id);
  const tasks = ownTasks.filter((task) => task.decision === filter);
  const staffInUnit = USERS.filter(
    (candidate) => candidate.role === "staff" && (candidate.unit === user?.unit || user?.role === "supervisor"),
  );

  if (!user) return null;

  const onDecision = (taskId: string, decision: "approved" | "changes_requested" | "rejected") => {
    decideReviewTask({
      taskId,
      supervisor: user,
      decision,
      comments: commentByTask[taskId] ?? "",
    });
    setRefreshToken((prev) => prev + 1);
  };

  const assignDraft = (event: React.FormEvent) => {
    event.preventDefault();
    if (!assignedStaffId || !assignmentTitle.trim()) return;

    assignSOPWritingTask({
      supervisor: user,
      staffId: assignedStaffId,
      title: assignmentTitle,
      dueDate: assignmentDue || undefined,
    });

    setAssignmentTitle("");
    setAssignmentDue("");
    setRefreshToken((prev) => prev + 1);
  };

  const pendingCount = ownTasks.filter((task) => task.decision === "pending").length;
  const awaitingHod = state.validationTasks.filter((task) => task.decision === "pending").length;

  return (
    <div className="kl-page">
      <div className="mb-5">
        <h1 className="text-[var(--kl-text)] text-[24px] font-semibold mb-1">SOP Review Queue</h1>
        <p className="text-[var(--kl-text-muted)] text-sm">
          Review drafts, request revisions, and forward approved SOPs to HOD validation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <div className="rounded-[14px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5">
          <p className="text-xs text-[var(--kl-text-muted)]">Pending my review</p>
          <p className="text-lg font-semibold text-[var(--kl-text)]">{pendingCount}</p>
        </div>
        <div className="rounded-[14px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5">
          <p className="text-xs text-[var(--kl-text-muted)]">Awaiting HOD validation</p>
          <p className="text-lg font-semibold text-[var(--kl-text)]">{awaitingHod}</p>
        </div>
        <div className="rounded-[14px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5">
          <p className="text-xs text-[var(--kl-text-muted)]">Total assigned to me</p>
          <p className="text-lg font-semibold text-[var(--kl-text)]">{ownTasks.length}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {FILTERS.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
              filter === option
                ? "border-[var(--kl-primary)] bg-[var(--kl-surface-tinted)] text-[var(--kl-primary)]"
                : "border-[var(--kl-border)] bg-[var(--kl-surface)] text-[var(--kl-text-muted)]"
            }`}
          >
            {option.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <form onSubmit={assignDraft} className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--kl-text)] mb-2">Assign SOP writing task</p>
          <div className="grid md:grid-cols-4 gap-2">
            <input
              value={assignmentTitle}
              onChange={(event) => setAssignmentTitle(event.target.value)}
              placeholder="SOP topic/title"
              className="md:col-span-2 rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2 text-sm"
            />
            <select
              value={assignedStaffId}
              onChange={(event) => setAssignedStaffId(event.target.value)}
              className="rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2 text-sm"
            >
              <option value="">Assign to staff...</option>
              {staffInUnit.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={assignmentDue}
              onChange={(event) => setAssignmentDue(event.target.value)}
              className="rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="mt-2 rounded-[10px] bg-[var(--kl-primary)] text-white px-3 py-1.5 text-xs font-medium">
            Assign task
          </button>
        </form>

        {tasks.length === 0 && (
          <div className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 text-sm text-[var(--kl-text-muted)]">
            No review tasks in this filter.
          </div>
        )}

        {tasks.map((task) => {
          const dueText = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            : "No due date";

          return (
            <article key={task.id} className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-[var(--kl-surface-tinted)] text-[var(--kl-primary)] px-2 py-0.5 text-[11px]">{task.sopCode}</span>
                <span className="text-xs text-[var(--kl-text-muted)]">
                  {task.assignedByName}
                  {TEXT_TOKENS.separator}
                  Due {dueText}
                </span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] capitalize ${decisionTone(task.decision)}`}>
                  {task.decision.replace("_", " ")}
                </span>
              </div>
              <h2 className="text-[var(--kl-text)] text-[16px] font-semibold">{task.sopTitle}</h2>

              <textarea
                value={commentByTask[task.id] ?? task.comments}
                onChange={(event) => setCommentByTask((prev) => ({ ...prev, [task.id]: event.target.value }))}
                rows={3}
                placeholder="Reviewer comments..."
                className="mt-3 w-full rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2 text-sm"
              />

              {task.decision === "pending" && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => onDecision(task.id, "changes_requested")}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#fff0db] text-[#9a6115] px-3 py-1.5 text-xs"
                  >
                    <AppIcon name="warning" size={12} />
                    Request changes
                  </button>
                  <button
                    onClick={() => onDecision(task.id, "rejected")}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#fde9e9] text-[#b14343] px-3 py-1.5 text-xs"
                  >
                    <AppIcon name="close" size={12} />
                    Reject
                  </button>
                  <button
                    onClick={() => onDecision(task.id, "approved")}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#e8f8f1] text-[#1c7b56] px-3 py-1.5 text-xs"
                  >
                    <AppIcon name="arrowRight" size={12} />
                    Approve to HOD
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

