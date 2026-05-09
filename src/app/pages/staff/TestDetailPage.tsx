import { useLocation, useNavigate, useParams } from 'react-router';
import { AlertCircle, ArrowLeft, Droplets, FlaskConical } from 'lucide-react';
import { LAB_TESTS } from '../../data/mockData';
import { openFloatingAI } from '../../services/aiWidget';
import { getContainerToneClass, getTubeColorStyle } from '../../utils/testVisuals';

export default function TestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const test = LAB_TESTS.find((t) => t.id === id);

  const base = location.pathname.startsWith('/supervisor')
    ? '/supervisor'
    : location.pathname.startsWith('/hod')
      ? '/hod'
      : '/staff';
  const cameFromAi = Boolean((location.state as { fromAi?: boolean } | null)?.fromAi);

  if (!test) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--kl-text-muted)]">Test not found.</p>
        <button onClick={() => navigate(`${base}/tests`)} className="text-[var(--kl-primary)] text-[14px] mt-2">Back to Tests</button>
      </div>
    );
  }

  return (
    <div className="kl-page">
      <button
        onClick={() => {
          if (cameFromAi) {
            openFloatingAI(`Keep explaining ${test.name} with interpretation guidance.`);
            return;
          }
          navigate(`${base}/tests`);
        }}
        className="flex items-center gap-2 text-[var(--kl-text-muted)] text-[13px] font-medium mb-5 hover:text-[var(--kl-primary)] transition-colors"
      >
        <ArrowLeft size={15} /> {cameFromAi ? 'Back to Knowlab AI' : 'Back to Tests'}
      </button>

      <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[24px] border border-[var(--kl-border)] shadow-[var(--kl-shadow)] p-4 sm:p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className={`rounded-[16px] p-3.5 ${getContainerToneClass(test.containerColor)}`}>
            <FlaskConical size={24} className="text-[var(--kl-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[var(--kl-primary)] font-semibold text-[12px] tracking-[1.5px] uppercase">{test.code}</span>
              <span className="bg-[#e8f8f1] dark:bg-[rgba(28,123,86,0.18)] text-[#1c7b56] dark:text-[#88e0ba] dark:bg-[rgba(28,123,86,0.18)] dark:text-[#88e0ba] text-[11px] font-medium px-2 py-0.5 rounded-full">Active</span>
            </div>
            <h1 className="text-[var(--kl-text)] font-bold text-[20px] sm:text-[22px] leading-snug mb-3">{test.name}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Category', value: test.category },
                { label: 'Turnaround', value: test.turnaround },
                { label: 'Related SOP', value: test.relatedSop },
              ].map((item) => (
                <div key={item.label} className="bg-[var(--kl-surface-tinted)] rounded-[12px] px-3 py-2">
                  <p className="text-[var(--kl-text-muted)] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">{item.label}</p>
                  <p className="text-[var(--kl-text)] font-medium text-[13px]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[20px] border border-[var(--kl-border)] p-4 sm:p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={16} className="text-[var(--kl-primary)]" />
          <h2 className="text-[var(--kl-text)] font-semibold text-[15px]">Sample Requirements</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Sample Type', value: test.sampleType },
            { label: 'Volume Required', value: test.sampleVolume },
            { label: 'Container', value: test.container },
            { label: 'Stability', value: test.stability },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[var(--kl-text-muted)] text-[11px] font-semibold uppercase tracking-[0.8px] mb-0.5">{item.label}</p>
              <p className="text-[var(--kl-text)] text-[13px] font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 p-3 bg-[var(--kl-surface-soft)] rounded-[12px]">
          <div
            className="w-4 h-4 rounded-full border border-[var(--kl-border)] flex-shrink-0"
            style={getTubeColorStyle(test.containerColor)}
          />
          <span className="text-[var(--kl-text)] text-[13px] font-medium">{test.container}</span>
          <span className={`text-[12px] px-2 py-0.5 rounded-full ${getContainerToneClass(test.containerColor)}`}>{test.containerColor}</span>
        </div>
        <div className="mt-3 p-3 bg-[var(--kl-surface-soft)] rounded-[12px]">
          <p className="text-[var(--kl-text-muted)] text-[11px] font-semibold uppercase tracking-[0.8px] mb-1">Methodology</p>
          <p className="text-[var(--kl-text-muted)] text-[13px]">{test.methodology}</p>
        </div>
      </div>

      <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[24px] border border-[var(--kl-border)] p-4 sm:p-6 mb-5 overflow-x-auto">
        <h2 className="text-[var(--kl-text)] font-semibold text-[17px] mb-4">Reference Ranges</h2>
        <table className="w-full text-left min-w-[400px]">
          <thead>
            <tr className="border-b border-[var(--kl-border)]">
              <th className="text-[var(--kl-text-muted)] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Parameter</th>
              <th className="text-[var(--kl-text-muted)] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Unit</th>
              <th className="text-[var(--kl-text-muted)] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Adult Male</th>
              <th className="text-[var(--kl-text-muted)] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Adult Female</th>
              {test.parameters.some((p) => p.pediatricRange) && (
                <th className="text-[var(--kl-text-muted)] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3">Paediatric</th>
              )}
            </tr>
          </thead>
          <tbody>
            {test.parameters.map((param, i) => (
              <tr key={i} className="border-b border-[var(--kl-border)] last:border-0">
                <td className="py-3 pr-4 text-[var(--kl-text)] font-medium text-[13px]">{param.name}</td>
                <td className="py-3 pr-4 text-[var(--kl-text-muted)] text-[12px] font-mono">{param.unit}</td>
                <td className="py-3 pr-4 text-[var(--kl-text-muted)] text-[13px]">{param.maleRange}</td>
                <td className="py-3 pr-4 text-[var(--kl-text-muted)] text-[13px]">{param.femaleRange}</td>
                {test.parameters.some((p) => p.pediatricRange) && (
                  <td className="py-3 text-[var(--kl-text-muted)] text-[13px]">{param.pediatricRange || '-'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[20px] border border-[var(--kl-border)] p-4 sm:p-5">
          <h2 className="text-[var(--kl-text)] font-semibold text-[15px] mb-2">Clinical Significance</h2>
          <p className="text-[var(--kl-text-muted)] text-[13px] leading-relaxed">{test.clinicalSignificance}</p>
        </div>
        <div className="bg-[var(--kl-surface)] rounded-[18px] sm:rounded-[20px] border border-[var(--kl-border)] p-4 sm:p-5">
          <h2 className="text-[var(--kl-text)] font-semibold text-[15px] mb-3">Clinical Indications</h2>
          <ul className="space-y-1.5">
            {test.indications.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--kl-text-muted)]">
                <div className="w-1.5 h-1.5 bg-[var(--kl-primary)] rounded-full mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {test.specialInstructions && (
        <div className="bg-[#fff8ed] dark:bg-[rgba(154,97,21,0.15)] border border-[#f5d99a] dark:border-[rgba(245,217,154,0.25)] dark:border-[rgba(245,217,154,0.25)] rounded-[18px] p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={15} className="text-[#9a6115] dark:text-[#f3c26f] dark:text-[#f3c26f]" />
            <h2 className="text-[#9a6115] dark:text-[#f3c26f] dark:text-[#f3c26f] font-semibold text-[14px]">Special Instructions</h2>
          </div>
          <p className="text-[#7a4f10] dark:text-[#f1d6a4] text-[13px] leading-relaxed">{test.specialInstructions}</p>
        </div>
      )}
    </div>
  );
}
