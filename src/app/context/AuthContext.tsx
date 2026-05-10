import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, USERS, getUserByEmail } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'knowlab_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // load persisted user (stored as JSON)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User | null;
        if (parsed && parsed.id) {
          // Verify user still exists in mock dataset
          const found = USERS.find(u => u.id === parsed.id);
          if (found) setUser(found);
        }
      }
    } catch (err) {
      // If parsing fails, clear the key to avoid repeated errors
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }

    setIsLoading(false);

    // keep auth state in sync across tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) {
          // logged out in another tab
          setUser(null);
        } else {
          try {
            const parsed = JSON.parse(e.newValue) as User | null;
            if (parsed && parsed.id) {
              const found = USERS.find(u => u.id === parsed.id);
              setUser(found || null);
            }
          } catch (error) {
            setUser(null);
          }
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = getUserByEmail(email);
    if (!found) return { success: false, error: 'No account found with that email.' };
    if (found.password !== password) return { success: false, error: 'Incorrect password.' };

    setUser(found);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch (e) {
      // ignore localStorage failures (e.g., quota) but keep in-memory user
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
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
