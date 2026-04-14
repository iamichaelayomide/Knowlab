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

type BenchContent = {
  sopTitles: string[];
  testNames: string[];
  jobAidTitles: string[];
  purpose: string;
  principle: string;
  testSummary: string;
  specialInstruction: string;
};

const SPECIFIC_BENCH_CONTENT: Record<string, Record<string, BenchContent>> = {
  MIC: {
    'Bacteriology': {
      sopTitles: [
        'Blood Culture Inoculation and Incubation',
        'Urine Culture Quantitation and Workup',
        'Gram Stain and Preliminary Reporting',
        'Culture Contamination Review and Rejection Criteria',
      ],
      testNames: [
        'Blood Culture and Sensitivity',
        'Midstream Urine Culture and Sensitivity',
        'Wound Swab Culture and Sensitivity',
        'Sputum Culture and Gram Stain',
      ],
      jobAidTitles: [
        'Bacteriology Specimen Acceptance Checklist',
        'Blood Culture Bottle Loading Decision Path',
        'Culture Plate Reading Quick Reference',
      ],
      purpose: 'Define a precise bacteriology workflow for culture, microscopy, and susceptibility testing with strict contamination control.',
      principle: 'Use aseptic inoculation, validated incubation conditions, and clear interpretation rules for organism recovery and reporting.',
      testSummary: 'A specific bacteriology assay with culture identification, preliminary Gram reaction review, and susceptibility follow-up where required.',
      specialInstruction: 'Reject leaking, delayed, or improperly labelled specimens before culture setup.',
    },
    'Mycology': {
      sopTitles: [
        'KOH Microscopy and Fungal Culture',
        'Dermatophyte Identification and Reporting',
        'Yeast Isolation and Antifungal Setup',
        'Fungal Specimen Rejection and Decontamination',
      ],
      testNames: [
        'KOH Wet Mount for Fungi',
        'Fungal Culture and Identification',
        'Dermatophyte Culture',
        'Yeast Identification and Sensitivity',
      ],
      jobAidTitles: [
        'Mycology Specimen Acceptance Checklist',
        'Fungal Morphology Decision Tree',
        'Mycology Culture Reading Quick Reference',
      ],
      purpose: 'Define a precise mycology workflow for direct microscopy, fungal culture, and morphology-based reporting.',
      principle: 'Use direct microscopy, culture characteristics, and confirmatory interpretation to distinguish moulds, dermatophytes, and yeasts.',
      testSummary: 'A specific mycology assay used to detect and identify fungal elements from skin, nail, and other clinical specimens.',
      specialInstruction: 'Keep fungal specimens dry, well-labelled, and protected from contamination during transport and plating.',
    },
    'Virology': {
      sopTitles: [
        'Viral Marker Screening and Confirmation',
        'HBsAg and Hepatitis B Profile Workflow',
        'HIV 1/2 Screening and Reflex Testing',
        'HCV Antibody and Viral Marker Review',
      ],
      testNames: [
        'HIV 1/2 Antibody/Antigen Screening',
        'HBsAg and Hepatitis B Profile',
        'HCV Antibody Screening',
        'Viral Marker Panel',
      ],
      jobAidTitles: [
        'Virology Sample Acceptance Checklist',
        'Reactive Serology Follow-up Decision Path',
        'Virology Result Comment Quick Reference',
      ],
      purpose: 'Define a precise virology serology workflow for screening, confirmation, and result review.',
      principle: 'Apply validated immunoassay screening with clear reactive/non-reactive interpretation and confirmatory follow-up where required.',
      testSummary: 'A specific virology assay panel used for infectious marker screening and reflex confirmation.',
      specialInstruction: 'Handle all reactive specimens according to infectious disease confirmation and disclosure rules.',
    },
    'Parasitology': {
      sopTitles: [
        'Malaria Thick and Thin Film Examination',
        'Stool Ova, Cysts, and Parasite Examination',
        'Microfilaria and Helminth Detection',
        'Rapid Parasite Antigen Testing',
      ],
      testNames: [
        'Malaria Thick and Thin Film Microscopy',
        'Stool Ova, Cysts, and Parasites',
        'Microfilaria Detection',
        'Malaria Antigen Rapid Test',
      ],
      jobAidTitles: [
        'Parasitology Specimen Acceptance Checklist',
        'Malaria Film Reading Decision Tree',
        'Parasite Morphology Quick Reference',
      ],
      purpose: 'Define a precise parasitology workflow for parasite detection, microscopy, and urgent malaria reporting.',
      principle: 'Use stained smears, concentration methods, and rapid antigen testing to identify parasites with clear reporting thresholds.',
      testSummary: 'A specific parasitology assay used for malaria, intestinal parasites, or blood-borne parasite detection.',
      specialInstruction: 'Prioritize fresh specimens and process stool, blood, and capillary samples according to parasite stability requirements.',
    },
    'Molecular Microbiology': {
      sopTitles: [
        'DNA Extraction and PCR Setup',
        'GeneXpert MTB/RIF Assay',
        'Viral Load Amplification and Detection',
        'Contamination Control and Amplicon Review',
      ],
      testNames: [
        'MTB/RIF PCR',
        'HPV DNA PCR',
        'Viral Load Quantification',
        'Multiplex Respiratory Pathogen PCR',
      ],
      jobAidTitles: [
        'Molecular Sample Acceptance Checklist',
        'PCR Contamination Control Decision Path',
        'Amplification Run Review Quick Reference',
      ],
      purpose: 'Define a precise molecular workflow for extraction, amplification, and contamination-safe result release.',
      principle: 'Use nucleic acid extraction, target amplification, and run controls to deliver specific molecular identification.',
      testSummary: 'A specific molecular assay used for pathogen detection, quantification, or resistance marker identification.',
      specialInstruction: 'Maintain strict separation of extraction, setup, and amplification areas to avoid carryover contamination.',
    },
  },
  HIS: {
    'Histology': {
      sopTitles: [
        'Tissue Fixation and Grossing',
        'Paraffin Processing and Embedding',
        'H&E Sectioning and Staining',
        'Frozen Section and Urgent Turnaround',
      ],
      testNames: [
        'Routine H&E Histology',
        'Special Stain Panel',
        'Frozen Section Request',
        'Specimen Gross Examination',
      ],
      jobAidTitles: [
        'Histology Specimen Acceptance Checklist',
        'Grossing and Cassette Labelling Quick Reference',
        'Section Quality Review Decision Path',
      ],
      purpose: 'Define a precise histology workflow from fixation through microscopic slide release.',
      principle: 'Use controlled fixation, tissue processing, and staining to preserve morphology for diagnosis.',
      testSummary: 'A specific histology workflow used to prepare and review tissue sections for diagnosis.',
      specialInstruction: 'Ensure the tissue is fully fixed and correctly cassette-labelled before processing.',
    },
    'Cytology': {
      sopTitles: [
        'Pap Smear Preparation and Reporting',
        'Fine Needle Aspiration Cytology',
        'Body Fluid Cytology Review',
        'Slide Fixation and Adequacy Assessment',
      ],
      testNames: [
        'Pap Smear Cytology',
        'Fine Needle Aspiration Cytology',
        'Pleural or Ascitic Fluid Cytology',
        'Liquid-Based Cytology Screening',
      ],
      jobAidTitles: [
        'Cytology Specimen Acceptance Checklist',
        'Smear Adequacy and Fixation Decision Tree',
        'Cytology Result Comment Quick Reference',
      ],
      purpose: 'Define a precise cytology workflow for smear preparation, adequacy review, and reporting.',
      principle: 'Use rapid fixation, adequate cellularity assessment, and morphologic review to support cytologic diagnosis.',
      testSummary: 'A specific cytology assay used for cervical, aspirate, or fluid specimen evaluation.',
      specialInstruction: 'Fix slides immediately and reject dried or poorly prepared smears when adequacy is compromised.',
    },
    'Immunohistochemistry (IHC)': {
      sopTitles: [
        'IHC Slide Preparation and Antigen Retrieval',
        'Breast Marker Panel Reporting',
        'Proliferation Marker Review',
        'Control Validation and Batch Release',
      ],
      testNames: [
        'ER/PR/HER2 IHC Panel',
        'Ki-67 Proliferation Index',
        'Lymphoma Marker Panel',
        'PD-L1 Immunostaining Review',
      ],
      jobAidTitles: [
        'IHC Run Acceptance Checklist',
        'Control Slide Review Decision Tree',
        'Marker Interpretation Quick Reference',
      ],
      purpose: 'Define a precise IHC workflow for antigen retrieval, staining, control review, and reporting.',
      principle: 'Use validated antibody panels, matched controls, and structured interpretation for immunophenotyping.',
      testSummary: 'A specific IHC assay used to detect tissue markers for diagnosis, classification, and treatment selection.',
      specialInstruction: 'Do not release a batch until positive and negative controls are acceptable.',
    },
    'Autopsy & Post-Mortem': {
      sopTitles: [
        'Consent Verification and Case Reception',
        'External Examination and Documentation',
        'Internal Examination and Tissue Sampling',
        'Autopsy Reporting and Case Release',
      ],
      testNames: [
        'Full Autopsy Examination',
        'Post-Mortem Histology Sampling',
        'Cause of Death Correlation Review',
        'Perinatal or Medicolegal Post-Mortem Review',
      ],
      jobAidTitles: [
        'Autopsy Consent and ID Checklist',
        'Post-Mortem Sampling Quick Reference',
        'Case Closure and Handover Decision Path',
      ],
      purpose: 'Define a precise post-mortem workflow for consent, examination, tissue sampling, and reporting.',
      principle: 'Use structured external and internal examination with traceable sampling and controlled release of findings.',
      testSummary: 'A specific autopsy workflow used for medicolegal or hospital pathology review.',
      specialInstruction: 'Verify consent, identification, and chain of custody before any dissection or sample release.',
    },
  },
  BGS: {
    'ABO/Rh Blood Grouping': {
      sopTitles: [
        'ABO Forward and Reverse Grouping',
        'RhD Typing and Weak D Resolution',
        'Duplicate Group Verification',
        'Grouping Discrepancy Investigation',
      ],
      testNames: [
        'ABO/Rh Blood Grouping',
        'Forward and Reverse Grouping',
        'RhD Weak D Testing',
        'Grouping Discrepancy Resolution',
      ],
      jobAidTitles: [
        'ABO/Rh Specimen Acceptance Checklist',
        'Grouping Discrepancy Decision Tree',
        'Blood Group Reporting Quick Reference',
      ],
      purpose: 'Define a precise blood grouping workflow for ABO and RhD typing with discrepancy control.',
      principle: 'Use forward and reverse grouping with controlled interpretation to ensure transfusion safety.',
      testSummary: 'A specific blood group assay used to determine ABO and RhD status with discrepancy resolution where needed.',
      specialInstruction: 'Perform a duplicate check before release and investigate any grouping mismatch immediately.',
    },
    Crossmatching: {
      sopTitles: [
        'Immediate Spin Crossmatch',
        'Indirect Antiglobulin Crossmatch',
        'Electronic Issue Eligibility Review',
        'Compatibility Discrepancy Resolution',
      ],
      testNames: [
        'Immediate Spin Crossmatch',
        'IAT Crossmatch',
        'Electronic Crossmatch Review',
        'Compatibility Investigation',
      ],
      jobAidTitles: [
        'Crossmatch Acceptance Checklist',
        'Compatibility Reaction Decision Path',
        'Issue and Traceability Quick Reference',
      ],
      purpose: 'Define a precise crossmatching workflow for compatibility testing and safe blood issue.',
      principle: 'Use serologic compatibility checks and documented release criteria before transfusion.',
      testSummary: 'A specific compatibility assay used to confirm donor and recipient red cell compatibility.',
      specialInstruction: 'Do not issue blood until compatibility is fully resolved and documented.',
    },
    'Antibody Screening & ID': {
      sopTitles: [
        'Antibody Screen Panel and Interpretation',
        'Antibody Identification Panel',
        'Red Cell Phenotyping and Matching',
        'Transfusion Reaction Serology Workup',
      ],
      testNames: [
        'Antibody Screen',
        'Antibody Identification',
        'Red Cell Phenotyping',
        'Transfusion Reaction Serology',
      ],
      jobAidTitles: [
        'Antibody Screen Acceptance Checklist',
        'Reaction Pattern Decision Tree',
        'Panel Interpretation Quick Reference',
      ],
      purpose: 'Define a precise antibody workup workflow for screening, identification, and antigen matching.',
      principle: 'Use structured panel interpretation and phenotype matching to prevent incompatible transfusion.',
      testSummary: 'A specific serologic assay used to detect and identify unexpected red cell antibodies.',
      specialInstruction: 'Record transfusion and pregnancy history before interpreting panel reactions.',
    },
    'Serology & Immunology': {
      sopTitles: [
        'Infectious Serology Screening',
        'Reactive Sample Confirmation',
        'Result Interpretation and Commenting',
        'Repeat Testing and Sample Rejection',
      ],
      testNames: [
        'HBsAg Screening',
        'HIV 1/2 Serology Screening',
        'HCV Antibody Screening',
        'Syphilis Serology Screening',
      ],
      jobAidTitles: [
        'Serology Sample Acceptance Checklist',
        'Reactive Result Confirmation Decision Tree',
        'Serology Comment Quick Reference',
      ],
      purpose: 'Define a precise serology workflow for infectious screening and confirmation.',
      principle: 'Use validated screening assays with confirmatory testing and clear interpretive comments.',
      testSummary: 'A specific serology assay used for infectious disease screening and follow-up confirmation.',
      specialInstruction: 'Escalate any reactive sample through the confirmatory pathway before final release.',
    },
  },
};

