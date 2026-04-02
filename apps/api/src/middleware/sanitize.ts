import { Context, Next } from 'hono';

const HTML_TAG_RE = /<[^>]*>/g;
const SANITIZED_FIELDS = new Set([
  'title', 'description', 'bio', 'caption', 'displayName', 'name', 'notes', 'body',
]);

function stripHtml(value: string): string {
  return value.replace(HTML_TAG_RE, '').trim();
}

function sanitizeValue(key: string, value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return SANITIZED_FIELDS.has(key) ? stripHtml(trimmed) : trimmed;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : sanitizeValue(key, item),
      );
    } else {
      result[key] = sanitizeValue(key, value);
    }
  }
  return result;
}

export async function sanitizeBody(c: Context, next: Next) {
  const contentType = c.req.header('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return next();
  }

  const method = c.req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return next();
  }

  try {
    const raw = await c.req.json();
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const sanitized = sanitizeObject(raw as Record<string, unknown>);
      c.req.raw = new Request(c.req.url, {
        method: c.req.method,
        headers: c.req.raw.headers,
        body: JSON.stringify(sanitized),
      });
    }
  } catch {
    // Body parsing failed — let downstream handlers deal with it
  }

  return next();
}
