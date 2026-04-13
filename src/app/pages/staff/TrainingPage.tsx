import { useState } from 'react';
import { GraduationCap, CheckCircle2, Clock, AlertTriangle, Play, Award } from 'lucide-react';
import { TRAINING_MODULES, TRAINING_RECORDS, TrainingModule, StaffTrainingRecord } from '../../data/mockData';
import { TEXT_TOKENS, joinWithSeparator } from '../../utils/textTokens';
import { useAuth } from '../../context/AuthContext';

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'bg-[#e8f8f1] text-[#1c7b56]', icon: <CheckCircle2 size={14} /> },
  in_progress: { label: 'In Progress', color: 'bg-[#fff0db] text-[#9a6115]', icon: <Clock size={14} /> },
  not_started: { label: 'Not Started', color: 'bg-[#f4f8ff] text-[#73839f]', icon: <Play size={14} /> },
  overdue: { label: 'Overdue', color: 'bg-[#fde9e9] text-[#b14343]', icon: <AlertTriangle size={14} /> },
};

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-[#f4f8ff] rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          backgroundColor: pct === 100 ? '#1c7b56' : pct > 60 ? '#1c5eff' : '#9a6115',
        }}
      />
    </div>
  );
}

export default function TrainingPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'in_progress' | 'overdue' | 'not_started'>('all');
  const [activeModule, setActiveModule] = useState<string | null>(null);

  if (!user) return null;

  const myRecords = TRAINING_RECORDS.filter(r => r.staffId === user.id);

  const getRecord = (moduleId: string): StaffTrainingRecord | undefined =>
    myRecords.find(r => r.moduleId === moduleId);

  const getStatus = (moduleId: string) => getRecord(moduleId)?.status || 'not_started';

  const stats = {
    completed: myRecords.filter(r => r.status === 'completed').length,
    in_progress: myRecords.filter(r => r.status === 'in_progress').length,
    overdue: myRecords.filter(r => r.status === 'overdue').length,
    not_started: TRAINING_MODULES.filter(m => !myRecords.find(r => r.moduleId === m.id)).length,
  };

  const filtered = TRAINING_MODULES.filter(m => {
    if (activeFilter === 'all') return true;
    return getStatus(m.id) === activeFilter;
  });

  const selectedModule = activeModule ? TRAINING_MODULES.find(m => m.id === activeModule) : null;

  return (
    <div className="kl-page">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">My Training</h1>
        <p className="text-[#73839f] text-[14px]">Mandatory and optional development modules</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Completed', count: stats.completed, color: '#1c7b56', bg: '#e8f8f1', filter: 'completed' as const },
          { label: 'In Progress', count: stats.in_progress, color: '#9a6115', bg: '#fff0db', filter: 'in_progress' as const },
          { label: 'Overdue', count: stats.overdue, color: '#b14343', bg: '#fde9e9', filter: 'overdue' as const },
          { label: 'Not Started', count: stats.not_started, color: '#73839f', bg: '#f4f8ff', filter: 'not_started' as const },
        ].map(stat => (
          <button
            key={stat.filter}
            onClick={() => setActiveFilter(activeFilter === stat.filter ? 'all' : stat.filter)}
            className={`rounded-[18px] p-4 text-left transition-all border-2 ${
              activeFilter === stat.filter ? 'border-current' : 'border-transparent'
            }`}
            style={{ backgroundColor: stat.bg, borderColor: activeFilter === stat.filter ? stat.color : 'transparent' }}
          >
            <p className="font-bold text-[24px]" style={{ color: stat.color }}>{stat.count}</p>
            <p className="text-[13px] font-medium" style={{ color: stat.color }}>{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-[20px] border border-[#d3def5] p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#11203b] font-semibold text-[14px]">Overall Completion</span>
          <span className="text-[#1c5eff] font-bold text-[14px]">{stats.completed}/{TRAINING_MODULES.length} modules</span>
        </div>
        <ProgressBar value={stats.completed} max={TRAINING_MODULES.length} />
        <p className="text-[#73839f] text-[12px] mt-1.5">
          {joinWithSeparator([
            `${Math.round((stats.completed / TRAINING_MODULES.length) * 100)}% complete`,
            stats.overdue > 0 ? `${stats.overdue} overdue` : null,
          ])}
        </p>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        {filtered.map(mod => {
          const record = getRecord(mod.id);
          const status = record?.status || 'not_started';
          const config = STATUS_CONFIG[status];
          const isOpen = activeModule === mod.id;

          return (
            <div
              key={mod.id}
              className="bg-white rounded-[20px] border border-[#d3def5] overflow-hidden"
            >
              <button
                onClick={() => setActiveModule(isOpen ? null : mod.id)}
                className="w-full p-5 flex items-start gap-4 text-left hover:bg-[#f9fbff] transition-colors"
              >
                <div className={`rounded-full p-2 flex-shrink-0 ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[#11203b] font-semibold text-[14px] leading-snug">{mod.title}</h3>
                      <p className="text-[#73839f] text-[12px] mt-0.5">
                        {joinWithSeparator([mod.category, mod.duration])}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {mod.mandatory && (
                        <span className="bg-[#fde9e9] text-[#b14343] text-[10px] font-semibold px-2 py-0.5 rounded-full">MANDATORY</span>
                      )}
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${config.color}`}>
                        {config.icon}
                        {config.label}
                        {status === 'completed' && record?.score && `${TEXT_TOKENS.separator}${record.score}%`}
                      </span>
                    </div>
                  </div>
                  {status === 'completed' && record?.completedDate && (
                    <p className="text-[#1c7b56] text-[11px] mt-1">
                      {joinWithSeparator([
                        `Completed ${new Date(record.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
                        record.score ? `Score: ${record.score}/${mod.passingScore} pass mark` : null,
                      ])}
                    </p>
                  )}
                  {(status === 'overdue' || status === 'not_started') && record?.dueDate && (
                    <p className={`text-[11px] mt-1 ${status === 'overdue' ? 'text-[#b14343]' : 'text-[#9a6115]'}`}>
                      Due: {new Date(record.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </button>

              {/* Expanded Detail */}
              {isOpen && (
                <div className="border-t border-[#f4f8ff] p-5 bg-[#f9fbff]">
                  <p className="text-[#475a7d] text-[13px] leading-relaxed mb-4">{mod.description}</p>
                  <div className="mb-4">
                    <p className="text-[#11203b] font-semibold text-[13px] mb-2">Learning Objectives</p>
                    <ul className="space-y-1.5">
                      {mod.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[#475a7d]">
                          <CheckCircle2 size={13} className="text-[#1c5eff] mt-0.5 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f4f8ff] rounded-[10px] px-3 py-2">
                      <span className="text-[#73839f] text-[11px]">Passing score: </span>
                      <span className="text-[#11203b] font-semibold text-[13px]">{mod.passingScore}%</span>
                    </div>
                    <div className="bg-[#f4f8ff] rounded-[10px] px-3 py-2">
                      <span className="text-[#73839f] text-[11px]">Duration: </span>
                      <span className="text-[#11203b] font-semibold text-[13px]">{mod.duration}</span>
                    </div>
                    {status !== 'completed' && (
                      <button className="bg-[#1c5eff] text-white text-[13px] font-medium px-4 py-2 rounded-[12px] hover:bg-[#1548e8] transition-colors flex items-center gap-1.5">
                        <Play size={13} />
                        {status === 'in_progress' ? 'Continue Module' : 'Start Module'}
                      </button>
                    )}
                    {status === 'completed' && (
                      <button className="bg-[#e8f8f1] text-[#1c7b56] text-[13px] font-medium px-4 py-2 rounded-[12px] flex items-center gap-1.5">
                        <Award size={13} />
                        View Certificate
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

