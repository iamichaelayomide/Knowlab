import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  BookSaved as BookOpenCheck,
  Clock as Clock3,
  Gallery as FileImage,
  DocumentText as FileText,
  Archive as History,
  Paperclip,
  Add as Plus,
  Send2 as Send,
  MagicStar as Sparkles,
  User,
  CloseCircle as X,
  ArchiveTick,
  Star1,
  Trash,
} from 'iconsax-react';
import { JOB_AIDS, LAB_TESTS, SOPS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useDepartment } from '../../context/DepartmentContext';
import { askKnowledgeAssistant, type AssistantAttachment, type AssistantSource } from '../../services/aiAssistant';
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
  'What should I do if QC fails twice?',
  'Summarize the held patient results in my current scope.',
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

function fileKind(file: File): AssistantAttachment['kind'] {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'document';
}

function readFileAsAttachment(file: File): Promise<AssistantAttachment & { type: string; previewUrl?: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const dataBase64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      const kind = fileKind(file);
      resolve({
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        mimeType: file.type || 'application/octet-stream',
        kind,
        dataBase64,
        previewUrl: kind === 'image' ? dataUrl : undefined,
      });
    };
    reader.readAsDataURL(file);
  });
}

function buildWelcomeMessage(name?: string) {
  return makeWelcomeMessage(
    `Hi ${name?.split(' ')[0] ?? 'there'} - I'm Knowlab AI.\n\n` +
      'Ask me about a test, SOP, QC issue, patient result, image, PDF, or lab operations question.',
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
  const active = sessions.filter((session) => !session.archivedAt);
  const archived = sessions.filter((session) => session.archivedAt);
  const byPriority = (a: AiChatSession, b: AiChatSession) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  };
  return [...active.sort(byPriority).slice(0, MAX_SESSIONS), ...archived.sort(byPriority)];
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
  const [queuedAttachments, setQueuedAttachments] = useState<(AssistantAttachment & { type: string; previewUrl?: string })[]>([]);
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [liveReply, setLiveReply] = useState<LiveReply | null>(null);

  const base = useMemo(() => {
    if (location.pathname.startsWith('/supervisor')) return '/supervisor';
    if (location.pathname.startsWith('/hod')) return '/hod';
    return '/staff';
  }, [location.pathname]);

  const storageKey = useMemo(() => getAiChatStorageKey(user?.id, base), [base, user?.id]);
  const legacyKey = useMemo(() => `knowlab_ai_history_${user?.id || 'anon'}_${base.replace('/', '')}`, [base, user?.id]);
  const welcomeFactory = useMemo(() => () => buildWelcomeMessage(user?.name), [user?.name]);

  const visibleSessions = useMemo(() => sessions.filter((session) => (showArchived ? !!session.archivedAt : !session.archivedAt)), [sessions, showArchived]);
  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? sessions.find((session) => !session.archivedAt) ?? sessions[0],
    [activeSessionId, sessions],
  );
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
      setActiveSessionId((nextSessions.find((session) => !session.archivedAt) ?? nextSessions[0]).id);
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
      const to = base === '/hod' ? `${base}/reports` : `${base}/qc-log`;
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

  const togglePinSession = (sessionId: string) => {
    setSessions((prev) => sortSessions(prev.map((session) => (session.id === sessionId ? { ...session, pinned: !session.pinned } : session))));
  };

  const archiveSession = (sessionId: string) => {
    cancelCurrentStream();
    const archivedAt = new Date().toISOString();
    const next = sortSessions(sessions.map((session) => (session.id === sessionId ? { ...session, archivedAt, updatedAt: archivedAt } : session)));
    setSessions(next);
    if (activeSessionId === sessionId) {
      setActiveSessionId((next.find((session) => !session.archivedAt) ?? next[0])?.id ?? '');
    }
  };

  const restoreSession = (sessionId: string) => {
    const restoredAt = new Date().toISOString();
    const next = sortSessions(
      sessions.map((session) => (session.id === sessionId ? { ...session, archivedAt: undefined, updatedAt: restoredAt } : session)),
    );
    setSessions(next);
    setShowArchived(false);
    setActiveSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    cancelCurrentStream();
    const next = sortSessions(sessions.filter((session) => session.id !== sessionId));
    if (next.length) {
      setSessions(next);
      if (activeSessionId === sessionId) setActiveSessionId((next.find((session) => !session.archivedAt) ?? next[0]).id);
      return;
    }

    const session = createChatSession(`chat_${Date.now()}`, welcomeFactory());
    setSessions([session]);
    setActiveSessionId(session.id);
    setShowArchived(false);
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

    try {
      const result = await askKnowledgeAssistant({
        query: contentText,
        role: user.role,
        unit: user.unit,
        department: activeDepartment.name,
        bench: activeBench.name,
        conversation,
        context: { page: 'Full AI chat' },
        attachments: queuedAttachments.map((attachment) => ({
          id: attachment.id,
          name: attachment.name,
          size: attachment.size,
          mimeType: attachment.mimeType,
          kind: attachment.kind,
          dataBase64: attachment.dataBase64,
        })),
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
            <p className="text-[var(--kl-text-muted)] text-[11px]">Files are used only for the current answer.</p>
          </div>
          <button
            onClick={newChat}
            className="btn-primary inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12px] font-medium text-white"
          >
            <Plus size={14} />
            New
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface-raised)] p-1">
          <button
            type="button"
            onClick={() => setShowArchived(false)}
            className={`h-7 rounded-full text-[11px] font-medium transition-all ${!showArchived ? 'bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'}`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setShowArchived(true)}
            className={`h-7 rounded-full text-[11px] font-medium transition-all ${showArchived ? 'bg-[var(--surface-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'}`}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {visibleSessions.map((session) => {
          const active = session.id === activeSessionId;
          return (
            <div
              key={session.id}
              onContextMenu={(event) => {
                event.preventDefault();
                if (session.archivedAt) restoreSession(session.id);
                else archiveSession(session.id);
              }}
              className={`group rounded-[22px] border px-2.5 py-2.5 transition-all ${
                active
                  ? 'kl-selected-muted'
                  : 'border-[var(--surface-border)] bg-[var(--surface-raised)] hover:bg-[var(--surface-card)]'
              }`}
            >
              <div className="flex items-start gap-2">
                <button type="button" onClick={() => selectSession(session.id)} className="min-w-0 flex-1 text-left">
                  <span className="flex items-center gap-1.5">
                    {session.pinned && <Star1 size={12} className="shrink-0 text-[var(--text-primary)]" variant="Bold" />}
                    <span className="kl-one-line text-[13px] font-semibold text-[var(--kl-text)]">{session.title}</span>
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-[var(--kl-text-muted)] line-clamp-2">{previewMessage(session.messages)}</span>
                  <span className="mt-2 flex items-center gap-1 text-[10px] text-[var(--kl-text-muted)]">
                    <Clock3 size={12} />
                    {formatSessionTime(session.updatedAt)}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5 opacity-80 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => togglePinSession(session.id)}
                    className="kl-icon-button !min-h-7 !min-w-7 rounded-full text-[var(--text-secondary)]"
                    aria-label={session.pinned ? 'Unpin chat' : 'Pin chat'}
                    title={session.pinned ? 'Unpin chat' : 'Pin chat'}
                  >
                    <Star1 size={13} variant={session.pinned ? 'Bold' : 'Linear'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => (session.archivedAt ? restoreSession(session.id) : archiveSession(session.id))}
                    className="kl-icon-button !min-h-7 !min-w-7 rounded-full text-[var(--text-secondary)]"
                    aria-label={session.archivedAt ? 'Restore chat' : 'Archive chat'}
                    title={session.archivedAt ? 'Restore chat' : 'Archive chat'}
                  >
                    <ArchiveTick size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSession(session.id)}
                    className="kl-icon-button !min-h-7 !min-w-7 rounded-full text-[var(--text-secondary)] hover:text-[#b14343]"
                    aria-label="Delete chat"
                    title="Delete chat"
                  >
                    <Trash size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {!visibleSessions.length && (
          <div className="rounded-[22px] border border-dashed border-[var(--surface-border)] p-4 text-center text-[12px] text-[var(--text-secondary)]">
            {showArchived ? 'No archived chats yet.' : 'No active chats yet.'}
          </div>
        )}
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
        <div className="shrink-0 px-3 sm:px-6 py-4 border-b border-[var(--surface-border)] bg-[var(--surface-card)]">
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
                  msg.role === 'assistant' ? 'bg-[linear-gradient(180deg,#2b2b2b,#080808)] dark:bg-[rgba(255,255,255,0.10)]' : 'bg-[linear-gradient(180deg,#3a3a3a,#121212)] dark:bg-[rgba(255,255,255,0.10)]'
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
                <div className="kl-ai-message text-[13px] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                  {msg.role === 'assistant' && msg.streaming && msg.content && (
                    <span className="ml-0.5 inline-block h-[1em] w-[0.5em] align-[-0.08em] rounded-[1px] bg-current animate-pulse" />
                  )}
                </div>

                {msg.role === 'assistant' && msg.streaming && !msg.content && (
                  <div className="mt-1.5 flex h-4 items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-primary)] animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-primary)] animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-primary)] animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                )}

                {msg.role === 'user' && !!msg.attachments?.length && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.attachments.map((file) => (
                      <span
                        key={file.id}
                        className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-[rgba(255,255,255,0.18)] px-2.5 py-1 text-[11px] text-white"
                      >
                        {file.type.startsWith('image/') ? <FileImage size={11} /> : <FileText size={11} />}
                        <span className="truncate">{file.name}</span>
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
                              className={`kl-filter-pill inline-flex items-center gap-1 bg-[var(--kl-surface-tinted)] text-[var(--text-primary)] text-[11px] px-2.5 py-1 rounded-full ${
                                target ? 'hover:bg-[var(--surface-raised)]' : 'opacity-60 cursor-not-allowed'
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
                    className="kl-filter-pill max-w-full whitespace-normal bg-[var(--surface-card)] border border-[var(--surface-border)] text-left text-[12px] text-[var(--text-secondary)] px-3 py-1.5 rounded-full hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
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
                  className="kl-upload-control inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface-raised)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]"
                >
                  {file.type.startsWith('image/') ? <FileImage size={11} /> : <FileText size={11} />}
                  <span className="max-w-[180px] truncate">{file.name}</span>
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

                void Promise.all(files.slice(0, MAX_ATTACHMENTS - queuedAttachments.length).map(readFileAsAttachment)).then((mapped) => {
                  setQueuedAttachments((prev) => [...prev, ...mapped]);
                });
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
              placeholder="Ask Knowlab AI about SOPs, tests, QC, patients, images, or PDFs..."
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
