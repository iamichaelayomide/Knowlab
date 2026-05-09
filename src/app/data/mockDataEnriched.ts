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
  HEM: {
    'FBC & Automated Counts': {
      sopTitles: [
        'Analyzer Startup and Daily QC',
        'Specimen Receipt and FBC Processing',
        'Flag Review and Smear Reflex Criteria',
        'Result Validation and Maintenance Shutdown',
      ],
      testNames: [
        'Full Blood Count (FBC)',
        'Full Blood Count with Differential',
        'Reticulocyte Count',
        'Platelet Count',
      ],
      jobAidTitles: [
        'FBC Specimen Acceptance Checklist',
        'Analyzer Flag Decision Tree',
        'FBC Smear Review Quick Reference',
      ],
      purpose: 'Define a precise FBC workflow for analyzer use, smear reflex, and result release.',
      principle: 'Use validated hematology analyzer settings, QC acceptance, and smear review criteria to report complete blood count results.',
      testSummary: 'A specific full blood count assay used to quantify red cells, white cells, and platelets with reflex review when flags appear.',
      specialInstruction: 'Reject clotted or underfilled EDTA samples before analysis.',
    },
    'Blood Film & Morphology': {
      sopTitles: [
        'Peripheral Smear Preparation and Staining',
        'Microscopy and Differential Counting',
        'Malaria Parasite Review and Morphology Notes',
        'Film Quality Control and Result Escalation',
      ],
      testNames: [
        'Peripheral Blood Film',
        'Manual Differential Count',
        'Malaria Parasite Film Examination',
        'Sickle Cell Screening',
      ],
      jobAidTitles: [
        'Blood Film Specimen Acceptance Checklist',
        'Morphology Reporting Decision Tree',
        'Smear Quality Quick Reference',
      ],
      purpose: 'Define a precise blood film workflow for smear preparation, morphology review, and parasite detection.',
      principle: 'Use standard smear preparation and microscopy rules to identify cell morphology, parasites, and abnormal forms.',
      testSummary: 'A specific blood film assay used for morphology review, differential count, and parasite detection.',
      specialInstruction: 'Prepare the smear promptly from fresh EDTA blood and avoid thick, uneven films.',
    },
    Coagulation: {
      sopTitles: [
        'PT/INR Analysis and Calibration',
        'APTT and Intrinsic Pathway Review',
        'Fibrinogen and Clot Curve Validation',
        'Coagulation QC and Pre-Analytical Error Review',
      ],
      testNames: [
        'Prothrombin Time and INR',
        'Activated Partial Thromboplastin Time',
        'Fibrinogen Assay',
        'D-dimer Screening',
      ],
      jobAidTitles: [
        'Coagulation Sample Acceptance Checklist',
        'Citrate Tube Fill and Rejection Decision Path',
        'Coagulation Result Validation Quick Reference',
      ],
      purpose: 'Define a precise coagulation workflow for PT, APTT, and related hemostasis testing.',
      principle: 'Use correctly filled citrate plasma, validated clotting reagents, and QC acceptance rules to report hemostasis results.',
      testSummary: 'A specific coagulation assay used to assess clotting pathways and anticoagulant monitoring.',
      specialInstruction: 'Reject underfilled citrate tubes and hemolyzed specimens immediately.',
    },
    'Blood Bank & Transfusion': {
      sopTitles: [
        'ABO and RhD Grouping',
        'Compatibility Crossmatch',
        'Antibody Screen and Discrepancy Review',
        'Transfusion Release and Traceability',
      ],
      testNames: [
        'ABO and RhD Grouping',
        'Crossmatch Compatibility Test',
        'Antibody Screen',
        'Direct Antiglobulin Test (DAT)',
      ],
      jobAidTitles: [
        'Transfusion Sample Acceptance Checklist',
        'Compatibility Decision Tree',
        'Blood Issue Quick Reference',
      ],
      purpose: 'Define a precise blood bank workflow for grouping, compatibility testing, and safe component issue.',
      principle: 'Use forward and reverse grouping, compatibility testing, and traceable release controls to protect recipients.',
      testSummary: 'A specific transfusion assay used to confirm group, compatibility, and blood issue safety.',
      specialInstruction: 'Do not issue blood until grouping and compatibility are fully verified.',
    },
    'ESR & Special Haematology': {
      sopTitles: [
        'Westergren ESR Setup and Reading',
        'Reticulocyte Count and Marrow Response Review',
        'Sickle Screening and Special Test Handling',
        'Special Haematology QC and Reporting',
      ],
      testNames: [
        'Erythrocyte Sedimentation Rate',
        'Reticulocyte Count',
        'Sickle Cell Screening',
        'Haemoglobin Electrophoresis',
      ],
      jobAidTitles: [
        'ESR Acceptance Checklist',
        'Special Haematology Decision Tree',
        'ESR and Retic Quick Reference',
      ],
      purpose: 'Define a precise special haematology workflow for ESR, reticulocytes, and related manual assays.',
      principle: 'Use standard dilution, timing, and microscopy rules to report inflammatory and red cell response testing.',
      testSummary: 'A specific special haematology assay used for ESR, reticulocyte, and manual screening review.',
      specialInstruction: 'Set ESR tubes promptly and keep the rack perfectly vertical and vibration free.',
    },
  },
  CHE: {
    'Glucose & Diabetes Markers': {
      sopTitles: [
        'Fasting Glucose Analysis and QC',
        'Random Glucose and Critical Value Review',
        'HbA1c Workflow and Result Validation',
        'OGTT Sample Timing and Reporting',
      ],
      testNames: [
        'Fasting Blood Glucose',
        'Random Blood Glucose',
        'HbA1c',
        'Oral Glucose Tolerance Test',
      ],
      jobAidTitles: [
        'Glucose Specimen Acceptance Checklist',
        'Diabetes Marker Decision Tree',
        'Glucose Result Comment Quick Reference',
      ],
      purpose: 'Define a precise diabetes marker workflow for glucose, HbA1c, and tolerance testing.',
      principle: 'Use validated enzymatic or chromatographic methods with fasting status and critical value control.',
      testSummary: 'A specific chemistry assay used to assess glycemic control, diabetes screening, and monitoring.',
      specialInstruction: 'Confirm fasting status where required and escalate critically low or high glucose immediately.',
    },
    'Bilirubin & Liver Function Tests': {
      sopTitles: [
        'Bilirubin and Liver Panel Setup',
        'AST/ALT/ALP Interpretation Support',
        'Albumin and Total Protein Review',
        'Hemolysis and Interference Rejection',
      ],
      testNames: [
        'Total and Direct Bilirubin',
        'Alanine Aminotransferase (ALT)',
        'Aspartate Aminotransferase (AST)',
        'Alkaline Phosphatase (ALP)',
      ],
      jobAidTitles: [
        'LFT Specimen Acceptance Checklist',
        'Jaundice Panel Decision Tree',
        'Liver Panel Quick Reference',
      ],
      purpose: 'Define a precise liver chemistry workflow for bilirubin and hepatic enzyme interpretation.',
      principle: 'Use validated enzymatic assays and interference checks to report hepatobiliary function results.',
      testSummary: 'A specific liver chemistry assay used to assess hepatocellular injury and cholestatic patterns.',
      specialInstruction: 'Reject heavily hemolyzed specimens and repeat when reagent or analyzer flags indicate interference.',
    },
    'Kidney Function Tests': {
      sopTitles: [
        'Urea and Creatinine Analysis',
        'Estimated GFR and Renal Panel Review',
        'Uric Acid and Renal Marker Reporting',
        'Renal Specimen QC and Rejection Criteria',
      ],
      testNames: [
        'Urea',
        'Creatinine',
        'Estimated GFR',
        'Uric Acid',
      ],
      jobAidTitles: [
        'Renal Specimen Acceptance Checklist',
        'Kidney Panel Decision Tree',
        'Renal Result Comment Quick Reference',
      ],
      purpose: 'Define a precise kidney chemistry workflow for renal function testing and clearance review.',
      principle: 'Use validated renal chemistry assays and calculation rules to report filtration and excretion markers.',
      testSummary: 'A specific renal chemistry assay used to evaluate kidney function and filtration status.',
      specialInstruction: 'Verify sample quality and do not report estimated values until the creatinine result is validated.',
    },
    'Lipid Profile': {
      sopTitles: [
        'Lipid Panel Analysis and QC',
        'Triglyceride and Cholesterol Review',
        'HDL and LDL Calculation Workflow',
        'Fasting Status and Lipemia Interpretation',
      ],
      testNames: [
        'Total Cholesterol',
        'Triglycerides',
        'HDL Cholesterol',
        'LDL Cholesterol',
      ],
      jobAidTitles: [
        'Lipid Specimen Acceptance Checklist',
        'Cardiovascular Risk Decision Tree',
        'Lipid Result Quick Reference',
      ],
      purpose: 'Define a precise lipid workflow for cardiovascular risk profiling and fasting review.',
      principle: 'Use calibrated enzymatic assays and calculation rules to report lipid fractions and risk markers.',
      testSummary: 'A specific lipid assay used to assess cardiovascular risk and dyslipidemia.',
      specialInstruction: 'Document fasting status where required and note lipemic interference when present.',
    },
    'Electrolytes & Minerals': {
      sopTitles: [
        'Electrolyte Analysis and ISE QC',
        'Sodium, Potassium, and Chloride Review',
        'Calcium and Magnesium Reporting',
        'Critical Electrolyte Escalation Workflow',
      ],
      testNames: [
        'Sodium',
        'Potassium',
        'Chloride',
        'Calcium',
      ],
      jobAidTitles: [
        'Electrolyte Specimen Acceptance Checklist',
        'Critical Value Decision Tree',
        'Electrolyte Result Quick Reference',
      ],
      purpose: 'Define a precise electrolyte workflow for ion-selective and mineral testing.',
      principle: 'Use calibrated ISE or enzymatic methods with critical value escalation for electrolyte imbalance.',
      testSummary: 'A specific electrolyte assay used to evaluate sodium, potassium, chloride, calcium, and related mineral balance.',
      specialInstruction: 'Escalate critical potassium or sodium results immediately and verify sample integrity before release.',
    },
  },
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
        'Sputum Culture and Sensitivity',
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
        'HBsAg Screening',
        'HCV Antibody Screening',
        'SARS-CoV-2 Antigen Test',
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
        'HBV DNA PCR',
        'HCV RNA PCR',
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
        'Periodic Acid-Schiff (PAS) Stain',
        'Masson Trichrome Stain',
        'Frozen Section',
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
        'p53 Immunostaining',
        'PD-L1 Immunostaining',
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
        'Limited Autopsy Examination',
        'Post-Mortem Histology Sampling',
        'Medicolegal Post-Mortem Review',
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
        'ABO and RhD Grouping',
        'Forward and Reverse Grouping',
        'Weak D Testing',
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
        'Electronic Crossmatch',
        'Major Crossmatch',
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

