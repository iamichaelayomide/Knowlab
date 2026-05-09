import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Activity,
  Beaker,
  Bug,
  ChevronRight,
  CircleDot,
  Clock,
  Dna,
  Droplets,
  FlaskConical,
  Microscope,
  ScanLine,
  Search,
  Shield,
  ShieldPlus,
  Sparkles,
  TestTube2,
} from 'lucide-react';
import { LAB_TESTS } from '../../data/mockData';
import { useDepartment } from '../../context/DepartmentContext';
import { getContainerToneClass, getTubeColorStyle } from '../../utils/testVisuals';
import { TEXT_TOKENS } from '../../utils/textTokens';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'FBC & Automated Counts': <Droplets size={14} />,
  'Blood Film & Morphology': <Microscope size={14} />,
  Coagulation: <ShieldPlus size={14} />,
  'Blood Bank & Transfusion': <TestTube2 size={14} />,
  'ESR & Special Haematology': <Dna size={14} />,
  'Glucose & Diabetes Markers': <Activity size={14} />,
  'Bilirubin & Liver Function Tests': <Beaker size={14} />,
  'Kidney Function Tests': <CircleDot size={14} />,
  'Lipid Profile': <ScanLine size={14} />,
  'Electrolytes & Minerals': <FlaskConical size={14} />,
  Bacteriology: <FlaskConical size={14} />,
  Mycology: <Sparkles size={14} />,
  Virology: <Shield size={14} />,
  Parasitology: <Bug size={14} />,
  'Molecular Microbiology': <Microscope size={14} />,
};

export default function TestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBench } = useDepartment();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(activeBench.name);

  useEffect(() => {
    setActiveCategory(activeBench.name);
  }, [activeBench.id, activeBench.name]);

  const base = location.pathname.startsWith('/supervisor')
    ? '/supervisor'
    : location.pathname.startsWith('/hod')
      ? '/hod'
      : '/staff';

  const departmentTests = LAB_TESTS.filter((t) => t.status === 'active' && t.category === activeBench.name);
  const categories = ['All', ...Array.from(new Set(departmentTests.map((t) => t.category)))];

  const filtered = departmentTests.filter((t) => {
    const term = search.toLowerCase();
    const matchSearch =
      t.name.toLowerCase().includes(term) ||
      t.code.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term);
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="kl-page">
      <div className="mb-6">
        <h1 className="text-[var(--kl-text)] font-semibold text-[24px] mb-1">Laboratory Tests</h1>
        <p className="text-[var(--kl-text-muted)] text-[14px]">Reference ranges, methodologies, and collection requirements</p>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--kl-text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tests by name, code, or category..."
          className="w-full bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[14px] pl-10 pr-4 py-3 text-[14px] text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[#1c5eff] transition-colors"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all border active:scale-[0.98] ${
              activeCategory === cat
                ? 'bg-[var(--kl-surface-tinted)] text-[#1c5eff] border-[#1c5eff] shadow-[0_0_0_2px_rgba(28,94,255,0.15)]'
                : 'bg-[var(--kl-surface)] text-[var(--kl-text-muted)] border-[var(--kl-border)] hover:border-[var(--kl-primary)] hover:bg-[var(--kl-surface-soft)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 bg-[var(--kl-surface)] rounded-[20px] border border-[var(--kl-border)] p-8 text-center">
            <FlaskConical size={32} className="text-[#c4d2ef] mx-auto mb-3" />
            <p className="text-[var(--kl-text-muted)] font-medium">No tests found</p>
          </div>
        )}

        {filtered.map((test) => (
          <button
            key={test.id}
            onClick={() => navigate(`${base}/tests/${test.id}`)}
            className="bg-[var(--kl-surface)] rounded-[20px] border border-[var(--kl-border)] p-5 text-left hover:border-[var(--kl-primary)] hover:shadow-[var(--kl-shadow)] active:scale-[0.995] transition-all group flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0 ${getContainerToneClass(test.containerColor)}`}>
                  {CATEGORY_ICONS[test.category] ?? <FlaskConical size={12} />}
                </span>
                <span className="text-[var(--kl-text-muted)] text-[11px] font-mono">{test.code}</span>
              </div>
              <ChevronRight size={14} className="text-[#c4d2ef] group-hover:text-[#1c5eff] transition-colors" />
            </div>

            <h3 className="text-[var(--kl-text)] font-semibold text-[15px] mb-1 group-hover:text-[#1c5eff] transition-colors leading-snug">{test.name}</h3>
            <p className="text-[var(--kl-text-muted)] text-[12px] mb-3 flex-1">{test.category}</p>

            <div className="space-y-1.5 w-full">
              <div className="flex items-center gap-2 text-[12px] text-[var(--kl-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[rgba(17,32,59,0.08)] flex-shrink-0"
                    style={getTubeColorStyle(test.containerColor)}
                    title={test.containerColor}
                  >
                    <span className="sr-only">{test.containerColor}</span>
                  </span>
                  <span>{test.container}</span>
                </div>
                <span className="text-[#d3def5]">{TEXT_TOKENS.separator.trim()}</span>
                <span>{test.sampleVolume}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--kl-text-muted)]">
                <Clock size={12} className="text-[var(--kl-text-muted)]" />
                <span>{test.turnaround}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap w-full">
              <span className="bg-[var(--kl-surface-tinted)] text-[var(--kl-text-muted)] text-[11px] px-2 py-0.5 rounded-full">{test.parameters.length} parameters</span>
              {test.relatedSop && (
                <span className="bg-[var(--kl-surface-tinted)] text-[#1c5eff] text-[11px] px-2 py-0.5 rounded-full">{test.relatedSop}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
