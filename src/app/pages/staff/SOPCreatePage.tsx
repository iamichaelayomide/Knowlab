import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Save, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createSOPDraft, submitSOPForReview, updateSOPDraft } from '../../services/workflowStore';
import { USERS } from '../../data/mockData';

const defaultStep = { stepNo: 1, title: '', description: '' };

export default function SOPCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const supervisors = useMemo(() => USERS.filter(u => u.role === 'supervisor'), []);
  const [code, setCode] = useState(`SOP-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(user?.unit || '');
  const [purpose, setPurpose] = useState('');
  const [principle, setPrinciple] = useState('');
  const [equipment, setEquipment] = useState('');
  const [reagents, setReagents] = useState('');
  const [safety, setSafety] = useState('');
  const [relatedTests, setRelatedTests] = useState('');
  const [steps, setSteps] = useState([defaultStep]);
  const [reviewerId, setReviewerId] = useState(supervisors[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);

  if (!user) return null;

  const content = {
    purpose,
    principle,
    equipment: equipment.split('\n').map(x => x.trim()).filter(Boolean),
    reagents: reagents.split('\n').map(x => x.trim()).filter(Boolean),
    steps: steps.filter(x => x.title.trim() || x.description.trim()),
    safetyPrecautions: safety.split('\n').map(x => x.trim()).filter(Boolean),
    relatedTests: relatedTests.split(',').map(x => x.trim()).filter(Boolean),
    attachments: [],
  };

  const saveDraft = () => {
    if (!title.trim()) {
      setStatusMessage('Please provide SOP title before saving.');
      return;
    }
    if (!draftId) {
      const draft = createSOPDraft({
        owner: user,
        code,
        title,
        unit: user.unit,
        category: category || user.unit,
        content,
      });
      setDraftId(draft.id);
      setStatusMessage(`Draft ${draft.code} saved.`);
      return;
    }
    updateSOPDraft(draftId, content, title, category || user.unit);
    setStatusMessage('Draft autosaved.');
  };

  const submitForReview = () => {
    if (!draftId) {
      saveDraft();
      return;
    }
    const res = submitSOPForReview({
      sopId: draftId,
      staffUser: user,
      reviewerId,
      dueDate: dueDate || undefined,
    });
    if (!res.ok) {
      setStatusMessage(res.error);
      return;
    }
    navigate('/staff/sops');
  };

  return (
    <div className="p-4 sm:p-6 max-w-[980px]">
      <button
        onClick={() => navigate('/staff/sops')}
        className="flex items-center gap-2 text-[#475a7d] text-[13px] font-medium mb-4 hover:text-[#1c5eff]"
      >
        <ArrowLeft size={14} /> Back to SOPs
      </button>

      <div className="bg-white rounded-[20px] border border-[#d3def5] p-4 sm:p-6">
        <h1 className="text-[#11203b] font-semibold text-[22px] mb-1">Create SOP</h1>
        <p className="text-[#73839f] text-[13px] mb-5">
          Draft {'->'} assign reviewer {'->'} submit for supervisor review.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">SOP Code</label>
            <input value={code} onChange={e => setCode(e.target.value)} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Category / Unit</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[12px] text-[#475a7d] mb-1.5">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Purpose</label>
            <textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={4} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Principle</label>
            <textarea value={principle} onChange={e => setPrinciple(e.target.value)} rows={4} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Equipment (line separated)</label>
            <textarea value={equipment} onChange={e => setEquipment(e.target.value)} rows={5} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Reagents (line separated)</label>
            <textarea value={reagents} onChange={e => setReagents(e.target.value)} rows={5} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] text-[#475a7d]">Steps</label>
            <button
              type="button"
              onClick={() => setSteps(prev => [...prev, { stepNo: prev.length + 1, title: '', description: '' }])}
              className="inline-flex items-center gap-1 text-[12px] text-[#1c5eff] font-medium"
            >
              <Plus size={12} /> Add step
            </button>
          </div>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="border border-[#e3edff] rounded-[12px] p-3">
                <div className="grid md:grid-cols-[120px_1fr] gap-2">
                  <input
                    value={step.title}
                    onChange={e => setSteps(prev => prev.map((x, i) => i === idx ? { ...x, title: e.target.value, stepNo: idx + 1 } : x))}
                    placeholder={`Step ${idx + 1} title`}
                    className="border border-[#d3def5] rounded-[10px] px-2.5 py-2 text-[12px]"
                  />
                  <input
                    value={step.description}
                    onChange={e => setSteps(prev => prev.map((x, i) => i === idx ? { ...x, description: e.target.value, stepNo: idx + 1 } : x))}
                    placeholder="Description"
                    className="border border-[#d3def5] rounded-[10px] px-2.5 py-2 text-[12px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Safety precautions (line separated)</label>
            <textarea value={safety} onChange={e => setSafety(e.target.value)} rows={4} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Related tests (comma separated)</label>
            <textarea value={relatedTests} onChange={e => setRelatedTests(e.target.value)} rows={4} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Assign Supervisor Reviewer</label>
            <select value={reviewerId} onChange={e => setReviewerId(e.target.value)} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]">
              {supervisors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] text-[#475a7d] mb-1.5">Review due date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-[#d3def5] rounded-[12px] px-3 py-2.5 text-[13px]" />
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 text-[12px] bg-[#eef5ff] border border-[#bdd3ff] text-[#1c5eff] rounded-[12px] px-3 py-2.5">
            {statusMessage}
          </div>
        )}

        <div className="flex gap-2 mt-5">
          <button onClick={saveDraft} className="inline-flex items-center gap-1.5 bg-[#f4f8ff] border border-[#d3def5] text-[#11203b] rounded-[12px] px-4 py-2 text-[13px]">
            <Save size={14} /> Save draft
          </button>
          <button onClick={submitForReview} className="inline-flex items-center gap-1.5 bg-[#1c5eff] text-white rounded-[12px] px-4 py-2 text-[13px]">
            <Send size={14} /> Submit for review
          </button>
        </div>
      </div>
    </div>
  );
}
