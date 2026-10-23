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
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col justify-between selection:bg-white selection:text-black relative overflow-hidden">
      {/* Background Monochromatic Vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg shadow-white/10">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            Prep<span className="text-neutral-400">AI</span>
          </span>
        </div>

        <div className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Secure Portal Access
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Side Value Proposition in Monochrome */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>AI Real-time Speech &amp; STAR Scoring</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Master your tech interviews with{' '}
            <span className="text-neutral-400">precision analytics</span>.
          </h1>

          <p className="text-base text-neutral-400 max-w-xl leading-relaxed">
            Get personalized AI evaluations for Data Analysts, SQL Specialists, Fullstack Developers, and Behavioral rounds with instant feedback on clarity, structure, and keyword depth.
          </p>

          {/* Feature Highlights Grid in Monochrome */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left">
              <div className="p-2 w-fit rounded-xl bg-neutral-900 border border-neutral-800 text-white mb-2.5">
                <Mic2 className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Voice &amp; Audio</h2>
              <p className="text-[11px] text-neutral-400 mt-1">Realistic voice simulations with instant transcription.</p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left">
              <div className="p-2 w-fit rounded-xl bg-neutral-900 border border-neutral-800 text-white mb-2.5">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">STAR Evaluator</h2>
              <p className="text-[11px] text-neutral-400 mt-1">Algorithmic scoring against strict candidate rubrics.</p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left">
              <div className="p-2 w-fit rounded-xl bg-neutral-900 border border-neutral-800 text-white mb-2.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-white">Skill Matrix</h2>
              <p className="text-[11px] text-neutral-400 mt-1">Track radar analytics and performance streaks.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card in Monochrome */}
        <div className="w-full max-w-md">
          <div className="glass-panel-glow rounded-3xl p-8 border border-neutral-800 bg-neutral-950 shadow-2xl relative">
            {/* Header Tabs: Login vs Register */}
            <div className="flex p-1 rounded-2xl bg-black border border-neutral-800 mb-6">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !isSignUp 
                    ? 'bg-white text-black font-extrabold shadow-sm' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isSignUp 
                    ? 'bg-white text-black font-extrabold shadow-sm' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                {isSignUp ? 'Start Your Practice Journey' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {isSignUp 
                  ? 'Set up your candidate profile to start tracking metrics.' 
                  : 'Enter your credentials to access your session analytics.'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Hunter"
                      className="w-full bg-black border border-neutral-800 focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white transition"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Target Interview Track</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-black border border-neutral-800 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white transition"
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
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-black border border-neutral-800 focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black border border-neutral-800 focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl btn-electric font-black text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Profile & Continue' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Guest Access / Instant Demo */}
            <div className="mt-6 pt-5 border-t border-neutral-900 text-center">
              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Instant Demo as Guest (No Password Required)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer in Monochrome */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-neutral-500 border-t border-neutral-900">
        PrepAI Studio • Enterprise Interview Preparation Engine • Monochrome Edition
      </footer>
    </div>
  );
}
