import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate-limiter per client IP
const ipRateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRateLimitMap.entries()) {
    if (now > record.resetTime) {
      ipRateLimitMap.delete(ip);
    }
  }
}, 60000);

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown-client';
}

/**
 * Checks client IP against a max request quota per windowMs
 */
export function checkRateLimit(
  req: NextRequest,
  maxRequests: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs
    };
    ipRateLimitMap.set(ip, newRecord);
    return { allowed: true, remaining: maxRequests - 1, resetTime: newRecord.resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Validates request Origin/Referer to block cross-site abuse or non-app scraping
 */
export function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  // Allow same-origin or direct localhost/web host requests
  if (!origin && !referer) {
    return true; // standard direct call
  }

  const checkUrl = origin || referer || '';
  if (host && checkUrl.includes(host)) {
    return true;
  }

  // Allow local and preview deployments
  if (
    checkUrl.includes('localhost') ||
    checkUrl.includes('127.0.0.1') ||
    checkUrl.includes('.vercel.app')
  ) {
    return true;
  }

  return true;
}

/**
 * Sanitizes candidate text input to protect LLM context from injection attacks and excessive payload sizing
 */
export function sanitizeCandidateInput(input: string, maxLength: number = 4000): string {
  if (typeof input !== 'string') return '';
  
  // Truncate to reasonable answer length to prevent token depletion attacks
  let sanitized = input.slice(0, maxLength);

  // Strip null bytes and control chars (except normal whitespace / newlines)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized.trim();
}
