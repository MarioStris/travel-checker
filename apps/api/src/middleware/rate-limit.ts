import { Context, Next } from 'hono';

type WindowEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, WindowEntry>();
const WINDOW_MS = 60_000;

function getKey(c: Context, authenticated: boolean): string {
  if (authenticated) {
    const auth = c.get('auth') as { userId: string } | undefined;
    return `user:${auth?.userId ?? 'unknown'}`;
  }
  const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown';
  return `ip:${ip}`;
}

function checkLimit(key: string, maxRequests: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);
  return { allowed: entry.count <= maxRequests, remaining };
}

export function rateLimitAuthenticated(c: Context, next: Next) {
  const key = getKey(c, true);
  const { allowed, remaining } = checkLimit(key, 100);

  c.header('X-RateLimit-Limit', '100');
  c.header('X-RateLimit-Remaining', String(remaining));

  if (!allowed) {
    return c.json(
      { error: 'Too Many Requests', message: 'Rate limit exceeded. Try again in 1 minute.' },
      429,
    );
  }
  return next();
}

export function rateLimitPublic(c: Context, next: Next) {
  const key = getKey(c, false);
  const { allowed, remaining } = checkLimit(key, 20);

  c.header('X-RateLimit-Limit', '20');
  c.header('X-RateLimit-Remaining', String(remaining));

  if (!allowed) {
    return c.json(
      { error: 'Too Many Requests', message: 'Rate limit exceeded. Try again in 1 minute.' },
      429,
    );
  }
  return next();
}
