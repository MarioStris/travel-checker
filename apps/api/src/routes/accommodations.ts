import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';

export const accommodationRoutes = new Hono();

const upsertAccommodationSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['hotel', 'hostel', 'airbnb', 'camping', 'friends', 'other']).default('hotel'),
  url: z.string().url().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// PUT /api/trips/:id/accommodation — upsert accommodation for a trip
accommodationRoutes.put('/:id/accommodation', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id');

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const body = await c.req.json();
  const parsed = upsertAccommodationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, 400);
  }
  const data = parsed.data;

  const accommodation = await prisma.accommodation.upsert({
    where: { tripId },
    create: { tripId, ...data },
    update: data,
  });

  return c.json({ data: accommodation });
});

// GET /api/trips/:id/accommodation — get accommodation for a trip
accommodationRoutes.get('/:id/accommodation', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id');

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true, isPublic: true },
  });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (!trip.isPublic && trip.userId !== userId) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const accommodation = await prisma.accommodation.findUnique({ where: { tripId } });
  if (!accommodation) return c.json({ error: 'No accommodation found for this trip' }, 404);

  return c.json({ data: accommodation });
});

// DELETE /api/trips/:id/accommodation — remove accommodation
accommodationRoutes.delete('/:id/accommodation', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id');

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const existing = await prisma.accommodation.findUnique({ where: { tripId } });
  if (!existing) return c.json({ error: 'No accommodation found for this trip' }, 404);

  await prisma.accommodation.delete({ where: { tripId } });

  return c.body(null, 204);
});
