import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppIcon } from "../icons/AppIcon";
import { useAuth } from "../../context/AuthContext";
import { useDepartment } from "../../context/DepartmentContext";
import { JOB_AIDS, LAB_TESTS, SOPS } from "../../data/mockData";
import { getOpenFloatingAIEventName } from "../../services/aiWidget";
import {
  askKnowledgeAssistant,
  type AssistantMode,
  type AssistantQuickAction,
  type AssistantSource,
} from "../../services/aiAssistant";
import { TEXT_TOKENS } from "../../utils/textTokens";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: AssistantSource[];
  mode?: AssistantMode;
  accessDenied?: boolean;
  quickActions?: AssistantQuickAction[];
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function confidenceLabel(v?: number) {
  if (!v) return "Unscored confidence";
  if (v >= 0.8) return "High confidence";
  if (v >= 0.55) return "Medium confidence";
  return "Low confidence";
}

function modeLabel(mode?: AssistantMode) {
  if (mode === "clarify") return "Clarification needed";
  if (mode === "denied") return "Access scoped";
  if (mode === "teaching") return "Teaching mode";
  return "Direct answer";
}

export default function FloatingAIWidget() {
  const { user } = useAuth();
  const { activeDepartment, activeBench } = useDepartment();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const base = useMemo(() => {
    if (location.pathname.startsWith("/supervisor")) return "/supervisor";
    if (location.pathname.startsWith("/hod")) return "/hod";
    return "/staff";
  }, [location.pathname]);

  const historyKey = useMemo(
    () => `knowlab_floating_ai_${user?.id || "anon"}_${base.replace("/", "")}`,
    [user?.id, base],
  );

  const quickCards = useMemo(() => {
    if (!user) return [];
    if (user.role === "staff") {
      return [
        "Teach me this SOP step by step with practical checkpoints.",
        "What sample type, tube, and turnaround should I expect for this test?",
        "Can you break this into beginner, intermediate, and advanced levels?",
      ];
    }
    if (user.role === "supervisor") {
      return [
        "Who is below 80% competency in this bench and why?",
        "Summarize CAPA priorities with next actions for this unit.",
        "Prepare a coaching checklist for today's shift handover.",
      ];
    }
    return [
      "Summarize department risk signals and top interventions this week.",
      "Which units need immediate training escalation and why?",
      "Give me an executive-ready SOP/CAPA status narrative.",
    ];
  }, [user]);

  useEffect(() => {
    const raw = localStorage.getItem(historyKey);
    if (raw) {
      try {
        setMessages(JSON.parse(raw) as ChatMessage[]);
        return;
      } catch {
        // no-op
      }
    }
    setMessages([
      {
        id: "f_welcome",
        role: "assistant",
        content:
          "Hi. I'm your Knowlab assistant.\n\nAsk me about a test, SOP, or lab workflow, and I'll answer with the closest verified guidance.",
        timestamp: new Date().toISOString(),
        confidence: 0.96,
        mode: "teaching",
      },
    ]);
  }, [historyKey]);

  useEffect(() => {
    localStorage.setItem(historyKey, JSON.stringify(messages));
  }, [historyKey, messages]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    const eventName = getOpenFloatingAIEventName();
    const handler = (evt: Event) => {
      const detail = (evt as CustomEvent<{ prefill?: string }>).detail;
      if (detail?.prefill) setInput(detail.prefill);
      setOpen(true);
    };
    window.addEventListener(eventName, handler as EventListener);
    return () => window.removeEventListener(eventName, handler as EventListener);
  }, []);

  if (!user) return null;

  const resolveSourceTarget = (source: AssistantSource) => {
    const sourceIdNorm = normalizeText(source.id);
    const sourceTitleNorm = normalizeText(source.title);

    if (source.type === "sop") {
      const sop =
        SOPS.find((s) => normalizeText(s.code) === sourceIdNorm) ??
        SOPS.find(
          (s) => normalizeText(s.title).includes(sourceTitleNorm) || sourceTitleNorm.includes(normalizeText(s.title)),
        );
      if (sop) return `${base}/sops/${sop.id}`;
    }

    if (source.type === "test") {
      const test =
        LAB_TESTS.find((t) => normalizeText(t.code) === sourceIdNorm) ??
        LAB_TESTS.find(
          (t) => normalizeText(t.name).includes(sourceTitleNorm) || sourceTitleNorm.includes(normalizeText(t.name)),
        );
      if (test) return `${base}/tests/${test.id}`;
    }

    if (source.type === "job_aid") {
      const aid = JOB_AIDS.find(
        (j) => normalizeText(j.title).includes(sourceTitleNorm) || sourceTitleNorm.includes(normalizeText(j.title)),
      );
      return `${base}/job-aids?q=${encodeURIComponent(aid?.title || source.title)}`;
    }

    if (source.type === "ops") {
      return base === "/hod" ? `${base}/reports` : `${base}/capa`;
    }

    return null;
  };

  const resolveQuickAction = (action: AssistantQuickAction) => {
    if (action.path) {
      if (action.path.startsWith("/staff") || action.path.startsWith("/supervisor") || action.path.startsWith("/hod")) {
        return action.path;
      }
      if (action.path.startsWith("/")) return `${base}${action.path}`;
      return `${base}/${action.path}`;
    }
    if (action.source) return resolveSourceTarget(action.source);
    return null;
  };

  const send = async (draft?: string) => {
    const payload = (draft ?? input).trim();
    if (!payload || loading) return;
    setInput("");

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: payload,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const result = await askKnowledgeAssistant({
      query: payload,
      role: user.role,
      unit: user.unit,
      department: activeDepartment.name,
      bench: activeBench.name,
    });

    const aiMessage: ChatMessage = {
      id: `a_${Date.now()}`,
      role: "assistant",
      content: result.answer,
      timestamp: new Date().toISOString(),
      confidence: result.confidence,
      sources: result.sources,
      mode: result.mode,
      accessDenied: result.accessDenied,
      quickActions: result.quickActions,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="ask-ai-fab fixed z-40 right-4 sm:right-6 inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.75)] bg-[rgba(255,255,255,0.55)] px-5 text-[14px] font-semibold tracking-[-0.01em] text-[var(--accent-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.90),0_8px_32px_rgba(58,110,232,0.18),0_2px_8px_rgba(0,0,0,0.10)] backdrop-blur-2xl transition-all duration-base ease-spring hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_12px_40px_rgba(58,110,232,0.25),0_4px_12px_rgba(0,0,0,0.12)] active:scale-[0.97] dark:border-[rgba(255,255,255,0.12)] dark:bg-[rgba(255,255,255,0.07)] dark:text-[#93c5fd] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.50)]"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 14px)" }}
        >
          <AppIcon name="ai" size={16} />
          <span className="text-[13px] font-semibold">Ask AI</span>
        </button>
      )}

      {open && (
        <div
          className="fixed z-50 inset-x-3 sm:inset-x-auto sm:right-6 bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-2xl shadow-xl backdrop-blur-2xl flex flex-col overflow-hidden sm:w-[410px]"
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + 12px)",
            height: "min(72dvh, 680px)",
          }}
        >
          <div className="shrink-0 px-4 py-3 border-b border-[var(--surface-border)] bg-[var(--surface-raised)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[#6366f1] rounded-[10px] p-1.5 shadow-[0_4px_14px_var(--accent-glow)]">
                <AppIcon name="ai" size={14} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[var(--text-primary)] text-[13px] font-semibold truncate">Knowlab AI</p>
                <p className="text-[var(--text-secondary)] text-[11px] truncate">
                  {activeDepartment.shortName}
                  {TEXT_TOKENS.separator}
                  {activeBench.shortName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate(`${base}/ai-assistant/legacy`)}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] rounded-sm px-2 py-1 text-[11px] font-medium border border-[var(--surface-border)] bg-[var(--glass-bg)]"
              >
                Full chat
              </button>
              <button onClick={() => setOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] rounded-sm p-1 hover:bg-[var(--surface-base)]">
                <AppIcon name="close" size={14} />
              </button>
            </div>
          </div>

          <div className="shrink-0 border-b border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {quickCards.map((card) => (
                <button
                  key={card}
                  onClick={() => void send(card)}
                  className="text-left rounded-md border border-[var(--surface-border)] bg-[var(--accent-glow)] px-2.5 py-2 transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--surface-card)]"
                >
                  <p className="text-[11px] text-[var(--text-primary)] leading-snug">{card}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[var(--surface-base)] min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-[14px] px-3 py-2 ${
                    msg.role === "user"
                      ? "bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-primary-hover))] text-white shadow-sm"
                      : "bg-[var(--surface-card)] border border-[var(--surface-border)] text-[var(--text-primary)] shadow-xs"
                  }`}
                >
                  <p className="text-[12px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                  {msg.role === "assistant" && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        {modeLabel(msg.mode)}
                        {TEXT_TOKENS.separator}
                        {confidenceLabel(msg.confidence)}
                        {TEXT_TOKENS.separator}
                        {(msg.confidence ?? 0).toFixed(2)}
                      </p>
                      {msg.accessDenied && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-[#fff0db] text-[#9a6115] px-2 py-0.5 text-[10px]">
                          <AppIcon name="warning" size={10} />
                          Access limited by role scope
                        </div>
                      )}
                      {!!msg.sources?.length && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src) => {
                            const to = resolveSourceTarget(src);
                            return (
                              <button
                                key={`${msg.id}_${src.id}_${src.title}`}
                                disabled={!to}
                                onClick={() => {
                                  if (!to) return;
                                  navigate(to, { state: { fromAi: true, sourceTitle: src.title } });
                                  setOpen(false);
                                }}
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
                                  to ? "bg-[var(--accent-glow)] text-[var(--accent-primary)]" : "bg-[var(--surface-raised)] text-[var(--text-tertiary)]"
                                }`}
                              >
                                <AppIcon name="sops" size={10} />
                                {src.title}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {!!msg.quickActions?.length && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.quickActions.map((action) => {
                            const target = resolveQuickAction(action);
                            return (
                              <button
                                key={`${msg.id}_${action.label}`}
                                disabled={!target}
                                onClick={() => {
                                  if (!target) return;
                                  navigate(target, { state: { fromAi: true } });
                                  setOpen(false);
                                }}
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] bg-[rgba(52,199,89,0.12)] text-[var(--success)] disabled:opacity-50"
                              >
                                <AppIcon name="arrowRight" size={10} />
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="inline-flex items-center gap-2 bg-[var(--surface-card)] border border-[var(--surface-border)] text-[var(--text-secondary)] text-[11px] rounded-md px-3 py-2">
                <AppIcon name="ai" size={12} />
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            className="shrink-0 border-t border-[var(--surface-border)] bg-[var(--surface-card)] p-2.5 flex items-end gap-2"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask about SOPs, tests, CAPA, competency, training..."
              className="input flex-1 h-[40px] rounded-md border border-[var(--surface-border-strong)] bg-[var(--surface-base)] px-3 text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
            <button
              onClick={() => void send()}
              disabled={!input.trim() || loading}
              className="btn-primary h-[40px] w-[40px] rounded-md p-0 inline-flex items-center justify-center disabled:opacity-40"
            >
              <AppIcon name="send" size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
