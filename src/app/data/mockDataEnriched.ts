import type { SOP, LabTest, JobAid } from './mockData';

interface BenchConfig {
  dept: string;
  deptCode: string;
  benches: string[];
}

// 23 benches x 4 SOP = 92 enriched SOPs (+ base library > 100 total).
const BENCHES: BenchConfig[] = [
  { dept: 'Haematology', deptCode: 'HEM', benches: ['FBC & Automated Counts', 'Blood Film & Morphology', 'Coagulation', 'Blood Bank & Transfusion', 'ESR & Special Haematology'] },
  { dept: 'Chemistry', deptCode: 'CHE', benches: ['Glucose & Diabetes Markers', 'Bilirubin & Liver Function Tests', 'Kidney Function Tests', 'Lipid Profile', 'Electrolytes & Minerals'] },
  { dept: 'Microbiology & Parasitology', deptCode: 'MIC', benches: ['Bacteriology', 'Mycology', 'Virology', 'Parasitology', 'Molecular Microbiology'] },
  { dept: 'Histopathology', deptCode: 'HIS', benches: ['Histology', 'Cytology', 'Immunohistochemistry (IHC)', 'Autopsy & Post-Mortem'] },
  { dept: 'Blood Group & Serology', deptCode: 'BGS', benches: ['ABO/Rh Blood Grouping', 'Crossmatching', 'Antibody Screening & ID', 'Serology & Immunology'] },
];

const SOP_TITLE_SUFFIXES = [
  'Core Analytical Procedure',
  'Sample Acceptance and Processing',
  'Quality Control and Result Release',
  'Troubleshooting and Escalation',
];

const TEST_NAME_SUFFIXES = [
  'Routine Panel',
  'Extended Panel',
  'Confirmatory Assay',
  'Urgent Stat Profile',
];

const JOB_AID_BLUEPRINTS: { title: string; type: JobAid['type']; tags: string[] }[] = [
  { title: 'Bench Start-up Checklist', type: 'checklist', tags: ['startup', 'checklist'] },
  { title: 'Error Flag Decision Path', type: 'decision_tree', tags: ['troubleshooting', 'flags'] },
  { title: 'Quick Reference Card', type: 'quick_reference', tags: ['quick-reference', 'bench'] },
];

export const NEW_SOPS: SOP[] = [];
export const NEW_LAB_TESTS: LabTest[] = [];
export const NEW_JOB_AIDS: JobAid[] = [];

let sopIdCounter = 100;
let sopCodeCounter = 100;
let testIdCounter = 100;
let testCodeCounter = 100;
let jobAidIdCounter = 100;

const normalizeBenchToken = (bench: string) =>
  bench
    .replace(/[^a-z0-9 ]/gi, '')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

function buildDetailedSteps(deptCode: string, bench: string) {
  if (deptCode === 'HEM') {
    return [
      { stepNo: 1, title: 'Sample receipt and check', description: `Confirm patient identifiers and collect 2.0 mL whole blood (EDTA for FBC/morphology or citrate 9:1 for coagulation benches). Reject clotted or mislabeled specimens.` },
      { stepNo: 2, title: 'Preparation', description: `Mix specimen gently 8-10 inversions, run background check, then load level 1-3 controls before patient analysis on ${bench}.` },
      { stepNo: 3, title: 'Analysis and verification', description: 'Run patient sample, review analyzer flags, and perform repeat or smear correlation where critical flags appear. Hold release if QC breaches acceptance limits.' },
      { stepNo: 4, title: 'Release and escalation', description: 'Validate result in LIS, communicate critical values with read-back, and document reviewer actions in QC and critical-call registers.' },
    ];
  }
  if (deptCode === 'CHE') {
    return [
      { stepNo: 1, title: 'Specimen setup', description: `Collect 2.5 mL serum/plasma, centrifuge at 3000 rpm for 10 minutes, and verify specimen is non-hemolyzed before loading to ${bench}.` },
      { stepNo: 2, title: 'Reagent and QC prep', description: 'Check reagent lot expiry, calibrator traceability, and run two-level internal controls at start of shift and after lot change.' },
      { stepNo: 3, title: 'Run profile', description: 'Load assay profile, monitor instrument flags, and repeat diluted run for out-of-range analytes according to method linearity sheet.' },
      { stepNo: 4, title: 'Result validation', description: 'Review delta checks, append interference comments where required, and release verified chemistry values with turnaround tracking.' },
    ];
  }
  if (deptCode === 'MIC') {
    return [
      { stepNo: 1, title: 'Specimen triage', description: `Confirm collection site, time, and transport condition for ${bench}; reject leaking or delayed specimens outside method stability.` },
      { stepNo: 2, title: 'Bench preparation', description: 'Label media and controls, set aseptic workspace, and prepare stains/reagents with lot numbers logged before inoculation or microscopy.' },
      { stepNo: 3, title: 'Primary processing', description: 'Perform inoculation/staining workflow, incubate under method-specific conditions, and record preliminary findings at scheduled read intervals.' },
      { stepNo: 4, title: 'Confirmation and reporting', description: 'Correlate morphology/growth with confirmatory methods, apply susceptibility workflow where indicated, and escalate critical findings immediately.' },
    ];
  }
  if (deptCode === 'HIS') {
    return [
      { stepNo: 1, title: 'Accession and grossing', description: `Register specimen in LIS, verify two identifiers, and place tissue in adequate fixative volume (minimum 10:1 fixative-to-tissue ratio).` },
      { stepNo: 2, title: 'Processing', description: 'Dehydrate, clear, and paraffin-embed according to tissue schedule; record cassette/block traceability at each transfer point.' },
      { stepNo: 3, title: 'Sectioning and staining', description: 'Cut 3-5 micron sections, apply primary stain panel with positive/negative controls, and verify stain quality before slide release.' },
      { stepNo: 4, title: 'Quality sign-out', description: 'Perform case reconciliation, pathologist sign-out workflow, and archive blocks/slides with complete chain-of-custody records.' },
    ];
  }
  return [
    { stepNo: 1, title: 'Pre-transfusion checks', description: `Confirm request urgency, patient identifiers, and sample validity for ${bench} workflow before serologic testing.` },
    { stepNo: 2, title: 'Serology setup', description: 'Prepare antisera/cell panels, verify control reactions, and run ABO/Rh or compatibility phases per validated method timings.' },
    { stepNo: 3, title: 'Compatibility verification', description: 'Interpret agglutination grades, resolve discrepancies with repeat or extended panel testing, and block unsafe issue pathways.' },
    { stepNo: 4, title: 'Issue and traceability', description: 'Document final compatibility outcome, release component with dual sign-off, and retain audit trail for haemovigilance review.' },
  ];
}

