import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkPhotoLimit, buildR2Key, updateCoverIfDeleted } from '../services/photo.service.js';

// ---- checkPhotoLimit -------------------------------------------------------

describe('checkPhotoLimit', () => {
  const mockPrisma = {
    tripPhoto: { count: vi.fn() },
  };

  beforeEach(() => vi.clearAllMocks());

  it('returns count and atLimit=false when under limit', async () => {
    mockPrisma.tripPhoto.count.mockResolvedValue(10);
    const result = await checkPhotoLimit(mockPrisma as never, 'trip-1');
    expect(result).toEqual({ count: 10, atLimit: false });
  });

  it('returns atLimit=true at exactly 20', async () => {
    mockPrisma.tripPhoto.count.mockResolvedValue(20);
    const result = await checkPhotoLimit(mockPrisma as never, 'trip-1');
    expect(result).toEqual({ count: 20, atLimit: true });
  });

  it('returns atLimit=true above 20', async () => {
    mockPrisma.tripPhoto.count.mockResolvedValue(21);
    const result = await checkPhotoLimit(mockPrisma as never, 'trip-1');
    expect(result.atLimit).toBe(true);
  });
});

// ---- buildR2Key ------------------------------------------------------------

describe('buildR2Key', () => {
  it('generates a key with correct prefix and extension', () => {
    const key = buildR2Key('trip-abc', 'photo.jpg');
    expect(key).toMatch(/^trips\/trip-abc\/.+\.jpg$/);
  });

  it('uses fallback jpg extension for unknown file types', () => {
    const key = buildR2Key('trip-abc', 'photonoext');
    expect(key).toMatch(/^trips\/trip-abc\/.+\.photonoext$/);
  });

  it('generates unique keys on each call', () => {
    const key1 = buildR2Key('trip-abc', 'photo.jpg');
    const key2 = buildR2Key('trip-abc', 'photo.jpg');
    expect(key1).not.toBe(key2);
  });
});

// ---- updateCoverIfDeleted --------------------------------------------------

describe('updateCoverIfDeleted', () => {
  const mockPrisma = {
    tripPhoto: { findFirst: vi.fn() },
    trip: { update: vi.fn() },
  };

  beforeEach(() => vi.clearAllMocks());

  it('does nothing when deleted photo is not the cover', async () => {
    await updateCoverIfDeleted(
      mockPrisma as never,
      'trip-1',
      'https://cdn.example.com/other.jpg',
      'https://cdn.example.com/cover.jpg',
    );
    expect(mockPrisma.trip.update).not.toHaveBeenCalled();
  });

  it('sets next photo as cover when the cover is deleted', async () => {
    mockPrisma.tripPhoto.findFirst.mockResolvedValue({
      url: 'https://cdn.example.com/next.jpg',
    });

    await updateCoverIfDeleted(
      mockPrisma as never,
      'trip-1',
      'https://cdn.example.com/cover.jpg',
      'https://cdn.example.com/cover.jpg',
    );

    expect(mockPrisma.trip.update).toHaveBeenCalledWith({
      where: { id: 'trip-1' },
      data: { coverPhotoUrl: 'https://cdn.example.com/next.jpg' },
    });
  });

  it('sets coverPhotoUrl to null when no photos remain', async () => {
    mockPrisma.tripPhoto.findFirst.mockResolvedValue(null);

    await updateCoverIfDeleted(
      mockPrisma as never,
      'trip-1',
      'https://cdn.example.com/cover.jpg',
      'https://cdn.example.com/cover.jpg',
    );

    expect(mockPrisma.trip.update).toHaveBeenCalledWith({
      where: { id: 'trip-1' },
      data: { coverPhotoUrl: null },
    });
  });
});
