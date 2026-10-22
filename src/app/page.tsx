'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { InterviewSetup } from '@/components/InterviewSetup';
import { InterviewStudio } from '@/components/InterviewStudio';
import { Dashboard } from '@/components/Dashboard';
import { SessionHistory } from '@/components/SessionHistory';
import { RoleType, ExperienceLevel, InterviewSession, UserStats, SimulationMode } from '@/types/interview';
import { QUESTION_BANK } from '@/data/questions';
import { AuthGuard } from '@/components/AuthGuard';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'history' | 'setup'>('setup');
  const [selectedRole, setSelectedRole] = useState<RoleType>('data-analyst');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('Mid Level');
  const [selectedMode, setSelectedMode] = useState<SimulationMode>('voice');

  // Seed sample mock sessions with fixed timestamps for prerender safety
  const [sessions, setSessions] = useState<InterviewSession[]>([
    {
      id: 'session-demo-1',
      role: 'data-analyst',
      level: 'Mid Level',
      mode: 'voice',
      startedAt: '2026-10-20T10:00:00.000Z',
      completedAt: '2026-10-20T10:20:00.000Z',
      overallScore: 88,
      technicalAccuracyAverage: 85,
      communicationAverage: 90,
      structureAverage: 89,
      summaryFeedback: 'Excellent performance on KPI architecture and root-cause analysis.',
      items: [
        {
          questionId: 'da-1',
          questionText: 'How do you handle missing or duplicate values in a raw dataset?',
          userAnswer: 'I first examine missingness mechanisms (MCAR vs MAR). For minor nulls I evaluate median/mode imputation based on skewness. For duplicates, I verify primary keys and deduplicate.',
          timeSpentSeconds: 140,
          evaluation: {
            score: 88,
            technicalAccuracyScore: 85,
            communicationScore: 90,
            structureScore: 89,
            strengths: ['Great usage of data integrity and imputation vocabulary.'],
            improvements: ['Could mention how downstream ML algorithms handle missingness.'],
            suggestedAnswer: 'Explain MCAR/MAR, imputation strategies, and business impact.',
            keyKeywordsFound: ['imputation', 'null', 'deduplication'],
            missingKeywords: ['business context']
          }
        }
      ]
    },
    {
      id: 'session-demo-2',
      role: 'sql',
      level: 'Entry Level',
      mode: 'text',
      startedAt: '2026-10-18T14:00:00.000Z',
      completedAt: '2026-10-18T14:15:00.000Z',
      overallScore: 82,
      technicalAccuracyAverage: 84,
      communicationAverage: 80,
      structureAverage: 82,
      summaryFeedback: 'Strong foundational grasp of SQL aggregation ordering and filter stages.',
      items: [
        {
          questionId: 'sql-1',
          questionText: 'What is the key difference between WHERE and HAVING clauses in SQL?',
          userAnswer: 'WHERE filters rows before grouping occurs, while HAVING filters aggregated results produced by GROUP BY.',
          timeSpentSeconds: 95,
          evaluation: {
            score: 82,
            technicalAccuracyScore: 84,
            communicationScore: 80,
            structureScore: 82,
            strengths: ['Accurate explanation of query execution order.'],
            improvements: ['Include sample query syntax illustrating COUNT(*) filter.'],
            suggestedAnswer: 'Explain execution order and aggregate filtering.',
            keyKeywordsFound: ['filter', 'row-level', 'group by', 'aggregate'],
            missingKeywords: ['count/sum']
          }
        }
      ]
    }
  ]);

  // Derived user statistics
  const stats: UserStats = {
    totalInterviews: sessions.length + 10,
    averageScore: Math.round(
      sessions.length > 0 
        ? sessions.reduce((acc, s) => acc + (s.overallScore || 75), 0) / sessions.length 
        : 84
    ),
    hoursPracticed: 6.5,
    readinessScore: 86,
    roleBreakdown: [
      { role: 'data-analyst', count: 4, avgScore: 88 },
      { role: 'sql', count: 3, avgScore: 82 },
      { role: 'python', count: 3, avgScore: 79 },
      { role: 'hr', count: 2, avgScore: 91 },
      { role: 'fullstack-dev', count: 4, avgScore: 87 },
      { role: 'ai-ml-engineer', count: 3, avgScore: 84 },
      { role: 'system-design', count: 2, avgScore: 81 },
      { role: 'devops-cloud', count: 2, avgScore: 85 }
    ],
    skillScores: [
      { skill: 'Technical Depth', score: 86 },
      { skill: 'Communication', score: 90 },
      { skill: 'STAR Framework', score: 84 },
      { skill: 'Problem Solving', score: 88 },
      { skill: 'SQL & Data', score: 85 }
    ],
    recentActivity: [
      { date: 'Oct 15', score: 74, role: 'SQL' },
      { date: 'Oct 17', score: 79, role: 'Python' },
      { date: 'Oct 18', score: 82, role: 'Data' },
      { date: 'Oct 19', score: 85, role: 'HR' },
      { date: 'Oct 21', score: 88, role: 'Data' },
      { date: 'Today', score: 91, role: 'SQL' }
    ]
  };

  const activeQuestions = QUESTION_BANK.filter((q) => q.role === selectedRole);

  const handleStartSession = () => {
    setCurrentTab('interview');
  };

  const handleSessionComplete = (newSession: InterviewSession) => {
    setSessions((prev) => [newSession, ...prev]);
    setCurrentTab('dashboard');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#070d19] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
        {/* Top Navigation */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mockUser={{ name: 'Alex Hunter', role: 'Aspiring Data & AI Engineer' }}
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

        {/* Modern Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PrepAI Studio. Built with Next.js, Tailwind CSS, Supabase & AI Evaluation Engine.</p>
            <div className="flex items-center gap-6">
              <span className="text-slate-400">Electric Blue & Dark Navy Edition</span>
              <span className="text-sky-400 font-semibold">Ready for Deployment</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
