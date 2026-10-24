import { NextRequest, NextResponse } from 'next/server';
import { RoleType, ExperienceLevel } from '@/types/interview';
import { generateInterviewQuestions } from '@/lib/question-generator';
import { checkRateLimit, validateOrigin } from '@/lib/api-security';
import { ROLE_METADATA } from '@/data/questions';

const VALID_ROLES = Object.keys(ROLE_METADATA) as RoleType[];
const VALID_LEVELS: ExperienceLevel[] = [
  'Intern / Student',
  'Entry Level',
  'Mid Level',
  'Senior',
  'Staff / Principal',
  'Engineering Manager'
];

export async function POST(req: NextRequest) {
  // 1. Origin verification
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Sliding window IP Rate Limiting (max 15 question generation requests/min per IP)
  const rateLimit = checkRateLimit(req, 15, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before requesting more questions.' },
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
    const { role, level, count = 3 } = body;

    // 3. Strict schema & domain validation
    if (!role || !VALID_ROLES.includes(role as RoleType)) {
      return NextResponse.json(
        { error: 'Invalid or unsupported role specification' },
        { status: 400 }
      );
    }

    if (!level || !VALID_LEVELS.includes(level as ExperienceLevel)) {
      return NextResponse.json(
        { error: 'Invalid experience level parameter' },
        { status: 400 }
      );
    }

    const safeCount = Math.min(6, Math.max(1, Number(count) || 3));

    const questions = await generateInterviewQuestions(
      role as RoleType,
      level as ExperienceLevel,
      safeCount
    );

    const response = NextResponse.json({
      success: true,
      role,
      level,
      questions
    });

    // 4. Protection & Cache Headers
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown generation error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
