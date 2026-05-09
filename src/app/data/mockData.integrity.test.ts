import { describe, expect, it } from 'vitest';
import { CAPA_ITEMS, LAB_TESTS, QC_LOGS, SOPS } from '../data/mockData';

function isUnique(values: string[]) {
  return new Set(values).size === values.length;
}

describe('mock data integrity', () => {
  it('does not contain placeholder-style lab test content', () => {
    const combined = LAB_TESTS.map((test) => {
      const parameterNames = test.parameters.map((parameter) => parameter.name).join(' ');
      return [test.name, test.methodology, test.clinicalSignificance, parameterNames, test.specialInstructions].join(' ');
    }).join(' ');

    const bannedPatterns = [
      /routine panel/i,
      /extended panel/i,
      /confirmatory assay/i,
      /urgent stat profile/i,
      /primary marker/i,
      /validated automated or bench workflow/i,
      /method-specific confirmatory assay/i,
      /supports .* diagnosis, monitoring, and treatment decisions/i,
      /\btemplate\b/i,
      /\bplaceholder\b/i,
    ];

    bannedPatterns.forEach((pattern) => {
      expect(combined).not.toMatch(pattern);
    });
  });

  it('has unique SOP ids and codes', () => {
    expect(isUnique(SOPS.map((s) => s.id))).toBe(true);
    expect(isUnique(SOPS.map((s) => s.code))).toBe(true);
  });

  it('has unique test ids and codes', () => {
    expect(isUnique(LAB_TESTS.map((t) => t.id))).toBe(true);
    expect(isUnique(LAB_TESTS.map((t) => t.code))).toBe(true);
  });

  it('has unique QC log ids', () => {
    expect(isUnique(QC_LOGS.map((q) => q.id))).toBe(true);
  });

  it('has unique CAPA ids and codes', () => {
    expect(isUnique(CAPA_ITEMS.map((c) => c.id))).toBe(true);
    expect(isUnique(CAPA_ITEMS.map((c) => c.code))).toBe(true);
  });
});
