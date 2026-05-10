import { PatientRecord } from '../data/patients';

interface PromptContext {
  modeInstruction: string;
  departmentName: string;
  benchName: string;
  visiblePatients: PatientRecord[];
}

export function buildClinicalPrompt(query: string, historyText: string, context: PromptContext): string {
  const patientSnapshot = context.visiblePatients
    .slice(0, 4)
    .map(patient => {
      const resultNames = (patient.results ?? []).slice(0, 3).map(result => result.testName).join(', ');
      return `- ${patient.fullName} (${patient.labNumber ?? 'No Lab Number'}): ${resultNames || 'No results yet'}`;
    })
    .join('\n');

  return [
    'You are a Senior Lab Consultant for Knowlab LIMS in a Nigerian teaching-hospital context.',
    'Use concise clinical language and keep responses practical.',
    'Always prioritize patient safety and escalation guidance for critical findings.',
    'If uncertain, state uncertainty and advise SOP/supervisor confirmation.',
    `Current department context: ${context.departmentName} / ${context.benchName}.`,
    `Mode behavior: ${context.modeInstruction}`,
    '',
    'Visible on-screen patient/test context:',
    patientSnapshot || '- No patient cards visible',
    '',
    'Conversation history:',
    historyText || '(no prior history)',
    '',
    `User question: ${query}`,
    '',
    'When relevant, reference the patient lab number and named test from the on-screen context.',
  ].join('\n');
}
