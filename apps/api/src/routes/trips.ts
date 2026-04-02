import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';
import { syncUserStats, calcBudgetTotal } from '../services/trip.service.js';

export const tripRoutes = new Hono();

// Validation schemas
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
  ageRange: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  accommodation: z.object({
    name: z.string().min(1).max(200),
    type: z.enum(['hotel', 'hostel', 'airbnb', 'camping', 'friends', 'other']).default('hotel'),
    url: z.string().url().optional(),
    rating: z.number().min(1).max(5).optional(),
    notes: z.string().optional(),
  }).optional(),
  budget: z.object({
    currency: z.string().length(3).default('EUR'),
    accommodation: z.number().min(0).default(0),
    food: z.number().min(0).default(0),
    transport: z.number().min(0).default(0),
    activities: z.number().min(0).default(0),
    other: z.number().min(0).default(0),
    isApproximate: z.boolean().default(false),
  }).optional(),
});

const updateTripSchema = createTripSchema.partial();

// GET /api/trips — list my trips
tripRoutes.get('/', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const page = Number(c.req.query('page') || '1');
  const limit = Math.min(Number(c.req.query('limit') || '20'), 50);
  const offset = (page - 1) * limit;

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where: { userId },
      include: {
        budget: true,
        accommodation: true,
        photos: { take: 1, orderBy: { sortOrder: 'asc' } },
        _count: { select: { photos: true, comments: true, likes: true } },
      },
      orderBy: { startDate: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.trip.count({ where: { userId } }),
  ]);

  return c.json({
    trips: trips.map((trip) => ({
      ...trip,
      budget: trip.budget ? { ...trip.budget, total: calcBudgetTotal(trip.budget) } : null,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

// POST /api/trips — create trip
tripRoutes.post('/', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const body = await c.req.json();
  const parsed = createTripSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, 400);
  }
  const data = parsed.data;

  const trip = await prisma.$transaction(async (tx) => {
    const newTrip = await tx.trip.create({
      data: {
        userId,
        title: data.title,
        destination: data.destination,
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        season: data.season,
        travelerCategory: data.travelerCategory,
        ageRange: data.ageRange,
        description: data.description,
        isPublic: data.isPublic,
      },
    });

    if (data.accommodation) {
      await tx.accommodation.create({
        data: { tripId: newTrip.id, ...data.accommodation },
      });
    }

    if (data.budget) {
      await tx.budget.create({
        data: { tripId: newTrip.id, ...data.budget },
      });
    }

    await syncUserStats(tx as unknown as typeof prisma, userId);

    return tx.trip.findUnique({
      where: { id: newTrip.id },
      include: { budget: true, accommodation: true, photos: true },
    });
  });

  return c.json(trip, 201);
});

// GET /api/trips/:id — get trip detail
tripRoutes.get('/:id', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id');

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      budget: true,
      accommodation: true,
      photos: { orderBy: { sortOrder: 'asc' } },
      user: { select: { id: true, displayName: true, avatarUrl: true, username: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (!trip.isPublic && trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const budget = trip.budget ? { ...trip.budget, total: calcBudgetTotal(trip.budget) } : null;

  return c.json({ ...trip, budget });
});

// PATCH /api/trips/:id — update trip (owner only)
tripRoutes.patch('/:id', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id');

  const existing = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!existing) return c.json({ error: 'Trip not found' }, 404);
  if (existing.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const body = await c.req.json();
  const parsed = updateTripSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, 400);
  }
  const data = parsed.data;

  const trip = await prisma.$transaction(async (tx) => {
    const updated = await tx.trip.update({
      where: { id: tripId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.destination && { destination: data.destination }),
        ...(data.country && { country: data.country }),
        ...(data.countryCode && { countryCode: data.countryCode }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.latitude && { latitude: data.latitude }),
        ...(data.longitude && { longitude: data.longitude }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.season !== undefined && { season: data.season }),
        ...(data.travelerCategory && { travelerCategory: data.travelerCategory }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
    });

    if (data.accommodation) {
      await tx.accommodation.upsert({
        where: { tripId },
        create: { tripId, ...data.accommodation },
        update: data.accommodation,
      });
    }

    if (data.budget) {
      await tx.budget.upsert({
        where: { tripId },
        create: { tripId, ...data.budget },
        update: data.budget,
      });
    }

    return tx.trip.findUnique({
      where: { id: tripId },
      include: { budget: true, accommodation: true, photos: true },
    });
  });

  return c.json(trip);
});

// DELETE /api/trips/:id — delete trip (owner only)
tripRoutes.delete('/:id', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id');

  const existing = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!existing) return c.json({ error: 'Trip not found' }, 404);
  if (existing.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  await prisma.trip.delete({ where: { id: tripId } });
  await syncUserStats(prisma, userId);

  return c.json({ ok: true });
});

// GET /api/trips/map/pins — get all trip pins for map view
tripRoutes.get('/map/pins', requireAuth, async (c) => {
  const { userId } = getAuth(c);

  const pins = await prisma.trip.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      destination: true,
      country: true,
      countryCode: true,
      latitude: true,
      longitude: true,
      startDate: true,
      travelerCategory: true,
      coverPhotoUrl: true,
      budget: { select: { accommodation: true, food: true, transport: true, activities: true, other: true, currency: true } },
    },
    orderBy: { startDate: 'desc' },
  });

  return c.json(pins.map((pin) => ({
    ...pin,
    totalBudget: pin.budget ? calcBudgetTotal(pin.budget) : null,
    currency: pin.budget?.currency ?? 'EUR',
  })));
});