function getBenchContent(deptCode: string, bench: string) {
  return SPECIFIC_BENCH_CONTENT[deptCode]?.[bench];
}

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
      { stepNo: 1, title: 'Specimen triage', description: `Confirm collection site, time, and transport condition for ${bench}; reject leaking, delayed, or contaminated specimens outside method stability.` },
      { stepNo: 2, title: 'Bench preparation', description: `Label media and controls, set the aseptic workspace, and prepare stains or reagents before ${bench.toLowerCase()} processing.` },
      { stepNo: 3, title: 'Primary processing', description: `Perform the ${bench.toLowerCase()} workflow, incubate or examine under method-specific conditions, and record preliminary findings at scheduled read intervals.` },
      { stepNo: 4, title: 'Confirmation and reporting', description: 'Correlate morphology or growth with confirmatory methods, apply susceptibility workflow where indicated, and escalate critical findings immediately.' },
    ];
  }
  if (deptCode === 'HIS') {
    return [
      { stepNo: 1, title: 'Accession and grossing', description: `Register the specimen in LIS, verify two identifiers, and place tissue in adequate fixative volume for ${bench}.` },
      { stepNo: 2, title: 'Processing', description: 'Dehydrate, clear, and paraffin-embed according to tissue schedule; record cassette and block traceability at each transfer point.' },
      { stepNo: 3, title: 'Sectioning and staining', description: 'Cut 3-5 micron sections, apply the requested stain panel with positive and negative controls, and verify slide quality before release.' },
      { stepNo: 4, title: 'Quality sign-out', description: 'Perform case reconciliation, pathologist sign-out workflow, and archive blocks and slides with complete chain-of-custody records.' },
    ];
  }
  return [
    { stepNo: 1, title: 'Pre-transfusion checks', description: `Confirm request urgency, patient identifiers, and sample validity for ${bench} before serologic testing.` },
    { stepNo: 2, title: 'Serology setup', description: `Prepare antisera or cell panels, verify control reactions, and run the ${bench.toLowerCase()} workflow per validated timings.` },
    { stepNo: 3, title: 'Compatibility verification', description: 'Interpret agglutination grades, resolve discrepancies with repeat or extended panel testing, and block unsafe issue pathways.' },
    { stepNo: 4, title: 'Issue and traceability', description: 'Document final compatibility outcome, release the component with dual sign-off, and retain the audit trail for haemovigilance review.' },
  ];
}

