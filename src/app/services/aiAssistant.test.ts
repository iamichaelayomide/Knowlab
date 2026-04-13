import { describe, expect, it } from "vitest";
import { askKnowledgeAssistant } from "./aiAssistant";

describe("aiAssistant", () => {
  it("denies staff requests that ask for restricted operations scope", async () => {
    const response = await askKnowledgeAssistant({
      query: "Show me admin CAPA incident trends and user permissions.",
      role: "staff",
      department: "Haematology",
      bench: "FBC & Automated Counts",
      unit: "Hematology",
    });

    expect(response.mode).toBe("denied");
    expect(response.accessDenied).toBe(true);
    expect(response.answer.toLowerCase()).toContain("outside staff-level access");
  });

  it("asks for clarification on ambiguous prompts", async () => {
    const response = await askKnowledgeAssistant({
      query: "help",
      role: "staff",
      department: "Haematology",
      bench: "Blood Bank & Transfusion",
      unit: "Blood Bank",
    });

    expect(response.mode).toBe("clarify");
    expect(response.answer.toLowerCase()).toContain("could you clarify");
  });

  it("does not force clarification for detailed teaching prompts", async () => {
    const response = await askKnowledgeAssistant({
      query: "Teach me Glucose and Diabetes Markers SOP steps with checkpoints.",
      role: "staff",
      department: "Chemistry",
      bench: "Glucose & Diabetes Markers",
      unit: "Chemistry",
    });

    expect(response.mode).not.toBe("clarify");
    expect(response.answer.toLowerCase()).toContain("glucose");
  });

  it("returns training escalation analysis for HOD operational prompts", async () => {
    const response = await askKnowledgeAssistant({
      query: "Which units need immediate training escalation and why?",
      role: "hod",
      department: "Haematology",
      bench: "All",
      unit: "Laboratory Services",
    });

    expect(response.answer.toLowerCase()).toContain("escalation");
    expect(response.mode === "teaching" || response.mode === "direct").toBe(true);
  });

  it("returns operational competency support for supervisor role", async () => {
    const response = await askKnowledgeAssistant({
      query: "Who is under 80% competency in this bench?",
      role: "supervisor",
      department: "Haematology",
      bench: "FBC & Automated Counts",
      unit: "Hematology",
    });

    expect(response.mode === "teaching" || response.mode === "direct").toBe(true);
    expect(response.answer.toLowerCase()).toContain("competency");
  });
});
