import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDepartment } from '../../context/DepartmentContext';
import { DEPT_ICONS } from '../../data/mockData';

// DepartmentSwitcher: renders a desktop dropdown and a mobile bottom-sheet for bench switching.
export function DepartmentSwitcher() {
  const { activeDepartment, activeBench, setActiveDepartment, setActiveBench, departments } = useDepartment();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'departments' | 'benches'>('departments');
  const [selectedDept, setSelectedDept] = useState(activeDepartment);
  const [isMobile, setIsMobile] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if ('addEventListener' in mq) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if ('removeEventListener' in mq) mq.removeEventListener('change', handler as any);
      else mq.removeListener(handler as any);
    };
  }, []);

  // Close on outside click (desktop) or overlay click (mobile)
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (open) {
      setView('departments');
      setSelectedDept(activeDepartment);
    }
  }, [open, activeDepartment]);

  const handleDeptClick = (dept: any) => {
    setSelectedDept(dept);
    setView('benches');
  };

  const handleBenchClick = (bench: any) => {
    setActiveDepartment(selectedDept);
    setActiveBench(bench);
    setOpen(false);
  };

  return (
    <div className="relative px-3 mb-4">
      <div className="relative w-full">
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-[var(--sidebar-border)] bg-[var(--card)] hover:bg-[var(--accent)] transition-all shadow-sm group"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span
            className="size-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
            style={{ width: 40, height: 40, backgroundColor: activeDepartment.color }}
          >
            {DEPT_ICONS[activeDepartment.id]}
          </span>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[var(--foreground)] text-sm font-bold truncate tracking-tight">
              {activeDepartment.shortName}
            </div>
            <div className="text-[var(--muted)] text-xs truncate font-medium mt-0.5">
              {activeBench.shortName} Bench
            </div>
          </div>
          <ChevronDown size={16} className={`text-[var(--muted)] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop Dropdown Panel */}
        {!isMobile && open && (
          <div
            ref={panelRef}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[var(--card)] border border-[var(--sidebar-border)] rounded-2xl shadow-xl overflow-hidden origin-top animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-label="Select department and bench"
          >
            {view === 'departments' ? (
              <div className="flex flex-col">
                <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
                  <div className="text-[13px] font-semibold">Select department</div>
                </div>
                <div className="p-3 space-y-2 max-h-[260px] overflow-y-auto">
                  {departments.map(d => (
                    <button key={d.id} onClick={() => handleDeptClick(d)} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors">
                      <span style={{ width: 32, height: 32, backgroundColor: d.color }} className="rounded-full flex items-center justify-center text-white">{DEPT_ICONS[d.id]}</span>
                      <div>
                        <div className="font-semibold text-[var(--foreground)]">{d.name}</div>
                        <div className="text-[var(--muted)] text-xs">{d.benches.length} benches</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 32, height: 32, backgroundColor: selectedDept.color }} className="rounded-full flex items-center justify-center text-white">{DEPT_ICONS[selectedDept.id]}</div>
                    <div>
                      <div className="font-semibold text-[var(--foreground)]">{selectedDept.name}</div>
                      <div className="text-[var(--muted)] text-xs">Choose a bench</div>
                    </div>
                  </div>
                  <button onClick={() => setView('departments')} className="text-xs text-[var(--primary)]">Back</button>
                </div>
                <div className="p-3 space-y-2 max-h-[260px] overflow-y-auto">
                  {selectedDept.benches.map((b: any) => (
                    <button key={b.id} onClick={() => handleBenchClick(b)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[var(--foreground)]">{b.name}</div>
                        <div className="text-[var(--muted)] text-xs">{b.description ?? ''}</div>
                      </div>
                      {activeDepartment.id === selectedDept.id && activeBench.id === b.id && (
                        <div className="text-[var(--primary)] text-sm font-semibold">Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile bottom-sheet */}
        {isMobile && open && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
            <div ref={panelRef} className="w-full bg-[var(--card)] rounded-t-2xl p-4 shadow-xl max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">Switch workspace</div>
                  <div className="text-xs text-[var(--muted)]">Department & bench</div>
                </div>
                <button onClick={() => setOpen(false)} className="text-sm text-[var(--muted)]">Close</button>
              </div>

              {/* Departments list */}
              {view === 'departments' ? (
                <div className="space-y-2">
                  {departments.map(d => (
                    <button key={d.id} onClick={() => handleDeptClick(d)} className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--accent)] transition-colors">
                      <span style={{ width: 36, height: 36, backgroundColor: d.color }} className="rounded-full flex items-center justify-center text-white">{DEPT_ICONS[d.id]}</span>
                      <div className="flex-1">
                        <div className="font-medium text-[var(--foreground)]">{d.name}</div>
                        <div className="text-[var(--muted)] text-xs">{d.benches.length} benches</div>
                      </div>
                      <ChevronDown size={16} className="text-[var(--muted)]" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mb-2">
                    <div className="font-semibold text-[var(--foreground)]">{selectedDept.name}</div>
                    <div className="text-[var(--muted)] text-xs">Choose a bench</div>
                  </div>
                  {selectedDept.benches.map((b: any) => (
                    <button key={b.id} onClick={() => handleBenchClick(b)} className="w-full text-left px-3 py-3 rounded-lg hover:bg-[var(--accent)] transition-colors flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[var(--foreground)]">{b.name}</div>
                        <div className="text-[var(--muted)] text-xs">{b.description ?? ''}</div>
                      </div>
                      {activeDepartment.id === selectedDept.id && activeBench.id === b.id && (
                        <div className="text-[var(--primary)] text-sm font-semibold">Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
