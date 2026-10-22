'use client';

import React from 'react';
import { 
  Bot, 
  LineChart, 
  BookOpen, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'interview' | 'dashboard' | 'history' | 'setup';
  setCurrentTab: (tab: 'interview' | 'dashboard' | 'history' | 'setup') => void;
  mockUser: { name: string; role: string };
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, mockUser }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#050917]/80 backdrop-blur-2xl border-b border-sky-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with animated glow */}
        <div 
          onClick={() => setCurrentTab('setup')} 
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-400/50 group-hover:scale-105 transition-all duration-300">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -inset-1 bg-cyan-400/20 rounded-2xl blur-md -z-10 group-hover:bg-cyan-400/40 transition-all duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">
                Prep<span className="gradient-text-electric">AI</span>
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 border border-cyan-400/30">
                PRO ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Speech &amp; STAR Evaluator
            </p>
          </div>
        </div>

        {/* Center Modern Segmented Navigation Bar */}
        <nav className="hidden md:flex items-center p-1 rounded-2xl bg-[#0b1428]/80 border border-slate-800/80 shadow-inner">
          <button
            onClick={() => setCurrentTab('setup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
              currentTab === 'setup'
                ? 'bg-gradient-to-r from-sky-500/25 to-indigo-500/25 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Interview Studio
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
              currentTab === 'dashboard'
                ? 'bg-gradient-to-r from-sky-500/25 to-indigo-500/25 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-sky-400" />
            Analytics &amp; Skills
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
              currentTab === 'history'
                ? 'bg-gradient-to-r from-sky-500/25 to-indigo-500/25 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Past Transcripts
          </button>
        </nav>

        {/* User Profile / Candidate Chip */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">{mockUser.name}</span>
            <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3 h-3 text-cyan-400" /> {mockUser.role}
            </span>
          </div>

          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs border border-cyan-300/40 shadow-md group-hover:scale-105 transition-transform">
              {mockUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#050917]" />
          </div>
        </div>
      </div>
    </header>
  );
};
