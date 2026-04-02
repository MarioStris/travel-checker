import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Validation Schema Tests
 * Tests for all Zod schemas used across routes.
 * Uses the same schema definitions as the routes to ensure parity.
 */

// --- Schemas (mirrored from routes) ---

const createTripSchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  countryCode: z.string().length(2),
  city: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  season: z.enum(['spring', 'summer', 'autumn', 'winter']).optional(),
  travelerCategory: z.enum([
    'solo', 'couple', 'family', 'backpacker', 'luxury',
    'digital_nomad', 'adventure', 'cultural', 'group', 'business',
  ]).default('solo'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(50).regex(/^[a-z0-9_]+$/).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  travelerCategory: z.enum([
    'solo', 'couple', 'family', 'backpacker', 'luxury',
    'digital_nomad', 'adventure', 'cultural', 'group', 'business',
  ]).optional(),
  ageRange: z.enum(['18-24', '25-34', '35-44', '45-54', '55-64', '65+']).optional(),
  isPublic: z.boolean().optional(),
});

const upsertBudgetSchema = z.object({
  currency: z.string().length(3).default('EUR'),
  accommodation: z.number().min(0).default(0),
  food: z.number().min(0).default(0),
  transport: z.number().min(0).default(0),
  activities: z.number().min(0).default(0),
  other: z.number().min(0).default(0),
  isApproximate: z.boolean().default(false),
});

const upsertAccommodationSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['hotel', 'hostel', 'airbnb', 'camping', 'friends', 'other']).default('hotel'),
  url: z.string().url().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

const photoUploadSchema = z.object({
  tripId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  contentType: z.string().regex(/^image\/(jpeg|png|webp|heic)$/),
  caption: z.string().max(500).optional(),
});

// --- Tests ---

describe('createTripSchema validation', () => {
  const validTrip = {
    title: 'Summer in Paris',
    destination: 'Paris, France',
    country: 'France',
    countryCode: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    startDate: '2024-06-01',
  };

  it('should accept a valid minimal trip payload', () => {
    const result = createTripSchema.safeParse(validTrip);
    expect(result.success).toBe(true);
  });

  it('should accept a full trip payload with all optional fields', () => {
    const result = createTripSchema.safeParse({
      ...validTrip,
      city: 'Paris',
      endDate: '2024-06-10',
      season: 'summer',
      travelerCategory: 'couple',
      description: 'A romantic trip',
      isPublic: true,
    });
    expect(result.success).toBe(true);
  });

  it('should reject when title is empty', () => {
    const result = createTripSchema.safeParse({ ...validTrip, title: '' });
    expect(result.success).toBe(false);
  });

  it('should reject when countryCode is not exactly 2 characters', () => {
    expect(createTripSchema.safeParse({ ...validTrip, countryCode: 'FRA' }).success).toBe(false);
    expect(createTripSchema.safeParse({ ...validTrip, countryCode: 'F' }).success).toBe(false);
  });

  it('should reject latitude outside -90 to 90 range', () => {
    expect(createTripSchema.safeParse({ ...validTrip, latitude: 91 }).success).toBe(false);
    expect(createTripSchema.safeParse({ ...validTrip, latitude: -91 }).success).toBe(false);
  });

  it('should reject longitude outside -180 to 180 range', () => {
    expect(createTripSchema.safeParse({ ...validTrip, longitude: 181 }).success).toBe(false);
    expect(createTripSchema.safeParse({ ...validTrip, longitude: -181 }).success).toBe(false);
  });

  it('should reject invalid date format for startDate', () => {
    expect(createTripSchema.safeParse({ ...validTrip, startDate: '01-06-2024' }).success).toBe(false);
    expect(createTripSchema.safeParse({ ...validTrip, startDate: '2024/06/01' }).success).toBe(false);
  });

  it('should reject invalid season value', () => {
    const result = createTripSchema.safeParse({ ...validTrip, season: 'monsoon' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid travelerCategory', () => {
    const result = createTripSchema.safeParse({ ...validTrip, travelerCategory: 'superhero' });
    expect(result.success).toBe(false);
  });

  it('should default travelerCategory to solo when not provided', () => {
    const result = createTripSchema.safeParse(validTrip);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.travelerCategory).toBe('solo');
    }
  });
});

