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
  Building,
  Terminal,
  Activity
} from 'lucide-react';

interface InterviewSetupProps {
  selectedRole: RoleType;
  setSelectedRole: (role: RoleType) => void;
  selectedLevel: ExperienceLevel;
  setSelectedLevel: (level: ExperienceLevel) => void;
  selectedMode: SimulationMode;
  setSelectedMode: (mode: SimulationMode) => void;
  onStart: () => void;
  isGenerating?: boolean;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  selectedRole,
  setSelectedRole,
  selectedLevel,
  setSelectedLevel,
  selectedMode,
  setSelectedMode,
  onStart,
  isGenerating = false
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const getRoleTheme = (roleKey: RoleType) => {
    switch (roleKey) {
      case 'data-analyst':
        return {
          icon: <BarChart3 className="w-5 h-5 text-cyan-300" />,
          accent: 'border-cyan-400 text-cyan-300',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-cyan-950/60 to-slate-900',
          glow: 'rgba(0, 240, 255, 0.4)'
        };
      case 'sql':
        return {
          icon: <Database className="w-5 h-5 text-sky-300" />,
          accent: 'border-sky-400 text-sky-300',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-sky-950/60 to-slate-900',
          glow: 'rgba(56, 189, 248, 0.4)'
        };
      case 'python':
        return {
          icon: <Code2 className="w-5 h-5 text-indigo-300" />,
          accent: 'border-indigo-400 text-indigo-300',
          badgeClass: 'clay-badge-purple',
          activeBg: 'from-indigo-950/60 to-slate-900',
          glow: 'rgba(99, 102, 241, 0.4)'
        };
      case 'hr':
        return {
          icon: <Users className="w-5 h-5 text-purple-300" />,
          accent: 'border-purple-400 text-purple-300',
          badgeClass: 'clay-badge-purple',
          activeBg: 'from-purple-950/60 to-slate-900',
          glow: 'rgba(168, 85, 247, 0.4)'
        };
      case 'fullstack-dev':
        return {
          icon: <Layers className="w-5 h-5 text-emerald-300" />,
          accent: 'border-emerald-400 text-emerald-300',
          badgeClass: 'clay-badge-lime',
          activeBg: 'from-emerald-950/60 to-slate-900',
          glow: 'rgba(16, 185, 129, 0.4)'
        };
      case 'ai-ml-engineer':
        return {
          icon: <Cpu className="w-5 h-5 text-pink-300" />,
          accent: 'border-pink-400 text-pink-300',
          badgeClass: 'clay-badge-pink',
          activeBg: 'from-pink-950/60 to-slate-900',
          glow: 'rgba(236, 72, 153, 0.4)'
        };
      case 'system-design':
        return {
          icon: <Network className="w-5 h-5 text-amber-300" />,
          accent: 'border-amber-400 text-amber-300',
          badgeClass: 'clay-badge-amber',
          activeBg: 'from-amber-950/60 to-slate-900',
          glow: 'rgba(245, 158, 11, 0.4)'
        };
      case 'product-manager':
        return {
          icon: <Compass className="w-5 h-5 text-teal-300" />,
          accent: 'border-teal-400 text-teal-300',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-teal-950/60 to-slate-900',
          glow: 'rgba(20, 184, 166, 0.4)'
        };
      case 'devops-cloud':
        return {
          icon: <Cloud className="w-5 h-5 text-blue-300" />,
          accent: 'border-blue-400 text-blue-300',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-blue-950/60 to-slate-900',
          glow: 'rgba(59, 130, 246, 0.4)'
        };
      case 'cybersecurity':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-rose-300" />,
          accent: 'border-rose-400 text-rose-300',
          badgeClass: 'clay-badge-pink',
          activeBg: 'from-rose-950/60 to-slate-900',
          glow: 'rgba(244, 63, 94, 0.4)'
        };
    }
  };

  const experienceLevels: {
    level: ExperienceLevel;
    subtitle: string;
    years: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      level: 'Intern / Student',
      subtitle: 'Foundations & Algorithms',
      years: '0 - 1 yr exp',
      icon: <GraduationCap className="w-4 h-4 text-cyan-300" />,
      color: 'from-cyan-500/20 to-transparent'
    },
    {
      level: 'Entry Level',
      subtitle: 'Core Fundamentals',
      years: '1 - 2 yrs exp',
      icon: <Briefcase className="w-4 h-4 text-emerald-300" />,
      color: 'from-emerald-500/20 to-transparent'
    },
    {
      level: 'Mid Level',
      subtitle: 'Autonomy & Best Practices',
      years: '3 - 5 yrs exp',
      icon: <Award className="w-4 h-4 text-blue-300" />,
      color: 'from-blue-500/20 to-transparent'
    },
    {
      level: 'Senior',
      subtitle: 'Architecture & Leadership',
      years: '5 - 8 yrs exp',
      icon: <Crown className="w-4 h-4 text-purple-300" />,
      color: 'from-purple-500/20 to-transparent'
    },
    {
      level: 'Staff / Principal',
      subtitle: 'Cross-Org Strategy & Scale',
      years: '8+ yrs exp',
      icon: <Building className="w-4 h-4 text-pink-300" />,
      color: 'from-pink-500/20 to-transparent'
    },
    {
      level: 'Engineering Manager',
      subtitle: 'People & Delivery Mgmt',
      years: 'People Leader',
      icon: <Users className="w-4 h-4 text-amber-300" />,
      color: 'from-amber-500/20 to-transparent'
    }
  ];

  const simulationModes: {
    mode: SimulationMode;
    title: string;
    subtitle: string;
    badge?: string;
    badgeClass: string;
    icon: React.ReactNode;
    glow: string;
  }[] = [
    {
      mode: 'voice',
      title: 'Live Voice AI',
      subtitle: 'Speech dictation & neural voice read-aloud',
      badge: 'CYBER LIVE',
      badgeClass: 'clay-badge-cyan',
      icon: <Mic className="w-5 h-5 text-cyan-300" />,
      glow: 'rgba(0, 240, 255, 0.4)'
    },
    {
      mode: 'text',
      title: 'Classic Terminal Mode',
      subtitle: 'Structured keyboard response matrix',
      badge: 'PRECISION',
      badgeClass: 'clay-badge-purple',
      icon: <Keyboard className="w-5 h-5 text-purple-300" />,
      glow: 'rgba(157, 78, 221, 0.4)'
    },
    {
      mode: 'rapid-fire',
      title: 'Rapid Fire Blitz',
      subtitle: '60s countdown blitz for reflex calibration',
      badge: 'BLITZ SPEED',
      badgeClass: 'clay-badge-pink',
      icon: <Zap className="w-5 h-5 text-pink-300" />,
      glow: 'rgba(255, 0, 127, 0.4)'
    },
    {
      mode: 'star-deep-dive',
      title: 'STAR Method Focus',
      subtitle: 'Situation, Task, Action, Result breakdown',
      badge: 'BEHAVIORAL',
      badgeClass: 'clay-badge-lime',
      icon: <Target className="w-5 h-5 text-emerald-300" />,
      glow: 'rgba(0, 255, 102, 0.4)'
    },
    {
      mode: 'pressure-test',
      title: 'Executive Pressure Test',
      subtitle: 'High-intensity counter queries & stress triage',
      badge: 'HARDCORE',
      badgeClass: 'clay-badge-amber',
      icon: <Flame className="w-5 h-5 text-amber-300" />,
      glow: 'rgba(255, 170, 0, 0.4)'
    }
  ];

  const allRoles = Object.keys(ROLE_METADATA) as RoleType[];

  const filteredRoles = allRoles.filter((key) => {
    const meta = ROLE_METADATA[key];
    const q = filterQuery.toLowerCase();
    return (
      meta.title.toLowerCase().includes(q) ||
      meta.badge.toLowerCase().includes(q) ||
      meta.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Studio Header in Cyber Futuristic Colorful Style */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full clay-panel border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold mb-5 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span className="tracking-widest uppercase">Autonomous Neural Voice &amp; STAR Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-4">
          Master Real-World <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            Technical &amp; AI Interviews
          </span>
        </h1>

        <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
          Simulate authentic interview tracks in a tactical cyber arena. Practice with neural voice dictation, 
          instant speech telemetry, and AI rubric grading.
        </p>

        {/* Live Cyber Telemetry Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-6 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2 clay-panel px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-200">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">10 Cyber Tracks • 6 Seniority Tiers</span>
          </div>
          <div className="flex items-center gap-2 clay-panel px-4 py-2 rounded-full border border-pink-500/30 text-pink-200">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <span className="font-mono">5 Simulation Protocols</span>
          </div>
          <div className="flex items-center gap-2 clay-panel px-4 py-2 rounded-full border border-purple-500/30 text-purple-200">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span className="font-mono">Neural Speech Synthesis</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-8">
        {/* Step 1: Specialization Track Picker (Cyber Clay Card 1) */}
        <div className="clay-panel-glow p-6 sm:p-8 border border-cyan-500/25 relative overflow-hidden">
          {/* Subtle Cyber Glowing Background Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 relative z-10">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl btn-clay-cyan text-[#030a1c] text-xs flex items-center justify-center font-black">
                  1
                </span>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Choose Specialization Track
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full clay-badge-cyan">
                    {allRoles.length} ACTIVE MODULES
                  </span>
                </h2>
              </div>
              <p className="text-xs text-cyan-200/70 mt-1 font-mono">Select a discipline to initialize question generator &amp; rubric telemetry.</p>
            </div>

            {/* Search Filter with Claymorphic Cyber Styling */}
            <div className="relative">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter cyber tracks or skills..."
                className="pl-10 pr-4 py-2.5 bg-[#0a0e22]/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl text-xs text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 w-full sm:w-72 transition-all font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          {/* Bento Sub-grid for Roles with Cyber Claymorphic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
            {filteredRoles.map((roleKey) => {
              const info = ROLE_METADATA[roleKey];
              const isSelected = selectedRole === roleKey;
              const theme = getRoleTheme(roleKey);
              return (
                <div
                  key={roleKey}
                  onClick={() => setSelectedRole(roleKey)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative group overflow-hidden ${
                    isSelected
                      ? `bg-gradient-to-br ${theme.activeBg} border-cyan-300 shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_25px_${theme.glow}] scale-[1.02] ring-1 ring-cyan-400/50`
                      : 'border-white/10 bg-[#0d1229]/80 hover:border-cyan-400/40 hover:bg-[#121938] hover:-translate-y-1 shadow-[10px_14px_28px_rgba(0,0,0,0.5),inset_2px_2px_4px_rgba(255,255,255,0.08)]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3.5">
                    <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                      isSelected 
                        ? 'btn-clay-cyan shadow-lg' 
                        : 'clay-panel border-white/10 group-hover:border-cyan-400/40'
                    }`}>
                      <span className={isSelected ? '[&>svg]:text-[#030a1c]' : ''}>
                        {theme.icon}
                      </span>
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full btn-clay-cyan text-[10px] font-black tracking-wide">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#030a1c]" /> ACTIVE
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-cyan-400/70 group-hover:text-cyan-300 transition-colors">Select &rarr;</span>
                    )}
                  </div>

                  <h3 className="text-white font-extrabold text-base mb-1 tracking-tight group-hover:text-cyan-200 transition-colors">
                    {info.title}
                  </h3>
                  <span className="text-[11px] font-mono text-pink-400 font-semibold mb-2 block">{info.badge}</span>
                  <p className="text-xs text-slate-300 font-light leading-relaxed mb-4 line-clamp-2">{info.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-cyan-500/15">
                    {info.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[10px] font-mono px-2 py-0.5 rounded-lg clay-panel text-cyan-200/90 border border-cyan-500/20">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bento Row: Step 2 (Seniority) & Step 3 (Simulation Mode) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step 2: Experience Level Grid (Cyber Clay Card 2) */}
          <div className="lg:col-span-12 clay-panel-glow p-6 sm:p-8 border border-purple-500/25 relative overflow-hidden">
            <div className="mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl btn-clay-purple text-white text-xs flex items-center justify-center font-black">
                  2
                </span>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Experience Tier &amp; Seniority Calibration
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full clay-badge-purple">
                    {experienceLevels.length} TIERS
                  </span>
                </h2>
              </div>
              <p className="text-xs text-purple-200/70 mt-1 font-mono">
                Calibrates algorithmic complexity, system architecture scope, and rubric severity.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {experienceLevels.map((item) => {
                const isSelected = selectedLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setSelectedLevel(item.level)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-purple-400 bg-gradient-to-b from-purple-950/70 to-[#0e1224] text-white shadow-[0_12px_28px_rgba(0,0,0,0.8),0_0_20px_rgba(157,78,221,0.35)] scale-[1.02]'
                        : 'border-white/10 bg-[#0d1229]/80 text-slate-300 hover:border-purple-400/40 hover:bg-[#141b38] hover:-translate-y-1 shadow-[8px_12px_24px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl border transition-all ${
                          isSelected ? 'btn-clay-purple shadow-md text-white' : 'clay-panel border-white/10'
                        }`}>
                          {item.icon}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div className="font-extrabold text-xs text-white leading-tight mb-1 tracking-tight">
                        {item.level}
                      </div>
                      <div className="text-[10px] text-purple-200/70 font-light leading-tight">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-purple-500/15">
                      <span className="text-[9px] font-mono font-bold text-cyan-300 clay-panel px-2 py-0.5 rounded-full border border-cyan-500/30">
                        {item.years}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Simulation Mode Grid (Cyber Clay Card 3) */}
          <div className="lg:col-span-12 clay-panel-glow p-6 sm:p-8 border border-pink-500/25 relative overflow-hidden">
            <div className="mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl btn-clay-pink text-white text-xs flex items-center justify-center font-black">
                  3
                </span>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Simulation Protocol
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full clay-badge-pink">
                    {simulationModes.length} MODES
                  </span>
                </h2>
              </div>
              <p className="text-xs text-pink-200/70 mt-1 font-mono">
                Select your practice protocol from live speech dictation to 60-second rapid-fire sprints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {simulationModes.map((item) => {
                const isSelected = selectedMode === item.mode;
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setSelectedMode(item.mode)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-pink-400 bg-gradient-to-b from-pink-950/70 to-[#0e1224] text-white shadow-[0_12px_28px_rgba(0,0,0,0.8),0_0_22px_rgba(255,0,127,0.35)] scale-[1.01]'
                        : 'border-white/10 bg-[#0d1229]/80 text-slate-300 hover:border-pink-400/40 hover:bg-[#141b38] hover:-translate-y-1 shadow-[8px_12px_24px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl border shrink-0 mt-0.5 transition-all ${
                      isSelected ? 'btn-clay-pink shadow-md text-white' : 'clay-panel border-white/10'
                    }`}>
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-extrabold text-sm text-white tracking-tight">{item.title}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-light leading-snug">{item.subtitle}</p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Interview Launch Button with Cyber Claymorphic Tactile Styling */}
        <div className="pt-6 flex flex-col items-center">
          <button
            onClick={onStart}
            disabled={isGenerating}
            className="group px-12 py-5 rounded-2xl btn-clay-cyan text-[#030a1c] font-black text-base flex items-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_12px_32px_rgba(0,240,255,0.4)]"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-[#030a1c]" />
                <span className="font-mono tracking-wide">Synthesizing Neural Questions...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-6 h-6 text-[#030a1c]" />
                <span className="tracking-wide">Launch Cyber Mock Interview</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform text-[#030a1c]" />
              </>
            )}
          </button>
          <span className="text-xs text-cyan-300/80 mt-4 font-mono flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" /> Neural Audio Synthesis &amp; Real-time STAR Scoring Ready
          </span>
        </div>
      </div>
    </div>
  );
};
