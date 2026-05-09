import { useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { ArrowRight2, Chart2, ClipboardTick, People, Profile2User, Warning2, Timer1, StatusUp, Flash, Activity } from 'iconsax-react';
import { ALERTS, QC_LOGS, getStaffUsers } from '../../data/mockData';
import { LAB_ORDERS, PATIENTS } from '../../data/patients';
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

export default function HODDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const staff = getStaffUsers();
  const qcPassed = QC_LOGS.filter((entry) => entry.overallStatus === 'passed').length;
  const qcRate = Math.round((qcPassed / Math.max(1, QC_LOGS.length)) * 100);
  
  const totalOrders = LAB_ORDERS.length;
  const pendingOrders = LAB_ORDERS.filter(o => ['ordered', 'collected', 'processing'].includes(o.status)).length;
  const tatCompliance = 94.2;
  
  const alerts = ALERTS.filter((alert) => !alert.read && alert.targetRoles.includes('hod'));

  return (
    <div className="kl-page">
      {/* Hero Banner (Staff/Supervisor Style) */}
      <div
        className="rounded-[24px] overflow-hidden mb-6 relative border border-[var(--surface-border)]"
        style={{ background: 'linear-gradient(151deg, #0f0f10 11%, #1c1c1e 56%, #2a2a2c 100%)' }}
      >
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.14)] rounded-full px-4 py-2 mb-6">
              <span className="text-white/70 text-[11px] font-semibold tracking-[1.98px] uppercase">Command Centre</span>
            </div>
            <h1 className="text-white font-bold text-[32px] sm:text-[42px] leading-[1.1] mb-4">
              Department Health
            </h1>
            <p className="text-white/72 text-[16px] leading-[1.7] max-w-[580px] mb-8">
              Facility-wide laboratory oversight. Currently monitoring <span className="text-white font-black">{totalOrders} active tests</span> across {staff.length} staff members and all hospital benches.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/hod/patients')}
                className="btn-primary text-white font-bold text-[14px] px-8 py-3.5 rounded-full shadow-lg transition-all hover:translate-y-[-1px] inline-flex items-center gap-2"
              >
                Manage Patient Load <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/hod/reports')}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-[14px] px-6 py-3.5 rounded-full transition-all"
              >
                Operational Reports
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:w-[320px]">
            {[
              { label: 'TAT COMPLIANCE', value: `${tatCompliance}%`, sub: 'Average 1.4hrs target' },
              { label: 'REGISTRY QUEUE', value: `${pendingOrders} orders`, sub: 'Awaiting result entry' },
              { label: 'CRITICAL ALERTS', value: `${alerts.length} immediate`, sub: 'Validation required' },
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
        <MetricTile label="Validation Rate" value={`${qcRate}%`} sublabel="LIMS verification speed" accent="#171717" />
        <MetricTile label="Total Load" value={PATIENTS.length} sublabel="Scoped active cases" accent="#1c7b56" />
        <MetricTile label="TAT Index" value="Optimal" sublabel="Within targets" accent="#9a6115" />
        <MetricTile label="Registry" value="Active" sublabel="Real-time data flow" accent="#b14343" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="kl-premium-card p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-[17px] font-bold text-[var(--text-primary)] uppercase tracking-tight">Operational Readiness</h2>
                <p className="text-[13px] text-[var(--text-secondary)] mt-1">LIMS throughput by department.</p>
            </div>
            <button onClick={() => navigate('/hod/reports')} className="text-[var(--text-primary)] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Deep Analysis <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="space-y-6">
            {['Chemistry', 'Haematology', 'Microbiology', 'Blood Bank', 'Histopathology'].map((dept) => {
              const deptOrders = LAB_ORDERS.filter(o => o.department.includes(dept));
              const deptPending = deptOrders.filter(o => ['ordered', 'collected', 'processing'].includes(o.status)).length;
              const loadPercentage = Math.round((deptOrders.length / Math.max(1, totalOrders)) * 100);
              
              return (
                <div key={dept}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${deptPending > 3 ? 'bg-[#9a6115]' : 'bg-[#1c7b56]'}`}></div>
                        <p className="text-[14px] font-bold text-[var(--text-primary)]">{dept}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase">{deptPending} pending</p>
                        <p className="text-[13px] font-black text-[var(--text-primary)]">{loadPercentage}%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--surface-border)]">
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

        <div className="kl-premium-card p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[var(--text-primary)] uppercase tracking-tight">Clinical Alerts</h2>
            <button onClick={() => navigate('/hod/alerts')} className="text-[12px] font-bold text-[var(--kl-primary)] uppercase hover:underline">Clear All</button>
          </div>
          <div className="space-y-4">
            {ALERTS.filter((alert) => alert.targetRoles.includes('hod')).slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-4 rounded-[20px] bg-[var(--surface-raised)] border border-[var(--surface-border)] hover:bg-[var(--surface-card)] transition-colors group">
                <div className={`mt-1 grid size-9 shrink-0 place-items-center rounded-xl border border-opacity-20 ${alert.type === 'danger' ? 'bg-[#fde9e9] border-[#b14343] text-[#b14343]' : 'bg-[#fff0db] border-[#9a6115] text-[#9a6115]'}`}>
                    <Warning2 size={16} variant="Bold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--kl-primary)] transition-colors">{alert.title}</p>
                  <p className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mt-1">{alert.category} • {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
