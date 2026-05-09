import { useNavigate } from 'react-router';
import {
  ArrowRight2,
  ClipboardText,
  Profile2User,
  TickCircle,
  Warning2,
} from 'iconsax-react';
import { ALERTS, QC_LOGS, USERS, getStaffUsers } from '../../data/mockData';
import { LAB_ORDERS, scopePatients } from '../../data/patients';
import { useAuth } from '../../context/AuthContext';
import { openFloatingAI } from '../../services/aiWidget';

const ArrowRight = ArrowRight2;
const ChevronRight = ArrowRight2;

function MetricTile({ label, value, sublabel, accent }: { label: string; value: string | number; sublabel: string; accent: string }) {
  return (
    <div className="bg-[var(--kl-surface)] rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-5">
      <div className="h-1 rounded-full mb-4" style={{ backgroundColor: accent }} />
      <p className="text-[var(--kl-text-muted)] text-[14px] mb-1">{label}</p>
      <p className="text-[var(--kl-text)] font-bold text-[30px] leading-none mb-1">{value}</p>
      <p className="text-[var(--kl-text-muted)] text-[12px]">{sublabel}</p>
    </div>
  );
}

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const staff = getStaffUsers();
  const patients = scopePatients('supervisor', user.unit, user.department);
  const qcPending = QC_LOGS.filter((entry) => !entry.supervisorReviewed).length;
  const qcAttention = QC_LOGS.filter((entry) => entry.overallStatus !== 'passed').length;
  const heldOrders = LAB_ORDERS.filter((order) => order.status === 'held').length;
  const myAlerts = ALERTS.filter((alert) => !alert.read && alert.targetRoles.includes('supervisor'));
  const recentQc = QC_LOGS.slice(0, 5);

  return (
    <div className="kl-page">
      {/* Hero Banner (Staff Style) */}
      <div
        className="rounded-[24px] overflow-hidden mb-6 relative border border-[var(--surface-border)]"
        style={{ background: 'linear-gradient(151deg, #0f0f10 11%, #1c1c1e 56%, #2a2a2c 100%)' }}
      >
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.14)] rounded-full px-4 py-2 mb-6">
              <span className="text-white/70 text-[11px] font-semibold tracking-[1.98px] uppercase">Unit command center</span>
            </div>
            <h1 className="text-white font-bold text-[32px] sm:text-[42px] leading-[1.1] mb-4">
              Good morning, {user.name.split(' ')[0]}.
            </h1>
            <p className="text-white/72 text-[16px] leading-[1.7] max-w-[580px] mb-8">
              Oversight for <span className="text-white font-black">{user.unit}</span>. You have {staff.length} staff members on active shift and {qcPending} QC logs awaiting review.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/supervisor/patients')}
                className="btn-primary text-white font-bold text-[14px] px-8 py-3.5 rounded-full shadow-lg transition-all hover:translate-y-[-1px] inline-flex items-center gap-2"
              >
                Open Patient Portal <ArrowRight size={16} />
              </button>
              <button
                onClick={() => openFloatingAI('Which QC issue should I prioritize today?')}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-[14px] px-6 py-3.5 rounded-full transition-all"
              >
                Ask AI Insights
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:w-[320px]">
            {[
              { label: 'REVIEW QUEUE', value: `${qcPending} logs pending review`, sub: `${qcAttention} warning/fail signal(s)` },
              { label: 'PATIENT WORKLOAD', value: `${patients.length} patients in scope`, sub: `${heldOrders} held orders require attention` },
              { label: 'SOP WORKFLOW', value: 'SOP reviews available', sub: 'Open queue when assigned' },
            ].map(item => (
              <div
                key={item.label}
                className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[24px] px-5 py-4"
              >
                <p className="text-white/50 font-semibold text-[10px] tracking-[0.2em] uppercase mb-1">{item.label}</p>
                <p className="text-white text-[15px] font-bold leading-snug">{item.value}</p>
                <p className="text-white/40 text-[11px] mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Staff Members" value={staff.length} sublabel="On active shift" accent="#171717" />
        <MetricTile label="Patients" value={patients.length} sublabel={`${heldOrders} held orders`} accent="#1c7b56" />
        <MetricTile label="QC Pending" value={qcPending} sublabel={`${qcAttention} need attention`} accent="#9a6115" />
        <MetricTile label="Unread Alerts" value={myAlerts.length} sublabel="Need follow-up" accent="#b14343" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="kl-premium-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Recent QC Entries</h2>
            <button onClick={() => navigate('/supervisor/qc-log')} className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--text-primary)]">View all <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-2">
            {recentQc.map((entry) => {
              const analyst = USERS.find((item) => item.id === entry.staffId);
              return (
                <div key={entry.id} className="rounded-[20px] border border-[var(--surface-border)] bg-[var(--surface-raised)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--text-primary)]">{entry.level}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{entry.shift} shift | {analyst?.name ?? 'Analyst'}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${entry.overallStatus === 'passed' ? 'bg-[#e8f8f1] text-[#1c7b56] dark:bg-[rgba(28,123,86,0.18)] dark:text-[#88e0ba]' : 'bg-[#fff0db] text-[#9a6115] dark:bg-[rgba(154,97,21,0.18)] dark:text-[#f3c26f]'}`}>
                      {entry.overallStatus === 'passed' ? <TickCircle size={12} /> : <Warning2 size={12} />}
                      {entry.overallStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="kl-premium-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Patient Orders</h2>
            <button onClick={() => navigate('/supervisor/patients')} className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--text-primary)]">Open <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-2">
            {LAB_ORDERS.slice(0, 5).map((order) => (
              <button key={order.id} onClick={() => navigate(`/supervisor/patients/${order.patientId}`)} className="kl-card-interactive w-full rounded-[20px] border border-[var(--surface-border)] bg-[var(--surface-raised)] p-3 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{order.testName}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">{order.ward} | {order.specimen}</p>
                  </div>
                  <span className="rounded-full bg-[var(--kl-surface-tinted)] px-2.5 py-1 text-[10px] font-semibold capitalize text-[var(--text-primary)] text-center">{order.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
