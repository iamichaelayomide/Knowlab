import { useState } from 'react';
import { ClipboardList, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { QC_LOGS, getUserById } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function QCLogPage() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set(QC_LOGS.filter((q) => q.supervisorReviewed).map((q) => q.id)));
  const [filter, setFilter] = useState<'all' | 'passed' | 'warning' | 'failed' | 'pending_review'>('all');

  const filtered = QC_LOGS.filter((q) => {
    if (filter === 'pending_review') return !reviewedIds.has(q.id);
    if (filter !== 'all') return q.overallStatus === filter;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const stats = {
    total: QC_LOGS.length,
    passed: QC_LOGS.filter((q) => q.overallStatus === 'passed').length,
    warning: QC_LOGS.filter((q) => q.overallStatus === 'warning').length,
    pending: QC_LOGS.filter((q) => !reviewedIds.has(q.id)).length,
  };

  const markReviewed = (id: string) => setReviewedIds((prev) => new Set([...prev, id]));

  return (
    <div className="w-full max-w-[1000px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">QC Log</h1>
        <p className="text-[#73839f] text-[14px]">Sysmex XN-350 quality control records - Westgard multi-rule monitoring</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Entries', count: stats.total, color: '#1c5eff', bg: '#e3edff', f: 'all' as const },
          { label: 'Passed', count: stats.passed, color: '#1c7b56', bg: '#e8f8f1', f: 'passed' as const },
          { label: 'Warnings', count: stats.warning, color: '#9a6115', bg: '#fff0db', f: 'warning' as const },
          { label: 'Pending Review', count: stats.pending, color: '#b14343', bg: '#fde9e9', f: 'pending_review' as const },
        ].map((stat) => (
          <button
            key={stat.f}
            onClick={() => setFilter(filter === stat.f ? 'all' : stat.f)}
            className={`rounded-[18px] p-4 text-left transition-all border-2 ${filter === stat.f ? 'border-current' : 'border-transparent'}`}
            style={{ backgroundColor: stat.bg, borderColor: filter === stat.f ? stat.color : 'transparent' }}
          >
            <p className="font-bold text-[22px]" style={{ color: stat.color }}>{stat.count}</p>
            <p className="text-[12px] font-medium" style={{ color: stat.color }}>{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[24px] border border-[#d3def5] overflow-hidden shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)]">
        <div className="px-4 sm:px-5 py-3 border-b border-[#f4f8ff] bg-[#f9fbff] hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4">
          {['Date', 'Level', 'Shift | Analyst', 'Overall Status', 'Action'].map((heading) => (
            <span key={heading} className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px]">
              {heading}
            </span>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <ClipboardList size={32} className="text-[#c4d2ef] mx-auto mb-3" />
            <p className="text-[#475a7d] font-medium">No QC entries</p>
          </div>
        )}

        {filtered.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const isReviewed = reviewedIds.has(entry.id);
          const analyst = getUserById(entry.staffId);

          return (
            <div key={entry.id} className="border-b border-[#f4f8ff] last:border-0">
              <div className="px-4 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 sm:gap-4 items-start sm:items-center hover:bg-[#f9fbff] transition-colors">
                <div>
                  <p className="text-[#11203b] font-medium text-[13px]">
                    {new Date(entry.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-[#73839f] text-[11px]">{entry.analyzer.split(' ').slice(0, 2).join(' ')}</p>
                </div>

                <div>
                  <p className="text-[#11203b] text-[13px] font-medium">{entry.level}</p>
                  <p className="text-[#73839f] text-[11px]">{entry.results.length} parameters</p>
                </div>

                <div>
                  <p className="text-[#11203b] text-[13px]">{entry.shift} shift</p>
                  <p className="text-[#73839f] text-[11px]">{analyst?.name}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[12px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                      entry.overallStatus === 'passed'
                        ? 'bg-[#e8f8f1] text-[#1c7b56]'
                        : entry.overallStatus === 'warning'
                          ? 'bg-[#fff0db] text-[#9a6115]'
                          : 'bg-[#fde9e9] text-[#b14343]'
                    }`}
                  >
                    {entry.overallStatus === 'passed' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {entry.overallStatus.charAt(0).toUpperCase() + entry.overallStatus.slice(1)}
                  </span>
                  {!isReviewed && <span className="text-[10px] bg-[#e3edff] text-[#1c5eff] font-semibold px-2 py-0.5 rounded-full">NEW</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setExpandedId(isExpanded ? null : entry.id)} className="text-[#475a7d] hover:text-[#1c5eff] transition-colors">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#f4f8ff] bg-[#f9fbff] p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-white border border-[#d3def5] rounded-[10px] px-3 py-2">
                      <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px]">Westgard Trigger</p>
                      <p className="text-[#11203b] text-[12px] font-medium">
                        {entry.overallStatus === 'passed'
                          ? 'No rejection rule triggered'
                          : entry.overallStatus === 'warning'
                            ? 'Warning trend detected'
                            : 'Reject rule triggered'}
                      </p>
                    </div>
                    <div className="bg-white border border-[#d3def5] rounded-[10px] px-3 py-2">
                      <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px]">Action Scope</p>
                      <p className="text-[#11203b] text-[12px] font-medium">
                        {entry.overallStatus === 'passed' ? 'Routine release allowed' : 'Hold and rerun before release'}
                      </p>
                    </div>
                    <div className="bg-white border border-[#d3def5] rounded-[10px] px-3 py-2">
                      <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px]">Documentation</p>
                      <p className="text-[#11203b] text-[12px] font-medium">QC register and LIS trace required</p>
                    </div>
                  </div>

                  <h3 className="text-[#11203b] font-semibold text-[14px] mb-3">Parameter Results</h3>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[#eef4ff]">
                          {['Parameter', 'Measured', 'Target', 'SD Value', 'Deviation (SD)', 'Status'].map((heading) => (
                            <th key={heading} className="text-[#73839f] font-semibold text-[10px] uppercase tracking-[0.8px] pb-2 pr-4">
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {entry.results.map((result, index) => (
                          <tr key={index} className="border-b border-[#f4f8ff] last:border-0">
                            <td className="py-2.5 pr-4 text-[#11203b] font-medium text-[12px]">{result.parameter}</td>
                            <td className="py-2.5 pr-4 text-[#11203b] font-mono text-[12px]">{result.measuredValue}</td>
                            <td className="py-2.5 pr-4 text-[#475a7d] font-mono text-[12px]">{result.targetValue}</td>
                            <td className="py-2.5 pr-4 text-[#475a7d] font-mono text-[12px]">+/-{result.sdValue}</td>
                            <td
                              className={`py-2.5 pr-4 font-mono font-semibold text-[12px] ${
                                Math.abs(result.sdDeviation) > 2
                                  ? 'text-[#b14343]'
                                  : Math.abs(result.sdDeviation) > 1.5
                                    ? 'text-[#9a6115]'
                                    : 'text-[#1c7b56]'
                              }`}
                            >
                              {result.sdDeviation > 0 ? '+' : ''}
                              {result.sdDeviation.toFixed(2)}
                            </td>
                            <td className="py-2.5">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  result.status === 'pass'
                                    ? 'bg-[#e8f8f1] text-[#1c7b56]'
                                    : result.status === 'warning'
                                      ? 'bg-[#fff0db] text-[#9a6115]'
                                      : 'bg-[#fde9e9] text-[#b14343]'
                                }`}
                              >
                                {result.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {entry.comment && (
                    <div className="bg-[#fff0db] border border-[#f5d99a] rounded-[12px] p-3 mb-4">
                      <p className="text-[#9a6115] text-[11px] font-semibold uppercase tracking-[0.8px] mb-1">Analyst Comment</p>
                      <p className="text-[#7a4f10] text-[13px] leading-relaxed">{entry.comment}</p>
                    </div>
                  )}

                  {!isReviewed && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => markReviewed(entry.id)}
                        className="bg-[#1c5eff] text-white text-[13px] font-medium px-4 py-2.5 rounded-[12px] hover:bg-[#1548e8] transition-colors flex items-center gap-2"
                      >
                        <Eye size={14} /> Mark as Reviewed
                      </button>
                      {entry.overallStatus !== 'passed' && (
                        <button className="bg-[#fff0db] text-[#9a6115] text-[13px] font-medium px-4 py-2.5 rounded-[12px] hover:bg-[#f5d99a] transition-colors">
                          Raise CAPA
                        </button>
                      )}
                    </div>
                  )}

                  {isReviewed && (
                    <p className="text-[#1c7b56] text-[12px] flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> Reviewed by {user?.name}
                      {entry.reviewedAt && ` | ${new Date(entry.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                    </p>
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
