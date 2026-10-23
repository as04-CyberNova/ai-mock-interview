'use client';

import React, { useState } from 'react';
import { RoleType, ExperienceLevel, SimulationMode } from '@/types/interview';
import { ROLE_METADATA } from '@/data/questions';
import { 
  BarChart3, 
  Database, 
  Code2, 
  Users, 
  Mic, 
  Keyboard, 
  ChevronRight, 
  CheckCircle2,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Volume2,
  Layers,
  Cpu,
  Network,
  Compass,
  Cloud,
  ShieldAlert,
  Search,
  Zap,
  Target,
  Flame,
  GraduationCap,
  Briefcase,
  Award,
  Crown,
  Building
} from 'lucide-react';

interface InterviewSetupProps {
  selectedRole: RoleType;
  setSelectedRole: (role: RoleType) => void;
  selectedLevel: ExperienceLevel;
  setSelectedLevel: (level: ExperienceLevel) => void;
  selectedMode: SimulationMode;
  setSelectedMode: (mode: SimulationMode) => void;
  onStart: () => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  selectedRole,
  setSelectedRole,
  selectedLevel,
  setSelectedLevel,
  selectedMode,
  setSelectedMode,
  onStart
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const getIcon = (roleKey: RoleType) => {
    switch (roleKey) {
      case 'data-analyst': return <BarChart3 className="w-5 h-5 text-cyan-400" />;
      case 'sql': return <Database className="w-5 h-5 text-sky-400" />;
      case 'python': return <Code2 className="w-5 h-5 text-indigo-400" />;
      case 'hr': return <Users className="w-5 h-5 text-purple-400" />;
      case 'fullstack-dev': return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'ai-ml-engineer': return <Cpu className="w-5 h-5 text-pink-400" />;
      case 'system-design': return <Network className="w-5 h-5 text-amber-400" />;
      case 'product-manager': return <Compass className="w-5 h-5 text-teal-400" />;
      case 'devops-cloud': return <Cloud className="w-5 h-5 text-blue-400" />;
      case 'cybersecurity': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    }
  };

  const experienceLevels: {
    level: ExperienceLevel;
    subtitle: string;
    years: string;
    icon: React.ReactNode;
  }[] = [
    {
      level: 'Intern / Student',
      subtitle: 'Foundations & Coursework',
      years: '0 - 1 yr exp',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />
    },
    {
      level: 'Entry Level',
      subtitle: 'Core Fundamentals',
      years: '1 - 2 yrs exp',
      icon: <Briefcase className="w-4 h-4 text-cyan-400" />
    },
    {
      level: 'Mid Level',
      subtitle: 'Autonomy & Best Practices',
      years: '3 - 5 yrs exp',
      icon: <Award className="w-4 h-4 text-sky-400" />
    },
    {
      level: 'Senior',
      subtitle: 'Architecture & Leadership',
      years: '5 - 8 yrs exp',
      icon: <Crown className="w-4 h-4 text-indigo-400" />
    },
    {
      level: 'Staff / Principal',
      subtitle: 'Cross-Org Strategy & Scale',
      years: '8+ yrs exp',
      icon: <Building className="w-4 h-4 text-purple-400" />
    },
    {
      level: 'Engineering Manager',
      subtitle: 'People & Delivery Mgmt',
      years: 'People Leader',
      icon: <Users className="w-4 h-4 text-amber-400" />
    }
  ];

  const simulationModes: {
    mode: SimulationMode;
    title: string;
    subtitle: string;
    badge?: string;
    badgeColor?: string;
    icon: React.ReactNode;
  }[] = [
    {
      mode: 'voice',
      title: 'Live Voice AI',
      subtitle: 'Speech-to-Text & AI Voice read-aloud',
      badge: 'RECOMMENDED',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      icon: <Mic className="w-5 h-5 text-cyan-400" />
    },
    {
      mode: 'text',
      title: 'Classic Text Mode',
      subtitle: 'Structured keyboard response',
      icon: <Keyboard className="w-5 h-5 text-sky-400" />
    },
    {
      mode: 'rapid-fire',
      title: 'Rapid Fire Blitz',
      subtitle: '60s per answer for sharp instincts',
      badge: 'SPEED',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      icon: <Zap className="w-5 h-5 text-amber-400" />
    },
    {
      mode: 'star-deep-dive',
      title: 'STAR Method Focus',
      subtitle: 'Situation, Task, Action, Result breakdown',
      badge: 'BEHAVIORAL',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      icon: <Target className="w-5 h-5 text-purple-400" />
    },
    {
      mode: 'pressure-test',
      title: 'Executive Pressure Test',
      subtitle: 'Rigorous follow-up questions & counter-inquiries',
      badge: 'HARDCORE',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      icon: <Flame className="w-5 h-5 text-rose-400" />
    }
  ];

  const allRoles = Object.keys(ROLE_METADATA) as RoleType[];

