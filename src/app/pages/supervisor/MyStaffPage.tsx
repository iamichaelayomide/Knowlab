import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppIcon } from "../../components/icons/AppIcon";
import { useDepartment } from "../../context/DepartmentContext";
import {
  TRAINING_MODULES,
  TRAINING_RECORDS,
  getStaffUsers,
  getUserById,
  type User,
} from "../../data/mockData";
import { TEXT_TOKENS, joinWithSeparator } from "../../utils/textTokens";
import { filterStaffByBench, filterStaffByDepartment, groupStaffByBench } from "../../utils/staffScope";

function competencyTone(score: number) {
  if (score >= 85) return "text-[#1c7b56] bg-[#e8f8f1]";
  if (score >= 70) return "text-[#9a6115] bg-[#fff0db]";
  return "text-[#b14343] bg-[#fde9e9]";
}

function StaffDetailView({ staffId }: { staffId: string }) {
  const navigate = useNavigate();
  const staff = getUserById(staffId);

  if (!staff) {
    return (
      <div className="p-6">
        <p className="text-[var(--kl-text-muted)] text-sm">Staff member not found.</p>
      </div>
    );
  }

  const records = TRAINING_RECORDS.filter((record) => record.staffId === staff.id);
  const completed = records.filter((record) => record.status === "completed").length;
  const inProgress = records.filter((record) => record.status === "in_progress").length;
  const overdue = records.filter((record) => record.status === "overdue").length;
  const competency = staff.competencyScore ?? 0;
  const completedModules = records
    .filter((record) => record.status === "completed")
    .map((record) => TRAINING_MODULES.find((module) => module.id === record.moduleId))
    .filter((module): module is (typeof TRAINING_MODULES)[number] => Boolean(module));

  return (
    <div className="kl-page">
      <button
        onClick={() => navigate("/supervisor/staff")}
        className="inline-flex items-center gap-2 text-sm text-[var(--kl-text-muted)] hover:text-[var(--kl-primary)] transition-colors"
      >
        <AppIcon name="arrowRight" size={14} className="rotate-180" />
        Back to staff overview
      </button>

      <div className="mt-4 rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 shadow-[var(--kl-shadow)]">
        <div className="flex items-start gap-4">
          <div
            className="size-14 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: staff.color }}
          >
            {staff.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[var(--kl-text)] text-xl font-semibold truncate">{staff.name}</h1>
            <p className="text-[var(--kl-text-muted)] text-sm truncate">{staff.unit}</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Role</p>
                <p className="text-sm text-[var(--kl-text)] font-medium">Lab Scientist</p>
              </div>
              <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Joined</p>
                <p className="text-sm text-[var(--kl-text)] font-medium">
                  {new Date(staff.joinDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Competency</p>
                <p className={`text-sm font-semibold ${competency >= 85 ? "text-[#1c7b56]" : competency >= 70 ? "text-[#9a6115]" : "text-[#b14343]"}`}>
                  {competency}%
                </p>
              </div>
              <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Training</p>
                <p className="text-sm text-[var(--kl-text)] font-medium">{completed}/{TRAINING_MODULES.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--kl-text-muted)]">Overall Competency</span>
            <span className={competency >= 85 ? "text-[#1c7b56]" : competency >= 70 ? "text-[#9a6115]" : "text-[#b14343]"}>
              {competency}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--kl-surface-tinted)] overflow-hidden">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.max(0, Math.min(100, competency))}%`,
                backgroundColor: competency >= 85 ? "#1c7b56" : competency >= 70 ? "#9a6115" : "#b14343",
              }}
            />
          </div>
          {competency < 80 && (
            <p className="mt-1.5 text-xs text-[#b14343] inline-flex items-center gap-1">
              <AppIcon name="warning" size={11} />
              Below 80% threshold. Coaching and reassessment recommended.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5">
        <h2 className="text-[var(--kl-text)] text-base font-semibold inline-flex items-center gap-2 mb-3">
          <AppIcon name="training" size={16} className="text-[var(--kl-primary)]" />
          Training status
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: "Completed", value: completed, tone: "text-[#1c7b56] bg-[#e8f8f1]" },
            { label: "In Progress", value: inProgress, tone: "text-[#9a6115] bg-[#fff0db]" },
            { label: "Overdue", value: overdue, tone: "text-[#b14343] bg-[#fde9e9]" },
            {
              label: "Not Started",
              value: Math.max(0, TRAINING_MODULES.length - completed - inProgress - overdue),
              tone: "text-[var(--kl-text-muted)] bg-[var(--kl-surface-tinted)]",
            },
          ].map((tile) => (
            <div key={tile.label} className={`rounded-[12px] px-3 py-2 ${tile.tone}`}>
              <p className="text-lg font-semibold leading-none">{tile.value}</p>
              <p className="text-[11px] mt-1">{tile.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {TRAINING_MODULES.map((module) => {
            const record = records.find((entry) => entry.moduleId === module.id);
            const status = record?.status ?? "not_started";
            const tone =
              status === "completed"
                ? "text-[#1c7b56] bg-[#e8f8f1]"
                : status === "overdue"
                  ? "text-[#b14343] bg-[#fde9e9]"
                  : status === "in_progress"
                    ? "text-[#9a6115] bg-[#fff0db]"
                    : "text-[var(--kl-text-muted)] bg-[var(--kl-surface-tinted)]";

            return (
              <div key={module.id} className="rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5 flex items-start gap-2">
                <span className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}>
                  {status.replace("_", " ")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--kl-text)] font-medium truncate">{module.title}</p>
                  <p className="text-xs text-[var(--kl-text-muted)]">
                    {joinWithSeparator([module.category, module.duration, record?.score ? `${record.score}%` : null])}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5">
        <h2 className="text-[var(--kl-text)] text-base font-semibold inline-flex items-center gap-2 mb-3">
          <AppIcon name="training" size={16} className="text-[var(--kl-primary)]" />
          Courses completed
        </h2>
        {completedModules.length === 0 ? (
          <p className="text-xs text-[var(--kl-text-muted)]">No completed courses yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {completedModules.map((module) => (
              <span
                key={module.id}
                className="rounded-full bg-[var(--kl-surface-tinted)] text-[var(--kl-text)] text-[11px] px-2.5 py-1"
              >
                {module.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function countOverdueByStaff(staffList: User[]) {
  const staffIds = new Set(staffList.map((member) => member.id));
  return TRAINING_RECORDS.filter((record) => staffIds.has(record.staffId) && record.status === "overdue").length;
}

export default function MyStaffPage() {
  const { activeDepartment } = useDepartment();
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedBenchId, setSelectedBenchId] = useState<string | "all">("all");

  const allDepartmentStaff = useMemo(
    () => filterStaffByDepartment(getStaffUsers(), activeDepartment.id),
    [activeDepartment.id],
  );

  useEffect(() => {
    setSelectedBenchId("all");
    setSearch("");
  }, [activeDepartment.id]);

  if (staffId) return <StaffDetailView staffId={staffId} />;

  const scopedByBench = filterStaffByBench(getStaffUsers(), activeDepartment, selectedBenchId);
  const filtered = scopedByBench.filter((member) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return member.name.toLowerCase().includes(q) || member.unit.toLowerCase().includes(q);
  });

  const grouped = groupStaffByBench(filtered, activeDepartment).filter((entry) => entry.staff.length > 0);
  const belowThreshold = allDepartmentStaff.filter((member) => (member.competencyScore ?? 0) < 80).length;
  const overdueCount = countOverdueByStaff(allDepartmentStaff);

  return (
    <div className="kl-page">
      <div className="mb-5">
        <h1 className="text-[var(--kl-text)] text-[24px] font-semibold mb-1">My Staff</h1>
        <p className="text-[var(--kl-text-muted)] text-sm">
          {joinWithSeparator([
            `${allDepartmentStaff.length} team members`,
            activeDepartment.name,
            selectedBenchId === "all"
              ? "All benches"
              : activeDepartment.benches.find((bench) => bench.id === selectedBenchId)?.name,
          ])}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {[
          { label: "Total Staff", count: allDepartmentStaff.length, tone: "text-[#1c5eff] bg-[#e3edff]" },
          { label: "Overdue Training", count: overdueCount, tone: "text-[#b14343] bg-[#fde9e9]" },
          { label: "Below 80% Competency", count: belowThreshold, tone: "text-[#9a6115] bg-[#fff0db]" },
        ].map((pill) => (
          <div key={pill.label} className={`rounded-full px-3.5 py-2 inline-flex items-center gap-1.5 ${pill.tone}`}>
            <span className="text-sm font-semibold">{pill.count}</span>
            <span className="text-xs font-medium">{pill.label}</span>
          </div>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedBenchId("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            selectedBenchId === "all"
              ? "border-[var(--kl-primary)] bg-[var(--kl-surface-tinted)] text-[var(--kl-primary)]"
              : "border-[var(--kl-border)] bg-[var(--kl-surface)] text-[var(--kl-text-muted)]"
          }`}
        >
          All benches
        </button>
        {activeDepartment.benches.map((bench) => (
          <button
            key={bench.id}
            onClick={() => setSelectedBenchId(bench.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              selectedBenchId === bench.id
                ? "border-[var(--kl-primary)] bg-[var(--kl-surface-tinted)] text-[var(--kl-primary)]"
                : "border-[var(--kl-border)] bg-[var(--kl-surface)] text-[var(--kl-text-muted)]"
            }`}
          >
            {bench.name}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <AppIcon name="search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--kl-text-muted)]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search staff by name or unit"
          className="w-full rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface)] pl-9 pr-3 py-2.5 text-sm text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[var(--kl-primary)]"
        />
      </div>

      <div className="space-y-3">
        {grouped.length === 0 && (
          <div className="rounded-[16px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 text-sm text-[var(--kl-text-muted)]">
            No staff match your current filters.
          </div>
        )}

        {grouped.map(({ bench, staff }) => (
          <section key={bench.id} className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] overflow-hidden shadow-[var(--kl-shadow)]">
            <div className="px-4 py-3 border-b border-[var(--kl-border)] bg-[var(--kl-surface-soft)] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--kl-text)]">{bench.name}</h2>
              <span className="text-xs text-[var(--kl-text-muted)]">{staff.length} staff</span>
            </div>
            <div>
              {staff.map((member) => {
                const records = TRAINING_RECORDS.filter((record) => record.staffId === member.id);
                const completed = records.filter((record) => record.status === "completed").length;
                const overdue = records.filter((record) => record.status === "overdue").length;
                const competency = member.competencyScore ?? 0;

                return (
                  <div
                    key={member.id}
                    className="px-4 py-3 border-b border-[var(--kl-border)] last:border-b-0 flex items-center gap-3 hover:bg-[var(--kl-surface-soft)] active:bg-[var(--kl-surface-tinted)] active:scale-[0.995] transition-all"
                  >
                    <div
                      className="size-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--kl-text)] font-medium truncate">{member.name}</p>
                      <p className="text-xs text-[var(--kl-text-muted)] truncate">{member.unit}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${competencyTone(competency)}`}>
                        {competency}% competency
                      </span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[var(--kl-surface-tinted)] text-[var(--kl-text-muted)]">
                        {completed}/{TRAINING_MODULES.length} modules
                      </span>
                      {overdue > 0 && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#fde9e9] text-[#b14343]">
                          {overdue} overdue
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/supervisor/staff/${member.id}`)}
                      className="inline-flex items-center gap-1 rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-2.5 py-1.5 text-xs text-[var(--kl-primary)] hover:bg-[var(--kl-surface-tinted)] active:scale-[0.98] transition-all"
                    >
                      View
                      <AppIcon name="chevronRight" size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

