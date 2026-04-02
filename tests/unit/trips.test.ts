import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { makeTrip, makeUser, makeBudget, makeAccommodation, makeAuthContext } from './factories.js';

/**
 * Trip Route Integration Tests
 * Tests for: GET /api/trips, POST /api/trips, GET /api/trips/:id,
 * PATCH /api/trips/:id, DELETE /api/trips/:id, GET /api/trips/map/pins
 */

const mockPrisma = {
  trip: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  user: { findUnique: vi.fn(), update: vi.fn() },
  budget: { create: vi.fn(), upsert: vi.fn() },
  accommodation: { create: vi.fn(), upsert: vi.fn() },
  $transaction: vi.fn(),
};

vi.mock('../../apps/api/src/index.js', () => ({ prisma: mockPrisma }));

const mockRequireAuth = vi.fn();
const mockGetAuth = vi.fn();
vi.mock('../../apps/api/src/middleware/auth.js', () => ({
  requireAuth: (c: any, next: any) => mockRequireAuth(c, next),
  getAuth: (c: any) => mockGetAuth(c),
}));

vi.mock('../../apps/api/src/services/trip.service.js', () => ({
  syncUserStats: vi.fn().mockResolvedValue(undefined),
  calcBudgetTotal: vi.fn((b) => b.accommodation + b.food + b.transport + b.activities + b.other),
}));

async function buildApp() {
  const { tripRoutes } = await import('../../apps/api/src/routes/trips.js');
  const app = new Hono();
  app.route('/api/trips', tripRoutes);
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

describe('GET /api/trips', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return paginated list of user trips', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findMany.mockResolvedValue([trip]);
    mockPrisma.trip.count.mockResolvedValue(1);

    const app = await buildApp();
    const res = await app.request('/api/trips', { method: 'GET' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.trips).toHaveLength(1);
    expect(body.pagination.total).toBe(1);
    expect(body.pagination.page).toBe(1);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips', { method: 'GET' });
    expect(res.status).toBe(401);
  });

  it('should respect page and limit query params', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findMany.mockResolvedValue([]);
    mockPrisma.trip.count.mockResolvedValue(0);

    const app = await buildApp();
    const res = await app.request('/api/trips?page=2&limit=10', { method: 'GET' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.pagination.page).toBe(2);
    expect(body.pagination.limit).toBe(10);
  });

  it('should cap limit at 50 even when higher value is requested', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findMany.mockResolvedValue([]);
    mockPrisma.trip.count.mockResolvedValue(0);

    const app = await buildApp();
    await app.request('/api/trips?limit=100', { method: 'GET' });

    expect(mockPrisma.trip.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 }),
    );
  });

  it('should include budget total in response when budget exists', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id, budget: makeBudget('trip-id') as any });
    setupAuth(user.id);

    mockPrisma.trip.findMany.mockResolvedValue([trip]);
    mockPrisma.trip.count.mockResolvedValue(1);

    const app = await buildApp();
    const res = await app.request('/api/trips', { method: 'GET' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.trips[0].budget).not.toBeNull();
    expect(typeof body.trips[0].budget.total).toBe('number');
  });
});

