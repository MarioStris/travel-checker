import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';

export const socialRoutes = new Hono();

// ---------- Reactions ----------

// GET /api/trips/:tripId/reactions — get reaction summary for a trip
socialRoutes.get('/:tripId/reactions', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('tripId')!;

  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);

  const reactions = await prisma.reaction.findMany({ where: { tripId } });

  const emojiMap = new Map<string, { count: number; reacted: boolean }>();
  for (const r of reactions) {
    const existing = emojiMap.get(r.emoji);
    if (existing) {
      existing.count++;
      if (r.userId === userId) existing.reacted = true;
    } else {
      emojiMap.set(r.emoji, { count: 1, reacted: r.userId === userId });
    }
  }

  const summary = Array.from(emojiMap.entries()).map(([emoji, data]) => ({
    emoji,
    count: data.count,
    reacted: data.reacted,
  }));

  return c.json(summary);
});

// POST /api/trips/:tripId/reactions — add reaction
const addReactionSchema = z.object({
  emoji: z.string().min(1).max(10),
});

socialRoutes.post('/:tripId/reactions', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('tripId')!;

  const body = await c.req.json();
  const parsed = addReactionSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Validation failed' }, 400);

  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);

  const reaction = await prisma.reaction.upsert({
    where: { tripId_userId_emoji: { tripId, userId, emoji: parsed.data.emoji } },
    create: { tripId, userId, emoji: parsed.data.emoji },
    update: {},
    include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
  });

  return c.json({
    id: reaction.id,
    tripId: reaction.tripId,
    userId: reaction.userId,
    emoji: reaction.emoji,
    user: reaction.user,
    createdAt: reaction.createdAt.toISOString(),
  }, 201);
});

// DELETE /api/trips/:tripId/reactions — remove reaction
socialRoutes.delete('/:tripId/reactions', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('tripId')!;

  const body = await c.req.json();
  const emoji = body?.emoji;
  if (!emoji) return c.json({ error: 'Missing emoji' }, 400);

  await prisma.reaction.deleteMany({ where: { tripId, userId, emoji } });

  return c.json({ ok: true });
});

// ---------- Comments ----------

// GET /api/trips/:tripId/comments — list comments
socialRoutes.get('/:tripId/comments', requireAuth, async (c) => {
  const tripId = c.req.param('tripId')!;
  const page = Number(c.req.query('page') || '1');
  const pageSize = Math.min(Number(c.req.query('pageSize') || '20'), 50);
  const offset = (page - 1) * pageSize;

  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { tripId, parentId: null },
      include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: pageSize,
    }),
    prisma.comment.count({ where: { tripId, parentId: null } }),
  ]);

  return c.json({
    comments: comments.map((cm) => ({
      id: cm.id,
      tripId: cm.tripId,
      userId: cm.userId,
      text: cm.body,
      user: cm.user,
      createdAt: cm.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
  });
});

// POST /api/trips/:tripId/comments — add comment
const addCommentSchema = z.object({
  text: z.string().min(1).max(1000),
});

socialRoutes.post('/:tripId/comments', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const tripId = c.req.param('tripId')!;

  const body = await c.req.json();
  const parsed = addCommentSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Validation failed' }, 400);

  const trip = await prisma.trip.findUnique({ where: { id: tripId }, select: { id: true } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);

  const comment = await prisma.comment.create({
    data: { tripId, userId, body: parsed.data.text },
    include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
  });

  return c.json({
    id: comment.id,
    tripId: comment.tripId,
    userId: comment.userId,
    text: comment.body,
    user: comment.user,
    createdAt: comment.createdAt.toISOString(),
  }, 201);
});

// DELETE /api/trips/:tripId/comments/:commentId — delete own comment
socialRoutes.delete('/:tripId/comments/:commentId', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const commentId = c.req.param('commentId')!;

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return c.json({ error: 'Comment not found' }, 404);
  if (comment.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  await prisma.comment.delete({ where: { id: commentId } });

  return c.json({ ok: true });
});