  const filteredRoles = allRoles.filter((rk) => {
    const info = ROLE_METADATA[rk];
    return (
      info.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      info.badge.toLowerCase().includes(filterQuery.toLowerCase()) ||
      info.skills.some((s) => s.toLowerCase().includes(filterQuery.toLowerCase()))
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Badge & Main Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-5 shadow-lg shadow-cyan-500/10 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Next-Gen Multi-Mode Mock Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Master Real-World <br />
          <span className="gradient-text-electric">Technical &amp; AI Interviews</span>
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
          Simulate authentic questions for top tech tracks. Practice with AI voice speech dictation or text, 
          and receive actionable STAR feedback.
        </p>

        {/* Live Metrics Pill */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>10 Tracks • 6 Seniority Tiers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>5 Specialized Simulation Modes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Real-time Speech Recognition &amp; Audio</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1: Specialization Track Picker */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-black border border-cyan-400/30">
                  1
                </span>
                Choose Specialization Track ({allRoles.length} Available)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Select a role to start practicing authentic interview questions.</p>
            </div>

            {/* Quick Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter tracks or skills..."
                className="pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full sm:w-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((roleKey) => {
              const info = ROLE_METADATA[roleKey];
              const isSelected = selectedRole === roleKey;
              return (
                <div
                  key={roleKey}
                  onClick={() => setSelectedRole(roleKey)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative group overflow-hidden ${
                    isSelected
                      ? 'glass-panel-glow border-[#00f7ff]/70 bg-gradient-to-br from-[#00f7ff]/10 via-[#9d00ff]/10 to-slate-900/60 scale-[1.02] shadow-[0_0_25px_rgba(0,247,255,0.25)]'
                      : 'border-slate-800/80 bg-slate-900/30 hover:border-[#00f7ff]/40 hover:bg-slate-900/60 hover:shadow-[0_0_15px_rgba(0,247,255,0.12)]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${
                      isSelected 
                        ? 'bg-[#00f7ff]/20 border-[#00f7ff]/50 shadow-[0_0_10px_rgba(0,247,255,0.3)]' 
                        : 'bg-slate-800/60 border-slate-700/60'
                    }`}>
                      {getIcon(roleKey)}
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00f7ff]/20 text-[#00f7ff] border border-[#00f7ff]/50 text-[9px] font-black shadow-[0_0_10px_rgba(0,247,255,0.3)]">
                        <CheckCircle2 className="w-3 h-3 text-[#00f7ff]" /> SELECTED
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-medium group-hover:text-[#00f7ff] transition-colors">Select &rarr;</span>
                    )}
                  </div>

                  <h3 className="text-white font-extrabold text-sm mb-0.5 group-hover:text-cyan-300 transition-colors">
                    {info.title}
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-semibold mb-2 block">{info.badge}</span>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{info.description}</p>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/60">
                    {info.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Expanded Experience Level Grid (6 Tiers) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-black border border-cyan-400/30">
                2
              </span>
              Experience Level &amp; Seniority ({experienceLevels.length} Tiers)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calibrates question difficulty, algorithmic depth, architectural scope, and scoring rubrics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {experienceLevels.map((item) => {
              const isSelected = selectedLevel === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setSelectedLevel(item.level)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                    isSelected
                      ? 'glass-panel-glow border-cyan-400 bg-gradient-to-b from-cyan-950/60 to-slate-900/80 text-cyan-200 shadow-md shadow-cyan-500/15 scale-[1.02]'
                      : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl border ${
                        isSelected ? 'bg-cyan-500/20 border-cyan-400/30' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {item.icon}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="font-extrabold text-xs text-white leading-tight mb-1">
                      {item.level}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {item.subtitle}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      {item.years}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Expanded Simulation Mode Grid (5 Modes) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-black border border-cyan-400/30">
                3
              </span>
              Simulation Mode ({simulationModes.length} Practice Modes)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your practice format from real-time live voice and speed blitz to deep STAR behavioral drilldowns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {simulationModes.map((item) => {
              const isSelected = selectedMode === item.mode;
              return (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setSelectedMode(item.mode)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
                    isSelected
                      ? 'glass-panel-glow border-cyan-400 bg-gradient-to-br from-cyan-950/60 to-slate-900/80 text-cyan-200 shadow-md shadow-cyan-500/15 scale-[1.01]'
                      : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-3 rounded-xl border shrink-0 mt-0.5 ${
                    isSelected ? 'bg-cyan-500/20 border-cyan-400/40' : 'bg-slate-800/80 border-slate-700'
                  }`}>
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-extrabold text-sm text-white">{item.title}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{item.subtitle}</p>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Interview Launch Button */}
        <div className="pt-4 flex flex-col items-center">
          <button
            onClick={onStart}
            className="group px-10 py-4 rounded-2xl btn-electric text-white font-extrabold text-base flex items-center gap-3 shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
          >
            <BrainCircuit className="w-5 h-5 text-cyan-200" />
            <span>Launch Mock Interview Session</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-cyan-200" />
          </button>
          <span className="text-[11px] text-slate-500 mt-3 font-medium flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Browser audio &amp; mic enabled • Real-time rubric scorecard
          </span>
        </div>
      </div>
    </div>
  );
};
