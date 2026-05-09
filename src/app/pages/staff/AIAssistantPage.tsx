import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { BookOpenCheck, Clock3, FileImage, FileText, History, Paperclip, Plus, Send, Sparkles, User, X } from 'lucide-react';
import { JOB_AIDS, LAB_TESTS, SOPS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { askKnowledgeAssistant, type AssistantSource } from '../../services/aiAssistant';
import {
  createChatSession,
  deriveChatTitle,
  getAiChatStorageKey,
  makeWelcomeMessage,
  normalizeSessions,
  seedSessionsFromMessages,
  type AiChatMessage,
  type AiChatSession,
} from '../../services/aiChatHistory';

const QUICK_PROMPTS = [
  'Can you show me the glucose reference range?',
  'Which tube and ratio should I use for PT and APTT?',
  'What CAPA item should I look at next?',
  'Who is below 80% competency in this bench?',
];

const MAX_ATTACHMENTS = 6;
const MAX_SESSIONS = 12;

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function confidenceLabel(v?: number) {
  if (!v) return 'Unscored confidence';
  if (v >= 0.8) return 'High confidence';
  if (v >= 0.55) return 'Medium confidence';
  return 'Low confidence';
}

function splitStreamChunks(text: string) {
  const tokens = text.match(/\S+\s*/g) ?? [text];
  return tokens.flatMap((token) => {
    if (token.length <= 28) return [token];
    return token.match(/\S+\s*/g) ?? [token];
  });
}

function streamDelayMs(chunk: string) {
  const trimmed = chunk.trim();
  if (!trimmed) return 8;
  if (/[.!?]$/.test(trimmed)) return 38;
  return Math.max(12, Math.min(34, 8 + trimmed.length * 2));
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function buildWelcomeMessage(name?: string) {
  return makeWelcomeMessage(
    `Hi ${name?.split(' ')[0] ?? 'there'} - I'm Knowlab AI.\n\n` +
      'Ask me about a test, SOP, training item, or lab ops question, and I will answer with the closest verified source.',
  );
}

function formatSessionTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function previewMessage(messages: AiChatMessage[]) {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  const lastAssistant = [...messages].reverse().find((message) => message.role === 'assistant');
  const source = lastUser?.content || lastAssistant?.content || 'New chat';
  return source.replace(/\s+/g, ' ').trim().slice(0, 84);
}

function sortSessions(sessions: AiChatSession[]) {
  return [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, MAX_SESSIONS);
}

type LiveReply = AiChatMessage & { sessionId: string };

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const location = useLocation();
  const navigate = useNavigate();
  const consumedPrefillRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hydratedRef = useRef(false);
  const streamRunRef = useRef(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [queuedAttachments, setQueuedAttachments] = useState<{ id: string; name: string; size: number; type: string }[]>([]);
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [liveReply, setLiveReply] = useState<LiveReply | null>(null);

  const base = useMemo(() => {
    if (location.pathname.startsWith('/supervisor')) return '/supervisor';
    if (location.pathname.startsWith('/hod')) return '/hod';
    return '/staff';
  }, [location.pathname]);

  const storageKey = useMemo(() => getAiChatStorageKey(user?.id, base), [base, user?.id]);
  const legacyKey = useMemo(() => `knowlab_ai_history_${user?.id || 'anon'}_${base.replace('/', '')}`, [base, user?.id]);
  const welcomeFactory = useMemo(() => () => buildWelcomeMessage(user?.name), [user?.name]);

  const activeSession = useMemo(() => sessions.find((session) => session.id === activeSessionId) ?? sessions[0], [activeSessionId, sessions]);
  const currentMessages = activeSession?.messages ?? [];
  const displayMessages = useMemo(() => {
    if (!liveReply || liveReply.sessionId !== activeSessionId) return currentMessages;
    if (currentMessages.some((message) => message.id === liveReply.id)) return currentMessages;
    return [...currentMessages, liveReply];
  }, [activeSessionId, currentMessages, liveReply]);

  const cancelCurrentStream = () => {
    streamRunRef.current += 1;
    setIsTyping(false);
    setLiveReply(null);
  };

  useEffect(() => {
    hydratedRef.current = false;

    const readSessions = (raw: string | null) => {
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed) || parsed.length === 0) return [];
        if (typeof parsed[0] === 'object' && parsed[0] !== null && 'messages' in parsed[0]) {
          return normalizeSessions(parsed, welcomeFactory);
        }
        return seedSessionsFromMessages(parsed as AiChatMessage[], welcomeFactory);
      } catch {
        return [];
      }
    };

    const storedSessions = readSessions(localStorage.getItem(storageKey));
    const legacySessions = storedSessions.length ? [] : readSessions(localStorage.getItem(legacyKey));
    const nextSessions = sortSessions(storedSessions.length ? storedSessions : legacySessions);

    if (nextSessions.length > 0) {
      setSessions(nextSessions);
      setActiveSessionId(nextSessions[0].id);
    } else {
      const welcomeSession = createChatSession(`chat_${Date.now()}`, welcomeFactory());
      setSessions([welcomeSession]);
      setActiveSessionId(welcomeSession.id);
    }

    hydratedRef.current = true;
  }, [legacyKey, storageKey, welcomeFactory]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    localStorage.setItem(storageKey, JSON.stringify(sessions));
  }, [sessions, storageKey]);

  useEffect(() => {
    const prefill = (location.state as { prefill?: string } | null)?.prefill?.trim();
    if (!prefill) return;
    if (consumedPrefillRef.current === prefill) return;
    setInput(prefill);
    consumedPrefillRef.current = prefill;
  }, [location.state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping, liveReply?.content, liveReply?.id]);

  useEffect(() => {
    setHistoryOpen(false);
  }, [base]);

  useEffect(() => {
    return () => {
      streamRunRef.current += 1;
    };
  }, []);

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
      const aid = JOB_AIDS.find((j) => normalizeText(j.title).includes(sourceTitleNorm) || sourceTitleNorm.includes(normalizeText(j.title)));
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

  const selectSession = (sessionId: string) => {
    cancelCurrentStream();
    setActiveSessionId(sessionId);
    setHistoryOpen(false);
  };

  const newChat = () => {
    cancelCurrentStream();
    const session = createChatSession(`chat_${Date.now()}`, welcomeFactory());
    setSessions((prev) => sortSessions([session, ...prev.filter((item) => item.id !== session.id)]));
    setActiveSessionId(session.id);
    setInput('');
    setQueuedAttachments([]);
    setHistoryOpen(false);
  };

  const updateSession = (sessionId: string, updater: (session: AiChatSession) => AiChatSession) => {
    setSessions((prev) => sortSessions(prev.map((session) => (session.id === sessionId ? updater(session) : session))));
  };

  const send = async (text: string) => {
    if ((!text.trim() && queuedAttachments.length === 0) || !user || !activeSession || isTyping) return;

    const sessionId = activeSession.id;
    const contentText = text.trim() || 'Please review the attached files and summarize the relevant SOP or test guidance.';
    const now = new Date().toISOString();
    const assistantId = `a_${Date.now()}`;
    const runId = ++streamRunRef.current;

    const userMsg: AiChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: contentText,
      timestamp: now,
      attachments: queuedAttachments.length ? [...queuedAttachments] : undefined,
    };

    const conversation = [...currentMessages, userMsg]
      .filter((message) => message.id !== 'hello')
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content: message.content,
      })) as Array<{ role: 'user' | 'assistant'; content: string }>;

    updateSession(sessionId, (session) => {
      const nextMessages = [...session.messages, userMsg];
      return {
        ...session,
        title: session.title === 'New chat' ? deriveChatTitle(nextMessages) : session.title,
        updatedAt: now,
        messages: nextMessages,
      };
    });

    setInput('');
    setQueuedAttachments([]);
    setIsTyping(true);
    setLiveReply({
      sessionId,
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: now,
      streaming: true,
    });

    const attachmentHint = userMsg.attachments?.length
      ? `\n\nAttached materials provided by user: ${userMsg.attachments.map((a) => a.name).join(', ')}.`
      : '';

    try {
      const result = await askKnowledgeAssistant({
        query: `${contentText}${attachmentHint}`,
        role: user.role,
        unit: user.unit,
        department: activeDepartment.name,
        bench: activeBench.name,
        conversation,
      });

      if (streamRunRef.current !== runId) return;

      const chunks = splitStreamChunks(result.answer || 'No answer generated.');
      let rendered = '';

      for (const chunk of chunks) {
        if (streamRunRef.current !== runId) return;
        rendered += chunk;
        setLiveReply((current) =>
          current && current.id === assistantId && current.sessionId === sessionId
            ? { ...current, content: rendered }
            : current,
        );
        await new Promise((resolve) => setTimeout(resolve, streamDelayMs(chunk)));
      }

      const finalizedAt = new Date().toISOString();
      const assistantMsg: AiChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: result.answer || rendered,
        timestamp: finalizedAt,
        confidence: result.confidence,
        sources: result.sources,
        mode: result.mode,
        accessDenied: result.accessDenied,
        quickActions: result.quickActions,
      };

      updateSession(sessionId, (session) => ({
        ...session,
        updatedAt: finalizedAt,
        messages: [...session.messages, assistantMsg],
      }));
    } catch {
      if (streamRunRef.current === runId) {
        const fallbackAnswer = 'I could not generate a response just now. Please try again.';
        const finalizedAt = new Date().toISOString();
        const assistantMsg: AiChatMessage = {
          id: assistantId,
          role: 'assistant',
          content: fallbackAnswer,
          timestamp: finalizedAt,
          confidence: 0.2,
          sources: [],
          mode: 'clarify',
        };

        setLiveReply((current) =>
          current && current.id === assistantId && current.sessionId === sessionId
            ? { ...current, content: fallbackAnswer, streaming: false }
            : current,
        );

        updateSession(sessionId, (session) => ({
          ...session,
          updatedAt: finalizedAt,
          messages: [...session.messages, assistantMsg],
        }));
      }
    } finally {
      if (streamRunRef.current === runId) {
        setIsTyping(false);
        setLiveReply(null);
      }
    }
  };

  if (!user) return null;

  const sidebar = (
    <aside className="w-[320px] shrink-0 border-r border-[var(--surface-border)] bg-[var(--surface-card)] flex flex-col">
      <div className="px-4 py-4 border-b border-[var(--kl-border)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[var(--kl-text)] font-semibold text-[14px]">Chat history</p>
            <p className="text-[var(--kl-text-muted)] text-[11px]">Old chats stay here until you clear the browser data.</p>
          </div>
          <button
            onClick={newChat}
            className="btn-primary inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-white"
          >
            <Plus size={14} />
            New chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sessions.map((session) => {
          const active = session.id === activeSessionId;
          return (
            <button
              key={session.id}
              onClick={() => selectSession(session.id)}
              className={`kl-card-interactive w-full text-left rounded-[22px] border px-3 py-3 transition-all ${
                active
                  ? 'kl-selected border-[var(--accent-blue)] bg-[var(--accent-glow)]'
                  : 'border-[var(--surface-border)] bg-[var(--surface-raised)] hover:bg-[var(--surface-card)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--kl-text)] truncate">{session.title}</p>
                  <p className="text-[11px] text-[var(--kl-text-muted)] mt-1 line-clamp-2">{previewMessage(session.messages)}</p>
                </div>
                <Clock3 size={13} className="text-[var(--kl-text-muted)] shrink-0 mt-0.5" />
              </div>
              <p className="text-[10px] text-[var(--kl-text-muted)] mt-2">{formatSessionTime(session.updatedAt)}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );

  return (
    <div className="h-[calc(100dvh-68px)] max-h-[calc(100dvh-68px)] flex overflow-hidden bg-[var(--surface-base)]">
      <div className="hidden lg:flex">{sidebar}</div>

      {historyOpen && (
        <div className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={() => setHistoryOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-[86vw] max-w-[320px] bg-[var(--surface-card)] shadow-[var(--shadow-xl)]"
            onClick={(event) => event.stopPropagation()}
          >
            {sidebar}
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        <div className="shrink-0 px-3 sm:px-6 py-4 border-b border-[var(--surface-border)] bg-[var(--surface-overlay)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-[linear-gradient(180deg,#2b2b2b,#080808)] rounded-[18px] p-2.5 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_22px_rgba(0,0,0,0.2)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.07))]">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-[var(--kl-text)] font-semibold text-[17px] sm:text-[18px] truncate">Knowlab AI</h1>
                <p className="text-[var(--kl-text-muted)] text-[11px] sm:text-[12px] truncate">Knowledge + operations assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHistoryOpen(true)}
                className="kl-button-soft lg:hidden inline-flex h-9 items-center gap-1.5 text-[var(--text-secondary)] text-[12px] font-medium border border-[var(--surface-border)] rounded-full px-3 hover:bg-[var(--surface-raised)]"
              >
                <History size={14} />
                History
              </button>
              <button
                onClick={newChat}
                className="kl-button-soft inline-flex h-9 items-center gap-1.5 text-[var(--text-secondary)] text-[12px] font-medium border border-[var(--surface-border)] rounded-full px-3 hover:bg-[var(--surface-raised)]"
              >
                <Plus size={14} />
                New chat
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
          {displayMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-[linear-gradient(180deg,#2b2b2b,#080808)] dark:bg-[rgba(255,255,255,0.10)]' : 'bg-[#11203b] dark:bg-[rgba(255,255,255,0.10)]'
                }`}
              >
                {msg.role === 'assistant' ? <Sparkles size={14} className="text-white" /> : <User size={14} className="text-white" />}
              </div>

              <div
                className={`kl-ai-message max-w-[95%] sm:max-w-[86%] px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[linear-gradient(180deg,#242424,#050505)] text-white rounded-tr-[8px] dark:bg-[rgba(255,255,255,0.10)] dark:text-[var(--text-primary)]'
                    : 'bg-[var(--surface-card)] border border-[var(--surface-border)] text-[var(--text-primary)] rounded-tl-[8px]'
                }`}
              >
                <div className="text-[13px] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                  {msg.role === 'assistant' && msg.streaming && msg.content && (
                    <span className="ml-0.5 inline-block h-[1em] w-[0.5em] align-[-0.08em] rounded-[1px] bg-current animate-pulse" />
                  )}
                </div>

                {msg.role === 'assistant' && msg.streaming && !msg.content && (
                  <div className="mt-1.5 flex h-4 items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                )}

                {msg.role === 'user' && !!msg.attachments?.length && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.attachments.map((file) => (
                      <span
                        key={file.id}
                        className="inline-flex items-center gap-1.5 bg-[rgba(255,255,255,0.18)] text-white text-[11px] px-2.5 py-1 rounded-full"
                      >
                        {file.type.startsWith('image/') ? <FileImage size={11} /> : <FileText size={11} />}
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}

                {msg.role === 'assistant' && !msg.streaming && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[10px] text-[var(--kl-text-muted)]">
                      {confidenceLabel(msg.confidence)}
                      {' · '}
                      {(msg.confidence ?? 0).toFixed(2)}
                    </p>

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
                              className={`kl-filter-pill inline-flex items-center gap-1 bg-[#eef5ff] text-[#1c5eff] text-[11px] px-2.5 py-1 rounded-full ${
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

                <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-[var(--kl-text-muted)]'}`}>
                  {formatSessionTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {!liveReply && displayMessages.length <= 2 && (
            <div className="pt-2">
              <p className="text-[var(--kl-text-muted)] text-[11px] font-semibold uppercase tracking-[0.8px] mb-2">Try asking</p>
              <div className="flex gap-2 flex-wrap">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void send(prompt)}
                    className="kl-filter-pill bg-[var(--surface-card)] border border-[var(--surface-border)] text-[var(--text-secondary)] text-[12px] px-3 py-1.5 rounded-full hover:bg-[var(--surface-raised)] hover:text-[var(--accent-blue)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-[var(--surface-border)] bg-[var(--surface-card)] px-3 sm:px-4 py-3">
          {!!queuedAttachments.length && (
            <div className="flex flex-wrap gap-2 mb-3">
              {queuedAttachments.map((file) => (
                <span
                  key={file.id}
                  className="kl-upload-control inline-flex items-center gap-1.5 bg-[var(--surface-raised)] text-[var(--text-secondary)] text-[11px] px-2.5 py-1 rounded-full border border-[var(--surface-border)]"
                >
                  {file.type.startsWith('image/') ? <FileImage size={11} /> : <FileText size={11} />}
                  <span>{file.name}</span>
                  <span className="text-[var(--kl-text-muted)]">({formatBytes(file.size)})</span>
                  <button
                    onClick={() => setQueuedAttachments((prev) => prev.filter((item) => item.id !== file.id))}
                    className="kl-icon-button !min-h-6 !min-w-6 text-[var(--text-secondary)] hover:text-[#b14343] dark:text-[#fca5a5]"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="kl-ai-composer flex items-end gap-2 p-1.5"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.webp"
              multiple
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="kl-icon-button h-[44px] w-[44px] rounded-full border border-[var(--surface-border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] inline-flex items-center justify-center"
              title="Attach image or document"
              aria-label="Attach image or document"
            >
              <Paperclip size={16} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Knowlab AI about SOPs, tests, definitions, CAPA, competency, or staffing..."
              className="input flex-1 h-[44px] bg-transparent border-transparent rounded-full px-4 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-transparent focus:shadow-none"
            />
            <button
              type="submit"
              disabled={(!input.trim() && queuedAttachments.length === 0) || isTyping}
              className="btn-primary h-[44px] min-w-[44px] rounded-full px-4 text-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