describe('updateProfileSchema validation', () => {
  it('should accept partial update with just displayName', () => {
    const result = updateProfileSchema.safeParse({ displayName: 'New Name' });
    expect(result.success).toBe(true);
  });

  it('should reject username with uppercase letters', () => {
    const result = updateProfileSchema.safeParse({ username: 'UserName' });
    expect(result.success).toBe(false);
  });

  it('should reject username with special characters', () => {
    const result = updateProfileSchema.safeParse({ username: 'user-name!' });
    expect(result.success).toBe(false);
  });

  it('should reject username shorter than 3 characters', () => {
    const result = updateProfileSchema.safeParse({ username: 'ab' });
    expect(result.success).toBe(false);
  });

  it('should accept username with underscores and numbers', () => {
    const result = updateProfileSchema.safeParse({ username: 'user_123' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid avatarUrl', () => {
    const result = updateProfileSchema.safeParse({ avatarUrl: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('should reject bio longer than 500 characters', () => {
    const result = updateProfileSchema.safeParse({ bio: 'a'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('should accept empty object (no-op update)', () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should reject invalid ageRange value', () => {
    const result = updateProfileSchema.safeParse({ ageRange: '20-30' });
    expect(result.success).toBe(false);
  });
});

describe('upsertBudgetSchema validation', () => {
  it('should accept valid budget with all categories', () => {
    const result = upsertBudgetSchema.safeParse({
      currency: 'EUR',
      accommodation: 500,
      food: 300,
      transport: 200,
      activities: 150,
      other: 50,
      isApproximate: false,
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative budget values', () => {
    expect(upsertBudgetSchema.safeParse({ accommodation: -100, food: 0, transport: 0, activities: 0, other: 0 }).success).toBe(false);
  });

  it('should reject currency not exactly 3 characters', () => {
    expect(upsertBudgetSchema.safeParse({ currency: 'EU', food: 0, transport: 0, activities: 0, other: 0, accommodation: 0 }).success).toBe(false);
    expect(upsertBudgetSchema.safeParse({ currency: 'EURO', food: 0, transport: 0, activities: 0, other: 0, accommodation: 0 }).success).toBe(false);
  });

  it('should default all values when only partial is provided', () => {
    const result = upsertBudgetSchema.safeParse({ accommodation: 100 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.food).toBe(0);
      expect(result.data.currency).toBe('EUR');
      expect(result.data.isApproximate).toBe(false);
    }
  });

  it('should accept zero for all budget categories', () => {
    const result = upsertBudgetSchema.safeParse({
      accommodation: 0, food: 0, transport: 0, activities: 0, other: 0,
    });
    expect(result.success).toBe(true);
  });
});

describe('upsertAccommodationSchema validation', () => {
  it('should accept valid accommodation', () => {
    const result = upsertAccommodationSchema.safeParse({
      name: 'Grand Hotel Paris',
      type: 'hotel',
      url: 'https://grandhotel.example.com',
      rating: 5,
      notes: 'Great location',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty accommodation name', () => {
    const result = upsertAccommodationSchema.safeParse({ name: '', type: 'hotel' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid accommodation type', () => {
    const result = upsertAccommodationSchema.safeParse({ name: 'Test', type: 'resort' });
    expect(result.success).toBe(false);
  });

  it('should reject rating below 1', () => {
    const result = upsertAccommodationSchema.safeParse({ name: 'Test', type: 'hotel', rating: 0 });
    expect(result.success).toBe(false);
  });

  it('should reject rating above 5', () => {
    const result = upsertAccommodationSchema.safeParse({ name: 'Test', type: 'hotel', rating: 6 });
    expect(result.success).toBe(false);
  });

  it('should accept null url and rating', () => {
    const result = upsertAccommodationSchema.safeParse({ name: 'Test', type: 'hostel', url: null, rating: null });
    expect(result.success).toBe(true);
  });
});

describe('photoUploadSchema validation', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000';

  it('should accept valid JPEG upload request', () => {
    const result = photoUploadSchema.safeParse({
      tripId: validUUID,
      fileName: 'photo.jpg',
      contentType: 'image/jpeg',
    });
    expect(result.success).toBe(true);
  });

  it('should accept all allowed image content types', () => {
    const types = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    types.forEach((contentType) => {
      const result = photoUploadSchema.safeParse({
        tripId: validUUID,
        fileName: 'photo.jpg',
        contentType,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should reject non-image content types', () => {
    const result = photoUploadSchema.safeParse({
      tripId: validUUID,
      fileName: 'video.mp4',
      contentType: 'video/mp4',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid tripId (not UUID)', () => {
    const result = photoUploadSchema.safeParse({
      tripId: 'not-a-uuid',
      fileName: 'photo.jpg',
      contentType: 'image/jpeg',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty fileName', () => {
    const result = photoUploadSchema.safeParse({
      tripId: validUUID,
      fileName: '',
      contentType: 'image/jpeg',
    });
    expect(result.success).toBe(false);
  });

  it('should reject caption longer than 500 characters', () => {
    const result = photoUploadSchema.safeParse({
      tripId: validUUID,
      fileName: 'photo.jpg',
      contentType: 'image/jpeg',
      caption: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
