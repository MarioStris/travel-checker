import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { makeTrip, makeUser, makeAccommodation, makeAuthContext } from './factories.js';

/**
 * Accommodation Route Integration Tests
 * Tests for: PUT /api/trips/:id/accommodation, GET /api/trips/:id/accommodation,
 * DELETE /api/trips/:id/accommodation
 */

const mockPrisma = {
  trip: { findUnique: vi.fn() },
  accommodation: {
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

async function buildApp() {
  const { accommodationRoutes } = await import('../../apps/api/src/routes/accommodations.js');
  const app = new Hono();
  app.route('/api/trips', accommodationRoutes);
  return app;
}

function setupAuth(userId: string) {
  mockRequireAuth.mockImplementation(async (_c: any, next: any) => await next());
  mockGetAuth.mockReturnValue(makeAuthContext(userId));
}

function blockAuth() {
  mockRequireAuth.mockImplementation((c: any) => c.json({ error: 'Unauthorized' }, 401));
}

const validAccommodationPayload = {
  name: 'Grand Hotel Roma',
  type: 'hotel',
  url: 'https://grandhotelroma.example.com',
  rating: 4,
  notes: 'Great location near the Colosseum',
};

describe('PUT /api/trips/:id/accommodation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should create accommodation for trip and return it', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const accommodation = makeAccommodation(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.accommodation.upsert.mockResolvedValue(accommodation);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validAccommodationPayload),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.tripId).toBe(trip.id);
  });

  it('should upsert when accommodation already exists', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const accommodation = makeAccommodation(trip.id, { name: 'Updated Hotel' });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.accommodation.upsert.mockResolvedValue(accommodation);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validAccommodationPayload, name: 'Updated Hotel' }),
    });

    expect(res.status).toBe(200);
    expect(mockPrisma.accommodation.upsert).toHaveBeenCalledTimes(1);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id/accommodation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validAccommodationPayload),
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
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validAccommodationPayload),
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Forbidden');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id/accommodation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validAccommodationPayload),
    });
    expect(res.status).toBe(401);
  });

  it('should return 400 when accommodation name is empty', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validAccommodationPayload, name: '' }),
    });

    expect(res.status).toBe(400);
  });

  it('should return 400 when type is invalid', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validAccommodationPayload, type: 'resort' }),
    });

    expect(res.status).toBe(400);
  });

  it('should accept accommodation without optional fields', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const accommodation = makeAccommodation(trip.id, { url: null, rating: null, notes: null });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.accommodation.upsert.mockResolvedValue(accommodation);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Minimal Hotel', type: 'hostel' }),
    });

    expect(res.status).toBe(200);
  });
});

describe('GET /api/trips/:id/accommodation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return accommodation for trip owner', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id, isPublic: false });
    const accommodation = makeAccommodation(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: trip.userId, isPublic: false });
    mockPrisma.accommodation.findUnique.mockResolvedValue(accommodation);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.name).toBe(accommodation.name);
  });

  it('should allow non-owner to read accommodation of public trip', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id, isPublic: true });
    const accommodation = makeAccommodation(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: otherUser.id, isPublic: true });
    mockPrisma.accommodation.findUnique.mockResolvedValue(accommodation);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`);

    expect(res.status).toBe(200);
  });

  it('should return 403 when trip is private and requester is not owner', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: otherUser.id, isPublic: false });

    const app = await buildApp();
    const res = await app.request('/api/trips/some-trip-id/accommodation');

    expect(res.status).toBe(403);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id/accommodation');

    expect(res.status).toBe(404);
  });

  it('should return 404 when trip has no accommodation', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue({ userId: trip.userId, isPublic: false });
    mockPrisma.accommodation.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`);

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('No accommodation found');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id/accommodation');
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/trips/:id/accommodation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should delete accommodation and return 204', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const accommodation = makeAccommodation(trip.id);
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.accommodation.findUnique.mockResolvedValue(accommodation);
    mockPrisma.accommodation.delete.mockResolvedValue(accommodation);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, { method: 'DELETE' });

    expect(res.status).toBe(204);
    expect(mockPrisma.accommodation.delete).toHaveBeenCalledWith({ where: { tripId: trip.id } });
  });

  it('should return 404 when no accommodation exists to delete', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockPrisma.accommodation.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, { method: 'DELETE' });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('No accommodation found');
  });

  it('should return 403 when trip belongs to another user', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request(`/api/trips/${trip.id}/accommodation`, { method: 'DELETE' });

    expect(res.status).toBe(403);
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/trips/nonexistent-id/accommodation', { method: 'DELETE' });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Trip not found');
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/trips/some-id/accommodation', { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});
