import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';

export const friendRoutes = new Hono();

const userSelect = { id: true, displayName: true, username: true, avatarUrl: true };

// POST /api/friends/requests — send friend request
const sendRequestSchema = z.object({
  toUserId: z.string().uuid(),
});

friendRoutes.post('/requests', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const body = await c.req.json();
  const parsed = sendRequestSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Validation failed' }, 400);

  const toUserId = parsed.data.toUserId;
  if (toUserId === userId) return c.json({ error: 'Cannot send request to yourself' }, 400);

  const toUser = await prisma.user.findUnique({ where: { id: toUserId }, select: { id: true } });
  if (!toUser) return c.json({ error: 'User not found' }, 404);

  // Check if already friends or request exists
  const existing = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { fromId: userId, toId: toUserId },
        { fromId: toUserId, toId: userId },
      ],
    },
  });

  if (existing) {
    if (existing.status === 'accepted') return c.json({ error: 'Already friends' }, 409);
    if (existing.status === 'pending') return c.json({ error: 'Request already pending' }, 409);
    // If declined, allow re-sending
    if (existing.status === 'declined' && existing.fromId === userId) {
      const updated = await prisma.friendRequest.update({
        where: { id: existing.id },
        data: { status: 'pending', updatedAt: new Date() },
        include: { fromUser: { select: userSelect }, toUser: { select: userSelect } },
      });
      return c.json(formatRequest(updated), 201);
    }
  }

  const request = await prisma.friendRequest.create({
    data: { fromId: userId, toId: toUserId },
    include: { fromUser: { select: userSelect }, toUser: { select: userSelect } },
  });

  return c.json(formatRequest(request), 201);
});

// GET /api/friends/requests — get pending requests for current user
friendRoutes.get('/requests', requireAuth, async (c) => {
  const { userId } = getAuth(c);

  const requests = await prisma.friendRequest.findMany({
    where: { toId: userId, status: 'pending' },
    include: { fromUser: { select: userSelect }, toUser: { select: userSelect } },
    orderBy: { createdAt: 'desc' },
  });

  return c.json(requests.map(formatRequest));
});

// PATCH /api/friends/requests/:id — accept or decline
const respondSchema = z.object({
  action: z.enum(['accept', 'decline']),
});

friendRoutes.patch('/requests/:id', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const requestId = c.req.param('id')!;

  const body = await c.req.json();
  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Validation failed' }, 400);

  const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
  if (!request) return c.json({ error: 'Request not found' }, 404);
  if (request.toId !== userId) return c.json({ error: 'Forbidden' }, 403);
  if (request.status !== 'pending') return c.json({ error: 'Request already resolved' }, 400);

  const newStatus = parsed.data.action === 'accept' ? 'accepted' : 'declined';

  const updated = await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: newStatus },
    include: { fromUser: { select: userSelect }, toUser: { select: userSelect } },
  });

  // If accepted, also create bidirectional Follow entries
  if (newStatus === 'accepted') {
    await prisma.follow.createMany({
      data: [
        { followerId: request.fromId, followingId: request.toId },
        { followerId: request.toId, followingId: request.fromId },
      ],
      skipDuplicates: true,
    });
  }

  return c.json(formatRequest(updated));
});

// GET /api/friends — list accepted friends
friendRoutes.get('/', requireAuth, async (c) => {
  const { userId } = getAuth(c);

  const accepted = await prisma.friendRequest.findMany({
    where: {
      status: 'accepted',
      OR: [{ fromId: userId }, { toId: userId }],
    },
    include: {
      fromUser: {
        select: {
          ...userSelect,
          bio: true,
          tripsCount: true,
          countriesCount: true,
          travelerCategory: true,
          isPublic: true,
          createdAt: true,
        },
      },
      toUser: {
        select: {
          ...userSelect,
          bio: true,
          tripsCount: true,
          countriesCount: true,
          travelerCategory: true,
          isPublic: true,
          createdAt: true,
        },
      },
    },
  });

  const friends = accepted.map((fr) => {
    const friend = fr.fromId === userId ? fr.toUser : fr.fromUser;
    return {
      ...friend,
      friendStatus: 'accepted' as const,
      mutualFriends: 0,
      publicTrips: [],
    };
  });

  return c.json(friends);
});

function formatRequest(r: {
  id: string;
  status: string;
  createdAt: Date;
  fromUser: { id: string; displayName: string; username: string | null; avatarUrl: string | null };
  toUser: { id: string; displayName: string; username: string | null; avatarUrl: string | null };
}) {
  return {
    id: r.id,
    fromUser: r.fromUser,
    toUser: r.toUser,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  };
}
