// ─── Types ───────────────────────────────────────────────────────────────────

import { NEW_SOPS, NEW_LAB_TESTS, NEW_JOB_AIDS } from './mockDataEnriched';

export type UserRole = 'staff' | 'supervisor' | 'hod';

// ─── Department & Bench Types ─────────────────────────────────────────────────

export interface Bench {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  color: string;
  benches: Bench[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'haematology',
    name: 'Haematology',
    shortName: 'HAEM',
    color: '#dc2626',
    benches: [
      { id: 'fbc', name: 'FBC & Automated Counts', shortName: 'FBC', color: '#dc2626' },
      { id: 'blood-film', name: 'Blood Film & Morphology', shortName: 'BFM', color: '#b91c1c' },
      { id: 'coagulation', name: 'Coagulation', shortName: 'COAG', color: '#ef4444' },
      { id: 'blood-bank', name: 'Blood Bank & Transfusion', shortName: 'BB', color: '#7f1d1d' },
      { id: 'esr-special', name: 'ESR & Special Haematology', shortName: 'ESR', color: '#f87171' },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    shortName: 'CHEM',
    color: '#0369a1',
    benches: [
      { id: 'glucose', name: 'Glucose & Diabetes Markers', shortName: 'GLU', color: '#0369a1' },
      { id: 'bilirubin-lft', name: 'Bilirubin & Liver Function Tests', shortName: 'LFT', color: '#0284c7' },
      { id: 'kft', name: 'Kidney Function Tests', shortName: 'KFT', color: '#0ea5e9' },
      { id: 'lipid', name: 'Lipid Profile', shortName: 'LIP', color: '#0891b2' },
      { id: 'electrolytes', name: 'Electrolytes & Minerals', shortName: 'ELEC', color: '#155e75' },
    ],
  },
  {
    id: 'microbiology',
    name: 'Microbiology & Parasitology',
    shortName: 'MICRO',
    color: '#15803d',
    benches: [
      { id: 'bacteriology', name: 'Bacteriology', shortName: 'BACT', color: '#15803d' },
      { id: 'mycology', name: 'Mycology', shortName: 'MYC', color: '#16a34a' },
      { id: 'virology', name: 'Virology', shortName: 'VIR', color: '#166534' },
      { id: 'parasitology', name: 'Parasitology', shortName: 'PARA', color: '#4ade80' },
      { id: 'molecular', name: 'Molecular Microbiology', shortName: 'MOL', color: '#14532d' },
    ],
  },
  {
    id: 'histopathology',
    name: 'Histopathology',
    shortName: 'HISTO',
    color: '#7c3aed',
    benches: [
      { id: 'histology', name: 'Histology', shortName: 'HIST', color: '#7c3aed' },
      { id: 'cytology', name: 'Cytology', shortName: 'CYT', color: '#8b5cf6' },
      { id: 'ihc', name: 'Immunohistochemistry (IHC)', shortName: 'IHC', color: '#6d28d9' },
      { id: 'autopsy', name: 'Autopsy & Post-Mortem', shortName: 'APM', color: '#4c1d95' },
    ],
  },
  {
    id: 'bgs',
    name: 'Blood Group & Serology',
    shortName: 'BGS',
    color: '#b45309',
    benches: [
      { id: 'abo-rh', name: 'ABO/Rh Blood Grouping', shortName: 'ABO', color: '#b45309' },
      { id: 'crossmatch', name: 'Crossmatching', shortName: 'XMATCH', color: '#d97706' },
      { id: 'antibody-screen', name: 'Antibody Screening & ID', shortName: 'AB-SCR', color: '#92400e' },
      { id: 'serology', name: 'Serology & Immunology', shortName: 'SERO', color: '#f59e0b' },
    ],
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find(d => d.id === id);
}

export function getDepartmentForUser(department: string, unit: string): Department {
  const text = (department + ' ' + unit).toLowerCase();
  if (text.includes('chemi')) return DEPARTMENTS.find(d => d.id === 'chemistry')!;
  if (text.includes('micro') || text.includes('parasit') || text.includes('bacteriol') || text.includes('virol') || text.includes('mycol'))
    return DEPARTMENTS.find(d => d.id === 'microbiology')!;
  if (text.includes('histo') || text.includes('cytol')) return DEPARTMENTS.find(d => d.id === 'histopathology')!;
  if (text.includes('bgs') || text.includes('blood group') || text.includes('serol')) return DEPARTMENTS.find(d => d.id === 'bgs')!;
  return DEPARTMENTS.find(d => d.id === 'haematology')!;
}

export function getBenchForUser(dept: Department, unit: string): Bench {
  const u = unit.toLowerCase();
  if (dept.id === 'haematology') {
    if (u.includes('blood bank') || u.includes('transfus')) return dept.benches.find(b => b.id === 'blood-bank')!;
    if (u.includes('coagul')) return dept.benches.find(b => b.id === 'coagulation')!;
    if (u.includes('morphol') || u.includes('film')) return dept.benches.find(b => b.id === 'blood-film')!;
    if (u.includes('esr')) return dept.benches.find(b => b.id === 'esr-special')!;
  }
  if (dept.id === 'chemistry') {
    if (u.includes('glucose') || u.includes('diabet')) return dept.benches.find(b => b.id === 'glucose')!;
    if (u.includes('liver') || u.includes('lft') || u.includes('bilirubin')) return dept.benches.find(b => b.id === 'bilirubin-lft')!;
    if (u.includes('kidney') || u.includes('renal') || u.includes('kft')) return dept.benches.find(b => b.id === 'kft')!;
    if (u.includes('lipid') || u.includes('cholest')) return dept.benches.find(b => b.id === 'lipid')!;
    if (u.includes('electro')) return dept.benches.find(b => b.id === 'electrolytes')!;
  }
  if (dept.id === 'microbiology') {
    if (u.includes('bacter')) return dept.benches.find(b => b.id === 'bacteriology')!;
    if (u.includes('mycol') || u.includes('fungal')) return dept.benches.find(b => b.id === 'mycology')!;
    if (u.includes('virol')) return dept.benches.find(b => b.id === 'virology')!;
    if (u.includes('parasit') || u.includes('malaria')) return dept.benches.find(b => b.id === 'parasitology')!;
    if (u.includes('molecular') || u.includes('pcr')) return dept.benches.find(b => b.id === 'molecular')!;
  }
  return dept.benches[0];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  unit: string;
  initials: string;
  color: string;
  joinDate: string;
  competencyScore?: number;
  mustResetPassword?: boolean;
}

export interface SOPStep {
  stepNo: number;
  title: string;
  description: string;
}

export interface ReferenceRange {
  parameter: string;
  unit: string;
  maleRange: string;
  femaleRange: string;
  pediatricRange?: string;
}

export interface SOP {
  id: string;
  code: string;
  title: string;
  department: string;
  category: string;
  revision: string;
  effectiveDate: string;
  reviewDate: string;
  author: string;
  approvedBy: string;
  status: 'active' | 'under_review' | 'archived';
  purpose: string;
  principle: string;
  equipment: string[];
  reagents: string[];
  steps: SOPStep[];
  referenceRanges?: ReferenceRange[];
  safetyPrecautions: string[];
  relatedTests: string[];
  tags: string[];
}

export interface TestParameter {
  name: string;
  unit: string;
  maleRange: string;
  femaleRange: string;
  pediatricRange?: string;
}

export interface LabTest {
  id: string;
  code: string;
  name: string;
  category: string;
  turnaround: string;
  sampleType: string;
  sampleVolume: string;
  container: string;
  containerColor: string;
  stability: string;
  methodology: string;
  relatedSop: string;
  parameters: TestParameter[];
  clinicalSignificance: string;
  indications: string[];
  specialInstructions: string;
  status: 'active' | 'inactive';
}

export interface JobAid {
  id: string;
  title: string;
  category: string;
  type: 'checklist' | 'decision_tree' | 'quick_reference' | 'protocol';
  description: string;
  steps?: string[];
  lastUpdated: string;
  tags: string[];
}

export interface TrainingModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  mandatory: boolean;
  description: string;
  objectives: string[];
  passingScore: number;
}

export interface StaffTrainingRecord {
  staffId: string;
  moduleId: string;
  status: 'completed' | 'in_progress' | 'not_started' | 'overdue';
  completedDate?: string;
  score?: number;
  dueDate: string;
}

export interface QCResult {
  parameter: string;
  measuredValue: number;
  targetValue: number;
  sdValue: number;
  sdDeviation: number;
  status: 'pass' | 'warning' | 'fail';
}

export interface QCLog {
  id: string;
  date: string;
  shift: 'AM' | 'PM' | 'Night';
  analyzer: string;
  level: 'Level 1 (Low)' | 'Level 2 (Normal)' | 'Level 3 (High)';
  staffId: string;
  results: QCResult[];
  overallStatus: 'passed' | 'failed' | 'warning';
  comment?: string;
  supervisorReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface CAPAItem {
  id: string;
  code: string;
  title: string;
  description: string;
  source: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  dueDate: string;
  openedDate: string;
  closedDate?: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetRoles: UserRole[];
  category: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Adaeze Nwosu',
    email: 'adaeze@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Laboratory',
    unit: 'Hematology & Blood Transfusion',
    initials: 'AN',
    color: '#b91c1c',
    joinDate: '2022-03-14',
    competencyScore: 92,
  },
  {
    id: 'u2',
    name: 'Emeka Okafor',
    email: 'emeka@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Laboratory',
    unit: 'Hematology & Blood Transfusion',
    initials: 'EO',
    color: '#0369a1',
    joinDate: '2021-07-20',
    competencyScore: 78,
  },
  {
    id: 'u3',
    name: 'Ngozi Ikenna',
    email: 'ngozi.ikenna@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Laboratory',
    unit: 'Blood Bank',
    initials: 'NI',
    color: '#7c3aed',
    joinDate: '2023-01-10',
    competencyScore: 88,
  },
  {
    id: 'u4',
    name: 'Bello Taiwo',
    email: 'bello@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Laboratory',
    unit: 'Coagulation',
    initials: 'BT',
    color: '#0f766e',
    joinDate: '2023-08-05',
    competencyScore: 65,
  },
  {
    id: 'u5',
    name: 'Aisha Musa',
    email: 'aisha@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Laboratory',
    unit: 'Hematology & Blood Transfusion',
    initials: 'AM',
    color: '#b45309',
    joinDate: '2020-11-22',
    competencyScore: 95,
  },
  // ── Chemistry Staff ──────────────────────────────────────────────────────────
  {
    id: 'u6',
    name: 'Chukwuemeka Eze',
    email: 'emeka.eze@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Chemistry',
    unit: 'Liver Function Tests (LFTs)',
    initials: 'CE',
    color: '#0284c7',
    joinDate: '2021-04-18',
    competencyScore: 83,
  },
  {
    id: 'u7',
    name: 'Blessing Osei',
    email: 'blessing@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Chemistry',
    unit: 'Kidney Function Tests',
    initials: 'BO',
    color: '#0891b2',
    joinDate: '2022-09-01',
    competencyScore: 90,
  },
  // ── Microbiology Staff ────────────────────────────────────────────────────────
  {
    id: 'u8',
    name: 'Ibrahim Suleiman',
    email: 'ibrahim@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Microbiology & Parasitology',
    unit: 'Bacteriology',
    initials: 'IS',
    color: '#15803d',
    joinDate: '2020-06-12',
    competencyScore: 87,
  },
  {
    id: 'u9',
    name: 'Amina Yakubu',
    email: 'amina@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Microbiology & Parasitology',
    unit: 'Parasitology & Malaria',
    initials: 'AY',
    color: '#4ade80',
    joinDate: '2023-03-22',
    competencyScore: 74,
  },
  // ── Histopathology Staff ──────────────────────────────────────────────────────
  {
    id: 'u10',
    name: 'Chisom Nwachukwu',
    email: 'chisom@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Histopathology',
    unit: 'Cytology',
    initials: 'CN',
    color: '#7c3aed',
    joinDate: '2021-11-08',
    competencyScore: 91,
  },
  // ── BGS Staff ─────────────────────────────────────────────────────────────────
  {
    id: 'u11',
    name: 'Tunde Abiodun',
    email: 'tunde@knowlab.ng',
    password: 'staff123',
    role: 'staff',
    department: 'Blood Group & Serology',
    unit: 'ABO/Rh Blood Grouping',
    initials: 'TA',
    color: '#b45309',
    joinDate: '2022-07-14',
    competencyScore: 88,
  },
  // ── Supervisors ───────────────────────────────────────────────────────────────
  {
    id: 'sup1',
    name: 'Fatima Bello',
    email: 'fatima@knowlab.ng',
    password: 'super123',
    role: 'supervisor',
    department: 'Haematology',
    unit: 'Haematology',
    initials: 'FB',
    color: '#1d4ed8',
    joinDate: '2018-05-06',
  },
  {
    id: 'sup2',
    name: 'Seun Adebayo',
    email: 'seun@knowlab.ng',
    password: 'super123',
    role: 'supervisor',
    department: 'Chemistry',
    unit: 'Glucose & Diabetes Markers',
    initials: 'SA',
    color: '#0369a1',
    joinDate: '2017-08-15',
  },
  {
    id: 'sup3',
    name: 'Halima Garba',
    email: 'halima@knowlab.ng',
    password: 'super123',
    role: 'supervisor',
    department: 'Microbiology & Parasitology',
    unit: 'Bacteriology',
    initials: 'HG',
    color: '#15803d',
    joinDate: '2016-02-20',
  },
  {
    id: 'hod1',
    name: 'Ngozi Adeyemi',
    email: 'ngozi@knowlab.ng',
    password: 'hod123',
    role: 'hod',
    department: 'Laboratory',
    unit: 'Laboratory Services',
    initials: 'NA',
    color: '#dc2626',
    joinDate: '2015-03-01',
  },
  // Dedicated demo logins for role-based routing
  {
    id: 'demo_staff',
    name: 'Staff Demo',
    email: 'staff123@knowlab.com',
    password: 'staff123',
    role: 'staff',
    department: 'Laboratory',
    unit: 'Haematology & Blood Transfusion',
    initials: 'SD',
    color: '#1c5eff',
    joinDate: '2026-01-01',
    mustResetPassword: false,
  },
  {
    id: 'demo_supervisor',
    name: 'Supervisor Demo',
    email: 'supervisor123@knowlab.com',
    password: 'supervisor123',
    role: 'supervisor',
    department: 'Haematology',
    unit: 'Haematology',
    initials: 'SV',
    color: '#0f86ff',
    joinDate: '2026-01-01',
    mustResetPassword: false,
  },
  {
    id: 'demo_hod',
    name: 'HOD Demo',
    email: 'hod123@knowlab.com',
    password: 'hod123',
    role: 'hod',
    department: 'Laboratory',
    unit: 'Laboratory Services',
    initials: 'HD',
    color: '#dc2626',
    joinDate: '2026-01-01',
    mustResetPassword: false,
  },
];

// ─── SOPs ─────────────────────────────────────────────────────────────────────

export const SOPS: SOP[] = [
  {
    id: 'sop1',
    code: 'HEM-SOP-001',
    title: 'Full Blood Count (FBC) Analysis — Sysmex XN-350',
    department: 'Hematology',
    category: 'Hematology',
    revision: '04',
    effectiveDate: '15 Jan 2024',
    reviewDate: '14 Jan 2025',
    author: 'Fatima Bello',
    approvedBy: 'Ngozi Adeyemi',
    status: 'active',
    purpose:
      'To provide a standardized procedure for performing Full Blood Count analysis using the Sysmex XN-350 automated hematology analyzer to ensure accurate, reproducible, and clinically meaningful results.',
    principle:
      'The Sysmex XN-350 uses a combination of electrical impedance (DC detection), radio-frequency detection (RF), and fluorescent flow cytometry (SF Cube) to enumerate and differentiate blood cells. Each channel (WBC/BASO, DIFF, RET, PLT-F) processes the sample with specific reagents and measures cell characteristics.',
    equipment: [
      'Sysmex XN-350 Hematology Analyzer',
      'Sysmex XN-Series automated sample loader',
      'Refrigerator (2–8°C) for QC materials',
      'Vortex mixer',
      'Timer',
      'Personal Protective Equipment (gloves, lab coat, eye protection)',
    ],
    reagents: [
      'Sysmex Cell Pack DCL (diluent)',
      'Sysmex Stromatolyser-4DL (WBC lysis)',
      'Sysmex Stromatolyser-4DS (WBC lysis, diff)',
      'Sysmex Sulfolyser (HGB lysis)',
      'Sysmex Cellclean AutoMATE (daily wash)',
      'Sysmex XN CHECK 3i (3-level QC material)',
    ],
    steps: [
      {
        stepNo: 1,
        title: 'Preparation & Safety',
        description:
          'Don PPE (gloves, lab coat, eye protection). Ensure the analyzer is switched on and has completed its self-diagnostic startup sequence. Verify reagent levels via the analyzer display — replace any reagent below the low-level indicator before proceeding.',
      },
      {
        stepNo: 2,
        title: 'Daily QC Performance',
        description:
          'Run Sysmex XN CHECK 3i (Level 1 Low, Level 2 Normal, Level 3 High) before processing patient samples. Gently invert each QC vial 8–10 times. Allow to reach room temperature (18–25°C). Scan bar code and run in closed-tube mode. Verify all parameters are within ±2 SD of target values. Document QC results in the QC logbook and on the LIS. Do NOT process patient samples until QC is accepted.',
      },
      {
        stepNo: 3,
        title: 'Sample Receipt & Verification',
        description:
          'Verify that the EDTA (purple-top) tube is correctly labelled with: patient full name, hospital number, date/time of collection, and requesting clinician. Check the sample for adequacy: minimum 1.5 mL whole blood. Inspect for clots (invert gently and feel for resistance), haemolysis, lipaemia, and icterus — record any pre-analytical issues on the request form.',
      },
      {
        stepNo: 4,
        title: 'Sample Mixing',
        description:
          'Invert the EDTA tube gently 8–10 times immediately before analysis to ensure thorough mixing. Do NOT shake vigorously as this causes platelet clumping and haemolysis. For samples that have been standing >30 minutes, re-mix by gentle inversion.',
      },
      {
        stepNo: 5,
        title: 'Sample Loading — Closed Tube Mode',
        description:
          'Place tubes in the sample rack with bar-code labels facing the reader. Load the rack into the sample inlet. The analyzer will automatically aspirate through the closed cap (closed-tube sampling). Monitor the status display to ensure each sample is accepted.',
      },
      {
        stepNo: 6,
        title: 'Sample Loading — Open Tube Mode (when required)',
        description:
          'Remove the tube cap carefully using a cap remover (to prevent aerosol). Place the uncapped tube in the open-tube holder and press the aspirate button. Replace cap after aspiration using forceps. Use this mode only when the closed-tube mode fails or for paediatric micro-samples.',
      },
      {
        stepNo: 7,
        title: 'Result Acquisition',
        description:
          'Await analyzer completion (approx. 1 minute per sample). Review the printed/displayed results and flagging messages. Pay particular attention to: morphological flags (Blasts?, Immature Gran?, NRBC?, Abn Lympho?), abnormal scattergrams (WDF, WNR, PLT-F), and any "review" or "rerun" alarms.',
      },
      {
        stepNo: 8,
        title: 'Result Validation & Reflex Testing',
        description:
          'Apply the laboratory\'s slide-making criteria: any morphological flag, HGB <7 g/dL, PLT <50 ×10⁹/L, WBC >30 ×10⁹/L or <2 ×10⁹/L triggers a peripheral blood smear (refer to HEM-SOP-003). Results outside the reportable range require dilution re-run. Confirm critical values per lab policy and notify clinician immediately.',
      },
      {
        stepNo: 9,
        title: 'Result Authorisation & Reporting',
        description:
          'Authorize validated results in the LIS. Add interpretive comment where clinically appropriate (e.g., "Thrombocytopenia — platelet clumping excluded on smear"). For critical values, document time of notification, clinician spoken to, and read-back confirmation in the Critical Values Register.',
      },
      {
        stepNo: 10,
        title: 'End-of-Shift Maintenance',
        description:
          'Run the Cellclean AutoMATE automatic wash cycle at end of shift. Perform daily shutdown sequence as per analyzer display prompts. Record total sample count, any downtime, and maintenance performed in the analyzer logbook. Cover reagent lines and store opened reagents at room temperature.',
      },
    ],
    referenceRanges: [
      { parameter: 'WBC (White Blood Cells)', unit: '×10⁹/L', maleRange: '4.0 – 11.0', femaleRange: '4.0 – 11.0', pediatricRange: '5.0 – 15.0 (neonate)' },
      { parameter: 'RBC (Red Blood Cells)', unit: '×10¹²/L', maleRange: '4.5 – 5.5', femaleRange: '3.8 – 4.8', pediatricRange: '4.0 – 5.2' },
      { parameter: 'HGB (Haemoglobin)', unit: 'g/dL', maleRange: '13.5 – 17.5', femaleRange: '11.5 – 15.5', pediatricRange: '11.0 – 16.0' },
      { parameter: 'HCT (Haematocrit/PCV)', unit: '%', maleRange: '41 – 53', femaleRange: '36 – 46', pediatricRange: '35 – 49' },
      { parameter: 'MCV (Mean Cell Volume)', unit: 'fL', maleRange: '80 – 100', femaleRange: '80 – 100', pediatricRange: '75 – 95' },
      { parameter: 'MCH (Mean Cell Haemoglobin)', unit: 'pg', maleRange: '27 – 33', femaleRange: '27 – 33', pediatricRange: '24 – 30' },
      { parameter: 'MCHC', unit: 'g/dL', maleRange: '31.5 – 35.5', femaleRange: '31.5 – 35.5', pediatricRange: '30.0 – 36.0' },
      { parameter: 'Platelets (PLT)', unit: '×10⁹/L', maleRange: '150 – 400', femaleRange: '150 – 400', pediatricRange: '150 – 400' },
      { parameter: 'Neutrophils', unit: '×10⁹/L', maleRange: '1.8 – 7.5', femaleRange: '1.8 – 7.5', pediatricRange: '1.5 – 8.0' },
      { parameter: 'Lymphocytes', unit: '×10⁹/L', maleRange: '1.0 – 4.0', femaleRange: '1.0 – 4.0', pediatricRange: '2.0 – 8.0' },
      { parameter: 'Monocytes', unit: '×10⁹/L', maleRange: '0.2 – 1.0', femaleRange: '0.2 – 1.0', pediatricRange: '0.2 – 1.2' },
      { parameter: 'Eosinophils', unit: '×10⁹/L', maleRange: '0.0 – 0.5', femaleRange: '0.0 – 0.5', pediatricRange: '0.0 – 0.7' },
      { parameter: 'Basophils', unit: '×10⁹/L', maleRange: '0.0 – 0.1', femaleRange: '0.0 – 0.1', pediatricRange: '0.0 – 0.1' },
    ],
    safetyPrecautions: [
      'All blood samples must be treated as potentially infectious (Biosafety Level 2).',
      'Wear gloves, lab coat, and eye protection at all times when handling samples.',
      'Do NOT pipette by mouth. Use mechanical pipetting devices only.',
      'All sharps (needles, lancets) must be disposed in puncture-resistant sharps containers.',
      'Clean spills immediately with 0.5% hypochlorite solution (10 min contact time).',
      'Wash hands thoroughly with soap and water after removing gloves and before leaving the lab.',
      'Report all exposure incidents to the Infection Control Officer immediately.',
    ],
    relatedTests: ['FBC', 'Peripheral Blood Film', 'Reticulocyte Count'],
    tags: ['hematology', 'FBC', 'sysmex', 'automated', 'blood count'],
  },
  {
    id: 'sop2',
    code: 'HEM-SOP-002',
    title: 'Erythrocyte Sedimentation Rate (ESR) — Westergren Method',
    department: 'Hematology',
    category: 'Hematology',
    revision: '03',
    effectiveDate: '02 Mar 2023',
    reviewDate: '01 Mar 2024',
    author: 'Adaeze Nwosu',
    approvedBy: 'Fatima Bello',
    status: 'active',
    purpose:
      'To measure the rate at which erythrocytes sediment in a standardized tube over one hour, providing a non-specific indicator of inflammation and disease activity.',
    principle:
      'Anticoagulated blood is diluted with sodium citrate and placed in a graduated Westergren tube. Due to differences in density between erythrocytes and plasma, red cells fall under gravity. The distance (mm) fallen in 1 hour is recorded as the ESR.',
    equipment: [
      'Westergren ESR tubes (200 mm, graduated)',
      'Westergren stand/rack (must be vibration-free, level surface)',
      'Disposable pipettes (for sodium citrate)',
      'Timer (1-hour accuracy)',
      'PPE (gloves, lab coat)',
    ],
    reagents: [
      '3.8% Sodium Citrate (0.109 M) — 4 parts blood to 1 part citrate',
      'EDTA anticoagulated blood (for pre-diluted ESR systems)',
    ],
    steps: [
      { stepNo: 1, title: 'Preparation', description: 'Don PPE. Ensure the ESR rack is on a level surface, away from vibration and direct sunlight. Check Westergren tubes for cracks or contamination.' },
      { stepNo: 2, title: 'Sample Preparation', description: 'Collect 1.6 mL venous blood into 0.4 mL of 3.8% sodium citrate (4:1 ratio) in a plain tube, or use a vacuum ESR citrate tube. Mix gently by inversion (8 times).' },
      { stepNo: 3, title: 'Tube Filling', description: 'Fill a Westergren tube to the "0" mark (top) with the diluted blood sample. Ensure no air bubbles. Place the tube in the ESR rack, ensuring it is perfectly vertical.' },
      { stepNo: 4, title: 'Timing', description: 'Start the timer immediately after placing the tube. Leave undisturbed for exactly 60 minutes at room temperature (18–25°C). Ensure no vibration, air currents, or temperature fluctuations during the reading period.' },
      { stepNo: 5, title: 'Reading & Recording', description: 'After exactly 60 minutes, read the distance (mm) from the bottom of the meniscus of the plasma column to the top of the red cell column. Record as mm/hour (e.g., 25 mm/hr).' },
      { stepNo: 6, title: 'Result Reporting', description: 'Report results with the reference range. Flag markedly elevated ESR (>100 mm/hr) for clinician attention, as this may indicate serious pathology (e.g., myeloma, giant cell arteritis, sepsis).' },
    ],
    referenceRanges: [
      { parameter: 'ESR', unit: 'mm/hr', maleRange: '0 – 15 (age <50) / 0 – 20 (age ≥50)', femaleRange: '0 – 20 (age <50) / 0 – 30 (age ≥50)', pediatricRange: '0 – 10' },
    ],
    safetyPrecautions: [
      'Treat all samples as potentially infectious.',
      'Dispose of Westergren tubes safely into appropriate sharps/clinical waste.',
      'Sodium citrate is an anticoagulant — avoid skin contact; wash immediately if spillage occurs.',
    ],
    relatedTests: ['ESR', 'CRP', 'FBC'],
    tags: ['ESR', 'Westergren', 'inflammation', 'sedimentation'],
  },
  {
    id: 'sop3',
    code: 'HEM-SOP-003',
    title: 'Peripheral Blood Film (PBF) Preparation & Examination',
    department: 'Hematology',
    category: 'Hematology',
    revision: '05',
    effectiveDate: '10 Jun 2023',
    reviewDate: '09 Jun 2024',
    author: 'Aisha Musa',
    approvedBy: 'Fatima Bello',
    status: 'active',
    purpose: 'To prepare, stain, and examine a peripheral blood film for morphological assessment of red cells, white cells, and platelets, and to perform a manual white cell differential count.',
    principle: 'A thin film of blood on a glass slide is air-dried, fixed with methanol, and stained with Leishman or May-Grünwald-Giemsa stain. Romanowsky dyes differentially stain cellular components: nuclei (purple-blue), cytoplasm (pink), granules (red/blue depending on type), enabling morphological classification.',
    equipment: ['Clean glass slides (degreased, scratch-free)', 'Spreader slides', 'Coplin jars', 'Light microscope (10×, 40×, 100× oil immersion objectives)', 'Immersion oil', 'Slide drying rack'],
    reagents: ['Leishman stain (or May-Grünwald + Giemsa)', 'Phosphate buffer (pH 6.8)', 'Methanol (absolute, for fixation)', 'DPX mountant (for permanent slides)'],
    steps: [
      { stepNo: 1, title: 'Film Preparation', description: 'Place a small drop (2 µL) of EDTA blood near one end of a clean glass slide. Hold the spreader slide at 30–45° to the sample slide. Push smoothly and rapidly toward the other end to create a thin uniform film. The film should end before the edge of the slide.' },
      { stepNo: 2, title: 'Drying', description: 'Air-dry the film completely (3–5 minutes) by waving gently. Do NOT use heat — this distorts cell morphology.' },
      { stepNo: 3, title: 'Fixation', description: 'Immerse in absolute methanol for 2 minutes. Remove and allow to drain dry.' },
      { stepNo: 4, title: 'Staining (Leishman)', description: 'Flood the slide with Leishman stain for 2 minutes. Add equal volume of pH 6.8 phosphate buffer. Mix gently and leave for 8–10 minutes. Wash with buffer until slide appears pinkish-grey. Drain and allow to air dry.' },
      { stepNo: 5, title: 'Examination — Low Power (10× objective)', description: 'Scan the slide for overall quality: good preparation (feathered edge visible), adequate staining. Identify the best area for differential (monolayer zone, approx. 1/3 from feathered edge).' },
      { stepNo: 6, title: 'Differential Count (40×/100× objectives)', description: 'Count 100 white cells in a systematic pattern (battlement pattern). Classify into: Neutrophils (segmented and band), Lymphocytes, Monocytes, Eosinophils, Basophils. Note any abnormal forms (blasts, atypical lymphocytes, hypersegmented neutrophils, toxic granulation, etc.).' },
      { stepNo: 7, title: 'Red Cell & Platelet Morphology', description: 'Assess red cell morphology: size (microcytes, macrocytes), shape (poikilocytosis — target cells, sickle cells, schistocytes), colour (hypochromia, polychromasia), inclusions (Howell-Jolly bodies, malarial parasites). Estimate platelet count and note morphology.' },
      { stepNo: 8, title: 'Reporting', description: 'Report differential percentages and absolute counts. Document all morphological abnormalities. Flag and escalate any finding of blast cells, malarial parasites, or other critical findings to the consultant immediately.' },
    ],
    safetyPrecautions: ['Handle methanol in a fume hood — flammable and toxic.', 'Avoid skin contact with stains.', 'Dispose of used slides in appropriate clinical waste containers.'],
    relatedTests: ['FBC', 'Malaria Parasites', 'Reticulocyte Count'],
    tags: ['PBF', 'morphology', 'differential', 'staining', 'microscopy'],
  },
  {
    id: 'sop4',
    code: 'BB-SOP-001',
    title: 'ABO & Rhesus (D) Blood Grouping',
    department: 'Blood Bank',
    category: 'Blood Bank',
    revision: '06',
    effectiveDate: '20 Sep 2023',
    reviewDate: '19 Sep 2024',
    author: 'Ngozi Ikenna',
    approvedBy: 'Fatima Bello',
    status: 'active',
    purpose: 'To determine the ABO blood group and Rhesus D (Rh D) antigen status of a patient or donor sample using standard serological techniques.',
    principle: 'Forward (cell) grouping: patient red cells are tested against known Anti-A, Anti-B, and Anti-D antisera. Back (serum) grouping: patient serum is tested against known A and B red cell reagents. The results must be concordant. The presence of agglutination (positive result) indicates the corresponding antigen or antibody.',
    equipment: ['Centrifuge (glass slide/tube method)', 'Tile or microplate (tube test)', 'Pasteur pipettes', 'Microscope (for weak reactions)', 'Timer'],
    reagents: ['Anti-A monoclonal antiserum (blue)', 'Anti-B monoclonal antiserum (yellow)', 'Anti-D (IgM blend) antiserum', 'Reagent A cells (5% suspension)', 'Reagent B cells (5% suspension)', 'Group O cells', '0.9% Normal Saline', 'LISS (Low Ionic Strength Saline) for IAT'],
    steps: [
      { stepNo: 1, title: 'Sample Verification', description: 'Verify patient ID against sample label. Confirm EDTA or clotted blood sample. Prepare a 5% suspension of washed patient red cells in normal saline for cell grouping.' },
      { stepNo: 2, title: 'Forward (Cell) Grouping — Tile Method', description: 'Label three areas of the tile: Anti-A, Anti-B, Anti-D. Add 1 drop of each antiserum to respective areas. Add 1 drop of patient 5% red cell suspension to each. Mix with separate sticks. Rock tile gently. Read at 2 minutes (3 minutes for Anti-D). Record agglutination (+) or no agglutination (0).' },
      { stepNo: 3, title: 'Back (Serum) Grouping', description: 'Label two areas: A cells, B cells. Add 2 drops patient serum to each area. Add 1 drop of 5% A cells and 5% B cells respectively. Mix and rock. Read at 2 minutes. Results must be compatible with forward grouping.' },
      { stepNo: 4, title: 'Interpretation & Reporting', description: 'A: Anti-A(+), Anti-B(0), A cells(0), B cells(+). B: Anti-A(0), Anti-B(+), A cells(+), B cells(0). O: Anti-A(0), Anti-B(0), A cells(+), B cells(+). AB: Anti-A(+), Anti-B(+), A cells(0), B cells(0). Rh D positive: Anti-D(+). Rh D negative: Anti-D(0) — confirm with Du (weak D) testing.' },
      { stepNo: 5, title: 'Discrepancy Resolution', description: 'Any discordance between forward and back grouping requires immediate investigation. Do NOT report until discrepancy is resolved. Causes include: ABO subgroups, polyagglutination, cold agglutinins, recent transfusion. Refer to Supervisor.' },
    ],
    safetyPrecautions: ['Treat all samples as potentially infectious.', 'Human-derived reagent red cells carry biohazard risk — handle accordingly.', 'Positive and negative controls must be run with each batch.'],
    relatedTests: ['Cross-Match', 'Antibody Screen', 'Direct Antiglobulin Test'],
    tags: ['blood group', 'ABO', 'Rhesus', 'blood bank', 'transfusion'],
  },
  {
    id: 'sop5',
    code: 'COAG-SOP-001',
    title: 'Prothrombin Time (PT) & INR',
    department: 'Coagulation',
    category: 'Coagulation',
    revision: '03',
    effectiveDate: '05 Nov 2023',
    reviewDate: '04 Nov 2024',
    author: 'Bello Taiwo',
    approvedBy: 'Fatima Bello',
    status: 'active',
    purpose: 'To measure the time (in seconds) for plasma to clot following addition of thromboplastin reagent, and to calculate the International Normalised Ratio (INR) for monitoring anticoagulant therapy.',
    principle: 'Tissue factor (thromboplastin) and calcium ions are added to citrated plasma, activating the extrinsic and common coagulation pathways. The time to clot formation is measured. INR = (PT patient / PT geometric mean normal)^ISI, where ISI is the International Sensitivity Index of the thromboplastin reagent.',
    equipment: ['Coagulation analyzer (e.g., Stago STA-R Max)', 'Centrifuge', 'Refrigerator', 'Pipettes', 'Timer'],
    reagents: ['Neoplastine CI Plus thromboplastin (ISI stated on lot certificate)', 'CaCl₂ (0.025 M)', '0.109 M trisodium citrate anticoagulant', 'PT/INR QC plasma (normal and abnormal levels)'],
    steps: [
      { stepNo: 1, title: 'Sample Collection & Processing', description: 'Collect venous blood into 3.2% sodium citrate tube (blue top). Tube fill must be 9:1 blood:citrate (fill line must be reached). Centrifuge at 2000×g for 10 minutes. Pipette platelet-poor plasma (PPP) without disturbing the buffy coat. Test within 4 hours of collection or freeze at −20°C.' },
      { stepNo: 2, title: 'QC Performance', description: 'Run normal and abnormal QC levels before patient testing. Verify results are within ±2 SD of target. Document in QC logbook. Do not process patient samples if QC fails — investigate and repeat.' },
      { stepNo: 3, title: 'PT Test Performance', description: 'Program analyzer with current lot-specific ISI and MNPT (mean normal PT). Load plasma samples and reagents as per analyzer SOP. Analyzer incubates plasma at 37°C and adds thromboplastin to initiate clotting. Clot time is detected optically or mechanically.' },
      { stepNo: 4, title: 'Result Calculation & Reporting', description: 'Analyzer calculates INR automatically using programmed ISI and MNPT. Report PT in seconds (±0.1 s) and INR (±0.1). Therapeutic INR range for warfarin therapy: typically 2.0–3.0 (standard) or 2.5–3.5 (mechanical heart valves). Critical values: INR >5.0 — notify clinician immediately.' },
    ],
    referenceRanges: [
      { parameter: 'Prothrombin Time (PT)', unit: 'seconds', maleRange: '10.0 – 13.5', femaleRange: '10.0 – 13.5' },
      { parameter: 'INR (International Normalised Ratio)', unit: 'ratio', maleRange: '0.8 – 1.2', femaleRange: '0.8 – 1.2' },
    ],
    safetyPrecautions: ['Sodium citrate is an anticoagulant — avoid injection.', 'Handle plasma with BSL-2 precautions.'],
    relatedTests: ['PT/INR', 'APTT', 'Fibrinogen'],
    tags: ['coagulation', 'PT', 'INR', 'warfarin', 'thromboplastin'],
  },
  ...NEW_SOPS,
];

// ─── Lab Tests ────────────────────────────────────────────────────────────────

const RAW_LAB_TESTS: LabTest[] = [
  {
    id: 't1', code: 'HEM001', name: 'Full Blood Count (FBC)', category: 'FBC & Automated Counts',
    turnaround: '1–2 hours', sampleType: 'Whole Blood (EDTA)', sampleVolume: '2.0 mL',
    container: 'EDTA Tube', containerColor: 'Purple/Lavender', stability: '24 hrs at 18–25°C; 48 hrs at 2–8°C',
    methodology: 'Electrical impedance, light scatter, fluorescent flow cytometry (Sysmex XN-350)',
    relatedSop: 'HEM-SOP-001',
    parameters: [
      { name: 'WBC', unit: '×10⁹/L', maleRange: '4.0 – 11.0', femaleRange: '4.0 – 11.0', pediatricRange: '5.0 – 15.0' },
      { name: 'RBC', unit: '×10¹²/L', maleRange: '4.5 – 5.5', femaleRange: '3.8 – 4.8' },
      { name: 'HGB', unit: 'g/dL', maleRange: '13.5 – 17.5', femaleRange: '11.5 – 15.5', pediatricRange: '11.0 – 16.0' },
      { name: 'HCT (PCV)', unit: '%', maleRange: '41 – 53', femaleRange: '36 – 46' },
      { name: 'MCV', unit: 'fL', maleRange: '80 – 100', femaleRange: '80 – 100' },
      { name: 'MCH', unit: 'pg', maleRange: '27 – 33', femaleRange: '27 – 33' },
      { name: 'MCHC', unit: 'g/dL', maleRange: '31.5 – 35.5', femaleRange: '31.5 – 35.5' },
      { name: 'PLT', unit: '×10⁹/L', maleRange: '150 – 400', femaleRange: '150 – 400' },
      { name: 'Neutrophils', unit: '×10⁹/L', maleRange: '1.8 – 7.5', femaleRange: '1.8 – 7.5' },
      { name: 'Lymphocytes', unit: '×10⁹/L', maleRange: '1.0 – 4.0', femaleRange: '1.0 – 4.0' },
      { name: 'Monocytes', unit: '×10⁹/L', maleRange: '0.2 – 1.0', femaleRange: '0.2 – 1.0' },
      { name: 'Eosinophils', unit: '×10⁹/L', maleRange: '0.0 – 0.5', femaleRange: '0.0 – 0.5' },
    ],
    clinicalSignificance: 'The FBC is one of the most frequently requested investigations in clinical medicine. It provides quantitative information about the cellular elements of blood and is essential in diagnosing anaemia, infections, haematological malignancies, and monitoring therapy.',
    indications: ['Diagnosis and monitoring of anaemia', 'Investigation of infection (leukocytosis, leukopenia)', 'Thrombocytopenia or thrombocytosis', 'Haematological malignancy workup', 'Pre-operative assessment', 'Chemotherapy/radiotherapy monitoring'],
    specialInstructions: 'Invert EDTA tube 8–10 times immediately after collection. Do not overfill or underfill tube. Process within 24 hours. Smear review triggered by: morphological flags, HGB <7 g/dL, PLT <50 ×10⁹/L, WBC >30 or <2 ×10⁹/L.',
    status: 'active',
  },
  {
    id: 't2', code: 'HEM002', name: 'Erythrocyte Sedimentation Rate (ESR)', category: 'ESR & Special Haematology',
    turnaround: '1 hour', sampleType: 'Citrated Blood', sampleVolume: '2.0 mL',
    container: 'Citrate ESR Tube', containerColor: 'Black', stability: 'Must be set up within 2 hours of collection',
    methodology: 'Westergren method (manual) or automated',
    relatedSop: 'HEM-SOP-002',
    parameters: [{ name: 'ESR', unit: 'mm/hr', maleRange: '0 – 15 (<50 yrs)', femaleRange: '0 – 20 (<50 yrs)', pediatricRange: '0 – 10' }],
    clinicalSignificance: 'A non-specific indicator of inflammation. Elevated in infections, inflammatory conditions, malignancies, anaemia, and pregnancy. Limited specificity; usually interpreted alongside CRP and clinical findings.',
    indications: ['Monitoring inflammatory diseases (RA, SLE)', 'Investigation of suspected infection', 'Temporal arteritis/polymyalgia rheumatica', 'Suspected myeloma (very high ESR)'],
    specialInstructions: 'Ensure exact 4:1 blood:citrate ratio. Tubes must be filled to the indicated line. Set up within 2 hours. Westergren tubes must be strictly vertical.',
    status: 'active',
  },
  {
    id: 't3', code: 'HEM003', name: 'Peripheral Blood Film (PBF)', category: 'Blood Film & Morphology',
    turnaround: '4–6 hours', sampleType: 'Whole Blood (EDTA)', sampleVolume: '2.0 mL',
    container: 'EDTA Tube', containerColor: 'Purple/Lavender', stability: 'Smear must be made within 2 hours',
    methodology: 'Manual microscopy — Leishman/May-Grünwald-Giemsa stain',
    relatedSop: 'HEM-SOP-003',
    parameters: [{ name: 'Differential WBC', unit: '%', maleRange: 'See individual cell types', femaleRange: 'See individual cell types' }],
    clinicalSignificance: 'Gold standard for morphological assessment of blood cells. Identifies abnormal cells, parasites, and conditions not detectable by automated analyzers.',
    indications: ['Abnormal automated FBC flags', 'Suspected haematological malignancy', 'Malaria/other blood parasites', 'Haemolytic anaemia workup', 'Unexplained cytopenias'],
    specialInstructions: 'Smear should ideally be made from finger-stick or freshly collected EDTA blood. Good technique is critical — attach request form specifying clinical context.',
    status: 'active',
  },
  {
    id: 't4', code: 'BB001', name: 'ABO & Rhesus (D) Blood Group', category: 'Blood Bank & Transfusion',
    turnaround: '30–60 minutes', sampleType: 'Whole Blood (EDTA or Clotted)',
    sampleVolume: '3.0 mL', container: 'EDTA or Plain Tube', containerColor: 'Purple or Red',
    stability: '72 hrs at 2–8°C', methodology: 'Haemagglutination (tile/tube method)',
    relatedSop: 'BB-SOP-001',
    parameters: [
      { name: 'ABO Group', unit: 'Group', maleRange: 'A / B / AB / O', femaleRange: 'A / B / AB / O' },
      { name: 'Rh D', unit: 'Pos/Neg', maleRange: 'Positive or Negative', femaleRange: 'Positive or Negative' },
    ],
    clinicalSignificance: 'ABO and Rh D grouping is mandatory for all transfusion and transplant procedures. Incompatible transfusions can be immediately life-threatening (haemolytic transfusion reaction).',
    indications: ['Pre-transfusion testing', 'Antenatal care', 'Pre-operative assessment', 'Haemolytic disease of the newborn workup'],
    specialInstructions: 'Two independent groupings required before transfusion. Label sample at bedside. Fetch/cross-check against historical records. NEVER assume — re-confirm for every new patient.',
    status: 'active',
  },
  {
    id: 't5', code: 'COAG001', name: 'Prothrombin Time (PT) / INR', category: 'Coagulation',
    turnaround: '1–2 hours', sampleType: 'Citrated Plasma (PPP)',
    sampleVolume: '2.7 mL', container: '3.2% Sodium Citrate Tube', containerColor: 'Light Blue',
    stability: '4 hrs at room temp; 8 hrs at 2–8°C; freeze at −20°C up to 2 weeks',
    methodology: 'Optical clot detection (Stago STA-R Max)', relatedSop: 'COAG-SOP-001',
    parameters: [
      { name: 'PT', unit: 'seconds', maleRange: '10.0 – 13.5', femaleRange: '10.0 – 13.5' },
      { name: 'INR', unit: 'ratio', maleRange: '0.8 – 1.2', femaleRange: '0.8 – 1.2' },
    ],
    clinicalSignificance: 'Evaluates the extrinsic and common coagulation pathways. Essential for monitoring warfarin therapy (INR target 2.0–3.0 for most indications), screening for coagulopathies, and pre-operative assessment.',
    indications: ['Monitoring anticoagulant therapy (warfarin)', 'Liver disease (synthetic function)', 'Pre-operative coagulation screen', 'DIC workup', 'Vitamin K deficiency'],
    specialInstructions: 'Citrate tube MUST be filled to the mark (9:1 blood:citrate ratio). Underfilled tubes give falsely prolonged PT. Transport on ice if >30 min delay. Centrifuge within 30 min. Do NOT use haemolysed or lipaemic samples.',
    status: 'active',
  },
  {
    id: 't6', code: 'COAG002', name: 'Activated Partial Thromboplastin Time (APTT)', category: 'Coagulation',
    turnaround: '1–2 hours', sampleType: 'Citrated Plasma (PPP)', sampleVolume: '2.7 mL',
    container: '3.2% Sodium Citrate Tube', containerColor: 'Light Blue',
    stability: '4 hrs at room temp; freeze at −20°C', methodology: 'Optical clot detection',
    relatedSop: 'COAG-SOP-001',
    parameters: [{ name: 'APTT', unit: 'seconds', maleRange: '25.0 – 38.0', femaleRange: '25.0 – 38.0' }],
    clinicalSignificance: 'Evaluates the intrinsic and common pathways. Used to monitor unfractionated heparin therapy, diagnose haemophilia A and B, von Willebrand disease, and lupus anticoagulant.',
    indications: ['Monitoring unfractionated heparin', 'Haemophilia A/B workup', 'Pre-operative screen', 'Lupus anticoagulant screen', 'DIC'],
    specialInstructions: 'Same collection requirements as PT. Run within 4 hours. Heparin-contaminated samples give falsely prolonged APTT — ensure IV line not used for collection.',
    status: 'active',
  },
  {
    id: 't7', code: 'BB002', name: 'Cross-Match (Compatibility Test)', category: 'Blood Bank & Transfusion',
    turnaround: '45–90 minutes (immediate spin/IS); 60–120 minutes (IAT)',
    sampleType: 'Whole Blood (EDTA) + Serum', sampleVolume: '6.0 mL',
    container: 'EDTA + Plain Tube', containerColor: 'Purple + Red',
    stability: '72 hrs at 2–8°C (group and screen valid 3 days)',
    methodology: 'Haemagglutination — saline (IS), 37°C albumin, indirect antiglobulin test (IAT)',
    relatedSop: 'BB-SOP-002',
    parameters: [{ name: 'Compatibility', unit: 'Compatible/Incompatible', maleRange: 'Compatible', femaleRange: 'Compatible' }],
    clinicalSignificance: 'Final safety check before blood component transfusion. Detects incompatibilities between donor red cells and recipient antibodies.',
    indications: ['All red cell transfusions', 'Pre-operative blood ordering', 'Obstetric care with anticipated transfusion'],
    specialInstructions: 'Patient sample MUST be taken within 72 hours of transfusion (fresh group-and-screen). Include transfusion history on request form. Two-sample rule applies for first-time group.',
    status: 'active',
  },
  {
    id: 't8', code: 'HEM004', name: 'Reticulocyte Count', category: 'FBC & Automated Counts',
    turnaround: '2–3 hours', sampleType: 'Whole Blood (EDTA)', sampleVolume: '2.0 mL',
    container: 'EDTA Tube', containerColor: 'Purple/Lavender',
    stability: '24 hrs at 18–25°C', methodology: 'Fluorescent flow cytometry (Sysmex XN-350 RET channel)',
    relatedSop: 'HEM-SOP-001',
    parameters: [
      { name: 'Reticulocyte %', unit: '%', maleRange: '0.5 – 2.5', femaleRange: '0.5 – 2.5', pediatricRange: '2.0 – 6.0 (neonates)' },
      { name: 'Absolute Reticulocyte Count', unit: '×10⁹/L', maleRange: '25 – 125', femaleRange: '25 – 125' },
      { name: 'IRF (Immature Reticulocyte Fraction)', unit: '%', maleRange: '2.0 – 14.0', femaleRange: '2.0 – 14.0' },
    ],
    clinicalSignificance: 'Reflects bone marrow erythropoietic activity. Essential in classifying anaemia as hypo- or hyperproliferative. Elevated in haemolysis, haemorrhage; decreased in aplastic anaemia, iron/B12/folate deficiency (relative).',
    indications: ['Anaemia workup', 'Monitoring response to haematinics/EPO therapy', 'Post-transplant engraftment monitoring', 'Haemolytic anaemia'],
    specialInstructions: 'Same tube as FBC — can be added on to an FBC request if clinical need identified. Neonatal normal ranges differ significantly.',
    status: 'active',
  },
  {
    id: 't9', code: 'CHEM001', name: 'Fasting Blood Glucose (FBG)', category: 'Glucose & Diabetes Markers',
    turnaround: '1–2 hours', sampleType: 'Fluoride Oxalate Plasma', sampleVolume: '2.0 mL',
    container: 'Fluoride Oxalate Tube', containerColor: 'Grey',
    stability: 'Stable for 48 hrs at 2-8°C', methodology: 'Hexokinase method (enzymatic UV)',
    relatedSop: 'CHEM-SOP-011',
    parameters: [
      { name: 'Fasting Glucose', unit: 'mmol/L', maleRange: '3.9 – 5.5', femaleRange: '3.9 – 5.5' },
    ],
    clinicalSignificance: 'Primary test for diagnosis and monitoring of Diabetes Mellitus and hypoglycemia.',
    indications: ['Diabetes screening', 'Hypoglycemia evaluation', 'Monitoring glycemic control'],
    specialInstructions: 'Patient must be fasting for 8-12 hours prior to collection. Draw sample in the morning.',
    status: 'active',
  },
  {
    id: 't10', code: 'CHEM002', name: 'Liver Function Tests (LFTs)', category: 'Bilirubin & Liver Function Tests',
    turnaround: '2–4 hours', sampleType: 'Serum or Lithium Heparin Plasma', sampleVolume: '3.0 mL',
    container: 'SST/Plain Tube', containerColor: 'Yellow/Red',
    stability: 'Serum stable up to 7 days at 2-8°C', methodology: 'Automated photometry / enzymatic assays',
    relatedSop: 'CHEM-SOP-015',
    parameters: [
      { name: 'Total Bilirubin', unit: 'µmol/L', maleRange: '0 – 21', femaleRange: '0 – 21' },
      { name: 'Direct Bilirubin', unit: 'µmol/L', maleRange: '0 – 5', femaleRange: '0 – 5' },
      { name: 'AST', unit: 'U/L', maleRange: '10 – 40', femaleRange: '10 – 35' },
      { name: 'ALT', unit: 'U/L', maleRange: '10 – 40', femaleRange: '10 – 35' },
      { name: 'ALP', unit: 'U/L', maleRange: '40 – 129', femaleRange: '35 – 104' },
      { name: 'Total Protein', unit: 'g/L', maleRange: '66 – 83', femaleRange: '66 – 83' },
      { name: 'Albumin', unit: 'g/L', maleRange: '35 – 50', femaleRange: '35 – 50' },
    ],
    clinicalSignificance: 'Used to diagnose and monitor liver diseases such as hepatitis, cirrhosis, and biliary obstruction.',
    indications: ['Jaundice', 'Hepatitis evaluation', 'Hepatotoxic drug monitoring'],
    specialInstructions: 'Avoid hemolysis, which can artificially elevate AST and ALT.',
    status: 'active',
  },
  {
    id: 't11', code: 'MIC001', name: 'Blood Culture & Sensitivity', category: 'Bacteriology',
    turnaround: '5-7 days (Preliminary at 48 hrs)', sampleType: 'Whole Blood', sampleVolume: '8-10 mL (Adult) / 1-3 mL (Pediatric)',
    container: 'Blood Culture Bottle', containerColor: 'Aerobic (Blue) / Anaerobic (Purple)',
    stability: 'Send immediately at room temp. DO NOT refrigerate.', methodology: 'Automated continuous monitoring (BACTEC)',
    relatedSop: 'MIC-SOP-001',
    parameters: [
      { name: 'Culture Result', unit: '', maleRange: 'No growth', femaleRange: 'No growth' },
    ],
    clinicalSignificance: 'Gold standard for diagnosing bacteremia and fungemia, guiding targeted antimicrobial therapy.',
    indications: ['Suspected sepsis', 'Fever of unknown origin', 'Endocarditis'],
    specialInstructions: 'Rigorous skin antisepsis (chlorhexidine/alcohol) is required prior to venipuncture to prevent contamination.',
    status: 'active',
  },
  {
    id: 't12', code: 'MIC002', name: 'Malaria Rapid Diagnostic Test (mRDT)', category: 'Parasitology',
    turnaround: '30 minutes', sampleType: 'Capillary or EDTA Blood', sampleVolume: '10-20 µL',
    container: 'Microvette or EDTA Tube', containerColor: 'Purple',
    stability: 'Stable for 24 hrs at room temp', methodology: 'Immunochromatographic assay (HRP2 / pLDH)',
    relatedSop: 'MIC-SOP-014',
    parameters: [
      { name: 'P. falciparum', unit: '', maleRange: 'Negative', femaleRange: 'Negative' },
      { name: 'Pan-species', unit: '', maleRange: 'Negative', femaleRange: 'Negative' },
    ],
    clinicalSignificance: 'Rapid detection of malaria antigens, primarily Plasmodium falciparum, for urgent treatment decisions.',
    indications: ['Acute febrile illness in endemic area', 'Suspected malaria'],
    specialInstructions: 'Positive results should ideally be confirmed with a thick/thin peripheral blood film for parasitemia quantification.',
    status: 'active',
  },
  {
    id: 't13', code: 'HIS001', name: 'H&E Routine Histology', category: 'Histology',
    turnaround: '3-5 days', sampleType: 'Tissue Biopsy', sampleVolume: 'Varies',
    container: 'Formalin Container', containerColor: 'Clear/White',
    stability: 'Stable indefinitely in 10% NBF', methodology: 'Formalin fixation, paraffin embedding, H&E staining',
    relatedSop: 'HIS-SOP-001',
    parameters: [
      { name: 'Diagnosis', unit: '', maleRange: 'Normal architecture', femaleRange: 'Normal architecture' },
    ],
    clinicalSignificance: 'Provides definitive histopathological diagnosis of benign and malignant lesions.',
    indications: ['Surgical resections', 'Diagnostic biopsies (core, incisional, excisional)', 'Tumor grading'],
    specialInstructions: 'Specimen must be completely submerged in 10% Neutral Buffered Formalin immediately after excision (10:1 formalin-to-tissue ratio).',
    status: 'active',
  },
  {
    id: 't14', code: 'HIS002', name: 'Pap Smear (Cervical Cytology)', category: 'Cytology',
    turnaround: '7-10 days', sampleType: 'Cervical Scrape/Brush', sampleVolume: 'Smear on slide or LBC vial',
    container: 'Slide + Fixative or LBC Container', containerColor: 'Clear',
    stability: 'Fixed slides stable indefinitely. LBC vial 4-6 weeks at room temp.', methodology: 'Papanicolaou Stain / Bethesda System reporting',
    relatedSop: 'HIS-SOP-010',
    parameters: [
      { name: 'Cytology Result', unit: '', maleRange: 'N/A', femaleRange: 'Negative for Intraepithelial Lesion or Malignancy (NILM)' },
    ],
    clinicalSignificance: 'Screening test for precancerous cervical lesions (CIN) and cervical cancer.',
    indications: ['Routine cervical cancer screening', 'Follow-up of abnormal Pap or HPV+', 'Post-treatment surveillance'],
    specialInstructions: 'Avoid sampling during menstruation. Fix slides immediately with 95% ethanol to prevent air-drying artifact.',
    status: 'active',
  },
  {
    id: 't15', code: 'BGS001', name: 'Antibody Screening & Identification', category: 'Antibody Screening & ID',
    turnaround: '1-4 hours', sampleType: 'Serum + EDTA Blood', sampleVolume: '6.0 mL',
    container: 'SST + EDTA', containerColor: 'Yellow + Purple',
    stability: 'Test within 72 hrs of collection', methodology: 'Indirect Antiglobulin Test (Column Agglutination / Gel Cards)',
    relatedSop: 'BGS-SOP-004',
    parameters: [
      { name: 'Alloantibody Screen', unit: '', maleRange: 'Negative', femaleRange: 'Negative' },
    ],
    clinicalSignificance: 'Detects unexpected red cell alloantibodies to prevent hemolytic transfusion reactions and HDFN.',
    indications: ['Pre-transfusion workup', 'Antenatal booking/follow-up', 'Previous history of transfusion reaction'],
    specialInstructions: 'Accurate patient history regarding previous transfusions and pregnancies is essential for interpretation.',
    status: 'active',
  },
  ...NEW_LAB_TESTS
];

const SOP_CODE_SET = new Set(SOPS.map(s => s.code));

const SOP_BY_CATEGORY = SOPS.reduce<Record<string, string>>((acc, sop) => {
  if (!acc[sop.category]) acc[sop.category] = sop.code;
  return acc;
}, {});

const SOP_BY_DEPARTMENT = SOPS.reduce<Record<string, string>>((acc, sop) => {
  if (!acc[sop.department]) acc[sop.department] = sop.code;
  return acc;
}, {});

function inferDepartmentFromTest(test: LabTest): string {
  const text = `${test.code} ${test.category} ${test.name}`.toLowerCase();
  if (text.startsWith('hem') || text.includes('haemat') || text.includes('coag') || text.includes('blood film') || text.includes('esr')) return 'Haematology';
  if (text.startsWith('che') || text.includes('chem') || text.includes('glucose') || text.includes('lipid') || text.includes('electrolyte') || text.includes('liver') || text.includes('kidney')) return 'Chemistry';
  if (text.startsWith('mic') || text.includes('micro') || text.includes('bacter') || text.includes('virol') || text.includes('mycol') || text.includes('parasite')) return 'Microbiology & Parasitology';
  if (text.startsWith('his') || text.includes('histo') || text.includes('cytolog') || text.includes('immunohistochem') || text.includes('autopsy')) return 'Histopathology';
  if (text.startsWith('bgs') || text.includes('serology') || text.includes('crossmatch') || text.includes('antibody') || text.includes('abo')) return 'Blood Group & Serology';
  return 'Haematology';
}

export const LAB_TESTS: LabTest[] = RAW_LAB_TESTS.map(test => {
  if (test.relatedSop && SOP_CODE_SET.has(test.relatedSop)) return test;
  const categoryMatch = SOP_BY_CATEGORY[test.category];
  if (categoryMatch) return { ...test, relatedSop: categoryMatch };
  const deptMatch = SOP_BY_DEPARTMENT[inferDepartmentFromTest(test)];
  return { ...test, relatedSop: deptMatch || SOPS[0].code };
});

// ─── Job Aids ─────────────────────────────────────────────────────────────────

export const JOB_AIDS: JobAid[] = [
  {
    id: 'ja1', title: 'Sysmex XN-350 Daily Startup Checklist', category: 'Equipment',
    type: 'checklist', description: 'Step-by-step daily startup verification for the Sysmex XN-350 analyzer to ensure it is ready for patient testing.',
    steps: [
      'Confirm analyzer power ON and initialization complete (green status light)',
      'Check all reagent levels on the display: Cell Pack DCL, Stromatolyser-4DL/4DS, Sulfolyser',
      'Confirm Cellclean AutoMATE wash solution available',
      'Verify waste container is <80% full — empty if needed',
      'Check printout paper (if applicable) — replace if <20% remaining',
      'Run background check: WBC <0.2, RBC <0.02, HGB <0.1, PLT <10',
      'Load and run Level 1 (Low) QC first — verify within target range',
      'Load and run Level 2 (Normal) QC — verify within target range',
      'Load and run Level 3 (High) QC — verify within target range',
      'Document QC pass/fail in QC logbook and LIS',
      'Sign startup checklist with date, time, and staff initials',
    ],
    lastUpdated: '2024-01-10', tags: ['sysmex', 'QC', 'startup', 'checklist'],
  },
  {
    id: 'ja2', title: 'Sample Rejection Criteria', category: 'Pre-Analytics',
    type: 'quick_reference', description: 'Quick reference guide for identifying and documenting unacceptable samples that must be rejected before processing.',
    steps: [
      'CLOTTED SAMPLE → Reject (EDTA, citrate tubes). Note clot on request form. Request recollection.',
      'HAEMOLYSED (moderate-severe) → Reject for coagulation, ESR. For FBC: note on report, recheck if critical values.',
      'INCORRECT TUBE TYPE → Reject (e.g., no anticoagulant for FBC). Request correct tube.',
      'UNLABELLED SAMPLE → ALWAYS reject. Do NOT label retrospectively without witnessed ID check at bedside.',
      'QUANTITY NOT SUFFICIENT (QNS) → Notify ward. Partial testing may be possible for critical patients (document).',
      'LIPAEMIC (grossly) → Reject for HGB (falsely elevated). Note on report.',
      'COLD AGGLUTININ SUSPECTED → Warm to 37°C before analysis if noted in request.',
      'SAMPLE >24 HRS OLD (FBC) → Reject. RBCs swell with time — MCV and HCT unreliable.',
      'UNDERFILLED CITRATE TUBE → Reject coagulation (falsely prolonged PT/APTT).',
      'MISLABELLED (name/number mismatch) → Hold pending verification. Escalate to senior.',
    ],
    lastUpdated: '2023-11-20', tags: ['pre-analytics', 'rejection', 'quality', 'sample'],
  },
  {
    id: 'ja3', title: 'QC Failure Decision Tree', category: 'Quality Control',
    type: 'decision_tree', description: 'Decision algorithm for managing QC failures before reporting patient results. Based on Westgard rules.',
    steps: [
      'QC result outside 2SD warning limit (1-2s rule) → WARNING: Repeat QC before proceeding. If repeat passes, continue. If repeat warns again, check for trend.',
      '1-3s rule (one result >3SD) → REJECT: Do not report patient results. Check reagents, calibration, instrument maintenance. Repeat QC.',
      '2-2s rule (2 consecutive >2SD, same direction) → REJECT: Systematic error. Check reagent lot, calibration drift. Re-calibrate if needed.',
      'R-4s rule (consecutive results >4SD range) → REJECT: Random error. Check for contamination, reagent mixing, or instrument malfunction.',
      'Trend rule (6x1s — 6 results trending same direction) → REJECT: Drift. Check reagent stability, temperature, instrument maintenance.',
      'After investigation, repeat ALL THREE QC levels.',
      'If all three pass within 2SD → Resume patient testing. Document all actions.',
      'If QC continues to fail → ESCALATE to Supervisor. DO NOT process patient samples.',
      'Document: initial failure, investigation steps, corrective action, rerun result, authorizing staff.',
    ],
    lastUpdated: '2024-02-05', tags: ['QC', 'Westgard', 'decision', 'quality'],
  },
  {
    id: 'ja4', title: 'Emergency Blood Request Protocol', category: 'Blood Bank',
    type: 'protocol', description: 'Emergency protocol for urgent blood component requests in life-threatening situations.',
    steps: [
      'EMERGENCY REQUEST received: clinician must state clinical indication and confirm patient ID.',
      'Minimum sample: 6 mL (3 mL EDTA + 3 mL clotted) with TWO-POINT patient identification.',
      'Group-specific blood (ABO/Rh only): Available in ~10–15 minutes. Cross-match pending.',
      'Emergency O-negative (uncrossmatched): Only if patient in immediate life-threatening situation. Senior staff sign-out required.',
      'Notify Senior Scientist and Blood Bank Supervisor immediately for any O-negative issue.',
      'Fast-track cross-match (immediate spin/IS): ~20–30 minutes. NOT full IAT — confirm with clinician.',
      'Full electronic cross-match: Only if patient has 2 concordant historical groups in LIS and no antibodies.',
      'Document: request time, sample receipt time, product issue time, clinician name, indication.',
      'Alert Haemovigilance Officer for all emergency O-neg issues.',
      'Follow-up: Complete cross-match on all units issued before emergency if not done.',
    ],
    lastUpdated: '2024-03-12', tags: ['emergency', 'blood bank', 'transfusion', 'protocol'],
  },
  {
    id: 'ja5', title: 'Critical Values Notification Guide', category: 'Reporting',
    type: 'quick_reference', description: 'Laboratory critical values that require immediate telephone notification to the requesting clinician.',
    steps: [
      'WBC <2.0 or >30.0 ×10⁹/L → CRITICAL: Call immediately',
      'HGB <7.0 g/dL (adult) or <8.0 g/dL (pediatric) → CRITICAL',
      'PLT <50 ×10⁹/L → CRITICAL',
      'INR >5.0 → CRITICAL',
      'APTT >120 seconds (unprovoked) → CRITICAL',
      'Blasts seen on peripheral film → CRITICAL: contact senior before issuing',
      'PROCEDURE: Call requesting clinician/ward nurse. State: "I am [name], calling from the lab with a critical result for [patient name/ID]."',
      'Read result clearly. Ask for read-back confirmation.',
      'Document in Critical Values Register: time called, name of person notified, read-back confirmed, time acknowledged.',
      'If cannot reach clinician within 15 minutes: escalate to charge nurse, then consultant on call.',
    ],
    lastUpdated: '2024-01-15', tags: ['critical values', 'notification', 'patient safety'],
  },
  {
    id: 'ja6', title: 'EDTA Tube Collection & Inversion Guide', category: 'Pre-Analytics',
    type: 'quick_reference', description: 'Quick reference for correct EDTA tube handling to prevent clotting and ensure optimal sample quality.',
    steps: [
      'Immediately after draw: cap securely while still on patient\'s arm.',
      'INVERT GENTLY 8–10 times (NOT shake). One inversion = tilt 180° and return.',
      'Too few inversions → clot formation → sample rejected.',
      'Too many/vigorous → haemolysis → false results (high K⁺, low PLT, fragile RBCs).',
      'Transport at room temperature (18–25°C) within 2 hours for FBC.',
      'If delay anticipated: store at 2–8°C — stable up to 24 hours (note MCV may increase).',
      'DO NOT freeze EDTA blood.',
      'Paediatric EDTA mini-tube (0.5 mL): invert 8 times the same way.',
      'Check for clots before processing: invert gently and palpate for resistance or strands.',
    ],
    lastUpdated: '2023-09-18', tags: ['EDTA', 'collection', 'pre-analytics', 'tube'],
  },
  {
    id: 'ja7', title: 'Haemovigilance Adverse Event Reporting', category: 'Blood Bank',
    type: 'protocol', description: 'Guide for reporting transfusion-related adverse events to the Haemovigilance Officer.',
    steps: [
      'STOP TRANSFUSION immediately if adverse event suspected.',
      'Keep IV line open with normal saline.',
      'Notify clinician immediately.',
      'Retain blood bag, administration set, and all documentation.',
      'Collect: post-transfusion EDTA sample (repeat group), urine sample, return remaining unit to blood bank.',
      'Complete Haemovigilance Adverse Event Form (available at blood bank and on intranet).',
      'Submit form to Blood Bank within 24 hours. Mark URGENT for serious reactions (anaphylaxis, haemolytic reaction, TRALI).',
      'Categories: ABO incompatibility, Febrile non-haemolytic, Urticaria, Anaphylaxis, TACO, TRALI, Septic reaction.',
      'All serious hazards of transfusion (SHOT) events MUST be reported nationally.',
      'Document in patient notes: event, actions taken, outcome, reporting confirmation.',
    ],
    lastUpdated: '2024-04-01', tags: ['haemovigilance', 'adverse event', 'transfusion', 'safety'],
  },
  {
    id: 'ja8', title: 'Cold Chain & Reagent Storage Guide', category: 'Reagent Management',
    type: 'quick_reference', description: 'Storage temperature requirements for key hematology and blood bank reagents.',
    steps: [
      'Sysmex Cell Pack DCL: 15–30°C (room temp). Do NOT refrigerate.',
      'Sysmex Stromatolyser-4DL/4DS: 15–30°C. Protect from light.',
      'Sysmex XN CHECK 3i QC material: 2–8°C (refrigerator). Bring to room temp before use.',
      'Anti-A, Anti-B, Anti-D antisera: 2–8°C. DO NOT FREEZE. Check expiry daily.',
      'Reagent A/B/O red cells: 2–8°C. DO NOT FREEZE. Use within open-vial stability.',
      'Thromboplastin reagent (PT): 2–8°C. On-board stability per manufacturer sheet.',
      'APTT reagent (APTT-SP): 2–8°C. Check open-vial stability.',
      'All opened reagents: date/time of opening, initials of staff, open-vial stability noted on label.',
      'Freezer (−20°C): coagulation controls, patient plasma aliquots (label with name, date, freeze event).',
      'Temperature log: record refrigerator and freezer temperatures TWICE daily (AM and PM). Acceptable range: fridge 2–8°C, freezer ≤−18°C. Alarm limit breach → escalate to supervisor.',
    ],
    lastUpdated: '2024-02-20', tags: ['reagent', 'storage', 'cold chain', 'temperature'],
  },
  ...NEW_JOB_AIDS,
];

// ─── Training Modules ─────────────────────────────────────────────────────────

export const TRAINING_MODULES: TrainingModule[] = [
  { id: 'tm1', title: 'Biosafety Level 2 (BSL-2) Refresher', category: 'Safety', duration: '2 hours', mandatory: true, description: 'Annual refresher on BSL-2 laboratory safety procedures, PPE use, exposure response, and waste disposal.', objectives: ['Identify BSL-2 hazards', 'Correctly don and doff PPE', 'Respond to exposure incidents', 'Classify and dispose of laboratory waste'], passingScore: 80 },
  { id: 'tm2', title: 'Sysmex XN-350 Operation & Maintenance', category: 'Equipment', duration: '3 hours', mandatory: true, description: 'Hands-on training for routine operation, daily maintenance, and troubleshooting of the Sysmex XN-350 hematology analyzer.', objectives: ['Perform daily startup and shutdown', 'Run and interpret QC', 'Troubleshoot common error messages', 'Perform scheduled maintenance tasks'], passingScore: 85 },
  { id: 'tm3', title: 'Blood Banking Fundamentals', category: 'Blood Bank', duration: '4 hours', mandatory: true, description: 'Core principles of blood banking including blood grouping, compatibility testing, and component therapy.', objectives: ['Perform ABO/Rh grouping', 'Conduct immediate spin and IAT cross-match', 'Issue blood components safely', 'Recognise transfusion reactions'], passingScore: 90 },
  { id: 'tm4', title: 'Quality Management System (QMS) Awareness', category: 'Quality', duration: '1.5 hours', mandatory: true, description: 'Introduction to the laboratory QMS, document control, non-conformance reporting, and audit processes.', objectives: ['Navigate the document management system', 'Report non-conformances', 'Understand audit procedures', 'Apply document control principles'], passingScore: 75 },
  { id: 'tm5', title: 'Haemovigilance & Transfusion Safety', category: 'Blood Bank', duration: '2 hours', mandatory: true, description: 'Recognition, management, and reporting of adverse transfusion events.', objectives: ['Identify types of transfusion reactions', 'Execute transfusion reaction protocol', 'Complete haemovigilance report', 'Understand national reporting obligations'], passingScore: 85 },
  { id: 'tm6', title: 'Sample Collection & Pre-Analytical Quality', category: 'Pre-Analytics', duration: '1 hour', mandatory: false, description: 'Best practices for sample collection, handling, and transport to minimize pre-analytical errors.', objectives: ['Apply correct tube order of draw', 'Ensure sample labelling standards', 'Handle and transport samples correctly', 'Apply sample rejection criteria'], passingScore: 75 },
  { id: 'tm7', title: 'Coagulation Testing Fundamentals', category: 'Coagulation', duration: '2 hours', mandatory: false, description: 'Principles of haemostasis and standardized procedures for PT, APTT, and fibrinogen testing.', objectives: ['Understand haemostasis pathways', 'Perform PT and APTT on Stago STA-R', 'Interpret coagulation results', 'Monitor anticoagulant therapy'], passingScore: 80 },
];

// ─── Staff Training Records ───────────────────────────────────────────────────

export const TRAINING_RECORDS: StaffTrainingRecord[] = [
  // Adaeze (u1)
  { staffId: 'u1', moduleId: 'tm1', status: 'completed', completedDate: '2024-01-20', score: 92, dueDate: '2024-12-31' },
  { staffId: 'u1', moduleId: 'tm2', status: 'completed', completedDate: '2024-02-15', score: 88, dueDate: '2024-12-31' },
  { staffId: 'u1', moduleId: 'tm3', status: 'completed', completedDate: '2024-01-25', score: 95, dueDate: '2024-12-31' },
  { staffId: 'u1', moduleId: 'tm4', status: 'completed', completedDate: '2024-03-10', score: 82, dueDate: '2024-12-31' },
  { staffId: 'u1', moduleId: 'tm5', status: 'in_progress', dueDate: '2024-06-30' },
  { staffId: 'u1', moduleId: 'tm6', status: 'completed', completedDate: '2024-02-28', score: 90, dueDate: '2024-12-31' },
  // Emeka (u2)
  { staffId: 'u2', moduleId: 'tm1', status: 'completed', completedDate: '2024-01-22', score: 78, dueDate: '2024-12-31' },
  { staffId: 'u2', moduleId: 'tm2', status: 'overdue', dueDate: '2024-03-31' },
  { staffId: 'u2', moduleId: 'tm3', status: 'completed', completedDate: '2024-02-10', score: 76, dueDate: '2024-12-31' },
  { staffId: 'u2', moduleId: 'tm4', status: 'not_started', dueDate: '2024-06-30' },
  { staffId: 'u2', moduleId: 'tm5', status: 'not_started', dueDate: '2024-06-30' },
  // Ngozi (u3)
  { staffId: 'u3', moduleId: 'tm1', status: 'completed', completedDate: '2024-01-25', score: 85, dueDate: '2024-12-31' },
  { staffId: 'u3', moduleId: 'tm3', status: 'completed', completedDate: '2024-02-20', score: 91, dueDate: '2024-12-31' },
  { staffId: 'u3', moduleId: 'tm4', status: 'in_progress', dueDate: '2024-06-30' },
  { staffId: 'u3', moduleId: 'tm5', status: 'completed', completedDate: '2024-03-01', score: 88, dueDate: '2024-12-31' },
  // Bello (u4)
  { staffId: 'u4', moduleId: 'tm1', status: 'completed', completedDate: '2024-02-05', score: 70, dueDate: '2024-12-31' },
  { staffId: 'u4', moduleId: 'tm2', status: 'overdue', dueDate: '2024-03-01' },
  { staffId: 'u4', moduleId: 'tm4', status: 'overdue', dueDate: '2024-03-01' },
  { staffId: 'u4', moduleId: 'tm7', status: 'in_progress', dueDate: '2024-04-30' },
  // Aisha (u5)
  { staffId: 'u5', moduleId: 'tm1', status: 'completed', completedDate: '2024-01-18', score: 96, dueDate: '2024-12-31' },
  { staffId: 'u5', moduleId: 'tm2', status: 'completed', completedDate: '2024-01-30', score: 94, dueDate: '2024-12-31' },
  { staffId: 'u5', moduleId: 'tm3', status: 'completed', completedDate: '2024-02-08', score: 97, dueDate: '2024-12-31' },
  { staffId: 'u5', moduleId: 'tm4', status: 'completed', completedDate: '2024-03-05', score: 88, dueDate: '2024-12-31' },
  { staffId: 'u5', moduleId: 'tm5', status: 'completed', completedDate: '2024-03-12', score: 92, dueDate: '2024-12-31' },
];

// ─── QC Logs ──────────────────────────────────────────────────────────────────

export const QC_LOGS: QCLog[] = [
  {
    id: 'qc1', date: '2024-04-09', shift: 'AM', analyzer: 'Sysmex XN-350 (Serial: XN240018)',
    level: 'Level 1 (Low)', staffId: 'u1',
    results: [
      { parameter: 'WBC', measuredValue: 2.18, targetValue: 2.20, sdValue: 0.06, sdDeviation: -0.33, status: 'pass' },
      { parameter: 'RBC', measuredValue: 2.45, targetValue: 2.44, sdValue: 0.05, sdDeviation: 0.20, status: 'pass' },
      { parameter: 'HGB', measuredValue: 7.32, targetValue: 7.30, sdValue: 0.10, sdDeviation: 0.20, status: 'pass' },
      { parameter: 'HCT', measuredValue: 22.1, targetValue: 22.0, sdValue: 0.4, sdDeviation: 0.25, status: 'pass' },
      { parameter: 'PLT', measuredValue: 88, targetValue: 90, sdValue: 5, sdDeviation: -0.40, status: 'pass' },
    ],
    overallStatus: 'passed', supervisorReviewed: true, reviewedBy: 'sup1', reviewedAt: '2024-04-09T09:30:00',
  },
  {
    id: 'qc2', date: '2024-04-09', shift: 'AM', analyzer: 'Sysmex XN-350 (Serial: XN240018)',
    level: 'Level 2 (Normal)', staffId: 'u1',
    results: [
      { parameter: 'WBC', measuredValue: 7.12, targetValue: 7.10, sdValue: 0.20, sdDeviation: 0.10, status: 'pass' },
      { parameter: 'RBC', measuredValue: 4.53, targetValue: 4.52, sdValue: 0.08, sdDeviation: 0.13, status: 'pass' },
      { parameter: 'HGB', measuredValue: 13.85, targetValue: 13.80, sdValue: 0.15, sdDeviation: 0.33, status: 'pass' },
      { parameter: 'HCT', measuredValue: 42.2, targetValue: 42.0, sdValue: 0.6, sdDeviation: 0.33, status: 'pass' },
      { parameter: 'PLT', measuredValue: 245, targetValue: 248, sdValue: 8, sdDeviation: -0.38, status: 'pass' },
    ],
    overallStatus: 'passed', supervisorReviewed: true, reviewedBy: 'sup1', reviewedAt: '2024-04-09T09:32:00',
  },
  {
    id: 'qc3', date: '2024-04-08', shift: 'AM', analyzer: 'Sysmex XN-350 (Serial: XN240018)',
    level: 'Level 2 (Normal)', staffId: 'u5',
    results: [
      { parameter: 'WBC', measuredValue: 7.55, targetValue: 7.10, sdValue: 0.20, sdDeviation: 2.25, status: 'warning' },
      { parameter: 'RBC', measuredValue: 4.50, targetValue: 4.52, sdValue: 0.08, sdDeviation: -0.25, status: 'pass' },
      { parameter: 'HGB', measuredValue: 14.15, targetValue: 13.80, sdValue: 0.15, sdDeviation: 2.33, status: 'warning' },
      { parameter: 'HCT', measuredValue: 43.8, targetValue: 42.0, sdValue: 0.6, sdDeviation: 3.00, status: 'fail' },
      { parameter: 'PLT', measuredValue: 242, targetValue: 248, sdValue: 8, sdDeviation: -0.75, status: 'pass' },
    ],
    overallStatus: 'warning', comment: 'HCT exceeded 3SD. Reagent lot checked — within open-vial stability. Re-run: HCT 42.8 (within 2SD). Supervisor notified. Patient testing resumed after re-run pass.',
    supervisorReviewed: true, reviewedBy: 'sup1', reviewedAt: '2024-04-08T11:15:00',
  },
  {
    id: 'qc4', date: '2024-04-07', shift: 'PM', analyzer: 'Sysmex XN-350 (Serial: XN240018)',
    level: 'Level 3 (High)', staffId: 'u2',
    results: [
      { parameter: 'WBC', measuredValue: 16.8, targetValue: 16.5, sdValue: 0.4, sdDeviation: 0.75, status: 'pass' },
      { parameter: 'RBC', measuredValue: 5.48, targetValue: 5.50, sdValue: 0.10, sdDeviation: -0.20, status: 'pass' },
      { parameter: 'HGB', measuredValue: 17.4, targetValue: 17.5, sdValue: 0.20, sdDeviation: -0.50, status: 'pass' },
      { parameter: 'PLT', measuredValue: 632, targetValue: 625, sdValue: 18, sdDeviation: 0.39, status: 'pass' },
    ],
    overallStatus: 'passed', supervisorReviewed: false,
  },
  {
    id: 'qc5', date: '2024-04-06', shift: 'AM', analyzer: 'Sysmex XN-350 (Serial: XN240018)',
    level: 'Level 2 (Normal)', staffId: 'u5',
    results: [
      { parameter: 'WBC', measuredValue: 7.08, targetValue: 7.10, sdValue: 0.20, sdDeviation: -0.10, status: 'pass' },
      { parameter: 'RBC', measuredValue: 4.55, targetValue: 4.52, sdValue: 0.08, sdDeviation: 0.38, status: 'pass' },
      { parameter: 'HGB', measuredValue: 13.78, targetValue: 13.80, sdValue: 0.15, sdDeviation: -0.13, status: 'pass' },
      { parameter: 'PLT', measuredValue: 250, targetValue: 248, sdValue: 8, sdDeviation: 0.25, status: 'pass' },
    ],
    overallStatus: 'passed', supervisorReviewed: true, reviewedBy: 'sup1', reviewedAt: '2024-04-06T09:45:00',
  },
];

// ─── CAPA Items ───────────────────────────────────────────────────────────────

export const CAPA_ITEMS: CAPAItem[] = [
  {
    id: 'capa1', code: 'CAPA-2024-007',
    title: 'Recurrent QC Failures — Sysmex XN-350 WBC Channel',
    description: 'Three consecutive WBC QC warnings (2SD) observed over 5 days in April 2024 on the XN-350 analyzer. Pattern suggests a systematic error affecting the WBC channel. Patient results were re-run and validated, but root cause not yet confirmed.',
    source: 'QC Log Review', priority: 'high', status: 'in_progress',
    assignedTo: 'u1', rootCause: 'Under investigation — suspected early reagent drift or WBC channel fouling.',
    correctiveAction: 'Immediate: Perform full WBC channel cleaning protocol. Replace Stromatolyser-4DL reagent with new lot (opened vial >14 days). Re-calibrate WBC channel.',
    preventiveAction: 'Increase WBC QC monitoring frequency to 3× per shift for 2 weeks. Schedule preventive maintenance for next week.',
    dueDate: '2024-04-20', openedDate: '2024-04-08',
  },
  {
    id: 'capa2', code: 'CAPA-2024-005',
    title: 'Competency Gap — Coagulation Testing (Staff)',
    description: 'End-of-year competency assessment revealed that 2 of 5 haematology staff scored below the 80% threshold for coagulation procedures (PT, APTT). One staff member (Bello Taiwo) scored 58%; another scored 72%.',
    source: 'Annual Competency Assessment', priority: 'medium', status: 'in_progress',
    assignedTo: 'sup1', rootCause: 'Insufficient on-the-job training time for coagulation bench due to high hematology workload. No structured mentorship programme in place.',
    correctiveAction: 'Enroll both staff in Coagulation Fundamentals training module. Assign mentorship pairing with senior coagulation staff. Supervised coagulation bench rotations × 4 weeks.',
    preventiveAction: 'Establish 6-monthly competency mini-assessments per bench. Create coagulation procedure job aid card.',
    dueDate: '2024-05-31', openedDate: '2024-03-15',
  },
  {
    id: 'capa3', code: 'CAPA-2024-003',
    title: 'Expired Reagent Found in Blood Bank Cold Storage',
    description: 'During monthly reagent audit, 2 vials of Anti-D antisera (Lot BA2203-21) found expired by 3 months in the blood bank refrigerator. Staff had been using the adjacent non-expired vials, and no patient testing was conducted with expired reagent (confirmed via logbook review).',
    source: 'Monthly Reagent Audit', priority: 'critical', status: 'completed',
    assignedTo: 'u3', rootCause: 'Inadequate labeling system — expired vials placed behind unexpired vials. No dedicated FIFO (First-In, First-Out) labelling. Monthly audit cycle too long for short-stability reagents.',
    correctiveAction: 'Immediately quarantined and discarded expired reagents. Daily expiry check by designated staff. Implemented FIFO labelling system for all blood bank reagents.',
    preventiveAction: 'Install reagent expiry tracking whiteboard. Added "Reagent Expiry Check" to daily startup checklist. Bi-weekly lead staff reagent audit going forward.',
    dueDate: '2024-04-01', openedDate: '2024-02-14', closedDate: '2024-03-28',
  },
  {
    id: 'capa4', code: 'CAPA-2024-001',
    title: 'Turnaround Time (TAT) Exceeded for Urgent Coagulation Requests',
    description: 'Review of December 2023 TAT data showed that 18% of urgent PT/INR requests exceeded the 2-hour TAT target. Most delays occurred during PM shift with a single coagulation-trained staff member on duty.',
    source: 'Monthly Performance Review', priority: 'medium', status: 'completed',
    assignedTo: 'sup1', rootCause: 'Staffing: PM shift coagulation bench covered by one staff member, leading to bottleneck during high volume periods. No escalation protocol for single-staff overload.',
    correctiveAction: 'Cross-trained two additional hematology staff for PM coagulation bench. Revised shift schedule to ensure ≥2 coagulation-trained staff on PM.',
    preventiveAction: 'Monthly TAT review meetings. Alert threshold set at 80-minute mark (vs. 120 min target) for escalation.',
    dueDate: '2024-03-01', openedDate: '2024-01-10', closedDate: '2024-02-28',
  },
  {
    id: 'capa5', code: 'CAPA-2024-009',
    title: 'Haemovigilance Near-Miss: Unlabelled Blood Component Issued',
    description: 'Blood component (1 unit FFP) left on issuing counter without patient label — noticed by ward nurse before administration. Near-miss event. Full investigation triggered.',
    source: 'Haemovigilance Report', priority: 'critical', status: 'open',
    assignedTo: 'hod1',
    dueDate: '2024-04-25', openedDate: '2024-04-07',
  },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const ALERTS: Alert[] = [
  { id: 'al1', type: 'danger', title: 'Critical Value — Platelet Count', message: 'Patient ID: HN-204567. PLT = 32 ×10⁹/L. Notification call made to Unit Clinician Eze (Haematology ward) at 08:42. Read-back confirmed.', date: '2024-04-09T08:42:00', read: false, targetRoles: ['staff', 'supervisor'], category: 'Critical Values' },
  { id: 'al2', type: 'warning', title: 'QC Warning — WBC Channel', message: 'Sysmex XN-350: Level 2 WBC result at +2.2 SD (warning limit). Re-run initiated. Supervisor notified. Patient testing on hold pending QC resolution.', date: '2024-04-09T07:55:00', read: false, targetRoles: ['staff', 'supervisor'], category: 'QC' },
  { id: 'al3', type: 'info', title: 'Training Reminder — Haemovigilance Module', message: 'Your completion deadline for the "Haemovigilance & Transfusion Safety" module is 30 June 2024. You have 82 days remaining.', date: '2024-04-08T09:00:00', read: true, targetRoles: ['staff'], category: 'Training' },
  { id: 'al4', type: 'danger', title: 'CAPA Overdue — Staff Review Required', message: 'CAPA-2024-007 (Sysmex WBC QC Failures) is due for update by 20 April 2024. Corrective action steps pending documentation.', date: '2024-04-08T14:00:00', read: false, targetRoles: ['supervisor'], category: 'CAPA' },
  { id: 'al5', type: 'warning', title: 'Reagent Expiry Alert — Anti-D Antiserum', message: 'Anti-D (Lot BB2402-33) expires in 7 days (16 Apr 2024). Reorder requested. Confirm stock with Ngozi Adeyemi.', date: '2024-04-09T08:00:00', read: false, targetRoles: ['staff', 'supervisor', 'hod'], category: 'Reagents' },
  { id: 'al6', type: 'danger', title: 'Haemovigilance — Near Miss Investigation', message: 'CAPA-2024-009 opened for unlabelled FFP near-miss event (07 April). Mandatory staff meeting scheduled for 10 April at 14:00.', date: '2024-04-07T16:30:00', read: false, targetRoles: ['hod', 'supervisor'], category: 'Haemovigilance' },
  { id: 'al7', type: 'success', title: 'SOP Approved — FBC Procedure Rev.04', message: 'HEM-SOP-001 Rev.04 has been approved by Ngozi Adeyemi and is now the active version in the document management system.', date: '2024-04-05T11:00:00', read: true, targetRoles: ['staff', 'supervisor', 'hod'], category: 'Documents' },
  { id: 'al8', type: 'info', title: 'New SOP Under Review — Haemoglobin Electrophoresis', message: 'HEM-SOP-009 (Haemoglobin Electrophoresis) is currently under review. Please submit your comments to Fatima Bello by 20 April 2024.', date: '2024-04-04T10:00:00', read: true, targetRoles: ['staff', 'supervisor'], category: 'Documents' },
  { id: 'al9', type: 'warning', title: 'Overdue Training — Emeka Okafor', message: 'Staff member Emeka Okafor has 2 overdue training modules (Sysmex XN-350 Operation, QMS Awareness). Escalation required.', date: '2024-04-03T09:00:00', read: false, targetRoles: ['supervisor', 'hod'], category: 'Training' },
  { id: 'al10', type: 'info', title: 'Monthly TAT Report Available', message: 'March 2024 Turnaround Time performance report is available. Overall FBC TAT compliance: 94.2%. Coagulation TAT compliance: 89.1%.', date: '2024-04-01T08:00:00', read: true, targetRoles: ['hod', 'supervisor'], category: 'Reports' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getUserByEmail(email: string): User | undefined {
  return USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getStaffUsers(): User[] {
  return USERS.filter(u => u.role === 'staff');
}

export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id);
}

export function getTrainingRecordsByStaff(staffId: string): StaffTrainingRecord[] {
  return TRAINING_RECORDS.filter(r => r.staffId === staffId);
}

export function getTrainingRecordsByModule(moduleId: string): StaffTrainingRecord[] {
  return TRAINING_RECORDS.filter(r => r.moduleId === moduleId);
}
