import { useState } from 'react';
import { Search, Users, GraduationCap, AlertTriangle } from 'lucide-react';
import { getStaffUsers, TRAINING_RECORDS, TRAINING_MODULES } from '../../data/mockData';

export default function HODStaffPage() {
  const [search, setSearch] = useState('');
  const allStaff = getStaffUsers();
  const filtered = allStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.unit.toLowerCase().includes(search.toLowerCase())
  );

  const units = Array.from(new Set(allStaff.map(s => s.unit)));

  return (
    <div className="p-6 max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Department Staff</h1>
        <p className="text-[#73839f] text-[14px]">{allStaff.length} staff members across {units.length} units</p>
      </div>

      {/* Unit Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {units.map(unit => {
          const unitStaff = allStaff.filter(s => s.unit === unit);
          const avg = Math.round(unitStaff.reduce((s, u) => s + (u.competencyScore ?? 75), 0) / unitStaff.length);
          return (
            <div key={unit} className="bg-white rounded-[20px] border border-[#d3def5] p-4">
              <p className="text-[#11203b] font-semibold text-[14px] mb-1 leading-snug">{unit}</p>
              <p className="text-[#73839f] text-[12px] mb-2">{unitStaff.length} staff</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#f4f8ff] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${avg}%`, backgroundColor: avg >= 85 ? '#1c7b56' : avg >= 70 ? '#9a6115' : '#b14343' }} />
                </div>
                <span className="font-semibold text-[12px]" style={{ color: avg >= 85 ? '#1c7b56' : avg >= 70 ? '#9a6115' : '#b14343' }}>{avg}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73839f]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search staff…"
          className="w-full bg-white border border-[#d3def5] rounded-[14px] pl-10 pr-4 py-3 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] transition-colors"
        />
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] overflow-hidden shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)]">
        <div className="px-5 py-3 border-b border-[#f4f8ff] bg-[#f9fbff] grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4">
          {['Name', 'Unit', 'Competency', 'Training', 'Status'].map(h => (
            <span key={h} className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px]">{h}</span>
          ))}
        </div>
        {filtered.map(staff => {
          const records = TRAINING_RECORDS.filter(r => r.staffId === staff.id);
          const completed = records.filter(r => r.status === 'completed').length;
          const overdue = records.filter(r => r.status === 'overdue').length;
          const competency = staff.competencyScore ?? 75;
          const needsAttention = competency < 80 || overdue > 0;
          return (
            <div key={staff.id} className="px-5 py-4 border-b border-[#f4f8ff] last:border-0 grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center hover:bg-[#f9fbff] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-[32px] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: staff.color }}>
                  {staff.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[#11203b] font-medium text-[13px] truncate">{staff.name}</p>
                  <p className="text-[#73839f] text-[11px]">Since {new Date(staff.joinDate).getFullYear()}</p>
                </div>
              </div>
              <p className="text-[#475a7d] text-[12px] truncate">{staff.unit}</p>
              <div className="flex flex-col items-center">
                <span className={`font-semibold text-[14px] ${competency >= 85 ? 'text-[#1c7b56]' : competency >= 70 ? 'text-[#9a6115]' : 'text-[#b14343]'}`}>{competency}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#11203b] font-semibold text-[13px]">{completed}/{TRAINING_MODULES.length}</span>
                {overdue > 0 && <span className="text-[9px] text-[#b14343]">{overdue} overdue</span>}
              </div>
              <div>
                {needsAttention ? (
                  <span className="flex items-center gap-1 bg-[#fde9e9] text-[#b14343] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <AlertTriangle size={9} /> Review
                  </span>
                ) : (
                  <span className="bg-[#e8f8f1] text-[#1c7b56] text-[10px] font-semibold px-2 py-0.5 rounded-full">Good</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
