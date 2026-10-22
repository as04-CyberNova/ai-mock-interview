-- Supabase Database Schema for AI Mock Interview Platform

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  target_role TEXT DEFAULT 'Data Analyst',
  experience_level TEXT DEFAULT 'Entry Level',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL,
  level TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'text',
  overall_score INTEGER,
  technical_accuracy_score INTEGER,
  communication_score INTEGER,
  structure_score INTEGER,
  summary_feedback TEXT,
  session_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own interview sessions" 
  ON public.interview_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview sessions" 
  ON public.interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
