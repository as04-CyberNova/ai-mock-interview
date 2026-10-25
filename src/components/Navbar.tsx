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
  ChevronDown,
  Terminal,
  Zap
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

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'CyberCandidate');
  const displayRole = user?.targetRole || 'Neural Track';

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070913]/80 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Cyber Claymorphic Brand Logo */}
        <div 
          onClick={() => setCurrentTab('setup')} 
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl btn-clay-cyan flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <Bot className="w-6 h-6 text-[#030a1c]" />
            </div>
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-all duration-500 -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-pink-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                Prep<span className="text-pink-500 font-light">AI</span>
              </span>
              <span className="text-[9px] uppercase font-mono font-black tracking-widest px-2.5 py-0.5 rounded-full clay-badge-cyan">
                CYBER v2.6
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/70 font-mono -mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
              Neural Speech &amp; STAR Studio
            </p>
          </div>
        </div>

        {/* Center Bento Pill Navigation Bar with Tactile Cyber Claymorphism */}
        <nav className="hidden md:flex items-center p-1.5 rounded-2xl clay-panel border border-cyan-500/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => setCurrentTab('setup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 cursor-pointer ${
              currentTab === 'setup'
                ? 'btn-clay-cyan text-[#030a1c] font-black'
                : 'text-slate-300 hover:text-cyan-300 font-semibold hover:bg-white/5'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${currentTab === 'setup' ? 'text-[#030a1c]' : 'text-cyan-400'}`} />
            Interview Studio
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'btn-clay-pink text-white font-black'
                : 'text-slate-300 hover:text-pink-300 font-semibold hover:bg-white/5'
            }`}
          >
            <LineChart className={`w-3.5 h-3.5 ${currentTab === 'dashboard' ? 'text-white' : 'text-pink-400'}`} />
            Analytics &amp; Skills
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 cursor-pointer ${
              currentTab === 'history'
                ? 'btn-clay-purple text-white font-black'
                : 'text-slate-300 hover:text-purple-300 font-semibold hover:bg-white/5'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${currentTab === 'history' ? 'text-white' : 'text-purple-400'}`} />
            Transcripts
          </button>
        </nav>

        {/* User Profile / Candidate Chip & Auth Actions in Cyber Clay treatment */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 p-1.5 px-3 rounded-2xl clay-panel border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-black text-cyan-200 group-hover:text-white transition-colors">{displayName}</span>
                  <span className="text-[10px] text-pink-300/80 font-mono font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" /> {displayRole}
                  </span>
                </div>

                <div className="relative">
                  <div className="w-9 h-9 rounded-xl btn-clay-purple flex items-center justify-center font-black text-white text-xs shadow-md">
                    {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#070913] shadow-[0_0_6px_#00f0ff]" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400 hidden sm:block group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Profile Dropdown Menu in Cyber Clay style */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl clay-card border border-cyan-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.9)] p-2 z-50 backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-cyan-500/15">
                    <p className="text-xs font-bold text-cyan-200">{displayName}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                  </div>

                  <div className="py-1.5 space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-cyan-200 hover:bg-cyan-500/10 transition"
                    >
                      <LineChart className="w-4 h-4 text-cyan-400" />
                      Cyber Metrics Dashboard
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-pink-200 hover:bg-pink-500/10 transition"
                    >
                      <UserCheck className="w-4 h-4 text-pink-400" />
                      Switch Candidate Account
                    </Link>
                  </div>

                  <div className="pt-1.5 border-t border-cyan-500/15">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Disconnect Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-clay-cyan font-black text-xs transition"
            >
              <LogIn className="w-4 h-4 text-[#030a1c]" />
              Enter Portal
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
