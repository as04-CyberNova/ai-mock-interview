import { Question, RoleType } from '@/types/interview';

export const QUESTION_BANK: Question[] = [
  // --- 1. DATA ANALYST ---
  {
    id: 'da-1',
    role: 'data-analyst',
    level: 'Entry Level',
    category: 'Conceptual',
    question: 'How do you handle missing or duplicate values in a raw dataset before conducting an analysis?',
    expectedKeywords: ['null', 'imputation', 'mean/median', 'drop', 'deduplication', 'business context', 'data integrity'],
    idealAnswerOutline: 'Explain that the approach depends on data context: check for patterns in missingness (MCAR, MAR), decide between dropping rows/columns if minimal, or imputing with mean/median/mode or predictive models. For duplicates, verify primary keys and deduplicate while logging changes.',
    hint: 'Think about data cleanliness, imputation vs. dropping, and business impact.'
  },
  {
    id: 'da-2',
    role: 'data-analyst',
    level: 'Mid Level',
    category: 'Problem Solving',
    question: 'Walk me through how you would design an executive dashboard to monitor an e-commerce platform’s key performance metrics.',
    expectedKeywords: ['kpi', 'conversion rate', 'churn', 'aov', 'cac', 'clv', 'visual hierarchy', 'interactivity', 'refresh rate'],
    idealAnswerOutline: 'Start by understanding executive goals: identify top KPIs (GMV, CAC, LTV, Conversion Rate, Cart Abandonment). Choose a clean visual hierarchy with high-level summary cards at the top, trend lines in the middle, and regional or category drill-downs at the bottom.',
    hint: 'Mention target audience, primary KPIs, and drill-down functionality.'
  },
  {
    id: 'da-3',
    role: 'data-analyst',
    level: 'Senior',
    category: 'Scenario',
    question: 'You notice an unexpected 18% drop in product sales week-over-week. How would you systematically diagnose and present the root cause to leadership?',
    expectedKeywords: ['root cause', 'segmentation', 'seasonality', 'funnel analysis', 'tracking/logging bug', 'external factors', 'cohorts'],
    idealAnswerOutline: '1. Rule out data logging/pipeline bugs. 2. Segment by channel, device, geography, and product category. 3. Check marketing campaigns, site uptime, checkout errors. 4. Analyze external factors (holidays, competitor promos). 5. Summarize findings with actionable recommendations.',
    hint: 'Structure your response into triage, segmentation, funnel breakdown, and leadership communication.'
  },

  // --- 2. SQL SPECIALIST ---
  {
    id: 'sql-1',
    role: 'sql',
    level: 'Entry Level',
    category: 'Technical',
    question: 'What is the key difference between WHERE and HAVING clauses in SQL, and when must you use HAVING?',
    expectedKeywords: ['aggregate', 'group by', 'filter', 'row-level', 'before grouping', 'after grouping', 'count/sum'],
    idealAnswerOutline: 'WHERE filters individual rows before any groupings or aggregations are calculated. HAVING filters aggregated records created by the GROUP BY clause. You must use HAVING when filtering by aggregate functions like COUNT(*), AVG(), or SUM().',
    hint: 'Focus on query execution order: filtering rows vs. filtering aggregated groups.'
  },
  {
    id: 'sql-2',
    role: 'sql',
    level: 'Mid Level',
    category: 'Technical',
    question: 'Explain SQL Window Functions. How do ROW_NUMBER(), RANK(), and DENSE_RANK() differ when handling ties?',
    expectedKeywords: ['over', 'partition by', 'order by', 'ties', 'consecutive', 'gap', 'window function'],
    idealAnswerOutline: 'Window functions perform calculations across a set of table rows related to the current row without collapsing them like GROUP BY. For ties: ROW_NUMBER assigns distinct sequential numbers (1,2,3), RANK leaves gaps (1,2,2,4), and DENSE_RANK retains consecutive integers without gaps (1,2,2,3).',
    hint: 'Provide an example like 100, 90, 90, 80 to demonstrate ranking output differences.'
  },
  {
    id: 'sql-3',
    role: 'sql',
    level: 'Senior',
    category: 'Problem Solving',
    question: 'How do you optimize a slow-running SQL query involving multi-million row joins across several transactional tables?',
    expectedKeywords: ['indexes', 'explain plan', 'execution plan', 'selective join', 'partitioning', 'subquery vs join', 'ctes', 'avoid select *'],
    idealAnswerOutline: '1. Inspect the execution plan (EXPLAIN ANALYZE) to spot full table scans and high-cost joins. 2. Verify indexing on foreign keys and WHERE filters. 3. Filter data as early as possible before joining. 4. Avoid SELECT * and unnecessary sorting. 5. Consider table partitioning or indexing strategies.',
    hint: 'Mention execution plans, indexing strategies, join selectivity, and reducing intermediate row counts.'
  },

  // --- 3. PYTHON DEVELOPER ---
  {
    id: 'py-1',
    role: 'python',
    level: 'Entry Level',
    category: 'Technical',
    question: 'Explain the difference between mutable and immutable types in Python, and provide examples of each.',
    expectedKeywords: ['mutable', 'immutable', 'memory address', 'id()', 'list', 'tuple', 'dict', 'string', 'pass-by-assignment'],
    idealAnswerOutline: 'Mutable objects can be modified in-place after creation without changing their memory id (e.g. lists, dicts, sets). Immutable objects cannot be altered once created; any modification creates a new object (e.g. integers, strings, tuples, frozensets).',
    hint: 'Discuss lists vs tuples and what happens when you modify items.'
  },
  {
    id: 'py-2',
    role: 'python',
    level: 'Mid Level',
    category: 'Technical',
    question: 'What are Python generators and the yield keyword? Why are they particularly useful in data processing?',
    expectedKeywords: ['generator', 'yield', 'lazy evaluation', 'memory efficiency', 'iterator', 'streaming', 'large files'],
    idealAnswerOutline: 'A generator function produces a sequence of values lazily on-the-fly using the yield statement instead of returning a complete list in memory all at once. This enables processing gigantic datasets or streaming files without exceeding RAM limits.',
    hint: 'Highlight memory efficiency, lazy evaluation, and the next() protocol.'
  },
  {
    id: 'py-3',
    role: 'python',
    level: 'Senior',
    category: 'Problem Solving',
    question: 'How does the Python Global Interpreter Lock (GIL) affect multithreading, and how would you achieve true parallel execution for CPU-bound tasks?',
    expectedKeywords: ['gil', 'mutex', 'cpu-bound', 'i/o bound', 'multiprocessing', 'concurrency', 'process pool', 'celery/threads'],
    idealAnswerOutline: 'The GIL is a mutex preventing multiple native threads from executing Python bytecodes concurrently to ensure thread-safe memory management. For I/O bound tasks, multithreading or asyncio is great. For CPU-bound tasks, use the `multiprocessing` module, ProcessPoolExecutor, or C-extensions to run separate processes with independent Python interpreters.',
    hint: 'Distinguish between I/O-bound vs CPU-bound tasks and threads vs processes.'
  },

  // --- 4. HR & BEHAVIORAL ---
  {
    id: 'hr-1',
    role: 'hr',
    level: 'Entry Level',
    category: 'Behavioral',
    question: 'Tell me about yourself, your background, and why you are interested in this position.',
    expectedKeywords: ['present', 'past', 'future', 'passion', 'relevant experience', 'company alignment', 'impact'],
    idealAnswerOutline: 'Use the Present-Past-Future framework: Briefly describe current role/studies, highlight 1-2 relevant accomplishments from past experiences, and explain why this specific company and role is the natural next step where you can deliver value.',
    hint: 'Keep it within 2 minutes and focus on relevant skills and enthusiasm.'
  },
  {
    id: 'hr-2',
    role: 'hr',
    level: 'Mid Level',
    category: 'Behavioral',
    question: 'Describe a situation where you had a disagreement with a team member or stakeholder on a project. How did you resolve it?',
    expectedKeywords: ['star method', 'situation', 'task', 'action', 'result', 'empathy', 'active listening', 'data-driven', 'compromise'],
    idealAnswerOutline: 'Employ the STAR framework: Set the Situation & Task. In Action, emphasize active listening, seeking to understand their perspective, relying on objective data/metrics rather than ego, and finding common ground. Conclude with positive Results and team cohesion.',
    hint: 'Focus on constructive communication, empathy, and professional resolution.'
  },
  {
    id: 'hr-3',
    role: 'hr',
    level: 'Senior',
    category: 'Scenario',
    question: 'Tell me about a time a major project failed or missed a critical deadline. What went wrong, and what did you learn from it?',
    expectedKeywords: ['star method', 'accountability', 'post-mortem', 'root cause', 'preventive measures', 'communication', 'growth mindset'],
    idealAnswerOutline: 'Own the outcome without blaming others. Outline what occurred, your proactive steps to mitigate fallout with stakeholders, the root cause identified in the retrospective, and the concrete safeguards/processes you instituted to ensure it never occurred again.',
    hint: 'Show extreme ownership, clear reflection, and lasting systemic improvements.'
  },

  // --- 5. FULL STACK DEVELOPER ---
  {
    id: 'fs-1',
    role: 'fullstack-dev',
    level: 'Entry Level',
    category: 'Technical',
    question: 'What happens from the moment a user types a URL into the browser and presses Enter until the webpage renders?',
    expectedKeywords: ['dns lookup', 'tcp handshake', 'tls/ssl', 'http request', 'dom tree', 'cssom', 'render tree', 'hydration'],
    idealAnswerOutline: '1. DNS lookup resolves the domain IP. 2. TCP 3-way handshake and TLS termination. 3. Browser sends HTTP GET. 4. Server responds with HTML. 5. Browser parses HTML to DOM and CSS to CSSOM, computes Render Tree, executes layout & paint, and hydrates JavaScript.',
    hint: 'Cover DNS, network transport (TCP/TLS), server response, and critical browser rendering path.'
  },
  {
    id: 'fs-2',
    role: 'fullstack-dev',
    level: 'Mid Level',
    category: 'Technical',
    question: 'How do Next.js Server Components (RSC) differ from Client Components, and when should you choose each?',
    expectedKeywords: ['server components', 'client components', 'zero bundle size', 'use client', 'interactivity', 'state', 'hooks', 'seo'],
    idealAnswerOutline: 'Server Components execute exclusively on the server, generating lightweight HTML/streamed payload with zero impact on client JavaScript bundle size. They are ideal for data fetching, backend API access, and static content. Client Components (`use client`) run in the browser and are required for interactivity, browser APIs, useState, and useEffect.',
    hint: 'Mention client bundle size, security of secrets, and interactive hooks vs server data-fetching.'
  },
  {
    id: 'fs-3',
    role: 'fullstack-dev',
    level: 'Senior',
    category: 'Problem Solving',
    question: 'How do you prevent and mitigate common web security vulnerabilities such as XSS, CSRF, and SQL Injection in a full-stack application?',
    expectedKeywords: ['xss', 'csrf', 'sql injection', 'parameterized queries', 'sanitization', 'content security policy', 'samesite cookies', 'jwt/tokens'],
    idealAnswerOutline: '1. SQL Injection: Use ORMs or parameterized prepared statements. 2. XSS: Escape/sanitize user inputs, implement strict Content Security Policy (CSP), avoid dangerouslySetInnerHTML. 3. CSRF: Use SameSite=Strict cookies, anti-CSRF tokens, or header-based authorization tokens (Bearer JWT).',
    hint: 'Structure by each vulnerability: attack vector followed by defence in depth.'
  },

  // --- 6. AI & MACHINE LEARNING ENGINEER ---
  {
    id: 'ai-1',
    role: 'ai-ml-engineer',
    level: 'Entry Level',
    category: 'Conceptual',
    question: 'Explain the Bias-Variance tradeoff in machine learning. How do overfitting and underfitting relate to this concept?',
    expectedKeywords: ['bias', 'variance', 'overfitting', 'underfitting', 'regularization', 'cross-validation', 'generalization'],
    idealAnswerOutline: 'Bias is error introduced by approximating a real-world problem with an overly simplistic model (causing underfitting). Variance is model sensitivity to fluctuations/noise in training data (causing overfitting). The goal is finding the optimal balance minimizing total test error using techniques like cross-validation and regularization (L1/L2).',
    hint: 'High bias = underfitting; high variance = overfitting.'
  },
  {
    id: 'ai-2',
    role: 'ai-ml-engineer',
    level: 'Mid Level',
    category: 'Technical',
    question: 'How does Retrieval-Augmented Generation (RAG) work in modern LLM applications, and what are the key challenges in vector search?',
    expectedKeywords: ['rag', 'embeddings', 'vector database', 'semantic search', 'cosine similarity', 'chunking', 'retrieval', 'hallucination', 'reranking'],
    idealAnswerOutline: 'RAG augments LLM generation by retrieving context from external proprietary data. Documents are chunked, converted into vector embeddings, and stored in a vector DB. At query time, similar chunks are retrieved via vector search (e.g. Cosine Similarity) and injected into the prompt. Challenges include chunking strategy, lost context, latency, and retrieval accuracy (solved via hybrid search & reranking).',
    hint: 'Walk through chunking, vector embeddings, similarity search, and context injection.'
  },
  {
    id: 'ai-3',
    role: 'ai-ml-engineer',
    level: 'Senior',
    category: 'Scenario',
    question: 'How would you architect a production LLM system with low latency, guardrails for hallucinations, and evaluation metrics?',
    expectedKeywords: ['guardrails', 'streaming', 'caching/semantic cache', 'fine-tuning vs rag', 'latency', 'rouge/bleu/ragas', 'monitoring', 'cost optimization'],
    idealAnswerOutline: '1. Latency: Stream responses, implement semantic caching (Redis) for recurring queries, quantization. 2. Guardrails: Input validation (NeMo guardrails), PII filtering, output validation. 3. Evaluation: Automated continuous testing with framework like Ragas (faithfulness, answer relevance) and human-in-the-loop audit. 4. Telemetry and cost tracking.',
    hint: 'Address latency, accuracy guardrails, continuous evals, and cost management.'
  },

  // --- 7. SYSTEM DESIGN & ARCHITECTURE ---
  {
    id: 'sd-1',
    role: 'system-design',
    level: 'Mid Level',
    category: 'Scenario',
    question: 'How would you design a scalable URL shortener like bit.ly capable of handling 100 million new URLs per month?',
    expectedKeywords: ['base62', 'hashing', 'cache', 'redis', 'nosql/rdbms', 'load balancer', 'uuid/auto-increment', 'high availability'],
    idealAnswerOutline: '1. Functional requirements: Shorten URL, redirect to original. 2. Capacity estimations: Write QPS ~40, Read QPS ~400 (10:1 ratio). 3. Encoding: Base62 encoding on unique distributed ID. 4. Storage: NoSQL (e.g. Cassandra or DynamoDB) or relational with index on short_key. 5. Caching: Redis cluster for top 20% hot URLs. 6. Redundancy with multi-region CDN and load balancing.',
    hint: 'Cover capacity estimation, Base62 vs MD5 hashing, Redis caching, and database choice.'
  },
  {
    id: 'sd-2',
    role: 'system-design',
    level: 'Senior',
    category: 'Problem Solving',
    question: 'Design a real-time messaging system like WhatsApp or Slack. How do you handle message delivery guarantees and user presence?',
    expectedKeywords: ['websockets', 'message queue', 'kafka/rabbitmq', 'presence system', 'heartbeat', 'redis', 'cassandra', 'ack', 'offline storage'],
    idealAnswerOutline: '1. Communication: WebSockets for persistent two-way connection, with fallback to long polling. 2. Message Flow: Gateway routes message -> Message Service stores in Cassandra -> Pub/Sub (Kafka/RabbitMQ) delivers to recipient gateway. 3. Delivery guarantees: Client ACK protocol (Sent, Delivered, Read). 4. Presence: Ephemeral Redis key-value with TTL refreshed via client heartbeats. 5. Offline messages queued in DB.',
    hint: 'Discuss WebSockets, gateway connection pools, distributed queues, and heartbeat presence.'
  },

  // --- 8. PRODUCT MANAGER (TECH & AI) ---
  {
    id: 'pm-1',
    role: 'product-manager',
    level: 'Mid Level',
    category: 'Problem Solving',
    question: 'How do you prioritize competing feature requests across engineering, sales, and design when resources are constrained?',
    expectedKeywords: ['rice framework', 'reach', 'impact', 'confidence', 'effort', 'business goals', 'north star metric', 'stakeholder management'],
    idealAnswerOutline: 'Use a structured framework like RICE (Reach, Impact, Confidence, Effort) or Value vs. Complexity. Anchor decisions to company North Star metrics and OKRs. Validate with customer telemetry and feedback, communicate transparently with stakeholders explaining the "why", and propose small iterative MVPs for de-risking.',
    hint: 'Demonstrate analytical frameworks (RICE), metric alignment, and empathetic stakeholder communication.'
  },
  {
    id: 'pm-2',
    role: 'product-manager',
    level: 'Senior',
    category: 'Scenario',
    question: 'You are launching an AI-powered automated code review feature. What KPIs would you define to measure launch success and model adoption?',
    expectedKeywords: ['adoption rate', 'retention', 'nps', 'accuracy/acceptance rate', 'false positives', 'time to merge', 'north star metric'],
    idealAnswerOutline: '1. North Star Metric: Developer hours saved or PR merge velocity. 2. Adoption KPIs: Daily Active Users, % of total PRs using AI review. 3. Quality KPIs: Suggestion acceptance rate, user rejection reasons, false positive rate. 4. Sentiment: CSAT / NPS score. 5. Guardrail metrics: Latency overhead and cost per review.',
    hint: 'Balance adoption, output quality/accuracy, and efficiency impact metrics.'
  },

  // --- 9. DEVOPS & CLOUD ARCHITECT ---
  {
    id: 'devops-1',
    role: 'devops-cloud',
    level: 'Mid Level',
    category: 'Technical',
    question: 'Explain the principles of CI/CD pipelines. How do you ensure zero-downtime deployments in a Kubernetes cluster?',
    expectedKeywords: ['ci/cd', 'docker', 'kubernetes', 'rolling update', 'blue-green', 'canary', 'readiness probe', 'liveness probe'],
    idealAnswerOutline: 'CI automates building, linting, and automated unit testing upon code push. CD automates deploying validated artifacts to environments. For zero-downtime in Kubernetes: use RollingUpdate deployments with maxUnavailable=0, configure accurate readiness and liveness probes so traffic routes only to healthy pods, or deploy via Canary / Blue-Green strategies.',
    hint: 'Focus on automated verification steps, rolling updates, and health probes.'
  },
  {
    id: 'devops-2',
    role: 'devops-cloud',
    level: 'Senior',
    category: 'Problem Solving',
    question: 'How do you design an Infrastructure as Code (IaC) strategy with Terraform that supports multi-region disaster recovery and security compliance?',
    expectedKeywords: ['terraform', 'modules', 'remote state', 's3/dynamodb lock', 'multi-region', 'least privilege', 'compliance', 'drift detection'],
    idealAnswerOutline: '1. Modular IaC: Reusable Terraform modules with parameterized environment configs. 2. State Management: S3 backend with DynamoDB locking, encrypted at rest. 3. Multi-region DR: Automated active-active or active-passive failover with Route 53 health checks. 4. Security: IAM least privilege, pre-commit scanners (tfsec, checkov), CI automated drift detection.',
    hint: 'Cover module structure, state locking, disaster recovery failover, and compliance scanners.'
  },

  // --- 10. CYBERSECURITY ANALYST ---
  {
    id: 'sec-1',
    role: 'cybersecurity',
    level: 'Mid Level',
    category: 'Technical',
    question: 'Explain the Zero Trust security architecture and how it contrasts with perimeter-based (Castle-and-Moat) security models.',
    expectedKeywords: ['zero trust', 'never trust always verify', 'least privilege', 'micro-segmentation', 'mfa', 'perimeter', 'lateral movement'],
    idealAnswerOutline: 'Traditional perimeter security assumes anyone inside the corporate network is trusted. Zero Trust operates under the motto "Never trust, always verify." Every user and device must authenticate, authorize, and be continuously validated before accessing data. Core pillars: Least Privilege access, strong MFA, micro-segmentation to limit lateral movement, and end-to-end encryption.',
    hint: 'Contribute the core mantra "Never trust, always verify" and micro-segmentation.'
  },
  {
    id: 'sec-2',
    role: 'cybersecurity',
    level: 'Senior',
    category: 'Scenario',
    question: 'A critical Zero-Day vulnerability (CVSS 9.8) is announced in an open-source library used by your production API. Walk me through your incident response protocol.',
    expectedKeywords: ['incident response', 'triage', 'sbom', 'containment', 'patch', 'waf rule', 'post-mortem', 'ioc', 'communication'],
    idealAnswerOutline: '1. Triage & Identification: Consult Software Bill of Materials (SBOM) and dependency scans to locate affected services. 2. Containment: Deploy virtual patch via Web Application Firewall (WAF) rule to block exploit payloads. 3. Eradication & Remediation: Patch dependency in staging, run test suite, and roll out to production. 4. Post-incident: Inspect logs for Indicators of Compromise (IoC), notify stakeholders, and conduct retrospective.',
    hint: 'Structure into standard Incident Response phases: Identify, Contain, Eradicate, Recover, Lessons Learned.'
  }
];

