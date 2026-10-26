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
      <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col selection:bg-[#D6C4A8]/40 selection:text-[#1A1A1A]">
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

        <footer className="border-t border-[#E8E2D9] bg-[#FFFFFF] py-8 text-center text-xs text-[#6B7280] font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PrepAI Studio. Performance &amp; Skill Metrics Engine.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-[#2D5A4A] hover:text-[#23483b] font-medium transition">
                Candidate Account
              </Link>
              <span className="text-[#2D5A4A] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2D5A4A] animate-pulse" />
                Active Session Ready
              </span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
