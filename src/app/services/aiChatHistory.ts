import type { AssistantMode, AssistantQuickAction, AssistantSource } from "./aiAssistant";

export interface AiChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  streaming?: boolean;
  confidence?: number;
  sources?: AssistantSource[];
  mode?: AssistantMode;
  accessDenied?: boolean;
  quickActions?: AssistantQuickAction[];
  attachments?: AiChatAttachment[];
}

export interface AiChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: AiChatMessage[];
}

export function getAiChatStorageKey(userId: string | undefined, base: string) {
  return `knowlab_ai_sessions_${userId || "anon"}_${base.replace("/", "")}`;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function deriveChatTitle(messages: AiChatMessage[]) {
  const firstUserMessage = messages.find((message) => message.role === "user")?.content ?? "";
  const title = cleanText(firstUserMessage).replace(/[.?!]+$/, "");
  if (!title) return "New chat";
  return title.length > 42 ? `${title.slice(0, 42).trim()}...` : title;
}

export function createChatSession(id: string, welcome: AiChatMessage): AiChatSession {
  return {
    id,
    title: "New chat",
    updatedAt: new Date().toISOString(),
    messages: [welcome],
  };
}

export function makeWelcomeMessage(content: string): AiChatMessage {
  return {
    id: "hello",
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    confidence: 0.97,
  };
}

export function normalizeSessions(input: unknown, welcomeFactory: () => AiChatMessage): AiChatSession[] {
  if (!Array.isArray(input)) return [];

  const sessions = input
    .map((entry, idx) => {
      if (!entry || typeof entry !== "object") return null;
      const candidate = entry as Partial<AiChatSession>;
      if (!Array.isArray(candidate.messages)) return null;
      const messages = candidate.messages.filter(Boolean).map((message, messageIdx) => {
        const item = message as Partial<AiChatMessage>;
        return {
          id: typeof item.id === "string" ? item.id : `msg_${idx}_${messageIdx}`,
          role: item.role === "assistant" ? "assistant" : "user",
          content: typeof item.content === "string" ? item.content : "",
          timestamp: typeof item.timestamp === "string" ? item.timestamp : new Date().toISOString(),
          streaming: item.streaming === true,
          confidence: typeof item.confidence === "number" ? item.confidence : undefined,
          sources: Array.isArray(item.sources) ? item.sources : undefined,
          mode: item.mode,
          accessDenied: item.accessDenied,
          quickActions: Array.isArray(item.quickActions) ? item.quickActions : undefined,
          attachments: Array.isArray(item.attachments) ? item.attachments : undefined,
        } satisfies AiChatMessage;
      });

      if (!messages.length) messages.push(welcomeFactory());

      return {
        id: typeof candidate.id === "string" ? candidate.id : `session_${idx}`,
        title: typeof candidate.title === "string" && candidate.title.trim() ? candidate.title : deriveChatTitle(messages),
        updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : new Date().toISOString(),
        messages,
      } satisfies AiChatSession;
    })
    .filter(Boolean) as AiChatSession[];

  return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function seedSessionsFromMessages(messages: AiChatMessage[], welcomeFactory: () => AiChatMessage) {
  if (!messages.length) return [createChatSession(`chat_${Date.now()}`, welcomeFactory())];
  return [
    {
      id: `chat_${Date.now()}`,
      title: deriveChatTitle(messages),
      updatedAt: messages[messages.length - 1]?.timestamp ?? new Date().toISOString(),
      messages,
    },
  ] satisfies AiChatSession[];
}
