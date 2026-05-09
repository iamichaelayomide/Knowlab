import type { UserRole } from "./mockData";

export type PatientSex = "Female" | "Male";
export type OrderStatus = "ordered" | "collected" | "processing" | "resulted" | "verified" | "held";
export type ResultFlag = "normal" | "high" | "low" | "critical" | "pending";

export interface PatientMedication {
  name: string;
  dose: string;
  note?: string;
}

export interface PatientDiagnosis {
  label: string;
  status: "working" | "confirmed" | "history";
  date: string;
}

export interface LabResult {
  id: string;
  orderId: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: ResultFlag;
  enteredBy: string;
  enteredAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  testCode: string;
  testName: string;
  department: string;
  bench: string;
  specimen: string;
  priority: "routine" | "urgent" | "stat";
  status: OrderStatus;
  orderedAt: string;
  collectedAt?: string;
  clinician: string;
  ward: string;
  indication: string;
}

export interface PatientNote {
  id: string;
  patientId: string;
  author: string;
  createdAt: string;
  type: "case_note" | "lab_note" | "medication" | "diagnosis";
  text: string;
  attachmentName?: string;
}

export interface Patient {
  id: string;
  hospitalNumber: string;
  name: string;
  age: number;
  sex: PatientSex;
  phone?: string;
  ward: string;
  clinician: string;
  departmentScope: string;
  summary: string;
  allergies: string[];
  diagnoses: PatientDiagnosis[];
  medications: PatientMedication[];
  lastSeen: string;
}

export interface OfflineResultDraft {
  id: string;
  patientId: string;
  orderId: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: ResultFlag;
  createdAt: string;
}

const BASE_PATIENTS: Patient[] = [
  {
    id: "pt-001",
    hospitalNumber: "UCH-24-01982",
    name: "Amara Okeke",
    age: 34,
    sex: "Female",
    ward: "Medical Ward 2",
    clinician: "Dr. Salami",
    departmentScope: "Haematology",
    summary: "Admitted for severe anaemia workup with fatigue and dizziness. Previous transfusion in 2023.",
    allergies: ["No known drug allergy"],
    diagnoses: [
      { label: "Severe anaemia under evaluation", status: "working", date: "2026-05-08" },
      { label: "Menorrhagia", status: "history", date: "2025-11-12" },
    ],
    medications: [
      { name: "Ferrous sulphate", dose: "200 mg bd", note: "Started by ward team" },
      { name: "Folic acid", dose: "5 mg daily" },
    ],
    lastSeen: "2026-05-09T08:40:00Z",
  },
  {
    id: "pt-002",
    hospitalNumber: "UCH-24-02114",
    name: "Musa Danladi",
    age: 58,
    sex: "Male",
    ward: "Emergency Unit",
    clinician: "Dr. Akinola",
    departmentScope: "Chemistry",
    summary: "Known diabetic patient with vomiting and dehydration. Chemistry requested for renal function and glucose monitoring.",
    allergies: ["Penicillin"],
    diagnoses: [
      { label: "Type 2 diabetes mellitus", status: "confirmed", date: "2020-04-18" },
      { label: "Acute kidney injury query", status: "working", date: "2026-05-09" },
    ],
    medications: [
      { name: "Metformin", dose: "500 mg bd", note: "Held on admission" },
      { name: "Insulin soluble", dose: "Sliding scale" },
    ],
    lastSeen: "2026-05-09T09:15:00Z",
  },
  {
    id: "pt-003",
    hospitalNumber: "UCH-24-02201",
    name: "Chinedu Eze",
    age: 7,
    sex: "Male",
    ward: "Paediatrics",
    clinician: "Dr. Bello",
    departmentScope: "Microbiology & Parasitology",
    summary: "Fever with suspected bloodstream infection. Blood culture and malaria testing requested.",
    allergies: ["No known drug allergy"],
    diagnoses: [{ label: "Sepsis query", status: "working", date: "2026-05-09" }],
    medications: [{ name: "Ceftriaxone", dose: "Per weight", note: "Started after culture collection" }],
    lastSeen: "2026-05-09T10:05:00Z",
  },
];

