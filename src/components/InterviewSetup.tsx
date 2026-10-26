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
          icon: <BarChart3 className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
      case 'sql':
        return {
          icon: <Database className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
      case 'python':
        return {
          icon: <Code2 className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-purple',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
      case 'hr':
        return {
          icon: <Users className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-purple',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
      case 'fullstack-dev':
        return {
          icon: <Layers className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-lime',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
      case 'ai-ml-engineer':
        return {
          icon: <Cpu className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-pink',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(214, 196, 168, 0.4)'
        };
      case 'system-design':
        return {
          icon: <Network className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-amber',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(214, 196, 168, 0.4)'
        };
      case 'product-manager':
        return {
          icon: <Compass className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
      case 'devops-cloud':
        return {
          icon: <Cloud className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-cyan',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
      case 'cybersecurity':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-[#2D5A4A]" />,
          accent: 'border-[#2D5A4A] text-[#2D5A4A]',
          badgeClass: 'clay-badge-pink',
          activeBg: 'from-[#FAF8F5] to-[#FFFFFF]',
          glow: 'rgba(45, 90, 74, 0.2)'
        };
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
      subtitle: 'Foundations & Algorithms',
      years: '0 - 1 yr exp',
      icon: <GraduationCap className="w-4 h-4 text-[#2D5A4A]" />
    },
    {
      level: 'Entry Level',
      subtitle: 'Core Fundamentals',
      years: '1 - 2 yrs exp',
      icon: <Briefcase className="w-4 h-4 text-[#2D5A4A]" />
    },
    {
      level: 'Mid Level',
      subtitle: 'Autonomy & Best Practices',
      years: '3 - 5 yrs exp',
      icon: <Award className="w-4 h-4 text-[#2D5A4A]" />
    },
    {
      level: 'Senior',
      subtitle: 'Architecture & Leadership',
      years: '5 - 8 yrs exp',
      icon: <Crown className="w-4 h-4 text-[#2D5A4A]" />
    },
    {
      level: 'Staff / Principal',
      subtitle: 'Cross-Org Strategy & Scale',
      years: '8+ yrs exp',
      icon: <Building className="w-4 h-4 text-[#2D5A4A]" />
    },
    {
      level: 'Engineering Manager',
      subtitle: 'People & Delivery Mgmt',
      years: 'People Leader',
      icon: <Users className="w-4 h-4 text-[#2D5A4A]" />
    }
  ];

  const simulationModes: {
    mode: SimulationMode;
    title: string;
    subtitle: string;
    badge?: string;
    badgeClass: string;
    icon: React.ReactNode;
  }[] = [
    {
      mode: 'voice',
      title: 'Live Voice AI',
      subtitle: 'Speech dictation & natural voice read-aloud',
      badge: 'LIVE VOICE',
      badgeClass: 'clay-badge-cyan',
      icon: <Mic className="w-5 h-5 text-[#2D5A4A]" />
    },
    {
      mode: 'text',
      title: 'Classic Mode',
      subtitle: 'Structured keyboard response format',
      badge: 'PRECISION',
      badgeClass: 'clay-badge-purple',
      icon: <Keyboard className="w-5 h-5 text-[#2D5A4A]" />
    },
    {
      mode: 'rapid-fire',
      title: 'Rapid Fire Blitz',
      subtitle: '60s countdown blitz for reflex calibration',
      badge: 'BLITZ',
      badgeClass: 'clay-badge-pink',
      icon: <Zap className="w-5 h-5 text-[#1A1A1A]" />
    },
    {
      mode: 'star-deep-dive',
      title: 'STAR Method Focus',
      subtitle: 'Situation, Task, Action, Result breakdown',
      badge: 'BEHAVIORAL',
      badgeClass: 'clay-badge-lime',
      icon: <Target className="w-5 h-5 text-[#2D5A4A]" />
    },
    {
      mode: 'pressure-test',
      title: 'Executive Pressure Test',
      subtitle: 'High-intensity counter queries & stress triage',
      badge: 'ADVANCED',
      badgeClass: 'clay-badge-amber',
      icon: <Flame className="w-5 h-5 text-[#1A1A1A]" />
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
      {/* Studio Header */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full clay-panel border border-[#E8E2D9] text-[#2D5A4A] text-xs font-mono font-bold mb-5 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#2D5A4A]" />
          <span className="tracking-widest uppercase">Speech &amp; STAR Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-4 text-[#1A1A1A]">
          Master Real-World <br />
          <span className="text-[#2D5A4A]">
            Technical &amp; AI Interviews
          </span>
        </h1>

        <p className="text-[#6B7280] max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
          Simulate authentic interview tracks in a tailored studio. Practice with speech dictation, 
          instant verbal telemetry, and structured AI rubric grading.
        </p>

        {/* Telemetry Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-6 text-xs text-[#1A1A1A] font-medium">
          <div className="flex items-center gap-2 clay-panel px-4 py-2 rounded-full border border-[#E8E2D9] text-[#2D5A4A]">
            <CheckCircle2 className="w-4 h-4 text-[#2D5A4A]" />
            <span className="font-mono">10 Specialized Tracks • 6 Seniority Tiers</span>
          </div>
          <div className="flex items-center gap-2 clay-panel px-4 py-2 rounded-full border border-[#E8E2D9] text-[#1A1A1A]">
            <TrendingUp className="w-4 h-4 text-[#2D5A4A]" />
            <span className="font-mono">5 Simulation Protocols</span>
          </div>
          <div className="flex items-center gap-2 clay-panel px-4 py-2 rounded-full border border-[#E8E2D9] text-[#2D5A4A]">
            <Volume2 className="w-4 h-4 text-[#2D5A4A]" />
            <span className="font-mono">Speech Synthesis</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-8">
        {/* Step 1: Specialization Track Picker */}
        <div className="clay-panel-glow p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 relative z-10">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl btn-clay-primary text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
                  Choose Specialization Track
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full clay-badge-cyan">
                    {allRoles.length} ACTIVE MODULES
                  </span>
                </h2>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 font-mono">Select a discipline to initialize question generator &amp; rubric telemetry.</p>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter tracks or skills..."
                className="pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl text-xs text-[#1A1A1A] placeholder-[#6B7280] focus:outline-none focus:border-[#2D5A4A] focus:ring-1 focus:ring-[#2D5A4A] w-full sm:w-72 transition-all font-mono"
              />
            </div>
          </div>

          {/* Sub-grid for Roles */}
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
                      ? 'border-[#2D5A4A] bg-[#FFFFFF] shadow-lg scale-[1.02] ring-2 ring-[#2D5A4A]'
                      : 'border-[#E8E2D9] bg-[#FFFFFF] hover:border-[#2D5A4A]/50 hover:-translate-y-1 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3.5">
                    <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                      isSelected 
                        ? 'btn-clay-primary shadow-sm' 
                        : 'clay-panel border-[#E8E2D9]'
                    }`}>
                      <span className={isSelected ? '[&>svg]:text-white' : ''}>
                        {theme.icon}
                      </span>
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full btn-clay-primary text-[10px] font-bold tracking-wide text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" /> ACTIVE
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-[#2D5A4A] group-hover:underline transition-colors">Select &rarr;</span>
                    )}
                  </div>

                  <h3 className="text-[#1A1A1A] font-extrabold text-base mb-1 tracking-tight group-hover:text-[#2D5A4A] transition-colors">
                    {info.title}
                  </h3>
                  <span className="text-[11px] font-mono text-[#2D5A4A] font-semibold mb-2 block">{info.badge}</span>
                  <p className="text-xs text-[#6B7280] font-normal leading-relaxed mb-4 line-clamp-2">{info.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#E8E2D9]">
                    {info.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[10px] font-mono px-2 py-0.5 rounded-lg clay-panel text-[#1A1A1A] border border-[#E8E2D9]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2 (Seniority) & Step 3 (Simulation Mode) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step 2: Experience Level Grid */}
          <div className="lg:col-span-12 clay-panel-glow p-6 sm:p-8 relative overflow-hidden">
            <div className="mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl btn-clay-purple text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
                  Experience Tier &amp; Seniority Calibration
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full clay-badge-purple">
                    {experienceLevels.length} TIERS
                  </span>
                </h2>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 font-mono">
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
                        ? 'border-[#2D5A4A] bg-[#FFFFFF] shadow-md scale-[1.02] ring-2 ring-[#2D5A4A]'
                        : 'border-[#E8E2D9] bg-[#FFFFFF] text-[#1A1A1A] hover:border-[#2D5A4A]/50 hover:-translate-y-1 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl border transition-all ${
                          isSelected ? 'btn-clay-primary shadow-sm text-white' : 'clay-panel border-[#E8E2D9]'
                        }`}>
                          <span className={isSelected ? '[&>svg]:text-white' : ''}>
                            {item.icon}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#2D5A4A]" />
                        )}
                      </div>
                      <div className="font-extrabold text-xs text-[#1A1A1A] leading-tight mb-1 tracking-tight">
                        {item.level}
                      </div>
                      <div className="text-[10px] text-[#6B7280] font-normal leading-tight">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-[#E8E2D9]">
                      <span className="text-[9px] font-mono font-bold text-[#2D5A4A] clay-panel px-2 py-0.5 rounded-full border border-[#E8E2D9]">
                        {item.years}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Simulation Mode Grid */}
          <div className="lg:col-span-12 clay-panel-glow p-6 sm:p-8 relative overflow-hidden">
            <div className="mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl btn-clay-pink text-[#1A1A1A] text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
                  Simulation Protocol
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full clay-badge-pink">
                    {simulationModes.length} MODES
                  </span>
                </h2>
              </div>
              <p className="text-xs text-[#6B7280] mt-1 font-mono">
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
                        ? 'border-[#2D5A4A] bg-[#FFFFFF] shadow-md scale-[1.01] ring-2 ring-[#2D5A4A]'
                        : 'border-[#E8E2D9] bg-[#FFFFFF] text-[#1A1A1A] hover:border-[#2D5A4A]/50 hover:-translate-y-1 shadow-sm'
                    }`}
                  >
                    <div className={`p-3 rounded-2xl border shrink-0 mt-0.5 transition-all ${
                      isSelected ? 'btn-clay-pink shadow-sm text-[#1A1A1A]' : 'clay-panel border-[#E8E2D9]'
                    }`}>
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-extrabold text-sm text-[#1A1A1A] tracking-tight">{item.title}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280] font-normal leading-snug">{item.subtitle}</p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#2D5A4A] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Interview Launch Button */}
        <div className="pt-6 flex flex-col items-center">
          <button
            onClick={onStart}
            disabled={isGenerating}
            className="group px-12 py-5 rounded-2xl btn-clay-primary text-white font-bold text-base flex items-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-white" />
                <span className="font-mono tracking-wide">Synthesizing Questions...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-6 h-6 text-white" />
                <span className="tracking-wide">Launch Mock Interview</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform text-white" />
              </>
            )}
          </button>
          <span className="text-xs text-[#6B7280] mt-4 font-mono flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#2D5A4A]" /> Speech Synthesis &amp; Real-time STAR Scoring Ready
          </span>
        </div>
      </div>
    </div>
  );
};
