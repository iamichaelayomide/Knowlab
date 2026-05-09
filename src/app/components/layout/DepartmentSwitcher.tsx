import { useEffect, useRef, useState } from 'react';
import type { Bench, Department } from '../../data/mockData';
import { DEPARTMENTS } from '../../data/mockData';
import { useDepartment } from '../../context/DepartmentContext';
import { AppIcon } from '../icons/AppIcon';

export function DepartmentSwitcher() {
  const { activeDepartment, activeBench, setActiveDepartment, setActiveBench } = useDepartment();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'departments' | 'benches'>('departments');
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

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setSelectedDept(activeDepartment);
    setView('departments');
  }, [activeDepartment, open]);

  const selectDepartment = (department: Department) => {
    setSelectedDept(department);
    setView('benches');
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
        className="kl-card-interactive w-full flex items-center gap-3 px-3 py-3 rounded-[22px] border border-[var(--surface-border)] bg-[var(--glass-bg)] shadow-xs backdrop-blur-xl hover:bg-[var(--surface-card)] transition-all"
      >
        <span
          className="size-10 rounded-[18px] flex items-center justify-center text-white flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
          style={{ backgroundColor: activeDepartment.color }}
        >
          <AppIcon name="department" size={18} />
        </span>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{activeDepartment.shortName}</p>
          <p className="text-xs text-[var(--text-secondary)] truncate">{activeBench.shortName} bench</p>
        </div>
        <AppIcon
          name="chevronDown"
          size={16}
          className={`text-[var(--text-tertiary)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="kl-menu-panel absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden"
        >
          {view === 'departments' ? (
            <div>
              <div className="px-4 py-3 border-b border-[var(--surface-border)] bg-[var(--surface-base)]">
                <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[var(--text-tertiary)]">Select Department</p>
              </div>
              <div className="p-2 max-h-[360px] overflow-y-auto space-y-1">
                {DEPARTMENTS.map((department) => {
                  const isActive = department.id === activeDepartment.id;
                  return (
                    <button
                      key={department.id}
                      onClick={() => selectDepartment(department)}
                      className={`kl-menu-item w-full flex items-center gap-3 px-3 py-2.5 border transition-all ${
                        isActive
                          ? 'border-[var(--accent-blue)] bg-[var(--accent-glow)] shadow-[0_0_0_2px_var(--accent-glow)]'
                          : 'border-transparent hover:border-[var(--surface-border)] hover:bg-[var(--surface-base)]'
                      }`}
                    >
                      <span
                        className="size-9 rounded-[16px] flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                        style={{ backgroundColor: department.color }}
                      >
                        <AppIcon name="department" size={16} />
                      </span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{department.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{department.benches.length} benches</p>
                      </div>
                      <AppIcon name="chevronRight" size={14} className="text-[var(--text-tertiary)]" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="px-3 py-3 border-b border-[var(--surface-border)] bg-[var(--surface-base)] flex items-center gap-2">
                <button
                  onClick={() => setView('departments')}
                  className="kl-icon-button text-[var(--text-secondary)]"
                  aria-label="Back to departments"
                >
                  <AppIcon name="arrowRight" size={14} className="rotate-180" />
                </button>
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{selectedDept.name}</p>
              </div>
              <div className="p-2 max-h-[360px] overflow-y-auto space-y-1">
                {selectedDept.benches.map((bench) => {
                  const isActive = activeDepartment.id === selectedDept.id && activeBench.id === bench.id;
                  return (
                    <button
                      key={bench.id}
                      onClick={() => selectBench(bench)}
                      className={`kl-menu-item w-full flex items-center gap-3 px-3 py-2.5 border transition-all ${
                        isActive
                          ? 'border-[var(--accent-blue)] bg-[var(--accent-glow)] shadow-[0_0_0_2px_var(--accent-glow)]'
                          : 'border-transparent hover:border-[var(--surface-border)] hover:bg-[var(--surface-base)]'
                      }`}
                    >
                      <span
                        className="size-7 rounded-full flex items-center justify-center bg-[var(--glass-bg)] text-[var(--accent-blue)] border border-[var(--surface-border)]"
                        title={bench.name}
                      >
                        <AppIcon name="bench" size={13} />
                      </span>
                      <span className="min-w-0 flex-1 text-left text-sm text-[var(--text-primary)] truncate">{bench.name}</span>
                      {isActive ? (
                      <span className="size-5 rounded-full bg-[var(--accent-blue)] text-white flex items-center justify-center">
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
