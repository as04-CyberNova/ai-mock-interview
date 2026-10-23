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
      {/* Top Banner / Candidate Performance Overview */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Neon Glow accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00f7ff]/20 via-[#9d00ff]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#10ff9e]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#051126]/90 text-[#00f7ff] text-xs font-bold mb-3.5 border border-[#00f7ff]/40 shadow-[0_0_15px_rgba(0,247,255,0.25)]">
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-[#ffaa00] fill-[#ffaa00] filter drop-shadow-[0_0_8px_#ffaa00]' : 'text-slate-500'}`} />
            <span>
              {streak > 0 ? `${streak}-Day Practice Streak` : 'Start Your Practice Streak'}
              {hasSessions ? ' • Active Candidate' : ' • Getting Started'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Performance &amp; <span className="gradient-text-electric">Skill Analytics</span>
          </h1>

          <p className="text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
            Real-time benchmarking across technical accuracy, communication pace, and STAR answer structure.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="relative z-10 px-7 py-4 rounded-2xl btn-electric text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.99] whitespace-nowrap cursor-pointer"
        >
          <Zap className="w-4 h-4 text-[#00f7ff] filter drop-shadow-[0_0_6px_#00f7ff]" />
          <span>Launch New Simulation</span>
          <ArrowUpRight className="w-4 h-4 text-[#00f7ff]" />
        </button>
      </div>

      {/* KPI Highlight Cards with Neon Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Readiness (Neon Cyan) */}
        <div className="glass-panel rounded-3xl p-6 border border-[#00f7ff]/20 hover:border-[#00f7ff]/60 group transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,247,255,0.2)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-[#00f7ff] transition-colors">Readiness Index</span>
            <div className="p-2 rounded-xl bg-[#00f7ff]/10 border border-[#00f7ff]/30 shadow-[0_0_10px_rgba(0,247,255,0.2)]">
              <Target className="w-4 h-4 text-[#00f7ff]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.readinessScore}%</span>
            {hasSessions && stats.readinessScore > 0 && (
              <span className="text-xs text-[#10ff9e] font-bold flex items-center bg-[#10ff9e]/10 px-2 py-0.5 rounded-full border border-[#10ff9e]/30 shadow-[0_0_8px_rgba(16,255,158,0.2)]">
                <TrendingUp className="w-3 h-3 mr-1" /> Active
              </span>
            )}
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full mt-4 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-[#00f7ff] via-[#10ff9e] to-[#9d00ff] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,247,255,0.6)]" 
              style={{ width: `${stats.readinessScore}%` }} 
            />
          </div>
        </div>

        {/* Card 2: Overall Score (Neon Amber) */}
        <div className="glass-panel rounded-3xl p-6 border border-[#ffaa00]/20 hover:border-[#ffaa00]/60 group transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,170,0,0.2)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-[#ffaa00] transition-colors">Overall Score Avg</span>
            <div className="p-2 rounded-xl bg-[#ffaa00]/10 border border-[#ffaa00]/30 shadow-[0_0_10px_rgba(255,170,0,0.2)]">
              <Trophy className="w-4 h-4 text-[#ffaa00]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.averageScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#ffaa00]" /> 
            {hasSessions ? 'Calculated from completed sessions' : 'Complete an interview to see rating'}
          </p>
        </div>

        {/* Card 3: Mock Rounds (Neon Magenta) */}
        <div className="glass-panel rounded-3xl p-6 border border-[#ff007f]/20 hover:border-[#ff007f]/60 group transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,127,0.2)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-[#ff007f] transition-colors">Mock Rounds</span>
            <div className="p-2 rounded-xl bg-[#ff007f]/10 border border-[#ff007f]/30 shadow-[0_0_10px_rgba(255,0,127,0.2)]">
              <Award className="w-4 h-4 text-[#ff007f]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalInterviews}</span>
            <span className="text-xs text-slate-400">completed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 truncate">
            {stats.roleBreakdown.length > 0 
              ? stats.roleBreakdown.map((r) => r.role.replace('-', ' ')).join(' • ')
              : 'No rounds recorded yet'}
          </p>
        </div>

        {/* Card 4: Time Practiced (Neon Lime) */}
        <div className="glass-panel rounded-3xl p-6 border border-[#10ff9e]/20 hover:border-[#10ff9e]/60 group transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,255,158,0.2)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="group-hover:text-[#10ff9e] transition-colors">Time Practiced</span>
            <div className="p-2 rounded-xl bg-[#10ff9e]/10 border border-[#10ff9e]/30 shadow-[0_0_10px_rgba(16,255,158,0.2)]">
              <Clock className="w-4 h-4 text-[#10ff9e]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{timePracticedFormatted}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">Active interview time</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Score Progression Trend Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-7 border border-[#00f7ff]/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#00f7ff]" />
                Score Progression Timeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Performance trajectory across past simulated interview rounds</p>
            </div>
            {hasSessions && (
              <span className="text-xs text-[#00f7ff] font-bold px-3 py-1 rounded-full bg-[#00f7ff]/10 border border-[#00f7ff]/30 font-mono shadow-[0_0_10px_rgba(0,247,255,0.2)]">
                {stats.recentActivity.length} RECENT SESSIONS
              </span>
            )}
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No score trajectory yet. Complete your first mock interview round to plot progression!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recentActivity}>
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f7ff" stopOpacity={0.55}/>
                      <stop offset="95%" stopColor="#9d00ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#050c1f', 
                      borderColor: '#00f7ff', 
                      borderRadius: '12px', 
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 0 20px rgba(0, 247, 255, 0.4)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#00f7ff" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#scoreGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Competency Skill Radar */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 border border-[#9d00ff]/25">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9d00ff] shadow-[0_0_8px_#9d00ff]" />
              Competency Radar
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Multi-axis skill evaluation</p>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {stats.skillScores.length === 0 || !hasSessions ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Complete an interview to generate your competency radar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={78} data={stats.skillScores}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={10} fontStyle="bold" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#00f7ff" 
                    fill="#9d00ff" 
                    fillOpacity={0.5} 
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
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-[#00f7ff]/20">
          <h3 className="text-base font-extrabold text-white mb-1">Track Competency Levels</h3>
          <p className="text-xs text-slate-400 mb-6">Average score distribution per job role specialization</p>

          <div className="space-y-4">
            {stats.roleBreakdown.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No track data yet. Sessions you complete will appear here.
              </div>
            ) : (
              stats.roleBreakdown.map((item) => (
                <div key={item.role} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-200 capitalize">{item.role.replace('-', ' ')}</span>
                    <span className="text-[#00f7ff] font-mono">{item.avgScore}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00f7ff] via-[#10ff9e] to-[#9d00ff] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(0,247,255,0.45)]"
                      style={{ width: `${item.avgScore}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between font-medium">
                    <span>{item.count} session{item.count > 1 ? 's' : ''} completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-[#00f7ff]/20">
          <h3 className="text-base font-extrabold text-white mb-1">Recent Simulation Logs</h3>
          <p className="text-xs text-slate-400 mb-5">Latest interview recordings and AI evaluation results</p>

          <div className="divide-y divide-slate-800/80">
            {recentSessions.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No mock interviews recorded yet. Click &quot;Launch New Simulation&quot; to begin!
              </div>
            ) : (
              recentSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00f7ff]/20 to-[#9d00ff]/20 border border-[#00f7ff]/40 flex items-center justify-center text-[#00f7ff] font-black text-xs uppercase font-mono shadow-[0_0_10px_rgba(0,247,255,0.2)]">
                      {session.role.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white capitalize flex items-center gap-2">
                        {session.role.replace('-', ' ')} Practice
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-[#00f7ff] font-mono border border-cyan-500/30">
                          {session.mode.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {session.level} • {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-white">
                        {session.overallScore || 0}%
                      </span>
                      <span className="block text-[10px] text-[#10ff9e] font-bold uppercase tracking-wide">COMPLETED</span>
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
