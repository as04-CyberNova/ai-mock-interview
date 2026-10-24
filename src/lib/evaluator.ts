import { AnswerEvaluation, Question } from '@/types/interview';

/**
 * Gemini model used for scoring. gemini-1.5-flash was shut down by Google in
 * September 2025, so the default is now gemini-2.5-flash. Override with the
 * GEMINI_MODEL environment variable when the model is retired again.
 */
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Evaluates candidate responses using either Google Gemini AI (when GEMINI_API_KEY is configured)
 * or the built-in deterministic rubric evaluator as a fallback.
 */
export async function evaluateAnswer(
  question: Question,
  userAnswer: string
): Promise<AnswerEvaluation> {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const aiEval = await evaluateWithGemini(question, userAnswer, geminiKey);
      if (aiEval) {
        return aiEval;
      }
    } catch (error) {
      // Fall back to the deterministic evaluator, but log why so a retired
      // model or bad key does not go unnoticed.
      console.error('[evaluator] Gemini evaluation failed, using heuristic fallback:', error);
    }
  }

  return evaluateWithRubricHeuristics(question, userAnswer);
}

/**
 * Calls Google AI Studio Gemini API (see GEMINI_MODEL) for deep semantic analysis
 */
async function evaluateWithGemini(
  question: Question,
  userAnswer: string,
  apiKey: string
): Promise<AnswerEvaluation | null> {
  const prompt = `You are a principal technical interviewer evaluating a candidate's response for a ${question.level} ${question.role} role.

Question: "${question.question}"
Category: ${question.category}
Expected Keywords/Concepts: ${question.expectedKeywords.join(', ')}
Ideal Reference Answer: "${question.idealAnswerOutline}"

Candidate Answer:
"${userAnswer}"

Evaluate the answer rigorously. Return ONLY a valid JSON object matching this schema:
{
  "score": number between 0 and 100,
  "technicalAccuracyScore": number between 0 and 100,
  "communicationScore": number between 0 and 100,
  "structureScore": number between 0 and 100 (STAR method, logical flow),
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "suggestedAnswer": "Detailed model outline that a top 5% candidate would give",
  "keyKeywordsFound": ["keywords actually covered in the answer"],
  "missingKeywords": ["important concepts/keywords that were omitted"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    // Do not log the URL: it contains the API key.
    console.error(`[evaluator] Gemini request to ${GEMINI_MODEL} returned HTTP ${response.status}`);
    return null;
  }
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  return {
    score: Math.min(100, Math.max(0, Math.round(parsed.score || 70))),
    technicalAccuracyScore: Math.min(100, Math.max(0, Math.round(parsed.technicalAccuracyScore || 70))),
    communicationScore: Math.min(100, Math.max(0, Math.round(parsed.communicationScore || 70))),
    structureScore: Math.min(100, Math.max(0, Math.round(parsed.structureScore || 70))),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Good technical reasoning.'],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Consider expanding on quantifiable metrics.'],
    suggestedAnswer: parsed.suggestedAnswer || question.idealAnswerOutline,
    keyKeywordsFound: Array.isArray(parsed.keyKeywordsFound) ? parsed.keyKeywordsFound : [],
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : []
  };
}

/**
 * Built-in deterministic rubric evaluator
 */
function evaluateWithRubricHeuristics(
  question: Question,
  userAnswer: string
): AnswerEvaluation {
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