const EXTRA_PATIENT_GROUPS = [
  { scope: "Haematology", bench: "FBC & Automated Counts", testCode: "FBC", testName: "Full Blood Count", specimen: "EDTA whole blood" },
  { scope: "Chemistry", bench: "Kidney Function Tests", testCode: "U&E", testName: "Urea, Electrolytes and Creatinine", specimen: "Serum" },
  { scope: "Chemistry", bench: "Liver Function Tests", testCode: "LFT", testName: "Liver Function Tests", specimen: "Serum" },
  { scope: "Microbiology & Parasitology", bench: "Bacteriology", testCode: "MCS", testName: "Microscopy, Culture and Sensitivity", specimen: "Urine" },
  { scope: "Microbiology & Parasitology", bench: "Parasitology & Malaria", testCode: "MP", testName: "Malaria Parasite", specimen: "EDTA blood" },
  { scope: "Histopathology", bench: "Histology", testCode: "HPE", testName: "Histopathology Examination", specimen: "Tissue in formalin" },
] as const;

const EXTRA_PATIENT_NAMES = [
  ["Teniola Adeyemi", "Kelechi Nnamdi", "Fatima Umar", "Samuel Ajayi", "Ebere Obi"],
  ["Olamide Yusuf", "Ifeoma Nwankwo", "Peter Okafor", "Zainab Musa", "Daniel Etim"],
  ["Maryam Bello", "Victor Afolabi", "Ngozi Eze", "Haruna Sani", "Ruth Bassey"],
  ["Amina Sule", "Ibrahim Lawal", "Grace Ojo", "Chika Onu", "David Essien"],
  ["Blessing Umeh", "Kabiru Garba", "Folake Balogun", "Emeka Ibe", "Salma Abdullahi"],
  ["Chisom Nwachukwu", "Bello Taiwo", "Adaora Okonkwo", "Joseph Inyang", "Halima Usman"],
] as const;

const EXTRA_PATIENTS: Patient[] = EXTRA_PATIENT_GROUPS.flatMap((group, groupIndex) =>
  EXTRA_PATIENT_NAMES[groupIndex].map((name, itemIndex) => {
    const number = groupIndex * 5 + itemIndex + 4;
    return {
      id: `pt-${String(number).padStart(3, "0")}`,
      hospitalNumber: `UCH-24-${String(2300 + number).padStart(5, "0")}`,
      name,
      age: 18 + ((number * 7) % 54),
      sex: number % 2 === 0 ? "Female" : "Male",
      ward: ["Medical Ward 1", "Emergency Unit", "Paediatrics", "Surgical Ward", "Antenatal Clinic"][itemIndex],
      clinician: ["Dr. Adeyemi", "Dr. Okoro", "Dr. Musa", "Dr. Ekanem", "Dr. Ibrahim"][itemIndex],
      departmentScope: group.scope,
      summary: `${group.testName} requested for active laboratory review. Result entry and review should use local reference ranges, QC status, and clinical context.`,
      allergies: itemIndex === 2 ? ["Sulphonamide"] : ["No known drug allergy"],
      diagnoses: [{ label: `${group.testName} workup`, status: "working", date: "2026-05-09" }],
      medications: [{ name: "Medication history", dose: "See case note", note: "Verify with ward chart before interpretation" }],
      lastSeen: `2026-05-09T${String(9 + groupIndex).padStart(2, "0")}:${String(10 + itemIndex * 7).padStart(2, "0")}:00Z`,
    } satisfies Patient;
  }),
);

export const PATIENTS: Patient[] = [...BASE_PATIENTS, ...EXTRA_PATIENTS];

const BASE_LAB_ORDERS: LabOrder[] = [
  {
    id: "ord-001",
    patientId: "pt-001",
    testCode: "FBC",
    testName: "Full Blood Count",
    department: "Haematology",
    bench: "FBC & Automated Counts",
    specimen: "EDTA whole blood",
    priority: "urgent",
    status: "processing",
    orderedAt: "2026-05-09T07:50:00Z",
    collectedAt: "2026-05-09T08:05:00Z",
    clinician: "Dr. Salami",
    ward: "Medical Ward 2",
    indication: "Severe anaemia workup",
  },
  {
    id: "ord-002",
    patientId: "pt-002",
    testCode: "U&E",
    testName: "Urea, Electrolytes and Creatinine",
    department: "Chemistry",
    bench: "Kidney Function Tests",
    specimen: "Serum",
    priority: "stat",
    status: "held",
    orderedAt: "2026-05-09T08:30:00Z",
    collectedAt: "2026-05-09T08:42:00Z",
    clinician: "Dr. Akinola",
    ward: "Emergency Unit",
    indication: "AKI query",
  },
  {
    id: "ord-003",
    patientId: "pt-003",
    testCode: "BCULT",
    testName: "Blood Culture",
    department: "Microbiology & Parasitology",
    bench: "Bacteriology",
    specimen: "Blood culture bottle",
    priority: "urgent",
    status: "ordered",
    orderedAt: "2026-05-09T09:10:00Z",
    clinician: "Dr. Bello",
    ward: "Paediatrics",
    indication: "Sepsis query",
  },
];

