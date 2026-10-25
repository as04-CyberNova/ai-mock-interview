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
  BarChart2,
  Activity,
  Cpu
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
      {/* Top Bento Header Card with Cyber Futuristic Claymorphic Treatment */}
      <div className="clay-panel-glow p-6 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full clay-panel border border-pink-500/30 text-pink-300 text-xs font-mono font-bold mb-3.5 shadow-[0_0_12px_rgba(255,0,127,0.3)]">
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-pink-400 fill-pink-400' : 'text-slate-500'}`} />
            <span className="tracking-wide">
              {streak > 0 ? `${streak}-Day Neural Practice Streak` : 'Initialize Daily Streak Protocol'}
              {hasSessions ? ' • Candidate Verified' : ' • Onboarding'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Performance &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 drop-shadow-[0_0_16px_rgba(0,240,255,0.4)]">
              Skill Analytics Matrix
            </span>
          </h1>

          <p className="text-sm text-cyan-200/70 mt-1.5 max-w-xl font-mono leading-relaxed">
            Real-time benchmarking across technical accuracy, neural communication pace, and STAR rubric precision.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="relative z-10 px-8 py-4.5 rounded-2xl btn-clay-cyan font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer shadow-[0_8px_25px_rgba(0,240,255,0.4)]"
        >
          <Zap className="w-4 h-4 text-[#030a1c]" />
          <span>Launch New Simulation</span>
          <ArrowUpRight className="w-4 h-4 text-[#030a1c]" />
        </button>
      </div>

      {/* Bento Grid: 4 Dynamic Cyber Clay KPI Cards with Neon Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Bento KPI 1: Readiness */}
        <div className="clay-card p-6 border border-cyan-500/25 hover:border-cyan-400 transition-all duration-300">
          <div className="flex items-center justify-between text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Readiness Index</span>
            <div className="p-2.5 rounded-xl btn-clay-cyan shadow-sm">
              <Target className="w-4 h-4 text-[#030a1c]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.readinessScore}%</span>
            {hasSessions && stats.readinessScore > 0 && (
              <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full clay-badge-cyan">
                <TrendingUp className="w-3 h-3 mr-1 inline" /> ACTIVE
              </span>
            )}
          </div>
          <div className="h-2.5 w-full bg-[#0a0e22] rounded-full mt-4 overflow-hidden border border-cyan-500/25 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(0,240,255,0.6)]" 
              style={{ width: `${stats.readinessScore}%` }} 
            />
          </div>
        </div>

        {/* Bento KPI 2: Overall Score */}
        <div className="clay-card p-6 border border-pink-500/25 hover:border-pink-400 transition-all duration-300">
          <div className="flex items-center justify-between text-pink-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Overall Score Avg</span>
            <div className="p-2.5 rounded-xl btn-clay-pink shadow-sm">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.averageScore}</span>
            <span className="text-xs text-pink-300/70 font-mono font-light">/ 100</span>
          </div>
          <p className="text-[11px] text-pink-200/70 font-mono mt-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> 
            {hasSessions ? 'Computed across past sessions' : 'Complete a round to calculate score'}
          </p>
        </div>

        {/* Bento KPI 3: Mock Rounds */}
        <div className="clay-card p-6 border border-purple-500/25 hover:border-purple-400 transition-all duration-300">
          <div className="flex items-center justify-between text-purple-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Mock Rounds</span>
            <div className="p-2.5 rounded-xl btn-clay-purple shadow-sm">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalInterviews}</span>
            <span className="text-xs text-purple-300/70 font-mono">completed</span>
          </div>
          <p className="text-[11px] text-purple-200/70 font-mono mt-4 truncate">
            {stats.roleBreakdown.length > 0 
              ? stats.roleBreakdown.map((r) => r.role.replace('-', ' ')).join(' • ')
              : 'No rounds recorded yet'}
          </p>
        </div>

        {/* Bento KPI 4: Time Practiced */}
        <div className="clay-card p-6 border border-emerald-500/25 hover:border-emerald-400 transition-all duration-300">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span>Time Practiced</span>
            <div className="p-2.5 rounded-xl btn-clay-lime shadow-sm">
              <Clock className="w-4 h-4 text-[#031e0b]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{timePracticedFormatted}</span>
          </div>
          <p className="text-[11px] text-emerald-200/70 font-mono mt-4">Active neural arena runtime</p>
        </div>
      </div>

      {/* Bento Grid: Charts Section (Progression 8-cols, Radar 4-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Score Progression Trend Chart */}
        <div className="lg:col-span-8 clay-panel-glow p-6 sm:p-7 border border-cyan-500/25">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 tracking-tight">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                Score Progression Timeline
              </h3>
              <p className="text-xs text-cyan-200/70 font-mono mt-0.5">Performance trajectory across past simulated interview rounds</p>
            </div>
            {hasSessions && (
              <span className="text-xs text-[#030a1c] font-black px-3 py-1 rounded-full btn-clay-cyan font-mono">
                {stats.recentActivity.length} RECENT SESSIONS
              </span>
            )}
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {!mounted ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono animate-pulse">
                Loading cyber telemetry charts...
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-mono font-light">
                No score trajectory yet. Complete your first mock interview round to plot progression!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.recentActivity}>
                  <defs>
                    <linearGradient id="scoreCyberGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.45}/>
                      <stop offset="60%" stopColor="#ff007f" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#9d4edd" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 14, 34, 0.95)', 
                      borderColor: 'rgba(0, 240, 255, 0.4)', 
                      borderRadius: '16px', 
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.9)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#00f0ff" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#scoreCyberGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Competency Skill Radar */}
        <div className="lg:col-span-4 clay-panel-glow p-6 sm:p-7 border border-pink-500/25">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse shadow-[0_0_8px_#ff007f]" />
              Competency Radar
            </h3>
            <p className="text-xs text-pink-200/70 font-mono mt-0.5">Multi-axis neural evaluation</p>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            {!mounted ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono animate-pulse">
                Loading radar...
              </div>
            ) : stats.skillScores.length === 0 || !hasSessions ? (
              <div className="text-center py-12 text-slate-400 text-xs font-mono font-light">
                Complete an interview to generate your competency radar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={78} data={stats.skillScores}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={10} fontStyle="bold" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#ff007f" 
                    fill="#ff007f" 
                    fillOpacity={0.35} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Role Performance Breakdown & Recent Sessions List with Cyber Clay treatment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Track Breakdown Bars */}
        <div className="lg:col-span-5 clay-card p-6 sm:p-7 border border-cyan-500/25">
          <h3 className="text-base font-black text-white mb-1">Track Competency Levels</h3>
          <p className="text-xs text-cyan-200/70 font-mono mb-6">Average score distribution per job role specialization</p>

          <div className="space-y-4">
            {stats.roleBreakdown.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                No track data yet. Sessions you complete will appear here.
              </div>
            ) : (
              stats.roleBreakdown.map((item) => (
                <div key={item.role} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-cyan-200 capitalize">{item.role.replace('-', ' ')}</span>
                    <span className="text-pink-400">{item.avgScore}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#0a0e22] rounded-full overflow-hidden border border-cyan-500/25 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(0,240,255,0.6)]" 
                      style={{ width: `${item.avgScore}%` }} 
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between font-mono font-medium">
                    <span>{item.count} session{item.count > 1 ? 's' : ''} completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Session Logs */}
        <div className="lg:col-span-7 clay-card p-6 sm:p-7 border border-purple-500/25">
          <h3 className="text-base font-black text-white mb-1">Recent Simulation Logs</h3>
          <p className="text-xs text-purple-200/70 font-mono mb-5">Latest interview recordings and AI evaluation results</p>

          <div className="divide-y divide-cyan-500/15">
            {recentSessions.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs font-mono">
                No mock interviews recorded yet. Click &quot;Launch New Simulation&quot; to begin!
              </div>
            ) : (
              recentSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl btn-clay-purple flex items-center justify-center text-white font-black text-xs uppercase font-mono shadow-md">
                      {session.role.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white capitalize flex items-center gap-2">
                        {session.role.replace('-', ' ')}
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full clay-badge-cyan">
                          {session.mode.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {session.level} • {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400">
                        {session.overallScore || 0}%
                      </span>
                      <span className="block text-[10px] text-cyan-300 font-mono font-bold uppercase tracking-wide">COMPLETED</span>
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
