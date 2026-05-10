export type ResultStatus = 'pending' | 'validating' | 'validated';

export interface PatientResultParameter {
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  flag?: 'normal' | 'abnormal' | 'critical';
}

export interface PatientResult {
  id: string;
  testName: string;
  departmentId: 'haematology' | 'chemistry' | 'microbiology' | 'parasitology' | 'histopathology' | 'serology';
  status: ResultStatus;
  collectedAt: string;
  updatedAt: string;
  parameters: PatientResultParameter[];
}

export interface PatientRecord {
  id: string;
  fullName: string;
  sex: 'male' | 'female';
  ageYears: number;
  labNumber: string | null;
  departmentTags: PatientResult['departmentId'][];
  results: PatientResult[] | null;
}

export const PATIENTS: PatientRecord[] = [
  {
    id: 'pt-001',
    fullName: 'Adebayo Kehinde',
    sex: 'male',
    ageYears: 42,
    labNumber: 'LAB-2026-001',
    departmentTags: ['haematology', 'chemistry'],
    results: [
      {
        id: 'res-001',
        testName: 'Full Blood Count (FBC)',
        departmentId: 'haematology',
        status: 'validated',
        collectedAt: '2026-05-08T08:10:00Z',
        updatedAt: '2026-05-08T10:00:00Z',
        parameters: [
          { name: 'WBC', value: '8.2', unit: 'x10^9/L', referenceRange: '4.0 - 11.0', flag: 'normal' },
          { name: 'HGB', value: '12.4', unit: 'g/dL', referenceRange: '13.5 - 17.5', flag: 'abnormal' },
          { name: 'PLT', value: '210', unit: 'x10^9/L', referenceRange: '150 - 400', flag: 'normal' },
        ],
      },
      {
        id: 'res-002',
        testName: 'Urea, Electrolytes and Creatinine',
        departmentId: 'chemistry',
        status: 'validating',
        collectedAt: '2026-05-08T08:10:00Z',
        updatedAt: '2026-05-08T10:30:00Z',
        parameters: [
          { name: 'Sodium', value: '136', unit: 'mmol/L', referenceRange: '135 - 145', flag: 'normal' },
          { name: 'Potassium', value: '5.9', unit: 'mmol/L', referenceRange: '3.5 - 5.1', flag: 'critical' },
          { name: 'Creatinine', value: '127', unit: 'umol/L', referenceRange: '64 - 104', flag: 'abnormal' },
        ],
      },
    ],
  },
  {
    id: 'pt-002',
    fullName: 'Ngozi Chika',
    sex: 'female',
    ageYears: 29,
    labNumber: 'LAB-2026-014',
    departmentTags: ['microbiology', 'parasitology'],
    results: [
      {
        id: 'res-003',
        testName: 'Urine Culture and Sensitivity',
        departmentId: 'microbiology',
        status: 'pending',
        collectedAt: '2026-05-09T09:45:00Z',
        updatedAt: '2026-05-09T10:00:00Z',
        parameters: [{ name: 'Culture', value: 'No growth after 24 h', flag: 'normal' }],
      },
      {
        id: 'res-004',
        testName: 'Malaria Parasite Microscopy',
        departmentId: 'parasitology',
        status: 'validated',
        collectedAt: '2026-05-09T09:30:00Z',
        updatedAt: '2026-05-09T09:55:00Z',
        parameters: [
          { name: 'MP', value: 'Positive', flag: 'abnormal' },
          { name: 'Species', value: 'Plasmodium falciparum', flag: 'abnormal' },
          { name: 'Density', value: '2+', flag: 'abnormal' },
        ],
      },
    ],
  },
  {
    id: 'pt-003',
    fullName: 'Hassan Sani',
    sex: 'male',
    ageYears: 51,
    labNumber: null,
    departmentTags: ['haematology'],
    results: [],
  },
];

export function safePatientResults(patient: PatientRecord): PatientResult[] {
  return Array.isArray(patient.results) ? patient.results : [];
}