BENCHES.forEach(({ dept, deptCode, benches }) => {
  benches.forEach((bench) => {
    const benchToken = normalizeBenchToken(bench);
    const sopCodesForBench: string[] = [];
    const benchContent = getBenchContent(deptCode, bench);

    SOP_TITLE_SUFFIXES.forEach((suffix, idx) => {
      const sopCode = `${deptCode}-SOP-${String(sopCodeCounter++)}`;
      sopCodesForBench.push(sopCode);
      NEW_SOPS.push({
        id: `sop${sopIdCounter++}`,
        code: sopCode,
        title: benchContent?.sopTitles[idx] ?? `${bench}: ${suffix}`,
        department: dept,
        category: bench,
        revision: '01',
        effectiveDate: '01 Mar 2024',
        reviewDate: '01 Mar 2025',
        author: 'Knowlab Editorial Team',
        approvedBy: 'Knowlab Quality Office',
        status: 'active',
        purpose: benchContent?.purpose ?? `Define standardized ${bench.toLowerCase()} workflow with quality and safety controls.`,
        principle: benchContent?.principle ?? `Use validated bench-specific methods and controlled quality checks for ${bench.toLowerCase()}.`,
        equipment: ['Analyzer workstation', 'Calibrated pipettes', 'Centrifuge', 'Temperature-monitored storage'],
        reagents: ['Primary reagent set', 'Control material (normal/abnormal)', 'Cleaning and wash reagents'],
        steps: buildDetailedSteps(deptCode, bench),
        referenceRanges: [],
        safetyPrecautions: [
          'Use PPE and follow biosafety controls for all specimens.',
          'Do not proceed when QC fails acceptance limits.',
          'Escalate critical values and instrument failures immediately.',
        ],
        relatedTests: benchContent?.testNames ?? [],
        tags: [deptCode.toLowerCase(), benchToken, idx > 1 ? 'advanced' : 'core'],
      });
    });

    TEST_NAME_SUFFIXES.forEach((suffix, idx) => {
      const linkedSop = sopCodesForBench[idx % sopCodesForBench.length];
      const specificTestName = benchContent?.testNames[idx] ?? `${bench} ${suffix}`;
      NEW_LAB_TESTS.push({
        id: `t${testIdCounter++}`,
        code: `${deptCode}${testCodeCounter++}`,
        name: specificTestName,
        category: bench,
        turnaround: idx === 3 ? '60-120 minutes' : idx === 2 ? '4-8 hours' : '2-4 hours',
        sampleType: deptCode === 'HIS' ? 'Tissue / Cytology sample' : 'Whole blood / plasma / serum',
        sampleVolume: deptCode === 'HIS' ? 'As collected' : '2.5 mL',
        container: deptCode === 'HIS' ? 'Specimen container with preservative' : idx === 3 ? 'Urgent profile tube' : 'Primary collection tube',
        containerColor: deptCode === 'HEM' ? 'Purple or Light Blue' : deptCode === 'CHE' ? 'Yellow/Gold' : 'Standard per test',
        stability: idx === 3 ? 'Process immediately' : '24-48 hours per method',
        methodology: benchContent?.testSummary ?? (idx === 2 ? 'Method-specific confirmatory assay' : 'Validated automated or bench workflow'),
        relatedSop: linkedSop,
        parameters: [
          { name: 'Primary marker', unit: '', maleRange: 'Within reference for method', femaleRange: 'Within reference for method' },
        ],
        clinicalSignificance: benchContent?.testSummary ?? `Supports ${bench.toLowerCase()} interpretation for diagnosis, monitoring, and treatment decisions.`,
        indications: ['Routine clinical evaluation', 'Follow-up monitoring', 'Urgent or confirmatory requests when indicated'],
        specialInstructions: benchContent?.specialInstruction ?? 'Reject unsuitable specimens and follow pre-analytical rejection criteria before testing.',
        status: 'active',
      });
    });

    JOB_AID_BLUEPRINTS.forEach((aid) => {
      const specificTitle = benchContent?.jobAidTitles[JOB_AID_BLUEPRINTS.indexOf(aid)];
      NEW_JOB_AIDS.push({
        id: `ja${jobAidIdCounter++}`,
        title: specificTitle ?? `${bench} ${aid.title}`,
        category: bench,
        type: aid.type,
        description: benchContent
          ? `${benchContent.purpose} This aid supports ${bench.toLowerCase()} operators with practical, stepwise bench control.`
          : `Operational support aid for ${bench.toLowerCase()} to improve consistency and reduce avoidable errors.`,
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
