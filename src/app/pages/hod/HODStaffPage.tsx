import { useMemo, useState } from "react";
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
import { askKnowledgeAssistant } from "../../services/aiAssistant";
import { filterStaffByDepartment, groupStaffByBench, resolveStaffBenchContext } from "../../utils/staffScope";

function competencyColor(score: number) {
  if (score >= 85) return "text-[#1c7b56]";
  if (score >= 70) return "text-[#9a6115]";
  return "text-[#b14343]";
}

const UNIT_ICON_CLASS: Record<string, string> = {
  "FBC & Automated Counts": "las la-heartbeat",
  "Blood Film & Morphology": "las la-search-plus",
  "Coagulation": "las la-shield-alt",
  "Blood Bank & Transfusion": "las la-tint",
  "ESR & Special Haematology": "las la-dna",
  "Glucose & Diabetes Markers": "las la-chart-line",
  "Bilirubin & Liver Function Tests": "las la-wave-square",
  "Kidney Function Tests": "las la-kidneys",
  "Lipid Profile": "las la-chart-area",
  "Electrolytes & Minerals": "las la-bolt",
  "Bacteriology": "las la-bacteria",
  "Mycology": "las la-spa",
  "Virology": "las la-virus",
  "Parasitology": "las la-bug",
  "Molecular Microbiology": "las la-dna",
};

function UnitIcon({ unit }: { unit: string }) {
  const icon = UNIT_ICON_CLASS[unit] ?? "las la-layer-group";
  return <i className={`${icon} la-fw`} />;
}

