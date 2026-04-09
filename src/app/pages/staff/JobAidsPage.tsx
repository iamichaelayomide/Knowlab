import { useState } from 'react';
import { Search, BookOpen, CheckSquare, GitBranch, FileText, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { JOB_AIDS, JobAid } from '../../data/mockData';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  checklist: <CheckSquare size={18} className="text-[#1c7b56]" />,
  decision_tree: <GitBranch size={18} className="text-[#9a6115]" />,
  quick_reference: <FileText size={18} className="text-[#1c5eff]" />,
  protocol: <AlertCircle size={18} className="text-[#b14343]" />,
};

const TYPE_COLORS: Record<string, string> = {
  checklist: 'bg-[#e8f8f1] text-[#1c7b56]',
  decision_tree: 'bg-[#fff0db] text-[#9a6115]',
  quick_reference: 'bg-[#e3edff] text-[#1c5eff]',
  protocol: 'bg-[#fde9e9] text-[#b14343]',
};

const TYPE_BG: Record<string, string> = {
  checklist: 'bg-[#e8f8f1]',
  decision_tree: 'bg-[#fff0db]',
  quick_reference: 'bg-[#e3edff]',
  protocol: 'bg-[#fde9e9]',
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
    <div className="bg-white rounded-[20px] border border-[#d3def5] shadow-[0px_4px_12px_0px_rgba(15,40,90,0.04)] overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`rounded-[12px] p-2.5 flex-shrink-0 ${TYPE_BG[aid.type]}`}>
            {TYPE_ICONS[aid.type]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[#11203b] font-semibold text-[14px] leading-snug mb-1">{aid.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[aid.type]}`}>
                {TYPE_LABELS[aid.type]}
              </span>
              <span className="bg-[#f4f8ff] text-[#475a7d] text-[11px] px-2 py-0.5 rounded-full">{aid.category}</span>
            </div>
          </div>
        </div>
        <p className="text-[#475a7d] text-[13px] leading-relaxed mb-3">{aid.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#73839f] text-[11px]">Updated {new Date(aid.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          {aid.steps && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1.5 text-[#1c5eff] text-[12px] font-medium hover:gap-2 transition-all"
            >
              {expanded ? 'Hide steps' : `Show ${aid.steps.length} steps`}
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Steps */}
      {expanded && aid.steps && (
        <div className="border-t border-[#f4f8ff] bg-[#f9fbff]">
          <div className="p-5 space-y-3">
            {aid.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#e3edff] flex items-center justify-center">
                  <span className="text-[#1c5eff] text-[11px] font-bold">{i + 1}</span>
                </div>
                <p className="text-[#475a7d] text-[13px] leading-relaxed flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobAidsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All');

  const filtered = JOB_AIDS.filter(aid => {
    const matchSearch =
      aid.title.toLowerCase().includes(search.toLowerCase()) ||
      aid.description.toLowerCase().includes(search.toLowerCase()) ||
      aid.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'All' || aid.category === activeCategory;
    const matchType = activeType === 'All' || aid.type === activeType;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="p-6 max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Quick Job Aids</h1>
        <p className="text-[#73839f] text-[14px]">Checklists, decision trees, and quick reference guides for bench use</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73839f]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search job aids…"
          className="w-full bg-white border border-[#d3def5] rounded-[14px] pl-10 pr-4 py-3 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] transition-colors"
        />
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['All', 'checklist', 'quick_reference', 'decision_tree', 'protocol'].map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors border ${
              activeType === type
                ? 'bg-[#e3edff] text-[#1c5eff] border-[#1c5eff]'
                : 'bg-white text-[#475a7d] border-[#d3def5] hover:border-[#9bb3e5]'
            }`}
          >
            {type === 'All' ? 'All Types' : TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Job Aids Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-[20px] border border-[#d3def5] p-8 text-center">
            <BookOpen size={32} className="text-[#c4d2ef] mx-auto mb-3" />
            <p className="text-[#475a7d] font-medium">No job aids found</p>
          </div>
        )}
        {filtered.map(aid => (
          <JobAidCard key={aid.id} aid={aid} />
        ))}
      </div>
    </div>
  );
}
