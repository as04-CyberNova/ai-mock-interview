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
  Mic2
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
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-sky-500/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            Prep<span className="gradient-text-electric">AI</span>
          </span>
        </div>

        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Secure Portal Access
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Side Value Proposition */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Real-time Speech &amp; STAR Scoring</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Master your tech interviews with{' '}
            <span className="gradient-text-electric">precision analytics</span>.
          </h1>

          <p className="text-base text-slate-400 max-w-xl leading-relaxed">
            Get personalized AI evaluations for Data Analysts, SQL Specialists, Fullstack Developers, and Behavioral rounds with instant feedback on clarity, structure, and keyword depth.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#0b1428]/60 border border-slate-800/80 backdrop-blur-md">
              <Mic2 className="w-5 h-5 text-sky-400 mb-2" />
              <h2 className="text-xs font-bold text-white">Speech &amp; Pace</h2>
              <p className="text-[11px] text-slate-400 mt-1">Real-time voice transcription with cadence metrics.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b1428]/60 border border-slate-800/80 backdrop-blur-md">
              <Zap className="w-5 h-5 text-cyan-400 mb-2" />
              <h2 className="text-xs font-bold text-white">STAR Evaluation</h2>
              <p className="text-[11px] text-slate-400 mt-1">Detailed scoring for situation, task, action, &amp; result.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b1428]/60 border border-slate-800/80 backdrop-blur-md">
              <TrendingUp className="w-5 h-5 text-indigo-400 mb-2" />
              <h2 className="text-xs font-bold text-white">Skill Matrix</h2>
              <p className="text-[11px] text-slate-400 mt-1">Track radar analytics and performance streaks.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full max-w-md">
          <div className="glass-panel-glow rounded-3xl p-8 border border-sky-500/25 bg-[#0a1224]/90 backdrop-blur-2xl shadow-2xl relative">
            {/* Header Tabs: Login vs Register */}
            <div className="flex p-1 rounded-2xl bg-[#040817] border border-cyan-500/25 mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !isSignUp 
                    ? 'bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-purple-500/30 text-[#00f7ff] border border-cyan-400/60 shadow-[0_0_15px_rgba(0,247,255,0.3)]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isSignUp 
                    ? 'bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-purple-500/30 text-[#00f7ff] border border-cyan-400/60 shadow-[0_0_15px_rgba(0,247,255,0.3)]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f7ff] shadow-[0_0_8px_#00f7ff]" />
                {isSignUp ? 'Start Your Practice Journey' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? 'Set up your candidate profile to start tracking metrics.' 
                  : 'Enter your credentials to access your session analytics.'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium shadow-[0_0_12px_rgba(244,63,94,0.25)]">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#00f7ff] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Hunter"
                      className="w-full bg-[#040816] border border-slate-700/80 focus:border-[#00f7ff] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00f7ff] transition shadow-inner"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Interview Track</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-[#040816] border border-slate-700/80 focus:border-[#00f7ff] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#00f7ff] transition"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#00f7ff] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-[#040816] border border-slate-700/80 focus:border-[#00f7ff] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00f7ff] transition shadow-inner"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#00f7ff] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#040816] border border-slate-700/80 focus:border-[#00f7ff] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00f7ff] transition shadow-inner"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl btn-electric text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Profile & Continue' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 text-[#00f7ff]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Guest Access / Instant Demo */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full py-2.5 rounded-xl bg-[#081328] hover:bg-[#0c1c3c] border border-cyan-500/30 hover:border-[#00f7ff] text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(0,247,255,0.2)]"
              >
                <ShieldCheck className="w-4 h-4 text-[#10ff9e]" />
                Instant Demo as Guest (No Password Required)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500 border-t border-slate-900/80">
        PrepAI Studio • Enterprise Interview Preparation Engine
      </footer>
    </div>
  );
}