type TestProfile = {
  sampleType: string;
  sampleVolume: string;
  container: string;
  containerColor: string;
  stability: string;
  methodology: string;
  parameterName: string;
  rangeText: string;
};

function getParameterName(testName: string) {
  const name = testName.toLowerCase();
  if (name.includes('full blood count')) return 'FBC parameters';
  if (name.includes('reticulocyte')) return 'Reticulocyte count';
  if (name.includes('platelet')) return 'Platelet count';
  if (name.includes('peripheral blood film')) return 'Morphology review';
  if (name.includes('manual differential')) return 'Differential count';
  if (name.includes('malaria parasite')) return 'Parasite detection';
  if (name.includes('sickle')) return 'HbS screen';
  if (name.includes('haemoglobin electrophoresis')) return 'Hb fractions';
  if (name.includes('prothrombin time')) return 'PT / INR';
      if (name.includes('aptt')) return 'APTT';
      if (name.includes('fibrinogen')) return 'Fibrinogen';
      if (name.includes('d-dimer')) return 'D-dimer';
  if (name.includes('glucose')) return 'Glucose';
  if (name.includes('hba1c')) return 'HbA1c';
  if (name.includes('bilirubin')) return 'Bilirubin';
  if (name.includes('aminotransferase') || name.includes('ast') || name.includes('alt')) return 'Enzyme activity';
  if (name.includes('alkaline phosphatase')) return 'ALP';
  if (name.includes('urea')) return 'Urea';
  if (name.includes('creatinine')) return 'Creatinine';
  if (name.includes('egfr') || name.includes('gfr')) return 'Estimated GFR';
  if (name.includes('cholesterol')) return 'Cholesterol fraction';
  if (name.includes('triglycerides')) return 'Triglycerides';
  if (name.includes('sodium')) return 'Sodium';
  if (name.includes('potassium')) return 'Potassium';
  if (name.includes('chloride')) return 'Chloride';
  if (name.includes('calcium')) return 'Calcium';
  if (name.includes('magnesium')) return 'Magnesium';
  if (name.includes('culture')) return 'Culture result';
  if (name.includes('koh')) return 'Fungal elements';
  if (name.includes('antigen')) return 'Antigen result';
  if (name.includes('antibody')) return 'Antibody result';
  if (name.includes('pcr') || name.includes('xpert')) return 'Target detection';
  if (name.includes('histology') || name.includes('special stain') || name.includes('pas') || name.includes('trichrome')) return 'Microscopic finding';
  if (name.includes('cytology')) return 'Cytology result';
  if (name.includes('ihc') || name.includes('immunostaining') || name.includes('staining')) return 'Marker expression';
  if (name.includes('proliferation') || name.includes('ki-67')) return 'Proliferation index';
  if (name.includes('autopsy')) return 'Case findings';
  if (name.includes('grouping') || name.includes('blood group')) return 'ABO / RhD';
  if (name.includes('crossmatch')) return 'Compatibility';
  if (name.includes('antiglobulin')) return 'DAT';
  if (name.includes('screen')) return 'Screen result';
  return 'Method-specific result';
}

