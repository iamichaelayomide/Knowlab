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
        "What sample type, tube, and turnaround apply to this bench test?",
        "Break this topic into beginner, intermediate, and advanced understanding.",
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
          "Hi. I am your Knowlab assistant.\n\nI can explain processes step by step, clarify SOP/test questions, and support role-appropriate operations insights.",
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
          className="fixed z-40 right-4 sm:right-6 bg-[var(--kl-primary)] hover:bg-[var(--kl-primary-hover)] text-white rounded-full h-12 px-4 inline-flex items-center gap-2 shadow-[var(--kl-shadow)]"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 14px)" }}
        >
          <AppIcon name="ai" size={16} />
          <span className="text-[13px] font-semibold">Ask AI</span>
        </button>
      )}

      {open && (
        <div
          className="fixed z-50 inset-x-3 sm:inset-x-auto sm:right-6 bg-[var(--kl-surface)] border border-[var(--kl-border)] rounded-[18px] shadow-[var(--kl-shadow)] flex flex-col overflow-hidden sm:w-[410px]"
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + 12px)",
            height: "min(72dvh, 680px)",
          }}
        >
          <div className="shrink-0 px-4 py-3 border-b border-[var(--kl-border)] bg-[var(--kl-surface-soft)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-gradient-to-br from-[var(--kl-primary)] to-[#0f86ff] rounded-[10px] p-1.5">
                <AppIcon name="ai" size={14} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[var(--kl-text)] text-[13px] font-semibold truncate">Knowlab AI</p>
                <p className="text-[var(--kl-text-muted)] text-[11px] truncate">
                  {activeDepartment.shortName}
                  {TEXT_TOKENS.separator}
                  {activeBench.shortName}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-[var(--kl-text-muted)] hover:text-[var(--kl-primary)] rounded-[8px] p-1">
              <AppIcon name="close" size={14} />
            </button>
          </div>

          <div className="shrink-0 border-b border-[var(--kl-border)] bg-[var(--kl-surface)] px-3 py-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {quickCards.map((card) => (
                <button
                  key={card}
                  onClick={() => void send(card)}
                  className="text-left rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface-tinted)] px-2.5 py-2 hover:border-[var(--kl-primary)] transition-colors"
                >
                  <p className="text-[11px] text-[var(--kl-text)] leading-snug">{card}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[var(--kl-surface-soft)] min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-[14px] px-3 py-2 ${
                    msg.role === "user"
                      ? "bg-[var(--kl-primary)] text-white"
                      : "bg-[var(--kl-surface)] border border-[var(--kl-border)] text-[var(--kl-text)]"
                  }`}
                >
                  <p className="text-[12px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                  {msg.role === "assistant" && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[10px] text-[var(--kl-text-muted)]">
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
                                  to ? "bg-[#eef5ff] text-[#1c5eff]" : "bg-[var(--kl-surface-tinted)] text-[var(--kl-text-muted)]"
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
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] bg-[#e8f8f1] text-[#1c7b56] disabled:opacity-50"
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
              <div className="inline-flex items-center gap-2 bg-[var(--kl-surface)] border border-[var(--kl-border)] text-[var(--kl-text-muted)] text-[11px] rounded-[12px] px-3 py-2">
                <AppIcon name="ai" size={12} />
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            className="shrink-0 border-t border-[var(--kl-border)] bg-[var(--kl-surface)] p-2.5 flex items-end gap-2"
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
              className="flex-1 h-[40px] rounded-[10px] border border-[var(--kl-border)] bg-[var(--kl-surface-tinted)] px-3 text-[12px] text-[var(--kl-text)] placeholder:text-[var(--kl-text-muted)] focus:outline-none focus:border-[var(--kl-primary)]"
            />
            <button
              onClick={() => void send()}
              disabled={!input.trim() || loading}
              className="h-[40px] w-[40px] rounded-[10px] bg-[var(--kl-primary)] hover:bg-[var(--kl-primary-hover)] text-white inline-flex items-center justify-center disabled:opacity-40"
            >
              <AppIcon name="send" size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
