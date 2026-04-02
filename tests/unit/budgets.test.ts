import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { makeTrip, makeUser, makeBudget, makeAuthContext } from './factories.js';

/**
 * Budget Route Integration Tests
 * Tests for: PUT /api/trips/:id/budget, GET /api/trips/:id/budget,
 * DELETE /api/trips/:id/budget
 */

const mockPrisma = {
  trip: { findUnique: vi.fn() },
  budget: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
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

vi.mock('../../apps/api/src/services/trip.service.js', () => ({
  calcBudgetTotal: vi.fn((b) => b.accommodation + b.food + b.transport + b.activities + b.other),
}));

async function buildApp() {
  const { budgetRoutes } = await import('../../apps/api/src/routes/budgets.js');
  const app = new Hono();
  app.route('/api/trips', budgetRoutes);
  return app;
}

function setupAuth(userId: string) {
  mockRequireAuth.mockImplementation(async (_c: any, next: any) => await next());
  mockGetAuth.mockReturnValue(makeAuthContext(userId));
}

function blockAuth() {
  mockRequireAuth.mockImplementation((c: any) => c.json({ error: 'Unauthorized' }, 401));
}

const validBudgetPayload = {
  currency: 'EUR',
  accommodation: 500,
  food: 300,
  transport: 200,
  activities: 150,
  other: 50,
  isApproximate: false,
};

describe('PUT /api/trips/:id/budget', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should create budget for trip and return it with total', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const budget = makeBudget(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.budget.upsert.mockResolvedValue(budget);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBudgetPayload),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(typeof body.data.total).toBe('number');
    expect(body.data.total).toBe(1200);
  });

  it('should update existing budget (upsert behavior)', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const updatedBudget = makeBudget(trip.id, { accommodation: 800 });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.budget.upsert.mockResolvedValue(updatedBudget);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBudgetPayload, accommodation: 800 }),
    });

    expect(res.status).toBe(200);
    expect(mockPrisma.budget.upsert).toHaveBeenCalledTimes(1);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id/budget', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBudgetPayload),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Trip not found');
  });

  it('should return 403 when trip belongs to another user', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBudgetPayload),
    });

    expect(res.status).toBe(403);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id/budget', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBudgetPayload),
    });
    expect(res.status).toBe(401);
  });

  it('should return 400 when budget values are negative', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBudgetPayload, food: -50 }),
    });

    expect(res.status).toBe(400);
  });

  it('should accept budget with all zeros and return total of 0', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const zeroBudget = makeBudget(trip.id, { accommodation: 0, food: 0, transport: 0, activities: 0, other: 0 });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.budget.upsert.mockResolvedValue(zeroBudget);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accommodation: 0, food: 0, transport: 0, activities: 0, other: 0 }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.total).toBe(0);
  });
});

describe('GET /api/trips/:id/budget', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return budget with total for trip owner', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id, isPublic: false });
    const budget = makeBudget(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: trip.userId, isPublic: trip.isPublic });
    mockPrisma.budget.findUnique.mockResolvedValue(budget);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.tripId).toBe(trip.id);
    expect(body.data.total).toBe(1200);
  });

  it('should allow reading budget of public trip by non-owner', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id, isPublic: true });
    const budget = makeBudget(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: otherUser.id, isPublic: true });
    mockPrisma.budget.findUnique.mockResolvedValue(budget);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`);

    expect(res.status).toBe(200);
  });

  it('should return 403 when trip is private and requester is not owner', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: otherUser.id, isPublic: false });

    const app = await buildApp();
    const res = await app.request('/api/trips/trip-id/budget');

    expect(res.status).toBe(403);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id/budget');

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Trip not found');
  });

  it('should return 404 when trip exists but has no budget', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: trip.userId, isPublic: false });
    mockPrisma.budget.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('No budget found');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id/budget');
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/trips/:id/budget', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should delete budget and return 204', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const budget = makeBudget(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.budget.findUnique.mockResolvedValue(budget);
    mockPrisma.budget.delete.mockResolvedValue(budget);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, { method: 'DELETE' });

    expect(res.status).toBe(204);
    expect(mockPrisma.budget.delete).toHaveBeenCalledWith({ where: { tripId: trip.id } });
  });

  it('should return 404 when no budget exists to delete', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.budget.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, { method: 'DELETE' });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('No budget found');
  });

  it('should return 403 when trip belongs to another user', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/budget`, { method: 'DELETE' });

    expect(res.status).toBe(403);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id/budget', { method: 'DELETE' });

    expect(res.status).toBe(404);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id/budget', { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});
