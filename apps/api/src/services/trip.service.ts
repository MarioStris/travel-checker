import { PrismaClient, Prisma } from '@prisma/client';

export type CreateTripInput = {
  userId: string;
  title: string;
  destination: string;
  country: string;
  countryCode: string;
  city?: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate?: string;
  season?: string;
  travelerCategory: string;
  ageRange?: string;
  description?: string;
  isPublic: boolean;
  accommodation?: {
    name: string;
    type: string;
    url?: string;
    rating?: number;
    notes?: string;
  };
  budget?: {
    currency: string;
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
    other: number;
    isApproximate: boolean;
  };
};

export async function createTripWithRelations(
  prisma: PrismaClient,
  input: CreateTripInput,
) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        userId: input.userId,
        title: input.title,
        destination: input.destination,
        country: input.country,
        countryCode: input.countryCode,
        city: input.city,
        latitude: input.latitude,
        longitude: input.longitude,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : null,
        season: input.season,
        travelerCategory: input.travelerCategory,
        ageRange: input.ageRange,
        description: input.description,
        isPublic: input.isPublic,
      },
    });

    if (input.accommodation) {
      await tx.accommodation.create({
        data: { tripId: trip.id, ...input.accommodation },
      });
    }

    if (input.budget) {
      await tx.budget.create({
        data: { tripId: trip.id, ...input.budget },
      });
    }

    await syncUserStats(tx as unknown as PrismaClient, input.userId);

    return tx.trip.findUnique({
      where: { id: trip.id },
      include: { budget: true, accommodation: true, photos: true },
    });
  });
}

export async function syncUserStats(
  prisma: PrismaClient,
  userId: string,
): Promise<void> {
  const [tripCount, uniqueCountries] = await Promise.all([
    prisma.trip.count({ where: { userId, active: true } }),
    prisma.trip.findMany({
      where: { userId, active: true },
      select: { countryCode: true },
      distinct: ['countryCode'],
    }),
  ]);

  await prisma.user.update({
    where: { id: userId },
    data: { tripsCount: tripCount, countriesCount: uniqueCountries.length },
  });
}

export function calcBudgetTotal(budget: {
  accommodation: Prisma.Decimal | number;
  food: Prisma.Decimal | number;
  transport: Prisma.Decimal | number;
  activities: Prisma.Decimal | number;
  other: Prisma.Decimal | number;
}): number {
  return (
    Number(budget.accommodation) +
    Number(budget.food) +
    Number(budget.transport) +
    Number(budget.activities) +
    Number(budget.other)
  );
}
