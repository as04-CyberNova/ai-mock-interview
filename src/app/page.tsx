'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { InterviewSetup } from '@/components/InterviewSetup';
import { InterviewStudio } from '@/components/InterviewStudio';
import { Dashboard } from '@/components/Dashboard';
import { SessionHistory } from '@/components/SessionHistory';
import { RoleType, ExperienceLevel, InterviewSession, SimulationMode, Question } from '@/types/interview';
import { QUESTION_BANK } from '@/data/questions';
import { AuthGuard } from '@/components/AuthGuard';
import { saveSessionToStorage, computeUserStats, useSessions } from '@/lib/session-storage';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'history' | 'setup'>('setup');
  const [selectedRole, setSelectedRole] = useState<RoleType>('data-analyst');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('Mid Level');
  const [selectedMode, setSelectedMode] = useState<SimulationMode>('voice');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const sessions = useSessions();

  // Compute live user stats from real sessions
  const stats = computeUserStats(sessions);

  const handleStartSession = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          level: selectedLevel,
          count: selectedMode === 'rapid-fire' ? 5 : 3
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setSessionQuestions(data.questions);
          setCurrentTab('interview');
          return;
        }
      }
    } catch {
      // Fallback handled below
    } finally {
      setIsGenerating(false);
    }

    // Fallback to static questions filtered by role
    const fallback = QUESTION_BANK.filter((q) => q.role === selectedRole);
    setSessionQuestions(fallback.length > 0 ? fallback : QUESTION_BANK.slice(0, 3));
    setCurrentTab('interview');
  };

  const handleSessionComplete = (newSession: InterviewSession) => {
    saveSessionToStorage(newSession);
    setCurrentTab('dashboard');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col selection:bg-[#D6C4A8]/40 selection:text-[#1A1A1A]">
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
              isGenerating={isGenerating}
            />
          )}

          {currentTab === 'interview' && (
            <InterviewStudio
              questions={sessionQuestions.length > 0 ? sessionQuestions : QUESTION_BANK.slice(0, 3)}
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

        {/* Footer */}
        <footer className="border-t border-[#E8E2D9] bg-[#FFFFFF] py-8 text-center text-xs text-[#6B7280] font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PrepAI Studio. Powered by Autonomous Speech Recognition &amp; STAR Neural Engine.</p>
            <div className="flex items-center gap-6">
              <span className="text-[#2D5A4A] font-semibold">PrepAI Studio Edition</span>
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
