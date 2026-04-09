import { useParams, useNavigate, useLocation } from 'react-router';
import { ArrowLeft, FlaskConical, Droplets, AlertCircle } from 'lucide-react';
import { LAB_TESTS } from '../../data/mockData';

const CONTAINER_COLORS: Record<string, string> = {
  'Purple/Lavender': '#9333ea',
  'Light Blue': '#3b82f6',
  'Black': '#374151',
  'Purple or Red': '#9333ea',
  'EDTA or Plain Tube': '#9333ea',
};

export default function TestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const test = LAB_TESTS.find(t => t.id === id);

  const base = location.pathname.startsWith('/supervisor') ? '/supervisor'
    : location.pathname.startsWith('/hod') ? '/hod'
    : '/staff';

  if (!test) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#475a7d]">Test not found.</p>
        <button onClick={() => navigate(`${base}/tests`)} className="text-[#1c5eff] text-[14px] mt-2">← Back to Tests</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[900px]">
      <button
        onClick={() => navigate(`${base}/tests`)}
        className="flex items-center gap-2 text-[#475a7d] text-[13px] font-medium mb-5 hover:text-[#1c5eff] transition-colors"
      >
        <ArrowLeft size={15} /> Back to Tests
      </button>

      {/* Header */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className="bg-[#f4f8ff] rounded-[16px] p-3.5">
            <FlaskConical size={24} className="text-[#1c5eff]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#1c5eff] font-semibold text-[12px] tracking-[1.5px] uppercase">{test.code}</span>
              <span className="bg-[#e8f8f1] text-[#1c7b56] text-[11px] font-medium px-2 py-0.5 rounded-full">Active</span>
            </div>
            <h1 className="text-[#11203b] font-bold text-[22px] mb-3">{test.name}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Category', value: test.category },
                { label: 'Turnaround', value: test.turnaround },
                { label: 'Related SOP', value: test.relatedSop },
              ].map(item => (
                <div key={item.label} className="bg-[#f4f8ff] rounded-[12px] px-3 py-2">
                  <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">{item.label}</p>
                  <p className="text-[#11203b] font-medium text-[13px]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sample Requirements */}
      <div className="bg-white rounded-[20px] border border-[#d3def5] p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={16} className="text-[#1c5eff]" />
          <h2 className="text-[#11203b] font-semibold text-[15px]">Sample Requirements</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Sample Type', value: test.sampleType },
            { label: 'Volume Required', value: test.sampleVolume },
            { label: 'Container', value: test.container },
            { label: 'Stability', value: test.stability },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[#73839f] text-[11px] font-semibold uppercase tracking-[0.8px] mb-0.5">{item.label}</p>
              <p className="text-[#11203b] text-[13px] font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 p-3 bg-[#f4f8ff] rounded-[12px]">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: CONTAINER_COLORS[test.containerColor] || '#6b7280' }}
          />
          <span className="text-[#11203b] text-[13px] font-medium">{test.container}</span>
          <span className="text-[#73839f] text-[12px]">({test.containerColor})</span>
        </div>
        <div className="mt-3 p-3 bg-[#f4f8ff] rounded-[12px]">
          <p className="text-[#73839f] text-[11px] font-semibold uppercase tracking-[0.8px] mb-1">Methodology</p>
          <p className="text-[#475a7d] text-[13px]">{test.methodology}</p>
        </div>
      </div>

      {/* Reference Ranges */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] p-6 mb-5 overflow-x-auto">
        <h2 className="text-[#11203b] font-semibold text-[17px] mb-4">Reference Ranges</h2>
        <table className="w-full text-left min-w-[400px]">
          <thead>
            <tr className="border-b border-[#f4f8ff]">
              <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Parameter</th>
              <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Unit</th>
              <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Adult Male</th>
              <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Adult Female</th>
              {test.parameters.some(p => p.pediatricRange) && (
                <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3">Paediatric</th>
              )}
            </tr>
          </thead>
          <tbody>
            {test.parameters.map((param, i) => (
              <tr key={i} className="border-b border-[#f4f8ff] last:border-0">
                <td className="py-3 pr-4 text-[#11203b] font-medium text-[13px]">{param.name}</td>
                <td className="py-3 pr-4 text-[#73839f] text-[12px] font-mono">{param.unit}</td>
                <td className="py-3 pr-4 text-[#475a7d] text-[13px]">{param.maleRange}</td>
                <td className="py-3 pr-4 text-[#475a7d] text-[13px]">{param.femaleRange}</td>
                {test.parameters.some(p => p.pediatricRange) && (
                  <td className="py-3 text-[#475a7d] text-[13px]">{param.pediatricRange || '—'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clinical Significance + Indications */}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <h2 className="text-[#11203b] font-semibold text-[15px] mb-2">Clinical Significance</h2>
          <p className="text-[#475a7d] text-[13px] leading-relaxed">{test.clinicalSignificance}</p>
        </div>
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <h2 className="text-[#11203b] font-semibold text-[15px] mb-3">Clinical Indications</h2>
          <ul className="space-y-1.5">
            {test.indications.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[#475a7d]">
                <div className="w-1.5 h-1.5 bg-[#1c5eff] rounded-full mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Special Instructions */}
      {test.specialInstructions && (
        <div className="bg-[#fff8ed] border border-[#f5d99a] rounded-[18px] p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={15} className="text-[#9a6115]" />
            <h2 className="text-[#9a6115] font-semibold text-[14px]">Special Instructions</h2>
          </div>
          <p className="text-[#7a4f10] text-[13px] leading-relaxed">{test.specialInstructions}</p>
        </div>
      )}
    </div>
  );
}