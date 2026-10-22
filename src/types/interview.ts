export type RoleType = 
  | 'data-analyst' 
  | 'sql' 
  | 'python' 
  | 'hr' 
  | 'fullstack-dev' 
  | 'ai-ml-engineer' 
  | 'system-design' 
  | 'product-manager' 
  | 'devops-cloud' 
  | 'cybersecurity';

export type ExperienceLevel = 
  | 'Intern / Student' 
  | 'Entry Level' 
  | 'Mid Level' 
  | 'Senior' 
  | 'Staff / Principal' 
  | 'Engineering Manager';

export type SimulationMode = 
  | 'voice' 
  | 'text' 
  | 'rapid-fire' 
  | 'star-deep-dive' 
  | 'pressure-test';

export interface Question {
  id: string;
  role: RoleType;
  level: ExperienceLevel;
  question: string;
  category: 'Technical' | 'Conceptual' | 'Behavioral' | 'Scenario' | 'Problem Solving';
  expectedKeywords: string[];
  idealAnswerOutline: string;
  hint?: string;
}

export interface AnswerEvaluation {
  score: number; // 0 - 100
  technicalAccuracyScore: number; // 0 - 100
  communicationScore: number; // 0 - 100
  structureScore: number; // 0 - 100 (STAR method, logical clarity)
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  keyKeywordsFound: string[];
  missingKeywords: string[];
}

export interface InterviewSessionItem {
  questionId: string;
  questionText: string;
  userAnswer: string;
  evaluation?: AnswerEvaluation;
  timeSpentSeconds: number;
}

export interface InterviewSession {
  id: string;
  userId?: string;
  role: RoleType;
  level: ExperienceLevel;
  mode: SimulationMode;
  startedAt: string;
  completedAt?: string;
  items: InterviewSessionItem[];
  overallScore?: number;
  technicalAccuracyAverage?: number;
  communicationAverage?: number;
  structureAverage?: number;
  summaryFeedback?: string;
}

export interface UserStats {
  totalInterviews: number;
  averageScore: number;
  hoursPracticed: number;
  readinessScore: number; // 0 - 100
  roleBreakdown: {
    role: RoleType;
    count: number;
    avgScore: number;
  }[];
  skillScores: {
    skill: string;
    score: number;
  }[];
  recentActivity: {
    date: string;
    score: number;
    role: string;
  }[];
}
