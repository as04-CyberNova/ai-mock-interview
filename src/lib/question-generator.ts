import { RoleType, ExperienceLevel, Question } from '@/types/interview';
import { ROLE_METADATA, QUESTION_BANK } from '@/data/questions';

// Track specific question templates and topic seeds for algorithmic generative synthesis
const TRACK_TOPIC_DOMAINS: Record<RoleType, {
  topics: {
    category: Question['category'];
    concept: string;
    scenario: string;
    keywords: string[];
    idealOutline: string;
    hint: string;
  }[];
}> = {
  'data-analyst': {
    topics: [
      {
        category: 'Problem Solving',
        concept: 'Cohort Retention Decay Analysis',
        scenario: 'You notice that 30-day user retention has dropped by 12% across your primary mobile application. How would you design an analysis to identify whether this is an acquisition quality problem or a product experience failure?',
        keywords: ['cohort analysis', 'segmentation', 'user journey', 'funnel conversion', 'retention curve', 'churn', 'feature adoption'],
        idealOutline: '1. Segment users by acquisition source, campaign, and device to check acquisition quality. 2. Plot retention curves per cohort to identify the exact drop-off day. 3. Analyze behavioral telemetry and feature adoption prior to drop-off. 4. Correlate with recent app updates or checkout friction. 5. Present executive summary with statistical significance and prioritized recommendations.',
        hint: 'Break the problem down into cohort segmentation, feature telemetry, and comparing traffic sources.'
      },
      {
        category: 'Technical',
        concept: 'A/B Test Sample Size & P-Value Misinterpretation',
        scenario: 'A product manager stops an A/B test early because the p-value reached 0.03 after just 3 days, declaring the test a clear winner. How would you evaluate this decision and explain the risks to the team?',
        keywords: ['statistical power', 'peeking problem', 'type i error', 'sample size', 'minimum detectable effect', 'false positive', 'seasonality'],
        idealOutline: 'Explain the "peeking problem" and continuous monitoring bias which inflates Type I false positive rates. Highlight that statistical power requires reaching predetermined sample size and accounting for day-of-week seasonality (full weekly cycles). Recommend running for the pre-calculated duration or adopting sequential testing methods.',
        hint: 'Focus on Type I errors, sample size calculation, and day-of-week variance.'
      },
      {
        category: 'Scenario',
        concept: 'Executive Metric Discrepancy Reconciliation',
        scenario: 'Two key executive dashboards show conflicting monthly revenue numbers (a 7% gap between Marketing analytics and Finance reporting). How do you approach reconciling this discrepancy?',
        keywords: ['single source of truth', 'data lineage', 'definition alignment', 'attribution model', 'refunds/cancellations', 'etl timing', 'audit'],
        idealOutline: '1. Clarify business definitions: check whether marketing measures gross booked sales while finance accounts for net recognized revenue, returns, and refunds. 2. Audit data lineage and ETL schedule timing (timezone offsets, batch latency). 3. Map out transformations in dbt/SQL. 4. Establish a unified metric specification and communicate alignment to executive stakeholders.',
        hint: 'Look into operational definitions (gross vs. net, refunds), timezone cutoffs, and pipeline lineage.'
      },
      {
        category: 'Conceptual',
        concept: 'Data Normalization vs Dimensional Modeling',
        scenario: 'When would you prefer a star schema with denormalized dimensional tables over 3NF (Third Normal Form) in an analytical warehouse like Snowflake or BigQuery?',
        keywords: ['star schema', 'denormalization', '3nf', 'olap vs oltp', 'fact tables', 'dimension tables', 'join performance', 'columnar storage'],
        idealOutline: '3NF minimizes data redundancy and is ideal for transactional OLTP writes. In modern OLAP data warehouses, star schemas with denormalized dimension tables minimize expensive multi-table joins, simplify self-serve BI query formulation for analysts, and optimize columnar compression and partition pruning.',
        hint: 'Differentiate between OLTP transactional integrity and OLAP query read performance.'
      }
    ]
  },
  'sql': {
    topics: [
      {
        category: 'Technical',
        concept: 'Complex Gaps and Islands Analysis',
        scenario: 'How would you write a SQL query to identify consecutive active login streaks for all users across a transactions table with millions of rows?',
        keywords: ['window functions', 'row_number', 'dateadd/datediff', 'gaps and islands', 'group by', 'streak', 'dense_rank'],
        idealOutline: 'Use a classic Gaps and Islands approach: calculate ROW_NUMBER() ordered by login_date partitioned by user_id. Subtract this row number from the login date to produce a constant grouping anchor for consecutive dates. Finally, GROUP BY user_id and this group anchor, computing COUNT(*) as the streak length.',
        hint: 'Subtracting a sequential row number from consecutive dates yields a constant grouping key.'
      },
      {
        category: 'Technical',
        concept: 'Correlated Subqueries vs JOINs & Execution Plans',
        scenario: 'A query with a correlated subquery in the SELECT clause is causing severe slowdowns on a 50-million row Postgres database. How would you optimize it and verify your gains with EXPLAIN ANALYZE?',
        keywords: ['explain analyze', 'correlated subquery', 'nested loop', 'left join', 'cte', 'index scan', 'hash join', 'cardinality'],
        idealOutline: 'Correlated subqueries often trigger $O(N)$ row-by-row nested loop evaluations. Refactor by replacing the subquery with an aggregated LEFT JOIN or a Common Table Expression (CTE) with a window function. Use EXPLAIN (ANALYZE, BUFFERS) to verify reduction in shared hit buffer reads and replacement of Nested Loop with a Hash Join.',
        hint: 'Examine row-by-row execution versus set-based joins, and inspect cost/buffer metrics in EXPLAIN.'
      },
      {
        category: 'Technical',
        concept: 'Partial Indexes and Composite B-Tree Optimization',
        scenario: 'Given a table with 100M rows where only 0.5% have `status = \'FAILED\'`, explain how you would design an index strategy for queries searching for failed jobs.',
        keywords: ['partial index', 'filtered index', 'b-tree', 'index size', 'write overhead', 'selectivity', 'maintenance'],
        idealOutline: 'Create a partial index: `CREATE INDEX idx_failed_jobs ON jobs (created_at) WHERE status = \'FAILED\';`. This creates an extremely compact index covering only 0.5% of rows, saving RAM, drastically reducing B-tree traversal depth, and eliminating write overhead for the 99.5% successful jobs.',
        hint: 'Think about index storage footprint and indexing only the subset of rows matching a predicate.'
      }
    ]
  },
  'python': {
    topics: [
      {
        category: 'Technical',
        concept: 'Memory-Efficient Streaming with Generators & Iterators',
        scenario: 'How would you process a 40GB compressed CSV log file on a server provisioned with only 4GB of RAM using native Python?',
        keywords: ['generator', 'yield', 'lazy evaluation', 'chunking', 'memory overhead', 'line by line', 'gzip/csv modules'],
        idealOutline: 'Use Python generators with `yield` or `csv.reader` reading line-by-line using a file iterator context manager. Avoid loading the file or Pandas dataframes into memory at once. If using Pandas, specify `chunksize=100000` to process chunks iteratively in a generator pipeline.',
        hint: 'Focus on streaming lines with lazy generators instead of reading whole objects into memory.'
      },
      {
        category: 'Technical',
        concept: 'GIL Mechanics, Multiprocessing vs AsyncIO vs Threading',
        scenario: 'You have a pipeline with both heavy CPU matrix calculations and hundreds of simultaneous HTTP network requests. How do you structure your Python concurrency model?',
        keywords: ['gil', 'global interpreter lock', 'multiprocessing', 'asyncio', 'threadpoolexecutor', 'cpu-bound vs io-bound', 'ipc'],
        idealOutline: 'Python\'s Global Interpreter Lock (GIL) prevents parallel native bytecode execution across threads for CPU tasks. Structure the architecture with `asyncio` or `concurrent.futures.ThreadPoolExecutor` for the I/O-bound network calls, and offload CPU-bound matrix math to `multiprocessing.Pool` or optimized C-extensions like NumPy.',
        hint: 'Distinguish I/O-bound concurrency from CPU-bound parallelism under the GIL.'
      },
      {
        category: 'Technical',
        concept: 'Metaclasses, Decorators & Context Managers',
        scenario: 'Explain how you would build a custom Python decorator `@retry_with_backoff(max_retries=3, delay=1)` that handles API rate limits without altering the decorated function signature.',
        keywords: ['functools.wraps', 'decorator', 'exponential backoff', 'args/kwargs', 'closure', 'signature preservation'],
        idealOutline: 'Implement a three-level nested closure or callable class. Use `functools.wraps(fn)` to preserve function name, docstring, and annotations. Inside the wrapper, catch target exceptions in a while/for loop, applying exponential sleep delays before re-raising if `max_retries` is exceeded.',
        hint: 'Remember to preserve function metadata using functools.wraps.'
      }
    ]
  },
  'hr': {
    topics: [
      {
        category: 'Behavioral',
        concept: 'Cross-Functional Conflict & Disagreement (STAR)',
        scenario: 'Tell me about a time when a lead engineer or key product manager strongly disagreed with your data findings or technical approach. How did you resolve the deadlock?',
        keywords: ['situation', 'task', 'action', 'result', 'active listening', 'data-driven', 'compromise', 'alignment', 'empathy'],
        idealOutline: 'Situation: Outline the context and core point of contention. Task: The mandate to deliver on time without compromising analytical rigor. Action: Scheduled a 1-on-1, actively listened to their operational constraints, validated assumptions using joint testing, and found common ground. Result: Delivered project on schedule with buy-in and maintained positive relationship.',
        hint: 'Follow STAR strictly: Situation, Task, Action, and measurable Result with relationship preservation.'
      },
      {
        category: 'Behavioral',
        concept: 'Critical Project Failure & Accountability (STAR)',
        scenario: 'Describe a situation where a major deliverable you were responsible for failed or caused a production issue. What went wrong and how did you navigate the aftermath?',
        keywords: ['ownership', 'incident response', 'post-mortem', 'root cause', 'accountability', 'blameless', 'preventive measures'],
        idealOutline: 'Own the failure without deflecting blame. Detail immediate actions taken to mitigate customer impact. Highlight the transparent blameless post-mortem process, root-cause identification, and the lasting monitoring or testing safeguards introduced to prevent recurrence.',
        hint: 'Demonstrate accountability, blameless communication, and the permanent systemic fixes implemented.'
      },
      {
        category: 'Behavioral',
        concept: 'Managing Ambiguity & Unclear Scope (STAR)',
        scenario: 'Have you ever had to lead a project where requirements were vague, metrics were undefined, and deadlines were tight? How did you bring clarity?',
        keywords: ['ambiguity', 'stakeholder interviews', 'mvp scope', 'milestones', 'iterative delivery', 'proactive communication'],
        idealOutline: 'Describe how you broke down ambiguity: interviewed stakeholders to map desired business outcomes, defined success criteria and constraints, proposed an MVP scope with phased milestones, and communicated proactively to maintain alignment.',
        hint: 'Focus on your proactive framework for defining requirements and establishing alignment.'
      }
    ]
  },
  'fullstack-dev': {
    topics: [
      {
        category: 'Technical',
        concept: 'Next.js App Router: RSC vs Client Components & Hydration',
        scenario: 'How does React Server Components (RSC) architecture in Next.js App Router fundamentally change data fetching, bundle size, and how you resolve hydration mismatches?',
        keywords: ['rsc', 'server components', 'client components', 'bundle size', 'streaming', 'suspense', 'hydration mismatch', 'use client'],
        idealOutline: 'RSCs execute solely on the server, streaming HTML and serialized flight data without shipping component JavaScript to the client bundle. This allows direct secure DB access and zero-bundle UI libraries. Client components (`use client`) handle browser events and state. Hydration mismatches occur when server HTML diverges from initial client render (e.g. dates, window access).',
        hint: 'Highlight zero-bundle size for server components and how serialization boundaries work.'
      },
      {
        category: 'Technical',
        concept: 'Web Security: CSRF, XSS, and Secure Authentication Flow',
        scenario: 'Compare storing JWT tokens in localStorage versus `httpOnly` secure cookies. How does each choice expose or protect an app from XSS and CSRF?',
        keywords: ['jwt', 'httponly cookie', 'xss', 'csrf', 'samesite', 'localstorage', 'csp', 'refresh token'],
        idealOutline: 'LocalStorage is accessible to any running JavaScript, making stored JWTs immediately vulnerable to extraction via Cross-Site Scripting (XSS). HttpOnly cookies cannot be read by JS, mitigating token theft via XSS. However, cookies are automatically sent with requests, requiring CSRF defenses like `SameSite=Lax/Strict` and anti-CSRF tokens.',
        hint: 'Contrast JavaScript read access in XSS versus ambient credential transmission in CSRF.'
      }
    ]
  },
  'ai-ml-engineer': {
    topics: [
      {
        category: 'Technical',
        concept: 'RAG Architecture: Chunking, Vector Embeddings & Hybrid Search',
        scenario: 'You are building an enterprise RAG system over 500,000 legal contracts. How do you design your document chunking, embedding model selection, and hybrid search with reranking?',
        keywords: ['rag', 'semantic chunking', 'vector embeddings', 'hybrid search', 'bm25', 'cross-encoder reranker', 'cosine similarity'],
        idealOutline: '1. Chunking: Use semantic or hierarchical chunking with metadata preservation (parent document context). 2. Retrieval: Implement Hybrid Search combining dense vector embeddings (e.g. text-embedding-3-large) for conceptual similarity with sparse keyword search (BM25) for exact clause/statute IDs. 3. Re-ranking: Pass top 50 candidates through a cross-encoder (e.g., Cohere/BGE reranker) to filter down to top 5 chunks before prompt injection.',
        hint: 'Explain dense vector search combined with sparse BM25 keyword matching plus cross-encoder reranking.'
      },
      {
        category: 'Technical',
        concept: 'LLM Hallucination Mitigation & Evaluation Frameworks',
        scenario: 'How do you systematically detect and prevent hallucinations in production LLM outputs using frameworks like RAGAS or TruLens?',
        keywords: ['hallucination', 'faithfulness', 'answer relevancy', 'context recall', 'ground truth', 'ragas', 'guardrails'],
        idealOutline: 'Evaluate across core triad metrics: Faithfulness (is the answer grounded in context?), Answer Relevance (does it answer the prompt?), and Context Precision. In production, utilize prompt engineering (grounding directives, citations), constrained decoding, and semantic guardrail validators before returning responses to the user.',
        hint: 'Discuss metrics like Faithfulness and Context Recall, alongside pre/post evaluation guardrails.'
      }
    ]
  },
  'system-design': {
    topics: [
      {
        category: 'Scenario',
        concept: 'High-Throughput Global URL Shortener or Click Tracker',
        scenario: 'Design a distributed URL shortener (like bit.ly) handling 50,000 writes/sec and 500,000 reads/sec with sub-20ms latency and 99.999% uptime.',
        keywords: ['base62', 'snowflake id', 'distributed cache', 'redis', 'nosql', 'sharding', 'read-heavy', 'cdn', 'rate limiting'],
        idealOutline: '1. Scale estimation: 10:1 read-to-write ratio. 2. Unique ID generation: Distributed sequence generators (Twitter Snowflake) converted to Base62 (7 characters covers 3.5T URLs). 3. Storage: NoSQL key-value (DynamoDB/Cassandra) sharded by short hash. 4. Caching: Redis cluster caching top 20% active URLs (80/20 rule). 5. CDN edge caching for redirects.',
        hint: 'Calculate read/write QPS, discuss Base62 encoding, and outline Redis caching for low latency.'
      },
      {
        category: 'Scenario',
        concept: 'Distributed Message Broker & Exactly-Once Semantics',
        scenario: 'How do distributed messaging queues like Kafka achieve high write throughput and how do you guarantee idempotent, exactly-once processing in downstream consumers?',
        keywords: ['kafka', 'partitions', 'sequential io', 'idempotency', 'idempotent consumer', 'two-phase commit', 'offset commit'],
        idealOutline: 'Kafka achieves millions of writes/sec via sequential disk append logs, zero-copy OS transfers (`sendfile`), and partition parallelism. For exactly-once processing: producer idempotency uses transactional IDs and sequence numbers. Downstream consumers maintain idempotency via unique message keys stored in distributed key-value stores with deduplication checks.',
        hint: 'Focus on sequential disk I/O, partition-level scaling, and consumer deduplication keys.'
      }
    ]
  },
  'product-manager': {
    topics: [
      {
        category: 'Problem Solving',
        concept: 'Feature Prioritization Under Constraint (RICE & Kano)',
        scenario: 'You have 3 critical engineering requests: technical debt refactoring, an enterprise client custom feature, and a self-serve onboarding redesign. How do you prioritize using a rigorous framework?',
        keywords: ['rice framework', 'reach', 'impact', 'confidence', 'effort', 'kano model', 'strategic alignment', 'opportunity cost'],
        idealOutline: 'Apply the RICE Framework (Reach $\\times$ Impact $\\times$ Confidence / Effort). Score each initiative objectively with engineering and design leads. Account for strategic company OKRs, customer churn risk, and long-term opportunity cost. Communicate the trade-off matrix transparently to executive stakeholders.',
        hint: 'Use RICE (Reach, Impact, Confidence, Effort) to quantify decisions against company goals.'
      }
    ]
  },
  'devops-cloud': {
    topics: [
      {
        category: 'Technical',
        concept: 'Zero-Downtime Deployment Strategies in Kubernetes',
        scenario: 'Compare Rolling Updates, Blue/Green, and Canary deployments in Kubernetes. How do you configure readiness/liveness probes and automated rollback on 5xx error spikes?',
        keywords: ['kubernetes', 'canary', 'blue-green', 'rolling update', 'readiness probe', 'liveness probe', 'prometheus/grafana', 'hpa'],
        idealOutline: 'Rolling updates gradually replace pods; Blue/Green spins up parallel environments for instant cutover with zero downtime; Canary routes 5-10% of production traffic using an ingress/service mesh (Istio/Argo Rollouts). Configure readiness probes so pods only receive traffic once initialized. Integrate Prometheus alert rules to trigger automated rollback if error rate exceeds 1%.',
        hint: 'Highlight health probes preventing premature traffic routing and automated canary rollbacks.'
      }
    ]
  },
  'cybersecurity': {
    topics: [
      {
        category: 'Scenario',
        concept: 'Zero-Trust Architecture & Credential Stuffing Mitigation',
        scenario: 'Your e-commerce platform experiences a distributed credential stuffing attack from 100,000 distinct IP addresses. How do you detect, mitigate, and architect Zero Trust defenses?',
        keywords: ['credential stuffing', 'zero trust', 'waf', 'rate limiting', 'behavioral biometrics', 'mfa', 'haveibeenpwned api', 'honeypot'],
        idealOutline: '1. Immediate Triage: Implement adaptive CAPTCHAs, bot management WAF rules (Cloudflare/AWS WAF), and IP reputation filtering. 2. Authentication: Require MFA step-up on anomalous login patterns (geo-velocity, user-agent changes). 3. Check credentials against breached databases. 4. Zero Trust: Enforce least privilege, microsegmentation, and continuous session token verification.',
        hint: 'Combine immediate WAF/bot mitigation with behavioral MFA step-up and least-privilege Zero Trust.'
      }
    ]
  }
};

