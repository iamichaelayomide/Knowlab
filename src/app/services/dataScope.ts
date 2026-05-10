import { User } from '../data/mockData';

export type ScopeMode = 'department' | 'all';

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

export function getUserScopeMode(user: User | null | undefined): ScopeMode {
  if (!user) return 'department';
  if (user.role === 'hod') return 'all';
  return 'department';
}

export function isDepartmentVisible(user: User | null | undefined, departmentLabel: string): boolean {
  if (!user) return false;
  if (getUserScopeMode(user) === 'all') return true;

  const userDept = normalize(user.department);
  const userUnit = normalize(user.unit);
  const value = normalize(departmentLabel);
  return value.includes(userDept) || value.includes(userUnit) || userDept.includes(value);
}
