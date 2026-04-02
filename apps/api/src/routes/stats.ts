import { Hono } from 'hono';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';
import { getUserStats } from '../services/user.service.js';

export const statsRoutes = new Hono();

// GET /api/stats/me — detailed stats for the authenticated user
statsRoutes.get('/me', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const stats = await getUserStats(prisma, userId);
  return c.json({ data: stats });
});

// GET /api/stats/leaderboard — top travelers by country count (public only)
statsRoutes.get('/leaderboard', requireAuth, async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? '10'), 50);

  const users = await prisma.user.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      displayName: true,
      username: true,
      avatarUrl: true,
      travelerCategory: true,
      countriesCount: true,
      tripsCount: true,
    },
    orderBy: { countriesCount: 'desc' },
    take: limit,
  });

  return c.json({ data: users });
});
