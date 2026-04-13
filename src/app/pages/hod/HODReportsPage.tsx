import { BarChart2, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { TRAINING_RECORDS, TRAINING_MODULES, QC_LOGS, CAPA_ITEMS, getStaffUsers, ALERTS } from '../../data/mockData';

export default function HODReportsPage() {
  const allStaff = getStaffUsers();
  const completedTraining = TRAINING_RECORDS.filter(r => r.status === 'completed').length;
  const totalTraining = allStaff.length * TRAINING_MODULES.length;
  const trainingCompliance = Math.round((completedTraining / totalTraining) * 100);
  const qcPassRate = Math.round((QC_LOGS.filter(q => q.overallStatus === 'passed').length / QC_LOGS.length) * 100);
  const avgCompetency = Math.round(allStaff.reduce((sum, s) => sum + (s.competencyScore ?? 75), 0) / allStaff.length);
  const openCAPAs = CAPA_ITEMS.filter(c => c.status !== 'completed').length;
  const closedCAPAs = CAPA_ITEMS.filter(c => c.status === 'completed').length;

  const kpis = [
    { label: 'Training Compliance', value: `${trainingCompliance}%`, target: '≥85%', met: trainingCompliance >= 85, trend: '+4% vs last month' },
    { label: 'QC Pass Rate', value: `${qcPassRate}%`, target: '≥95%', met: qcPassRate >= 95, trend: 'Stable' },
    { label: 'Avg Staff Competency', value: `${avgCompetency}%`, target: '≥80%', met: avgCompetency >= 80, trend: '+2% vs last quarter' },
    { label: 'CAPA Closure Rate', value: `${Math.round((closedCAPAs / CAPA_ITEMS.length) * 100)}%`, target: '≥80%', met: closedCAPAs / CAPA_ITEMS.length >= 0.8, trend: `${openCAPAs} open` },
  ];

  // Monthly QC summary (simulated)
  const qcByLevel = [
    { level: 'Level 1 (Low)', entries: 2, passed: 2, warned: 0, failed: 0 },
    { level: 'Level 2 (Normal)', entries: 3, passed: 2, warned: 1, failed: 0 },
    { level: 'Level 3 (High)', entries: 1, passed: 1, warned: 0, failed: 0 },
  ];

  return (
    <div className="kl-page">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Department Reports</h1>
        <p className="text-[#73839f] text-[14px]">Performance metrics for {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPI Summary */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {kpis.map(kpi => (
          <div key={kpi.label} className={`rounded-[20px] border p-5 ${kpi.met ? 'bg-white border-[#d3def5]' : 'bg-[#fffbf5] border-[#f5d99a]'}`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-[#475a7d] text-[13px]">{kpi.label}</p>
              <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${kpi.met ? 'bg-[#e8f8f1] text-[#1c7b56]' : 'bg-[#fff0db] text-[#9a6115]'}`}>
                {kpi.met ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                {kpi.met ? 'On Target' : 'Below Target'}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className={`font-bold text-[32px] leading-none ${kpi.met ? 'text-[#11203b]' : 'text-[#9a6115]'}`}>{kpi.value}</p>
                <p className="text-[#73839f] text-[12px] mt-1">Target: {kpi.target}</p>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-[#73839f]">
                <TrendingUp size={13} />
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Training breakdown */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] p-6 mb-5">
        <h2 className="text-[#11203b] font-semibold text-[17px] mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-[#1c5eff]" /> Training Breakdown by Module
        </h2>
        <div className="space-y-3">
          {TRAINING_MODULES.map(mod => {
            const modRecords = TRAINING_RECORDS.filter(r => r.moduleId === mod.id);
            const completed = modRecords.filter(r => r.status === 'completed').length;
            const overdue = modRecords.filter(r => r.status === 'overdue').length;
            const pct = Math.round((completed / allStaff.length) * 100);
            return (
              <div key={mod.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#11203b] text-[13px] font-medium">{mod.title}</span>
                    {mod.mandatory && <span className="text-[9px] bg-[#fde9e9] text-[#b14343] px-1.5 py-0.5 rounded-full font-semibold">REQ</span>}
                  </div>
                  <div className="flex items-center gap-3 text-[12px]">
                    {overdue > 0 && <span className="text-[#b14343]">{overdue} overdue</span>}
                    <span className="font-semibold" style={{ color: pct >= 80 ? '#1c7b56' : pct >= 60 ? '#9a6115' : '#b14343' }}>{pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-[#f4f8ff] rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#1c7b56' : pct >= 60 ? '#9a6115' : '#b14343' }}
                  />
                </div>
                <p className="text-[#73839f] text-[10px] mt-0.5">{completed}/{allStaff.length} staff completed</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* QC Performance */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] p-6 mb-5">
        <h2 className="text-[#11203b] font-semibold text-[17px] mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-[#1c5eff]" /> QC Performance Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[400px]">
            <thead>
              <tr className="border-b border-[#f4f8ff]">
                {['QC Level', 'Total Runs', 'Passed', 'Warning', 'Failed', 'Pass Rate'].map(h => (
                  <th key={h} className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qcByLevel.map(row => {
                const passRate = Math.round((row.passed / row.entries) * 100);
                return (
                  <tr key={row.level} className="border-b border-[#f4f8ff] last:border-0">
                    <td className="py-3 pr-4 text-[#11203b] font-medium text-[13px]">{row.level}</td>
                    <td className="py-3 pr-4 text-[#475a7d] text-[13px]">{row.entries}</td>
                    <td className="py-3 pr-4 text-[#1c7b56] font-semibold text-[13px]">{row.passed}</td>
                    <td className="py-3 pr-4 text-[#9a6115] font-semibold text-[13px]">{row.warned}</td>
                    <td className="py-3 pr-4 text-[#b14343] font-semibold text-[13px]">{row.failed}</td>
                    <td className="py-3">
                      <span className={`font-semibold text-[13px] ${passRate === 100 ? 'text-[#1c7b56]' : passRate >= 80 ? 'text-[#9a6115]' : 'text-[#b14343]'}`}>
                        {passRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CAPA summary */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] p-6">
        <h2 className="text-[#11203b] font-semibold text-[17px] mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-[#1c5eff]" /> CAPA Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total CAPAs', value: CAPA_ITEMS.length, color: '#11203b', bg: '#f4f8ff' },
            { label: 'Open', value: CAPA_ITEMS.filter(c => c.status === 'open').length, color: '#b14343', bg: '#fde9e9' },
            { label: 'In Progress', value: CAPA_ITEMS.filter(c => c.status === 'in_progress').length, color: '#9a6115', bg: '#fff0db' },
            { label: 'Completed', value: CAPA_ITEMS.filter(c => c.status === 'completed').length, color: '#1c7b56', bg: '#e8f8f1' },
          ].map(item => (
            <div key={item.label} className="rounded-[14px] p-4 text-center" style={{ backgroundColor: item.bg }}>
              <p className="font-bold text-[24px]" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[12px] font-medium" style={{ color: item.color }}>{item.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {CAPA_ITEMS.map(capa => (
            <div key={capa.id} className="flex items-center gap-3 py-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                capa.priority === 'critical' ? 'bg-[#b14343]' : capa.priority === 'high' ? 'bg-[#9a6115]' : 'bg-[#1c5eff]'
              }`} />
              <span className="text-[#11203b] text-[13px] flex-1">{capa.title}</span>
              <span className="text-[#73839f] text-[12px]">{capa.code}</span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                capa.status === 'completed' ? 'bg-[#e8f8f1] text-[#1c7b56]' :
                capa.status === 'open' ? 'bg-[#fde9e9] text-[#b14343]' :
                'bg-[#fff0db] text-[#9a6115]'
              }`}>{capa.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

