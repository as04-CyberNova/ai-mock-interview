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

interface DashboardProps {
  stats: UserStats;
  recentSessions: InterviewSession[];
  onStartNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, recentSessions, onStartNew }) => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner / Candidate Performance Overview */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-cyan-500/30 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/15 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 text-cyan-300 text-xs font-bold mb-3.5 border border-cyan-400/40 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>5-Day Practice Streak • Elite Tier</span>
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
          <Zap className="w-4 h-4 text-cyan-300" />
          <span>Launch New Simulation</span>
          <ArrowUpRight className="w-4 h-4 text-cyan-300" />
        </button>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 group hover:border-cyan-400/50 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Readiness Index</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.readinessScore}%</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 mr-1" /> +8.4%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full mt-4 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 rounded-full" 
              style={{ width: `${stats.readinessScore}%` }} 
            />
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 group hover:border-cyan-400/50 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Overall Score Avg</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.averageScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Top 15% across all simulated tracks
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 group hover:border-cyan-400/50 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Mock Rounds</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalInterviews}</span>
            <span className="text-xs text-slate-400">completed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">Data Analyst • SQL • Python • HR</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 group hover:border-cyan-400/50 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Time Practiced</span>
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Clock className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.hoursPracticed}</span>
            <span className="text-xs text-slate-400">hours</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">Speech dictation &amp; STAR sessions</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Score Progression Trend Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                Score Progression Timeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Performance trajectory across past simulated interview rounds</p>
            </div>
            <span className="text-xs text-cyan-300 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-mono">
              RECENT SESSIONS
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.recentActivity}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} domain={[50, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#050a18', 
                    borderColor: '#06b6d4', 
                    borderRadius: '12px', 
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#06b6d4" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#scoreGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Skill Radar */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/20">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-white">Competency Radar</h3>
            <p className="text-xs text-slate-400 mt-0.5">Multi-axis skill evaluation</p>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={78} data={stats.skillScores}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={10} fontStyle="bold" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="#38bdf8" 
                  fill="#0284c7" 
                  fillOpacity={0.45} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Role Performance Breakdown & Recent Sessions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Track Breakdown Bars */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/20">
          <h3 className="text-base font-extrabold text-white mb-1">Track Competency Levels</h3>
          <p className="text-xs text-slate-400 mb-6">Average score distribution per job role specialization</p>

          <div className="space-y-4">
            {stats.roleBreakdown.map((item) => (
              <div key={item.role} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-200 capitalize">{item.role.replace('-', ' ')}</span>
                  <span className="text-cyan-400 font-mono">{item.avgScore}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 rounded-full transition-all duration-700 shadow-sm shadow-cyan-400/30"
                    style={{ width: `${item.avgScore}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between font-medium">
                  <span>{item.count} sessions completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/20">
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
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-black text-xs uppercase font-mono shadow-sm">
                      {session.role.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white capitalize flex items-center gap-2">
                        {session.role.replace('-', ' ')} Practice
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono border border-slate-700">
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
                        {session.overallScore || 80}%
                      </span>
                      <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wide">COMPLETED</span>
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
