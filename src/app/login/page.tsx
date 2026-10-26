'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Mic2,
  Terminal,
  Activity
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('Data Analyst');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }
    if (isSignUp && !name) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, name);
      router.push('/dashboard');
    } catch {
      setErrorMessage('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    loginAsGuest();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col justify-between selection:bg-[#D6C4A8]/40 selection:text-[#1A1A1A] relative overflow-hidden">
      {/* Background Soft Warm Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#D6C4A8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[#2D5A4A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D6C4A8]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-3.5 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-11 h-11 rounded-2xl btn-clay-primary flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-wider text-[#1A1A1A]">
              Prep<span className="text-[#2D5A4A] font-light">AI</span>
            </span>
          </div>
        </div>

        <div className="text-xs text-[#2D5A4A] font-mono font-bold flex items-center gap-2 clay-panel px-3.5 py-1.5 rounded-full border border-[#E8E2D9]">
          <span className="w-2 h-2 rounded-full bg-[#2D5A4A] animate-pulse" />
          Secure &amp; Calibrated
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Side Value Proposition */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full clay-panel border border-[#E8E2D9] text-[#2D5A4A] text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#2D5A4A]" />
            <span>AI Real-time Speech &amp; STAR Scoring Studio</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.15] text-[#1A1A1A]">
            Master your tech interviews with{' '}
            <span className="text-[#2D5A4A] underline decoration-[#D6C4A8] decoration-wavy">
              precision neural analytics
            </span>.
          </h1>

          <p className="text-base text-[#6B7280] max-w-xl leading-relaxed font-normal">
            Get personalized AI evaluations across 10 specialized engineering &amp; product tracks with real-time speech dictation, STAR structure calibration, and actionable telemetry.
          </p>

          {/* Feature Highlights Grid in Card Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl clay-card text-left">
              <div className="p-2.5 w-fit rounded-xl btn-clay-primary mb-2.5 shadow-sm">
                <Mic2 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xs font-black text-[#1A1A1A] font-mono">Neural Voice</h2>
              <p className="text-[11px] text-[#6B7280] mt-1 font-sans">Live voice simulations with speech-to-text dictation.</p>
            </div>

            <div className="p-4 rounded-2xl clay-card text-left">
              <div className="p-2.5 w-fit rounded-xl btn-clay-pink mb-2.5 shadow-sm">
                <Zap className="w-4 h-4 text-[#1A1A1A]" />
              </div>
              <h2 className="text-xs font-black text-[#1A1A1A] font-mono">STAR Scoring</h2>
              <p className="text-[11px] text-[#6B7280] mt-1 font-sans">Rubric grading on Situation, Task, Action &amp; Result.</p>
            </div>

            <div className="p-4 rounded-2xl clay-card text-left">
              <div className="p-2.5 w-fit rounded-xl btn-clay-purple mb-2.5 shadow-sm">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xs font-black text-[#1A1A1A] font-mono">Skill Matrix</h2>
              <p className="text-[11px] text-[#6B7280] mt-1 font-sans">Radar competency mapping &amp; practice streaks.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full max-w-md">
          <div className="clay-panel-glow p-8 relative">
            {/* Header Tabs: Login vs Register */}
            <div className="flex p-1.5 rounded-2xl clay-panel mb-6">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                  !isSignUp 
                    ? 'btn-clay-primary shadow-sm' 
                    : 'text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                  isSignUp 
                    ? 'btn-clay-pink shadow-sm' 
                    : 'text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A4A]" />
                {isSignUp ? 'Initialize Candidate Profile' : 'Candidate Sign In'}
              </h2>
              <p className="text-xs text-[#6B7280] font-mono mt-1">
                {isSignUp 
                  ? 'Set up your profile to calibrate performance metrics.' 
                  : 'Enter your credentials to access your session analytics.'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#1A1A1A] mb-1.5">Full Candidate Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Hunter"
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] focus:border-[#2D5A4A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#2D5A4A] font-mono transition"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#1A1A1A] mb-1.5">Target Interview Track</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] focus:border-[#2D5A4A] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:ring-1 focus:ring-[#2D5A4A] transition"
                  >
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="SQL Specialist">SQL Specialist</option>
                    <option value="Python Developer">Python Developer</option>
                    <option value="Fullstack Engineer">Fullstack Engineer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="HR / Behavioral">HR / Behavioral</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-[#1A1A1A] mb-1.5">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@company.com"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] focus:border-[#2D5A4A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#2D5A4A] font-mono transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-[#1A1A1A] mb-1.5">Passcode</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] focus:border-[#2D5A4A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#2D5A4A] font-mono transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl btn-clay-primary font-black text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Profile & Continue' : 'Sign In to PrepAI'}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Guest Access / Instant Demo */}
            <div className="mt-6 pt-5 border-t border-[#E8E2D9] text-center">
              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full py-2.5 rounded-xl clay-panel border border-[#E8E2D9] hover:border-[#2D5A4A] text-[#1A1A1A] hover:text-[#2D5A4A] text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#2D5A4A]" />
                Instant Demo as Guest (No Password Required)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-[#6B7280] font-mono border-t border-[#E8E2D9]">
        PrepAI Studio • AI Interview Analytics • Warm Architectural Edition
      </footer>
    </div>
  );
}
