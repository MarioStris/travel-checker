import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';

// Import directly from the file to avoid the re-export chain during testing
import {
  createTripSchema,
  updateProfileSchema,
  upsertBudgetSchema,
  upsertAccommodationSchema,
  requestUploadUrlSchema,
  paginationSchema,
} from '../../../../../../packages/shared/src/validators.js';

describe('createTripSchema', () => {
  const validTrip = {
    title: 'Tokyo Trip',
    destination: 'Tokyo, Japan',
    country: 'Japan',
    countryCode: 'JP',
    latitude: 35.6762,
    longitude: 139.6503,
    startDate: '2024-03-10',
  };

  it('accepts a valid trip', () => {
    expect(() => createTripSchema.parse(validTrip)).not.toThrow();
  });

  it('rejects invalid date format', () => {
    expect(() =>
      createTripSchema.parse({ ...validTrip, startDate: '10-03-2024' }),
    ).toThrow(ZodError);
  });

  it('rejects countryCode longer than 2 chars', () => {
    expect(() =>
      createTripSchema.parse({ ...validTrip, countryCode: 'JPN' }),
    ).toThrow(ZodError);
  });

  it('rejects latitude out of range', () => {
    expect(() =>
      createTripSchema.parse({ ...validTrip, latitude: 91 }),
    ).toThrow(ZodError);
  });

  it('defaults travelerCategory to solo', () => {
    const result = createTripSchema.parse(validTrip);
    expect(result.travelerCategory).toBe('solo');
  });

  it('defaults isPublic to false', () => {
    const result = createTripSchema.parse(validTrip);
    expect(result.isPublic).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('accepts partial updates', () => {
    expect(() =>
      updateProfileSchema.parse({ displayName: 'Ana' }),
    ).not.toThrow();
  });

  it('rejects invalid username with uppercase letters', () => {
    expect(() =>
      updateProfileSchema.parse({ username: 'Ana_Travels' }),
    ).toThrow(ZodError);
  });

  it('rejects username shorter than 3 chars', () => {
    expect(() =>
      updateProfileSchema.parse({ username: 'ab' }),
    ).toThrow(ZodError);
  });

  it('accepts valid username', () => {
    expect(() =>
      updateProfileSchema.parse({ username: 'ana_travels_99' }),
    ).not.toThrow();
  });
});

describe('upsertBudgetSchema', () => {
  it('accepts valid budget', () => {
    const budget = {
      currency: 'EUR',
      accommodation: 500,
      food: 300,
      transport: 200,
      activities: 150,
      other: 50,
      isApproximate: false,
    };
    expect(() => upsertBudgetSchema.parse(budget)).not.toThrow();
  });

  it('rejects negative values', () => {
    expect(() =>
      upsertBudgetSchema.parse({ accommodation: -10 }),
    ).toThrow(ZodError);
  });

  it('rejects invalid currency length', () => {
    expect(() =>
      upsertBudgetSchema.parse({ currency: 'EURO' }),
    ).toThrow(ZodError);
  });

  it('defaults all amounts to 0', () => {
    const result = upsertBudgetSchema.parse({ currency: 'USD' });
    expect(result.accommodation).toBe(0);
    expect(result.food).toBe(0);
  });
});

describe('upsertAccommodationSchema', () => {
  it('accepts valid accommodation', () => {
    expect(() =>
      upsertAccommodationSchema.parse({ name: 'Hotel XYZ', type: 'hotel' }),
    ).not.toThrow();
  });

  it('rejects invalid accommodation type', () => {
    expect(() =>
      upsertAccommodationSchema.parse({ name: 'Hotel XYZ', type: 'resort' }),
    ).toThrow(ZodError);
  });

  it('rejects rating outside 1-5', () => {
    expect(() =>
      upsertAccommodationSchema.parse({ name: 'Hotel XYZ', rating: 6 }),
    ).toThrow(ZodError);
  });

  it('accepts null for optional fields', () => {
    expect(() =>
      upsertAccommodationSchema.parse({ name: 'Hotel XYZ', url: null, rating: null }),
    ).not.toThrow();
  });
});

describe('requestUploadUrlSchema', () => {
  it('accepts valid upload request', () => {
    expect(() =>
      requestUploadUrlSchema.parse({
        tripId: '550e8400-e29b-41d4-a716-446655440000',
        fileName: 'photo.jpg',
        contentType: 'image/jpeg',
      }),
    ).not.toThrow();
  });

  it('rejects invalid uuid', () => {
    expect(() =>
      requestUploadUrlSchema.parse({
        tripId: 'not-a-uuid',
        fileName: 'photo.jpg',
        contentType: 'image/jpeg',
      }),
    ).toThrow(ZodError);
  });

  it('rejects non-image content type', () => {
    expect(() =>
      requestUploadUrlSchema.parse({
        tripId: '550e8400-e29b-41d4-a716-446655440000',
        fileName: 'doc.pdf',
        contentType: 'application/pdf',
      }),
    ).toThrow(ZodError);
  });
});

describe('paginationSchema', () => {
  it('coerces string numbers', () => {
    const result = paginationSchema.parse({ page: '2', limit: '10' });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
  });

  it('caps limit at 50', () => {
    expect(() =>
      paginationSchema.parse({ page: 1, limit: 100 }),
    ).toThrow(ZodError);
  });

  it('defaults page=1 and limit=20', () => {
    const result = paginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });
});
