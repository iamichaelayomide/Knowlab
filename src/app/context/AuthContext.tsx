import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, USERS, getUserByEmail } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'knowlab_user_id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      const found = USERS.find(u => u.id === savedId);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = getUserByEmail(email);
    if (!found) return { success: false, error: 'No account found with that email.' };
    if (found.password !== password) return { success: false, error: 'Incorrect password.' };
    setUser(found);
    localStorage.setItem(STORAGE_KEY, found.id);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-[#1c5eff] rounded-[18px] size-[48px] flex items-center justify-center">
            <span className="text-white font-bold text-[15px]">LK</span>
          </div>
          <p className="text-[#73839f] text-[13px]">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
