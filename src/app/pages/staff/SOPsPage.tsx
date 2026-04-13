import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Search, FileText, ChevronRight, Plus } from 'lucide-react';
import { SOPS } from '../../data/mockData';
import { useDepartment } from '../../context/DepartmentContext';
import { getStageBadge, getWorkflowState } from '../../services/workflowStore';

export default function SOPsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeDepartment, activeBench } = useDepartment();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Reset category when department/bench changes
  useEffect(() => {
    setActiveCategory('All');
  }, [activeDepartment.id, activeBench.id]);

  // Derive the role base from current path so navigation stays within the right workspace
  const base = location.pathname.startsWith('/supervisor') ? '/supervisor'
    : location.pathname.startsWith('/hod') ? '/hod'
    : '/staff';

  const departmentSOPs = SOPS.filter(sop => {
    return sop.status === 'active' && sop.category === activeBench.name;
  });

  const workflowSops = getWorkflowState().sops.filter(s => s.currentStage === 'validated_published' || s.currentStage === 'in_review' || s.currentStage === 'changes_requested' || s.currentStage === 'awaiting_hod_validation');

  const CATEGORIES = ['All', ...Array.from(new Set(departmentSOPs.map(s => s.category)))];

  const filtered = departmentSOPs.filter(sop => {
    const matchesSearch =
      sop.title.toLowerCase().includes(search.toLowerCase()) ||
      sop.code.toLowerCase().includes(search.toLowerCase()) ||
      sop.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || sop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredWorkflow = workflowSops.filter(s => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="kl-page">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Standard Operating Procedures</h1>
        <p className="text-[#73839f] text-[14px]">{departmentSOPs.length} SOPs available in your department</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73839f]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search SOPs, codes, or keywords…"
            className="w-full bg-white border border-[#d3def5] rounded-[14px] pl-10 pr-4 py-3 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] transition-colors"
          />
        </div>
        {base === '/staff' && (
          <button
            onClick={() => navigate('/staff/sops/new')}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1c5eff] text-white rounded-[14px] px-4 py-3 text-[13px] font-medium"
          >
            <Plus size={14} /> Create SOP Draft
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-colors border ${
              activeCategory === cat
                ? 'bg-[#e3edff] text-[#1c5eff] border-[#1c5eff]'
                : 'bg-white text-[#475a7d] border-[#d3def5] hover:border-[#9bb3e5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SOP List */}
      <div className="space-y-3">
        {filteredWorkflow.map(sop => {
          const stage = getStageBadge(sop.currentStage);
          return (
            <div
              key={sop.id}
              className="w-full bg-white border border-[#d3def5] rounded-[20px] p-5 flex items-start gap-4 text-left"
            >
              <div className="bg-[#e3edff] rounded-[14px] p-3 flex-shrink-0">
                <FileText size={20} className="text-[#1c5eff]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-[#11203b] font-semibold text-[15px] leading-snug">{sop.title}</h3>
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                    stage.tone === 'success' ? 'bg-[#e8f8f1] text-[#1c7b56]' :
                    stage.tone === 'warning' ? 'bg-[#fff0db] text-[#9a6115]' :
                    stage.tone === 'danger' ? 'bg-[#fde9e9] text-[#b14343]' :
                    'bg-[#eef5ff] text-[#1c5eff]'
                  }`}>{stage.label}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#73839f] text-[12px]">{sop.code}</span>
                  <span className="text-[#c4d2ef]">·</span>
                  <span className="text-[#73839f] text-[12px]">v{sop.version}</span>
                  <span className="text-[#c4d2ef]">·</span>
                  <span className="text-[#73839f] text-[12px]">Owner: {sop.ownerName}</span>
                </div>
                <p className="text-[#475a7d] text-[13px] line-clamp-2 leading-relaxed">{sop.content.purpose}</p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && filteredWorkflow.length === 0 && (
          <div className="bg-white rounded-[20px] border border-[#d3def5] p-8 text-center">
            <FileText size={32} className="text-[#c4d2ef] mx-auto mb-3" />
            <p className="text-[#475a7d] font-medium">No SOPs found</p>
            <p className="text-[#73839f] text-[13px]">Try adjusting your search or filter</p>
          </div>
        )}
        {filtered.map(sop => (
          <button
            key={sop.id}
            onClick={() => navigate(`${base}/sops/${sop.id}`)}
            className="w-full bg-white border border-[#d3def5] rounded-[20px] p-5 flex items-start gap-4 hover:border-[#1c5eff] hover:shadow-[0px_6px_18px_0px_rgba(28,94,255,0.08)] transition-all text-left group"
          >
            <div className="bg-[#e3edff] rounded-[14px] p-3 flex-shrink-0">
              <FileText size={20} className="text-[#1c5eff]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-[#11203b] font-semibold text-[15px] leading-snug group-hover:text-[#1c5eff] transition-colors">{sop.title}</h3>
                <ChevronRight size={16} className="text-[#c4d2ef] group-hover:text-[#1c5eff] flex-shrink-0 mt-0.5 transition-colors" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#73839f] text-[12px]">{sop.code}</span>
                <span className="text-[#c4d2ef]">·</span>
                <span className="text-[#73839f] text-[12px]">Rev.{sop.revision}</span>
                <span className="text-[#c4d2ef]">·</span>
                <span className="text-[#73839f] text-[12px]">Effective {sop.effectiveDate}</span>
              </div>
              <p className="text-[#475a7d] text-[13px] line-clamp-2 leading-relaxed">{sop.purpose}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                  sop.status === 'active' ? 'bg-[#e8f8f1] text-[#1c7b56]' : 'bg-[#fff0db] text-[#9a6115]'
                }`}>
                  {sop.status === 'active' ? 'Active' : 'Under Review'}
                </span>
                <span className="bg-[#f4f8ff] text-[#475a7d] text-[11px] font-medium px-2.5 py-1 rounded-full">{sop.department}</span>
                <span className="text-[#73839f] text-[11px]">Author: {sop.author}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

