import { useEffect, useRef, useState } from "react";
import type { Bench, Department } from "../../data/mockData";
import { DEPARTMENTS } from "../../data/mockData";
import { useDepartment } from "../../context/DepartmentContext";
import { AppIcon } from "../icons/AppIcon";

export function DepartmentSwitcher() {
  const { activeDepartment, activeBench, setActiveDepartment, setActiveBench } = useDepartment();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"departments" | "benches">("departments");
  const [selectedDept, setSelectedDept] = useState<Department>(activeDepartment);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setSelectedDept(activeDepartment);
    setView("departments");
  }, [activeDepartment, open]);

  const selectDepartment = (department: Department) => {
    setSelectedDept(department);
    setView("benches");
  };

  const selectBench = (bench: Bench) => {
    setActiveDepartment(selectedDept);
    setActiveBench(bench);
    setOpen(false);
  };

  return (
    <div className="relative px-3 mb-4">
      <button
        ref={triggerRef}
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-[var(--kl-border)] bg-[var(--kl-surface)] hover:bg-[var(--kl-surface-tinted)] transition-colors"
      >
        <span
          className="size-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: activeDepartment.color }}
        >
          <AppIcon name="department" size={16} className="text-white" />
        </span>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-[var(--kl-text)] truncate">{activeDepartment.shortName}</p>
          <p className="text-xs text-[var(--kl-text-muted)] truncate">{activeBench.shortName} bench</p>
        </div>
        <AppIcon
          name="chevronDown"
          size={16}
          className={`text-[var(--kl-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 rounded-2xl border border-[var(--kl-border)] bg-[var(--kl-surface)] shadow-[var(--kl-shadow)] overflow-hidden"
        >
          {view === "departments" ? (
            <div>
              <div className="px-4 py-3 border-b border-[var(--kl-border)] bg-[var(--kl-surface-soft)]">
                <p className="text-[11px] font-semibold tracking-[1.2px] uppercase text-[var(--kl-text-muted)]">Select Department</p>
              </div>
              <div className="p-2 max-h-[360px] overflow-y-auto space-y-1">
                {DEPARTMENTS.map((department) => {
                  const isActive = department.id === activeDepartment.id;
                  return (
                    <button
                      key={department.id}
                      onClick={() => selectDepartment(department)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                        isActive
                          ? "border-[var(--kl-primary)] bg-[var(--kl-surface-tinted)]"
                          : "border-transparent hover:border-[var(--kl-border)] hover:bg-[var(--kl-surface-soft)]"
                      }`}
                    >
                      <span
                        className="size-9 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: department.color }}
                      >
                        <AppIcon name="department" size={14} className="text-white" />
                      </span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium text-[var(--kl-text)] truncate">{department.name}</p>
                        <p className="text-xs text-[var(--kl-text-muted)]">{department.benches.length} benches</p>
                      </div>
                      <AppIcon name="chevronRight" size={14} className="text-[var(--kl-text-muted)]" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="px-3 py-3 border-b border-[var(--kl-border)] bg-[var(--kl-surface-soft)] flex items-center gap-2">
                <button
                  onClick={() => setView("departments")}
                  className="rounded-lg p-1.5 text-[var(--kl-text-muted)] hover:bg-[var(--kl-surface)]"
                  aria-label="Back to departments"
                >
                  <AppIcon name="arrowRight" size={14} className="rotate-180" />
                </button>
                <p className="text-sm font-semibold text-[var(--kl-text)] truncate">{selectedDept.name}</p>
              </div>
              <div className="p-2 max-h-[360px] overflow-y-auto space-y-1">
                {selectedDept.benches.map((bench) => {
                  const isActive = activeDepartment.id === selectedDept.id && activeBench.id === bench.id;
                  return (
                    <button
                      key={bench.id}
                      onClick={() => selectBench(bench)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                        isActive
                          ? "border-[var(--kl-primary)] bg-[var(--kl-surface-tinted)]"
                          : "border-transparent hover:border-[var(--kl-border)] hover:bg-[var(--kl-surface-soft)]"
                      }`}
                    >
                      <span className="size-6 rounded-md flex items-center justify-center bg-[var(--kl-surface)] text-[var(--kl-primary)] border border-[var(--kl-border)]">
                        <AppIcon name="bench" size={11} />
                      </span>
                      <span className="min-w-0 flex-1 text-left text-sm text-[var(--kl-text)] truncate">{bench.name}</span>
                      {isActive ? (
                        <span className="size-5 rounded-full bg-[var(--kl-primary)] text-white flex items-center justify-center">
                          <AppIcon name="check" size={11} className="text-white" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
