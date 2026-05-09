import type { AssistantMode, AssistantQuickAction, AssistantSource } from "./aiAssistant";

export interface AiChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  kind?: "image" | "pdf" | "document";
  previewUrl?: string;
  dataBase64?: string;
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
  pinned?: boolean;
  archivedAt?: string;
  messages: AiChatMessage[];
}

export function getAiChatStorageKey(userId: string | undefined, base: string) {
  return `knowlab_ai_sessions_${userId || "anon"}_${base.replace("/", "")}`;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function deriveChatTitle(messages: AiChatMessage[]) {
  const firstUser = messages.find((message) => message.role === "user");
  const firstUserMessage = firstUser?.content ?? "";
  const normalized = cleanText(firstUserMessage).replace(/[.?!]+$/, "");
  const lower = normalized.toLowerCase();

  if (firstUser?.attachments?.some((attachment) => attachment.kind === "image")) return "Image result interpretation";
  if (firstUser?.attachments?.some((attachment) => attachment.kind === "pdf")) return "PDF lab document review";
  if (/\bbilirubin\b/.test(lower)) return "Bilirubin interpretation";
  if (/\blft|liver function\b/.test(lower)) return "LFT teaching summary";
  if (/\bqc\b|quality control|westgard|control fail/.test(lower)) return "QC failure guidance";
  if (/\bsop\b|procedure|workflow/.test(lower)) return "SOP workflow summary";
  if (/\bpatient|result|release|diagnosis|medication/.test(lower)) return "Patient result guidance";
  if (/\bhandover|summary|priorit/.test(lower)) return "Lab priorities summary";

  const title = normalized
    .replace(/^(can you|could you|please|pls|help me|i want to|show me|tell me about)\s+/i, "")
    .split(" ")
    .slice(0, 7)
    .join(" ");
  if (!title) return "New chat";
  return title.length > 38 ? `${title.slice(0, 38).trim()}...` : title;
}

export function createChatSession(id: string, welcome: AiChatMessage): AiChatSession {
  return {
    id,
    title: "New chat",
    updatedAt: new Date().toISOString(),
    pinned: false,
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
          attachments: Array.isArray(item.attachments)
            ? item.attachments.map((attachment) => {
                const entry = attachment as Partial<AiChatAttachment>;
                return {
                  id: entry.id || `attachment_${idx}_${messageIdx}`,
                  name: entry.name || "Attachment",
                  size: typeof entry.size === "number" ? entry.size : 0,
                  type: entry.type || "application/octet-stream",
                  kind: entry.kind,
                  previewUrl: entry.previewUrl,
                };
              })
            : undefined,
        } satisfies AiChatMessage;
      });

      if (!messages.length) messages.push(welcomeFactory());

      return {
        id: typeof candidate.id === "string" ? candidate.id : `session_${idx}`,
        title: typeof candidate.title === "string" && candidate.title.trim() ? candidate.title : deriveChatTitle(messages),
        updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : new Date().toISOString(),
        pinned: candidate.pinned === true,
        archivedAt: typeof candidate.archivedAt === "string" ? candidate.archivedAt : undefined,
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
      pinned: false,
      messages,
    },
  ] satisfies AiChatSession[];
}
