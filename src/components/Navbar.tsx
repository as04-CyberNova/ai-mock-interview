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
    <header className="sticky top-0 z-50 w-full bg-black/85 backdrop-blur-2xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo in Monochrome */}
        <div 
          onClick={() => setCurrentTab('setup')} 
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg shadow-white/10 group-hover:bg-neutral-200 group-hover:scale-105 transition-all duration-300">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div className="absolute -inset-1 bg-white/15 rounded-2xl blur-md -z-10 group-hover:bg-white/30 transition-all duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">
                Prep<span className="text-neutral-400">AI</span>
              </span>
              <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700">
                PRO ENGINE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 -mt-0.5 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Real-Time Speech &amp; STAR Evaluator
            </p>
          </div>
        </div>

        {/* Center Segmented Navigation Bar in Monochrome */}
        <nav className="hidden md:flex items-center p-1 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner">
          <button
            onClick={() => setCurrentTab('setup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              currentTab === 'setup'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${currentTab === 'setup' ? 'text-black' : 'text-neutral-400'}`} />
            Interview Studio
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <LineChart className={`w-3.5 h-3.5 ${currentTab === 'dashboard' ? 'text-black' : 'text-neutral-400'}`} />
            Analytics &amp; Skills
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              currentTab === 'history'
                ? 'bg-white text-black font-extrabold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${currentTab === 'history' ? 'text-black' : 'text-neutral-400'}`} />
            Past Transcripts
          </button>
        </nav>

        {/* User Profile / Candidate Chip & Auth Actions in Monochrome */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition cursor-pointer"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-neutral-200">{displayName}</span>
                  <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3 text-white" /> {displayRole}
                  </span>
                </div>

                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-black text-white text-xs shadow-md">
                    {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-black" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu in Monochrome */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl p-2 z-50 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-neutral-900">
                    <p className="text-xs font-bold text-white">{displayName}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
                    >
                      <LineChart className="w-4 h-4 text-white" />
                      Dedicated Dashboard
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
                    >
                      <UserCheck className="w-4 h-4 text-white" />
                      Switch Account
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-neutral-900">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-neutral-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition shadow-md"
            >
              <LogIn className="w-4 h-4 text-black" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
