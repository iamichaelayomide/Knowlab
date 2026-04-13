import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, USERS, getUserByEmail } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  requestPasswordReset: (email: string) => { success: boolean; message: string };
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'knowlab_user_id';
const LOCAL_PASSWORDS_KEY = 'knowlab_local_passwords';

function getPasswordMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LOCAL_PASSWORDS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function setPasswordMap(map: Record<string, string>) {
  localStorage.setItem(LOCAL_PASSWORDS_KEY, JSON.stringify(map));
}

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
    if (isSupabaseConfigured() && supabase) {
      // Non-blocking fallback: if supabase auth fails, local demo auth still works.
      void supabase.auth.signInWithPassword({ email, password }).catch(() => undefined);
    }

    const found = getUserByEmail(email);
    if (!found) return { success: false, error: 'No account found with that email.' };
    const overrides = getPasswordMap();
    const expectedPassword = overrides[found.email.toLowerCase()] ?? found.password;
    if (expectedPassword !== password) return { success: false, error: 'Incorrect password.' };
    setUser(found);
    localStorage.setItem(STORAGE_KEY, found.id);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (isSupabaseConfigured() && supabase) {
      void supabase.auth.signOut().catch(() => undefined);
    }
  };

  const requestPasswordReset = (email: string): { success: boolean; message: string } => {
    const found = getUserByEmail(email);
    if (!found) {
      return {
        success: true,
        message: 'If the account exists, a password reset link/instruction has been sent.',
      };
    }
    // In demo/local mode we only surface confirmation without exposing user state.
    return {
      success: true,
      message: 'Password reset request received. Use the reset form to set a new password for demo users.',
    };
  };

  const resetPassword = (email: string, newPassword: string): { success: boolean; error?: string } => {
    const found = getUserByEmail(email);
    if (!found) return { success: false, error: 'Account not found.' };
    if (newPassword.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    const overrides = getPasswordMap();
    overrides[found.email.toLowerCase()] = newPassword;
    setPasswordMap(overrides);
    return { success: true };
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
    <AuthContext.Provider value={{ user, login, logout, requestPasswordReset, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
