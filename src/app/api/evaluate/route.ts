import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/evaluator';
import { QUESTION_BANK } from '@/data/questions';
import { Question } from '@/types/interview';
import { checkRateLimit, validateOrigin, sanitizeCandidateInput } from '@/lib/api-security';

export async function POST(req: NextRequest) {
  // 1. Origin verification
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Sliding window IP Rate Limiting (max 20 evaluations/min per IP)
  const rateLimit = checkRateLimit(req, 20, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Evaluation rate limit exceeded. Please wait a moment before submitting.' },
      { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': '0'
        }
      }
    );
  }

  try {
    const body = await req.json();
    const { questionId, userAnswer, questionText, expectedKeywords, role, level } = body;

    if (userAnswer === undefined || userAnswer === null) {
      return NextResponse.json({ error: 'Missing candidate answer text' }, { status: 400 });
    }

    // 3. Payload sanitization & boundary validation
    const cleanAnswer = sanitizeCandidateInput(String(userAnswer), 4000);
    const cleanQuestionText = sanitizeCandidateInput(String(questionText || ''), 1000);

    // Try finding in static question bank first
    let question: Question | undefined = QUESTION_BANK.find((q) => q.id === questionId);

    // If dynamically AI generated, construct the question object safely from payload
    if (!question && (cleanQuestionText || questionId)) {
      question = {
        id: String(questionId || `ai-dyn-${Date.now()}`).slice(0, 80),
        role: role || 'data-analyst',
        level: level || 'Mid Level',
        category: 'Technical',
        question: cleanQuestionText || 'Technical Interview Question',
        expectedKeywords: Array.isArray(expectedKeywords) 
          ? expectedKeywords.map((k) => sanitizeCandidateInput(String(k), 100)).slice(0, 10)
          : [],
        idealAnswerOutline: 'Formulate answers utilizing Situation, Task, Action, and measurable Results (STAR). Provide quantitative metrics and clear architectural trade-offs.',
        hint: 'Structure your explanation with clear conceptual steps and specific tools.'
      };
    }

    if (!question) {
      return NextResponse.json({ error: 'Question could not be resolved' }, { status: 404 });
    }

    const evaluation = await evaluateAnswer(question, cleanAnswer);

    const response = NextResponse.json({
      success: true,
      evaluation
    });

    // 4. Security & anti-sniff headers
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown evaluation error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