export const ROLE_METADATA: Record<RoleType, {
  title: string;
  badge: string;
  description: string;
  color: string;
  skills: string[];
}> = {
  'data-analyst': {
    title: 'Data Analyst',
    badge: 'Analytics & BI',
    description: 'Data storytelling, KPI tracking, dashboard design, cleaning & statistical insights.',
    color: '#06b6d4',
    skills: ['Data Cleaning', 'Dashboarding', 'A/B Testing', 'Root Cause', 'Metrics Design']
  },
  'sql': {
    title: 'SQL Specialist',
    badge: 'Database & Querying',
    description: 'Query optimization, window functions, indexing, CTEs, and schema performance.',
    color: '#38bdf8',
    skills: ['Window Functions', 'Query Optimization', 'Indexes & Plans', 'Aggregations', 'Data Modeling']
  },
  'python': {
    title: 'Python Developer',
    badge: 'Core & Data Engineering',
    description: 'Data structures, OOP, concurrency, generators, and data manipulation libraries.',
    color: '#6366f1',
    skills: ['Data Structures', 'OOP & Design', 'Generators & Iterators', 'GIL & Concurrency', 'Pandas/NumPy']
  },
  'hr': {
    title: 'HR & Behavioral',
    badge: 'Culture & Leadership',
    description: 'STAR technique, stakeholder communication, conflict resolution, and leadership.',
    color: '#8b5cf6',
    skills: ['STAR Method', 'Conflict Resolution', 'Communication Clarity', 'Leadership', 'Emotional Intelligence']
  },
  'fullstack-dev': {
    title: 'Full Stack Engineer',
    badge: 'Web & Distributed Systems',
    description: 'Modern Next.js, React, APIs, browser rendering lifecycle, and application security.',
    color: '#10b981',
    skills: ['Next.js/React', 'Web Security (OWASP)', 'REST/GraphQL', 'Rendering Paths', 'State Management']
  },
  'ai-ml-engineer': {
    title: 'AI & Machine Learning',
    badge: 'LLMs, RAG & Models',
    description: 'RAG pipelines, vector search, embeddings, model evaluation, and ML theory.',
    color: '#ec4899',
    skills: ['RAG Architecture', 'Vector Search', 'Model Evaluation', 'Fine-Tuning', 'ML Fundamentals']
  },
  'system-design': {
    title: 'System Design & Arch',
    badge: 'High Scale & Distributed',
    description: 'Distributed systems, caching, message queues, microservices, and high availability.',
    color: '#f59e0b',
    skills: ['Distributed Systems', 'Caching & Redis', 'Message Queues', 'Database Sharding', 'High Availability']
  },
  'product-manager': {
    title: 'Technical Product Manager',
    badge: 'Strategy & Execution',
    description: 'Feature prioritization frameworks, RICE, North Star metrics, and stakeholder alignment.',
    color: '#14b8a6',
    skills: ['RICE Framework', 'Product Strategy', 'North Star Metrics', 'Roadmapping', 'User Feedback']
  },
  'devops-cloud': {
    title: 'DevOps & Cloud Architect',
    badge: 'CI/CD, K8s & Terraform',
    description: 'Kubernetes zero-downtime deploys, Terraform IaC, multi-region cloud, and pipelines.',
    color: '#3b82f6',
    skills: ['Kubernetes', 'CI/CD Pipelines', 'Terraform IaC', 'Cloud Security', 'Observability']
  },
  'cybersecurity': {
    title: 'Cybersecurity Analyst',
    badge: 'SecOps & Zero Trust',
    description: 'Zero Trust architecture, vulnerability triage, incident response, and defense in depth.',
    color: '#ef4444',
    skills: ['Zero Trust', 'Incident Response', 'Vulnerability Triage', 'Network Security', 'OWASP Top 10']
  }
};