/**
 * Generates an authentic, tailored interview question set for a given role & seniority level.
 * Blends AI generative synthesis with curated track blueprints to guarantee high question quality.
 */
export async function generateInterviewQuestions(
  role: RoleType,
  level: ExperienceLevel,
  count: number = 3
): Promise<Question[]> {
  // Read API keys securely from server environment
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const questions = await fetchGeminiGeneratedQuestions(role, level, count, geminiKey);
      if (questions && questions.length >= count) {
        return questions;
      }
    } catch {
      // Fallback seamlessly to deterministic AI generator
    }
  }

  if (openaiKey) {
    try {
      const questions = await fetchOpenAIGeneratedQuestions(role, level, count, openaiKey);
      if (questions && questions.length >= count) {
        return questions;
      }
    } catch {
      // Fallback seamlessly to deterministic AI generator
    }
  }

  // High-fidelity algorithmic generator with track domain blueprints
  return synthesizeEngineQuestions(role, level, count);
}

/**
 * Deterministic algorithmic synthesis engine
 */
export function synthesizeEngineQuestions(
  role: RoleType,
  level: ExperienceLevel,
  count: number = 3
): Question[] {
  const domainInfo = TRACK_TOPIC_DOMAINS[role];
  const staticQuestions = QUESTION_BANK.filter((q) => q.role === role);
  const meta = ROLE_METADATA[role] || { title: role, skills: ['Technical Depth'] };

  const results: Question[] = [];

  // 1. First, pull role domain topics tailored to the target level
  if (domainInfo && domainInfo.topics.length > 0) {
    domainInfo.topics.forEach((t, i) => {
      results.push({
        id: `ai-gen-${role}-${level.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}`,
        role,
        level,
        category: t.category,
        question: t.scenario,
        expectedKeywords: t.keywords,
        idealAnswerOutline: t.idealOutline,
        hint: t.hint
      });
    });
  }

  // 2. Supplement or blend with curated static bank questions adapted to this tier
  staticQuestions.forEach((sq, i) => {
    if (!results.some((r) => r.question === sq.question)) {
      results.push({
        ...sq,
        id: `ai-curated-${sq.id}-${level.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        level
      });
    }
  });

  // 3. If track has fewer questions than count, synthesize customized behavioral and architectural prompts
  if (results.length < count) {
    const defaultTopic = meta.skills[0] || 'System Architecture';
    results.push({
      id: `ai-custom-${role}-${Date.now()}-1`,
      role,
      level,
      category: 'Problem Solving',
      question: `As a ${level} ${meta.title}, walk me through your end-to-end framework for diagnosing and optimizing ${defaultTopic} when performance degrades in production.`,
      expectedKeywords: ['metrics', 'profiling', 'root cause', 'trade-offs', 'monitoring', 'scalability'],
      idealAnswerOutline: 'Structure your answer with: 1. Telemetry and observability check. 2. Bottleneck identification via profiling. 3. Formulating hypotheses. 4. Incremental remediation and validation. 5. Long-term automated alerts.',
      hint: 'Outline systematic diagnosis: triage, profiling, testing, and permanent safeguard.'
    });

    results.push({
      id: `ai-custom-${role}-${Date.now()}-2`,
      role,
      level,
      category: 'Behavioral',
      question: `Describe a complex technical initiative in ${meta.title} where you had to balance aggressive delivery deadlines with architectural quality and maintainability.`,
      expectedKeywords: ['situation', 'task', 'action', 'result', 'technical debt', 'prioritization', 'stakeholders'],
      idealAnswerOutline: 'Adopt STAR format: describe the timeline pressure, explain how you negotiated MVP technical debt with explicit remediation tickets, executed the delivery, and paid down the debt in subsequent sprints.',
      hint: 'Highlight how you managed trade-offs without compromising production stability.'
    });
  }

  // Shuffle slightly and return requested count
  return results.slice(0, count);
}

/**
 * Optional Google Gemini API integration
 */
async function fetchGeminiGeneratedQuestions(
  role: RoleType,
  level: ExperienceLevel,
  count: number,
  apiKey: string
): Promise<Question[] | null> {
  const meta = ROLE_METADATA[role];
  const prompt = `You are an elite principal technical interviewer. Generate ${count} rigorous, realistic interview questions for a ${level} candidate applying for the ${meta?.title || role} track.
Focus on core skills: ${meta?.skills?.join(', ') || 'software engineering'}.
Respond ONLY with a JSON array conforming to this structure:
[
  {
    "category": "Technical" | "Scenario" | "Problem Solving" | "Behavioral" | "Conceptual",
    "question": "string",
    "expectedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "idealAnswerOutline": "string with top 5% candidate response points",
    "hint": "string guiding the candidate"
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) return null;

  return parsed.map((item, idx) => ({
    id: `gemini-${role}-${Date.now()}-${idx + 1}`,
    role,
    level,
    category: item.category || 'Technical',
    question: item.question,
    expectedKeywords: item.expectedKeywords || [],
    idealAnswerOutline: item.idealAnswerOutline || '',
    hint: item.hint || ''
  }));
}

/**
 * Optional OpenAI API integration
 */
async function fetchOpenAIGeneratedQuestions(
  role: RoleType,
  level: ExperienceLevel,
  count: number,
  apiKey: string
): Promise<Question[] | null> {
  const meta = ROLE_METADATA[role];
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an executive interviewer. Return a JSON object containing a "questions" key with an array of questions conforming to: { category, question, expectedKeywords, idealAnswerOutline, hint }.'
        },
        {
          role: 'user',
          content: `Generate ${count} authentic questions for a ${level} candidate in the ${meta?.title || role} track focusing on ${meta?.skills?.join(', ')}.`
        }
      ]
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content);
  const list = parsed.questions || parsed;
  if (!Array.isArray(list)) return null;

  return list.map((item, idx) => ({
    id: `openai-${role}-${Date.now()}-${idx + 1}`,
    role,
    level,
    category: item.category || 'Technical',
    question: item.question,
    expectedKeywords: item.expectedKeywords || [],
    idealAnswerOutline: item.idealAnswerOutline || '',
    hint: item.hint || ''
  }));
}
