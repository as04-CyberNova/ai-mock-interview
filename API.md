# API Specification & Integration Contract (API.md)

**Product Name:** PrepAI — AI-Powered Mock Interview Platform  
**Document Version:** 1.0.0  
**Target Milestone:** MVP Launch to V1 Production  
**References:** [PRD.md](file:///d:/new%20project/ai-mock-interview/PRD.md) | [ARCHITECTURE.md](file:///d:/new%20project/ai-mock-interview/ARCHITECTURE.md) | [DATABASE.md](file:///d:/new%20project/ai-mock-interview/DATABASE.md)

---

## 1. API Architecture & General Conventions

### 1.1 Architectural Pattern
PrepAI operates using a hybrid API boundary:
1. **Next.js Serverless Route Handlers (`/api/*`):** Handles computationally intensive, algorithmic, or LLM-backed evaluation tasks requiring private environment variables.
2. **Supabase PostgREST Layer:** Handles CRUD operations directly against PostgreSQL with database-enforced Row-Level Security (RLS).
3. **Browser Native APIs:** Handles Web Speech STT and TTS ephemerally on the client with zero cloud bandwidth overhead.

### 1.2 Global Request & Response Headers
- All serverless endpoints consume and produce JSON:
  - `Content-Type: application/json`
  - `Accept: application/json`
- Standard status codes:
  - `200 OK`: Successful synchronous execution.
  - `400 Bad Request`: Input validation failure or missing required fields.
  - `401 Unauthorized`: Missing or invalid session JWT.
  - `404 Not Found`: Entity (e.g. `questionId`) not found.
  - `429 Too Many Requests`: Rate limit exceeded.
  - `500 Internal Server Error`: Unhandled server/evaluator exception.

### 1.3 Standard Error Format
All errors return a predictable JSON payload:
```json
{
  "success": false,
  "error": "Human-readable explanation of error condition",
  "code": "INVALID_QUESTION_ID"
}
```

---

## 2. Serverless Endpoints (`/api/*`)

### 2.1 Evaluate Candidate Answer
- **Endpoint:** `POST /api/evaluate`
- **Purpose:** Analyzes a candidate's spoken or typed answer against an active question's rubric, computing numerical sub-scores, strengths, improvements, and keyword matches.
- **Authentication:** Optional for trial mode / Anonymous users; Authenticated via Supabase Bearer token if user is signed in.
- **Rate Limit:** 30 requests / minute per IP.

#### Request Payload
```json
{
  "questionId": "da-mid-01",
  "userAnswer": "To diagnose the 15% drop, I would first check tracking pixel health and ETL data pipelines to ensure it's not a telemetry issue. Then I'd segment by browser, device, and traffic acquisition channels."
}
```

#### Request Validation Rules
| Field | Type | Required | Constraints |
|---|---|---|---|
| `questionId` | `string` | **Yes** | Must match an existing question ID in the canonical question bank. |
| `userAnswer` | `string` | **Yes** | Trimmed length must be between 1 and 4,000 characters. |

#### Response Payload (200 OK)
```json
{
  "success": true,
  "evaluation": {
    "score": 88,
    "technicalAccuracyScore": 92,
    "communicationScore": 86,
    "structureScore": 86,
    "strengths": [
      "Immediate verification of data pipeline integrity before jumping to conclusions.",
      "Thorough multi-dimensional funnel segmentation."
    ],
    "improvements": [
      "Discuss sample size and statistical significance of the 15% delta.",
      "Mention testing checkout funnel steps end-to-end."
    ],
    "suggestedAnswer": "A top candidate answer establishes three phases: 1) Data Integrity & Anomaly Check, 2) Funnel Segmentation (device, geo, campaign), and 3) Qualitative Context (recent code deploys, checkout bugs).",
    "keyKeywordsFound": [
      "tracking pixel",
      "data pipeline",
      "segment"
    ],
    "missingKeywords": [
      "statistical significance",
      "anomaly detection"
    ]
  }
}
```

#### Error Responses
- `400 Bad Request`: `{"success": false, "error": "Missing questionId or userAnswer"}`
- `404 Not Found`: `{"success": false, "error": "Question not found"}`
- `500 Internal Server Error`: `{"success": false, "error": "Evaluator failed to parse response"}`

---

## 3. Database PostgREST & Auth Contracts (Supabase API)

The client communicates with Supabase via `@supabase/supabase-js` using standard JWT authorization headers:
`Authorization: Bearer <SUPABASE_JWT>`

### 3.1 Fetch User Sessions (Dashboard & History)
- **Operation:** `supabase.from('interview_sessions').select('*')`
- **Filters Applied:**
  - `user_id = auth.uid()` (Auto-enforced by RLS)
  - `.order('created_at', { ascending: false })`
- **Pagination:**
  - `.range(page * 10, (page + 1) * 10 - 1)` for history views.

### 3.2 Save Completed Interview Session
- **Operation:** `supabase.from('interview_sessions').insert(payload)`
- **Payload Shape:**
```json
{
  "user_id": "00000000-0000-0000-0000-000000000000",
  "role": "data-analyst",
  "level": "Mid Level",
  "mode": "voice",
  "overall_score": 85,
  "technical_accuracy_score": 88,
  "communication_score": 82,
  "structure_score": 85,
  "summary_feedback": "Strong structured approach to metrics; continue practicing brevity.",
  "session_data": [ ... ]
}
```

### 3.3 Delete Session
- **Operation:** `supabase.from('interview_sessions').delete().eq('id', sessionId)`
- **RLS Guard:** Must match `auth.uid() = user_id`.

---

## 4. External Integrations & Browser APIs

### 4.1 Web Speech API (Client-Side)
- **SpeechRecognition (`window.SpeechRecognition || window.webkitSpeechRecognition`):**
  - **Purpose:** Converts candidate vocal answers to text streams in real-time.
  - **Config:**
    - `continuous: true`
    - `interimResults: true`
    - `lang: 'en-US'`
  - **Error Trapping:**
    - `'not-allowed'`: Permission denied $\rightarrow$ display polite mode switch prompt.
    - `'no-speech'`: Resume listening after 5 seconds idle.
- **SpeechSynthesis (`window.speechSynthesis`):**
  - **Purpose:** Reads question prompts aloud with human-like cadence.
  - **Config:** Pitch: 1.0, Rate: 1.0.

### 4.2 LLM Gateway Integration (Optional Server-Side Engine)
When configured with `AI_EVAL_API_KEY`:
- **Provider:** OpenAI (`https://api.openai.com/v1/chat/completions`) or Google Gemini (`https://generativelanguage.googleapis.com/v1beta/models/...`).
- **Protocol:** Server-to-server TLS HTTP POST with timeout deadline: `3500ms`.
- **System Prompt Specification:** Instructs LLM to return strict JSON matching `AnswerEvaluation` schema, enforcing rubric consistency.

---

## 5. Webhooks & Event Handlers

- **Auth Lifecycle Trigger:** Supabase database webhook triggers internal function `public.handle_new_user()` upon every successful user registration to create profile records automatically.
- **Zero Inbound 3rd-Party Webhooks (MVP):** No external payment or billing webhooks are required for MVP, minimizing security surface area.

---

## 6. Rate Limiting & Throttling

To prevent resource exhaustion and abuse of evaluation routes:
1. **Client Throttling:** The "Submit Answer" button is disabled immediately upon click and displays a loading state until the response returns or timeouts.
2. **Server Throttling (`/api/evaluate`):**
   - Maximum 30 evaluation requests per minute per IP address.
   - Payloads exceeding 4,000 characters are rejected with `413 Payload Too Large` to prevent token stuffing.

---

## 7. Required Environment Variables

| Variable Name | Environment | Privacy | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Public | Supabase project URL endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Public | Supabase client anon key for RLS queries |
| `AI_EVAL_API_KEY` | Server-Only | **Secret** | API key for LLM evaluation provider (OpenAI / Gemini) |
| `NEXT_PUBLIC_APP_URL` | Client + Server | Public | Base deployment URL (e.g. `http://localhost:3000`) |

---

## 8. Data Privacy & Failure Handling

1. **Secrets Isolation:** No server-side secrets (such as `AI_EVAL_API_KEY` or Supabase Service Role Key) are ever exposed or accessible to client bundles.
2. **Graceful Degradation:** If `/api/evaluate` encounters a network failure or 500 error, the client catches the exception and runs the local heuristic evaluator (`evaluator.ts`) directly in the candidate's browser, preventing session abandonment.
3. **Audio Discard:** Raw microphone audio streams are processed in transient browser memory; no audio buffers are stored, transmitted, or logged.
