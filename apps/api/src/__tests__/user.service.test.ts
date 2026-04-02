import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserStats } from '../services/user.service.js';

describe('getUserStats', () => {
  const mockPrisma = {
    trip: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    budget: {
      aggregate: vi.fn(),
    },
    tripPhoto: {
      count: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct stats for a user with trips', async () => {
    mockPrisma.trip.count.mockResolvedValue(3);
    mockPrisma.trip.findMany.mockResolvedValue([
      { countryCode: 'JP', country: 'Japan' },
      { countryCode: 'DE', country: 'Germany' },
      { countryCode: 'FR', country: 'France' },
    ]);
    mockPrisma.budget.aggregate.mockResolvedValue({
      _sum: {
        accommodation: '300.00',
        food: '150.00',
        transport: '100.00',
        activities: '80.00',
        other: '20.00',
      },
    });
    mockPrisma.tripPhoto.count.mockResolvedValue(12);

    const stats = await getUserStats(mockPrisma as never, 'user-123');

    expect(stats.trips).toBe(3);
    expect(stats.countries).toBe(3);
    expect(stats.continents).toBe(2); // Asia (JP) + Europe (DE, FR)
    expect(stats.photos).toBe(12);
    expect(stats.totalBudget).toBeCloseTo(650);
    expect(stats.budgetBreakdown.accommodation).toBe(300);
    expect(stats.countriesList).toHaveLength(3);
    expect(stats.countriesList[0]).toMatchObject({
      code: 'JP',
      name: 'Japan',
      continent: 'Asia',
    });
  });

  it('handles user with no trips', async () => {
    mockPrisma.trip.count.mockResolvedValue(0);
    mockPrisma.trip.findMany.mockResolvedValue([]);
    mockPrisma.budget.aggregate.mockResolvedValue({
      _sum: {
        accommodation: null,
        food: null,
        transport: null,
        activities: null,
        other: null,
      },
    });
    mockPrisma.tripPhoto.count.mockResolvedValue(0);

    const stats = await getUserStats(mockPrisma as never, 'user-empty');

    expect(stats.trips).toBe(0);
    expect(stats.countries).toBe(0);
    expect(stats.continents).toBe(0);
    expect(stats.totalBudget).toBe(0);
    expect(stats.budgetBreakdown.accommodation).toBe(0);
    expect(stats.countriesList).toHaveLength(0);
  });

  it('counts continents correctly across multiple countries', async () => {
    mockPrisma.trip.count.mockResolvedValue(5);
    mockPrisma.trip.findMany.mockResolvedValue([
      { countryCode: 'JP', country: 'Japan' },
      { countryCode: 'TH', country: 'Thailand' },
      { countryCode: 'DE', country: 'Germany' },
      { countryCode: 'US', country: 'USA' },
      { countryCode: 'AU', country: 'Australia' },
    ]);
    mockPrisma.budget.aggregate.mockResolvedValue({
      _sum: { accommodation: null, food: null, transport: null, activities: null, other: null },
    });
    mockPrisma.tripPhoto.count.mockResolvedValue(0);

    const stats = await getUserStats(mockPrisma as never, 'user-world');

    expect(stats.continents).toBe(4); // Asia, Europe, North America, Oceania
  });
});
