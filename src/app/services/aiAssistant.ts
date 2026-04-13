import {
  CAPA_ITEMS,
  JOB_AIDS,
  LAB_TESTS,
  SOPS,
  TRAINING_MODULES,
  TRAINING_RECORDS,
  getDepartmentForUser,
  getStaffUsers,
} from "../data/mockData";

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

function matchesLocalIntent(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  const exactDefinitions = ["glucose", "capa", "qc", "sop"];
  if (exactDefinitions.some((term) => q === term || q.includes(term))) return true;

  const testHit = LAB_TESTS.some((test) => {
    const name = test.name.toLowerCase();
    return name.includes(q) || q.includes(name) || test.code.toLowerCase() === q;
  });
  if (testHit) return true;

  const sopHit = SOPS.some((sop) => {
    const title = sop.title.toLowerCase();
    return title.includes(q) || q.includes(title) || sop.code.toLowerCase() === q;
  });
  if (sopHit) return true;

  const aidHit = JOB_AIDS.some((aid) => {
    const title = aid.title.toLowerCase();
    return title.includes(q) || q.includes(title);
  });
  return aidHit;
}

function shouldClarify(query: string) {
  const q = query.trim().toLowerCase();
  const tokens = tokenize(q);
  if (matchesLocalIntent(q)) return false;
  if (tokens.length <= 1) return true;
  const tooGeneric = ["help", "hi", "hello", "question", "random", "any idea", "teach me"].some(
    (fragment) => q === fragment,
  );
  const vagueFlag = q.includes("random") || q.includes("anything") || q.includes("not sure");
  return tooGeneric || vagueFlag;
}

function wantsTeaching(query: string) {
  const q = query.toLowerCase();
  return (
    q.includes("teach") ||
    q.includes("explain") ||
    q.includes("step by step") ||
    q.includes("step-by-step") ||
    q.includes("breakdown") ||
    q.includes("walk me") ||
    q.includes("how do i") ||
    q.includes("how to")
  );
}

