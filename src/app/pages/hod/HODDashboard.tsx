import { useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { ArrowRight2 as ChevronRight, Chart2, ClipboardTick, People, Profile2User, Warning2, Timer1, StatusUp, Flash, Activity } from 'iconsax-react';
import { ALERTS, QC_LOGS, getStaffUsers } from '../../data/mockData';
import { LAB_ORDERS, PATIENTS } from '../../data/patients';
import { useAuth } from '../../context/AuthContext';
import { openFloatingAI } from '../../services/aiWidget';
import { TEXT_TOKENS } from '../../utils/textTokens';

function Metric({ label, value, sub, icon, onClick, trend }: { label: string; value: string | number; sub: string; icon: ReactNode; onClick: () => void; trend?: string }) {
  return (
    <button onClick={onClick} className="kl-gradient-card kl-card-interactive rounded-[32px] border border-[var(--surface-border)] p-6 text-left shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="grid size-12 place-items-center rounded-[20px] border border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--kl-primary)] shadow-xs">{icon}</div>
        {trend && (
            <div className="flex items-center gap-1 bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.12)] px-2 py-0.5 rounded-full border border-[#1c7b56] border-opacity-20">
                <span className="text-[10px] font-black text-[#1c7b56] uppercase tracking-tighter">{trend}</span>
            </div>
        )}
      </div>
      <p className="mb-1 text-[11px] font-black uppercase tracking-[0.1em] text-[var(--text-tertiary)]">{label}</p>
      <p className="mb-2 text-[34px] font-black leading-none text-[var(--text-primary)] tracking-tighter">{value}</p>
      <p className="text-[13px] font-medium text-[var(--text-secondary)] leading-tight">{sub}</p>
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
  
  const totalOrders = LAB_ORDERS.length;
  const pendingOrders = LAB_ORDERS.filter(o => ['ordered', 'collected', 'processing'].includes(o.status)).length;
  const tatCompliance = 94.2; // Mock analytic
  
  const alerts = ALERTS.filter((alert) => !alert.read && alert.targetRoles.includes('hod'));

  return (
    <div className="kl-page p-6 sm:p-8 lg:p-10">
      <section className="kl-premium-card mb-8 overflow-hidden bg-[var(--surface-card)] dark:bg-[linear-gradient(145deg,#0c0c0d,#19191b_52%,#2a2a2c)] p-8 text-[var(--text-primary)] dark:text-white sm:p-10 border border-[var(--surface-border)] shadow-2xl rounded-[40px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex rounded-full border border-[var(--kl-primary)] border-opacity-30 bg-[var(--kl-primary)] bg-opacity-10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--kl-primary)]">Command Centre</span>
                <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] opacity-60">
                    <Activity size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Live Monitoring</span>
                </div>
            </div>
            <h1 className="text-[42px] font-black leading-none tracking-tighter sm:text-[54px] mb-6">Department Health</h1>
            <p className="max-w-[620px] text-[17px] font-medium leading-relaxed text-[var(--text-secondary)] dark:text-white/70">
              Laboratory oversight across all benches. Monitoring <span className="text-[var(--text-primary)] dark:text-white font-black">{totalOrders} active tests</span> and departmental Turnaround Time (TAT) performance.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="btn-primary h-14 px-10 rounded-[24px] font-black text-[15px] shadow-glow hover:translate-y-[-2px] transition-all" onClick={() => navigate('/hod/patients')}>Manage Patients</button>
              <button className="kl-button-soft h-14 px-8 rounded-[24px] border-2 border-[var(--surface-border)] bg-[var(--surface-raised)] dark:bg-white/8 text-[var(--text-primary)] dark:text-white font-black text-[14px] hover:bg-[var(--surface-card)] transition-all" onClick={() => navigate('/hod/reports')}>Operational Reports</button>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { label: 'TAT Compliance', value: `${tatCompliance}%`, sub: 'Average 1.4hrs across all benches.', color: 'text-[#1c7b56]', icon: <Flash size={18} variant="Bold" /> },
              { label: 'Registry Queue', value: pendingOrders, sub: 'Orders awaiting result entry.', color: 'text-[#007aff]', icon: <Timer1 size={18} variant="Bold" /> },
              { label: 'Critical Alerts', value: alerts.length, sub: 'Immediate validation required.', color: 'text-[#b14343]', icon: <Warning2 size={18} variant="Bold" /> },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[32px] border border-[var(--surface-border)] dark:border-white/12 bg-[var(--surface-raised)] dark:bg-white/5 p-5 flex items-center justify-between shadow-sm transition-all hover:border-[var(--kl-primary)] hover:border-opacity-30">
                <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-tertiary)] dark:text-white/40">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-[26px] font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                        <p className="text-[12px] font-bold text-[var(--text-tertiary)] dark:text-white/40">{stat.sub}</p>
                    </div>
                </div>
                <div className={`${stat.color} opacity-40`}>{stat.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Validation Rate" value={`${qcRate}%`} sub="LIMS verification speed" icon={<ClipboardTick size={22} variant="Bold" />} onClick={() => navigate('/hod/qc-log')} trend="+2.4%" />
        <Metric label="Total Load" value={PATIENTS.length} sub="Scoped active cases" icon={<Profile2User size={22} variant="Bold" />} onClick={() => navigate('/hod/patients')} />
        <Metric label="TAT Index" value="Optimal" sub="Within clinical targets" icon={<Flash size={22} variant="Bold" />} onClick={() => navigate('/hod/reports')} trend="Stable" />
        <Metric label="Registry" value="Active" sub="Real-time data flow" icon={<Chart2 size={22} variant="Bold" />} onClick={() => navigate('/hod/reports')} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="kl-premium-card p-8 sm:p-10 shadow-xl border-[var(--surface-border)] rounded-[40px]">
          <div className="mb-8 flex items-center justify-between border-b border-[var(--surface-border)] pb-6">
            <div>
                <h2 className="text-[20px] font-black text-[var(--text-primary)] tracking-tight uppercase">Operational Readiness</h2>
                <p className="text-[14px] font-medium text-[var(--text-secondary)] mt-1 opacity-70">Facility-wide LIMS throughput by department.</p>
            </div>
            <button onClick={() => navigate('/hod/reports')} className="kl-button-soft px-5 py-2 rounded-full border border-[var(--surface-border)] text-[12px] font-black uppercase tracking-wider hover:bg-[var(--surface-raised)] transition-all">Deep Analysis</button>
          </div>
          
          <div className="space-y-6">
            {['Chemistry', 'Haematology', 'Microbiology', 'Blood Bank', 'Histopathology'].map((dept) => {
              const deptOrders = LAB_ORDERS.filter(o => o.department.includes(dept));
              const deptPending = deptOrders.filter(o => ['ordered', 'collected', 'processing'].includes(o.status)).length;
              const loadPercentage = Math.round((deptOrders.length / Math.max(1, totalOrders)) * 100);
              
              return (
                <div key={dept} className="group transition-all">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-3">
                        <div className={`size-3 rounded-full ${deptPending > 3 ? 'bg-[#9a6115]' : 'bg-[#1c7b56]'}`}></div>
                        <p className="text-[15px] font-black text-[var(--text-primary)] tracking-tight">{dept}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase">{deptPending} pending</p>
                        <p className="text-[14px] font-black text-[var(--text-primary)]">{loadPercentage}% load</p>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--surface-border)] border-opacity-50">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${deptPending > 5 ? 'bg-[#b14343]' : deptPending > 2 ? 'bg-[#9a6115]' : 'bg-[var(--kl-primary)]'}`} 
                        style={{ width: `${loadPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="kl-premium-card p-8 sm:p-10 shadow-xl border-[var(--surface-border)] rounded-[40px]">
          <div className="mb-8 flex items-center justify-between border-b border-[var(--surface-border)] pb-6">
            <h2 className="text-[18px] font-black text-[var(--text-primary)] tracking-tight uppercase">Clinical Alerts</h2>
            <button onClick={() => navigate('/hod/alerts')} className="text-[12px] font-black text-[var(--kl-primary)] uppercase tracking-widest hover:underline">Clear All</button>
          </div>
          <div className="space-y-4">
            {ALERTS.filter((alert) => alert.targetRoles.includes('hod')).slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 rounded-[28px] bg-[var(--surface-raised)] p-5 border border-[var(--surface-border)] transition-all hover:bg-white dark:hover:bg-black dark:hover:bg-opacity-10 group">
                <div className={`mt-1 grid size-10 shrink-0 place-items-center rounded-[14px] border border-opacity-20 shadow-xs ${alert.type === 'danger' ? 'bg-[#fde9e9] border-[#b14343] text-[#b14343]' : 'bg-[#fff0db] border-[#9a6115] text-[#9a6115]'}`}>
                    <Warning2 size={18} variant="Bold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-black text-[var(--text-primary)] leading-snug group-hover:text-[var(--kl-primary)] transition-colors">{alert.title}</p>
                  <p className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mt-1.5">{alert.category} • {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
