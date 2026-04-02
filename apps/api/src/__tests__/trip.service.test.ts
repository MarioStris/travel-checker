import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calcBudgetTotal, syncUserStats } from '../services/trip.service.js';

// ---- calcBudgetTotal -------------------------------------------------------

describe('calcBudgetTotal', () => {
  it('sums all budget categories', () => {
    const budget = {
      accommodation: 100,
      food: 200,
      transport: 50,
      activities: 75,
      other: 25,
    };
    expect(calcBudgetTotal(budget)).toBe(450);
  });

  it('handles zero values', () => {
    const budget = {
      accommodation: 0,
      food: 0,
      transport: 0,
      activities: 0,
      other: 0,
    };
    expect(calcBudgetTotal(budget)).toBe(0);
  });

  it('handles decimal string values from Prisma Decimal type', () => {
    const budget = {
      accommodation: '100.50' as unknown as number,
      food: '200.25' as unknown as number,
      transport: '50.00' as unknown as number,
      activities: '75.75' as unknown as number,
      other: '25.00' as unknown as number,
    };
    expect(calcBudgetTotal(budget)).toBeCloseTo(451.5);
  });
});

// ---- syncUserStats ---------------------------------------------------------

describe('syncUserStats', () => {
  const mockPrisma = {
    trip: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates user with correct trip and country counts', async () => {
    mockPrisma.trip.count.mockResolvedValue(5);
    mockPrisma.trip.findMany.mockResolvedValue([
      { countryCode: 'JP' },
      { countryCode: 'DE' },
      { countryCode: 'FR' },
    ]);
    mockPrisma.user.update.mockResolvedValue({});

    await syncUserStats(mockPrisma as never, 'user-123');

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { tripsCount: 5, countriesCount: 3 },
    });
  });

  it('handles user with no trips', async () => {
    mockPrisma.trip.count.mockResolvedValue(0);
    mockPrisma.trip.findMany.mockResolvedValue([]);
    mockPrisma.user.update.mockResolvedValue({});

    await syncUserStats(mockPrisma as never, 'user-empty');

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-empty' },
      data: { tripsCount: 0, countriesCount: 0 },
    });
  });
});
