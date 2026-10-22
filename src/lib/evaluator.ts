import { AnswerEvaluation, Question } from '@/types/interview';

export async function evaluateAnswer(
  question: Question,
  userAnswer: string
): Promise<AnswerEvaluation> {
  const trimmed = userAnswer.trim();

  // If user provided minimal answer
  if (trimmed.length < 15) {
    return {
      score: 25,
      technicalAccuracyScore: 20,
      communicationScore: 30,
      structureScore: 25,
      strengths: ['Attempted the question.'],
      improvements: [
        'Response is too brief. Provide more detail, concrete examples, and technical context.',
        'Adopt the STAR format (Situation, Task, Action, Result) for comprehensive answers.'
      ],
      suggestedAnswer: question.idealAnswerOutline,
      keyKeywordsFound: [],
      missingKeywords: question.expectedKeywords.slice(0, 4)
    };
  }

  const lowerAnswer = trimmed.toLowerCase();
  
  // Keyword matching
  const keyKeywordsFound: string[] = [];
  const missingKeywords: string[] = [];

  question.expectedKeywords.forEach((kw) => {
    const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const parts = cleanKw.split(' ').filter(Boolean);
    const hasMatch = parts.some((p) => lowerAnswer.includes(p));
    if (hasMatch) {
      keyKeywordsFound.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordRatio = question.expectedKeywords.length > 0 
    ? keyKeywordsFound.length / question.expectedKeywords.length 
    : 0.5;

  // Length and structure evaluation
  const wordCount = trimmed.split(/\s+/).length;
  let lengthFactor = 0.6;
  if (wordCount > 100) lengthFactor = 1.0;
  else if (wordCount > 60) lengthFactor = 0.85;
  else if (wordCount > 30) lengthFactor = 0.7;

  // Structural markers check (e.g. Firstly, Furthermore, For example, In conclusion, Situation, Result)
  const structuralWords = ['first', 'second', 'because', 'for example', 'specifically', 'result', 'therefore', 'situation', 'impact', 'however'];
  const matchedStructureWords = structuralWords.filter((w) => lowerAnswer.includes(w));
  const structureBonus = Math.min(25, matchedStructureWords.length * 6);

  // Calculate scores
  const technicalAccuracyScore = Math.min(100, Math.round(30 + keywordRatio * 55 + (wordCount > 50 ? 15 : 5)));
  const communicationScore = Math.min(100, Math.round(40 + lengthFactor * 35 + Math.min(25, (wordCount / 5))));
  const structureScore = Math.min(100, Math.round(35 + structureBonus + (wordCount > 70 ? 25 : 10)));

  const overallScore = Math.round(
    technicalAccuracyScore * 0.45 + communicationScore * 0.3 + structureScore * 0.25
  );

  // Dynamic feedback synthesis
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (keyKeywordsFound.length >= 3) {
    strengths.push(`Strong domain vocabulary used, incorporating terms like: ${keyKeywordsFound.slice(0, 3).join(', ')}.`);
  } else if (keyKeywordsFound.length > 0) {
    strengths.push(`Captured core ideas such as "${keyKeywordsFound[0]}".`);
  }

  if (wordCount >= 60) {
    strengths.push('Good response depth with sufficient explanation and context.');
  }

  if (matchedStructureWords.length >= 2) {
    strengths.push('Well-organized thought progression with clear transitional phrases.');
  }

  if (strengths.length === 0) {
    strengths.push('Clear and direct tone in your opening premise.');
  }

  // Improvements
  if (missingKeywords.length > 0) {
    improvements.push(`Consider mentioning key concepts: ${missingKeywords.slice(0, 3).join(', ')}.`);
  }

  if (wordCount < 50) {
    improvements.push('Expand your explanation with a specific real-world example or metric from prior projects.');
  }

  if (matchedStructureWords.length < 2) {
    improvements.push('Structure your answer more clearly by breaking it into distinct steps (e.g., Problem, Approach, Outcome).');
  }

  return {
    score: overallScore,
    technicalAccuracyScore,
    communicationScore,
    structureScore,
    strengths,
    improvements,
    suggestedAnswer: question.idealAnswerOutline,
    keyKeywordsFound,
    missingKeywords
  };
}
