'use client';

import React, { useSyncExternalStore } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar
} from 'recharts';
import { InterviewSession, UserStats } from '@/types/interview';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  Zap,
  ArrowUpRight,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface DashboardProps {
  stats: UserStats;
  recentSessions: InterviewSession[];
  onStartNew: () => void;
}

const subscribe = () => () => {};
export const Dashboard: React.FC<DashboardProps> = ({ stats, recentSessions, onStartNew }) => {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { user } = useAuth();
  const streak = user?.streakDays || (recentSessions.length > 0 ? 1 : 0);
  const hasSessions = recentSessions.length > 0;

  // Format practicing hours
  const timePracticedFormatted = stats.hoursPracticed >= 1 
    ? `${stats.hoursPracticed}h` 
    : stats.hoursPracticed > 0 
      ? `${Math.round(stats.hoursPracticed * 60)}m` 
      : '0m';

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header Card */}
      <div className="clay-panel-glow p-6 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#D6C4A8]/20 via-[#2D5A4A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full clay-panel border border-[#E8E2D9] text-[#2D5A4A] text-xs font-mono font-bold mb-3.5 shadow-sm">
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-[#2D5A4A] fill-[#2D5A4A]' : 'text-[#6B7280]'}`} />
            <span className="tracking-wide">
              {streak > 0 ? `${streak}-Day Practice Streak` : 'Initialize Daily Streak Protocol'}
              {hasSessions ? ' • Candidate Verified' : ' • Onboarding'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A]">
            Performance &amp;{' '}
            <span className="text-[#2D5A4A]">
              Skill Analytics Matrix
            </span>
          </h1>

          <p className="text-sm text-[#6B7280] mt-1.5 max-w-xl font-mono leading-relaxed">
            Real-time benchmarking across technical accuracy, communication pace, and STAR rubric precision.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="relative z-10 px-8 py-4.5 rounded-2xl btn-clay-primary font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer shadow-md"
        >
          <Zap className="w-4 h-4 text-white" />
          <span>Launch New Simulation</span>
          <ArrowUpRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Grid: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Readiness */}
        <div className="clay-card p-6 transition-all duration-300">
          <div className="flex items-center justify-between text-[#2D5A4A] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Readiness Index</span>
            <div className="p-2.5 rounded-xl btn-clay-primary shadow-sm">
              <Target className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1A1A1A]">{stats.readinessScore}%</span>
            {hasSessions && stats.readinessScore > 0 && (
              <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full clay-badge-cyan">
                <TrendingUp className="w-3 h-3 mr-1 inline" /> ACTIVE
              </span>
            )}
          </div>
          <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full mt-4 overflow-hidden border border-[#E8E2D9]">
            <div 
              className="h-full bg-gradient-to-r from-[#2D5A4A] to-[#3d7863] rounded-full transition-all duration-700" 
              style={{ width: `${stats.readinessScore}%` }} 
            />
          </div>
        </div>

        {/* KPI 2: Overall Score */}
        <div className="clay-card p-6 transition-all duration-300">
          <div className="flex items-center justify-between text-[#1A1A1A] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Overall Score Avg</span>
            <div className="p-2.5 rounded-xl btn-clay-pink shadow-sm">
              <Trophy className="w-4 h-4 text-[#1A1A1A]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1A1A1A]">{stats.averageScore}</span>
            <span className="text-xs text-[#6B7280] font-mono font-light">/ 100</span>
          </div>
          <p className="text-[11px] text-[#6B7280] font-mono mt-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2D5A4A]" /> 
            {hasSessions ? 'Computed across past sessions' : 'Complete a round to calculate score'}
          </p>
        </div>

        {/* KPI 3: Mock Rounds */}
        <div className="clay-card p-6 transition-all duration-300">
          <div className="flex items-center justify-between text-[#2D5A4A] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Mock Rounds</span>
            <div className="p-2.5 rounded-xl btn-clay-purple shadow-sm">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1A1A1A]">{stats.totalInterviews}</span>
            <span className="text-xs text-[#6B7280] font-mono">completed</span>
          </div>
          <p className="text-[11px] text-[#6B7280] font-mono mt-4 truncate">
            {stats.roleBreakdown.length > 0 
              ? stats.roleBreakdown.map((r) => r.role.replace('-', ' ')).join(' • ')
              : 'No rounds recorded yet'}
          </p>
        </div>

        {/* KPI 4: Time Practiced */}
        <div className="clay-card p-6 transition-all duration-300">
          <div className="flex items-center justify-between text-[#2D5A4A] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Time Practiced</span>
            <div className="p-2.5 rounded-xl btn-clay-lime shadow-sm">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1A1A1A]">{timePracticedFormatted}</span>
          </div>
          <p className="text-[11px] text-[#6B7280] font-mono mt-4">Active interview runtime</p>
        </div>
      </div>

      {/* Grid: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Score Progression Trend Chart */}
        <div className="lg:col-span-8 clay-panel-glow p-6 sm:p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-[#1A1A1A] flex items-center gap-2 tracking-tight">
                <BarChart2 className="w-4 h-4 text-[#2D5A4A]" />
                Score Progression Timeline
              </h3>
              <p className="text-xs text-[#6B7280] font-mono mt-0.5">Performance trajectory across past simulated interview rounds</p>
            </div>
            {hasSessions && (
              <span className="text-xs text-white font-bold px-3 py-1 rounded-full btn-clay-primary font-mono">
                {stats.recentActivity.length} RECENT SESSIONS
              </span>
            )}
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {!mounted ? (
              <div className="text-center py-12 text-[#6B7280] text-xs font-mono animate-pulse">
                Loading telemetry charts...
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <div className="text-center py-12 text-[#6B7280] text-xs font-mono font-light">
                No score trajectory yet. Complete your first mock interview round to plot progression!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recentActivity}>
                  <defs>
                    <linearGradient id="scoreWarmGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A4A" stopOpacity={0.35}/>
                      <stop offset="60%" stopColor="#D6C4A8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#D6C4A8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#E8E2D9', 
                      borderRadius: '16px', 
                      color: '#1A1A1A',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      boxShadow: '0 10px 25px rgba(45, 90, 74, 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2D5A4A" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#scoreWarmGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Competency Skill Radar */}
        <div className="lg:col-span-4 clay-panel-glow p-6 sm:p-7">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-[#1A1A1A] flex items-center gap-2 tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A4A]" />
              Competency Radar
            </h3>
            <p className="text-xs text-[#6B7280] font-mono mt-0.5">Multi-axis competency evaluation</p>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {!mounted ? (
              <div className="text-center py-12 text-[#6B7280] text-xs font-mono animate-pulse">
                Loading radar...
              </div>
            ) : stats.skillScores.length === 0 || !hasSessions ? (
              <div className="text-center py-12 text-[#6B7280] text-xs font-mono font-light">
                Complete an interview to generate your competency radar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={78} data={stats.skillScores}>
                  <PolarGrid stroke="#E8E2D9" />
                  <PolarAngleAxis dataKey="skill" stroke="#6B7280" fontSize={10} fontStyle="bold" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#D6C4A8" fontSize={9} />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#2D5A4A" 
                    fill="#2D5A4A" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Role Performance Breakdown & Recent Sessions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Track Breakdown Bars */}
        <div className="lg:col-span-5 clay-card p-6 sm:p-7">
          <h3 className="text-base font-black text-[#1A1A1A] mb-1">Track Competency Levels</h3>
          <p className="text-xs text-[#6B7280] font-mono mb-6">Average score distribution per job role specialization</p>

          <div className="space-y-4">
            {stats.roleBreakdown.length === 0 ? (
              <div className="py-8 text-center text-[#6B7280] text-xs font-mono">
                No track data yet. Sessions you complete will appear here.
              </div>
            ) : (
              stats.roleBreakdown.map((item) => (
                <div key={item.role} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-[#1A1A1A] capitalize">{item.role.replace('-', ' ')}</span>
                    <span className="text-[#2D5A4A]">{item.avgScore}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8E2D9]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2D5A4A] via-[#3d7863] to-[#D6C4A8] rounded-full transition-all duration-700" 
                      style={{ width: `${item.avgScore}%` }} 
                    />
                  </div>
                  <div className="text-[10px] text-[#6B7280] flex justify-between font-mono font-medium">
                    <span>{item.count} session{item.count > 1 ? 's' : ''} completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="lg:col-span-7 clay-card p-6 sm:p-7">
          <h3 className="text-base font-black text-[#1A1A1A] mb-1">Recent Simulation Logs</h3>
          <p className="text-xs text-[#6B7280] font-mono mb-5">Latest interview recordings and AI evaluation results</p>

          <div className="divide-y divide-[#E8E2D9]">
            {recentSessions.length === 0 ? (
              <div className="py-10 text-center text-[#6B7280] text-xs font-mono">
                No mock interviews recorded yet. Click &quot;Launch New Simulation&quot; to begin!
              </div>
            ) : (
              recentSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl btn-clay-primary flex items-center justify-center text-white font-bold text-xs uppercase font-mono shadow-sm">
                      {session.role.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1A1A1A] capitalize flex items-center gap-2">
                        {session.role.replace('-', ' ')}
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full clay-badge-cyan">
                          {session.mode.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                        {session.level} • {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-[#2D5A4A]">
                        {session.overallScore || 0}%
                      </span>
                      <span className="block text-[10px] text-[#6B7280] font-mono font-bold uppercase tracking-wide">COMPLETED</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