function findBestStaffMatch(query: string, candidates: User[]) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const tokens = q.split(/\s+/).filter(Boolean);

  const ranked = candidates
    .map((candidate) => {
      const name = candidate.name.toLowerCase();
      const unit = candidate.unit.toLowerCase();
      const score = tokens.reduce((acc, token) => {
        let tokenScore = 0;
        if (name.includes(token)) tokenScore += 3;
        if (unit.includes(token)) tokenScore += 2;
        if (candidate.initials.toLowerCase().includes(token)) tokenScore += 1;
        return acc + tokenScore;
      }, 0);
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  if (!ranked.length || ranked[0].score === 0) return null;
  return ranked[0].candidate;
}

function HODStaffDetail({ staffId }: { staffId: string }) {
  const navigate = useNavigate();
  const staff = getUserById(staffId);

  if (!staff) {
    return (
      <div className="kl-page">
        <p className="text-sm text-[var(--kl-text-muted)]">Staff profile not found.</p>
      </div>
    );
  }

  const records = TRAINING_RECORDS.filter((record) => record.staffId === staff.id);
  const completed = records.filter((record) => record.status === "completed").length;
  const overdue = records.filter((record) => record.status === "overdue").length;
  const competency = staff.competencyScore ?? 0;
  const context = resolveStaffBenchContext(staff);
  const completedModules = records
    .filter((record) => record.status === "completed")
    .map((record) => TRAINING_MODULES.find((module) => module.id === record.moduleId))
    .filter((module): module is (typeof TRAINING_MODULES)[number] => Boolean(module));

  return (
    <div className="kl-page">
      <button
        onClick={() => navigate("/hod/staff")}
        className="inline-flex items-center gap-2 text-sm text-[var(--kl-text-muted)] hover:text-[var(--kl-primary)]"
      >
        <AppIcon name="arrowRight" size={14} className="rotate-180" />
        Back to department staff
      </button>

      <div className="mt-4 rounded-[20px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 shadow-[var(--kl-shadow)]">
        <div className="flex items-start gap-4">
          <div
            className="size-14 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: staff.color }}
          >
            {staff.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-[var(--kl-text)] truncate">{staff.name}</h1>
            <p className="text-sm text-[var(--kl-text-muted)] truncate">{staff.unit}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--kl-surface-tinted)] text-[var(--kl-text-muted)] px-2.5 py-1 text-xs">
                {context.department.name}
              </span>
              <span className="rounded-full bg-[var(--kl-surface-tinted)] text-[var(--kl-text-muted)] px-2.5 py-1 text-xs">
                {context.bench.name}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${competency >= 85 ? "text-[#1c7b56] bg-[#e8f8f1]" : competency >= 70 ? "text-[#9a6115] bg-[#fff0db]" : "text-[#b14343] bg-[#fde9e9]"}`}>
                {competency}% competency
              </span>
            </div>
          </div>
        </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Training</p>
          <p className="text-sm text-[var(--kl-text)] font-medium">{completed}/{TRAINING_MODULES.length}</p>
        </div>
          <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Overdue</p>
            <p className={`text-sm font-medium ${overdue > 0 ? "text-[#b14343]" : "text-[#1c7b56]"}`}>{overdue}</p>
          </div>
          <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Joined</p>
            <p className="text-sm text-[var(--kl-text)] font-medium">
              {new Date(staff.joinDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </p>
          </div>
          <div className="rounded-[10px] bg-[var(--kl-surface-tinted)] px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--kl-text-muted)] font-semibold">Email</p>
            <p className="text-sm text-[var(--kl-text)] font-medium truncate">{staff.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <AppIcon name="training" size={16} className="text-[var(--kl-primary)]" />
          <p className="text-sm font-semibold text-[var(--kl-text)]">Courses completed</p>
        </div>
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

export default function HODStaffPage() {
  const { activeDepartment } = useDepartment();
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMatchedStaffId, setAiMatchedStaffId] = useState<string | null>(null);

  const allDepartmentStaff = useMemo(
    () => filterStaffByDepartment(getStaffUsers(), activeDepartment.id),
    [activeDepartment.id],
  );

  const units = useMemo(() => {
    const map = new Map<string, User[]>();
    for (const member of allDepartmentStaff) {
      const list = map.get(member.unit) ?? [];
      list.push(member);
      map.set(member.unit, list);
    }

    return Array.from(map.entries())
      .map(([unit, staff]) => {
        const averageCompetency =
          staff.length > 0 ? Math.round(staff.reduce((sum, item) => sum + (item.competencyScore ?? 0), 0) / staff.length) : 0;
        return { unit, staff, averageCompetency };
      })
      .sort((a, b) => a.unit.localeCompare(b.unit));
  }, [allDepartmentStaff]);

  const visibleStaff = useMemo(() => {
    const base = selectedUnit
      ? allDepartmentStaff.filter((member) => member.unit === selectedUnit)
      : allDepartmentStaff;

    const q = search.trim().toLowerCase();
    if (!q) return base;

    return base.filter((member) => member.name.toLowerCase().includes(q) || member.unit.toLowerCase().includes(q));
  }, [allDepartmentStaff, search, selectedUnit]);

  const benchGroups = useMemo(
    () => groupStaffByBench(visibleStaff, activeDepartment).filter((entry) => entry.staff.length > 0),
    [activeDepartment, visibleStaff],
  );

  if (staffId) {
    return <HODStaffDetail staffId={staffId} />;
  }

  const runAiLookup = async () => {
    const query = aiQuery.trim();
    if (!query || aiLoading) return;
    setAiLoading(true);

    const result = await askKnowledgeAssistant({
      query,
      role: "hod",
      department: activeDepartment.name,
      bench: "All",
    });

    setAiAnswer(result.answer);
    const matched = findBestStaffMatch(query, allDepartmentStaff);
    setAiMatchedStaffId(matched?.id ?? null);
    setAiLoading(false);
  };

  return (
    <div className="kl-page">
      <div className="mb-5">
        <h1 className="text-[var(--kl-text)] font-semibold text-[24px] mb-1">Department Staff</h1>
        <p className="text-[var(--kl-text-muted)] text-sm">
          {allDepartmentStaff.length} staff in {activeDepartment.name}. Select any unit card to drill into benches and roster.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {units.map((unitCard) => (
          <button
            key={unitCard.unit}
            onClick={() => setSelectedUnit(unitCard.unit === selectedUnit ? null : unitCard.unit)}
            className={`rounded-[18px] border p-4 text-left transition-all active:scale-[0.995] ${
              selectedUnit === unitCard.unit
                ? "border-[var(--kl-primary)] bg-[var(--kl-surface-tinted)] shadow-[0_0_0_2px_rgba(28,94,255,0.08)]"
                : "border-[var(--kl-border)] bg-[var(--kl-surface)] hover:bg-[var(--kl-surface-soft)] hover:border-[var(--kl-primary)]"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="size-9 rounded-[12px] bg-[var(--kl-surface-tinted)] text-[var(--kl-primary)] flex items-center justify-center border border-[var(--kl-border)]">
                <UnitIcon unit={unitCard.unit} />
              </span>
              <p className="text-sm font-semibold text-[var(--kl-text)] leading-snug">{unitCard.unit}</p>
            </div>
            <p className="text-xs text-[var(--kl-text-muted)] mt-1">{unitCard.staff.length} staff</p>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-sm font-semibold ${competencyColor(unitCard.averageCompetency)}`}>
                {unitCard.averageCompetency}% avg competency
              </span>
              <AppIcon name="chevronRight" size={14} className="text-[var(--kl-text-muted)]" />
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-4 mb-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-[var(--kl-text)]">AI staff lookup</p>
          <span className="text-xs text-[var(--kl-text-muted)]">Natural language supported</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={aiQuery}
            onChange={(event) => setAiQuery(event.target.value)}
            placeholder="Example: show me the blood bank staff with low competency"
            className="flex-1 rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2 text-sm text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[var(--kl-primary)]"
          />
          <button
            onClick={() => void runAiLookup()}
            disabled={!aiQuery.trim() || aiLoading}
            className="rounded-[10px] bg-[var(--kl-primary)] text-white px-3 py-2 text-sm font-medium disabled:opacity-50"
          >
            {aiLoading ? "Searching..." : "Ask AI"}
          </button>
        </div>
        {aiAnswer && (
          <div className="mt-2 rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface-soft)] px-3 py-2">
            <p className="text-xs text-[var(--kl-text)] whitespace-pre-wrap leading-relaxed">{aiAnswer}</p>
          </div>
        )}
        <div className="mt-2">
          {aiMatchedStaffId ? (
            <button
              onClick={() => navigate(`/hod/staff/${aiMatchedStaffId}`)}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--kl-primary)] font-medium hover:underline"
            >
              <AppIcon name="arrowRight" size={11} />
              Open matched profile
            </button>
          ) : (
            aiAnswer && <p className="text-xs text-[var(--kl-text-muted)]">No exact profile match was found from this query.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="relative flex-1">
          <AppIcon name="search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--kl-text-muted)]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or unit"
            className="w-full rounded-[12px] border border-[var(--kl-border)] bg-[var(--kl-surface)] pl-9 pr-3 py-2.5 text-sm text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[var(--kl-primary)]"
          />
        </div>
        {selectedUnit && (
          <button
            onClick={() => setSelectedUnit(null)}
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2 text-xs text-[var(--kl-text-muted)]"
          >
            <AppIcon name="close" size={12} />
            Clear unit filter
          </button>
        )}
      </div>

      <div className="space-y-3">
        {benchGroups.length === 0 && (
          <div className="rounded-[16px] border border-[var(--kl-border)] bg-[var(--kl-surface)] p-5 text-sm text-[var(--kl-text-muted)]">
            No staff match your current filters.
          </div>
        )}

        {benchGroups.map(({ bench, staff }) => (
          <section key={bench.id} className="rounded-[18px] border border-[var(--kl-border)] bg-[var(--kl-surface)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--kl-border)] bg-[var(--kl-surface-soft)] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--kl-text)]">{bench.name}</h2>
              <span className="text-xs text-[var(--kl-text-muted)]">{staff.length} staff</span>
            </div>
            <div>
              {staff.map((member) => {
                const completed = TRAINING_RECORDS.filter(
                  (record) => record.staffId === member.id && record.status === "completed",
                ).length;
                const overdue = TRAINING_RECORDS.filter(
                  (record) => record.staffId === member.id && record.status === "overdue",
                ).length;
                const competency = member.competencyScore ?? 0;

                return (
                  <div
                    key={member.id}
                    className="px-4 py-3 border-b border-[var(--kl-border)] last:border-b-0 flex items-center gap-3 hover:bg-[var(--kl-surface-soft)] active:bg-[var(--kl-surface-tinted)] active:scale-[0.995] transition-all"
                  >
                    <div
                      className="size-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--kl-text)] font-medium truncate">{member.name}</p>
                      <p className="text-xs text-[var(--kl-text-muted)] truncate">{member.unit}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className={`text-xs font-semibold ${competencyColor(competency)}`}>{competency}%</span>
                      <span className="text-xs text-[var(--kl-text-muted)]">{completed}/{TRAINING_MODULES.length} complete</span>
                      {overdue > 0 && <span className="text-xs text-[#b14343] font-medium">{overdue} overdue</span>}
                    </div>
                    <button
                      onClick={() => navigate(`/hod/staff/${member.id}`)}
                      className="inline-flex items-center gap-1 rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface)] px-2.5 py-1.5 text-xs text-[var(--kl-primary)] hover:bg-[var(--kl-surface-tinted)] active:scale-[0.98] transition-all"
                    >
                      Profile
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

