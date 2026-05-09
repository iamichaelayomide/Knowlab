import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  SearchNormal1 as Search,
  BookSaved as BookOpen,
  TickSquare as CheckSquare,
  Hierarchy as GitBranch,
  DocumentText as FileText,
  Warning2 as AlertCircle,
  ArrowDown2 as ChevronDown,
  ArrowUp2 as ChevronUp,
} from 'iconsax-react';
import { JOB_AIDS, JobAid } from '../../data/mockData';
import { useDepartment } from '../../context/DepartmentContext';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  checklist: <CheckSquare size={18} className="text-[#1c7b56] dark:text-[#88e0ba]" />,
  decision_tree: <GitBranch size={18} className="text-[#9a6115] dark:text-[#f3c26f]" />,
  quick_reference: <FileText size={18} className="text-[var(--text-primary)]" />,
  protocol: <AlertCircle size={18} className="text-[#b14343] dark:text-[#fca5a5]" />,
};

const TYPE_COLORS: Record<string, string> = {
  checklist: 'bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)] text-[#1c7b56] dark:text-[#88e0ba]',
  decision_tree: 'bg-[#fff0db] dark:bg-[rgba(154,97,21,0.18)] text-[#9a6115] dark:text-[#f3c26f]',
  quick_reference: 'bg-[var(--kl-surface-tinted)] text-[var(--text-primary)]',
  protocol: 'bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)] text-[#b14343] dark:text-[#fca5a5]',
};

const TYPE_BG: Record<string, string> = {
  checklist: 'bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)]',
  decision_tree: 'bg-[#fff0db] dark:bg-[rgba(154,97,21,0.18)]',
  quick_reference: 'bg-[var(--kl-surface-tinted)]',
  protocol: 'bg-[#fde9e9] dark:bg-[rgba(177,67,67,0.18)]',
};

const TYPE_LABELS: Record<string, string> = {
  checklist: 'Checklist',
  decision_tree: 'Decision Tree',
  quick_reference: 'Quick Reference',
  protocol: 'Protocol',
};

const CATEGORIES = ['All', 'Equipment', 'Pre-Analytics', 'Quality Control', 'Blood Bank', 'Reporting', 'Reagent Management'];

function JobAidCard({ aid }: { aid: JobAid }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[var(--kl-surface)] rounded-[20px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] overflow-hidden flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className={`rounded-[12px] p-2.5 flex-shrink-0 ${TYPE_BG[aid.type]}`}>
            {TYPE_ICONS[aid.type]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[var(--kl-text)] font-semibold text-[14px] leading-snug mb-1">{aid.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[aid.type]}`}>
                {TYPE_LABELS[aid.type]}
              </span>
              <span className="bg-[var(--kl-surface-tinted)] text-[var(--kl-text-muted)] text-[11px] px-2 py-0.5 rounded-full">{aid.category}</span>
            </div>
          </div>
        </div>
        <p className="text-[var(--kl-text-muted)] text-[13px] leading-relaxed mb-4 flex-1">{aid.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[var(--kl-text-muted)] text-[11px]">Updated {new Date(aid.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          {aid.steps && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1.5 text-[var(--text-primary)] text-[12px] font-medium hover:gap-2 transition-all"
            >
              {expanded ? 'Hide steps' : `Show ${aid.steps.length} steps`}
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Steps */}
      {expanded && aid.steps && (
        <div className="border-t border-[var(--surface-border)] bg-[var(--kl-surface-soft)]">
          <div className="p-5 space-y-3">
            {aid.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--kl-surface-tinted)] flex items-center justify-center">
                  <span className="text-[var(--text-primary)] text-[11px] font-bold">{i + 1}</span>
                </div>
                <p className="text-[var(--kl-text-muted)] text-[13px] leading-relaxed flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobAidsPage() {
  const location = useLocation();
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearch(q);
  }, [location.search]);

  const departmentAids = JOB_AIDS.filter(aid => {
    // Check if category matches any bench in this department
    const isBenchCategory = activeDepartment.benches.some(b => b.name === aid.category);
    if (isBenchCategory) return true;
    
    // Check if tags explicitly name the department
    const text = (aid.tags.join(' ') + ' ' + aid.category).toLowerCase();
    const deptName = activeDepartment.name.toLowerCase();
    const deptShort = activeDepartment.shortName.toLowerCase();
    if (text.includes(deptName) || text.includes(deptShort)) return true;

    // Fallback mappings for original JOB_AIDS that lack explicit department names
    const allText = (aid.title + ' ' + aid.description + ' ' + aid.tags.join(' ')).toLowerCase();
    if (activeDepartment.id === 'haematology' && (allText.includes('sysmex') || allText.includes('fbc') || allText.includes('haematology'))) return true;
    if (activeDepartment.id === 'chemistry' && (allText.includes('chemistry') || allText.includes('lft') || allText.includes('ise'))) return true;
    if (activeDepartment.id === 'microbiology' && (allText.includes('microbiology') || allText.includes('bacteria') || allText.includes('malaria') || allText.includes('gram'))) return true;
    if (activeDepartment.id === 'histopathology' && (allText.includes('histopathology') || allText.includes('cytology') || allText.includes('grossing'))) return true;
    if (activeDepartment.id === 'bgs' && (allText.includes('blood bank') || allText.includes('bgs') || allText.includes('transfusion') || allText.includes('crossmatch') || allText.includes('abo'))) return true;

    return false;
  });

  const categories = ['All', ...Array.from(new Set(departmentAids.map(a => a.category)))];

  const filtered = departmentAids.filter(aid => {
    const matchSearch =
      aid.title.toLowerCase().includes(search.toLowerCase()) ||
      aid.description.toLowerCase().includes(search.toLowerCase()) ||
      aid.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'All' || aid.category === activeCategory;
    const matchType = activeType === 'All' || aid.type === activeType;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="kl-page">
      <div className="mb-6">
        <h1 className="text-[var(--kl-text)] font-semibold text-[24px] mb-1">Quick Job Aids</h1>
        <p className="text-[var(--kl-text-muted)] text-[14px]">Checklists, decision trees, and quick reference guides for bench use</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--kl-text-muted)]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search job aids…"
          className="w-full bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[14px] pl-10 pr-4 py-3 text-[14px] text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[var(--surface-border-strong)] transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
                activeCategory === cat
                  ? 'bg-[var(--kl-surface-tinted)] text-[var(--text-primary)] border-[var(--surface-border-strong)]'
                  : 'bg-[var(--kl-surface)] text-[var(--kl-text-muted)] border-[var(--kl-border)] hover:border-[var(--kl-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'checklist', 'quick_reference', 'decision_tree', 'protocol'].map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
                activeType === type
                  ? 'bg-[var(--kl-surface-tinted)] text-[var(--text-primary)] border-[var(--surface-border-strong)]'
                  : 'bg-[var(--kl-surface)] text-[var(--kl-text-muted)] border-[var(--kl-border)] hover:border-[var(--kl-primary)]'
              }`}
            >
              {type === 'All' ? 'All Types' : TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Job Aids Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 bg-[var(--kl-surface)] rounded-[20px] border border-[var(--kl-border)] p-8 text-center">
            <BookOpen size={32} className="text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--kl-text-muted)] font-medium">No job aids found</p>
          </div>
        )}
        {filtered.map(aid => (
          <JobAidCard key={aid.id} aid={aid} />
        ))}
      </div>
    </div>
  );
}
