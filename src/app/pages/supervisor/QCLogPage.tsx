import { useMemo, useState } from 'react';
import { Add, ClipboardTick, DocumentUpload, Eye, TickCircle, Warning2 } from 'iconsax-react';
import { QC_LOGS, getUserById } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { openFloatingAI } from '../../services/aiWidget';

type Filter = 'all' | 'passed' | 'warning' | 'failed' | 'pending_review';

export default function QCLogPage() {
  const { user } = useAuth();
  const { activeBench } = useDepartment();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set(QC_LOGS.filter((q) => q.supervisorReviewed).map((q) => q.id)));
  const [filter, setFilter] = useState<Filter>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [draftOpen, setDraftOpen] = useState(user?.role === 'staff');
  const [drafts, setDrafts] = useState<Array<{ id: string; analyzer: string; level: string; status: string; date: string }>>([]);

  const filtered = useMemo(() => {
    return QC_LOGS.filter((q) => {
      if (filter === 'pending_review' && reviewedIds.has(q.id)) return false;
      if (filter !== 'all' && filter !== 'pending_review' && q.overallStatus !== filter) return false;
      if (dateFilter && q.date !== dateFilter) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [dateFilter, filter, reviewedIds]);

  const stats = {
    total: QC_LOGS.length + drafts.length,
    passed: QC_LOGS.filter((q) => q.overallStatus === 'passed').length,
    attention: QC_LOGS.filter((q) => q.overallStatus !== 'passed').length,
    pending: QC_LOGS.filter((q) => !reviewedIds.has(q.id)).length,
  };

  const addDraft = () => {
    setDrafts((prev) => [
      {
        id: `qc-draft-${Date.now()}`,
        analyzer: 'Sysmex XN-350',
        level: 'Level 2 (Normal)',
        status: 'offline draft',
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const markReviewed = (id: string) => setReviewedIds((prev) => new Set([...prev, id]));
  const canCreate = user?.role === 'staff';
  const canReview = user?.role === 'supervisor' || user?.role === 'hod';

  return (
    <div className="kl-page">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">QC Log</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">
            {canCreate ? `Log and save QC entries for ${activeBench.shortName}.` : 'Review QC records, filter by date, and interpret quality risks.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="kl-button-soft inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px]" onClick={() => openFloatingAI('Which QC issue should be prioritized from the visible QC log?')}>
            <ClipboardTick size={15} />
            Ask AI
          </button>
          {canCreate && (
            <button className="btn-primary inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px]" onClick={() => setDraftOpen((value) => !value)}>
              <Add size={15} />
              Log QC
            </button>
          )}
        </div>
      </div>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['all', 'Total Entries', stats.total, 'All visible QC work'],
          ['passed', 'Passed', stats.passed, 'Accepted runs'],
          ['warning', 'Attention', stats.attention, 'Warnings or failed runs'],
          ['pending_review', 'Pending Review', stats.pending, 'Needs supervisor sign-off'],
        ].map(([key, label, value, sub]) => (
          <button key={key} onClick={() => setFilter(filter === key ? 'all' : (key as Filter))} className="kl-gradient-card kl-card-interactive rounded-[28px] border border-[var(--surface-border)] p-5 text-left">
            <p className="mb-3 text-[12px] text-[var(--text-secondary)]">{label}</p>
            <p className="text-[30px] font-semibold leading-none text-[var(--text-primary)]">{value}</p>
            <p className="mt-2 text-[12px] text-[var(--text-secondary)]">{sub}</p>
          </button>
        ))}
      </section>

      <section className="mb-5 kl-premium-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="kl-filter-tray">
            {(['all', 'passed', 'warning', 'failed', 'pending_review'] as Filter[]).map((item) => (
              <button key={item} data-active={filter === item} className="kl-filter-control text-[12px] font-medium capitalize" onClick={() => setFilter(item)}>
                {item.replace('_', ' ')}
              </button>
            ))}
          </div>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input h-10 rounded-[18px] sm:w-[180px]" />
        </div>
      </section>

      {canCreate && draftOpen && (
        <section className="mb-5 kl-premium-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">New QC Entry</h2>
              <p className="text-[12px] text-[var(--text-secondary)]">Hybrid V1 saves this as an offline draft until cloud persistence is connected.</p>
            </div>
            <button className="kl-button-soft inline-flex h-9 items-center gap-2 rounded-full px-3 text-[12px]">
              <DocumentUpload size={14} />
              Attach printout
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <input className="input h-11 rounded-[18px]" defaultValue="Sysmex XN-350" />
            <select className="input h-11 rounded-[18px]" defaultValue="Level 2 (Normal)">
              <option>Level 1 (Low)</option>
              <option>Level 2 (Normal)</option>
              <option>Level 3 (High)</option>
            </select>
            <input className="input h-11 rounded-[18px]" placeholder="Lot / expiry" />
            <button onClick={addDraft} className="btn-primary h-11 rounded-full">Save draft</button>
          </div>
        </section>
      )}

      {!!drafts.length && (
        <section className="mb-5 kl-premium-card p-4">
          <h2 className="mb-3 text-[15px] font-semibold text-[var(--text-primary)]">Offline QC Drafts</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {drafts.map((draft) => (
              <div key={draft.id} className="rounded-[20px] border border-[var(--surface-border)] bg-[var(--surface-raised)] p-3">
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">{draft.level}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{draft.analyzer} | {draft.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="kl-table-shell">
        <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 border-b border-[var(--surface-border)] bg-[var(--surface-raised)] px-5 py-3 sm:grid">
          {['Date', 'Level', 'Shift | Analyst', 'Overall Status', 'Action'].map((heading) => (
            <span key={heading} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">{heading}</span>
          ))}
        </div>

        {filtered.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const isReviewed = reviewedIds.has(entry.id);
          const analyst = getUserById(entry.staffId);
          return (
            <div key={entry.id} className="border-b border-[var(--surface-border)] last:border-0">
              <button onClick={() => setExpandedId(isExpanded ? null : entry.id)} className="grid w-full grid-cols-1 gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-raised)] sm:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:items-center">
                <div>
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">{new Date(entry.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{entry.analyzer.split(' ').slice(0, 2).join(' ')}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">{entry.level}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{entry.results.length} parameters</p>
                </div>
                <div>
                  <p className="text-[13px] text-[var(--text-primary)]">{entry.shift} shift</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{analyst?.name}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${entry.overallStatus === 'passed' ? 'bg-[#e8f8f1] text-[#1c7b56] dark:bg-[rgba(28,123,86,0.18)] dark:text-[#88e0ba]' : entry.overallStatus === 'warning' ? 'bg-[#fff0db] text-[#9a6115] dark:bg-[rgba(154,97,21,0.18)] dark:text-[#f3c26f]' : 'bg-[#fde9e9] text-[#b14343] dark:bg-[rgba(177,67,67,0.18)] dark:text-[#fca5a5]'}`}>
                    {entry.overallStatus === 'passed' ? <TickCircle size={12} /> : <Warning2 size={12} />}
                    {entry.overallStatus}
                  </span>
                  {!isReviewed && <span className="rounded-full bg-[var(--kl-surface-tinted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-primary)]">New</span>}
                </div>
                <Eye size={16} className="text-[var(--text-tertiary)]" />
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--surface-border)] bg-[var(--surface-raised)] p-5">
                  <div className="mb-4 grid gap-3 sm:grid-cols-3">
                    {[
                      ['Westgard Trigger', entry.overallStatus === 'passed' ? 'No rejection rule triggered' : 'Warning or reject rule requires review'],
                      ['Action Scope', entry.overallStatus === 'passed' ? 'Routine release allowed if all checks pass' : 'Hold patient release until resolved by SOP'],
                      ['Documentation', 'QC register, analyzer status, and supervisor note required'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[18px] border border-[var(--surface-border)] bg-[var(--surface-card)] p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">{label}</p>
                        <p className="mt-1 text-[12px] font-medium text-[var(--text-primary)]">{value}</p>
                      </div>
                    ))}
                  </div>
                  {canReview && !isReviewed && (
                    <button onClick={() => markReviewed(entry.id)} className="btn-primary inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px]">
                      <Eye size={14} />
                      Mark supervisor reviewed
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
