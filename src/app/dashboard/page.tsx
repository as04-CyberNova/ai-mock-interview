'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { AuthGuard } from '@/components/AuthGuard';
import { computeUserStats, useSessions } from '@/lib/session-storage';

export default function DashboardRoutePage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'history' | 'setup'>('dashboard');
  const sessions = useSessions();

  const stats = computeUserStats(sessions);

  const handleStartNew = () => {
    router.push('/');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
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

        <footer className="border-t border-cyan-500/15 bg-[#050711] py-8 text-center text-xs text-slate-400 font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PrepAI Cyber Studio. Performance &amp; Skill Metrics Engine.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-cyan-400 hover:text-cyan-200 transition">
                Candidate Account
              </Link>
              <span className="text-pink-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
                Neural Grid Online
              </span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
