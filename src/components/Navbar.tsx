'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  LineChart, 
  BookOpen, 
  Sparkles, 
  ShieldCheck,
  LogIn,
  LogOut,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps {
  currentTab: 'interview' | 'dashboard' | 'history' | 'setup';
  setCurrentTab: (tab: 'interview' | 'dashboard' | 'history' | 'setup') => void;
  mockUser?: { name: string; role: string };
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Candidate');
  const displayRole = user?.targetRole || 'Interview Preparation';

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/login');
  };

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
        <nav className="hidden md:flex items-center p-1 rounded-2xl bg-[#081226]/90 border border-cyan-500/20 shadow-inner">
          <button
            onClick={() => setCurrentTab('setup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              currentTab === 'setup'
                ? 'bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-purple-500/25 text-[#00f7ff] border border-cyan-400/60 shadow-[0_0_15px_rgba(0,247,255,0.3)]'
                : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00f7ff]" />
            Interview Studio
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-purple-500/25 text-[#00f7ff] border border-cyan-400/60 shadow-[0_0_15px_rgba(0,247,255,0.3)]'
                : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800/40'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-[#00f7ff]" />
            Analytics &amp; Skills
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              currentTab === 'history'
                ? 'bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-purple-500/25 text-[#00f7ff] border border-cyan-400/60 shadow-[0_0_15px_rgba(0,247,255,0.3)]'
                : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00f7ff]" />
            Past Transcripts
          </button>
        </nav>

        {/* User Profile / Candidate Chip & Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-800/40 border border-transparent hover:border-slate-800 transition"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-200">{displayName}</span>
                  <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" /> {displayRole}
                  </span>
                </div>

                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs border border-cyan-300/40 shadow-md">
                    {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#050917]" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0a1224] border border-sky-500/25 shadow-2xl p-2 z-50 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      <LineChart className="w-4 h-4 text-sky-400" />
                      Dedicated Dashboard
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      Switch Account
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:scale-[1.02] transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
