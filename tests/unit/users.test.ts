import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { makeUser, makeAuthContext } from './factories.js';

/**
 * User Route Integration Tests
 * Tests for: POST /api/users/sync, GET /api/users/me, PATCH /api/users/me,
 * GET /api/users/me/stats, DELETE /api/users/me, GET /api/users/me/export,
 * GET /api/users/:id
 */

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
  trip: { count: vi.fn(), findMany: vi.fn() },
  budget: { aggregate: vi.fn() },
  tripPhoto: { count: vi.fn() },
};

vi.mock('../../apps/api/src/index.js', () => ({ prisma: mockPrisma }));

const mockRequireAuth = vi.fn();
const mockGetAuth = vi.fn();
vi.mock('../../apps/api/src/middleware/auth.js', () => ({
  requireAuth: (c: any, next: any) => mockRequireAuth(c, next),
  getAuth: (c: any) => mockGetAuth(c),
}));

vi.mock('../../apps/api/src/services/user.service.js', () => ({
  getUserStats: vi.fn(),
  syncUser: vi.fn(),
}));

async function buildApp() {
  const { userRoutes } = await import('../../apps/api/src/routes/users.js');
  const app = new Hono();
  app.route('/api/users', userRoutes);
  return app;
}

function setupAuth(userId: string) {
  mockRequireAuth.mockImplementation(async (_c: any, next: any) => await next());
  mockGetAuth.mockReturnValue(makeAuthContext(userId));
}

function blockAuth() {
  mockRequireAuth.mockImplementation((c: any) => c.json({ error: 'Unauthorized' }, 401));
}

describe('POST /api/users/sync', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should sync new user and return 201', async () => {
    const { syncUser } = await import('../../apps/api/src/services/user.service.js');
    const user = makeUser();
    (syncUser as any).mockResolvedValue(user);

    const app = await buildApp();
    const res = await app.request('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: user.clerkId,
        email: user.email,
        displayName: user.displayName,
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe(user.id);
  });

  it('should return 400 when clerkId is missing', async () => {
    const app = await buildApp();
    const res = await app.request('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 when email is invalid', async () => {
    const app = await buildApp();
    const res = await app.request('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId: 'clerk_123', email: 'not-an-email' }),
    });
    expect(res.status).toBe(400);
  });

  it('should update existing user on re-sync', async () => {
    const { syncUser } = await import('../../apps/api/src/services/user.service.js');
    const user = makeUser({ displayName: 'Updated Name' });
    (syncUser as any).mockResolvedValue(user);

    const app = await buildApp();
    const res = await app.request('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: user.clerkId,
        email: user.email,
        displayName: 'Updated Name',
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.displayName).toBe('Updated Name');
  });
});

describe('GET /api/users/me', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return current user profile', async () => {
    const user = makeUser();
    setupAuth(user.id);

    mockPrisma.user.findUnique.mockResolvedValue(user);

    const app = await buildApp();
    const res = await app.request('/api/users/me');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(user.id);
    expect(body.email).toBe(user.email);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('should return 404 when user not found in DB', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/users/me');

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('User not found');
  });

  it('should include follower and following counts', async () => {
    const user = makeUser({
      _count: { trips: 5, followedBy: 10, following: 3 },
    });
    setupAuth(user.id);
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const app = await buildApp();
    const res = await app.request('/api/users/me');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.followersCount).toBe(10);
    expect(body.followingCount).toBe(3);
  });
});

describe('PATCH /api/users/me', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should update user profile and return updated user', async () => {
    const user = makeUser();
    setupAuth(user.id);

    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.update.mockResolvedValue({ ...user, bio: 'New bio' });

    const app = await buildApp();
    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: 'New bio' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.bio).toBe('New bio');
  });

  it('should return 409 when username is already taken', async () => {
    const user = makeUser();
    const otherUser = makeUser({ username: 'taken_username' });
    setupAuth(user.id);

    mockPrisma.user.findUnique.mockResolvedValue(otherUser);

    const app = await buildApp();
    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'taken_username' }),
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('Username already taken');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: 'test' }),
    });
    expect(res.status).toBe(401);
  });

  it('should return 400 when validation fails', async () => {
    const user = makeUser();
    setupAuth(user.id);

    const app = await buildApp();
    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'INVALID_UPPERCASE' }),
    });

    expect(res.status).toBe(400);
  });

  it('should allow user to update their own username to same value', async () => {
    const user = makeUser({ username: 'myusername' });
    setupAuth(user.id);

    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockPrisma.user.update.mockResolvedValue(user);

    const app = await buildApp();
    const res = await app.request('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'myusername' }),
    });

    expect(res.status).toBe(200);
  });
});

