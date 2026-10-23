# Design System & UX/UI Specification (DESIGN.md)

**Product Name:** PrepAI — AI-Powered Mock Interview Platform  
**Document Version:** 1.0.0  
**Status:** Source of Truth for Visuals, Components, and Interactions  
**Reference:** [PRD.md](file:///d:/new%20project/ai-mock-interview/PRD.md)

---

## 1. Visual Direction & Design Principles

### 1.1 Visual Direction: "Mission Control Studio"
PrepAI delivers an elevated, high-focus interview simulation environment. The aesthetic merges **deep cosmic navy layers** with **focused electric blue and cyan telemetry highlights**. It feels like an executive cockpit: calm, distraction-free, highly readable, and reassuringly precise.

### 1.2 Core Design Principles
1. **Calm Under Pressure:** Interviewing induces anxiety. Visuals must be calming and deliberate—never flashing, noisy, or hyperactive. High-contrast typography ensures zero eye strain.
2. **Telemetry Over Decoration:** Every visual treatment (progress rings, confidence badges, sound waves, radar graphs) conveys actionable candidate feedback rather than decorative fluff.
3. **Immediate Spatial Clarity:** Layouts follow a predictable, single-focus mental model. Only one primary objective occupies the candidate's active attention during any phase (Setup $\rightarrow$ Respond $\rightarrow$ Review).
4. **Resilient Touch & Audio Targets:** Interactive voice controls (mic, speaker, speech status) must be large, immediately recognizable, and unambiguously toggleable.

---

## 2. Colors & Typography System

### 2.1 Color Palette

#### Base & Surface Tokens (Dark Canvas)
| Token Name | Hex Code | Usage |
|---|---|---|
| `--color-canvas-base` | `#040814` | Global application backdrop |
| `--color-canvas-surface` | `#070d19` | Main layout and container background |
| `--color-panel-bg` | `rgba(10, 18, 38, 0.70)` | Standard glass panel background (cards, bars) |
| `--color-panel-elevated` | `rgba(14, 28, 60, 0.85)` | Elevated modals, drawers, active question surfaces |
| `--color-panel-border` | `rgba(56, 189, 248, 0.14)`| Default structural divider / subtle card border |
| `--color-panel-border-glow` | `rgba(56, 189, 248, 0.35)`| Focused/hovered card border with subtle outer glow |

#### Accent & Telemetry Tokens
| Token Name | Hex Code | Usage |
|---|---|---|
| `--color-electric-blue` | `#0ea5e9` | Primary action triggers, active tabs, timeline strokes |
| `--color-cyan-glow` | `#00f2fe` | High-energy accents, gradient terminators, pulse rings |
| `--color-indigo-core` | `#6366f1` | Secondary accents, deep gradient pairings |
| `--color-success` | `#10b981` | High scores ($\ge 80$), answered status, strengths |
| `--color-warning` | `#f59e0b` | Mid scores ($60–79$), missing keywords, hints |
| `--color-danger` | `#ef4444` | Low scores ($< 60$), mic error, recording stop action |

#### Text & Typography Tokens
| Token Name | Hex Code | Usage |
|---|---|---|
| `--text-primary` | `#f8fafc` (Slate 50) | Headers, active question prompt, primary text |
| `--text-secondary` | `#94a3b8` (Slate 400) | Secondary metadata, labels, timestamps, rubrics |
| `--text-muted` | `#64748b` (Slate 500) | Footers, disabled states, unselected tabs |
| `--text-accent` | `#38bdf8` (Sky 400) | Metric scores, highlight tags, breadcrumbs |

### 2.2 Typography Hierarchy
- **Typeface Sans:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif.
- **Typeface Monospace:** JetBrains Mono / SF Mono / Consolas (for metrics, timers, and code terms).

| Role | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| **Display / Hero** | `32px` (2rem) | Bold (700) | 1.2 | -0.025em | Main Setup headlines, Scorecard totals |
| **Heading 1** | `24px` (1.5rem) | SemiBold (600) | 1.3 | -0.02em | Question prompt, Section headings |
| **Heading 2** | `18px` (1.125rem) | SemiBold (600) | 1.4 | -0.01em | Card headers, Modal titles, Tab labels |
| **Body Large** | `16px` (1.0rem) | Regular (400) | 1.6 | Normal | Candidate answer textarea, Feedback text |
| **Body Regular** | `14px` (0.875rem) | Regular (400) | 1.5 | Normal | Metadata descriptions, rubric explanations |
| **Caption / Badge** | `12px` (0.75rem) | Medium (500) | 1.4 | +0.02em | Seniority badges, tags, word counter |
| **Numeric KPI** | `28px` (1.75rem) | Bold (700) | 1.1 | -0.03em | 0–100 Scores, duration stats (Mono font) |

---

## 3. Spacing & Layout System

### 3.1 Spatial Grid
Based on an **8-point grid** scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`):
- **Container Max Width:** `1280px` (`max-w-7xl`) centered with `px-4 sm:px-6 lg:px-8`.
- **Card Padding:** `p-5` (`20px`) for small telemetry widgets; `p-6` to `p-8` (`24px–32px`) for main studio cards.
- **Section Gaps:** `gap-4` for compact list items; `gap-6` for multi-column dashboards.

### 3.2 Elevation & Glassmorphism Spec
- **Level 0 (Flat Canvas):** `#040814` with subtle radial vignette.
- **Level 1 (Standard Card):** `backdrop-filter: blur(16px); background: rgba(10, 18, 38, 0.65); border: 1px solid rgba(56, 189, 248, 0.12);`
- **Level 2 (Interactive Hover):** `transform: translateY(-2px); border-color: rgba(56, 189, 248, 0.35); box-shadow: 0 12px 30px -10px rgba(14, 165, 233, 0.25);`
- **Level 3 (Modal / Active Overlay):** `backdrop-filter: blur(24px); background: rgba(8, 16, 35, 0.92); border: 1px solid rgba(56, 189, 248, 0.35); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85);`

---

## 4. Reusable Component Specifications

### 4.1 Navigation Bar (`Navbar.tsx`)
- **Structure:** Sticky top container (`h-16`), backdrop blurred with bottom border `rgba(56, 189, 248, 0.1)`.
- **Brand Element:** Logo glyph with cyan glow + "PrepAI" text with gradient clipping.
- **Segmented View Switcher:** Pill-shaped toggle grouping 4 primary tabs (*Setup, Studio, Dashboard, History*):
  - Inactive tab: `text-slate-400 hover:text-white hover:bg-slate-800/40`.
  - Active tab: `bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm`.
- **User Status / Session Info:** User pill with target role indicator and Sign Out button.

### 4.2 Track Selection Card (`InterviewSetup.tsx`)
- **Dimensions:** Grid card with min-height `140px`.
- **States:**
  - *Default:* Glass panel with track icon, title, question count, and brief role summary.
  - *Selected:* Border `rgba(56, 189, 248, 0.6)`, active checkmark badge in top-right, subtle cyan inner glow.

### 4.3 Active Question Card (`InterviewStudio.tsx`)
- **Header:** Question category pill (e.g., `Technical`, `Scenario`), difficulty badge (`Mid Level`), and `Question X of Y` step count.
- **Audio Control:** Embedded circular "Listen to Question" button invoking browser TTS with visual sound wave bars when speaking.
- **Expandable Hint:** Accordion drawer with amber tint that reveals guiding points without penalizing scores.

### 4.4 Answer Input & Voice Studio
- **Dual-Mode Tabs:** Toggle between `Voice Transcription` and `Keyboard Text`.
- **Microphone Action Area:**
  - Large circular mic trigger (`w-16 h-16` / `64px`).
  - Pulsing dual radial ripple rings when listening (`ai-orb-pulse`).
  - Live sound bars (`audio-bar-1, 2, 3`) bouncing to indicate active speech recognition.
- **Dynamic Textarea:** Auto-expanding or minimum `180px` height with subtle slate border. Shows live character & word counter (`Minimum 15 words recommended`).

### 4.5 Evaluation Scorecard & Breakdown Drawer
- **Overall Score Ring:** Big circular meter (0–100) color-coded:
  - Green ($\ge 80$), Amber ($60–79$), Crimson ($< 60$).
- **Rubric Progress Bars:** 3 horizontal segmented bars for:
  - Technical Accuracy ($\%$)
  - Communication & Clarity ($\%$)
  - STAR / Structure Framework ($\%$)
- **Pill Tags:**
  - *Strengths:* Soft green pills with checkmark icon.
  - *Areas for Growth:* Soft amber pills with arrow icon.
  - *Keyword Audit:* Green pills for detected keywords; strike/ghost pills for missing critical keywords.

---

## 5. Navigation, Forms & Input Patterns

### 5.1 Navigation Patterns
- Zero full-page reloads for active simulation flows. The studio state machine strictly controls progression:
  $$\text{Setup} \longrightarrow \text{Studio (Question 1..N)} \longrightarrow \text{Scorecard Modal} \longrightarrow \text{Dashboard}$$
- **Exit Confirmation Modal:** If candidate clicks "Exit Interview" mid-session, prompt a high-visibility modal: *"Are you sure you want to end early? Incomplete responses will not be evaluated."*

### 5.2 Form & Input Rules
- **No Invisible Failures:** All input states display immediate feedback. If user clicks "Submit" with insufficient content, the textarea outline turns amber with a helper tooltip.
- **Autosave / Draft Safety:** While user speaks or types, the current question draft is mirrored in component memory to prevent accidental loss if the tab loses focus.

---

## 6. Loading, Empty & Error States

### 6.1 Loading States
- **Evaluation Processing:**
  - Submit button turns into a deactivated state with electric cyan spinner.
  - Text shifts to: *"Analyzing answer & rubrics..."*
  - The answer input is locked to prevent edits during calculation.
- **Audio Synthesis (TTS):**
  - Speaker icon rotates softly until speech synthesis initiates.

### 6.2 Empty States
- **Dashboard / History View:**
  - Centered glass card with a dashed slate border.
  - Icon: `Inbox` or `Terminal` in muted sky color.
  - Heading: *"No completed interviews on record"*.
  - Subtext: *"Complete your first 3-question mock session to unlock skill radar and readiness analytics."*
  - Primary CTA: *"Configure Your First Interview"* (navigates to Setup tab).

### 6.3 Error States
- **Microphone Permission Denied:**
  - Banner positioned directly above the input:
  - Visual: Amber border, alert icon.
  - Text: *"Microphone access was denied. Switch to Text Mode or enable microphone access in your browser address bar."*
- **Speech Recognition Unsupported:**
  - Automatically hides Voice mode toggle; defaults to Text mode with an unobtrusive notice tag.

---

## 7. Interactions, Micro-Animations & Sound

### 7.1 Keyframe Animations
- **AI Orb Pulse:** Continuous `3s` ease-in-out expansion and glow for the active voice assistant indicator.
- **Audio Wave Bars:** 3 vertical bars with staggered `0.75s–0.9s` looping keyframes (`audioWave1`, `audioWave2`, `audioWave3`) to signify mic active state.
- **Card Hover:** Subtle `translateY(-2px)` with cubic-bezier easing (`0.16, 1, 0.3, 1`) over `250ms`.

### 7.2 Milestone Celebrations
- **Session Complete:** On trigger of the final scorecard, fire a two-burst `canvas-confetti` effect (electric blue, cyan, and gold particles) to deliver emotional reinforcement.

---

## 8. Responsive Behavior & Breakpoints

PrepAI adapts fluidly across mobile, tablet, and widescreen desktop layouts:

| Viewport | Breakpoint | Layout Adjustments |
|---|---|---|
| **Mobile** | `< 640px` (`sm`) | Single-column stacked layout. Bottom-anchored mic button for ergonomic thumb reach. Collapsible navigation bar. |
| **Tablet** | `640px – 1024px` (`md`) | 2-column track grid. Dashboard metrics in 2x2 grid. Radar chart centered with stacked timeline below. |
| **Desktop** | `> 1024px` (`lg`) | Full 3-column or 4-column setup grid. Studio displays side-by-side question context and response area. Full analytical charts side-by-side. |

---

## 9. Accessibility (a11y) Requirements

1. **Contrast Standards:** All text layers achieve minimum **4.5:1** contrast ratio against `#040814` and `#070d19` background surfaces. Secondary labels maintain at least **3.0:1**.
2. **Keyboard Navigation:**
   - `Tab` traverses all interactive controls sequentially.
   - `Space` toggles microphone listening on/off.
   - `Ctrl + Enter` (or `Cmd + Enter`) executes "Submit Answer".
3. **Screen Readers (`ARIA`):**
   - Live transcript regions use `aria-live="polite"`.
   - Score badges include explicit descriptions (e.g., `aria-label="Score: 84 out of 100"`).
   - Audio toggles declare state via `aria-pressed="true|false"`.

---

## 10. Page-Level Layout Guidance

```
+-----------------------------------------------------------------------------------+
|  [Logo] PrepAI        [ Setup | Studio | Dashboard | History ]        [User / Exit] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   +------------------------------------+   +----------------------------------+   |
|   |          ACTIVE QUESTION           |   |           CANDIDATE STUDIO       |   |
|   |  Track: Data Analyst (Mid Level)   |   |                                  |   |
|   |  Category: Metrics & Experiment    |   |   [ Voice Mode ]  [ Text Mode ]  |   |
|   |                                    |   |                                  |   |
|   |  "How would you diagnose a sudden  |   |   +--------------------------+   |   |
|   |   15% drop in conversion rate?"    |   |   |  Live Dictation /        |   |   |
|   |                                    |   |  Answer Textarea...      |   |   |
|   |  [ ( Speaker ) Listen ]            |   |  |                          |   |   |
|   |  [ ( ? ) Show Answer Hint ]        |   |  +--------------------------+   |   |
|   |                                    |   |  Words: 48    Timer: 01:24       |   |
|   +------------------------------------+   |                                  |   |
|                                            |   [ Submit Answer (Ctrl+Enter) ] |   |
|                                            +----------------------------------+   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                      (c) 2026 PrepAI - Electric Blue Edition                      |
+-----------------------------------------------------------------------------------+
```

### 10.1 Setup Screen Layout
- Top: Hero banner *"Select Your Simulation Track"*.
- Middle: 4 primary tracks in elevated cards with track icons (`Database`, `Code`, `Cpu`, `Users`).
- Lower-Middle: Experience Level segmented pill group and Simulation Mode cards.
- Bottom: Prominent centered CTA *"Enter Interview Studio $\rightarrow$"*.

### 10.2 Interview Studio Layout
- Split desktop view (50% Question context / 50% Response input).
- Persistent top progress bar showing remaining question count and session timer.
- Floating feedback drawer sliding in from the right or expanding below the question upon submission.

### 10.3 Dashboard Screen Layout
- Top row: 4 KPI summary cards (Total Sessions, Avg Score, Practice Time, Readiness Gauge).
- Middle row: Score progression trend chart (60% width) + Competency Radar Chart (40% width).
- Bottom row: Recent Activity audit table with direct links to full scorecard review.

### 10.4 History Screen Layout
- Filter bar (filter by role or score range).
- Reverse-chronological card list with accordion expansion showing full candidate transcripts, feedback strengths, and model answer outlines.
