import { useMemo, useState } from "react";
import { AppIcon } from "../../components/icons/AppIcon";
import { useAuth } from "../../context/AuthContext";
import { decideValidationTask, getWorkflowState } from "../../services/workflowStore";
import { TEXT_TOKENS } from "../../utils/textTokens";

function decisionTone(decision: "pending" | "approved" | "changes_requested" | "rejected") {
  if (decision === "approved") return "bg-[#e8f8f1] text-[#1c7b56]";
  if (decision === "changes_requested") return "bg-[#fff0db] text-[#9a6115]";
  if (decision === "rejected") return "bg-[#fde9e9] text-[#b14343]";
  return "bg-[#eef5ff] text-[#1c5eff]";
}

export default function SOPValidationPage() {
  const { user } = useAuth();
  const [refreshToken, setRefreshToken] = useState(0);
  const [notesByTask, setNotesByTask] = useState<Record<string, string>>({});

  const state = useMemo(() => getWorkflowState(), [refreshToken]);
  const tasks = state.validationTasks.filter((task) => task.assignedHodId === user?.id);

  if (!user) return null;

  const onDecision = (taskId: string, decision: "approved" | "changes_requested" | "rejected") => {
    decideValidationTask({
      taskId,
      hod: user,
      decision,
      notes: notesByTask[taskId] ?? "",
    });
    setRefreshToken((prev) => prev + 1);
  };

  const pendingCount = tasks.filter((task) => task.decision === "pending").length;
  const approvedCount = tasks.filter((task) => task.decision === "approved").length;
  const changesCount = tasks.filter((task) => task.decision === "changes_requested").length;

  return (
    <div className="w-full max-w-[1080px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="mb-5">
        <h1 className="text-[var(--kl-text)] text-[24px] font-semibold mb-1">HOD SOP Validation Queue</h1>
        <p className="text-[var(--kl-text-muted)] text-sm">
          Final validation gate before SOP publication. Decisions remain traceable across review stages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <div className="rounded-[14px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5">
          <p className="text-xs text-[var(--kl-text-muted)]">Pending validation</p>
          <p className="text-lg font-semibold text-[var(--kl-text)]">{pendingCount}</p>
        </div>
        <div className="rounded-[14px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5">
          <p className="text-xs text-[var(--kl-text-muted)]">Validated</p>
          <p className="text-lg font-semibold text-[var(--kl-text)]">{approvedCount}</p>
        </div>
        <div className="rounded-[14px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5">
          <p className="text-xs text-[var(--kl-text-muted)]">Returned for changes</p>
          <p className="text-lg font-semibold text-[var(--kl-text)]">{changesCount}</p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 text-sm text-[var(--kl-text-muted)]">
            No SOPs are awaiting HOD validation.
          </div>
        )}

        {tasks.map((task) => {
          const dueText = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            : "No due date";

          return (
            <article key={task.id} className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="rounded-full bg-[var(--kl-surface-tinted)] text-[var(--kl-primary)] px-2 py-0.5 text-[11px]">{task.sopCode}</span>
                <span className="text-xs text-[var(--kl-text-muted)]">
                  Forwarded by {task.assignedByName}
                  {TEXT_TOKENS.separator}
                  Due {dueText}
                </span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] capitalize ${decisionTone(task.decision)}`}>
                  {task.decision.replace("_", " ")}
                </span>
              </div>

              <h2 className="text-[var(--kl-text)] text-[16px] font-semibold">{task.sopTitle}</h2>

              <textarea
                rows={3}
                value={notesByTask[task.id] ?? task.notes}
                onChange={(event) => setNotesByTask((prev) => ({ ...prev, [task.id]: event.target.value }))}
                placeholder="HOD notes..."
                className="mt-3 w-full rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2 text-sm"
              />

              {task.decision === "pending" && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => onDecision(task.id, "changes_requested")}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#fff0db] text-[#9a6115] px-3 py-1.5 text-xs"
                  >
                    <AppIcon name="warning" size={12} />
                    Return for changes
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
                    <AppIcon name="check" size={12} />
                    Validate and publish
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