describe('GET /api/users/me/stats', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return user statistics', async () => {
    const user = makeUser();
    setupAuth(user.id);

    const { getUserStats } = await import('../../apps/api/src/services/user.service.js');
    (getUserStats as any).mockResolvedValue({
      trips: 5,
      countries: 3,
      continents: 2,
      photos: 20,
      totalBudget: 2500.0,
      budgetBreakdown: { accommodation: 1000, food: 500, transport: 600, activities: 300, other: 100 },
      countriesList: [],
    });

    const app = await buildApp();
    const res = await app.request('/api/users/me/stats');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.trips).toBe(5);
    expect(body.countries).toBe(3);
    expect(body.totalBudget).toBe(2500.0);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/users/me/stats');
    expect(res.status).toBe(401);
  });

  it('should return zeros when user has no trips', async () => {
    const user = makeUser();
    setupAuth(user.id);

    const { getUserStats } = await import('../../apps/api/src/services/user.service.js');
    (getUserStats as any).mockResolvedValue({
      trips: 0, countries: 0, continents: 0, photos: 0, totalBudget: 0,
      budgetBreakdown: { accommodation: 0, food: 0, transport: 0, activities: 0, other: 0 },
      countriesList: [],
    });

    const app = await buildApp();
    const res = await app.request('/api/users/me/stats');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.trips).toBe(0);
    expect(body.totalBudget).toBe(0);
  });
});

describe('DELETE /api/users/me', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should delete account and return ok message', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.user.delete.mockResolvedValue(user);

    const app = await buildApp();
    const res = await app.request('/api/users/me', { method: 'DELETE' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.message).toContain('permanently deleted');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/users/me', { method: 'DELETE' });
    expect(res.status).toBe(401);
  });

  it('should call prisma.user.delete with correct userId', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.user.delete.mockResolvedValue(user);

    const app = await buildApp();
    await app.request('/api/users/me', { method: 'DELETE' });

    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: user.id } });
  });
});

describe('GET /api/users/me/export', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return full data export for GDPR compliance', async () => {
    const user = makeUser();
    setupAuth(user.id);

    mockPrisma.user.findUnique.mockResolvedValue({
      ...user,
      trips: [{ id: 'trip-1', title: 'Paris Trip', budget: null, accommodation: null, photos: [], comments: [] }],
    });

    const app = await buildApp();
    const res = await app.request('/api/users/me/export');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('exportDate');
    expect(body).toHaveProperty('user');
    expect(body).toHaveProperty('trips');
    expect(body.trips).toHaveLength(1);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/users/me/export');
    expect(res.status).toBe(401);
  });

  it('should not include trips array nested in user object', async () => {
    const user = makeUser();
    setupAuth(user.id);

    mockPrisma.user.findUnique.mockResolvedValue({ ...user, trips: [] });

    const app = await buildApp();
    const res = await app.request('/api/users/me/export');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.trips).toBeUndefined();
  });

  it('should include a valid ISO exportDate', async () => {
    const user = makeUser();
    setupAuth(user.id);

    mockPrisma.user.findUnique.mockResolvedValue({ ...user, trips: [] });

    const app = await buildApp();
    const res = await app.request('/api/users/me/export');

    const body = await res.json();
    expect(new Date(body.exportDate).toString()).not.toBe('Invalid Date');
  });
});

describe('GET /api/users/:id (public profile)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return public profile when user is public', async () => {
    const requestingUser = makeUser();
    const targetUser = makeUser({ isPublic: true });
    setupAuth(requestingUser.id);

    mockPrisma.user.findUnique.mockResolvedValue(targetUser);

    const app = await buildApp();
    const res = await app.request(`/api/users/${targetUser.id}`);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(targetUser.id);
  });

  it('should return 403 when profile is private', async () => {
    const requestingUser = makeUser();
    const targetUser = makeUser({ isPublic: false });
    setupAuth(requestingUser.id);

    mockPrisma.user.findUnique.mockResolvedValue(targetUser);

    const app = await buildApp();
    const res = await app.request(`/api/users/${targetUser.id}`);

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('private');
  });

  it('should return 404 when user does not exist', async () => {
    const requestingUser = makeUser();
    setupAuth(requestingUser.id);

    mockPrisma.user.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/users/nonexistent-user-id');

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('User not found');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/users/some-user-id');
    expect(res.status).toBe(401);
  });

  it('should not expose sensitive fields like email in public profile', async () => {
    const requestingUser = makeUser();
    const targetUser = makeUser({ isPublic: true });
    setupAuth(requestingUser.id);

    mockPrisma.user.findUnique.mockResolvedValue(targetUser);

    const app = await buildApp();
    const res = await app.request(`/api/users/${targetUser.id}`);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.email).toBeUndefined();
    expect(body.clerkId).toBeUndefined();
  });
});
