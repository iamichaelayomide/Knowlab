import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'What are the FBC reference ranges for adult females?',
  'When should I reject an EDTA sample?',
  'What are the Westgard rules for QC failure?',
  'How do I handle a QNS (quantity not sufficient) sample?',
  'What tube is used for PT/INR testing?',
  'What are critical values for platelets?',
];

const AI_RESPONSES: Record<string, string> = {
  default: "I'm here to help with laboratory procedures, test information, and quality guidance. You can ask me about reference ranges, sample requirements, QC procedures, or any lab protocol question.",
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('fbc') && (q.includes('range') || q.includes('female') || q.includes('adult'))) {
    return `**FBC Reference Ranges — Adult Female:**\n\n• WBC: 4.0 – 11.0 ×10⁹/L\n• RBC: 3.8 – 4.8 ×10¹²/L\n• HGB (Haemoglobin): 11.5 – 15.5 g/dL\n• HCT (PCV): 36 – 46%\n• MCV: 80 – 100 fL\n• MCH: 27 – 33 pg\n• MCHC: 31.5 – 35.5 g/dL\n• Platelets: 150 – 400 ×10⁹/L\n• Neutrophils: 1.8 – 7.5 ×10⁹/L\n• Lymphocytes: 1.0 – 4.0 ×10⁹/L\n\n📌 For male ranges or paediatric values, please see **HEM-SOP-001** or the Tests page.`;
  }

  if (q.includes('fbc') && q.includes('male')) {
    return `**FBC Reference Ranges — Adult Male:**\n\n• WBC: 4.0 – 11.0 ×10⁹/L\n• RBC: 4.5 – 5.5 ×10¹²/L\n• HGB: 13.5 – 17.5 g/dL\n• HCT (PCV): 41 – 53%\n• MCV: 80 – 100 fL\n• MCH: 27 – 33 pg\n• MCHC: 31.5 – 35.5 g/dL\n• Platelets: 150 – 400 ×10⁹/L\n\n📌 Full procedure: **HEM-SOP-001** (Rev.04)`;
  }

  if (q.includes('reject') && (q.includes('edta') || q.includes('sample'))) {
    return `**Sample Rejection Criteria (EDTA):**\n\n🔴 **Always reject:**\n• Clotted sample (feel for resistance on inversion)\n• Unlabelled sample (NEVER label retrospectively)\n• Name/number mismatch on label\n• Underfilled tube (<minimum volume)\n• Sample >24 hours old (MCV/HCT unreliable)\n\n🟡 **Assess before rejecting:**\n• Mild haemolysis — note on report; reject for coagulation\n• Moderate lipaemia — affects HGB reading; flag result\n• QNS — partial testing may be possible for critical patients; document and notify supervisor\n\n📌 See Job Aid: **Sample Rejection Criteria** for full decision guide.`;
  }

  if (q.includes('westgard') || (q.includes('qc') && q.includes('fail'))) {
    return `**Westgard Multi-Rules for QC Failure:**\n\n• **1-2s (Warning):** One result >2SD → Repeat QC. If repeat passes, proceed. If not, investigate.\n• **1-3s (Reject):** One result >3SD → REJECT. Systematic error suspected. Do not report patients.\n• **2-2s (Reject):** Two consecutive results >2SD in the same direction → REJECT. Drift suspected.\n• **R-4s (Reject):** Two consecutive results >4SD range → REJECT. Random error.\n• **Trend (6×1s):** 6 consecutive results trending one direction → REJECT. Calibration drift.\n\n**If QC fails:**\n1. Stop patient testing\n2. Check reagents, calibration, maintenance log\n3. Repeat all 3 QC levels\n4. If repeat fails → escalate to Supervisor\n5. Document all actions\n\n📌 See Job Aid: **QC Failure Decision Tree**`;
  }

  if (q.includes('qns') || q.includes('quantity not sufficient')) {
    return `**Handling QNS (Quantity Not Sufficient) Samples:**\n\n1. **Do NOT process** without checking adequacy first.\n2. **Minimum volumes:** FBC ≥1.5 mL (EDTA), PT/INR ≥2.5 mL (citrate).\n3. **For critical patients:** consult Supervisor — partial testing may be authorized with documentation.\n4. **Document** QNS on the request form and in the LIS.\n5. **Notify ward** and request recollection if sample is inadequate.\n6. **Never dilute** an EDTA sample to meet volume.\n7. For paediatric micro-samples, use validated micro-methods.\n\n⚠️ Always prioritize patient safety — a QNS result could be more dangerous than no result.`;
  }

  if ((q.includes('tube') || q.includes('container')) && (q.includes('pt') || q.includes('inr') || q.includes('coag') || q.includes('prothrombin'))) {
    return `**Sample Tube for PT/INR and Coagulation Tests:**\n\n🔵 **Light Blue Top** — 3.2% Sodium Citrate (0.109 M) vacuum tube\n\n**Critical requirements:**\n• **Fill to the mark** — 9:1 blood:citrate ratio is mandatory\n• Underfilling → falsely prolonged PT and APTT\n• Overfilling → falsely shortened results\n• **NO** glass tubes — plastic sodium citrate only\n• Centrifuge at 2000×g for 10 minutes (within 30 min of collection)\n• Test plasma within **4 hours** of collection\n• If delay: freeze at −20°C\n\n**For APTT:** Avoid IV line collection (heparin contamination → falsely prolonged APTT)\n\n📌 See **COAG-SOP-001** for full procedure.`;
  }

  if (q.includes('critical') && (q.includes('platelet') || q.includes('plt'))) {
    return `**Critical Value — Platelet Count:**\n\n🔴 **Critical threshold: PLT < 50 ×10⁹/L**\n\n**Immediate actions required:**\n1. Verify result — check for platelet clumping on the scattergram\n2. If clumping suspected: make a blood film (EDTA clumping → recollect in citrate)\n3. If confirmed critical: **call the requesting clinician immediately**\n4. State: "I am [name] calling from the lab with a critical platelet result for patient [name/ID]: PLT = [value] ×10⁹/L"\n5. Ask for **read-back confirmation**\n6. Document in the **Critical Values Register**: time, person notified, read-back\n\n**Also critical:**\n• PLT >1000 ×10⁹/L (extreme thrombocytosis)\n\n📌 See Job Aid: **Critical Values Notification Guide**`;
  }

  if (q.includes('esr') && q.includes('range')) {
    return `**ESR Reference Ranges (Westergren):**\n\n• **Adult Male <50 yrs:** 0 – 15 mm/hr\n• **Adult Male ≥50 yrs:** 0 – 20 mm/hr\n• **Adult Female <50 yrs:** 0 – 20 mm/hr\n• **Adult Female ≥50 yrs:** 0 – 30 mm/hr\n• **Children:** 0 – 10 mm/hr\n\n⚠️ Markedly elevated ESR (>100 mm/hr) should be flagged — possible myeloma, giant cell arteritis, TB, or sepsis.\n\n📌 Procedure: **HEM-SOP-002**`;
  }

  if (q.includes('blood group') || q.includes('abo') || q.includes('rh')) {
    return `**ABO & Rhesus Blood Grouping:**\n\n**Tube:** EDTA (purple) or Plain (red) — 3 mL\n\n**Interpretation:**\n• Group A: Anti-A(+), Anti-B(−), A cells(−), B cells(+)\n• Group B: Anti-A(−), Anti-B(+), A cells(+), B cells(−)\n• Group O: Anti-A(−), Anti-B(−), A cells(+), B cells(+)\n• Group AB: Anti-A(+), Anti-B(+), A cells(−), B cells(−)\n\n• Rh D Positive: Anti-D(+)\n• Rh D Negative: Anti-D(−) → confirm with weak D (Du) testing\n\n⚠️ **Any discordance between forward and back grouping → DO NOT REPORT. Investigate and refer to Supervisor.**\n\n📌 Procedure: **BB-SOP-001**`;
  }

  if (q.includes('cross') && q.includes('match')) {
    return `**Cross-Match Requirements:**\n\n📦 **Samples needed:**\n• 3 mL EDTA (purple) + 3 mL plain (red) = 6 mL total\n• Both tubes labelled at bedside with: full name, hospital number, DOB, date/time, collector initials\n\n⏱️ **Turnaround:**\n• Immediate spin (IS) cross-match: ~20–30 min\n• Full IAT cross-match: 60–120 min\n• Electronic cross-match: only if 2 concordant historical groups, no antibodies\n\n⚠️ **72-hour rule:** A new cross-match sample is required if transfusion is >72 hours after the group-and-screen sample was taken.\n\n📌 Procedure: **BB-SOP-002**`;
  }

  if (q.includes('haemovigilance') || q.includes('transfusion reaction')) {
    return `**Transfusion Reaction — Immediate Steps:**\n\n1. 🛑 **STOP transfusion immediately**\n2. Keep IV line open with **normal saline**\n3. Call **clinician immediately**\n4. Keep: blood bag, administration set, all documentation\n5. Collect: post-transfusion EDTA sample + urine sample\n6. Return remaining unit to Blood Bank\n7. Complete **Haemovigilance Adverse Event Form** within 24 hours\n8. If serious (haemolysis, anaphylaxis, TRALI): mark URGENT\n\n**Types of reactions:**\n• Febrile non-haemolytic (FNHTR) — most common\n• Urticaria (allergic)\n• Anaphylaxis\n• Acute haemolytic reaction (ABO incompatibility)\n• TACO (circulatory overload)\n• TRALI (lung injury)\n\n📌 See Job Aid: **Haemovigilance Adverse Event Reporting**`;
  }

  if (q.includes('reticulocyte') && q.includes('range')) {
    return `**Reticulocyte Reference Ranges:**\n\n• **Adult (male & female):**\n  - Reticulocyte %: 0.5 – 2.5%\n  - Absolute count: 25 – 125 ×10⁹/L\n  - IRF (Immature Reticulocyte Fraction): 2.0 – 14.0%\n\n• **Neonates:** Retic % 2.0 – 6.0% (normal range higher)\n\n**Clinical interpretation:**\n• Elevated → Active erythropoiesis (haemolysis, haemorrhage, treatment response)\n• Low relative to anaemia → Hypoproliferative (iron/B12/folate deficiency, aplasia)\n\n📌 Analyzer: Sysmex XN-350 RET channel (HEM-SOP-001)`;
  }

  return `I can help with that. Based on your question about "${query}", here are some key points:\n\nFor specific procedures, please refer to the relevant SOP in the SOP library. For test reference ranges and sample requirements, visit the Tests page. For quick reminders, check the Job Aids section.\n\nIs there a more specific aspect of this question I can help you with?`;
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0]}! 👋 I'm the Knowlab AI Assistant. I can help you with:\n\n• Laboratory reference ranges and normal values\n• Sample collection and handling requirements\n• QC procedures and Westgard rules\n• SOP and test procedure guidance\n• Critical value notification steps\n• Transfusion safety protocols\n\nWhat can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  const reset = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: `Hello again! How can I assist you with laboratory procedures today?`,
      timestamp: new Date(),
    }]);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-[#11203b] mt-2 first:mt-0">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('• ') || line.startsWith('🔴 ') || line.startsWith('🟡 ') || line.startsWith('🔵 ') || line.startsWith('⚠️ ') || line.startsWith('📌 ')) {
        const isBold = line.includes('**');
        const parts = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} className="text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: parts }} />;
      }
      if (line.trim() === '') return <div key={i} className="h-1" />;
      return <p key={i} className="text-[13px] leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 68px)' }}>
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[#d3def5] bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#1c5eff] to-[#0f86ff] rounded-[14px] p-2.5">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[#11203b] font-semibold text-[18px]">AI Lab Assistant</h1>
            <p className="text-[#73839f] text-[12px]">Ask about procedures, ranges, and protocols</p>
          </div>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-[#73839f] text-[12px] hover:text-[#475a7d] transition-colors"
        >
          <RotateCcw size={13} /> New chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f9fbff]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-[#1c5eff] to-[#0f86ff]'
                : 'bg-[#11203b]'
            }`}>
              {msg.role === 'assistant'
                ? <Sparkles size={14} className="text-white" />
                : <User size={14} className="text-white" />
              }
            </div>
            <div className={`max-w-[85%] rounded-[18px] px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-[#1c5eff] text-white rounded-tr-[6px]'
                : 'bg-white border border-[#d3def5] text-[#475a7d] rounded-tl-[6px]'
            }`}>
              {msg.role === 'user'
                ? <p className="text-[13px] leading-relaxed">{msg.content}</p>
                : <div className="space-y-0.5">{formatContent(msg.content)}</div>
              }
              <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-[#73839f]'}`}>
                {msg.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1c5eff] to-[#0f86ff] flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white border border-[#d3def5] rounded-[18px] rounded-tl-[6px] px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="w-1.5 h-1.5 bg-[#1c5eff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#1c5eff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#1c5eff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length < 2 && (
        <div className="px-6 py-3 bg-white border-t border-[#f4f8ff]">
          <p className="text-[#73839f] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Quick questions</p>
          <div className="flex gap-2 flex-wrap">
            {QUICK_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => send(prompt)}
                className="bg-[#f4f8ff] text-[#475a7d] text-[12px] px-3 py-1.5 rounded-full hover:bg-[#e3edff] hover:text-[#1c5eff] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-[#d3def5]">
        <form
          onSubmit={e => { e.preventDefault(); send(input); }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about a test, reference range, or procedure…"
            className="flex-1 bg-[#f4f8ff] border border-[#d3def5] rounded-[14px] px-4 py-3 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-[#1c5eff] hover:bg-[#1548e8] text-white rounded-[14px] px-4 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}