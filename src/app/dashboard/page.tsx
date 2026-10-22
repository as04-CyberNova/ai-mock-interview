'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/lib/auth-context';
import { InterviewSession, UserStats } from '@/types/interview';
import { AuthGuard } from '@/components/AuthGuard';

export default function DashboardRoutePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'history' | 'setup'>('dashboard');

  const [sessions] = useState<InterviewSession[]>([
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
          userAnswer: 'I examine mechanisms (MCAR vs MAR), use median/mode imputation based on skewness, and deduplicate primary keys.',
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

  const stats: UserStats = {
    totalInterviews: sessions.length + 10,
    averageScore: 86,
    hoursPracticed: 6.5,
    readinessScore: 88,
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
          mockUser={{
            name: user?.name || 'Alex Hunter',
            role: user?.targetRole || 'Data & AI Engineer'
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
