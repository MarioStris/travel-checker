import { PrismaClient } from '@prisma/client';
import { getContinent } from '../lib/continents.js';

export async function getUserStats(prisma: PrismaClient, userId: string) {
  const [tripCount, countries, budgetAgg, photoCount] = await Promise.all([
    prisma.trip.count({ where: { userId } }),
    prisma.trip.findMany({
      where: { userId },
      select: { countryCode: true, country: true },
      distinct: ['countryCode'],
    }),
    prisma.budget.aggregate({
      where: { trip: { userId } },
      _sum: {
        accommodation: true,
        food: true,
        transport: true,
        activities: true,
        other: true,
      },
    }),
    prisma.tripPhoto.count({ where: { trip: { userId } } }),
  ]);

  const sum = budgetAgg._sum;
  const totalBudget =
    Number(sum.accommodation ?? 0) +
    Number(sum.food ?? 0) +
    Number(sum.transport ?? 0) +
    Number(sum.activities ?? 0) +
    Number(sum.other ?? 0);

  const continents = new Set(countries.map((c) => getContinent(c.countryCode)));

  return {
    trips: tripCount,
    countries: countries.length,
    continents: continents.size,
    photos: photoCount,
    totalBudget: Math.round(totalBudget * 100) / 100,
    budgetBreakdown: {
      accommodation: Number(sum.accommodation ?? 0),
      food: Number(sum.food ?? 0),
      transport: Number(sum.transport ?? 0),
      activities: Number(sum.activities ?? 0),
      other: Number(sum.other ?? 0),
    },
    countriesList: countries.map((c) => ({
      code: c.countryCode,
      name: c.country,
      continent: getContinent(c.countryCode),
    })),
  };
}

export async function syncUser(
  prisma: PrismaClient,
  params: {
    clerkId: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
    travelerCategory?: string;
    ageRange?: string;
  },
) {
  return prisma.user.upsert({
    where: { clerkId: params.clerkId },
    create: {
      clerkId: params.clerkId,
      email: params.email,
      displayName: params.displayName ?? params.email.split('@')[0],
      avatarUrl: params.avatarUrl,
      travelerCategory: params.travelerCategory ?? 'solo',
      ageRange: params.ageRange,
    },
    update: {
      email: params.email,
      ...(params.displayName && { displayName: params.displayName }),
      ...(params.avatarUrl && { avatarUrl: params.avatarUrl }),
    },
  });
}
