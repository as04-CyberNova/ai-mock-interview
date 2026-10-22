'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Bot } from 'lucide-react';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center text-slate-100">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-sky-500/40 animate-pulse">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -inset-2 bg-cyan-400/20 rounded-3xl blur-xl animate-ping" />
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Authenticating PrepAI Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};
