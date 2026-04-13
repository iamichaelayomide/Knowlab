import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Clock, Users } from 'lucide-react';
import { TRAINING_MODULES, TRAINING_RECORDS, getStaffUsers } from '../../data/mockData';
import { TEXT_TOKENS, joinWithSeparator } from '../../utils/textTokens';

export default function TrainingMgmtPage() {
  const [view, setView] = useState<'matrix' | 'module'>('matrix');
  const staffList = getStaffUsers();

  const getRecord = (staffId: string, moduleId: string) =>
    TRAINING_RECORDS.find(r => r.staffId === staffId && r.moduleId === moduleId);

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-[#f4f8ff] text-[#73839f]';
    if (status === 'completed') return 'bg-[#e8f8f1] text-[#1c7b56]';
    if (status === 'overdue') return 'bg-[#fde9e9] text-[#b14343]';
    if (status === 'in_progress') return 'bg-[#fff0db] text-[#9a6115]';
    return 'bg-[#f4f8ff] text-[#73839f]';
  };

  const getStatusIcon = (status: string | undefined) => {
    if (status === 'completed') return <CheckCircle2 size={12} />;
    if (status === 'overdue') return <AlertTriangle size={12} />;
    if (status === 'in_progress') return <Clock size={12} />;
    return <span className="text-[10px]">-</span>;
  };

  const totalCells = staffList.length * TRAINING_MODULES.length;
  const completedCells = TRAINING_RECORDS.filter(r => r.status === 'completed').length;
  const overdueCells = TRAINING_RECORDS.filter(r => r.status === 'overdue').length;
  const overallCompliance = Math.round((completedCells / totalCells) * 100);

  return (
    <div className="kl-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Training Management</h1>
          <p className="text-[#73839f] text-[14px]">Team training compliance matrix - {overallCompliance}% overall</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('matrix')}
            className={`px-4 py-2 rounded-[12px] text-[13px] font-medium transition-colors ${view === 'matrix' ? 'bg-[#1c5eff] text-white' : 'bg-white border border-[#d3def5] text-[#475a7d] hover:bg-[#f4f8ff]'}`}
          >
            Matrix View
          </button>
          <button
            onClick={() => setView('module')}
            className={`px-4 py-2 rounded-[12px] text-[13px] font-medium transition-colors ${view === 'module' ? 'bg-[#1c5eff] text-white' : 'bg-white border border-[#d3def5] text-[#475a7d] hover:bg-[#f4f8ff]'}`}
          >
            By Module
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-[#1c5eff]" />
            <span className="text-[#475a7d] text-[13px]">Team Size</span>
          </div>
          <p className="text-[#11203b] font-bold text-[24px]">{staffList.length}</p>
          <p className="text-[#73839f] text-[12px]">staff members</p>
        </div>
        <div className="bg-[#e8f8f1] rounded-[20px] border border-transparent p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-[#1c7b56]" />
            <span className="text-[#1c7b56] text-[13px]">Compliance</span>
          </div>
          <p className="text-[#1c7b56] font-bold text-[24px]">{overallCompliance}%</p>
          <p className="text-[#1c7b56] text-[12px]">{completedCells} of {totalCells} completions</p>
        </div>
        <div className="bg-[#fde9e9] rounded-[20px] border border-transparent p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-[#b14343]" />
            <span className="text-[#b14343] text-[13px]">Overdue</span>
          </div>
          <p className="text-[#b14343] font-bold text-[24px]">{overdueCells}</p>
          <p className="text-[#b14343] text-[12px]">items need attention</p>
        </div>
      </div>

      {view === 'matrix' ? (
        /* Matrix View */
        <div className="bg-white rounded-[24px] border border-[#d3def5] overflow-x-auto shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)]">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#f4f8ff] bg-[#f9fbff]">
                <th className="text-left p-4 text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] min-w-[160px]">Staff Member</th>
                {TRAINING_MODULES.map(mod => (
                  <th key={mod.id} className="text-center p-3 text-[#73839f] font-semibold text-[10px] uppercase tracking-[0.8px] min-w-[90px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px]">{mod.title.split(' ').slice(0, 3).join(' ')}</span>
                      {mod.mandatory && <span className="text-[9px] bg-[#fde9e9] text-[#b14343] px-1.5 py-0.5 rounded-full">REQ</span>}
                    </div>
                  </th>
                ))}
                <th className="text-center p-3 text-[#73839f] font-semibold text-[10px] uppercase tracking-[0.8px]">Score</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => {
                const staffRecords = TRAINING_RECORDS.filter(r => r.staffId === staff.id);
                const staffCompleted = staffRecords.filter(r => r.status === 'completed').length;
                const scorePercent = Math.round((staffCompleted / TRAINING_MODULES.length) * 100);
                return (
                  <tr key={staff.id} className="border-b border-[#f4f8ff] last:border-0 hover:bg-[#f9fbff] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-[28px] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ backgroundColor: staff.color }}
                        >
                          {staff.initials}
                        </div>
                        <span className="text-[#11203b] font-medium text-[13px]">{staff.name}</span>
                      </div>
                    </td>
                    {TRAINING_MODULES.map(mod => {
                      const record = getRecord(staff.id, mod.id);
                      const status = record?.status;
                      return (
                        <td key={mod.id} className="text-center p-2">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-medium ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-center p-3">
                      <span className={`font-semibold text-[13px] ${
                        scorePercent === 100 ? 'text-[#1c7b56]' : scorePercent >= 70 ? 'text-[#9a6115]' : 'text-[#b14343]'
                      }`}>{scorePercent}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Legend */}
          <div className="flex items-center gap-4 px-4 py-3 border-t border-[#f4f8ff] text-[11px] text-[#73839f]">
            <span className="font-semibold">Legend:</span>
            {[
              { icon: <CheckCircle2 size={11} />, label: 'Completed', bg: 'bg-[#e8f8f1] text-[#1c7b56]' },
              { icon: <AlertTriangle size={11} />, label: 'Overdue', bg: 'bg-[#fde9e9] text-[#b14343]' },
              { icon: <Clock size={11} />, label: 'In Progress', bg: 'bg-[#fff0db] text-[#9a6115]' },
              { icon: <span>-</span>, label: 'Not Started', bg: 'bg-[#f4f8ff] text-[#73839f]' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${item.bg}`}>{item.icon}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* By Module View */
        <div className="space-y-4">
          {TRAINING_MODULES.map(mod => {
            const allRecords = TRAINING_RECORDS.filter(r => r.moduleId === mod.id);
            const completed = allRecords.filter(r => r.status === 'completed').length;
            const pct = Math.round((completed / staffList.length) * 100);
            const visibleStaff = staffList.slice(0, 6);
            const remaining = Math.max(0, staffList.length - visibleStaff.length);
            return (
              <div key={mod.id} className="bg-white rounded-[20px] border border-[#d3def5] p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[#11203b] font-semibold text-[15px]">{mod.title}</h3>
                      {mod.mandatory && <span className="bg-[#fde9e9] text-[#b14343] text-[10px] font-semibold px-2 py-0.5 rounded-full">MANDATORY</span>}
                    </div>
                    <p className="text-[#73839f] text-[12px]">
                      {joinWithSeparator([mod.category, mod.duration, `Pass mark: ${mod.passingScore}%`])}
                    </p>
                  </div>
                  <span className={`font-bold text-[18px] ${pct === 100 ? 'text-[#1c7b56]' : pct >= 70 ? 'text-[#9a6115]' : 'text-[#b14343]'}`}>{pct}%</span>
                </div>
                <div className="w-full bg-[#f4f8ff] rounded-full h-1.5 mb-3">
                  <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#1c7b56' : pct >= 70 ? '#9a6115' : '#b14343' }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleStaff.map(staff => {
                    const record = getRecord(staff.id, mod.id);
                    const status = record?.status || 'not_started';
                    return (
                      <div
                        key={staff.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusColor(status)}`}
                        title={`${staff.name}: ${status}${record?.score ? ` (${record.score}%)` : ''}`}
                      >
                        <div
                          className="size-[16px] rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                          style={{ backgroundColor: staff.color }}
                        >
                          {staff.initials.charAt(0)}
                        </div>
                        {staff.name.split(' ')[0]}
                        {record?.score && `${TEXT_TOKENS.separator}${record.score}%`}
                      </div>
                    );
                  })}
                  {remaining > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#f4f8ff] text-[#475a7d]">
                      +{remaining} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

