import { useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { ArrowRight2 as ChevronRight, Chart2, ClipboardTick, People, Profile2User, Warning2 } from 'iconsax-react';
import { ALERTS, QC_LOGS, getStaffUsers } from '../../data/mockData';
import { LAB_ORDERS, PATIENTS } from '../../data/patients';
import { useAuth } from '../../context/AuthContext';
import { openFloatingAI } from '../../services/aiWidget';
import { TEXT_TOKENS } from '../../utils/textTokens';

function Metric({ label, value, sub, icon, onClick }: { label: string; value: string | number; sub: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="kl-gradient-card kl-card-interactive rounded-[28px] border border-[var(--surface-border)] p-5 text-left shadow-sm">
      <div className="mb-5 grid size-11 place-items-center rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-primary)]">{icon}</div>
      <p className="mb-1 text-[12px] text-[var(--text-secondary)]">{label}</p>
      <p className="mb-1 text-[30px] font-semibold leading-none text-[var(--text-primary)]">{value}</p>
      <p className="text-[12px] text-[var(--text-secondary)]">{sub}</p>
    </button>
  );
}

export default function HODDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const staff = getStaffUsers();
  const qcPassed = QC_LOGS.filter((entry) => entry.overallStatus === 'passed').length;
  const qcRate = Math.round((qcPassed / Math.max(1, QC_LOGS.length)) * 100);
  const heldOrders = LAB_ORDERS.filter((order) => order.status === 'held').length;
  const alerts = ALERTS.filter((alert) => !alert.read && alert.targetRoles.includes('hod'));
  const units = Array.from(new Set(staff.map((member) => member.unit)));

  return (
    <div className="kl-page">
      <section className="kl-premium-card mb-5 overflow-hidden bg-[linear-gradient(145deg,#0c0c0d,#19191b_52%,#2a2a2c)] p-5 text-white sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/68">Head of Department</p>
            <h1 className="text-[28px] font-semibold leading-tight sm:text-[34px]">Department Overview</h1>
            <p className="mt-3 max-w-[620px] text-[14px] leading-relaxed text-white/68">
              {user.department} {TEXT_TOKENS.separator.trim()} {staff.length} staff across {units.length} units with lab-wide patient and QC visibility.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-primary bg-white text-black" onClick={() => navigate('/hod/patients')}>Open patients</button>
              <button className="kl-button-soft rounded-full border border-white/14 bg-white/8 px-4 text-white" onClick={() => navigate('/hod/reports')}>View reports</button>
              <button className="kl-button-soft rounded-full border border-white/14 bg-white/8 px-4 text-white" onClick={() => openFloatingAI('Give me an executive-ready SOP, QC, and patient workload narrative.')}>Ask AI insights</button>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ['QC pass rate', `${qcRate}%`, `${QC_LOGS.length} QC entries reviewed in demo data.`],
              ['Patient workload', `${PATIENTS.length} patients`, `${heldOrders} held order(s) across the lab.`],
              ['Unread alerts', `${alerts.length} alerts`, 'Review safety and administrative notices.'],
            ].map(([label, value, sub]) => (
              <div key={label} className="rounded-[22px] border border-white/12 bg-white/8 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">{label}</p>
                <p className="text-[18px] font-semibold text-white">{value}</p>
                <p className="mt-1 text-[12px] text-white/50">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Staff" value={staff.length} sub={`Across ${units.length} units`} icon={<People size={18} />} onClick={() => navigate('/hod/staff')} />
        <Metric label="Patients" value={PATIENTS.length} sub={`${heldOrders} held orders`} icon={<Profile2User size={18} />} onClick={() => navigate('/hod/patients')} />
        <Metric label="QC Pass Rate" value={`${qcRate}%`} sub="Current demo register" icon={<ClipboardTick size={18} />} onClick={() => navigate('/hod/qc-log')} />
        <Metric label="Reports" value="Live" sub="Department analytics" icon={<Chart2 size={18} />} onClick={() => navigate('/hod/reports')} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="kl-premium-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Staff by Unit</h2>
            <button onClick={() => navigate('/hod/staff')} className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--text-primary)]">Full list <ChevronRight size={14} /></button>
          </div>
          {units.map((unit) => {
            const unitStaff = staff.filter((member) => member.unit === unit);
            const avg = Math.round(unitStaff.reduce((sum, member) => sum + (member.competencyScore ?? 75), 0) / unitStaff.length);
            return (
              <div key={unit} className="flex items-center gap-3 border-b border-[var(--surface-border)] py-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{unit}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{unitStaff.length} staff</p>
                </div>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">{avg}%</p>
              </div>
            );
          })}
        </div>

        <div className="kl-premium-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Department Alerts</h2>
            <button onClick={() => navigate('/hod/alerts')} className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--text-primary)]">View all <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-2">
            {ALERTS.filter((alert) => alert.targetRoles.includes('hod')).slice(0, 6).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-[18px] bg-[var(--surface-raised)] p-3">
                <Warning2 size={14} className={alert.type === 'danger' ? 'text-[#b14343]' : 'text-[var(--text-secondary)]'} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{alert.title}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{alert.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