describe('POST /api/trips', () => {
  beforeEach(() => vi.clearAllMocks());

  const validPayload = {
    title: 'Trip to Rome',
    destination: 'Rome, Italy',
    country: 'Italy',
    countryCode: 'IT',
    latitude: 41.9028,
    longitude: 12.4964,
    startDate: '2024-07-01',
    isPublic: false,
  };

  it('should create a new trip and return 201', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id, ...validPayload });
    setupAuth(user.id);

    mockPrisma.$transaction.mockImplementation(async (fn: any) => {
      return fn(mockPrisma);
    });
    mockPrisma.trip.create.mockResolvedValue(trip);
    mockPrisma.trip.findUnique.mockResolvedValue({ ...trip, budget: null, accommodation: null, photos: [] });

    const app = await buildApp();
    const res = await app.request('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    expect(res.status).toBe(201);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });
    expect(res.status).toBe(401);
  });

  it('should return 400 when required fields are missing', async () => {
    const user = makeUser();
    setupAuth(user.id);

    const app = await buildApp();
    const res = await app.request('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Incomplete trip' }),
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 when countryCode is invalid length', async () => {
    const user = makeUser();
    setupAuth(user.id);

    const app = await buildApp();
    const res = await app.request('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validPayload, countryCode: 'ITA' }),
    });

    expect(res.status).toBe(400);
  });

  it('should create trip with accommodation and budget in transaction', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockPrisma));
    mockPrisma.trip.create.mockResolvedValue(trip);
    mockPrisma.accommodation.create.mockResolvedValue({});
    mockPrisma.budget.create.mockResolvedValue({});
    mockPrisma.trip.findUnique.mockResolvedValue({ ...trip, budget: null, accommodation: null, photos: [] });

    const app = await buildApp();
    const res = await app.request('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPayload,
        accommodation: { name: 'Hotel Roma', type: 'hotel' },
        budget: { currency: 'EUR', accommodation: 200, food: 150, transport: 100, activities: 80, other: 30 },
      }),
    });

    expect(res.status).toBe(201);
    expect(mockPrisma.accommodation.create).toHaveBeenCalled();
    expect(mockPrisma.budget.create).toHaveBeenCalled();
  });
});

describe('GET /api/trips/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return trip detail for the owner', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id, isPublic: false });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({
      ...trip,
      user: { id: user.id, displayName: user.displayName, avatarUrl: null, username: user.username },
    });

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(trip.id);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id');

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Trip not found');
  });

  it('should return 403 when accessing private trip owned by another user', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id, isPublic: false });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({
      ...trip,
      user: { id: otherUser.id, displayName: otherUser.displayName, avatarUrl: null, username: otherUser.username },
    });

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`);

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Forbidden');
  });

  it('should allow access to public trip owned by another user', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id, isPublic: true });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({
      ...trip,
      user: { id: otherUser.id, displayName: otherUser.displayName, avatarUrl: null, username: otherUser.username },
    });

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`);

    expect(res.status).toBe(200);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-trip-id');
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/trips/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should update trip fields and return updated trip', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValueOnce(trip);
    mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockPrisma));
    mockPrisma.trip.update.mockResolvedValue({ ...trip, title: 'Updated Title' });
    mockPrisma.trip.findUnique.mockResolvedValueOnce({ ...trip, title: 'Updated Title', budget: null, accommodation: null, photos: [] });

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    expect(res.status).toBe(200);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Title' }),
    });

    expect(res.status).toBe(404);
  });

  it('should return 403 when trying to update another users trip', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hijacked Title' }),
    });

    expect(res.status).toBe(403);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'X' }),
    });
    expect(res.status).toBe(401);
  });

  it('should return 400 when validation fails on update fields', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: 999 }),
    });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/trips/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should delete trip and return ok', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.trip.delete.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`, { method: 'DELETE' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id', { method: 'DELETE' });

    expect(res.status).toBe(404);
  });

  it('should return 403 when trying to delete another users trip', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}`, { method: 'DELETE' });

    expect(res.status).toBe(403);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id', { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/trips/map/pins', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return all map pins for authenticated user', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findMany.mockResolvedValue([
      { ...trip, budget: makeBudget(trip.id) },
    ]);

    const app = await buildApp();
    const res = await app.request('/api/trips/map/pins');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('latitude');
    expect(body[0]).toHaveProperty('longitude');
    expect(body[0]).toHaveProperty('totalBudget');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/map/pins');
    expect(res.status).toBe(401);
  });

  it('should return empty array when user has no trips', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findMany.mockResolvedValue([]);

    const app = await buildApp();
    const res = await app.request('/api/trips/map/pins');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(0);
  });

  it('should set currency to EUR when trip has no budget', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id, budget: null });
    setupAuth(user.id);

    mockPrisma.trip.findMany.mockResolvedValue([{ ...trip, budget: null }]);

    const app = await buildApp();
    const res = await app.request('/api/trips/map/pins');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].currency).toBe('EUR');
    expect(body[0].totalBudget).toBeNull();
  });
});
