import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, FlaskConical, Microscope, Droplets, Stethoscope, TestTube } from 'lucide-react';
import { Department, Bench, DEPARTMENTS } from '../../data/mockData';
import { useDepartment } from '../../context/DepartmentContext';

// Department icons map
const DEPT_ICONS: Record<string, React.ReactNode> = {
  haematology: <Droplets size={14} />,
  chemistry: <FlaskConical size={14} />,
  microbiology: <Microscope size={14} />,
  histopathology: <Stethoscope size={14} />,
  bgs: <TestTube size={14} />,
};

function DeptColorDot({ color, size = 8 }: { color: string; size?: number }) {
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
  const [selectedDept, setSelectedDept] = useState<Department>(activeDepartment);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Sync selectedDept when activeDepartment changes externally
  useEffect(() => {
    setSelectedDept(activeDepartment);
  }, [activeDepartment]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSelectedDept(activeDepartment); // reset preview
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, activeDepartment]);

  const handleDeptClick = (dept: Department) => {
    setSelectedDept(dept);
  };

  const handleBenchClick = (bench: Bench) => {
    setActiveDepartment(selectedDept);
    setActiveBench(bench);
    setOpen(false);
  };

  const isActiveDept = (dept: Department) =>
    activeDepartment.id === dept.id && selectedDept.id === dept.id;

  return (
    <div className="relative px-3 mb-3">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => {
          setSelectedDept(activeDepartment);
          setOpen(v => !v);
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] border border-[#d3def5] bg-white hover:bg-[#eef4ff] transition-colors group"
      >
        <span
          className="size-[28px] rounded-[9px] flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: activeDepartment.color }}
        >
          {DEPT_ICONS[activeDepartment.id]}
        </span>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[#11203b] text-[11px] font-semibold truncate leading-tight">
            {activeDepartment.shortName}
          </div>
          <div className="text-[#73839f] text-[10px] truncate leading-tight">
            {activeBench.shortName} Bench
          </div>
        </div>
        <ChevronDown
          size={13}
          className={`text-[#73839f] flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute left-3 right-3 top-[calc(100%+6px)] z-50 bg-white border border-[#d3def5] rounded-[18px] shadow-xl overflow-hidden"
          style={{ minWidth: 240 }}
        >
          {/* Header */}
          <div className="px-4 pt-3 pb-2 border-b border-[#eef4ff]">
            <p className="text-[#73839f] text-[10px] font-semibold tracking-[1.5px] uppercase">Switch Department / Bench</p>
          </div>

          <div className="flex" style={{ maxHeight: 340 }}>
            {/* Left: Departments */}
            <div className="w-[130px] flex-shrink-0 border-r border-[#eef4ff] overflow-y-auto py-1.5">
              {DEPARTMENTS.map(dept => {
                const isPreview = selectedDept.id === dept.id;
                const isActive = activeDepartment.id === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => handleDeptClick(dept)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                      isPreview
                        ? 'bg-[#eef4ff]'
                        : 'hover:bg-[#f7faff]'
                    }`}
                  >
                    <span
                      className="size-[20px] rounded-[6px] flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: dept.color }}
                    >
                      {DEPT_ICONS[dept.id] &&
                        React.cloneElement(DEPT_ICONS[dept.id] as React.ReactElement, { size: 11 })}
                    </span>
                    <span
                      className={`text-[11px] font-medium leading-tight flex-1 ${
                        isPreview ? 'text-[#11203b]' : 'text-[#475a7d]'
                      }`}
                    >
                      {dept.shortName}
                    </span>
                    {isActive && (
                      <span className="size-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: dept.color }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Benches */}
            <div className="flex-1 overflow-y-auto py-1.5">
              <div className="px-3 pb-1 pt-1">
                <p className="text-[#73839f] text-[10px] font-semibold tracking-wider uppercase truncate">
                  {selectedDept.name}
                </p>
              </div>
              {selectedDept.benches.map(bench => {
                const isActiveBench =
                  activeDepartment.id === selectedDept.id && activeBench.id === bench.id;
                return (
                  <button
                    key={bench.id}
                    onClick={() => handleBenchClick(bench)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                      isActiveBench
                        ? 'bg-[#e3edff]'
                        : 'hover:bg-[#f7faff]'
                    }`}
                  >
                    <DeptColorDot color={bench.color} size={7} />
                    <span
                      className={`text-[11px] leading-tight flex-1 ${
                        isActiveBench ? 'text-[#1c5eff] font-semibold' : 'text-[#475a7d] font-medium'
                      }`}
                    >
                      {bench.name}
                    </span>
                    {isActiveBench && <Check size={11} className="text-[#1c5eff] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-[#eef4ff] flex items-center justify-between">
            <span className="text-[#73839f] text-[10px]">
              <span className="font-semibold" style={{ color: activeDepartment.color }}>
                {activeDepartment.shortName}
              </span>
              {' · '}
              {activeBench.shortName}
            </span>
            <button
              onClick={() => {
                setOpen(false);
                setSelectedDept(activeDepartment);
              }}
              className="text-[#73839f] text-[10px] hover:text-[#1c5eff] font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
