import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';
import { calcBudgetTotal } from '../services/trip.service.js';

export const budgetRoutes = new Hono();

const upsertBudgetSchema = z.object({
  currency: z.string().length(3).default('EUR'),
  accommodation: z.number().min(0).default(0),
  food: z.number().min(0).default(0),
  transport: z.number().min(0).default(0),
  activities: z.number().min(0).default(0),
  other: z.number().min(0).default(0),
  isApproximate: z.boolean().default(false),
});

// PUT /api/trips/:id/budget — upsert budget for a trip
budgetRoutes.put('/:id/budget', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id')!;

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const body = await c.req.json();
  const parsed = upsertBudgetSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, 400);
  }
  const data = parsed.data;

  const budget = await prisma.budget.upsert({
    where: { tripId },
    create: { tripId, ...data },
    update: data,
  });

  return c.json({
    data: {
      ...budget,
      total: calcBudgetTotal(budget),
    },
  });
});

// GET /api/trips/:id/budget — get budget for a trip
budgetRoutes.get('/:id/budget', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id')!;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true, isPublic: true },
  });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (!trip.isPublic && trip.userId !== userId) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const budget = await prisma.budget.findUnique({ where: { tripId } });
  if (!budget) return c.json({ error: 'No budget found for this trip' }, 404);

  return c.json({
    data: {
      ...budget,
      total: calcBudgetTotal(budget),
    },
  });
});

// DELETE /api/trips/:id/budget — remove budget
budgetRoutes.delete('/:id/budget', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('id')!;

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const existing = await prisma.budget.findUnique({ where: { tripId } });
  if (!existing) return c.json({ error: 'No budget found for this trip' }, 404);

  await prisma.budget.delete({ where: { tripId } });

  return c.body(null, 204);
});
