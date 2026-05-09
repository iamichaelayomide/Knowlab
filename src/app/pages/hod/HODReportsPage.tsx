import { Chart2 as BarChart2, ClipboardTick, Profile2User, TickCircle as CheckCircle2, Warning2 as AlertTriangle } from 'iconsax-react';
import { ALERTS, QC_LOGS, getStaffUsers } from '../../data/mockData';
import { LAB_ORDERS, PATIENTS } from '../../data/patients';

export default function HODReportsPage() {
  const allStaff = getStaffUsers();
  const qcPassRate = Math.round((QC_LOGS.filter((q) => q.overallStatus === 'passed').length / Math.max(1, QC_LOGS.length)) * 100);
  const avgCompetency = Math.round(allStaff.reduce((sum, s) => sum + (s.competencyScore ?? 75), 0) / Math.max(1, allStaff.length));
  const heldOrders = LAB_ORDERS.filter((order) => order.status === 'held').length;
  const pendingOrders = LAB_ORDERS.filter((order) => order.status === 'pending' || order.status === 'in_progress').length;
  const unreadAlerts = ALERTS.filter((alert) => !alert.read && alert.targetRoles.includes('hod')).length;

  const kpis = [
    { label: 'QC Pass Rate', value: `${qcPassRate}%`, target: '>=95%', met: qcPassRate >= 95, trend: 'Current QC register', icon: <ClipboardTick size={18} /> },
    { label: 'Patient Workload', value: PATIENTS.length, target: 'Lab-wide view', met: heldOrders === 0, trend: `${heldOrders} held order(s)`, icon: <Profile2User size={18} /> },
    { label: 'Avg Staff Competency', value: `${avgCompetency}%`, target: '>=80%', met: avgCompetency >= 80, trend: 'Bench readiness score', icon: <CheckCircle2 size={18} /> },
    { label: 'Priority Alerts', value: unreadAlerts, target: '0 unread', met: unreadAlerts === 0, trend: 'Needs HOD attention', icon: <AlertTriangle size={18} /> },
  ];

  const qcByLevel = [
    { level: 'Level 1 (Low)', entries: 2, passed: 2, warned: 0, failed: 0 },
    { level: 'Level 2 (Normal)', entries: 3, passed: 2, warned: 1, failed: 0 },
    { level: 'Level 3 (High)', entries: 1, passed: 1, warned: 0, failed: 0 },
  ];

  const workloadByBench = Array.from(new Set(LAB_ORDERS.map((order) => order.bench))).map((bench) => {
    const orders = LAB_ORDERS.filter((order) => order.bench === bench);
    return {
      bench,
      total: orders.length,
      held: orders.filter((order) => order.status === 'held').length,
      pending: orders.filter((order) => order.status === 'pending' || order.status === 'in_progress').length,
    };
  });

  return (
    <div className="kl-page">
      <div className="mb-6">
        <h1 className="mb-1 text-[24px] font-semibold text-[var(--kl-text)]">Department Reports</h1>
        <p className="text-[14px] text-[var(--kl-text-muted)]">Lab-wide patient, QC, staff, and alert performance for {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`kl-premium-card p-5 ${kpi.met ? '' : 'bg-[rgba(154,97,21,0.10)]'}`}>
            <div className="mb-5 flex items-start justify-between">
              <div className="grid size-11 place-items-center rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-raised)] text-[var(--text-primary)]">{kpi.icon}</div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${kpi.met ? 'bg-[#e8f8f1] text-[#1c7b56] dark:bg-[rgba(28,123,86,0.18)] dark:text-[#88e0ba]' : 'bg-[#fff0db] text-[#9a6115] dark:bg-[rgba(154,97,21,0.18)] dark:text-[#f3c26f]'}`}>
                {kpi.met ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                {kpi.met ? 'On target' : 'Watch'}
              </span>
            </div>
            <p className="mb-1 text-[12px] text-[var(--text-secondary)]">{kpi.label}</p>
            <p className="text-[30px] font-semibold leading-none text-[var(--text-primary)]">{kpi.value}</p>
            <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-[var(--text-secondary)]">
              <span>Target: {kpi.target}</span>
              <span>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="kl-premium-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-[17px] font-semibold text-[var(--kl-text)]">
            <BarChart2 size={18} /> QC Performance Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-left">
              <thead>
                <tr className="border-b border-[var(--surface-border)]">
                  {['QC Level', 'Total Runs', 'Passed', 'Warning', 'Failed', 'Pass Rate'].map((h) => (
                    <th key={h} className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--kl-text-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qcByLevel.map((row) => {
                  const passRate = Math.round((row.passed / row.entries) * 100);
                  return (
                    <tr key={row.level} className="border-b border-[var(--surface-border)] last:border-0">
                      <td className="py-3 pr-4 text-[13px] font-medium text-[var(--kl-text)]">{row.level}</td>
                      <td className="py-3 pr-4 text-[13px] text-[var(--kl-text-muted)]">{row.entries}</td>
                      <td className="py-3 pr-4 text-[13px] font-semibold text-[#1c7b56] dark:text-[#88e0ba]">{row.passed}</td>
                      <td className="py-3 pr-4 text-[13px] font-semibold text-[#9a6115] dark:text-[#f3c26f]">{row.warned}</td>
                      <td className="py-3 pr-4 text-[13px] font-semibold text-[#b14343] dark:text-[#fca5a5]">{row.failed}</td>
                      <td className="py-3 text-[13px] font-semibold text-[var(--text-primary)]">{passRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="kl-gradient-card rounded-[28px] border border-[var(--surface-border)] p-6">
          <h2 className="mb-4 text-[17px] font-semibold text-[var(--kl-text)]">Patient Workload</h2>
          <div className="grid gap-3">
            {workloadByBench.map((row) => (
              <div key={row.bench} className="rounded-[22px] border border-[var(--surface-border)] bg-[var(--surface-card)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-[var(--text-primary)]">{row.bench}</p>
                  <span className="rounded-full bg-[var(--surface-raised)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">{row.total} orders</span>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)]">{row.pending} active / {row.held} held for review</p>
              </div>
            ))}
            <div className="rounded-[22px] border border-[var(--surface-border)] bg-[var(--surface-card)] p-4">
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">Operational note</p>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                Prioritize held patient orders, unresolved QC warnings, and unread safety alerts before routine reporting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