function getRangeText(testName: string) {
  const name = testName.toLowerCase();
  if (
    name.includes('culture') ||
    name.includes('screen') ||
    name.includes('antigen') ||
    name.includes('antibody') ||
    name.includes('crossmatch') ||
    name.includes('antiglobulin') ||
    name.includes('grouping') ||
    name.includes('detection') ||
    name.includes('smear') ||
    name.includes('stain') ||
    name.includes('cytology') ||
    name.includes('histology') ||
    name.includes('autopsy') ||
    name.includes('pcr') ||
    name.includes('xpert')
  ) {
    if (name.includes('crossmatch')) return 'Compatible / incompatible';
    if (name.includes('antiglobulin')) return 'Positive / negative';
    if (name.includes('ihc') || name.includes('immunostaining') || name.includes('ki-67') || name.includes('p53') || name.includes('pd-l1') || name.includes('her2') || name.includes('er/pr')) {
      return 'Positive / negative';
    }
    return 'Negative / non-reactive';
  }
  return 'Method-specific reference interval';
}

function buildTestProfile(deptCode: string, bench: string, testName: string): TestProfile {
  const name = testName.toLowerCase();

  if (deptCode === 'HEM') {
    if (name.includes('coag') || name.includes('prothrombin') || name.includes('inr') || name.includes('aptt') || name.includes('fibrinogen') || name.includes('d-dimer')) {
      return {
        sampleType: 'Citrated Plasma (PPP)',
        sampleVolume: '2.7 mL',
        container: '3.2% Sodium Citrate Tube',
        containerColor: 'Light Blue',
        stability: '4 hrs at room temp; 8 hrs at 2-8°C',
        methodology: 'Optical clot detection',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    if (name.includes('esr')) {
      return {
        sampleType: 'Citrated Blood',
        sampleVolume: '2.0 mL',
        container: 'Citrate ESR Tube',
        containerColor: 'Black',
        stability: 'Must be set up within 2 hours of collection',
        methodology: 'Westergren method (manual) or automated',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    return {
      sampleType: 'Whole Blood (EDTA)',
      sampleVolume: '2.0 mL',
      container: 'EDTA Tube',
      containerColor: 'Purple/Lavender',
      stability: '24 hrs at 18-25°C; 48 hrs at 2-8°C',
      methodology: name.includes('reticulocyte')
        ? 'Fluorescent flow cytometry'
        : name.includes('film') || name.includes('morphology') || name.includes('differential')
          ? 'Manual microscopy with Romanowsky stain'
          : 'Electrical impedance and light scatter',
      parameterName: getParameterName(testName),
      rangeText: getRangeText(testName),
    };
  }

  if (deptCode === 'CHE') {
    if (name.includes('glucose') || name.includes('ogtt') || name.includes('hba1c')) {
      return {
        sampleType: name.includes('hba1c') ? 'Whole Blood (EDTA)' : 'Fluoride Oxalate Plasma',
        sampleVolume: '2.0 mL',
        container: name.includes('hba1c') ? 'EDTA Tube' : 'Fluoride Oxalate Tube',
        containerColor: name.includes('hba1c') ? 'Purple/Lavender' : 'Grey',
        stability: name.includes('hba1c') ? '72 hrs at 2-8°C' : '48 hrs at 2-8°C',
        methodology: name.includes('hba1c') ? 'HPLC or immunoturbidimetric assay' : 'Hexokinase or glucose oxidase assay',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    if (name.includes('bilirubin') || name.includes('aminotransferase') || name.includes('alkaline phosphatase')) {
      return {
        sampleType: 'Serum or Lithium Heparin Plasma',
        sampleVolume: '3.0 mL',
        container: 'SST / Plain Tube',
        containerColor: 'Yellow/Red',
        stability: 'Serum stable up to 7 days at 2-8°C',
        methodology: 'Automated photometry / enzymatic assays',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    if (name.includes('urea') || name.includes('creatinine') || name.includes('gfr') || name.includes('uric acid')) {
      return {
        sampleType: 'Serum or Plasma',
        sampleVolume: '3.0 mL',
        container: 'SST / Lithium Heparin Tube',
        containerColor: 'Yellow/Green',
        stability: '48 hrs at 2-8°C',
        methodology: 'Automated chemistry analyzer',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    if (name.includes('cholesterol') || name.includes('triglycerides')) {
      return {
        sampleType: 'Serum',
        sampleVolume: '3.0 mL',
        container: 'SST / Plain Tube',
        containerColor: 'Yellow/Red',
        stability: '48 hrs at 2-8°C',
        methodology: 'Enzymatic colorimetric assay',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    return {
      sampleType: 'Serum or Lithium Heparin Plasma',
      sampleVolume: '3.0 mL',
      container: 'SST / Lithium Heparin Tube',
      containerColor: 'Yellow/Green',
      stability: '24-48 hrs at 2-8°C',
      methodology: 'Ion-selective electrode or automated chemistry assay',
      parameterName: getParameterName(testName),
      rangeText: getRangeText(testName),
    };
  }

  if (deptCode === 'MIC') {
    if (bench === 'Bacteriology') {
      const sampleType = name.includes('blood culture')
        ? 'Whole Blood'
        : name.includes('urine')
          ? 'Midstream Urine'
          : name.includes('sputum')
            ? 'Sputum'
            : 'Swab or sterile clinical specimen';
      const container = name.includes('blood culture')
        ? 'Blood Culture Bottle'
        : name.includes('urine')
          ? 'Sterile Urine Container'
          : name.includes('sputum')
            ? 'Sterile Screw-Cap Container'
            : 'Transport Swab';
      return {
        sampleType,
        sampleVolume: name.includes('blood culture') ? '8-10 mL (Adult) / 1-3 mL (Pediatric)' : 'As collected',
        container,
        containerColor: name.includes('blood culture') ? 'Aerobic (Blue) / Anaerobic (Purple)' : 'Standard per specimen',
        stability: 'Send immediately at room temp. Do not refrigerate.',
        methodology: 'Culture incubation with organism identification and susceptibility follow-up',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    if (bench === 'Mycology') {
      return {
        sampleType: name.includes('koh') ? 'Skin scrapings, hair, or nail clippings' : 'Skin, nail, tissue, or swab',
        sampleVolume: 'As collected',
        container: 'Dry Sterile Container',
        containerColor: 'Clear',
        stability: 'Keep dry and transport promptly',
        methodology: name.includes('koh') ? 'Direct microscopy with KOH preparation' : 'Culture and morphological identification',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    if (bench === 'Virology') {
      return {
        sampleType: name.includes('sars')
          ? 'Nasopharyngeal Swab'
          : 'Serum or Plasma',
        sampleVolume: '2.0 mL',
        container: name.includes('sars') ? 'Viral Transport Medium Swab' : 'SST / EDTA Tube',
        containerColor: name.includes('sars') ? 'Pink/Swab Transport' : 'Yellow/Purple',
        stability: name.includes('sars') ? 'Process promptly at 2-8°C' : '48 hrs at 2-8°C',
        methodology: 'Validated immunoassay screening with reflex confirmation where required',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    if (bench === 'Parasitology') {
      return {
        sampleType: name.includes('stool') ? 'Stool' : 'Whole Blood (EDTA)',
        sampleVolume: name.includes('stool') ? '2-5 g' : '2.0 mL',
        container: name.includes('stool') ? 'Clean Stool Container' : 'EDTA Tube',
        containerColor: name.includes('stool') ? 'Clear' : 'Purple/Lavender',
        stability: name.includes('stool') ? 'Process same day' : '24 hrs at 18-25°C',
        methodology: name.includes('rapid') ? 'Rapid antigen detection assay' : 'Microscopy with stain and concentration methods',
        parameterName: getParameterName(testName),
        rangeText: getRangeText(testName),
      };
    }
    return {
      sampleType: name.includes('pcr') || name.includes('xpert')
        ? 'Swab, sputum, plasma, or EDTA blood'
        : 'Clinical specimen',
      sampleVolume: 'As collected',
      container: 'Validated molecular transport container',
      containerColor: 'Standard per specimen',
      stability: 'Maintain validated transport conditions and avoid contamination',
      methodology: 'Nucleic acid extraction followed by amplification and target detection',
      parameterName: getParameterName(testName),
      rangeText: getRangeText(testName),
    };
  }

  if (deptCode === 'HIS') {
    return {
      sampleType: name.includes('cytology')
        ? 'Smear slide, body fluid, or LBC vial'
        : name.includes('ihc') || name.includes('immunostaining') || name.includes('ki-67') || name.includes('p53') || name.includes('pd-l1') || name.includes('her2') || name.includes('er/pr')
          ? 'FFPE tissue section'
          : name.includes('autopsy')
            ? 'Fresh tissue / fixed tissue'
            : 'Formalin-fixed tissue',
      sampleVolume: 'As collected',
      container: name.includes('cytology')
        ? 'Slide / LBC Container'
        : name.includes('ihc') || name.includes('ki-67') || name.includes('p53') || name.includes('pd-l1') || name.includes('her2') || name.includes('er/pr')
          ? 'Charged Slide'
          : 'Formalin Container',
      containerColor: 'Clear/White',
      stability: name.includes('cytology') ? 'Fixed slides stable indefinitely' : 'Stable in 10% neutral buffered formalin',
      methodology: name.includes('ihc') || name.includes('ki-67') || name.includes('p53') || name.includes('pd-l1') || name.includes('her2') || name.includes('er/pr')
        ? 'Immunostaining with validated antibody controls'
        : name.includes('cytology')
          ? 'Microscopic review with Papanicolaou-style or cytology staining'
          : name.includes('autopsy')
            ? 'Gross examination with histology sampling'
            : 'Fixation, processing, sectioning, and staining',
      parameterName: getParameterName(testName),
      rangeText: getRangeText(testName),
    };
  }

  return {
    sampleType: 'Whole Blood (EDTA) + Serum',
    sampleVolume: '6.0 mL',
    container: 'EDTA + Plain Tube',
    containerColor: 'Purple + Red',
    stability: '72 hrs at 2-8°C',
    methodology: name.includes('group')
      ? 'Forward and reverse grouping with haemagglutination'
      : name.includes('crossmatch')
        ? 'Immediate spin and antiglobulin crossmatch workflow'
        : 'Indirect antiglobulin test with validated serology controls',
    parameterName: getParameterName(testName),
    rangeText: getRangeText(testName),
  };
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
    const hemSteps: Record<string, { stepNo: number; title: string; description: string }[]> = {
      'FBC & Automated Counts': [
        { stepNo: 1, title: 'Startup and QC', description: 'Power on the analyzer, confirm reagent and waste levels, and run low, normal, and high QC before any patient sample.' },
        { stepNo: 2, title: 'Specimen verification', description: 'Confirm EDTA sample identity, check for clots or underfill, and gently invert the tube before loading.' },
        { stepNo: 3, title: 'Analyzer review', description: 'Review histograms, flags, and scattergrams for abnormal cell populations, platelet issues, or rerun alerts.' },
        { stepNo: 4, title: 'Release', description: 'Validate the count, add smear comments when needed, and release the result with critical call escalation if required.' },
      ],
      'Blood Film & Morphology': [
        { stepNo: 1, title: 'Smear preparation', description: 'Prepare a thin wedge smear from fresh EDTA blood and allow it to air dry without heat.' },
        { stepNo: 2, title: 'Staining', description: 'Fix and stain the slide with the validated Romanowsky method, then rinse and dry on a clean rack.' },
        { stepNo: 3, title: 'Microscopy', description: 'Scan the monolayer, perform the differential count, and review red cell, white cell, and platelet morphology.' },
        { stepNo: 4, title: 'Reporting', description: 'Document morphology findings, note parasites or abnormal cells, and escalate any critical smear finding immediately.' },
      ],
      Coagulation: [
        { stepNo: 1, title: 'Specimen check', description: 'Confirm 9:1 citrate fill, reject clotted or underfilled tubes, and centrifuge to platelet-poor plasma where required.' },
        { stepNo: 2, title: 'QC setup', description: 'Run normal and abnormal coagulation controls and verify acceptance before patient testing.' },
        { stepNo: 3, title: 'Assay run', description: 'Perform PT/INR, APTT, fibrinogen, or D-dimer analysis using the validated assay sequence and reagent lot.' },
        { stepNo: 4, title: 'Validation', description: 'Review clot curves, interpret abnormal prolongation, and escalate dangerous bleeding or anticoagulant values promptly.' },
      ],
      'Blood Bank & Transfusion': [
        { stepNo: 1, title: 'Patient and sample verification', description: 'Verify patient identity, transfusion history, and sample validity before any serologic work is started.' },
        { stepNo: 2, title: 'Grouping and screening', description: 'Perform ABO/Rh grouping, antibody screen, and discrepancy review using validated antisera and cell panels.' },
        { stepNo: 3, title: 'Compatibility testing', description: 'Complete the crossmatch route required for the case and resolve incompatible reactions before issue.' },
        { stepNo: 4, title: 'Issue and traceability', description: 'Release only compatible components, document sign-off, and keep the full traceability trail for haemovigilance.' },
      ],
      'ESR & Special Haematology': [
        { stepNo: 1, title: 'Sample setup', description: 'Confirm the citrate ratio for ESR or the correct sample type for the special haematology test in use.' },
        { stepNo: 2, title: 'Test performance', description: 'Set the Westergren rack, prepare the reticulocyte workflow, or run the special screening assay as applicable.' },
        { stepNo: 3, title: 'Reading', description: 'Read the result at the validated interval and check for abnormal inflammatory or red cell response patterns.' },
        { stepNo: 4, title: 'Reporting', description: 'Record the result, comment on abnormal values, and escalate unusual morphology or strongly elevated ESR values.' },
      ],
    };
    const specific = hemSteps[bench];
    if (specific) return specific;
    return [
      { stepNo: 1, title: 'Sample receipt and check', description: `Confirm patient identifiers and collect 2.0 mL whole blood (EDTA for FBC/morphology or citrate 9:1 for coagulation benches). Reject clotted or mislabeled specimens.` },
      { stepNo: 2, title: 'Preparation', description: `Mix specimen gently 8-10 inversions, run background check, then load level 1-3 controls before patient analysis on ${bench}.` },
      { stepNo: 3, title: 'Analysis and verification', description: 'Run patient sample, review analyzer flags, and perform repeat or smear correlation where critical flags appear. Hold release if QC breaches acceptance limits.' },
      { stepNo: 4, title: 'Release and escalation', description: 'Validate result in LIS, communicate critical values with read-back, and document reviewer actions in QC and critical-call registers.' },
    ];
  }
  if (deptCode === 'CHE') {
    const cheSteps: Record<string, { stepNo: number; title: string; description: string }[]> = {
      'Glucose & Diabetes Markers': [
        { stepNo: 1, title: 'Fasting confirmation', description: 'Confirm fasting status for glucose or timing for OGTT before accepting the sample.' },
        { stepNo: 2, title: 'QC and calibration', description: 'Run instrument QC and verify the calibration status before analyte measurement.' },
        { stepNo: 3, title: 'Analysis', description: 'Perform glucose, HbA1c, or tolerance testing according to the selected profile and validated method.' },
        { stepNo: 4, title: 'Reporting', description: 'Review critical hypo or hyperglycemic values, add interpretive comments where needed, and release the validated result.' },
      ],
      'Bilirubin & Liver Function Tests': [
        { stepNo: 1, title: 'Specimen integrity', description: 'Reject haemolysed or lipaemic specimens if they affect bilirubin or enzyme measurement.' },
        { stepNo: 2, title: 'Reagent and control setup', description: 'Check reagent lot integrity, run liver panel controls, and confirm calibration status.' },
        { stepNo: 3, title: 'Analysis', description: 'Run bilirubin, transaminases, alkaline phosphatase, and protein markers using the validated panel.' },
        { stepNo: 4, title: 'Reporting', description: 'Review patterns of hepatocellular or cholestatic injury and release with comments for interference if needed.' },
      ],
      'Kidney Function Tests': [
        { stepNo: 1, title: 'Specimen check', description: 'Confirm serum or plasma quality and reject severely haemolysed samples before renal analysis.' },
        { stepNo: 2, title: 'Analyzer setup', description: 'Verify the renal chemistry method, QC status, and reagent stability before running patient specimens.' },
        { stepNo: 3, title: 'Analysis', description: 'Measure urea, creatinine, uric acid, and related renal markers using the validated profile.' },
        { stepNo: 4, title: 'Validation', description: 'Calculate or review eGFR when applicable, add renal comments if needed, and release the result.' },
      ],
      'Lipid Profile': [
        { stepNo: 1, title: 'Fasting check', description: 'Confirm fasting status when required and check the sample for severe lipemia before analysis.' },
        { stepNo: 2, title: 'QC setup', description: 'Run lipid controls and verify calibration before loading patient specimens.' },
        { stepNo: 3, title: 'Analysis', description: 'Measure cholesterol fractions and triglycerides using the validated lipid profile workflow.' },
        { stepNo: 4, title: 'Reporting', description: 'Interpret the lipid pattern, add risk comments when required, and release the validated profile.' },
      ],
      'Electrolytes & Minerals': [
        { stepNo: 1, title: 'Specimen check', description: 'Confirm serum or plasma integrity and check for contamination or collection errors before ISE testing.' },
        { stepNo: 2, title: 'Instrument setup', description: 'Run calibration and electrolyte QC, then verify the analyzer is stable for patient testing.' },
        { stepNo: 3, title: 'Analysis', description: 'Measure sodium, potassium, chloride, calcium, magnesium, and related minerals using the validated profile.' },
        { stepNo: 4, title: 'Critical escalation', description: 'Flag critical electrolyte results immediately, verify the value, and document the escalation path.' },
      ],
    };
    const specific = cheSteps[bench];
    if (specific) return specific;
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
    const benchContent = getBenchContent(deptCode, bench)!;

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

    benchContent.testNames.forEach((specificTestName, idx) => {
      const linkedSop = sopCodesForBench[idx % sopCodesForBench.length];
      const testProfile = buildTestProfile(deptCode, bench, specificTestName);
      NEW_LAB_TESTS.push({
        id: `t${testIdCounter++}`,
        code: `${deptCode}${testCodeCounter++}`,
        name: specificTestName,
        category: bench,
        turnaround:
          deptCode === 'MIC'
            ? idx === 0
              ? '5-7 days'
              : idx === 1
                ? '48-72 hours'
                : idx === 2
                  ? '48-72 hours'
                  : '24-48 hours'
            : deptCode === 'HIS'
              ? idx === 0
                ? '3-5 days'
                : idx === 1
                  ? '3-7 days'
                  : idx === 2
                    ? '3-7 days'
                    : '24-48 hours'
              : idx === 2
                ? '4-8 hours'
                : idx === 3
                  ? '60-120 minutes'
                  : '2-4 hours',
        sampleType: testProfile.sampleType,
        sampleVolume: testProfile.sampleVolume,
        container: testProfile.container,
        containerColor: testProfile.containerColor,
        stability: testProfile.stability,
        methodology: testProfile.methodology,
        relatedSop: linkedSop,
        parameters: [
          { name: testProfile.parameterName, unit: '', maleRange: testProfile.rangeText, femaleRange: testProfile.rangeText },
        ],
        clinicalSignificance: benchContent?.testSummary ?? `Supports ${bench.toLowerCase()} interpretation for diagnosis, monitoring, and treatment decisions.`,
        indications: ['Routine clinical evaluation', 'Follow-up monitoring', 'Urgent or confirmatory requests when indicated'],
        specialInstructions: benchContent?.specialInstruction ?? 'Reject unsuitable specimens and follow pre-analytical rejection criteria before testing.',
        status: 'active',
      });
    });

    JOB_AID_BLUEPRINTS.forEach((aid, idx) => {
      const specificTitle = benchContent?.jobAidTitles[idx];
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