const EXTRA_LAB_ORDERS: LabOrder[] = EXTRA_PATIENTS.map((patient, index) => {
  const group = EXTRA_PATIENT_GROUPS[index % EXTRA_PATIENT_GROUPS.length];
  return {
    id: `ord-${String(index + 4).padStart(3, "0")}`,
    patientId: patient.id,
    testCode: group.testCode,
    testName: group.testName,
    department: group.scope,
    bench: group.bench,
    specimen: group.specimen,
    priority: index % 7 === 0 ? "stat" : index % 3 === 0 ? "urgent" : "routine",
    status: index % 5 === 0 ? "held" : index % 4 === 0 ? "processing" : index % 3 === 0 ? "collected" : "ordered",
    orderedAt: patient.lastSeen,
    clinician: patient.clinician,
    ward: patient.ward,
    indication: patient.diagnoses[0]?.label ?? "Laboratory review",
  };
});

export const LAB_ORDERS: LabOrder[] = [...BASE_LAB_ORDERS, ...EXTRA_LAB_ORDERS];

export const LAB_RESULTS: LabResult[] = [
  {
    id: "res-001",
    orderId: "ord-001",
    parameter: "Haemoglobin",
    value: "6.8",
    unit: "g/dL",
    referenceRange: "12.0-15.0",
    flag: "critical",
    enteredBy: "Adaeze Nwosu",
    enteredAt: "2026-05-09T08:56:00Z",
  },
  {
    id: "res-002",
    orderId: "ord-001",
    parameter: "Platelets",
    value: "118",
    unit: "x10^9/L",
    referenceRange: "150-400",
    flag: "low",
    enteredBy: "Adaeze Nwosu",
    enteredAt: "2026-05-09T08:56:00Z",
  },
  {
    id: "res-003",
    orderId: "ord-002",
    parameter: "Creatinine",
    value: "241",
    unit: "umol/L",
    referenceRange: "60-120",
    flag: "high",
    enteredBy: "Chukwuemeka Eze",
    enteredAt: "2026-05-09T09:05:00Z",
  },
];

export const PATIENT_NOTES: PatientNote[] = [
  {
    id: "note-001",
    patientId: "pt-001",
    author: "Adaeze Nwosu",
    createdAt: "2026-05-09T08:58:00Z",
    type: "lab_note",
    text: "Critical Hb requires repeat confirmation and supervisor notification according to local policy.",
  },
  {
    id: "note-002",
    patientId: "pt-002",
    author: "Chukwuemeka Eze",
    createdAt: "2026-05-09T09:08:00Z",
    type: "case_note",
    text: "Sample flagged mildly haemolysed. Potassium result should be interpreted cautiously before release.",
    attachmentName: "case-note-renal-panel.jpg",
  },
];

export function scopePatients(role: UserRole, unit: string | undefined, department: string | undefined) {
  if (role === "hod") return PATIENTS;
  const text = `${unit ?? ""} ${department ?? ""}`.toLowerCase();
  if (role === "supervisor") {
    return PATIENTS.filter((patient) => text.includes(patient.departmentScope.toLowerCase().split(" ")[0]));
  }
  return PATIENTS.filter((patient) => text.includes(patient.departmentScope.toLowerCase().split(" ")[0]));
}

export function getPatientOrders(patientId: string) {
  return LAB_ORDERS.filter((order) => order.patientId === patientId);
}

export function getOrderResults(orderId: string) {
  return LAB_RESULTS.filter((result) => result.orderId === orderId);
}

export function getPatientNotes(patientId: string) {
  return PATIENT_NOTES.filter((note) => note.patientId === patientId);
}
