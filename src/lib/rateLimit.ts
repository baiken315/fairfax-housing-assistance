import { NextResponse } from 'next/server';

// In-memory throttle for write endpoints. State is per server instance, so on
// serverless hosts it is best-effort damage limiting, not a hard guarantee.
const PER_IP = { max: 10, windowMs: 10 * 60 * 1000 };
const GLOBAL = { max: 100, windowMs: 60 * 60 * 1000 };

const hits = new Map<string, number[]>();

function recent(key: string, windowMs: number, now: number): number[] {
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.set(key, list);
  return list;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

// Returns a 429 response if the request should be blocked, otherwise null.
export function throttleWrites(request: Request): NextResponse | null {
  const now = Date.now();
  const ipKey = `ip:${clientIp(request)}`;
  const ipHits = recent(ipKey, PER_IP.windowMs, now);
  const globalHits = recent('global', GLOBAL.windowMs, now);

  const blocked =
    ipHits.length >= PER_IP.max
      ? Math.ceil((ipHits[0] + PER_IP.windowMs - now) / 1000)
      : globalHits.length >= GLOBAL.max
        ? Math.ceil((globalHits[0] + GLOBAL.windowMs - now) / 1000)
        : 0;

  if (blocked) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(blocked) } }
    );
  }

  ipHits.push(now);
  globalHits.push(now);

  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const key of hits.keys()) {
      if (key !== 'global' && recent(key, PER_IP.windowMs, now).length === 0) hits.delete(key);
    }
  }
  return null;
}
