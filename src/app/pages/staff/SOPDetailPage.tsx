import { useParams, useNavigate, useLocation } from 'react-router';
import { ArrowLeft, FileText, AlertTriangle, FlaskConical } from 'lucide-react';
import { SOPS } from '../../data/mockData';

export default function SOPDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const sop = SOPS.find(s => s.id === id);

  const base = location.pathname.startsWith('/supervisor') ? '/supervisor'
    : location.pathname.startsWith('/hod') ? '/hod'
    : '/staff';

  if (!sop) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#475a7d]">SOP not found.</p>
        <button onClick={() => navigate(`${base}/sops`)} className="text-[#1c5eff] text-[14px] mt-2">← Back to SOPs</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[900px]">
      {/* Back */}
      <button
        onClick={() => navigate(`${base}/sops`)}
        className="flex items-center gap-2 text-[#475a7d] text-[13px] font-medium mb-5 hover:text-[#1c5eff] transition-colors"
      >
        <ArrowLeft size={15} /> Back to SOPs
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className="bg-[#e3edff] rounded-[16px] p-3.5 flex-shrink-0">
            <FileText size={24} className="text-[#1c5eff]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#1c5eff] font-semibold text-[12px] tracking-[1.5px] uppercase">{sop.code}</span>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                sop.status === 'active' ? 'bg-[#e8f8f1] text-[#1c7b56]' : 'bg-[#fff0db] text-[#9a6115]'
              }`}>{sop.status === 'active' ? 'Active' : 'Under Review'}</span>
            </div>
            <h1 className="text-[#11203b] font-bold text-[22px] leading-snug mb-3">{sop.title}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Revision', value: `Rev.${sop.revision}` },
                { label: 'Effective', value: sop.effectiveDate },
                { label: 'Review Due', value: sop.reviewDate },
                { label: 'Department', value: sop.department },
              ].map(item => (
                <div key={item.label} className="bg-[#f4f8ff] rounded-[12px] px-3 py-2">
                  <p className="text-[#73839f] text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.5">{item.label}</p>
                  <p className="text-[#11203b] font-medium text-[13px]">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-[13px] text-[#475a7d]">
              <span>Author: <span className="font-medium text-[#11203b]">{sop.author}</span></span>
              <span>Approved by: <span className="font-medium text-[#11203b]">{sop.approvedBy}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Purpose & Principle */}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <h2 className="text-[#11203b] font-semibold text-[15px] mb-2">Purpose</h2>
          <p className="text-[#475a7d] text-[13px] leading-relaxed">{sop.purpose}</p>
        </div>
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <h2 className="text-[#11203b] font-semibold text-[15px] mb-2">Principle</h2>
          <p className="text-[#475a7d] text-[13px] leading-relaxed">{sop.principle}</p>
        </div>
      </div>

      {/* Equipment & Reagents */}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <h2 className="text-[#11203b] font-semibold text-[15px] mb-3">Equipment Required</h2>
          <ul className="space-y-1.5">
            {sop.equipment.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[#475a7d]">
                <div className="w-1.5 h-1.5 bg-[#1c5eff] rounded-full mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <h2 className="text-[#11203b] font-semibold text-[15px] mb-3">Reagents</h2>
          <ul className="space-y-1.5">
            {sop.reagents.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[#475a7d]">
                <div className="w-1.5 h-1.5 bg-[#0f86ff] rounded-full mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Procedure Steps */}
      <div className="bg-white rounded-[24px] border border-[#d3def5] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)] p-6 mb-5">
        <h2 className="text-[#11203b] font-semibold text-[17px] mb-4">Procedure</h2>
        <div className="space-y-4">
          {sop.steps.map(step => (
            <div key={step.stepNo} className="flex gap-4">
              <div className="bg-[#1c5eff] text-white rounded-full size-[28px] flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5">
                {step.stepNo}
              </div>
              <div className="flex-1 pb-4 border-b border-[#f4f8ff] last:border-0">
                <h3 className="text-[#11203b] font-semibold text-[14px] mb-1">{step.title}</h3>
                <p className="text-[#475a7d] text-[13px] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reference Ranges */}
      {sop.referenceRanges && sop.referenceRanges.length > 0 && (
        <div className="bg-white rounded-[24px] border border-[#d3def5] p-6 mb-5 overflow-x-auto">
          <h2 className="text-[#11203b] font-semibold text-[17px] mb-4">Reference Ranges</h2>
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="border-b border-[#f4f8ff]">
                <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Parameter</th>
                <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Unit</th>
                <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Male</th>
                <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3 pr-4">Female</th>
                {sop.referenceRanges.some(r => r.pediatricRange) && (
                  <th className="text-[#73839f] font-semibold text-[11px] uppercase tracking-[0.8px] pb-3">Paediatric</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sop.referenceRanges.map((range, i) => (
                <tr key={i} className="border-b border-[#f4f8ff] last:border-0">
                  <td className="py-3 pr-4 text-[#11203b] font-medium text-[13px]">{range.parameter}</td>
                  <td className="py-3 pr-4 text-[#73839f] text-[12px] font-mono">{range.unit}</td>
                  <td className="py-3 pr-4 text-[#475a7d] text-[13px]">{range.maleRange}</td>
                  <td className="py-3 pr-4 text-[#475a7d] text-[13px]">{range.femaleRange}</td>
                  {sop.referenceRanges!.some(r => r.pediatricRange) && (
                    <td className="py-3 text-[#475a7d] text-[13px]">{range.pediatricRange || '—'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Safety */}
      <div className="bg-[#fff8ed] border border-[#f5d99a] rounded-[20px] p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-[#9a6115]" />
          <h2 className="text-[#9a6115] font-semibold text-[15px]">Safety Precautions</h2>
        </div>
        <ul className="space-y-1.5">
          {sop.safetyPrecautions.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-[#7a4f10]">
              <div className="w-1.5 h-1.5 bg-[#9a6115] rounded-full mt-1.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Related tests */}
      {sop.relatedTests.length > 0 && (
        <div className="bg-white rounded-[20px] border border-[#d3def5] p-5">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical size={16} className="text-[#1c5eff]" />
            <h2 className="text-[#11203b] font-semibold text-[15px]">Related Tests</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sop.relatedTests.map(test => (
              <span key={test} className="bg-[#e3edff] text-[#1c5eff] text-[12px] font-medium px-3 py-1 rounded-full">
                {test}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}