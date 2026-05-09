import React from 'react';
import { useNavigate } from 'react-router';
import {
  People as Users,
  ClipboardText as ClipboardList,
  ShieldSecurity as ShieldAlert,
  Teacher as GraduationCap,
  Warning2 as AlertTriangle,
  TickCircle as CheckCircle2,
  ArrowRight2 as ChevronRight,
} from 'iconsax-react';
import { useAuth } from '../../context/AuthContext';
import { USERS, QC_LOGS, CAPA_ITEMS, TRAINING_RECORDS, TRAINING_MODULES, ALERTS, getStaffUsers } from '../../data/mockData';
import { getWorkflowState } from '../../services/workflowStore';
import { openFloatingAI } from '../../services/aiWidget';
import { TEXT_TOKENS } from '../../utils/textTokens';

function MetricCard({ label, value, sublabel, accent, icon, onClick }: {
  label: string; value: string | number; sublabel: string; accent: string; icon: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={`bg-[var(--kl-surface)] rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-5 text-left w-full hover:border-[var(--surface-border-strong)] hover:shadow-[var(--kl-shadow)] transition-all ${onClick ? '' : 'pointer-events-none'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
        <div className="p-2 rounded-[10px]" style={{ backgroundColor: `${accent}18` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      <p className="text-[var(--kl-text-muted)] text-[13px] mb-1">{label}</p>
      <p className="text-[var(--kl-text)] font-bold text-[28px] leading-none mb-1">{value}</p>
      <p className="text-[var(--kl-text-muted)] text-[12px]">{sublabel}</p>
    </button>
  );
}

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const staffUsers = getStaffUsers().filter(s => s.unit === user?.unit || s.unit.includes('Hematology'));
  const allStaff = getStaffUsers();

  const recentQC = QC_LOGS.slice(0, 5);
  const qcFailed = QC_LOGS.filter(q => q.overallStatus === 'failed').length;
  const qcWarning = QC_LOGS.filter(q => q.overallStatus === 'warning').length;
  const qcPending = QC_LOGS.filter(q => !q.supervisorReviewed).length;

  const openCAPAs = CAPA_ITEMS.filter(c => c.status === 'open' || c.status === 'in_progress').length;
  const criticalCAPAs = CAPA_ITEMS.filter(c => c.priority === 'critical' && c.status !== 'completed').length;

  const overdueTraining = TRAINING_RECORDS.filter(r => r.status === 'overdue').length;
  const allTraining = TRAINING_RECORDS.length;
  const completedTraining = TRAINING_RECORDS.filter(r => r.status === 'completed').length;
  const trainingCompliance = Math.round((completedTraining / allTraining) * 100);

  const myAlerts = ALERTS.filter(a => !a.read && a.targetRoles.includes('supervisor'));
  const workflow = getWorkflowState();
  const pendingSopReviews = workflow.reviewTasks.filter(t => t.assignedReviewerId === user?.id && t.decision === 'pending').length;
  const pendingUserRequests = workflow.userRequests.filter(r => r.requesterId === user?.id && r.decision === 'pending').length;
  const pendingReviewTask = workflow.reviewTasks.find(t => t.assignedReviewerId === user?.id && t.decision === 'pending');
  const firstOpenCapa = CAPA_ITEMS.find(c => c.status === 'open' || c.status === 'in_progress');
  const firstOverdueTraining = TRAINING_RECORDS.find(r => r.status === 'overdue');
  const overdueModule = firstOverdueTraining ? TRAINING_MODULES.find(m => m.id === firstOverdueTraining.moduleId) : undefined;
  const latestPendingQc = recentQC.find(entry => !entry.supervisorReviewed) ?? recentQC[0];

  return (
    <div className="kl-page">
      {/* Hero */}
      <div
        className="rounded-[18px] sm:rounded-[24px] overflow-hidden mb-4 sm:mb-6 relative"
        style={{ background: 'linear-gradient(151deg, #0b0b0c 0%, #161617 48%, #2a2a2c 100%)' }}
      >
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.14)] rounded-full px-4 py-2 mb-4">
              <span className="text-white/70 text-[11px] font-semibold tracking-[1.98px] uppercase">Unit command center</span>
            </div>
            <h1 className="text-white font-bold text-[24px] sm:text-[28px] leading-[1.2] mb-2">
              Good morning, {user?.name?.split(' ')[0]}.
            </h1>
            <p className="text-white/72 text-[15px] leading-relaxed max-w-[500px]">
              {user?.unit} {TEXT_TOKENS.separator.trim()} {allStaff.length} staff members {TEXT_TOKENS.separator.trim()} Supervisor oversight dashboard
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate('/supervisor/staff')}
                className="bg-[var(--kl-surface)] text-[var(--kl-text)] font-medium text-[13px] px-4 py-2.5 rounded-[13px] hover:bg-[var(--kl-surface-tinted)] transition-colors"
              >
                Open team
              </button>
              <button
                onClick={() => navigate('/supervisor/qc-log')}
                className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-white font-medium text-[13px] px-4 py-2.5 rounded-[13px] backdrop-blur-md hover:bg-[rgba(255,255,255,0.12)] transition-all active:scale-[0.98]"
              >
                Open QC log
              </button>
              <button
                onClick={() => openFloatingAI('What CAPA item should I review in my scope?')}
                className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-white font-medium text-[13px] px-4 py-2.5 rounded-[13px] backdrop-blur-md hover:bg-[rgba(255,255,255,0.12)] transition-all active:scale-[0.98]"
              >
                Ask AI insights
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:w-[300px]">
            {[
              {
                label: 'REVIEW QUEUE',
                value: `${qcPending} QC log${qcPending !== 1 ? 's' : ''} pending review.`,
                sub: latestPendingQc
                  ? `${latestPendingQc.level} on ${new Date(latestPendingQc.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                  : 'No QC entries waiting',
              },
              {
                label: 'OPEN CAPAS',
                value: `${openCAPAs} corrective actions in progress.`,
                sub: firstOpenCapa ? `${firstOpenCapa.code} ${TEXT_TOKENS.separator.trim()} ${firstOpenCapa.title}` : 'No open CAPAs',
              },
              {
                label: 'TRAINING COMPLIANCE',
                value: `${trainingCompliance}% team compliance rate.`,
                sub: overdueModule ? `Overdue: ${overdueModule.title}` : 'All assigned training is current',
              },
              {
                label: 'SOP WORKFLOW',
                value: `${pendingSopReviews} SOP review tasks ${TEXT_TOKENS.separator.trim()} ${pendingUserRequests} user request(s).`,
                sub: pendingReviewTask ? `Next review: ${pendingReviewTask.sopTitle}` : 'No SOP reviews waiting on you',
              },
            ].map(item => (
              <div key={item.label} className="bg-[rgba(255,255,255,0.075)] border border-[rgba(255,255,255,0.12)] rounded-[20px] px-4 py-3 backdrop-blur-md">
                <p className="text-white/62 font-semibold text-[10px] tracking-[1.98px] uppercase mb-0.5">{item.label}</p>
                <p className="text-white text-[13px]">{item.value}</p>
                <p className="text-white/50 text-[11px] mt-0.5 leading-snug">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <MetricCard label="Staff Members" value={allStaff.length} sublabel="In your department" accent="#2f2f31" icon={<Users size={16} />} onClick={() => navigate('/supervisor/staff')} />
        <MetricCard label="QC Pending Review" value={qcPending} sublabel={`${qcWarning} warnings this week`} accent="#9a6115" icon={<ClipboardList size={16} />} onClick={() => navigate('/supervisor/qc-log')} />
        <MetricCard label="Open CAPAs" value={openCAPAs} sublabel={`${criticalCAPAs} critical priority`} accent={criticalCAPAs > 0 ? '#b14343' : '#9a6115'} icon={<ShieldAlert size={16} />} onClick={() => navigate('/supervisor/capa')} />
        <MetricCard label="Training Compliance" value={`${trainingCompliance}%`} sublabel={`${overdueTraining} overdue across team`} accent={overdueTraining > 0 ? '#b14343' : '#1c7b56'} icon={<GraduationCap size={16} />} onClick={() => navigate('/supervisor/training')} />
      </div>

      {/* Two Column */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Staff Overview */}
        <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[var(--text-primary)]" />
              <h2 className="text-[var(--kl-text)] font-semibold text-[16px]">Staff Overview</h2>
            </div>
            <button onClick={() => navigate('/supervisor/staff')} className="text-[var(--text-primary)] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {allStaff.map(staff => {
              const staffRecords = TRAINING_RECORDS.filter(r => r.staffId === staff.id);
              const overdueCount = staffRecords.filter(r => r.status === 'overdue').length;
              const competency = staff.competencyScore ?? 75;
              return (
                <button
                  key={staff.id}
                  onClick={() => navigate(`/supervisor/staff/${staff.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-[14px] hover:bg-[var(--kl-surface-tinted)] transition-colors text-left group"
                >
                  <div
                    className="size-[34px] rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{
                      background: 'linear-gradient(180deg, var(--surface-raised), var(--surface-card))',
                      border: 'var(--line-hairline) solid var(--surface-border-strong)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {staff.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[var(--kl-text)] font-medium text-[13px]">{staff.name}</p>
                      <span className={`text-[11px] font-semibold ${competency >= 85 ? 'text-[#1c7b56] dark:text-[#88e0ba]' : competency >= 70 ? 'text-[#9a6115] dark:text-[#f3c26f]' : 'text-[#b14343] dark:text-[#fca5a5]'}`}>
                        {competency}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[var(--kl-text-muted)] text-[11px] truncate flex-1">{staff.unit}</p>
                      {overdueCount > 0 && (
                        <span className="bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5] text-[10px] px-1.5 py-0.5 rounded-full">{overdueCount} overdue</span>
                      )}
                    </div>
                    <div className="w-full bg-[var(--kl-surface-tinted)] rounded-full h-1 mt-1.5">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${competency}%`,
                          backgroundColor: competency >= 85 ? '#1c7b56' : competency >= 70 ? '#9a6115' : '#b14343',
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent QC Log */}
        <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-[var(--text-primary)]" />
              <h2 className="text-[var(--kl-text)] font-semibold text-[16px]">Recent QC Entries</h2>
            </div>
            <button onClick={() => navigate('/supervisor/qc-log')} className="text-[var(--text-primary)] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {recentQC.map(entry => {
              const staff = USERS.find(u => u.id === entry.staffId);
              return (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-[14px] hover:bg-[var(--kl-surface-tinted)] transition-colors">
                  <div className={`rounded-full p-1.5 flex-shrink-0 ${
                    entry.overallStatus === 'passed' ? 'bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)] text-[#1c7b56] dark:text-[#88e0ba]' :
                    entry.overallStatus === 'warning' ? 'bg-[#fff0db] dark:bg-[rgba(154,97,21,0.18)] text-[#9a6115] dark:text-[#f3c26f]' :
                    'bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5]'
                  }`}>
                    {entry.overallStatus === 'passed' ? <CheckCircle2 size={13} /> :
                     <AlertTriangle size={13} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--kl-text)] text-[13px] font-medium">{entry.level}</p>
                    <p className="text-[var(--kl-text-muted)] text-[11px]">{entry.date} {TEXT_TOKENS.separator.trim()} {entry.shift} {TEXT_TOKENS.separator.trim()} {staff?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      entry.overallStatus === 'passed' ? 'bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)] text-[#1c7b56] dark:text-[#88e0ba]' :
                      entry.overallStatus === 'warning' ? 'bg-[#fff0db] dark:bg-[rgba(154,97,21,0.18)] text-[#9a6115] dark:text-[#f3c26f]' :
                      'bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5]'
                    }`}>
                      {entry.overallStatus.charAt(0).toUpperCase() + entry.overallStatus.slice(1)}
                    </span>
                    {!entry.supervisorReviewed && (
                      <span className="text-[10px] bg-[var(--kl-surface-tinted)] text-[var(--text-primary)] px-2 py-0.5 rounded-full">Review</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CAPA + Alerts */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Open CAPAs */}
        <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-[var(--text-primary)]" />
              <h2 className="text-[var(--kl-text)] font-semibold text-[16px]">Open CAPAs</h2>
            </div>
            <button onClick={() => navigate('/supervisor/capa')} className="text-[var(--text-primary)] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {CAPA_ITEMS.filter(c => c.status !== 'completed').map(capa => (
              <div key={capa.id} className="flex items-start gap-3 p-3 rounded-[14px] hover:bg-[var(--kl-surface-tinted)] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  capa.priority === 'critical' ? 'bg-[#b14343]' :
                  capa.priority === 'high' ? 'bg-[#9a6115]' : 'bg-[var(--text-tertiary)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--kl-text)] font-medium text-[13px] leading-snug">{capa.title}</p>
                  <p className="text-[var(--kl-text-muted)] text-[11px] mt-0.5">{capa.code} · Due {new Date(capa.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  capa.priority === 'critical' ? 'bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5]' :
                  capa.priority === 'high' ? 'bg-[#fff0db] dark:bg-[rgba(154,97,21,0.18)] text-[#9a6115] dark:text-[#f3c26f]' :
                  'bg-[var(--kl-surface-tinted)] text-[var(--text-primary)]'
                }`}>
                  {capa.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-[var(--text-primary)]" />
              <h2 className="text-[var(--kl-text)] font-semibold text-[16px]">Recent Alerts</h2>
              {myAlerts.length > 0 && (
                <span className="bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5] text-[11px] font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                  {myAlerts.length}
                </span>
              )}
            </div>
            <button onClick={() => navigate('/supervisor/alerts')} className="text-[var(--text-primary)] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {ALERTS.filter(a => a.targetRoles.includes('supervisor')).slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-[14px] hover:bg-[var(--kl-surface-tinted)] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  alert.type === 'danger' ? 'bg-[#b14343]' :
                  alert.type === 'warning' ? 'bg-[#9a6115]' :
                  alert.type === 'success' ? 'bg-[#1c7b56]' : 'bg-[var(--text-tertiary)]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium leading-snug ${!alert.read ? 'text-[var(--kl-text)]' : 'text-[var(--kl-text-muted)]'}`}>{alert.title}</p>
                  <p className="text-[var(--kl-text-muted)] text-[11px]">
                    {new Date(alert.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {TEXT_TOKENS.separator.trim()} {alert.category}
                  </p>
                </div>
                {!alert.read && <div className="w-2 h-2 bg-[var(--text-primary)] rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
