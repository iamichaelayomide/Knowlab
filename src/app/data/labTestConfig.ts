export type TestCategory =
  | 'quantitative_panel'
  | 'descriptive'
  | 'microbiology'
  | 'malaria_parasite'
  | 'serology_titre'
  | 'rapid_test';

export interface ReferenceInterval {
  male?: string;
  female?: string;
  pediatric?: string;
}

export interface QuantParameter {
  key: string;
  label: string;
  unit: string;
  reference: ReferenceInterval;
  criticalLow?: number;
  criticalHigh?: number;
}

export interface LabTestDefinition {
  id: string;
  name: string;
  department: string;
  category: TestCategory;
  parameters?: QuantParameter[];
  titreAntigens?: string[];
  significantTitre?: string;
}

export const GRAM_NEGATIVE_ANTIBIOTICS = ['Gentamicin', 'Ciprofloxacin', 'Ceftriaxone', 'Meropenem', 'Amikacin'];
export const GRAM_POSITIVE_ANTIBIOTICS = ['Amoxicillin', 'Cloxacillin', 'Erythromycin', 'Vancomycin', 'Linezolid'];

export const ORGANISM_SUGGESTIONS = [
  'Escherichia coli',
  'Klebsiella pneumoniae',
  'Staphylococcus aureus',
  'Pseudomonas aeruginosa',
  'Candida albicans',
];

export const MALARIA_SPECIES = [
  'Plasmodium falciparum',
  'Plasmodium vivax',
  'Plasmodium malariae',
  'Plasmodium ovale',
];

export const MALARIA_DENSITY_INFO: Record<string, string> = {
  '1+': '1-10 parasites per 100 thick-film fields',
  '2+': '11-100 parasites per 100 thick-film fields',
  '3+': '1-10 parasites per single thick-film field',
  '4+': '>10 parasites per single thick-film field',
};

export const WIDAL_DILUTIONS = ['1:20', '1:40', '1:80', '1:160', '1:320'];

export const LAB_TEST_CONFIG: LabTestDefinition[] = [
  {
    id: 'fbc',
    name: 'Full Blood Count (FBC)',
    department: 'haematology',
    category: 'quantitative_panel',
    parameters: [
      { key: 'wbc', label: 'WBC', unit: 'x10^9/L', reference: { male: '4.0 - 11.0', female: '4.0 - 11.0' }, criticalLow: 2, criticalHigh: 30 },
      { key: 'hgb', label: 'Haemoglobin', unit: 'g/dL', reference: { male: '13.5 - 17.5', female: '11.5 - 15.5' }, criticalLow: 7 },
      { key: 'plt', label: 'Platelets', unit: 'x10^9/L', reference: { male: '150 - 400', female: '150 - 400' }, criticalLow: 50, criticalHigh: 1000 },
    ],
  },
  {
    id: 'lft',
    name: 'Liver Function Test (LFT)',
    department: 'chemistry',
    category: 'quantitative_panel',
    parameters: [
      { key: 'alt', label: 'ALT', unit: 'U/L', reference: { male: '10 - 40', female: '10 - 35' } },
      { key: 'ast', label: 'AST', unit: 'U/L', reference: { male: '10 - 40', female: '10 - 35' } },
      { key: 'alp', label: 'ALP', unit: 'U/L', reference: { male: '40 - 129', female: '35 - 104' } },
    ],
  },
  { id: 'urinalysis', name: 'Urinalysis (Routine)', department: 'chemistry', category: 'descriptive' },
  { id: 'stool', name: 'Stool Microscopy', department: 'parasitology', category: 'descriptive' },
  { id: 'culture', name: 'Culture & Sensitivity', department: 'microbiology', category: 'microbiology' },
  { id: 'mp', name: 'Malaria Parasite Test', department: 'parasitology', category: 'malaria_parasite' },
  {
    id: 'widal',
    name: 'Widal Test',
    department: 'serology',
    category: 'serology_titre',
    titreAntigens: ['O Antigen', 'H Antigen'],
    significantTitre: 'A titre >= 1:160 may be clinically significant, correlate with symptoms and local baseline titres.',
  },
  { id: 'pregnancy', name: 'Pregnancy Test', department: 'chemistry', category: 'rapid_test' },
  { id: 'rapid_antigen', name: 'Rapid Antigen Test', department: 'microbiology', category: 'rapid_test' },
];
