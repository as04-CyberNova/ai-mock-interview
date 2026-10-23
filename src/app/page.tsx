'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { InterviewSetup } from '@/components/InterviewSetup';
import { InterviewStudio } from '@/components/InterviewStudio';
import { Dashboard } from '@/components/Dashboard';
import { SessionHistory } from '@/components/SessionHistory';
import { RoleType, ExperienceLevel, InterviewSession, SimulationMode } from '@/types/interview';
import { QUESTION_BANK } from '@/data/questions';
import { AuthGuard } from '@/components/AuthGuard';
import { saveSessionToStorage, computeUserStats, useSessions } from '@/lib/session-storage';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'history' | 'setup'>('setup');
  const [selectedRole, setSelectedRole] = useState<RoleType>('data-analyst');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('Mid Level');
  const [selectedMode, setSelectedMode] = useState<SimulationMode>('voice');
  const sessions = useSessions();

  // Compute live user stats from real sessions
  const stats = computeUserStats(sessions);

  const activeQuestions = QUESTION_BANK.filter((q) => q.role === selectedRole);

  const handleStartSession = () => {
    setCurrentTab('interview');
  };

  const handleSessionComplete = (newSession: InterviewSession) => {
    saveSessionToStorage(newSession);
    setCurrentTab('dashboard');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col selection:bg-white selection:text-black">
        {/* Top Navigation */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        {/* Main App Body */}
        <main className="flex-1 pb-16">
          {currentTab === 'setup' && (
            <InterviewSetup
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              onStart={handleStartSession}
            />
          )}

          {currentTab === 'interview' && (
            <InterviewStudio
              questions={activeQuestions.length > 0 ? activeQuestions : QUESTION_BANK.slice(0, 3)}
              role={selectedRole}
              level={selectedLevel}
              mode={selectedMode}
              onComplete={handleSessionComplete}
              onExit={() => setCurrentTab('setup')}
            />
          )}

          {currentTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              recentSessions={sessions}
              onStartNew={() => setCurrentTab('setup')}
            />
          )}

          {currentTab === 'history' && (
            <SessionHistory sessions={sessions} />
          )}
        </main>

        {/* Monochrome Footer */}
        <footer className="border-t border-neutral-900 bg-black py-8 text-center text-xs text-neutral-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PrepAI Studio. Built with Next.js, Tailwind CSS &amp; AI Evaluation Engine.</p>
            <div className="flex items-center gap-6">
              <span className="text-neutral-400">Monochrome Black &amp; White Edition</span>
              <span className="text-white font-semibold">Active Session</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
