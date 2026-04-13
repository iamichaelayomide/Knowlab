import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface AskPayload {
  query: string;
  role: "staff" | "supervisor" | "hod";
  unit?: string;
}

type DomainKey = "haematology" | "chemistry" | "microbiology" | "histopathology" | "bgs";

const DOMAIN_TERMS: Record<DomainKey, string[]> = {
  haematology: ["haemat", "hemat", "fbc", "coag", "pt", "aptt", "inr", "blood film", "platelet", "esr", "wbc", "rbc"],
  chemistry: ["chem", "glucose", "hba1c", "lipid", "electrolyte", "bilirubin", "lft", "kft", "creatinine", "urea"],
  microbiology: ["micro", "culture", "sensitivity", "bacter", "mycol", "virol", "parasite", "gram", "afb", "pcr"],
  histopathology: ["histo", "cytology", "ihc", "biopsy", "histology", "autopsy", "pap smear", "paraffin", "stain"],
  bgs: ["blood group", "abo", "rh", "crossmatch", "antibody", "transfusion", "serology", "coombs"],
};

const STAFF_RESTRICTED_TERMS = [
  "admin",
  "super admin",
  "permissions",
  "role access",
  "user management",
  "competency",
  "who is under",
  "who is below",
  "capa",
  "incident trend",
  "headcount",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function resolveQueryDomain(queryLower: string): DomainKey | null {
  const scores = (Object.entries(DOMAIN_TERMS) as [DomainKey, string[]][])
    .map(([domain, terms]) => ({
      domain,
      score: terms.reduce((acc, term) => acc + (queryLower.includes(term) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scores[0]?.score > 0 ? scores[0].domain : null;
}

function shouldClarify(query: string) {
  const q = query.trim().toLowerCase();
  const tokens = q
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const tooGeneric = q === "help" || q === "hi" || q === "hello" || q === "question";
  return tokens.length <= 1 || tooGeneric;
}

function deniedByRole(payload: AskPayload) {
  if (payload.role !== "staff") return false;
  const q = payload.query.toLowerCase();
  return STAFF_RESTRICTED_TERMS.some((term) => q.includes(term));
}

function clarificationPayload() {
  return {
    answer:
      "I can help. Please clarify a bit so I can answer accurately:\n1. Which exact SOP/test/process?\n2. Do you want a quick answer or a step-by-step teaching breakdown?\n3. Should I keep this scoped to your current bench?",
    confidence: 0.44,
    sources: [],
    mode: "clarify",
    accessDenied: false,
    quickActions: [],
  };
}

function deniedPayload() {
  return {
    answer:
      "That request is outside staff-level access.\n\nYou can ask SOP/test/training questions here. For admin or supervisor-level information, contact your supervisor.",
    confidence: 0.91,
    sources: [],
    mode: "denied",
    accessDenied: true,
    quickActions: [
      { label: "Open SOPs", path: "/staff/sops" },
      { label: "Open Tests", path: "/staff/tests" },
      { label: "Open Training", path: "/staff/training" },
    ],
  };
}

function fallbackNoContext(query: string) {
  return {
    answer:
      `I do not have enough verified lab context for "${query}" yet. ` +
      "Please ask a supervisor or HOD to publish the relevant SOP or test content first.",
    confidence: 0.2,
    sources: [],
    mode: "clarify",
    accessDenied: false,
    quickActions: [],
  };
}

function fallbackWithSources(query: string, sources: { id: string; type: string; title: string }[], snippets: string[]) {
  const top = sources[0];
  const citation = top ? `${top.type}:${top.id} (${top.title})` : "available SOP/test source";
  const topSnippet = snippets[0] ?? "";
  const snippetSentence = topSnippet ? `Retrieved source hint: ${topSnippet.replace(/\s+/g, " ").slice(0, 260)}. ` : "";
  return {
    answer:
      `${snippetSentence}` +
      `Gemini is temporarily unavailable. For "${query}", start with ${citation}. ` +
      "Verify specimen requirements and interpretation thresholds before release.",
    confidence: 0.56,
    sources,
    mode: "teaching",
    accessDenied: false,
    quickActions: [],
  };
}

async function callGemini(query: string, context: string) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.0-flash";
  if (!apiKey) {
    return {
      answer: "Gemini is not configured yet (missing GEMINI_API_KEY).",
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are Knowlab AI.\n" +
                  "Tone: human, warm, professional, and practical.\n" +
                  "Hard rules:\n" +
                  "- Numeric values, ranges, specimen requirements, procedural steps, and QC rules must come only from retrieved context.\n" +
                  "- If missing in context, explicitly say it is not verified in current sources.\n" +
                  "- Ask one concise clarifying question if the prompt is ambiguous.\n" +
                  "- Do not sound like an AI. Avoid robotic headers.\n" +
                  "- Use steps only if the user asked to be taught or asked for step-by-step.\n\n" +
                  `Context:\n${context}\n\nQuestion:\n${query}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errText}`);
  }

  const json = await response.json();
  return { answer: json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No answer generated." };
}

async function callGeminiGeneric(query: string) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.0-flash";
  if (!apiKey) {
    return { answer: "" };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are Knowlab AI.\n" +
                  "No verified SOP/test context is currently available.\n" +
                  "Give only a short conceptual answer.\n" +
                  "Do not provide numeric ranges or procedural instructions.\n" +
                  "Tell user to request verified source-backed guidance.\n\n" +
                  `Question:\n${query}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) return { answer: "" };
  const json = await response.json();
  return { answer: json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as AskPayload;
    const query = payload.query?.trim();
    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (deniedByRole(payload)) {
      return new Response(JSON.stringify(deniedPayload()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (shouldClarify(query)) {
      return new Response(JSON.stringify(clarificationPayload()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    });

    const { data: chunks, error } = await supabase
      .from("document_chunks")
      .select("id, content, document_id, knowledge_documents(title, source_id, source_type, unit)")
      .limit(2000);

    if (error) throw error;

    const requestedUnit = payload.unit?.toLowerCase().trim();
    const queryLower = query.toLowerCase();
    const queryDomain = resolveQueryDomain(queryLower);
    const emphasisTerms = ["pt", "inr", "aptt", "coag", "fbc", "platelet", "citrate", "edta", "smear", "blood"];
    const queryTokens = queryLower
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !["with", "from", "that", "this", "what", "which", "when"].includes(token));

    const sorted = (chunks ?? [])
      .map((chunk: any) => {
        const relation = chunk.knowledge_documents;
        const meta = Array.isArray(relation) ? relation[0] : relation;
        const content = String(chunk.content || "");
        const title = String(meta?.title || "").toLowerCase();
        const sourceId = String(meta?.source_id || "").toLowerCase();
        const sourceType = String(meta?.source_type || "").toLowerCase();
        const docUnit = String(meta?.unit || "").toLowerCase();
        const normalizedContent = content.toLowerCase();

        const tokenHits = queryTokens.reduce((acc, token) => {
          const inContent = normalizedContent.includes(token) ? 1 : 0;
          const inTitle = title.includes(token) ? 2 : 0;
          const inSource = sourceId.includes(token) ? 3 : 0;
          return acc + inContent + inTitle + inSource;
        }, 0);

        const phraseBoost = queryLower
          .split(" ")
          .filter((part) => part.length > 4)
          .reduce((acc, part) => {
            if (title.includes(part)) return acc + 2;
            if (sourceId.includes(part)) return acc + 2;
            return acc;
          }, 0);

        const termBoost = emphasisTerms.reduce((acc, term) => {
          if (!queryLower.includes(term)) return acc;
          return (
            acc +
            (title.includes(term) ? 2 : 0) +
            (sourceId.includes(term) ? 3 : 0) +
            (normalizedContent.includes(term) ? 1 : 0)
          );
        }, 0);

        const curatedBoost = sourceId.includes("-auto-") ? -2 : 3;
        const sourceTypeBoost = sourceType === "sop" ? 2 : sourceType === "test" || sourceType === "job_aid" ? 1 : 0;
        const unitBoost = requestedUnit && docUnit && (docUnit.includes(requestedUnit) || requestedUnit.includes(docUnit)) ? 2 : 0;

        let domainBoost = 0;
        if (queryDomain) {
          const targetTerms = DOMAIN_TERMS[queryDomain];
          const targetHits = targetTerms.reduce(
            (acc, term) => acc + (title.includes(term) || sourceId.includes(term) || normalizedContent.includes(term) ? 1 : 0),
            0,
          );
          domainBoost += targetHits * 2;

          const otherPenalty = (Object.entries(DOMAIN_TERMS) as [DomainKey, string[]][])
            .filter(([domain]) => domain !== queryDomain)
            .reduce((acc, [, terms]) => {
              const overlap = terms.reduce((sum, term) => sum + (title.includes(term) || sourceId.includes(term) ? 1 : 0), 0);
              return acc + overlap;
            }, 0);
          domainBoost -= otherPenalty > 2 ? 4 : 0;
        }

        const score = tokenHits + phraseBoost + unitBoost + termBoost + curatedBoost + sourceTypeBoost + domainBoost;
        return { chunk, score, tokenHits };
      })
      .sort((a, b) => b.score - a.score);

    const maxScore = sorted[0]?.score ?? 0;
    const ranked = sorted.filter((entry) => entry.score > 0 && entry.tokenHits > 0 && entry.score >= Math.max(4, maxScore - 4)).slice(0, 4);

    if (ranked.length === 0) {
      let genericAnswer = "";
      try {
        const generic = await callGeminiGeneric(query);
        genericAnswer = generic.answer?.trim() ?? "";
      } catch {
        genericAnswer = "";
      }

      const fallback = fallbackNoContext(query);
      return new Response(
        JSON.stringify({
          answer: genericAnswer ? `${genericAnswer}\n\nSource status: no verified SOP/test source was retrieved for this question.` : fallback.answer,
          confidence: genericAnswer ? 0.34 : fallback.confidence,
          sources: [],
          mode: genericAnswer ? "teaching" : fallback.mode,
          accessDenied: false,
          quickActions: [],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const context = ranked
      .map(({ chunk }) => {
        const relation = chunk.knowledge_documents;
        const meta = Array.isArray(relation) ? relation[0] : relation;
        const sourceLabel = meta ? `${meta.source_type}:${meta.source_id} (${meta.title})` : chunk.document_id;
        return `[${sourceLabel}]\n${chunk.content}`;
      })
      .join("\n\n---\n\n");

    const sources = ranked.map(({ chunk }) => {
      const relation = chunk.knowledge_documents;
      const meta = Array.isArray(relation) ? relation[0] : relation;
      return {
        id: meta?.source_id ?? String(chunk.document_id),
        type: meta?.source_type ?? "document",
        title: meta?.title ?? "Knowledge source",
      };
    });

    let answer = "";
    let confidence = ranked.length >= 3 ? 0.86 : 0.62;
    try {
      const modelResult = await callGemini(query, context);
      answer = modelResult.answer;
    } catch {
      const snippets = ranked.map(({ chunk }) => String(chunk.content || ""));
      const fallback = fallbackWithSources(query, sources, snippets);
      answer = fallback.answer;
      confidence = fallback.confidence;
    }

    return new Response(
      JSON.stringify({
        answer,
        confidence,
        sources,
        mode: "teaching",
        accessDenied: false,
        quickActions: [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unable to process AI request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
