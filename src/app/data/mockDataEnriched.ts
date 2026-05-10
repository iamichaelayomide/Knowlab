import { SOP, LabTest, JobAid } from './mockData';

// Generate comprehensive data for every single bench to ensure the UI is fully populated
const BENCHES = [
  { dept: 'Haematology', benches: ['FBC & Automated Counts', 'Blood Film & Morphology', 'Coagulation', 'Blood Bank & Transfusion', 'ESR & Special Haematology'] },
  { dept: 'Chemistry', benches: ['Glucose & Diabetes Markers', 'Bilirubin & Liver Function Tests', 'Kidney Function Tests', 'Lipid Profile', 'Electrolytes & Minerals'] },
  { dept: 'Microbiology & Parasitology', benches: ['Bacteriology', 'Mycology', 'Virology', 'Parasitology', 'Molecular Microbiology'] },
  { dept: 'Histopathology', benches: ['Histology', 'Cytology', 'Immunohistochemistry (IHC)', 'Autopsy & Post-Mortem'] },
  { dept: 'Blood Group & Serology', benches: ['ABO/Rh Blood Grouping', 'Crossmatching', 'Antibody Screening & ID', 'Serology & Immunology'] }
];

export const NEW_SOPS: SOP[] = [];
export const NEW_LAB_TESTS: LabTest[] = [];
export const NEW_JOB_AIDS: JobAid[] = [];

let sId = 100;
let tId = 100;
let jId = 100;

BENCHES.forEach(d => {
  d.benches.forEach(bench => {
    // 2 SOPs per bench
    NEW_SOPS.push({
      id: `sop${sId++}`,
      code: `${d.dept.substring(0, 3).toUpperCase()}-SOP-${sId}`,
      title: `Standard Operating Procedure for ${bench}`,
      department: d.dept,
      category: bench,
      revision: '01',
      effectiveDate: '01 Jan 2024',
      reviewDate: '01 Jan 2025',
      author: 'System Generated',
      approvedBy: 'Admin',
      status: 'active',
      purpose: `To standardize procedures within ${bench}.`,
      principle: `Standard laboratory principle for ${bench}.`,
      equipment: ['Standard Analyzer', 'Centrifuge', 'Pipettes'],
      reagents: ['Reagent A', 'Buffer B', 'Control Solution'],
      steps: [
        { stepNo: 1, title: 'Preparation', description: 'Prepare sample and reagents.' },
        { stepNo: 2, title: 'Analysis', description: 'Run sample on the analyzer.' },
        { stepNo: 3, title: 'Reporting', description: 'Validate and report results.' }
      ],
      referenceRanges: [],
      safetyPrecautions: ['Follow standard universal precautions.'],
      relatedTests: [],
      tags: [bench.split(' ')[0]]
    });
    
    NEW_SOPS.push({
      id: `sop${sId++}`,
      code: `${d.dept.substring(0, 3).toUpperCase()}-SOP-${sId}`,
      title: `Advanced Protocols in ${bench}`,
      department: d.dept,
      category: bench,
      revision: '01',
      effectiveDate: '15 Feb 2024',
      reviewDate: '15 Feb 2025',
      author: 'System Generated',
      approvedBy: 'Admin',
      status: 'active',
      purpose: `Advanced troubleshooting and methodology for ${bench}.`,
      principle: `Advanced principle for ${bench}.`,
      equipment: ['Advanced Analyzer'],
      reagents: ['Special Reagent'],
      steps: [
        { stepNo: 1, title: 'Calibration', description: 'Perform multipoint calibration.' },
        { stepNo: 2, title: 'Testing', description: 'Process complex samples.' }
      ],
      referenceRanges: [],
      safetyPrecautions: ['Wear appropriate PPE.'],
      relatedTests: [],
      tags: [bench.split(' ')[0], 'advanced']
    });

    // 2 Tests per bench
    NEW_LAB_TESTS.push({
      id: `t${tId++}`,
      code: `${d.dept.substring(0, 3).toUpperCase()}${tId}`,
      name: `Routine ${bench} Panel`,
      category: bench,
      turnaround: '2-4 hours',
      sampleType: 'Serum / Plasma / Whole Blood',
      sampleVolume: '2.0 mL',
      container: 'Standard Tube',
      containerColor: 'Purple/Lavender',
      stability: '24 hours',
      methodology: 'Automated Analysis',
      relatedSop: `${d.dept.substring(0, 3).toUpperCase()}-SOP-${sId - 2}`,
      parameters: [{ name: 'Parameter 1', unit: 'U/L', maleRange: '10-40', femaleRange: '10-40' }],
      clinicalSignificance: `Assists in diagnosis related to ${bench}.`,
      indications: ['Routine screening'],
      specialInstructions: 'None',
      status: 'active'
    });

    NEW_LAB_TESTS.push({
      id: `t${tId++}`,
      code: `${d.dept.substring(0, 3).toUpperCase()}${tId}`,
      name: `Comprehensive ${bench} Analysis`,
      category: bench,
      turnaround: '24 hours',
      sampleType: 'Specific Specimen',
      sampleVolume: '4.0 mL',
      container: 'Special Tube',
      containerColor: 'Light Blue',
      stability: '48 hours',
      methodology: 'Specialized Assay',
      relatedSop: `${d.dept.substring(0, 3).toUpperCase()}-SOP-${sId - 1}`,
      parameters: [],
      clinicalSignificance: `Detailed diagnostic evaluation for ${bench}.`,
      indications: ['Specialist request'],
      specialInstructions: 'Fasting may be required.',
      status: 'active'
    });

    // 2 Job Aids per bench
    NEW_JOB_AIDS.push({
      id: `ja${jId++}`,
      title: `${bench} Quick Checklist`,
      category: bench,
      type: 'checklist',
      description: `Daily routine checklist for the ${bench} bench to ensure all QC and maintenance are completed.`,
      steps: ['Check temperatures', 'Run daily QC', 'Review pending logs', 'Perform end-of-shift maintenance'],
      lastUpdated: '2024-02-01',
      tags: [bench.split(' ')[0], 'daily', 'checklist']
    });

    NEW_JOB_AIDS.push({
      id: `ja${jId++}`,
      title: `${bench} Troubleshooting Guide`,
      category: bench,
      type: 'decision_tree',
      description: `Step-by-step guide for resolving common errors and flags in ${bench}.`,
      steps: ['Identify the flag or error code', 'Check reagent levels', 'Rerun sample with dilution if necessary', 'Escalate to supervisor if unresolved'],
      lastUpdated: '2024-03-01',
      tags: [bench.split(' ')[0], 'troubleshooting', 'error']
    });
  });
});
