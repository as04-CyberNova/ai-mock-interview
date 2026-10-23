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
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col selection:bg-white selection:text-black">
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

        <footer className="border-t border-neutral-900 bg-black py-8 text-center text-xs text-neutral-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PrepAI Studio. Performance &amp; Skill Metrics Engine.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-neutral-400 hover:text-white transition">
                Candidate Account
              </Link>
              <span className="text-white font-semibold">Active Session</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