function deniedAnswer(role: "staff" | "supervisor" | "hod"): AssistantAnswer {
  if (role !== "staff") {
    return {
      answer:
        "I can help with that, just need a little context first. Which unit, what timeframe, and what decision are you trying to make?",
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
      "I can help. Could you clarify a quick detail:\n1) Which test/SOP/process?\n2) Do you want a quick answer or a step-by-step walkthrough?\n3) Should I keep it to your current bench?",
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
        "I can give a quick concept explanation, but exact lab values and procedures must come from verified SOP/test sources.\n\nTry a specific term like: define glucose, define CAPA, define QC, or define SOP.",
      confidence: 0.38,
      sources: [],
      mode: "teaching",
    };
  }

  return {
    answer:
      `${hit.text}\n\n` +
      "Important:\n- This is general context.\n- Numeric values and workflow steps must come from your verified SOP/test source.\n\n" +
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

  const unitStats = unique(scopedByDepartment.map((entry) => entry.unit)).map((unit) => {
    const unitStaff = scopedByDepartment.filter((entry) => entry.unit === unit);
    const ids = new Set(unitStaff.map((entry) => entry.id));
    const unitRecords = TRAINING_RECORDS.filter((record) => ids.has(record.staffId));
    const completed = unitRecords.filter((record) => record.status === "completed").length;
    const overdue = unitRecords.filter((record) => record.status === "overdue").length;
    const totalExpected = Math.max(1, unitStaff.length * TRAINING_MODULES.length);
    const completionPct = Math.round((completed / totalExpected) * 100);
    const avgCompetency = Math.round(
      unitStaff.reduce((sum, entry) => sum + (entry.competencyScore ?? 0), 0) / Math.max(1, unitStaff.length),
    );
    return { unit, unitStaff, overdue, completionPct, avgCompetency };
  });

  if (
    q.includes("training escalation") ||
    (q.includes("unit") && q.includes("training") && (q.includes("immediate") || q.includes("need")))
  ) {
    const ranked = [...unitStats].sort(
      (a, b) => b.overdue - a.overdue || a.completionPct - b.completionPct || a.avgCompetency - b.avgCompetency,
    );
    const top = ranked.slice(0, 3);

    if (!top.length) {
      return {
        answer: "No unit-level training data is available for escalation analysis in the current scope.",
        confidence: 0.71,
        sources: [{ id: "ops-training-empty", type: "ops", title: "Training Compliance Register" }],
        mode: "direct",
      };
    }

    const teaching = wantsTeaching(input.query);
    return {
      answer:
        "Here are the units that need the most escalation attention right now:\n" +
        top
          .map(
            (entry, idx) =>
              `${idx + 1}. ${entry.unit} - ${entry.overdue} overdue, ${entry.completionPct}% completion, ${entry.avgCompetency}% avg competency`,
          )
          .join("\n") +
        (teaching
          ? "\n\nIf you want a quick plan:\n1) Prioritize overdue mandatory modules.\n2) Assign focused remediation by gap.\n3) Recheck in 7 days."
          : ""),
      confidence: 0.9,
      sources: [{ id: "ops-training", type: "ops", title: "Training Compliance Register" }],
      mode: teaching ? "teaching" : "direct",
      quickActions: [{ label: "Open training board", path: "training" }, { label: "Open staff view", path: "staff" }],
    };
  }

  if (q.includes("risk signal") || (q.includes("risk") && q.includes("intervention"))) {
    const criticalOpen = CAPA_ITEMS.filter((item) => item.priority === "critical" && item.status !== "completed").length;
    const overdueTraining = TRAINING_RECORDS.filter((record) => record.status === "overdue").length;
    const below80 = scopedByDepartment.filter((entry) => (entry.competencyScore ?? 0) < 80).length;

    const teaching = wantsTeaching(input.query);
    return {
      answer:
        "Here are the key risk signals right now:\n" +
        `1) Critical open CAPAs: ${criticalOpen}\n` +
        `2) Overdue training records: ${overdueTraining}\n` +
        `3) Staff below 80% competency: ${below80}\n` +
        (teaching
          ? "\nQuick actions:\n- Triage critical CAPAs by due date/owner.\n- Schedule catch-up training for overdue cohorts.\n- Run targeted coaching for low-competency units."
          : ""),
      confidence: 0.88,
      sources: [
        { id: "ops-capa", type: "ops", title: "CAPA Operations Log" },
        { id: "ops-training", type: "ops", title: "Training Compliance Register" },
        { id: "ops-competency", type: "ops", title: "Staff Competency Register" },
      ],
      mode: teaching ? "teaching" : "direct",
      quickActions: [{ label: "Open CAPA board", path: "capa" }, { label: "Open training board", path: "training" }],
    };
  }

  if ((q.includes("executive") || q.includes("narrative")) && (q.includes("sop") || q.includes("capa"))) {
    const activeSops = SOPS.filter((sop) => sop.status === "active").length;
    const openCapas = CAPA_ITEMS.filter((item) => item.status !== "completed").length;
    const completedCapas = CAPA_ITEMS.filter((item) => item.status === "completed").length;
    const overdueTraining = TRAINING_RECORDS.filter((record) => record.status === "overdue").length;

    return {
      answer:
        "Here’s a clean executive summary you can reuse:\n\n" +
        `SOPs: ${activeSops} active SOPs in scope with review controls in place.\n` +
        `CAPA: ${openCapas} open items, ${completedCapas} closed.\n` +
        `Readiness: ${overdueTraining} overdue training items.\n\n` +
        "Priority message: keep CAPA closure velocity high while reducing overdue training to protect SOP execution.",
      confidence: 0.86,
      sources: [
        { id: "ops-sop", type: "ops", title: "SOP Register" },
        { id: "ops-capa", type: "ops", title: "CAPA Operations Log" },
        { id: "ops-training", type: "ops", title: "Training Compliance Register" },
      ],
      mode: "direct",
      quickActions: [{ label: "Open reports", path: "reports" }, { label: "Open CAPA board", path: "capa" }],
    };
  }

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
    const teaching = wantsTeaching(input.query);
    return {
      answer:
        "Latest CAPA:\n" +
        `- Code: ${last.code}\n` +
        `- Title: ${last.title}\n` +
        `- Priority: ${last.priority}\n` +
        `- Status: ${last.status}\n` +
        `- Opened: ${new Date(last.openedDate).toLocaleDateString("en-GB")}\n` +
        (teaching ? "\nNext steps: open details, confirm root cause, validate preventive ownership/due date." : ""),
      confidence: 0.93,
      sources: [{ id: last.id, type: "ops", title: `CAPA ${last.code}` }],
      mode: teaching ? "teaching" : "direct",
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

    const teaching = wantsTeaching(input.query);
    return {
      answer:
        `People below ${threshold}% competency in ${heading}:\n` +
        low
          .sort((a, b) => (a.competencyScore ?? 0) - (b.competencyScore ?? 0))
          .map((entry, idx) => `${idx + 1}. ${entry.name} (${entry.unit}) - ${entry.competencyScore ?? 0}%`)
          .join("\n") +
        (teaching ? "\n\nCoaching plan: prioritize lowest scores, assign focused retraining, then reassess with a dated check." : ""),
      confidence: 0.92,
      sources: [{ id: "ops-staff-competency", type: "ops", title: "Staff Competency Register" }],
      mode: teaching ? "teaching" : "direct",
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
        `I couldn't find a verified source for "${query}" in the current knowledge bank.\n\n` +
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
    const teaching = wantsTeaching(query);

    return {
      answer:
        `${test.name} (${test.code}) is a ${test.category} test.\n` +
        `Specimen: ${test.sampleType}, ${test.container}, ${test.sampleVolume}.\n` +
        `Method: ${test.methodology}.\n\n` +
        "Reference ranges available:\n" +
        `${parameterLines.length ? parameterLines.join("\n") : "- No numeric range is documented in this source."}` +
        (teaching
          ? "\n\nIf you want a walkthrough:\n1) Confirm sample and container.\n2) Run with the stated method.\n3) Validate against SOP/QC before release."
          : "") +
        "\n\nIf you want more:\n" +
        (topSuggestions.length
          ? topSuggestions.map((item, idx) => `${idx + 1}. Ask about ${item}.`).join("\n")
          : "1. Ask for collection and rejection criteria.\n2. Ask for critical thresholds.\n3. Ask for interpretation caveats."),
      confidence,
      sources,
      mode: teaching ? "teaching" : "direct",
      quickActions: test.relatedSop ? [{ label: `Open ${test.relatedSop}`, source: sources[0] }] : [],
    };
  }

  if (top.type === "sop") {
    const sop = top.meta;
    const teaching = wantsTeaching(query);
    return {
      answer:
        `${sop.title} (${sop.code}) is the approved workflow for ${sop.category} in ${sop.department}.\n\n` +
        `Core notes:\n- Purpose: ${sentence(sop.purpose, "Standardized bench process")}\n- Principle: ${sentence(
          sop.principle,
          "Validated laboratory method and controls",
        )}\n- Equipment: ${sop.equipment.slice(0, 4).join(", ") || "Not specified"}\n- Reagents: ${
          sop.reagents.slice(0, 4).join(", ") || "Not specified"
        }\n\n` +
        (teaching
          ? "If you want a quick walkthrough:\n1) Review purpose/principle.\n2) Confirm equipment/reagents.\n3) Follow steps and verify QC checkpoints.\n\n"
          : "") +
        "If you want more:\n" +
        (topSuggestions.length
          ? topSuggestions.map((item, idx) => `${idx + 1}. Ask about ${item}.`).join("\n")
          : "1. Ask for exact execution steps.\n2. Ask for escalation checkpoints.\n3. Ask for mapped tests."),
      confidence,
      sources,
      mode: teaching ? "teaching" : "direct",
      quickActions: [{ label: "Open SOP", source: sources[0] }],
    };
  }

  const teaching = wantsTeaching(query);
  return {
    answer:
      `${top.title} is the closest verified match.\n\n` +
      (teaching
        ? "Safe use reminder:\n1) Confirm the exact scope.\n2) Cross-check values with linked SOP/test sources.\n3) Escalate if uncertainty remains.\n\n"
        : "") +
      "If you want more:\n" +
      (topSuggestions.length
        ? topSuggestions.map((item, idx) => `${idx + 1}. Ask about ${item}.`).join("\n")
        : "1. Ask for SOP-linked details.\n2. Ask for interpretation context.\n3. Ask for decision checkpoints."),
    confidence,
    sources,
    mode: teaching ? "teaching" : "direct",
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

  const localRanked = rankLocalDocs(normalizedQuery);
  if (localRanked.length > 0) {
    return localKnowledgeRag(normalizedQuery);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const remoteFlag = import.meta.env.VITE_USE_REMOTE_AI;
  const allowRemote = remoteFlag === undefined || remoteFlag === "true";
  const useRemote = Boolean(supabaseUrl && supabaseAnonKey && allowRemote);

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
