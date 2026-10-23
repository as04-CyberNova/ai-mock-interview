import React from 'react';
import { InterviewSession, UserStats, RoleType } from '@/types/interview';

const STORAGE_KEY = 'prepai_interview_sessions';
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeSessions(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let cachedSessions: InterviewSession[] | null = null;
let cachedRaw: string | null = null;

export function getStoredSessions(): InterviewSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw && cachedSessions !== null) {
      return cachedSessions;
    }
    cachedRaw = raw;
    cachedSessions = raw ? JSON.parse(raw) : [];
    return cachedSessions as InterviewSession[];
  } catch (err) {
    console.error('Failed to read sessions from localStorage', err);
    return [];
  }
}

const emptySessions: InterviewSession[] = [];
function getServerSnapshot(): InterviewSession[] {
  return emptySessions;
}

export function useSessions() {
  return React.useSyncExternalStore(
    subscribeSessions,
    getStoredSessions,
    getServerSnapshot
  );
}

export function saveSessionToStorage(session: InterviewSession): InterviewSession[] {
  if (typeof window === 'undefined') return [session];
  try {
    const existing = getStoredSessions();
    const updated = [session, ...existing.filter((s) => s.id !== session.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    cachedRaw = JSON.stringify(updated);
    cachedSessions = updated;
    emitChange();
    return updated;
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
    return [session];
  }
}

export function computeUserStats(sessions: InterviewSession[]): UserStats {
  if (!sessions || sessions.length === 0) {
    return {
      totalInterviews: 0,
      averageScore: 0,
      hoursPracticed: 0,
      readinessScore: 0,
      roleBreakdown: [],
      skillScores: [],
      recentActivity: []
    };
  }

  const totalInterviews = sessions.length;

  // Calculate actual total seconds spent across all question items
  const totalSeconds = sessions.reduce((sessionAcc, session) => {
    const itemSecs = session.items?.reduce((itemAcc, item) => itemAcc + (item.timeSpentSeconds || 0), 0) || 0;
    if (itemSecs > 0) return sessionAcc + itemSecs;
    // Fallback: estimate from startedAt/completedAt
    if (session.startedAt && session.completedAt) {
      const diff = Math.max(0, (new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()) / 1000);
      return sessionAcc + diff;
    }
    return sessionAcc;
  }, 0);

  const hoursPracticed = Number((totalSeconds / 3600).toFixed(1));

  // Average overall score
  const validScores = sessions.map((s) => s.overallScore).filter((s): s is number => typeof s === 'number');
  const averageScore = validScores.length > 0
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 0;

  // Readiness score: weighted formula (70% avg score + 30% volume consistency cap)
  const volumeBonus = Math.min(30, totalInterviews * 6);
  const readinessScore = Math.min(100, Math.round((averageScore * 0.7) + volumeBonus));

  // Role Breakdown computed directly from real sessions
  const roleMap = new Map<RoleType, { count: number; totalScore: number }>();
  sessions.forEach((s) => {
    const prev = roleMap.get(s.role) || { count: 0, totalScore: 0 };
    roleMap.set(s.role, {
      count: prev.count + 1,
      totalScore: prev.totalScore + (s.overallScore || 0)
    });
  });

  const roleBreakdown = Array.from(roleMap.entries()).map(([role, data]) => ({
    role,
    count: data.count,
    avgScore: Math.round(data.totalScore / data.count)
  }));

  // Skill scores computed from rubrics of real sessions
  let totalTech = 0, countTech = 0;
  let totalComm = 0, countComm = 0;
  let totalStruct = 0, countStruct = 0;

  sessions.forEach((s) => {
    if (typeof s.technicalAccuracyAverage === 'number') {
      totalTech += s.technicalAccuracyAverage;
      countTech++;
    }
    if (typeof s.communicationAverage === 'number') {
      totalComm += s.communicationAverage;
      countComm++;
    }
    if (typeof s.structureAverage === 'number') {
      totalStruct += s.structureAverage;
      countStruct++;
    }
  });

  const skillScores = [
    { skill: 'Technical Depth', score: countTech ? Math.round(totalTech / countTech) : averageScore },
    { skill: 'Communication', score: countComm ? Math.round(totalComm / countComm) : averageScore },
    { skill: 'STAR Framework', score: countStruct ? Math.round(totalStruct / countStruct) : averageScore },
    { skill: 'Problem Solving', score: averageScore },
    { skill: 'Accuracy', score: countTech ? Math.round(totalTech / countTech) : averageScore }
  ];

  // Recent activity: order chronological
  const sortedByDate = [...sessions].sort((a, b) => 
    new Date(a.completedAt || a.startedAt).getTime() - new Date(b.completedAt || b.startedAt).getTime()
  );

  const recentActivity = sortedByDate.slice(-7).map((s) => {
    const d = new Date(s.completedAt || s.startedAt);
    const dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      date: dateLabel,
      score: s.overallScore || 0,
      role: s.role.replace('-', ' ')
    };
  });

  return {
    totalInterviews,
    averageScore,
    hoursPracticed,
    readinessScore,
    roleBreakdown,
    skillScores,
    recentActivity
  };
}
