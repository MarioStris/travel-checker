import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { makeTrip, makeUser, makePhoto, makeAuthContext } from './factories.js';

/**
 * Photo Route Integration Tests
 * Tests for: POST /api/photos/upload-url, PATCH /api/photos/:id,
 * DELETE /api/photos/:id, POST /api/photos/:id/set-cover
 */

const mockPrisma = {
  trip: { findUnique: vi.fn(), update: vi.fn() },
  tripPhoto: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock('../../apps/api/src/index.js', () => ({ prisma: mockPrisma }));

const mockRequireAuth = vi.fn();
const mockGetAuth = vi.fn();
vi.mock('../../apps/api/src/middleware/auth.js', () => ({
  requireAuth: (c: any, next: any) => mockRequireAuth(c, next),
  getAuth: (c: any) => mockGetAuth(c),
}));

const mockGenerateUploadUrl = vi.fn();
const mockDeleteFromR2 = vi.fn();
const mockCheckPhotoLimit = vi.fn();
const mockUpdateCoverIfDeleted = vi.fn();

vi.mock('../../apps/api/src/services/photo.service.js', () => ({
  createR2Client: vi.fn(() => ({})),
  getBucketName: vi.fn(() => 'test-bucket'),
  getCdnUrl: vi.fn(() => 'https://cdn.example.com'),
  buildR2Key: vi.fn((tripId: string, fileName: string) => `photos/${tripId}/${fileName}`),
  generateUploadUrl: mockGenerateUploadUrl,
  deleteFromR2: mockDeleteFromR2,
  checkPhotoLimit: mockCheckPhotoLimit,
  updateCoverIfDeleted: mockUpdateCoverIfDeleted,
}));

async function buildApp() {
  const { photoRoutes } = await import('../../apps/api/src/routes/photos.js');
  const app = new Hono();
  app.route('/api/photos', photoRoutes);
  return app;
}

function setupAuth(userId: string) {
  mockRequireAuth.mockImplementation(async (_c: any, next: any) => await next());
  mockGetAuth.mockReturnValue(makeAuthContext(userId));
}

function blockAuth() {
  mockRequireAuth.mockImplementation((c: any) => c.json({ error: 'Unauthorized' }, 401));
}

const validUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('POST /api/photos/upload-url', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return presigned upload URL and create photo record', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id, { sortOrder: 1 });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockCheckPhotoLimit.mockResolvedValue({ count: 0, atLimit: false });
    mockGenerateUploadUrl.mockResolvedValue('https://r2.example.com/presigned?token=abc');
    mockPrisma.tripPhoto.create.mockResolvedValue(photo);
    mockPrisma.trip.update.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId: trip.id,
        fileName: 'photo.jpg',
        contentType: 'image/jpeg',
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.uploadUrl).toBeTruthy();
    expect(body.photo).toBeDefined();
  });

  it('should set trip cover photo when uploading first photo', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id, { sortOrder: 1 });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockCheckPhotoLimit.mockResolvedValue({ count: 0, atLimit: false });
    mockGenerateUploadUrl.mockResolvedValue('https://r2.example.com/presigned');
    mockPrisma.tripPhoto.create.mockResolvedValue(photo);
    mockPrisma.trip.update.mockResolvedValue(trip);

    const app = await buildApp();
    await app.request('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: trip.id, fileName: 'first.jpg', contentType: 'image/jpeg' }),
    });

    expect(mockPrisma.trip.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ coverPhotoUrl: photo.url }) }),
    );
  });

  it('should return 400 when photo limit of 20 is reached', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);
    mockCheckPhotoLimit.mockResolvedValue({ count: 20, atLimit: true });

    const app = await buildApp();
    const res = await app.request('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: trip.id, fileName: 'photo.jpg', contentType: 'image/jpeg' }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Maximum 20 photos');
  });

  it('should return 404 when trip does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.trip.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: validUUID, fileName: 'photo.jpg', contentType: 'image/jpeg' }),
    });

    expect(res.status).toBe(404);
  });

  it('should return 403 when trip belongs to another user', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    setupAuth(user.id);

    mockPrisma.trip.findUnique.mockResolvedValue(trip);

    const app = await buildApp();
    const res = await app.request('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: trip.id, fileName: 'photo.jpg', contentType: 'image/jpeg' }),
    });

    expect(res.status).toBe(403);
  });

  it('should return 400 when contentType is not an image', async () => {
    const user = makeUser();
    setupAuth(user.id);

    const app = await buildApp();
    const res = await app.request('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: validUUID, fileName: 'video.mp4', contentType: 'video/mp4' }),
    });

    expect(res.status).toBe(400);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: validUUID, fileName: 'photo.jpg', contentType: 'image/jpeg' }),
    });
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/photos/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should update photo caption and return updated photo', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: user.id },
    });
    mockPrisma.tripPhoto.update.mockResolvedValue({ ...photo, caption: 'Beautiful view' });

    const app = await buildApp();
    const res = await app.request(`/api/photos/${photo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: 'Beautiful view' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.caption).toBe('Beautiful view');
  });

  it('should return 404 when photo does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.tripPhoto.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/photos/nonexistent-id', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: 'test' }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Photo not found');
  });

  it('should return 403 when photo belongs to another users trip', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: otherUser.id },
    });

    const app = await buildApp();
    const res = await app.request(`/api/photos/${photo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: 'Hijacked' }),
    });

    expect(res.status).toBe(403);
  });

  it('should return 400 when caption is too long', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: user.id },
    });

    const app = await buildApp();
    const res = await app.request(`/api/photos/${photo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: 'a'.repeat(501) }),
    });

    expect(res.status).toBe(400);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/photos/some-id', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: 'test' }),
    });
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/photos/:id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should delete photo and clean up R2', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: user.id, id: trip.id, coverPhotoUrl: null },
    });
    mockDeleteFromR2.mockResolvedValue(undefined);
    mockPrisma.tripPhoto.delete.mockResolvedValue(photo);
    mockUpdateCoverIfDeleted.mockResolvedValue(undefined);

    const app = await buildApp();
    const res = await app.request(`/api/photos/${photo.id}`, { method: 'DELETE' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockDeleteFromR2).toHaveBeenCalled();
  });

  it('should return 404 when photo does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.tripPhoto.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/photos/nonexistent-id', { method: 'DELETE' });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Photo not found');
  });

  it('should return 403 when deleting photo from another users trip', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: otherUser.id, id: trip.id, coverPhotoUrl: null },
    });

    const app = await buildApp();
    const res = await app.request(`/api/photos/${photo.id}`, { method: 'DELETE' });

    expect(res.status).toBe(403);
  });

  it('should call updateCoverIfDeleted after deletion', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: user.id, id: trip.id, coverPhotoUrl: photo.url },
    });
    mockDeleteFromR2.mockResolvedValue(undefined);
    mockPrisma.tripPhoto.delete.mockResolvedValue(photo);
    mockUpdateCoverIfDeleted.mockResolvedValue(undefined);

    const app = await buildApp();
    await app.request(`/api/photos/${photo.id}`, { method: 'DELETE' });

    expect(mockUpdateCoverIfDeleted).toHaveBeenCalledWith(
      expect.anything(),
      trip.id,
      photo.url,
      photo.url,
    );
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/photos/some-id', { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/photos/:id/set-cover', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should set photo as trip cover and return ok', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: user.id, id: trip.id },
    });
    mockPrisma.trip.update.mockResolvedValue({ ...trip, coverPhotoUrl: photo.url });

    const app = await buildApp();
    const res = await app.request(`/api/photos/${photo.id}/set-cover`, { method: 'POST' });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockPrisma.trip.update).toHaveBeenCalledWith({
      where: { id: trip.id },
      data: { coverPhotoUrl: photo.url },
    });
  });

  it('should return 404 when photo does not exist', async () => {
    const user = makeUser();
    setupAuth(user.id);
    mockPrisma.tripPhoto.findUnique.mockResolvedValue(null);

    const app = await buildApp();
    const res = await app.request('/api/photos/nonexistent-id/set-cover', { method: 'POST' });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Photo not found');
  });

  it('should return 403 when photo belongs to another users trip', async () => {
    const user = makeUser();
    const otherUser = makeUser();
    const trip = makeTrip({ userId: otherUser.id });
    const photo = makePhoto(trip.id);
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: otherUser.id, id: trip.id },
    });

    const app = await buildApp();
    const res = await app.request(`/api/photos/${photo.id}/set-cover`, { method: 'POST' });

    expect(res.status).toBe(403);
  });

  it('should return 401 when not authenticated', async () => {
    blockAuth();
    const app = await buildApp();
    const res = await app.request('/api/photos/some-id/set-cover', { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('should update the correct trip with the correct photo URL', async () => {
    const user = makeUser();
    const trip = makeTrip({ userId: user.id });
    const photo = makePhoto(trip.id, { url: 'https://cdn.example.com/specific-photo.jpg' });
    setupAuth(user.id);

    mockPrisma.tripPhoto.findUnique.mockResolvedValue({
      ...photo,
      trip: { userId: user.id, id: trip.id },
    });
    mockPrisma.trip.update.mockResolvedValue(trip);

    const app = await buildApp();
    await app.request(`/api/photos/${photo.id}/set-cover`, { method: 'POST' });

    expect(mockPrisma.trip.update).toHaveBeenCalledWith({
      where: { id: trip.id },
      data: { coverPhotoUrl: 'https://cdn.example.com/specific-photo.jpg' },
    });
  });
});
