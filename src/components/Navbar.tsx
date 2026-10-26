'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Candidate');
  const displayRole = user?.targetRole || 'Interview Track';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-2xl border-b border-[#E8E2D9] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('setup')} 
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl btn-clay-primary flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-wider text-[#1A1A1A]">
                Prep<span className="text-[#2D5A4A] font-light">AI</span>
              </span>
              <span className="text-[9px] uppercase font-mono font-black tracking-widest px-2.5 py-0.5 rounded-full clay-badge-cyan">
                STUDIO v2.6
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-mono -mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2D5A4A] animate-pulse" />
              Speech &amp; STAR Studio
            </p>
          </div>
        </div>

        {/* Center Pill Navigation Bar */}
        <nav className="hidden md:flex items-center p-1.5 rounded-2xl clay-panel border border-[#E8E2D9] shadow-sm">
          <button
            onClick={() => setCurrentTab('setup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 cursor-pointer ${
              currentTab === 'setup'
                ? 'btn-clay-primary text-white font-bold'
                : 'text-[#6B7280] hover:text-[#1A1A1A] font-semibold hover:bg-black/5'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${currentTab === 'setup' ? 'text-white' : 'text-[#2D5A4A]'}`} />
            Interview Studio
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'btn-clay-pink text-[#1A1A1A] font-bold'
                : 'text-[#6B7280] hover:text-[#1A1A1A] font-semibold hover:bg-black/5'
            }`}
          >
            <LineChart className={`w-3.5 h-3.5 ${currentTab === 'dashboard' ? 'text-[#1A1A1A]' : 'text-[#2D5A4A]'}`} />
            Analytics &amp; Skills
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wide transition-all duration-300 cursor-pointer ${
              currentTab === 'history'
                ? 'btn-clay-purple text-white font-bold'
                : 'text-[#6B7280] hover:text-[#1A1A1A] font-semibold hover:bg-black/5'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${currentTab === 'history' ? 'text-white' : 'text-[#2D5A4A]'}`} />
            Transcripts
          </button>
        </nav>

        {/* User Profile / Candidate Chip & Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button 
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 p-1.5 px-3 rounded-2xl clay-panel border border-[#E8E2D9] hover:border-[#2D5A4A]/50 transition-all cursor-pointer group"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-black text-[#1A1A1A] group-hover:text-[#2D5A4A] transition-colors">{displayName}</span>
                  <span className="text-[10px] text-[#6B7280] font-mono font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3 text-[#2D5A4A]" /> {displayRole}
                  </span>
                </div>

                <div className="relative">
                  <div className="w-9 h-9 rounded-xl btn-clay-primary flex items-center justify-center font-black text-white text-xs shadow-sm">
                    {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#2D5A4A] border-2 border-[#FFFFFF]" />
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] hidden sm:block transition-transform duration-200 ${menuOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-white border border-[#E8E2D9] shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 border-b border-[#E8E2D9]/80 bg-[#FAF8F5]/60 rounded-xl mb-1.5">
                    <p className="text-xs font-bold text-[#1A1A1A]">{displayName}</p>
                    <p className="text-[11px] text-[#6B7280] font-mono truncate">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] hover:text-[#2D5A4A] hover:bg-[#FAF8F5] transition"
                    >
                      <LineChart className="w-4 h-4 text-[#2D5A4A]" />
                      Metrics Dashboard
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] hover:text-[#2D5A4A] hover:bg-[#FAF8F5] transition"
                    >
                      <UserCheck className="w-4 h-4 text-[#2D5A4A]" />
                      Switch Account
                    </Link>
                  </div>

                  <div className="mt-1.5 pt-1.5 border-t border-[#E8E2D9]/80">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Disconnect Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-clay-primary font-bold text-xs transition shadow-sm"
            >
              <LogIn className="w-4 h-4 text-white" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
