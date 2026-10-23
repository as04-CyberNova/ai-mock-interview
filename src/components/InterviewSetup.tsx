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
      case 'data-analyst': return <BarChart3 className="w-5 h-5 text-white" />;
      case 'sql': return <Database className="w-5 h-5 text-white" />;
      case 'python': return <Code2 className="w-5 h-5 text-white" />;
      case 'hr': return <Users className="w-5 h-5 text-white" />;
      case 'fullstack-dev': return <Layers className="w-5 h-5 text-white" />;
      case 'ai-ml-engineer': return <Cpu className="w-5 h-5 text-white" />;
      case 'system-design': return <Network className="w-5 h-5 text-white" />;
      case 'product-manager': return <Compass className="w-5 h-5 text-white" />;
      case 'devops-cloud': return <Cloud className="w-5 h-5 text-white" />;
      case 'cybersecurity': return <ShieldAlert className="w-5 h-5 text-white" />;
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
      icon: <GraduationCap className="w-4 h-4 text-white" />
    },
    {
      level: 'Entry Level',
      subtitle: 'Core Fundamentals',
      years: '1 - 2 yrs exp',
      icon: <Briefcase className="w-4 h-4 text-white" />
    },
    {
      level: 'Mid Level',
      subtitle: 'Autonomy & Best Practices',
      years: '3 - 5 yrs exp',
      icon: <Award className="w-4 h-4 text-white" />
    },
    {
      level: 'Senior',
      subtitle: 'Architecture & Leadership',
      years: '5 - 8 yrs exp',
      icon: <Crown className="w-4 h-4 text-white" />
    },
    {
      level: 'Staff / Principal',
      subtitle: 'Cross-Org Strategy & Scale',
      years: '8+ yrs exp',
      icon: <Building className="w-4 h-4 text-white" />
    },
    {
      level: 'Engineering Manager',
      subtitle: 'People & Delivery Mgmt',
      years: 'People Leader',
      icon: <Users className="w-4 h-4 text-white" />
    }
  ];

  const simulationModes: {
    mode: SimulationMode;
    title: string;
    subtitle: string;
    badge?: string;
    icon: React.ReactNode;
  }[] = [
    {
      mode: 'voice',
      title: 'Live Voice AI',
      subtitle: 'Speech-to-Text & AI Voice read-aloud',
      badge: 'RECOMMENDED',
      icon: <Mic className="w-5 h-5 text-white" />
    },
    {
      mode: 'text',
      title: 'Classic Text Mode',
      subtitle: 'Structured keyboard response',
      icon: <Keyboard className="w-5 h-5 text-white" />
    },
    {
      mode: 'rapid-fire',
      title: 'Rapid Fire Blitz',
      subtitle: '60s per answer for sharp instincts',
      badge: 'SPEED',
      icon: <Zap className="w-5 h-5 text-white" />
    },
    {
      mode: 'star-deep-dive',
      title: 'STAR Method Focus',
      subtitle: 'Situation, Task, Action, Result breakdown',
      badge: 'BEHAVIORAL',
      icon: <Target className="w-5 h-5 text-white" />
    },
    {
      mode: 'pressure-test',
      title: 'Executive Pressure Test',
      subtitle: 'Rigorous follow-up questions & counter-inquiries',
      badge: 'HARDCORE',
      icon: <Flame className="w-5 h-5 text-white" />
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
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Studio Header in Monochrome */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-semibold mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Next-Gen Multi-Mode Mock Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Master Real-World <br />
          <span className="text-neutral-400">Technical &amp; AI Interviews</span>
        </h1>

        <p className="text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
          Simulate authentic questions for top tech tracks. Practice with AI voice speech dictation or text, 
          and receive actionable STAR feedback.
        </p>

        {/* Live Metrics Pill in Monochrome */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-neutral-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>10 Tracks • 6 Seniority Tiers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-white" />
            <span>5 Specialized Simulation Modes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-white" />
            <span>Real-time Speech Recognition &amp; Audio</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1: Specialization Track Picker in Monochrome */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-white text-black text-xs flex items-center justify-center font-black">
                  1
                </span>
                Choose Specialization Track ({allRoles.length} Available)
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Select a role to start practicing authentic interview questions.</p>
            </div>

            {/* Quick Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter tracks or skills..."
                className="pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white w-full sm:w-60"
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
                      ? 'bg-neutral-900 border-white text-white scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-600 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl border ${
                      isSelected 
                        ? 'bg-white text-black border-white' 
                        : 'bg-neutral-900 border-neutral-800'
                    }`}>
                      {getIcon(roleKey)}
                    </div>
                    {isSelected ? (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-black">
                        <CheckCircle2 className="w-3 h-3 text-black" /> SELECTED
                      </div>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-medium group-hover:text-white transition-colors">Select &rarr;</span>
                    )}
                  </div>

                  <h3 className="text-white font-extrabold text-sm mb-0.5 group-hover:text-neutral-200 transition-colors">
                    {info.title}
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-semibold mb-2 block">{info.badge}</span>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2">{info.description}</p>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-neutral-800">
                    {info.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Experience Level Grid in Monochrome */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-800">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-white text-black text-xs flex items-center justify-center font-black">
                2
              </span>
              Experience Level &amp; Seniority ({experienceLevels.length} Tiers)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
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
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-white bg-neutral-900 text-white shadow-md scale-[1.02]'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl border ${
                        isSelected ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800'
                      }`}>
                        {item.icon}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="font-extrabold text-xs text-white leading-tight mb-1">
                      {item.level}
                    </div>
                    <div className="text-[10px] text-neutral-400 leading-tight">
                      {item.subtitle}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-800">
                    <span className="text-[9px] font-mono font-bold text-white bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-700">
                      {item.years}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Simulation Mode Grid in Monochrome */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-neutral-800">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-white text-black text-xs flex items-center justify-center font-black">
                3
              </span>
              Simulation Mode ({simulationModes.length} Practice Modes)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
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
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'border-white bg-neutral-900 text-white shadow-md scale-[1.01]'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900'
                  }`}
                >
                  <div className={`p-3 rounded-xl border shrink-0 mt-0.5 ${
                    isSelected ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800'
                  }`}>
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-extrabold text-sm text-white">{item.title}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-neutral-900 text-white border border-neutral-700">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 leading-snug">{item.subtitle}</p>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Interview Launch Button in Monochrome */}
        <div className="pt-4 flex flex-col items-center">
          <button
            onClick={onStart}
            className="group px-10 py-4 rounded-2xl btn-electric text-black font-black text-base flex items-center gap-3 shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
          >
            <BrainCircuit className="w-5 h-5 text-black" />
            <span>Launch Mock Interview Session</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-black" />
          </button>
          <span className="text-[11px] text-neutral-500 mt-3 font-medium flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-neutral-400" /> Browser audio &amp; mic enabled • Real-time rubric scorecard
          </span>
        </div>
      </div>
    </div>
  );
};
