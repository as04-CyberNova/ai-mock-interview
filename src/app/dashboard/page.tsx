'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { InterviewSession } from '@/types/interview';
import { AuthGuard } from '@/components/AuthGuard';
import { getStoredSessions, computeUserStats } from '@/lib/session-storage';

export default function DashboardRoutePage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'history' | 'setup'>('dashboard');
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    setSessions(getStoredSessions());
  }, []);

  const stats = computeUserStats(sessions);

  const handleStartNew = () => {
    router.push('/');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab === 'setup' || tab === 'interview') {
              router.push('/');
            } else {
              setCurrentTab(tab);
            }
          }}
        />

        <main className="flex-1 pb-16">
          <Dashboard
            stats={stats}
            recentSessions={sessions}
            onStartNew={handleStartNew}
          />
        </main>

        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PrepAI Studio. Performance &amp; Skill Metrics Engine.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-slate-400 hover:text-sky-300 transition">
                Candidate Account
              </Link>
              <span className="text-sky-400 font-semibold">Active Session</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
