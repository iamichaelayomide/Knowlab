import { useNavigate } from 'react-router';
import { Users, ShieldAlert, GraduationCap, BarChart2, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { USERS, CAPA_ITEMS, TRAINING_RECORDS, TRAINING_MODULES, ALERTS, getStaffUsers, QC_LOGS } from '../../data/mockData';
import { getWorkflowState } from '../../services/workflowStore';
import { openFloatingAI } from '../../services/aiWidget';
import { TEXT_TOKENS } from '../../utils/textTokens';

export default function HODDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allStaff = getStaffUsers();
  const openCAPAs = CAPA_ITEMS.filter(c => c.status !== 'completed');
  const criticalCAPAs = CAPA_ITEMS.filter(c => c.priority === 'critical' && c.status !== 'completed');
  const completedTraining = TRAINING_RECORDS.filter(r => r.status === 'completed').length;
  const totalTraining = allStaff.length * TRAINING_MODULES.length;
  const trainingCompliance = Math.round((completedTraining / totalTraining) * 100);
  const qcPassed = QC_LOGS.filter(q => q.overallStatus === 'passed').length;
  const qcTotal = QC_LOGS.length;
  const qcRate = Math.round((qcPassed / qcTotal) * 100);
  const hodAlerts = ALERTS.filter(a => !a.read && a.targetRoles.includes('hod'));
  const workflow = getWorkflowState();
  const pendingValidations = workflow.validationTasks.filter(v => v.assignedHodId === user?.id && v.decision === 'pending').length;
  const pendingUserApprovals = workflow.userRequests.filter(r => r.decision === 'pending').length;
  const pendingValidationTask = workflow.validationTasks.find(v => v.assignedHodId === user?.id && v.decision === 'pending');
  const firstOpenCapa = CAPA_ITEMS.find(c => c.status !== 'completed');
  const firstUnreadAlert = ALERTS.find(a => !a.read && a.targetRoles.includes('hod'));
  const latestQc = QC_LOGS[0];

  const lowCompetency = allStaff.filter(s => (s.competencyScore ?? 75) < 80);
  const lowestCompetencyStaff = lowCompetency.slice(0, 3).map(s => s.name).join(', ');

  return (
    <div className="kl-page">
      {/* Hero */}
      <div
        className="rounded-[18px] sm:rounded-[24px] overflow-hidden mb-4 sm:mb-6"
        style={{ background: 'linear-gradient(151deg, rgb(7,20,43) 11%, rgb(15,31,68) 53%, rgb(28,94,255) 89%)' }}
      >
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.14)] rounded-full px-4 py-2 mb-4">
              <span className="text-[#dbe7ff] text-[11px] font-semibold tracking-[1.98px] uppercase">Head of Department</span>
            </div>
            <h1 className="text-white font-bold text-[24px] sm:text-[28px] leading-[1.2] mb-2">
              Department Overview
            </h1>
            <p className="text-[#ebf3ff] text-[14px] leading-relaxed max-w-[480px]">
              {user?.department} {TEXT_TOKENS.separator.trim()} {allStaff.length} staff across {new Set(allStaff.map(s => s.unit)).size} units
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => navigate('/hod/staff')} className="bg-white text-[#11203b] font-medium text-[13px] px-4 py-2.5 rounded-[13px] hover:bg-[#f4f8ff] transition-colors">
                Staff overview
              </button>
              <button onClick={() => navigate('/hod/reports')} className="bg-[rgba(40,70,111,0.8)] border border-[rgba(124,147,183,0.8)] text-white font-medium text-[13px] px-4 py-2.5 rounded-[13px]">
                View reports
              </button>
              <button
                onClick={() => openFloatingAI('Who are the people in haematology bench who have under 80% competency level?')}
                className="bg-[rgba(40,70,111,0.8)] border border-[rgba(124,147,183,0.8)] text-white font-medium text-[13px] px-4 py-2.5 rounded-[13px]"
              >
                Ask AI insights
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:w-[320px]">
            {[
              {
                label: 'TRAINING COMPLIANCE',
                value: `${trainingCompliance}%`,
                sub: `${completedTraining}/${totalTraining} modules completed`,
              },
              {
                label: 'QC PASS RATE',
                value: `${qcRate}%`,
                sub: latestQc ? `Latest batch: ${latestQc.level} ${TEXT_TOKENS.separator.trim()} ${latestQc.overallStatus}` : `${qcPassed}/${qcTotal} entries passed`,
              },
              {
                label: 'OPEN CAPAS',
                value: openCAPAs.length,
                sub: firstOpenCapa ? `${firstOpenCapa.code} ${TEXT_TOKENS.separator.trim()} ${firstOpenCapa.title}` : `${criticalCAPAs.length} critical`,
              },
              {
                label: 'UNREAD ALERTS',
                value: hodAlerts.length,
                sub: firstUnreadAlert ? `Latest: ${firstUnreadAlert.title}` : 'Require your attention',
              },
              {
                label: 'SOP VALIDATION',
                value: pendingValidations,
                sub: pendingValidationTask
                  ? `Next validation: ${pendingValidationTask.sopTitle} ${TEXT_TOKENS.separator.trim()} ${pendingUserApprovals} user approvals pending`
                  : `${pendingUserApprovals} user approvals pending`,
              },
            ].map(item => (
              <div key={item.label} className="bg-[rgba(39,70,111,0.7)] border border-[rgba(124,147,183,0.4)] rounded-[18px] px-4 py-3">
                <p className="text-[#dce6ff] font-semibold text-[9px] tracking-[1.5px] uppercase mb-1">{item.label}</p>
                <p className="text-white font-bold text-[22px] leading-none mb-0.5">{item.value}</p>
                <p className="text-[#a0b4d8] text-[11px]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { label: 'Total Staff', value: allStaff.length, sub: `Across ${new Set(allStaff.map(s => s.unit)).size} units`, color: '#1c5eff', icon: <Users size={16} />, path: '/hod/staff' },
          { label: 'Training Compliance', value: `${trainingCompliance}%`, sub: `Team-wide average`, color: trainingCompliance >= 80 ? '#1c7b56' : '#9a6115', icon: <GraduationCap size={16} />, path: '/hod/training' },
          { label: 'Open CAPAs', value: openCAPAs.length, sub: `${criticalCAPAs.length} critical`, color: criticalCAPAs.length > 0 ? '#b14343' : '#9a6115', icon: <ShieldAlert size={16} />, path: '/hod/capa' },
          { label: 'QC Pass Rate', value: `${qcRate}%`, sub: `Last 7 days`, color: qcRate >= 90 ? '#1c7b56' : '#9a6115', icon: <BarChart2 size={16} />, path: '/hod/qc' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-5 text-left hover:border-[#1c5eff] hover:shadow-[0px_8px_24px_rgba(28,94,255,0.08)] transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="h-1 w-10 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="p-2 rounded-[10px]" style={{ backgroundColor: `${item.color}18` }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
            </div>
            <p className="text-[#475a7d] text-[13px] mb-1">{item.label}</p>
            <p className="text-[#11203b] font-bold text-[26px] leading-none mb-1">{item.value}</p>
            <p className="text-[#73839f] text-[12px]">{item.sub}</p>
          </button>
        ))}
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Staff by unit */}
        <div className="bg-white rounded-[18px] sm:rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#1c5eff]" />
              <h2 className="text-[#11203b] font-semibold text-[16px]">Staff by Unit</h2>
            </div>
            <button onClick={() => navigate('/hod/staff')} className="text-[#1c5eff] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Full list <ChevronRight size={14} />
            </button>
          </div>
          {Array.from(new Set(allStaff.map(s => s.unit))).map(unit => {
            const unitStaff = allStaff.filter(s => s.unit === unit);
            const avgComp = Math.round(unitStaff.reduce((sum, s) => sum + (s.competencyScore ?? 75), 0) / unitStaff.length);
            return (
              <div key={unit} className="flex items-center gap-3 py-3 border-b border-[#f4f8ff] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[#11203b] font-medium text-[13px] truncate">{unit}</p>
                  <p className="text-[#73839f] text-[11px]">{unitStaff.length} staff</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-[13px] ${avgComp >= 85 ? 'text-[#1c7b56]' : avgComp >= 70 ? 'text-[#9a6115]' : 'text-[#b14343]'}`}>{avgComp}%</p>
                  <p className="text-[#73839f] text-[10px]">avg competency</p>
                </div>
                <div className="w-16">
                  <div className="w-full bg-[#f4f8ff] rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${avgComp}%`, backgroundColor: avgComp >= 85 ? '#1c7b56' : avgComp >= 70 ? '#9a6115' : '#b14343' }} />
                  </div>
                </div>
              </div>
            );
          })}
          {/* Low competency alert */}
          {lowCompetency.length > 0 && (
            <div className="mt-3 bg-[#fde9e9] rounded-[12px] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={12} className="text-[#b14343]" />
                <span className="text-[#b14343] text-[11px] font-semibold">{lowCompetency.length} staff below 80% threshold</span>
              </div>
              <p className="text-[#b14343] text-[12px]">{lowestCompetencyStaff} {TEXT_TOKENS.separator.trim()} review recommended</p>
            </div>
          )}
        </div>

        {/* CAPA Summary */}
        <div className="bg-white rounded-[18px] sm:rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#1c5eff]" />
              <h2 className="text-[#11203b] font-semibold text-[16px]">CAPA Status</h2>
            </div>
            <button onClick={() => navigate('/hod/capa')} className="text-[#1c5eff] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Manage <ChevronRight size={14} />
            </button>
          </div>
          {CAPA_ITEMS.map(capa => (
            <div key={capa.id} className="flex items-start gap-3 py-3 border-b border-[#f4f8ff] last:border-0">
              <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                capa.priority === 'critical' ? 'bg-[#b14343]' :
                capa.priority === 'high' ? 'bg-[#9a6115]' : 'bg-[#1c5eff]'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[#11203b] font-medium text-[12px] leading-snug">{capa.title}</p>
                <p className="text-[#73839f] text-[10px] mt-0.5">{capa.code}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                capa.status === 'completed' ? 'bg-[#e8f8f1] text-[#1c7b56]' :
                capa.status === 'open' ? 'bg-[#fde9e9] text-[#b14343]' :
                'bg-[#fff0db] text-[#9a6115]'
              }`}>
                {capa.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-[18px] sm:rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#1c5eff]" />
            <h2 className="text-[#11203b] font-semibold text-[16px]">Department Alerts</h2>
            {hodAlerts.length > 0 && (
              <span className="bg-[#fde9e9] text-[#b14343] text-[11px] font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">{hodAlerts.length}</span>
            )}
          </div>
          <button onClick={() => navigate('/hod/alerts')} className="text-[#1c5eff] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {ALERTS.filter(a => a.targetRoles.includes('hod')).slice(0, 6).map(alert => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-[14px] hover:bg-[#f4f8ff] transition-colors ${!alert.read ? 'bg-[#f9fbff]' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                alert.type === 'danger' ? 'bg-[#b14343]' :
                alert.type === 'warning' ? 'bg-[#9a6115]' :
                alert.type === 'success' ? 'bg-[#1c7b56]' : 'bg-[#1c5eff]'
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium truncate ${!alert.read ? 'text-[#11203b]' : 'text-[#475a7d]'}`}>{alert.title}</p>
                <p className="text-[#73839f] text-[11px]">{alert.category} {TEXT_TOKENS.separator.trim()} {new Date(alert.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
              </div>
              {!alert.read && <div className="w-2 h-2 bg-[#1c5eff] rounded-full flex-shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

