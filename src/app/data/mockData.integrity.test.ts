import { describe, expect, it } from 'vitest';
import { CAPA_ITEMS, LAB_TESTS, QC_LOGS, SOPS } from '../data/mockData';

function isUnique(values: string[]) {
  return new Set(values).size === values.length;
}

describe('mock data integrity', () => {
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
