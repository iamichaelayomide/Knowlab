import {
  type Bench,
  type Department,
  type User,
  getBenchForUser,
  getDepartmentForUser,
} from "../data/mockData";

export interface StaffBenchContext {
  staff: User;
  department: Department;
  bench: Bench;
}

export function resolveStaffBenchContext(staff: User): StaffBenchContext {
  const department = getDepartmentForUser(staff.department, staff.unit);
  const bench = getBenchForUser(department, staff.unit);
  return { staff, department, bench };
}

export function filterStaffByDepartment(staff: User[], departmentId: string) {
  return staff.filter((member) => resolveStaffBenchContext(member).department.id === departmentId);
}

export function filterStaffByBench(staff: User[], department: Department, benchId: string | "all") {
  if (benchId === "all") return filterStaffByDepartment(staff, department.id);
  return filterStaffByDepartment(staff, department.id).filter(
    (member) => resolveStaffBenchContext(member).bench.id === benchId,
  );
}

export function groupStaffByBench(staff: User[], department: Department) {
  const byBench = new Map<string, User[]>();

  for (const bench of department.benches) {
    byBench.set(bench.id, []);
  }

  for (const member of filterStaffByDepartment(staff, department.id)) {
    const bench = resolveStaffBenchContext(member).bench;
    const existing = byBench.get(bench.id) ?? [];
    existing.push(member);
    byBench.set(bench.id, existing);
  }

  return department.benches.map((bench) => ({
    bench,
    staff: (byBench.get(bench.id) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
  }));
}
