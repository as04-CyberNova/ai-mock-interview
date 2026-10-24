# PrepAI - Modern AI-Powered Mock Interview Platform 🚀🤖

PrepAI is an interactive, full-stack AI mock interview platform built for engineers, analysts, product managers, and leaders preparing for high-stakes technical and behavioral interviews.

---

## 🌟 What's New & Key Highlights

- **Google AI Studio (Gemini 2.5 Flash) Engine**: Real-time semantic rubric scoring, deep feedback, and structured question generation with zero-downtime deterministic fallback.
- **Enterprise-Grade Security & Guardrails**:
  - **IP Sliding-Window Rate Limiting**: Per-client IP rate limiting (`20 req/min` for evaluations, `15 req/min` for question generation) preventing API abuse.
  - **Origin & Referer Verification**: Anti-CSRF and origin validation protecting serverless endpoints.
  - **Prompt Injection Defense & Input Sanitization**: Strips jailbreak markers, delimiters, and enforces strict character limits (`4000` chars for answers, `1000` chars for questions).
- **Expanded 10 Career Tracks**:
  - **Data Analyst**: Metrics, KPI hierarchies, executive dashboards, root-cause diagnosis.
  - **SQL Specialist**: Query optimization, window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`), execution plans, and CTEs.
  - **Python Developer**: Mutability, memory models, generators (`yield`), GIL, concurrency, and OOP.
  - **HR & Behavioral**: STAR methodology, conflict resolution, executive storytelling, leadership.
  - **Full Stack Engineer**: Next.js App Router, SSR/CSR rendering, state management, OWASP security, APIs.
  - **AI & Machine Learning**: RAG pipelines, vector search, embeddings, model evaluation, fine-tuning.
  - **System Design & Arch**: Distributed systems, caching/Redis, message queues, sharding, high availability.
  - **Technical Product Manager**: Prioritization frameworks (RICE), product strategy, North Star metrics.
  - **DevOps & Cloud Architect**: Kubernetes zero-downtime deployments, Terraform IaC, multi-region resilience, CI/CD.
  - **Cybersecurity Analyst**: Zero Trust architecture, vulnerability triage, incident response, defense in depth.
- **5 Simulation Modes**:
  - 🎙️ **Live Voice AI**: Real-time Speech-to-Text (STT) and AI Text-to-Speech (TTS) voice read-aloud with dynamic audio waveforms.
  - ⌨️ **Classic Text Mode**: Structured keyboard response composition with live word & character counting.
  - ⚡ **Rapid Fire Blitz**: 60-second timed pressure rounds to sharpen on-the-spot technical intuition.
  - 🎯 **STAR Method Focus**: Structured breakdown across Situation, Task, Action, and Measurable Result.
  - 🔥 **Executive Pressure Test**: Rigorous follow-ups and adversarial counter-inquiries for senior levels.
- **6 Seniority Levels**:
  - Intern / Student, Entry Level, Mid Level, Senior, Staff / Principal, and Engineering Manager.
- **Sleek Aesthetic & Bento Grid UI**:
  - Monochromatic dark aesthetic with glassmorphic panels, claymorphic tactile elements, and micro-interactions.
- **Dynamic Reactive State Management**:
  - LocalStorage synced across tabs and components using React 18+ `useSyncExternalStore` for real-time reactivity without re-render lag or hydration mismatch.
- **Interactive Analytics (Recharts)**:
  - Multidimensional competency radar charts, chronological score trends, readiness indicators, and comprehensive session audits.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15+ (App Router, Serverless Route Handlers)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Bento Grid, Glassmorphism & Claymorphic surfaces)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **AI Models**: Google AI Studio ([Gemini 1.5 Flash](https://aistudio.google.com/)) with zero-downtime heuristic fallback
- **State & Storage**: LocalStorage with `useSyncExternalStore` + optional [Supabase](https://supabase.com/) integration
- **Delight**: `canvas-confetti`

---

## 📋 Environment Configuration

Create a `.env.local` file in the project root:

```env
# Google AI Studio (Gemini) API Key (Recommended)
# Obtain a free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenAI fallback key
OPENAI_API_KEY=

# Optional: Supabase persistence and authentication
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

> **Note**: PrepAI operates seamlessly even without API keys by utilizing its built-in deterministic heuristic evaluation engine.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 18.18.0 or newer
- **npm** or **pnpm** or **yarn**

### 2. Installation & Setup

```bash
# Navigate to the project directory
cd ai-mock-interview

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start your mock interview.

### 3. Production Build & Linting

```bash
# Verify TypeScript types and build bundle
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

---

## 🔒 Security Architecture

PrepAI enforces production-grade safeguards for all public AI endpoints:

1. **Sliding-Window Rate Limiter** (`src/lib/api-security.ts`): Tracks client IP requests with automatic cleanup intervals to thwart denial-of-service and quota drain.
2. **Origin Validation**: Rejects untrusted cross-origin requests.
3. **Input Sanitization**: Enforces strict payload bounds, strips HTML/script tags, and removes prompt injection jailbreak patterns before sending prompts to the LLM.
4. **Resilient Fallback**: If LLM quotas are exhausted or network limits are hit, answers are immediately evaluated using algorithmic keyword, syntax, and STAR heuristics.

---

## 📁 Project Structure

```
ai-mock-interview/
├── public/                 # Static assets and icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── evaluate/   # AI scoring & feedback route (Rate limited + Sanitized)
│   │   │   └── questions/  # Dynamic question generator route
│   │   ├── login/          # Candidate authentication page
│   │   ├── page.tsx        # Main application controller & tab switch
│   │   └── layout.tsx      # Root HTML layout & font configuration
│   ├── components/
│   │   ├── AuthGuard.tsx   # Session authentication route protector
│   │   ├── Dashboard.tsx   # Recharts readiness metrics & radar charts
│   │   ├── InterviewSetup.tsx # Bento-grid track, level & mode selector
│   │   ├── InterviewStudio.tsx# Real-time interview room (STT/TTS + Timer)
│   │   ├── Navbar.tsx      # Claymorphic brand header & user profile
│   │   └── SessionHistory.tsx # Detailed past interview audits
│   ├── data/
│   │   └── questions.ts    # Comprehensive question bank & role metadata
│   ├── lib/
│   │   ├── api-security.ts # IP rate limiter, origin checker & sanitizers
│   │   ├── auth-context.tsx# Candidate login/signup state context
│   │   ├── evaluator.ts    # Gemini 1.5 Flash + heuristic rubric engine
│   │   ├── question-generator.ts # LLM question synthesis
│   │   └── session-storage.ts # useSyncExternalStore reactive persistence
│   └── types/
│       └── interview.ts    # TypeScript definitions for roles, scores, and sessions
├── supabase/
│   └── schema.sql          # Postgres database schema & RLS policies
├── .env.example            # Environment template
└── package.json            # Scripts and dependencies
```
