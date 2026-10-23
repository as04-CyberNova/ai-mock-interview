'use client';

import React from 'react';
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

export const Dashboard: React.FC<DashboardProps> = ({ stats, recentSessions, onStartNew }) => {
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
      {/* Top Banner in Monochrome */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-neutral-800">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-bold mb-3.5 border border-neutral-700">
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-white fill-white' : 'text-neutral-500'}`} />
            <span>
              {streak > 0 ? `${streak}-Day Practice Streak` : 'Start Your Practice Streak'}
              {hasSessions ? ' • Active Candidate' : ' • Getting Started'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Performance &amp; <span className="text-neutral-400">Skill Analytics</span>
          </h1>

          <p className="text-sm text-neutral-400 mt-1.5 max-w-xl leading-relaxed">
            Real-time benchmarking across technical accuracy, communication pace, and STAR answer structure.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="relative z-10 px-7 py-4 rounded-2xl btn-electric font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.99] whitespace-nowrap cursor-pointer"
        >
          <Zap className="w-4 h-4 text-black" />
          <span>Launch New Simulation</span>
          <ArrowUpRight className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* KPI Highlight Cards in High-Contrast Black & White */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Readiness */}
        <div className="glass-panel rounded-3xl p-6 border border-neutral-800 hover:border-neutral-500 group transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-white transition-colors">Readiness Index</span>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <Target className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.readinessScore}%</span>
            {hasSessions && stats.readinessScore > 0 && (
              <span className="text-xs text-black bg-white px-2 py-0.5 rounded-full font-bold">
                <TrendingUp className="w-3 h-3 mr-1 inline" /> Active
              </span>
            )}
          </div>
          <div className="h-2 w-full bg-neutral-950 rounded-full mt-4 overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500" 
              style={{ width: `${stats.readinessScore}%` }} 
            />
          </div>
        </div>

        {/* Card 2: Overall Score */}
        <div className="glass-panel rounded-3xl p-6 border border-neutral-800 hover:border-neutral-500 group transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-white transition-colors">Overall Score Avg</span>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.averageScore}</span>
            <span className="text-xs text-neutral-400 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-4 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-neutral-300" /> 
            {hasSessions ? 'Calculated from completed sessions' : 'Complete an interview to see rating'}
          </p>
        </div>

        {/* Card 3: Mock Rounds */}
        <div className="glass-panel rounded-3xl p-6 border border-neutral-800 hover:border-neutral-500 group transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-white transition-colors">Mock Rounds</span>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalInterviews}</span>
            <span className="text-xs text-neutral-400">completed</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-4 truncate">
            {stats.roleBreakdown.length > 0 
              ? stats.roleBreakdown.map((r) => r.role.replace('-', ' ')).join(' • ')
              : 'No rounds recorded yet'}
          </p>
        </div>

        {/* Card 4: Time Practiced */}
        <div className="glass-panel rounded-3xl p-6 border border-neutral-800 hover:border-neutral-500 group transition-all duration-300">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-white transition-colors">Time Practiced</span>
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{timePracticedFormatted}</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-4">Active interview time</p>
        </div>
      </div>

      {/* Analytics Charts Section in Monochrome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Score Progression Trend Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-7 border border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-white" />
                Score Progression Timeline
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Performance trajectory across past simulated interview rounds</p>
            </div>
            {hasSessions && (
              <span className="text-xs text-black font-extrabold px-3 py-1 rounded-full bg-white font-mono">
                {stats.recentActivity.length} RECENT SESSIONS
              </span>
            )}
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                No score trajectory yet. Complete your first mock interview round to plot progression!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recentActivity}>
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#525252" fontSize={11} tickLine={false} />
                  <YAxis stroke="#525252" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      borderColor: '#404040', 
                      borderRadius: '12px', 
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#ffffff" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#scoreGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Competency Skill Radar in Monochrome */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 border border-neutral-800">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              Competency Radar
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Multi-axis skill evaluation</p>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {stats.skillScores.length === 0 || !hasSessions ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                Complete an interview to generate your competency radar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={78} data={stats.skillScores}>
                  <PolarGrid stroke="#262626" />
                  <PolarAngleAxis dataKey="skill" stroke="#a3a3a3" fontSize={10} fontStyle="bold" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#404040" fontSize={9} />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#ffffff" 
                    fill="#ffffff" 
                    fillOpacity={0.25} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Role Performance Breakdown & Recent Sessions List in Monochrome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Track Breakdown Bars */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-neutral-800">
          <h3 className="text-base font-extrabold text-white mb-1">Track Competency Levels</h3>
          <p className="text-xs text-neutral-400 mb-6">Average score distribution per job role specialization</p>

          <div className="space-y-4">
            {stats.roleBreakdown.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">
                No track data yet. Sessions you complete will appear here.
              </div>
            ) : (
              stats.roleBreakdown.map((item) => (
                <div key={item.role} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-200 capitalize">{item.role.replace('-', ' ')}</span>
                    <span className="text-white font-mono">{item.avgScore}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-700" 
                      style={{ width: `${item.avgScore}%` }} 
                    />
                  </div>
                  <div className="text-[10px] text-neutral-500 flex justify-between font-medium">
                    <span>{item.count} session{item.count > 1 ? 's' : ''} completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-neutral-800">
          <h3 className="text-base font-extrabold text-white mb-1">Recent Simulation Logs</h3>
          <p className="text-xs text-neutral-400 mb-5">Latest interview recordings and AI evaluation results</p>

          <div className="divide-y divide-neutral-900">
            {recentSessions.length === 0 ? (
              <div className="py-10 text-center text-neutral-500 text-xs">
                No mock interviews recorded yet. Click &quot;Launch New Simulation&quot; to begin!
              </div>
            ) : (
              recentSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-black text-xs uppercase font-mono shadow-sm">
                      {session.role.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white capitalize flex items-center gap-2">
                        {session.role.replace('-', ' ')} Practice
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 font-mono border border-neutral-700">
                          {session.mode.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {session.level} • {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-white">
                        {session.overallScore || 0}%
                      </span>
                      <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wide">COMPLETED</span>
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
