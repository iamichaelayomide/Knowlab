import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Search, FlaskConical, ChevronRight, Clock } from 'lucide-react';
import { LAB_TESTS } from '../../data/mockData';
import { useDepartment } from '../../context/DepartmentContext';

const CONTAINER_COLORS: Record<string, string> = {
  'Purple/Lavender': '#9333ea',
  'Light Blue': '#3b82f6',
  'Black': '#374151',
  'Purple or Red': '#9333ea',
  'EDTA or Plain Tube': '#9333ea',
};

export default function TestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeDepartment, activeBench } = useDepartment();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(activeBench.name);

  // Reset category when bench changes
  useEffect(() => {
    setActiveCategory(activeBench.name);
  }, [activeBench.id, activeBench.name]);

  // Derive role base so navigation stays in the correct workspace
  const base = location.pathname.startsWith('/supervisor') ? '/supervisor'
    : location.pathname.startsWith('/hod') ? '/hod'
    : '/staff';

  const departmentTests = LAB_TESTS.filter(t => {
    if (t.status !== 'active') return false;
    return t.category === activeBench.name;
  });

  const categories = ['All', ...Array.from(new Set(departmentTests.map(t => t.category)))];

  const filtered = departmentTests.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[#11203b] font-semibold text-[24px] mb-1">Laboratory Tests</h1>
        <p className="text-[#73839f] text-[14px]">Reference ranges, methodologies, and collection requirements</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73839f]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tests by name, code, or category…"
          className="w-full bg-white border border-[#d3def5] rounded-[14px] pl-10 pr-4 py-3 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map(cat => (
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

      {/* Tests Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-[20px] border border-[#d3def5] p-8 text-center">
            <FlaskConical size={32} className="text-[#c4d2ef] mx-auto mb-3" />
            <p className="text-[#475a7d] font-medium">No tests found</p>
          </div>
        )}
        {filtered.map(test => (
          <button
            key={test.id}
            onClick={() => navigate(`${base}/tests/${test.id}`)}
            className="bg-white rounded-[20px] border border-[#d3def5] p-5 text-left hover:border-[#1c5eff] hover:shadow-[0px_6px_18px_0px_rgba(28,94,255,0.08)] transition-all group flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CONTAINER_COLORS[test.containerColor] || '#6b7280' }}
                />
                <span className="text-[#73839f] text-[11px] font-mono">{test.code}</span>
              </div>
              <ChevronRight size={14} className="text-[#c4d2ef] group-hover:text-[#1c5eff] transition-colors" />
            </div>
            <h3 className="text-[#11203b] font-semibold text-[15px] mb-1 group-hover:text-[#1c5eff] transition-colors leading-snug">{test.name}</h3>
            <p className="text-[#73839f] text-[12px] mb-3 flex-1">{test.category}</p>
            <div className="space-y-1.5 w-full">
              <div className="flex items-center gap-2 text-[12px] text-[#475a7d]">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CONTAINER_COLORS[test.containerColor] || '#6b7280' }}
                  />
                  <span>{test.container}</span>
                </div>
                <span className="text-[#d3def5]">·</span>
                <span>{test.sampleVolume}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#475a7d]">
                <Clock size={12} className="text-[#73839f]" />
                <span>{test.turnaround}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap w-full">
              <span className="bg-[#f4f8ff] text-[#475a7d] text-[11px] px-2 py-0.5 rounded-full">{test.parameters.length} parameters</span>
              {test.relatedSop && (
                <span className="bg-[#e3edff] text-[#1c5eff] text-[11px] px-2 py-0.5 rounded-full">{test.relatedSop}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}