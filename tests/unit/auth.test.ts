import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

/**
 * Auth Middleware Tests
 * Tests for requireAuth middleware covering token validation and error cases.
 */

// Mock the Clerk client
const mockVerifyToken = vi.fn();
vi.mock('@clerk/backend', () => ({
  createClerkClient: vi.fn(() => ({
    verifyToken: mockVerifyToken,
  })),
}));

// Mock Prisma
const mockPrismaUserFindUnique = vi.fn();
vi.mock('../../apps/api/src/index.js', () => ({
  prisma: {
    user: {
      findUnique: mockPrismaUserFindUnique,
    },
  },
}));

const buildTestApp = async () => {
  const { requireAuth, getAuth } = await import('../../apps/api/src/middleware/auth.js');
  const app = new Hono();
  app.get('/protected', requireAuth, (c) => {
    const auth = getAuth(c);
    return c.json({ userId: auth.userId, email: auth.email });
  });
  return app;
};

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when Authorization header is missing', async () => {
    const app = await buildTestApp();
    const res = await app.request('/protected', { method: 'GET' });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toContain('Missing or invalid Authorization header');
  });

  it('should return 401 when Authorization header does not start with Bearer', async () => {
    const app = await buildTestApp();
    const res = await app.request('/protected', {
      method: 'GET',
      headers: { Authorization: 'Basic abc123' },
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('should return 401 when token is invalid or expired', async () => {
    mockVerifyToken.mockRejectedValueOnce(new Error('Token expired'));

    const app = await buildTestApp();
    const res = await app.request('/protected', {
      method: 'GET',
      headers: { Authorization: 'Bearer invalid.token.here' },
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toContain('Invalid or expired token');
  });

  it('should return 401 when Clerk token is valid but user not found in DB', async () => {
    mockVerifyToken.mockResolvedValueOnce({ sub: 'clerk_user_123' });
    mockPrismaUserFindUnique.mockResolvedValueOnce(null);

    const app = await buildTestApp();
    const res = await app.request('/protected', {
      method: 'GET',
      headers: { Authorization: 'Bearer valid.clerk.token' },
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toContain('User not found');
  });

  it('should pass auth context when valid token and user exist', async () => {
    const clerkId = 'clerk_user_abc';
    const userId = 'user_db_id_123';

    mockVerifyToken.mockResolvedValueOnce({ sub: clerkId });
    mockPrismaUserFindUnique.mockResolvedValueOnce({
      id: userId,
      clerkId,
      email: 'user@test.com',
    });

    const app = await buildTestApp();
    const res = await app.request('/protected', {
      method: 'GET',
      headers: { Authorization: 'Bearer valid.clerk.token' },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(userId);
    expect(body.email).toBe('user@test.com');
  });

  it('should return 401 when Bearer token is an empty string', async () => {
    const app = await buildTestApp();
    const res = await app.request('/protected', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' },
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 when Clerk throws unexpected error', async () => {
    mockVerifyToken.mockRejectedValueOnce(new Error('Network timeout'));

    const app = await buildTestApp();
    const res = await app.request('/protected', {
      method: 'GET',
      headers: { Authorization: 'Bearer some.token' },
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });
});
