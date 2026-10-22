# PrepAI - Modern AI-Powered Mock Interview Platform 🚀💙

PrepAI is an interactive, full-stack AI mock interview platform built for students and job seekers preparing for Data Analyst, SQL, Python, and HR roles.

## 🌟 Key Features
- **4 Track Simulations**:
  - **Data Analyst**: Metric definitions, executive dashboards, root-cause diagnosis, and data cleaning.
  - **SQL**: Query optimization, window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`), execution plans, and aggregations.
  - **Python**: Memory models (mutability), generators (`yield`), GIL, multithreading vs multiprocessing.
  - **HR / Behavioral**: STAR framework, conflict resolution, failure post-mortems, and leadership storytelling.
- **Multimodal Interview Studio**:
  - **Voice Mode**: Real-time browser speech recognition (Speech-to-Text) with animated audio waves and AI Text-to-Speech question reading.
  - **Text Mode**: In-depth response composition with real-time word counting.
- **Rubric-Based AI Evaluation Engine**:
  - Real-time scoring across **Technical Accuracy**, **Communication & Clarity**, and **STAR Answer Structure**.
  - Dynamic highlight of strengths, actionable improvement tips, and keyword matching.
- **Interactive Performance Analytics (Recharts)**:
  - Score progression timeline across recent sessions.
  - Multidimensional competency Radar chart.
  - Readiness metric and track breakdown.
- **Session History & Review**:
  - Detailed audit of all past mock interviews with full question-and-answer breakdown.
- **Design Aesthetic**:
  - Premium Dark Navy (`#070d19`) and Electric Blue theme with backdrop blurs, glow effects, and modern typography.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+ (App Router), React, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti.
- **Backend**: Next.js Serverless API Route (`/api/evaluate`).
- **Database & Auth**: Supabase schema ready with Row Level Security (RLS) policies in `supabase/schema.sql`.
- **Deployment**: Vercel ready.

## 🚀 Getting Started

```bash
# Navigate to the project directory
cd ai-mock-interview

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start practicing!
