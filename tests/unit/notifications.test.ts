import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { makeUser, makeAuthContext } from './factories.js';

const mockPrisma = {
  pushToken: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('../../apps/api/src/index.js', () => ({ prisma: mockPrisma }));

const mockRequireAuth = vi.fn();
const mockGetAuth = vi.fn();
vi.mock('../../apps/api/src/middleware/auth.js', () => ({
  requireAuth: (c: any, next: any) => mockRequireAuth(c, next),
  getAuth: (c: any) => mockGetAuth(c),
}));

async function buildApp() {
  const { notificationRoutes } = await import('../../apps/api/src/routes/notifications.js');
  const app = new Hono();
  app.route('/api/notifications', notificationRoutes);
  return app;
}

function setupAuth(userId: string) {
  mockRequireAuth.mockImplementation(async (_c: any, next: any) => await next());
  mockGetAuth.mockReturnValue(makeAuthContext(userId));
}

function blockAuth() {
  mockRequireAuth.mockImplementation((c: any) =>
    c.json({ error: 'Unauthorized' }, 401),
  );
}

describe('POST /api/notifications/register-token', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should register a push token and return 201', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.pushToken.upsert.mockResolvedValue({});

    const app = await buildApp();
    const res = await app.request('/api/notifications/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'ExponentPushToken[abc123]', platform: 'expo' }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockPrisma.pushToken.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_token: { userId: user.id, token: 'ExponentPushToken[abc123]' } },
      }),
    );
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/notifications/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'ExponentPushToken[abc123]' }),
    });
    expect(res.status).toBe(401);
  });

  it('should default platform to expo when not provided', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.pushToken.upsert.mockResolvedValue({});

    const app = await buildApp();
    const res = await app.request('/api/notifications/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'some-token' }),
    });

    expect(res.status).toBe(201);
    expect(mockPrisma.pushToken.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ platform: 'expo' }),
      }),
    );
  });
});

describe('DELETE /api/notifications/register-token', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should delete a push token and return ok', async () => {
    const user = makeUser();
    setupAuth(user.id);

    mockPrisma.pushToken.findUnique.mockResolvedValue({
      userId: user.id,
      token: 'ExponentPushToken[abc123]',
    });
    mockPrisma.pushToken.delete.mockResolvedValue({});

    const app = await buildApp();
    const res = await app.request('/api/notifications/register-token', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'ExponentPushToken[abc123]' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it('should return 404 when token does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.pushToken.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/notifications/register-token', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'nonexistent-token' }),
    });

    expect(res.status).toBe(404);
  });

  it('should return 403 when token belongs to another user', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    setupAuth(user.id);

    mockPrisma.pushToken.findUnique.mockResolvedValue({
      userId: otherUser.id,
      token: 'stolen-token',
    });

    const app = await buildApp();
    const res = await app.request('/api/notifications/register-token', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'stolen-token' }),
    });

    expect(res.status).toBe(403);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/notifications/register-token', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'some-token' }),
    });
    expect(res.status).toBe(401);
  });
});
