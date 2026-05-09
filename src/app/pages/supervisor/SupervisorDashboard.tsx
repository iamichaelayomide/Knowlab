import { useNavigate } from 'react-router';
import {
  ArrowRight2 as ChevronRight,
  ClipboardText,
  Profile2User,
  TickCircle,
  Warning2,
} from 'iconsax-react';
import { ALERTS, QC_LOGS, USERS, getStaffUsers } from '../../data/mockData';
import { LAB_ORDERS, scopePatients } from '../../data/patients';
import { useAuth } from '../../context/AuthContext';
import { openFloatingAI } from '../../services/aiWidget';
import { TEXT_TOKENS } from '../../utils/textTokens';

function MetricCard({ label, value, sublabel, tone, onClick }: { label: string; value: string | number; sublabel: string; tone: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="kl-gradient-card kl-card-interactive rounded-[28px] border border-[var(--surface-border)] p-5 text-left shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-primary)]">
          {tone === 'patient' ? <Profile2User size={17} /> : tone === 'warning' ? <Warning2 size={17} /> : <ClipboardText size={17} />}
        </span>
        <span className="rounded-full bg-[var(--kl-surface-tinted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Live</span>
      </div>
      <p className="mb-1 text-[12px] font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="mb-1 text-[30px] font-semibold leading-none text-[var(--text-primary)]">{value}</p>
      <p className="text-[12px] text-[var(--text-secondary)]">{sublabel}</p>
    </button>
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
      <section className="kl-premium-card mb-5 overflow-hidden bg-[linear-gradient(145deg,#0c0c0d,#19191b_52%,#2a2a2c)] p-5 text-white sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/68">
              Unit command center
            </p>
            <h1 className="text-[28px] font-semibold leading-tight sm:text-[34px]">Good morning, {user.name.split(' ')[0]}.</h1>
            <p className="mt-3 max-w-[620px] text-[14px] leading-relaxed text-white/68">
              {user.unit} {TEXT_TOKENS.separator.trim()} {staff.length} staff members {TEXT_TOKENS.separator.trim()} bench-focused patient and QC oversight.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-primary bg-white text-black" onClick={() => navigate('/supervisor/patients')}>Open patients</button>
              <button className="kl-button-soft rounded-full border border-white/14 bg-white/8 px-4 text-white" onClick={() => navigate('/supervisor/qc-log')}>Open QC log</button>
              <button className="kl-button-soft rounded-full border border-white/14 bg-white/8 px-4 text-white" onClick={() => openFloatingAI('Which QC issue should I prioritize today?')}>Ask AI insights</button>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ['Review queue', `${qcPending} QC log pending review.`, `${qcAttention} warning/fail signal(s).`],
              ['Patient workload', `${patients.length} patients in scope.`, `${heldOrders} held order(s) require attention.`],
              ['SOP workflow', 'SOP reviews remain available.', 'Open the SOP Reviews queue when assigned.'],
            ].map(([label, value, sub]) => (
              <div key={label} className="rounded-[22px] border border-white/12 bg-white/8 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">{label}</p>
                <p className="text-[14px] font-medium text-white">{value}</p>
                <p className="mt-1 text-[12px] text-white/50">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Staff Members" value={staff.length} sublabel="In supervisor view" tone="staff" onClick={() => navigate('/supervisor/staff')} />
        <MetricCard label="Patients" value={patients.length} sublabel={`${heldOrders} held orders`} tone="patient" onClick={() => navigate('/supervisor/patients')} />
        <MetricCard label="QC Pending" value={qcPending} sublabel={`${qcAttention} need attention`} tone="warning" onClick={() => navigate('/supervisor/qc-log')} />
        <MetricCard label="Unread Alerts" value={myAlerts.length} sublabel="Need follow-up" tone="alert" onClick={() => navigate('/supervisor/alerts')} />
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
                  <span className="rounded-full bg-[var(--kl-surface-tinted)] px-2.5 py-1 text-[10px] font-semibold capitalize text-[var(--text-primary)]">{order.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
