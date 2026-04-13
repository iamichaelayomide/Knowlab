import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { BookOpenCheck, FileImage, FileText, Paperclip, Send, Sparkles, User, X } from 'lucide-react';
import { JOB_AIDS, LAB_TESTS, SOPS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { askKnowledgeAssistant, type AssistantSource } from '../../services/aiAssistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: AssistantSource[];
  attachments?: UploadedAttachment[];
}

interface PersistedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: AssistantSource[];
  attachments?: UploadedAttachment[];
}

interface UploadedAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

const QUICK_PROMPTS = [
  'What is the reference range for glucose?',
  'What tube and ratio are required for PT and APTT?',
  'What is the last CAPA incident?',
  'Who is under 80% competency in this bench?',
];

const MAX_ATTACHMENTS = 6;

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function confidenceLabel(v?: number) {
  if (!v) return 'Unscored confidence';
  if (v >= 0.8) return 'High confidence';
  if (v >= 0.55) return 'Medium confidence';
  return 'Low confidence';
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function defaultWelcome(name?: string): Message {
  return {
    id: 'hello',
    role: 'assistant',
    content:
      `Hi ${name?.split(' ')[0] ?? 'there'} - I am Knowlab AI.\n\n` +
      'I can answer SOP/test questions and also operations questions (CAPA, competency, staffing scope) for supervisor and HOD roles.',
    timestamp: new Date(),
    confidence: 0.97,
  };
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const location = useLocation();
  const navigate = useNavigate();
  const consumedPrefillRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [queuedAttachments, setQueuedAttachments] = useState<UploadedAttachment[]>([]);
  const [messages, setMessages] = useState<Message[]>(() => [defaultWelcome(user?.name)]);

  const base = useMemo(() => {
    if (location.pathname.startsWith('/supervisor')) return '/supervisor';
    if (location.pathname.startsWith('/hod')) return '/hod';
    return '/staff';
  }, [location.pathname]);

  const historyKey = useMemo(() => {
    const userKey = user?.id || 'anon';
    return `knowlab_ai_history_${userKey}_${base.replace('/', '')}`;
  }, [base, user?.id]);

  useEffect(() => {
    const raw = localStorage.getItem(historyKey);
    if (!raw) {
      setMessages([defaultWelcome(user?.name)]);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as PersistedMessage[];
      if (!parsed.length) {
        setMessages([defaultWelcome(user?.name)]);
        return;
      }
      setMessages(parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } catch {
      setMessages([defaultWelcome(user?.name)]);
    }
  }, [historyKey, user?.name]);

  useEffect(() => {
    const prefill = (location.state as { prefill?: string } | null)?.prefill?.trim();
    if (!prefill) return;
    if (consumedPrefillRef.current === prefill) return;
    setInput(prefill);
    consumedPrefillRef.current = prefill;
  }, [location.state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const payload: PersistedMessage[] = messages.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    }));
    localStorage.setItem(historyKey, JSON.stringify(payload));
  }, [historyKey, messages]);

  const resolveSourceTarget = (source: AssistantSource) => {
    const sourceIdNorm = normalizeText(source.id);
    const sourceTitleNorm = normalizeText(source.title);

    if (source.type === 'sop') {
      const sop =
        SOPS.find((s) => normalizeText(s.code) === sourceIdNorm) ??
        SOPS.find((s) => normalizeText(s.title).includes(sourceTitleNorm) || sourceTitleNorm.includes(normalizeText(s.title)));
      if (sop) {
        return { label: `Open SOP: ${sop.code}`, to: `${base}/sops/${sop.id}` };
      }
    }

    if (source.type === 'test') {
      const test =
        LAB_TESTS.find((t) => normalizeText(t.code) === sourceIdNorm) ??
        LAB_TESTS.find((t) => normalizeText(t.name).includes(sourceTitleNorm) || sourceTitleNorm.includes(normalizeText(t.name)));
      if (test) {
        return { label: `Open Test: ${test.code}`, to: `${base}/tests/${test.id}` };
      }
    }

    if (source.type === 'job_aid') {
      const aid = JOB_AIDS.find(
        (j) => normalizeText(j.title).includes(sourceTitleNorm) || sourceTitleNorm.includes(normalizeText(j.title)),
      );
      return {
        label: aid ? `Open Job Aid: ${aid.title}` : `Find Job Aid: ${source.title}`,
        to: `${base}/job-aids?q=${encodeURIComponent(aid?.title || source.title)}`,
      };
    }

    if (source.type === 'ops') {
      const to = base === '/hod' ? `${base}/reports` : `${base}/capa`;
      return { label: 'Open Operations View', to };
    }

    return null;
  };

  const reset = () => {
    const intro = defaultWelcome(user?.name);
    intro.content =
      'New Knowlab AI chat started.\n\n' +
      'Ask a test/SOP question or operational question and I will return direct answers with clickable sources.';
    setMessages([intro]);
    setQueuedAttachments([]);
  };

  const handlePickAttachments = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const mapped = files.slice(0, MAX_ATTACHMENTS - queuedAttachments.length).map((file) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setQueuedAttachments((prev) => [...prev, ...mapped]);
    event.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setQueuedAttachments((prev) => prev.filter((file) => file.id !== id));
  };

  const send = async (text: string) => {
    if ((!text.trim() && queuedAttachments.length === 0) || !user) return;
    const contentText = text.trim() || 'Please review the attached files and summarize relevant SOP/test guidance.';

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: contentText,
      timestamp: new Date(),
      attachments: queuedAttachments.length ? [...queuedAttachments] : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setQueuedAttachments([]);
    setIsTyping(true);

    const attachmentHint = userMsg.attachments?.length
      ? `\n\nAttached materials provided by user: ${userMsg.attachments.map((a) => a.name).join(', ')}.`
      : '';

    const result = await askKnowledgeAssistant({
      query: `${contentText}${attachmentHint}`,
      role: user.role,
      unit: user.unit,
      department: activeDepartment.name,
      bench: activeBench.name,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: result.answer,
        timestamp: new Date(),
        confidence: result.confidence,
        sources: result.sources,
      },
    ]);
    setIsTyping(false);
  };

  return (
    <div className="h-[calc(100dvh-68px)] max-h-[calc(100dvh-68px)] flex flex-col overflow-hidden bg-[#f9fbff]">
      <div className="shrink-0 px-3 sm:px-6 py-4 border-b border-[#d3def5] bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-gradient-to-br from-[#1c5eff] to-[#0f86ff] rounded-[14px] p-2.5 shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[#11203b] font-semibold text-[17px] sm:text-[18px] truncate">Knowlab AI</h1>
              <p className="text-[#73839f] text-[11px] sm:text-[12px] truncate">Knowledge + operations assistant</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="text-[#475a7d] text-[12px] font-medium border border-[#d3def5] rounded-[10px] px-3 py-1.5 hover:bg-[#f4f8ff] shrink-0"
          >
            New chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-gradient-to-br from-[#1c5eff] to-[#0f86ff]' : 'bg-[#11203b]'
              }`}
            >
              {msg.role === 'assistant' ? <Sparkles size={14} className="text-white" /> : <User size={14} className="text-white" />}
            </div>
            <div
              className={`max-w-[95%] sm:max-w-[86%] rounded-[18px] px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-[#1c5eff] text-white rounded-tr-[6px]'
                  : 'bg-white border border-[#d3def5] text-[#475a7d] rounded-tl-[6px]'
              }`}
            >
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {msg.role === 'user' && !!msg.attachments?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.attachments.map((file) => (
                    <span key={file.id} className="inline-flex items-center gap-1.5 bg-[rgba(255,255,255,0.18)] text-white text-[11px] px-2.5 py-1 rounded-full">
                      {file.type.startsWith('image/') ? <FileImage size={11} /> : <FileText size={11} />}
                      {file.name}
                    </span>
                  ))}
                </div>
              )}

              {msg.role === 'assistant' && (
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] text-[#73839f]">{confidenceLabel(msg.confidence)} · {(msg.confidence ?? 0).toFixed(2)}</p>
                  {!!msg.sources?.length && (
                    <div className="flex gap-1.5 flex-wrap">
                      {msg.sources.map((src) => {
                        const target = resolveSourceTarget(src);
                        return (
                          <button
                            key={`${msg.id}_${src.id}_${src.title}`}
                            onClick={() => {
                              if (!target) return;
                              navigate(target.to, { state: { fromAi: true, sourceTitle: src.title } });
                            }}
                            disabled={!target}
                            className={`inline-flex items-center gap-1 bg-[#eef5ff] text-[#1c5eff] text-[11px] px-2.5 py-1 rounded-full ${
                              target ? 'hover:bg-[#dce9ff]' : 'opacity-60 cursor-not-allowed'
                            }`}
                            title={target?.label || 'Source route unavailable in current workspace'}
                          >
                            <BookOpenCheck size={11} />
                            {src.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-[#73839f]'}`}>
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

        {messages.length < 3 && (
          <div className="pt-2">
            <p className="text-[#73839f] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Try asking</p>
            <div className="flex gap-2 flex-wrap">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void send(prompt)}
                  className="bg-white border border-[#d3def5] text-[#475a7d] text-[12px] px-3 py-1.5 rounded-full hover:bg-[#e3edff] hover:text-[#1c5eff]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-[#d3def5] bg-white px-3 sm:px-4 py-3">
        {!!queuedAttachments.length && (
          <div className="flex flex-wrap gap-2 mb-3">
            {queuedAttachments.map((file) => (
              <span key={file.id} className="inline-flex items-center gap-1.5 bg-[#f4f8ff] text-[#475a7d] text-[11px] px-2.5 py-1 rounded-full border border-[#d3def5]">
                {file.type.startsWith('image/') ? <FileImage size={11} /> : <FileText size={11} />}
                <span>{file.name}</span>
                <span className="text-[#73839f]">({formatBytes(file.size)})</span>
                <button onClick={() => removeAttachment(file.id)} className="text-[#73839f] hover:text-[#b14343]" aria-label={`Remove ${file.name}`}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handlePickAttachments}
            className="h-[44px] w-[44px] rounded-[12px] border border-[#d3def5] text-[#475a7d] hover:bg-[#f4f8ff] inline-flex items-center justify-center"
            title="Attach image or document"
          >
            <Paperclip size={16} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Knowlab AI about SOPs, tests, CAPA, competency, or staffing insights..."
            className="flex-1 h-[44px] bg-[#f4f8ff] border border-[#d3def5] rounded-[12px] px-4 text-[14px] text-[#11203b] placeholder:text-[#73839f] focus:outline-none focus:border-[#1c5eff]"
          />
          <button
            type="submit"
            disabled={(!input.trim() && queuedAttachments.length === 0) || isTyping}
            className="h-[44px] min-w-[44px] rounded-[12px] px-4 bg-[#1c5eff] hover:bg-[#1548e8] text-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}



