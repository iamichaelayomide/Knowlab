import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Department,
  Bench,
  DEPARTMENTS,
  getDepartmentForUser,
  getBenchForUser,
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface DepartmentContextType {
  activeDepartment: Department;
  activeBench: Bench;
  setActiveDepartment: (dept: Department) => void;
  setActiveBench: (bench: Bench) => void;
  departments: Department[];
  resetToUserDefault: () => void;
}

const DepartmentContext = createContext<DepartmentContextType | null>(null);

const STORAGE_DEPT = 'knowlab_active_dept';
const STORAGE_BENCH = 'knowlab_active_bench';

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const computeDefaults = useCallback(() => {
    if (user) {
      const dept = getDepartmentForUser(user.department, user.unit);
      const bench = getBenchForUser(dept, user.unit);
      return { dept, bench };
    }
    return { dept: DEPARTMENTS[0], bench: DEPARTMENTS[0].benches[0] };
  }, [user]);

  const [activeDepartment, setActiveDepartmentState] = useState<Department>(() => {
    const saved = localStorage.getItem(STORAGE_DEPT);
    if (saved) {
      const found = DEPARTMENTS.find(d => d.id === saved);
      if (found) return found;
    }
    return computeDefaults().dept;
  });

  const [activeBench, setActiveBenchState] = useState<Bench>(() => {
    const savedDeptId = localStorage.getItem(STORAGE_DEPT);
    const savedBenchId = localStorage.getItem(STORAGE_BENCH);
    if (savedDeptId && savedBenchId) {
      const dept = DEPARTMENTS.find(d => d.id === savedDeptId);
      if (dept) {
        const bench = dept.benches.find(b => b.id === savedBenchId);
        if (bench) return bench;
      }
    }
    return computeDefaults().bench;
  });

  // When user changes (login/logout), update to their defaults if nothing saved
  useEffect(() => {
    const savedDept = localStorage.getItem(STORAGE_DEPT);
    if (!savedDept && user) {
      const { dept, bench } = computeDefaults();
      setActiveDepartmentState(dept);
      setActiveBenchState(bench);
    }
  }, [user, computeDefaults]);

  const setActiveDepartment = (dept: Department) => {
    setActiveDepartmentState(dept);
    localStorage.setItem(STORAGE_DEPT, dept.id);
    // Reset bench to first in new dept
    const firstBench = dept.benches[0];
    setActiveBenchState(firstBench);
    localStorage.setItem(STORAGE_BENCH, firstBench.id);
  };

  const setActiveBench = (bench: Bench) => {
    setActiveBenchState(bench);
    localStorage.setItem(STORAGE_BENCH, bench.id);
  };

  const resetToUserDefault = () => {
    const { dept, bench } = computeDefaults();
    setActiveDepartmentState(dept);
    setActiveBenchState(bench);
    localStorage.setItem(STORAGE_DEPT, dept.id);
    localStorage.setItem(STORAGE_BENCH, bench.id);
  };

  return (
    <DepartmentContext.Provider
      value={{
        activeDepartment,
        activeBench,
        setActiveDepartment,
        setActiveBench,
        departments: DEPARTMENTS,
        resetToUserDefault,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  const ctx = useContext(DepartmentContext);
  if (!ctx) throw new Error('useDepartment must be used within DepartmentProvider');
  return ctx;
}
