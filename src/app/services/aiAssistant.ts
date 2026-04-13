import { CAPA_ITEMS, getDepartmentForUser, getStaffUsers, JOB_AIDS, LAB_TESTS, SOPS } from "../data/mockData";

export interface AssistantSource {
  id: string;
  type: "sop" | "test" | "job_aid" | "ops";
  title: string;
}

export type AssistantMode = "direct" | "teaching" | "clarify" | "denied";

export interface AssistantQuickAction {
  label: string;
  path?: string;
  source?: AssistantSource;
}

export interface AssistantAnswer {
  answer: string;
  confidence: number;
  sources: AssistantSource[];
  mode?: AssistantMode;
  accessDenied?: boolean;
  quickActions?: AssistantQuickAction[];
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function sentence(input: string, fallback: string) {
  const trimmed = (input || "").trim();
  if (!trimmed) return fallback;
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
}

function buildAlternativeSuggestions(query: string) {
  const tokens = tokenize(query);
  const rankedTests = LAB_TESTS.map((test) => {
    const hay = `${test.name} ${test.category} ${test.code}`.toLowerCase();
    const score = tokens.reduce((acc, token) => acc + (hay.includes(token) ? 1 : 0), 0);
    return { test, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (rankedTests.every((entry) => entry.score === 0)) {
    return LAB_TESTS.slice(0, 3).map((test) => `${test.code} - ${test.name}`);
  }
  return rankedTests.map((entry) => `${entry.test.code} - ${entry.test.name}`);
}

function shouldClarify(query: string) {
  const q = query.trim().toLowerCase();
  const tokens = tokenize(q);
  if (tokens.length < 3) return true;
  const tooGeneric = ["help", "hi", "hello", "teach me", "question", "random", "any idea"].some((fragment) =>
    q === fragment || q.startsWith(`${fragment} `),
  );
  return tooGeneric;
}

function deniedAnswer(role: "staff" | "supervisor" | "hod"): AssistantAnswer {
  if (role !== "staff") {
    return {
      answer:
        "I can support this request, but I need a little more context first. Tell me the unit, timeframe, and what decision you need to make.",
      confidence: 0.4,
      sources: [],
      mode: "clarify",
      quickActions: [
        { label: "Ask for CAPA summary", path: "/supervisor/capa" },
        { label: "Ask for team competency", path: "/supervisor/staff" },
      ],
    };
  }

  return {
    answer:
      "That request is outside staff-level access.\n\nYou can ask SOP/test/training guidance here. For admin or supervisor-level data, please contact your supervisor.",
    confidence: 0.91,
    sources: [],
    mode: "denied",
    accessDenied: true,
    quickActions: [
      { label: "Ask SOP guidance", path: "/staff/sops" },
      { label: "Ask test guidance", path: "/staff/tests" },
      { label: "Open training", path: "/staff/training" },
    ],
  };
}

function staffAskingRestrictedScope(query: string) {
  const q = query.toLowerCase();
  const restrictedPhrases = [
    "admin",
    "super admin",
    "permissions",
    "user management",
    "role access",
    "salary",
    "headcount",
    "who is under",
    "who is below",
    "competency",
    "capa",
    "incident trend",
    "operations report",
  ];
  return restrictedPhrases.some((fragment) => q.includes(fragment));
}

function clarificationAnswer(): AssistantAnswer {
  return {
    answer:
      "I can help with that. Could you clarify one thing first?\n\n1. What exact test/SOP/process do you mean?\n2. Do you want a quick answer or a step-by-step teaching breakdown?\n3. Should I focus on your current bench only?",
    confidence: 0.44,
    sources: [],
    mode: "clarify",
  };
}

function tryGeneralDefinition(query: string): AssistantAnswer | null {
  const q = query.toLowerCase().trim();
  const asksDefinition =
    q.startsWith("define ") || q.startsWith("what is ") || q.startsWith("what does ") || q.includes(" meaning of ");
  if (!asksDefinition) return null;

  const definitions: Array<{ key: string; text: string; follow: string[] }> = [
    {
      key: "glucose",
      text:
        "Glucose is a simple sugar used by cells as a primary energy source. In lab practice, glucose testing supports diabetes screening and glycaemic monitoring.",
      follow: [
        "Ask for fasting/random reference range from your approved SOP.",
        "Ask for specimen type and sample stability.",
        "Ask for QC thresholds and critical escalation rules.",
      ],
    },
    {
      key: "capa",
      text:
        "CAPA means Corrective and Preventive Action: a structured workflow used to investigate a problem, fix root causes, and prevent recurrence.",
      follow: [
        "Ask for the latest CAPA in your authorized scope.",
        "Ask for open CAPA items that are overdue.",
        "Ask for CAPA trends by category and priority.",
      ],
    },
    {
      key: "qc",
      text:
        "QC means Quality Control: routine control checks that confirm analyzer performance is acceptable before patient result release.",
      follow: [
        "Ask what to do when QC fails on your analyzer.",
        "Ask for the latest QC warning or failure.",
        "Ask for the SOP checkpoint sequence.",
      ],
    },
    {
      key: "sop",
      text:
        "An SOP is a Standard Operating Procedure: a controlled document that defines the approved, repeatable way to execute a lab process safely and consistently.",
      follow: [
        "Ask for the SOP linked to a specific test code.",
        "Ask for revision and effective date.",
        "Ask for a step-by-step teaching walkthrough.",
      ],
    },
  ];

  const hit = definitions.find((def) => q.includes(def.key));
  if (!hit) {
    return {
      answer:
        "I can give a conceptual explanation, but exact lab values and procedures must come from verified SOP/test sources.\n\nTry a specific term like: define glucose, define CAPA, define QC, or define SOP.",
      confidence: 0.38,
      sources: [],
      mode: "teaching",
    };
  }

  return {
    answer:
      `Direct explanation:\n${hit.text}\n\n` +
      "Important:\n- Concept explanation is general context.\n- Numeric values and workflow steps must come from your verified SOP/test source.\n\n" +
      "Helpful follow-ups:\n" +
      hit.follow.map((item, idx) => `${idx + 1}. ${item}`).join("\n"),
    confidence: 0.5,
    sources: [],
    mode: "teaching",
  };
}

function tryOperationalAnswer(input: {
  query: string;
  role: "staff" | "supervisor" | "hod";
  unit?: string;
  department?: string;
  bench?: string;
}): AssistantAnswer | null {
  if (input.role === "staff") return null;

  const q = input.query.toLowerCase();
  const staff = getStaffUsers();
  const scopedByDepartment = input.department
    ? staff.filter((entry) => getDepartmentForUser(entry.department, entry.unit).name.toLowerCase() === input.department!.toLowerCase())
    : staff;

  const scoped =
    input.bench && input.bench.toLowerCase() !== "all"
      ? scopedByDepartment.filter((entry) => entry.unit.toLowerCase().includes(input.bench!.toLowerCase()))
      : scopedByDepartment;

  if (q.includes("last capa") || q.includes("latest capa") || (q.includes("capa") && q.includes("last"))) {
    const last = [...CAPA_ITEMS].sort((a, b) => new Date(b.openedDate).getTime() - new Date(a.openedDate).getTime())[0];
    if (!last) {
      return {
        answer: "No CAPA incidents are available in current operational records.",
        confidence: 0.88,
        sources: [{ id: "ops-capa-empty", type: "ops", title: "CAPA Operations Log" }],
        mode: "direct",
      };
    }
    return {
      answer:
        "CAPA summary:\n" +
        `- Code: ${last.code}\n` +
        `- Title: ${last.title}\n` +
        `- Priority: ${last.priority}\n` +
        `- Status: ${last.status}\n` +
        `- Opened: ${new Date(last.openedDate).toLocaleDateString("en-GB")}\n\n` +
        "Next step:\n1. Open CAPA details.\n2. Confirm root cause completeness.\n3. Validate preventive ownership and due date.",
      confidence: 0.93,
      sources: [{ id: last.id, type: "ops", title: `CAPA ${last.code}` }],
      mode: "teaching",
      quickActions: [{ label: "Open CAPA board", path: "capa" }],
    };
  }

  const asksCompetency = q.includes("competency") || q.includes("under") || q.includes("below") || q.includes("%");
  const asksPeople = q.includes("who") || q.includes("people") || q.includes("staff") || q.includes("persons");
  if (asksCompetency && asksPeople) {
    const threshold = Number((q.match(/(under|below)\s*(\d{2,3})\s*%?/) || [])[2] || 80);
    const low = scoped.filter((entry) => (entry.competencyScore ?? 0) < threshold);
    const heading = input.bench ? `${input.bench} bench` : input.department ? `${input.department} lab` : "current scope";

    if (!low.length) {
      return {
        answer: `No staff in ${heading} are below ${threshold}% competency in current operational records.`,
        confidence: 0.9,
        sources: [{ id: "ops-staff-competency", type: "ops", title: "Staff Competency Register" }],
        mode: "direct",
      };
    }

    return {
      answer:
        `People below ${threshold}% competency in ${heading}:\n` +
        low
          .sort((a, b) => (a.competencyScore ?? 0) - (b.competencyScore ?? 0))
          .map((entry, idx) => `${idx + 1}. ${entry.name} (${entry.unit}) - ${entry.competencyScore ?? 0}%`)
          .join("\n") +
        "\n\nCoaching plan:\n1. Prioritize lowest scores first.\n2. Assign focused retraining.\n3. Reassess with a dated competency check.",
      confidence: 0.92,
      sources: [{ id: "ops-staff-competency", type: "ops", title: "Staff Competency Register" }],
      mode: "teaching",
      quickActions: [{ label: "Open My Staff", path: "staff" }],
    };
  }

  if ((q.includes("who are") || q.includes("list")) && (q.includes("in ") || q.includes("bench"))) {
    if (!scoped.length) return null;
    return {
      answer:
        `Staff in scope (${input.bench || input.department || "selected lab"}):\n` +
        scoped.map((entry, idx) => `${idx + 1}. ${entry.name} - ${entry.unit} (${entry.competencyScore ?? 0}%)`).join("\n"),
      confidence: 0.86,
      sources: [{ id: "ops-staff-list", type: "ops", title: "Staff Directory" }],
      mode: "direct",
      quickActions: [{ label: "Open staff directory", path: "staff" }],
    };
  }

  return null;
}

type Doc =
  | { id: string; type: "sop"; title: string; content: string; meta: (typeof SOPS)[number] }
  | { id: string; type: "test"; title: string; content: string; meta: (typeof LAB_TESTS)[number] }
  | { id: string; type: "job_aid"; title: string; content: string; meta: (typeof JOB_AIDS)[number] };

function buildLocalDocs(): Doc[] {
  return [
    ...SOPS.map((sop) => {
      const title = `${sop.code} - ${sop.title}`;
      return {
        id: sop.id,
        type: "sop" as const,
        title,
        content: `${title} ${sop.department} ${sop.category} ${sop.purpose} ${sop.principle} ${sop.tags.join(" ")}`,
        meta: sop,
      };
    }),
    ...LAB_TESTS.map((test) => {
      const title = `${test.code} - ${test.name}`;
      return {
        id: test.id,
        type: "test" as const,
        title,
        content: `${title} ${test.category} ${test.sampleType} ${test.specialInstructions} ${test.clinicalSignificance} ${test.parameters
          .map((parameter) => `${parameter.name} ${parameter.maleRange} ${parameter.femaleRange}`)
          .join(" ")}`,
        meta: test,
      };
    }),
    ...JOB_AIDS.map((aid) => {
      const title = aid.title;
      return {
        id: aid.id,
        type: "job_aid" as const,
        title,
        content: `${title} ${aid.category} ${aid.description} ${(aid.steps ?? []).join(" ")}`,
        meta: aid,
      };
    }),
  ];
}

function rankLocalDocs(query: string) {
  const tokens = tokenize(query);
  return buildLocalDocs()
    .map((doc) => {
      const content = doc.content.toLowerCase();
      const score = tokens.reduce((acc, token) => acc + (content.includes(token) ? 1 : 0), 0);
      const phraseBoost = query.length > 3 && content.includes(query.toLowerCase()) ? 2 : 0;
      return { ...doc, score: score + phraseBoost };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .filter((entry) => entry.score > 0);
}

async function askLocalQwen(query: string): Promise<AssistantAnswer | null> {
  const useLocalQwen = import.meta.env.VITE_USE_LOCAL_QWEN === "true";
  if (!useLocalQwen) return null;

  const ranked = rankLocalDocs(query);
  if (!ranked.length) return null;

  const endpoint = (import.meta.env.VITE_LOCAL_QWEN_URL as string | undefined) || "http://127.0.0.1:11434/api/chat";
  const model = (import.meta.env.VITE_LOCAL_QWEN_MODEL as string | undefined) || "qwen2.5:7b-instruct";
  const context = ranked.map((entry) => `[${entry.type}:${entry.id} (${entry.title})]\n${entry.content}`).join("\n\n---\n\n");

  const sources = ranked.map((entry) => ({
    id: entry.id,
    type: entry.type,
    title: entry.title,
  })) as AssistantSource[];

  const prompt =
    "You are Knowlab AI running locally with Qwen.\n" +
    "Rules:\n" +
    "- Use retrieved context for numeric ranges, procedure steps, and specimen requirements.\n" +
    "- If a value/procedure is not in context, say it is not verified in current sources.\n" +
    "- Teach in clear steps where useful.\n" +
    "- Keep response natural and practical.\n\n" +
    `Context:\n${context}\n\nQuestion:\n${query}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: "You are Knowlab AI for clinical laboratory workflows." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const answer = (data?.message?.content || "").trim();
    if (!answer) return null;

    return {
      answer,
      confidence: Math.min(0.95, 0.5 + ranked.length * 0.12),
      sources,
      mode: "teaching",
    };
  } catch {
    return null;
  }
}

function localKnowledgeRag(query: string): AssistantAnswer {
  const ranked = rankLocalDocs(query);
  if (ranked.length === 0) {
    const definition = tryGeneralDefinition(query);
    if (definition) return definition;
    return {
      answer:
        `I could not find a verified source in the current knowledge bank for "${query}".\n\n` +
        "Closest alternatives you can open now:\n" +
        buildAlternativeSuggestions(query)
          .map((suggestion, idx) => `${idx + 1}. ${suggestion}`)
          .join("\n") +
        '\n\nIf you want, ask a narrower question with a test name/code (example: "reference range for fasting glucose").',
      confidence: 0.2,
      sources: [],
      mode: "clarify",
    };
  }

  const top = ranked[0];
  const confidence = Math.min(0.92, 0.45 + ranked.length * 0.12);
  const sources = ranked.map((entry) => ({ id: entry.id, type: entry.type, title: entry.title })) as AssistantSource[];
  const topSuggestions = unique(
    ranked
      .map((entry) => entry.title)
      .filter((title) => title !== top.title)
      .slice(0, 3),
  );

  if (top.type === "test") {
    const test = top.meta;
    const parameterLines = test.parameters.slice(0, 3).map((parameter) => {
      const unit = parameter.unit ? ` ${parameter.unit}` : "";
      return `- ${parameter.name}: Male ${parameter.maleRange}${unit}; Female ${parameter.femaleRange}${unit}${
        parameter.pediatricRange ? `; Paediatric ${parameter.pediatricRange}` : ""
      }`;
    });

    return {
      answer:
        `Direct answer:\n${test.name} (${test.code}) is a ${test.category} test.\n\n` +
        "Step-by-step usage:\n" +
        `1. Confirm sample and container: ${test.sampleType}, ${test.container}, ${test.sampleVolume}.\n` +
        `2. Run with method: ${test.methodology}.\n` +
        `3. Validate against SOP and QC flags before release.\n\n` +
        "Reference range from available source:\n" +
        `${parameterLines.length ? parameterLines.join("\n") : "- No numeric range is documented in this source."}\n\n` +
        "Follow-up suggestions:\n" +
        (topSuggestions.length
          ? topSuggestions.map((item, idx) => `${idx + 1}. Ask about ${item}.`).join("\n")
          : "1. Ask for collection and rejection criteria.\n2. Ask for critical threshold escalation.\n3. Ask for interpretation caveats."),
      confidence,
      sources,
      mode: "teaching",
      quickActions: test.relatedSop ? [{ label: `Open ${test.relatedSop}`, source: sources[0] }] : [],
    };
  }

  if (top.type === "sop") {
    const sop = top.meta;
    return {
      answer:
        `Direct answer:\n${sop.title} (${sop.code}) defines the approved workflow for ${sop.category} in ${sop.department}.\n\n` +
        "Step-by-step learning path:\n" +
        "1. Understand purpose and principle first.\n" +
        "2. Confirm equipment and reagents before execution.\n" +
        "3. Follow procedural steps and verify QC checkpoints.\n\n" +
        `Core notes:\n- Purpose: ${sentence(sop.purpose, "Standardized bench process")}\n- Principle: ${sentence(
          sop.principle,
          "Validated laboratory method and controls",
        )}\n- Equipment: ${sop.equipment.slice(0, 4).join(", ") || "Not specified"}\n- Reagents: ${
          sop.reagents.slice(0, 4).join(", ") || "Not specified"
        }\n\n` +
        "Follow-up suggestions:\n" +
        (topSuggestions.length
          ? topSuggestions.map((item, idx) => `${idx + 1}. Ask about ${item}.`).join("\n")
          : "1. Ask for exact execution steps.\n2. Ask for escalation checkpoints.\n3. Ask for mapped tests."),
      confidence,
      sources,
      mode: "teaching",
      quickActions: [{ label: "Open SOP", source: sources[0] }],
    };
  }

  return {
    answer:
      `Direct answer:\n${top.title} is the closest verified match.\n\n` +
      "How to use this safely:\n" +
      "1. Confirm the question scope.\n" +
      "2. Cross-check values with linked SOP/test sources.\n" +
      "3. Escalate if uncertainty remains.\n\n" +
      "Follow-up suggestions:\n" +
      (topSuggestions.length
        ? topSuggestions.map((item, idx) => `${idx + 1}. Ask about ${item}.`).join("\n")
        : "1. Ask for SOP-linked details.\n2. Ask for interpretation context.\n3. Ask for decision checkpoints."),
    confidence,
    sources,
    mode: "teaching",
  };
}

export async function askKnowledgeAssistant(input: {
  query: string;
  role: "staff" | "supervisor" | "hod";
  unit?: string;
  department?: string;
  bench?: string;
}): Promise<AssistantAnswer> {
  const normalizedQuery = input.query.trim();

  if (input.role === "staff" && staffAskingRestrictedScope(normalizedQuery)) {
    return deniedAnswer(input.role);
  }

  if (shouldClarify(normalizedQuery)) {
    return clarificationAnswer();
  }

  const opsAnswer = tryOperationalAnswer(input);
  if (opsAnswer) return opsAnswer;

  const qwenAnswer = await askLocalQwen(normalizedQuery);
  if (qwenAnswer) return qwenAnswer;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return localKnowledgeRag(normalizedQuery);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const useRemote = Boolean(supabaseUrl && supabaseAnonKey && import.meta.env.VITE_USE_REMOTE_AI === "true");

  if (!useRemote) {
    return localKnowledgeRag(normalizedQuery);
  }

  try {
    const endpoint = `${supabaseUrl}/functions/v1/gemini-rag`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      return localKnowledgeRag(normalizedQuery);
    }

    const data = await res.json();
    return {
      answer: data.answer ?? "No answer generated.",
      confidence: data.confidence ?? 0.5,
      sources: data.sources ?? [],
      mode: data.mode ?? "direct",
      accessDenied: data.accessDenied ?? false,
      quickActions: data.quickActions ?? [],
    };
  } catch {
    return localKnowledgeRag(normalizedQuery);
  }
}
