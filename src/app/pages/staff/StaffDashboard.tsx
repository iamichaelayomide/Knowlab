import { useNavigate } from 'react-router';
import { FileText, FlaskConical, BookOpen, GraduationCap, Bell, ArrowRight, CheckCircle2, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { SOPS, LAB_TESTS, JOB_AIDS, TRAINING_MODULES, TRAINING_RECORDS, ALERTS } from '../../data/mockData';

function MetricTile({ label, value, sublabel, accent }: { label: string; value: string | number; sublabel: string; accent: string }) {
  return (
    <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-5">
      <div className="h-1 rounded-full mb-4" style={{ backgroundColor: accent }} />
      <p className="text-[#475a7d] text-[14px] mb-1">{label}</p>
      <p className="text-[#11203b] font-bold text-[30px] leading-none mb-1">{value}</p>
      <p className="text-[#73839f] text-[12px]">{sublabel}</p>
    </div>
  );
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const navigate = useNavigate();

  if (!user) return null;

  const myTraining = TRAINING_RECORDS.filter(r => r.staffId === user.id);
  const overdueTraining = myTraining.filter(r => r.status === 'overdue').length;
  const completedTraining = myTraining.filter(r => r.status === 'completed').length;
  const inProgressTraining = myTraining.filter(r => r.status === 'in_progress').length;

  const myAlerts = ALERTS.filter(a => !a.read && a.targetRoles.includes(user.role));
  
  // Filter by department (case-insensitive fuzzy match)
  const activeSops = SOPS.filter(s => 
    s.status === 'active' && 
    (s.department.toLowerCase().includes(activeDepartment.id.substring(0, 4)) || 
     s.department.toLowerCase() === activeDepartment.name.toLowerCase())
  );
  
  const activeTests = LAB_TESTS.filter(t => {
    if (t.status !== 'active') return false;
    return t.category === activeBench.name;
  });

  return (
    <div className="p-6 max-w-[1200px]">
      {/* Hero Banner */}
      <div
        className="rounded-[24px] overflow-hidden mb-6 relative"
        style={{ background: 'linear-gradient(151deg, rgb(15,31,68) 11%, rgb(18,59,108) 53%, rgb(28,94,255) 89%)' }}
      >
        <div className="p-8 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.14)] rounded-full px-4 py-2 mb-4">
              <span className="text-[#dbe7ff] text-[11px] font-semibold tracking-[1.98px] uppercase">Bench workspace</span>
            </div>
            <h1 className="text-white font-bold text-[32px] leading-[1.15] mb-3">
              Start with the exact unit<br />knowledge you need.
            </h1>
            <p className="text-[#ebf3ff] text-[15px] leading-[1.7] max-w-[560px]">
              SOPs, tests, and quick job aids stay scoped to your current bench context so the dashboard feels like a shift workspace, not a document portal.
            </p>
            <button
              onClick={() => navigate('/staff/sops')}
              className="mt-5 bg-[#1c5eff] hover:bg-[#1548e8] text-white font-medium text-[14px] px-5 py-3 rounded-[14px] shadow-[0px_8px_20px_rgba(28,94,255,0.35)] transition-colors inline-flex items-center gap-2"
            >
              Open SOP library <ArrowRight size={15} />
            </button>
          </div>
          <div className="flex flex-col gap-3 lg:w-[300px]">
            {[
              { label: 'ASSIGNED BENCHES', value: '3 active bench views ready now.' },
              { label: 'PRIMARY SOP', value: 'Full Blood Count – Sysmex XN-350' },
              { label: 'PRIMARY TEST', value: 'Full Blood Count (FBC)' },
            ].map(item => (
              <div
                key={item.label}
                className="bg-[rgba(7,20,43,0.28)] border border-[rgba(255,255,255,0.14)] rounded-[20px] px-4 py-3"
              >
                <p className="text-[#dbe7ff] font-semibold text-[11px] tracking-[1.98px] uppercase mb-0.5">{item.label}</p>
                <p className="text-white text-[14px]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricTile label="Active SOPs" value={activeSops.length} sublabel="In your department" accent="#1c5eff" />
        <MetricTile label="Lab Tests" value={activeTests.length} sublabel="With full reference ranges" accent="#0f86ff" />
        <MetricTile label="Training Completed" value={completedTraining} sublabel={`${inProgressTraining} in progress`} accent="#1c7b56" />
        {overdueTraining > 0
          ? <MetricTile label="Overdue Training" value={overdueTraining} sublabel="Action required" accent="#b14343" />
          : <MetricTile label="Unread Alerts" value={myAlerts.length} sublabel="Need your attention" accent="#9a6115" />
        }
      </div>

      {/* Two-column */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Quick access SOPs */}
        <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#1c5eff]" />
              <h2 className="text-[#11203b] font-semibold text-[16px]">Quick SOPs</h2>
            </div>
            <button onClick={() => navigate('/staff/sops')} className="text-[#1c5eff] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {activeSops.slice(0, 4).map(sop => (
              <button
                key={sop.id}
                onClick={() => navigate(`/staff/sops/${sop.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-[16px] hover:bg-[#f4f8ff] transition-colors text-left group"
              >
                <div className="bg-[#e3edff] rounded-[10px] p-2 flex-shrink-0">
                  <FileText size={14} className="text-[#1c5eff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#11203b] font-medium text-[13px] truncate">{sop.title}</p>
                  <p className="text-[#73839f] text-[11px]">{sop.code} · Rev.{sop.revision}</p>
                </div>
                <div className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                  sop.status === 'active' ? 'bg-[#e8f8f1] text-[#1c7b56]' : 'bg-[#fff0db] text-[#9a6115]'
                }`}>
                  {sop.status === 'active' ? 'Active' : 'Under Review'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick access Tests */}
        <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical size={18} className="text-[#1c5eff]" />
              <h2 className="text-[#11203b] font-semibold text-[16px]">Common Tests</h2>
            </div>
            <button onClick={() => navigate('/staff/tests')} className="text-[#1c5eff] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {activeTests.length > 0 ? activeTests.slice(0, 4).map(test => (
              <button
                key={test.id}
                onClick={() => navigate(`/staff/tests/${test.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-[16px] hover:bg-[#f4f8ff] transition-colors text-left"
              >
                <div className="bg-[#f4f8ff] rounded-[10px] p-2 flex-shrink-0">
                  <FlaskConical size={14} className="text-[#475a7d]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#11203b] font-medium text-[13px] truncate">{test.name}</p>
                  <p className="text-[#73839f] text-[11px]">{test.code} · {test.turnaround}</p>
                </div>
                <div className={`w-3 h-3 rounded-full flex-shrink-0`} style={{ backgroundColor: test.containerColor === 'Purple/Lavender' ? '#9333ea' : test.containerColor === 'Light Blue' ? '#3b82f6' : test.containerColor === 'Black' ? '#374151' : '#ef4444' }} title={test.container} />
              </button>
            )) : (
              <div className="py-6 text-center text-[#73839f] text-[13px]">
                No tests assigned to this bench yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Training status + Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Training */}
        <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-[#1c5eff]" />
              <h2 className="text-[#11203b] font-semibold text-[16px]">My Training</h2>
            </div>
            <button onClick={() => navigate('/staff/training')} className="text-[#1c5eff] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {TRAINING_MODULES.slice(0, 4).map(mod => {
              const record = myTraining.find(r => r.moduleId === mod.id);
              const status = record?.status || 'not_started';
              return (
                <div key={mod.id} className="flex items-center gap-3 p-3 rounded-[14px] hover:bg-[#f4f8ff] transition-colors">
                  <div className={`rounded-full p-1.5 flex-shrink-0 ${
                    status === 'completed' ? 'bg-[#e8f8f1] text-[#1c7b56]' :
                    status === 'overdue' ? 'bg-[#fde9e9] text-[#b14343]' :
                    status === 'in_progress' ? 'bg-[#fff0db] text-[#9a6115]' :
                    'bg-[#f4f8ff] text-[#73839f]'
                  }`}>
                    {status === 'completed' ? <CheckCircle2 size={14} /> :
                     status === 'overdue' ? <AlertTriangle size={14} /> :
                     <Clock size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#11203b] text-[13px] font-medium truncate">{mod.title}</p>
                    <p className="text-[#73839f] text-[11px]">{mod.duration} · {mod.mandatory ? 'Mandatory' : 'Optional'}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    status === 'completed' ? 'bg-[#e8f8f1] text-[#1c7b56]' :
                    status === 'overdue' ? 'bg-[#fde9e9] text-[#b14343]' :
                    status === 'in_progress' ? 'bg-[#fff0db] text-[#9a6115]' :
                    'bg-[#f4f8ff] text-[#73839f]'
                  }`}>
                    {status === 'completed' ? `${record?.score}%` :
                     status === 'overdue' ? 'Overdue' :
                     status === 'in_progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#1c5eff]" />
              <h2 className="text-[#11203b] font-semibold text-[16px]">Recent Alerts</h2>
            </div>
            <button onClick={() => navigate('/staff/alerts')} className="text-[#1c5eff] text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {ALERTS.filter(a => a.targetRoles.includes(user.role)).slice(0, 4).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-[14px] hover:bg-[#f4f8ff] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  alert.type === 'danger' ? 'bg-[#b14343]' :
                  alert.type === 'warning' ? 'bg-[#9a6115]' :
                  alert.type === 'success' ? 'bg-[#1c7b56]' : 'bg-[#1c5eff]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium truncate ${alert.read ? 'text-[#475a7d]' : 'text-[#11203b]'}`}>{alert.title}</p>
                  <p className="text-[#73839f] text-[11px]">{new Date(alert.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {alert.category}</p>
                </div>
                {!alert.read && <div className="w-2 h-2 bg-[#1c5eff] rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
