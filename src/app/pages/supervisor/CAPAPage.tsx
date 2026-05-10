import { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Clock, Plus } from 'lucide-react';
import { CAPA_ITEMS, getUserById } from '../../data/mockData';

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'text-[#b14343]', bg: 'bg-[#fde9e9]', dot: 'bg-[#b14343]' },
  high: { label: 'High', color: 'text-[#9a6115]', bg: 'bg-[#fff0db]', dot: 'bg-[#9a6115]' },
  medium: { label: 'Medium', color: 'text-[#1c5eff]', bg: 'bg-[#e3edff]', dot: 'bg-[#1c5eff]' },
  low: { label: 'Low', color: 'text-[#73839f]', bg: 'bg-[#f4f8ff]', dot: 'bg-[#73839f]' },
};

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'text-[#b14343]', bg: 'bg-[#fde9e9]', icon: <AlertTriangle size={12} /> },
  in_progress: { label: 'In Progress', color: 'text-[#9a6115]', bg: 'bg-[#fff0db]', icon: <Clock size={12} /> },
  completed: { label: 'Completed', color: 'text-[#1c7b56]', bg: 'bg-[#e8f8f1]', icon: <CheckCircle2 size={12} /> },
  overdue: { label: 'Overdue', color: 'text-[#b14343]', bg: 'bg-[#fde9e9]', icon: <AlertTriangle size={12} /> },
};

export default function CAPAPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  const filtered = CAPA_ITEMS.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter || (filter === 'open' && c.status === 'overdue');
  });

  const stats = {
    open: CAPA_ITEMS.filter(c => c.status === 'open').length,
    in_progress: CAPA_ITEMS.filter(c => c.status === 'in_progress').length,
    completed: CAPA_ITEMS.filter(c => c.status === 'completed').length,
    critical: CAPA_ITEMS.filter(c => c.priority === 'critical' && c.status !== 'completed').length,
  };

  return (
    <div className="p-6 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">CAPA Items</h1>
          <p className="text-[#73839f] text-[14px]">Corrective and Preventive Actions — quality management tracking</p>
        </div>
        <button className="bg-[#1c5eff] text-white text-[13px] font-medium px-4 py-2.5 rounded-[13px] hover:bg-[#1548e8] transition-colors flex items-center gap-2">
          <Plus size={14} /> New CAPA
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Open', count: stats.open, color: '#b14343', bg: '#fde9e9', f: 'open' as const },
          { label: 'In Progress', count: stats.in_progress, color: '#9a6115', bg: '#fff0db', f: 'in_progress' as const },
          { label: 'Completed', count: stats.completed, color: '#1c7b56', bg: '#e8f8f1', f: 'completed' as const },
          { label: 'Critical', count: stats.critical, color: '#b14343', bg: '#fde9e9', f: 'open' as const },
        ].map((s, i) => (
          <button
            key={i}
            onClick={() => setFilter(filter === s.f ? 'all' : s.f)}
            className={`rounded-[18px] p-4 text-left transition-all border-2`}
            style={{ backgroundColor: s.bg, borderColor: filter === s.f ? s.color : 'transparent' }}
          >
            <p className="font-bold text-[22px]" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[12px] font-medium" style={{ color: s.color }}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {[
          { key: 'all', label: 'All' },
          { key: 'open', label: 'Open' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
              filter === key ? 'bg-[#e3edff] text-[#1c5eff] border-[#1c5eff]' : 'bg-white text-[#475a7d] border-[#d3def5] hover:border-[#9bb3e5]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CAPA Items */}
      <div className="space-y-3">
        {filtered.map(capa => {
          const isExpanded = expandedId === capa.id;
          const priority = PRIORITY_CONFIG[capa.priority];
          const status = STATUS_CONFIG[capa.status];
          const assignee = getUserById(capa.assignedTo);
          const isOverdue = new Date(capa.dueDate) < new Date() && capa.status !== 'completed';

          return (
            <div
              key={capa.id}
              className={`bg-white rounded-[20px] border overflow-hidden transition-all ${
                capa.priority === 'critical' && capa.status !== 'completed' ? 'border-[#f5c0c0]' : 'border-[#d3def5]'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : capa.id)}
                className="w-full p-5 text-left hover:bg-[#f9fbff] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${priority.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-[#11203b] font-semibold text-[14px] leading-snug">{capa.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
                          {priority.label.toUpperCase()}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${status.bg} ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                        {isExpanded ? <ChevronUp size={15} className="text-[#73839f]" /> : <ChevronDown size={15} className="text-[#73839f]" />}
                      </div>
                    </div>
                    <p className="text-[#475a7d] text-[13px] leading-relaxed line-clamp-2">{capa.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-[#73839f]">
                      <span>{capa.code}</span>
                      <span>Source: {capa.source}</span>
                      <span>Assigned: {assignee?.name}</span>
                      <span className={isOverdue ? 'text-[#b14343] font-semibold' : ''}>
                        Due: {new Date(capa.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {isOverdue && ' ⚠️ OVERDUE'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[#f4f8ff] p-5 bg-[#f9fbff] space-y-4">
                  {/* Full Description */}
                  <div>
                    <h4 className="text-[#11203b] font-semibold text-[13px] mb-1.5">Full Description</h4>
                    <p className="text-[#475a7d] text-[13px] leading-relaxed">{capa.description}</p>
                  </div>

                  {/* Root Cause */}
                  {capa.rootCause && (
                    <div>
                      <h4 className="text-[#11203b] font-semibold text-[13px] mb-1.5">Root Cause Analysis</h4>
                      <p className="text-[#475a7d] text-[13px] leading-relaxed bg-[#fff8ed] border border-[#f5d99a] rounded-[10px] px-3 py-2">{capa.rootCause}</p>
                    </div>
                  )}

                  {/* Corrective Action */}
                  {capa.correctiveAction && (
                    <div>
                      <h4 className="text-[#11203b] font-semibold text-[13px] mb-1.5">Corrective Action</h4>
                      <p className="text-[#475a7d] text-[13px] leading-relaxed">{capa.correctiveAction}</p>
                    </div>
                  )}

                  {/* Preventive Action */}
                  {capa.preventiveAction && (
                    <div>
                      <h4 className="text-[#11203b] font-semibold text-[13px] mb-1.5">Preventive Action</h4>
                      <p className="text-[#475a7d] text-[13px] leading-relaxed">{capa.preventiveAction}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-[12px] border border-[#d3def5] px-3 py-2">
                      <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">Opened</p>
                      <p className="text-[#11203b] text-[13px] font-medium">{new Date(capa.openedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="bg-white rounded-[12px] border border-[#d3def5] px-3 py-2">
                      <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">Due Date</p>
                      <p className={`text-[13px] font-medium ${isOverdue ? 'text-[#b14343]' : 'text-[#11203b]'}`}>
                        {new Date(capa.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    {capa.closedDate && (
                      <div className="bg-white rounded-[12px] border border-[#d3def5] px-3 py-2">
                        <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">Closed</p>
                        <p className="text-[#1c7b56] text-[13px] font-medium">{new Date(capa.closedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {capa.status !== 'completed' && (
                    <div className="flex gap-3">
                      <button className="bg-[#1c5eff] text-white text-[13px] font-medium px-4 py-2.5 rounded-[12px] hover:bg-[#1548e8] transition-colors">
                        Update CAPA
                      </button>
                      <button className="bg-[#e8f8f1] text-[#1c7b56] text-[13px] font-medium px-4 py-2.5 rounded-[12px] hover:bg-[#d0f0e2] transition-colors flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
