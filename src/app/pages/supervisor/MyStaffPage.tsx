import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Search, Users, GraduationCap, CheckCircle2, AlertTriangle, Clock, ChevronRight, Award } from 'lucide-react';
import { getStaffUsers, TRAINING_RECORDS, TRAINING_MODULES, getUserById } from '../../data/mockData';

function StaffDetailView({ staffId }: { staffId: string }) {
  const navigate = useNavigate();
  const staff = getUserById(staffId);
  const records = TRAINING_RECORDS.filter(r => r.staffId === staffId);

  if (!staff) return <div className="p-6"><p className="text-[#475a7d]">Staff member not found.</p></div>;

  const completed = records.filter(r => r.status === 'completed');
  const inProgress = records.filter(r => r.status === 'in_progress');
  const overdue = records.filter(r => r.status === 'overdue');
  const notStarted = TRAINING_MODULES.filter(m => !records.find(r => r.moduleId === m.id));
  const competency = staff.competencyScore ?? 75;

  return (
    <div className="p-6 max-w-[800px]">
      <button
        onClick={() => navigate('/supervisor/staff')}
        className="flex items-center gap-2 text-[#475a7d] text-[13px] font-medium mb-5 hover:text-[#1c5eff] transition-colors"
      >
        <ArrowLeft size={15} /> Back to Staff
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6 mb-5">
        <div className="flex items-start gap-4">
          <div
            className="size-[56px] rounded-full flex items-center justify-center text-white font-bold text-[18px] flex-shrink-0"
            style={{ backgroundColor: staff.color }}
          >
            {staff.initials}
          </div>
          <div className="flex-1">
            <h1 className="text-[#11203b] font-bold text-[20px] mb-0.5">{staff.name}</h1>
            <p className="text-[#73839f] text-[14px] mb-3">{staff.unit}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Role', value: 'Lab Scientist' },
                { label: 'Joined', value: new Date(staff.joinDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) },
                { label: 'Competency', value: `${competency}%` },
                { label: 'Training', value: `${completed.length}/${TRAINING_MODULES.length}` },
              ].map(item => (
                <div key={item.label} className="bg-[#f4f8ff] rounded-[12px] px-3 py-2">
                  <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">{item.label}</p>
                  <p className={`font-semibold text-[14px] ${
                    item.label === 'Competency'
                      ? competency >= 85 ? 'text-[#1c7b56]' : competency >= 70 ? 'text-[#9a6115]' : 'text-[#b14343]'
                      : 'text-[#11203b]'
                  }`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competency Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[12px] mb-1">
            <span className="text-[#475a7d]">Overall Competency Score</span>
            <span className="font-semibold" style={{ color: competency >= 85 ? '#1c7b56' : competency >= 70 ? '#9a6115' : '#b14343' }}>
              {competency}%
            </span>
          </div>
          <div className="w-full bg-[#f4f8ff] rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${competency}%`,
                backgroundColor: competency >= 85 ? '#1c7b56' : competency >= 70 ? '#9a6115' : '#b14343',
              }}
            />
          </div>
          {competency < 80 && (
            <p className="text-[#b14343] text-[12px] mt-1.5 flex items-center gap-1">
              <AlertTriangle size={11} /> Below 80% threshold — review and training recommended
            </p>
          )}
        </div>
      </div>

      {/* Training Status */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] p-6">
        <h2 className="text-[#11203b] font-semibold text-[17px] mb-4 flex items-center gap-2">
          <GraduationCap size={18} className="text-[#1c5eff]" /> Training Status
        </h2>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Completed', count: completed.length, color: '#1c7b56', bg: '#e8f8f1' },
            { label: 'In Progress', count: inProgress.length, color: '#9a6115', bg: '#fff0db' },
            { label: 'Overdue', count: overdue.length, color: '#b14343', bg: '#fde9e9' },
            { label: 'Not Started', count: notStarted.length, color: '#73839f', bg: '#f4f8ff' },
          ].map(s => (
            <div key={s.label} className="rounded-[14px] p-3 text-center" style={{ backgroundColor: s.bg }}>
              <p className="font-bold text-[20px]" style={{ color: s.color }}>{s.count}</p>
              <p className="text-[11px] font-medium" style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {TRAINING_MODULES.map(mod => {
            const record = records.find(r => r.moduleId === mod.id);
            const status = record?.status || 'not_started';
            return (
              <div key={mod.id} className="flex items-center gap-3 p-3 rounded-[14px] hover:bg-[#f4f8ff] transition-colors">
                <div className={`rounded-full p-1.5 flex-shrink-0 ${
                  status === 'completed' ? 'bg-[#e8f8f1] text-[#1c7b56]' :
                  status === 'overdue' ? 'bg-[#fde9e9] text-[#b14343]' :
                  status === 'in_progress' ? 'bg-[#fff0db] text-[#9a6115]' :
                  'bg-[#f4f8ff] text-[#73839f]'
                }`}>
                  {status === 'completed' ? <CheckCircle2 size={13} /> :
                   status === 'overdue' ? <AlertTriangle size={13} /> :
                   <Clock size={13} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#11203b] text-[13px] font-medium truncate">{mod.title}</p>
                  <p className="text-[#73839f] text-[11px]">{mod.category} · {mod.duration}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {status === 'completed' && record?.score && (
                    <p className="text-[#1c7b56] font-semibold text-[13px]">{record.score}%</p>
                  )}
                  {status === 'completed' && record?.completedDate && (
                    <p className="text-[#73839f] text-[10px]">{new Date(record.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  )}
                  {status === 'overdue' && (
                    <span className="bg-[#fde9e9] text-[#b14343] text-[10px] font-semibold px-2 py-0.5 rounded-full">OVERDUE</span>
                  )}
                  {status === 'not_started' && mod.mandatory && (
                    <span className="bg-[#f4f8ff] text-[#73839f] text-[10px] px-2 py-0.5 rounded-full">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MyStaffPage() {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const allStaff = getStaffUsers();

  if (staffId) return <StaffDetailView staffId={staffId} />;

  const filtered = allStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.unit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[900px]">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">My Staff</h1>
        <p className="text-[#73839f] text-[14px]">{allStaff.length} team members · Competency & training oversight</p>
      </div>

      {/* Summary Chips */}
      <div className="flex gap-3 flex-wrap mb-5">
        {[
          { label: 'Total Staff', count: allStaff.length, color: '#1c5eff', bg: '#e3edff' },
          { label: 'Overdue Training', count: TRAINING_RECORDS.filter(r => r.status === 'overdue').length, color: '#b14343', bg: '#fde9e9' },
          { label: 'Below 80% Competency', count: allStaff.filter(s => (s.competencyScore ?? 75) < 80).length, color: '#9a6115', bg: '#fff0db' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: item.bg }}>
            <span className="font-bold text-[15px]" style={{ color: item.color }}>{item.count}</span>
            <span className="text-[12px] font-medium" style={{ color: item.color }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73839f]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search staff by name or unit…"
          className="w-full bg-white border border-[#d3def5] rounded-[14px] pl-10 pr-4 py-3 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] transition-colors"
        />
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] overflow-hidden shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)]">
        <div className="px-5 py-3 border-b border-[#f4f8ff] bg-[#f9fbff] grid grid-cols-[1fr_auto_auto_auto_auto] gap-4">
          <span className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px]">Staff Member</span>
          <span className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] hidden sm:block">Unit</span>
          <span className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px]">Competency</span>
          <span className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] hidden sm:block">Training</span>
          <span className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px]">Action</span>
        </div>
        <div>
          {filtered.map(staff => {
            const records = TRAINING_RECORDS.filter(r => r.staffId === staff.id);
            const completed = records.filter(r => r.status === 'completed').length;
            const overdue = records.filter(r => r.status === 'overdue').length;
            const competency = staff.competencyScore ?? 75;
            return (
              <div
                key={staff.id}
                className="px-5 py-4 border-b border-[#f4f8ff] last:border-0 grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center hover:bg-[#f9fbff] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="size-[34px] rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ backgroundColor: staff.color }}
                  >
                    {staff.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#11203b] font-medium text-[13px] truncate">{staff.name}</p>
                    <p className="text-[#73839f] text-[11px] sm:hidden truncate">{staff.unit}</p>
                  </div>
                </div>
                <span className="text-[#475a7d] text-[12px] hidden sm:block max-w-[140px] truncate">{staff.unit}</span>
                <div className="flex flex-col items-center gap-1">
                  <span className={`font-semibold text-[13px] ${competency >= 85 ? 'text-[#1c7b56]' : competency >= 70 ? 'text-[#9a6115]' : 'text-[#b14343]'}`}>
                    {competency}%
                  </span>
                  {competency < 80 && (
                    <span className="text-[9px] bg-[#fde9e9] text-[#b14343] px-1.5 py-0.5 rounded-full font-semibold">LOW</span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-center gap-0.5">
                  <span className="text-[#11203b] font-semibold text-[13px]">{completed}/{TRAINING_MODULES.length}</span>
                  {overdue > 0 && (
                    <span className="text-[10px] bg-[#fde9e9] text-[#b14343] px-1.5 py-0.5 rounded-full">{overdue} overdue</span>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/supervisor/staff/${staff.id}`)}
                  className="text-[#1c5eff] hover:text-[#1548e8] transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
