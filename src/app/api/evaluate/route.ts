import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/evaluator';
import { QUESTION_BANK } from '@/data/questions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = body;

    if (!questionId || userAnswer === undefined) {
      return NextResponse.json({ error: 'Missing questionId or userAnswer' }, { status: 400 });
    }

    const question = QUESTION_BANK.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const evaluation = await evaluateAnswer(question, userAnswer);

    return NextResponse.json({
      success: true,
      evaluation
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
