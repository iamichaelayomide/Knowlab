import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, FlaskConical, Microscope, Droplets, Stethoscope, TestTube, ChevronRight, ArrowLeft } from 'lucide-react';
import { Department, Bench, DEPARTMENTS } from '../../data/mockData';
import { useDepartment } from '../../context/DepartmentContext';

// Department icons map
const DEPT_ICONS: Record<string, React.ReactNode> = {
  haematology: <Droplets size={16} />,
  chemistry: <FlaskConical size={16} />,
  microbiology: <Microscope size={16} />,
  histopathology: <Stethoscope size={16} />,
  bgs: <TestTube size={16} />,
};

function DeptColorDot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      className="rounded-full flex-shrink-0 inline-block"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

export function DepartmentSwitcher() {
  const { activeDepartment, activeBench, setActiveDepartment, setActiveBench } = useDepartment();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'departments' | 'benches'>('departments');
  const [selectedDept, setSelectedDept] = useState<Department>(activeDepartment);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Reset view when opening
  useEffect(() => {
    if (open) {
      setView('departments');
      setSelectedDept(activeDepartment);
    }
  }, [open, activeDepartment]);

  const handleDeptClick = (dept: Department) => {
    setSelectedDept(dept);
    setView('benches');
  };

  const handleBenchClick = (bench: Bench) => {
    setActiveDepartment(selectedDept);
    setActiveBench(bench);
    setOpen(false);
  };

  return (
    <div className="relative px-3 mb-4">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-blue-100 bg-white hover:bg-blue-50 transition-all shadow-sm group"
      >
        <span
          className="size-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
          style={{ backgroundColor: activeDepartment.color }}
        >
          {DEPT_ICONS[activeDepartment.id]}
        </span>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-slate-800 text-sm font-bold truncate tracking-tight">
            {activeDepartment.shortName}
          </div>
          <div className="text-slate-500 text-xs truncate font-medium mt-0.5">
            {activeBench.shortName} Bench
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute left-3 right-3 top-[calc(100%+8px)] z-50 bg-white border border-blue-100 rounded-2xl shadow-xl overflow-hidden origin-top animate-in fade-in zoom-in-95 duration-200"
          style={{ width: 'calc(100% - 24px)', minWidth: 260 }}
        >
          {view === 'departments' ? (
            // Departments View
            <div className="flex flex-col">
              <div className="px-4 py-3 border-b border-blue-50 bg-slate-50/50">
                <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Select Department</p>
              </div>
              <div className="p-2 overflow-y-auto max-h-[380px] flex flex-col gap-1">
                {DEPARTMENTS.map(dept => {
                  const isActive = activeDepartment.id === dept.id;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => handleDeptClick(dept)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        isActive ? 'bg-blue-50/80 border border-blue-100/50' : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <span
                        className="size-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: dept.color }}
                      >
                        {DEPT_ICONS[dept.id]}
                      </span>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                          {dept.name}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5 font-medium">
                          {dept.benches.length} benches
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Benches View
            <div className="flex flex-col">
              <div className="px-3 py-3 border-b border-blue-50 bg-slate-50/50 flex items-center gap-2">
                <button 
                  onClick={() => setView('departments')}
                  className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm font-bold truncate">{selectedDept.name}</p>
                </div>
              </div>
              <div className="p-2 overflow-y-auto max-h-[380px] flex flex-col gap-1">
                {selectedDept.benches.map(bench => {
                  const isActiveBench = activeDepartment.id === selectedDept.id && activeBench.id === bench.id;
                  return (
                    <button
                      key={bench.id}
                      onClick={() => handleBenchClick(bench)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                        isActiveBench
                          ? 'bg-blue-50 border border-blue-100/50 shadow-sm'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-center size-6 bg-white rounded-md shadow-sm shrink-0">
                        <DeptColorDot color={bench.color} size={10} />
                      </div>
                      <span
                        className={`text-sm flex-1 truncate ${
                          isActiveBench ? 'text-blue-700 font-bold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        {bench.name}
                      </span>
                      {isActiveBench && (
                        <div className="size-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <Check size={12} className="text-blue-700" />
                        </div>
                      )}
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
