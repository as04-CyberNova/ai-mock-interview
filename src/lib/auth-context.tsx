'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  avatarUrl?: string;
  streakDays: number;
  isGuest?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('prepai_user_session');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, name?: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const displayName = name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1));
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: displayName,
      email,
      targetRole: 'Data & AI Engineer',
      streakDays: 1,
      isGuest: false
    };
    setUser(newUser);
    localStorage.setItem('prepai_user_session', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      name: 'Guest Candidate',
      email: 'guest@prepai.studio',
      targetRole: 'Data Analyst Candidate',
      streakDays: 1,
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('prepai_user_session', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prepai_user_session');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('prepai_user_session', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAsGuest, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