BENCHES.forEach(({ dept, deptCode, benches }) => {
  benches.forEach((bench) => {
    const benchToken = normalizeBenchToken(bench);
    const sopCodesForBench: string[] = [];

    SOP_TITLE_SUFFIXES.forEach((suffix, idx) => {
      const sopCode = `${deptCode}-SOP-${String(sopCodeCounter++)}`;
      sopCodesForBench.push(sopCode);
      NEW_SOPS.push({
        id: `sop${sopIdCounter++}`,
        code: sopCode,
        title: `${bench}: ${suffix}`,
        department: dept,
        category: bench,
        revision: '01',
        effectiveDate: '01 Mar 2024',
        reviewDate: '01 Mar 2025',
        author: 'Knowlab Editorial Team',
        approvedBy: 'Knowlab Quality Office',
        status: 'active',
        purpose: `Define standardized ${bench.toLowerCase()} workflow with quality and safety controls.`,
        principle: `Use validated bench-specific methods and controlled quality checks for ${bench.toLowerCase()}.`,
        equipment: ['Analyzer workstation', 'Calibrated pipettes', 'Centrifuge', 'Temperature-monitored storage'],
        reagents: ['Primary reagent set', 'Control material (normal/abnormal)', 'Cleaning and wash reagents'],
        steps: buildDetailedSteps(deptCode, bench),
        referenceRanges: [],
        safetyPrecautions: [
          'Use PPE and follow biosafety controls for all specimens.',
          'Do not proceed when QC fails acceptance limits.',
          'Escalate critical values and instrument failures immediately.',
        ],
        relatedTests: [],
        tags: [deptCode.toLowerCase(), benchToken, idx > 1 ? 'advanced' : 'core'],
      });
    });

    TEST_NAME_SUFFIXES.forEach((suffix, idx) => {
      const linkedSop = sopCodesForBench[idx % sopCodesForBench.length];
      NEW_LAB_TESTS.push({
        id: `t${testIdCounter++}`,
        code: `${deptCode}${testCodeCounter++}`,
        name: `${bench} ${suffix}`,
        category: bench,
        turnaround: idx === 3 ? '60-120 minutes' : idx === 2 ? '4-8 hours' : '2-4 hours',
        sampleType: deptCode === 'HIS' ? 'Tissue / Cytology sample' : 'Whole blood / plasma / serum',
        sampleVolume: deptCode === 'HIS' ? 'As collected' : '2.5 mL',
        container: deptCode === 'HIS' ? 'Specimen container with preservative' : idx === 3 ? 'Urgent profile tube' : 'Primary collection tube',
        containerColor: deptCode === 'HEM' ? 'Purple or Light Blue' : deptCode === 'CHE' ? 'Yellow/Gold' : 'Standard per test',
        stability: idx === 3 ? 'Process immediately' : '24-48 hours per method',
        methodology: idx === 2 ? 'Method-specific confirmatory assay' : 'Validated automated or bench workflow',
        relatedSop: linkedSop,
        parameters: [
          { name: 'Primary marker', unit: '', maleRange: 'Within reference for method', femaleRange: 'Within reference for method' },
        ],
        clinicalSignificance: `Supports ${bench.toLowerCase()} interpretation for diagnosis, monitoring, and treatment decisions.`,
        indications: ['Routine clinical evaluation', 'Follow-up monitoring', 'Urgent or confirmatory requests when indicated'],
        specialInstructions: 'Reject unsuitable specimens and follow pre-analytical rejection criteria before testing.',
        status: 'active',
      });
    });

    JOB_AID_BLUEPRINTS.forEach((aid) => {
      NEW_JOB_AIDS.push({
        id: `ja${jobAidIdCounter++}`,
        title: `${bench} ${aid.title}`,
        category: bench,
        type: aid.type,
        description: `Operational support aid for ${bench.toLowerCase()} to improve consistency and reduce avoidable errors.`,
        steps: [
          'Confirm bench readiness, consumables, and control material status at start of shift.',
          'Apply acceptance criteria and document any specimen or instrument exceptions.',
          'Follow escalation pathway for QC failure, critical values, or unresolved technical issues.',
          'Close shift with traceable documentation and handover notes for continuity.',
        ],
        lastUpdated: '2024-04-01',
        tags: [deptCode.toLowerCase(), benchToken, ...aid.tags],
      });
    });
  });
});
