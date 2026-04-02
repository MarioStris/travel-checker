import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';
import { getUserStats, syncUser } from '../services/user.service.js';
import {
  createR2Client,
  getBucketName,
  getCdnUrl,
  generateUploadUrl,
  deleteFromR2,
} from '../services/photo.service.js';

export const userRoutes = new Hono();

const r2 = createR2Client();

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(50).regex(/^[a-z0-9_]+$/).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  travelerCategory: z.enum([
    'solo', 'couple', 'family', 'backpacker', 'luxury',
    'digital_nomad', 'adventure', 'cultural', 'group', 'business',
  ]).optional(),
  ageRange: z.enum(['18-24', '25-34', '35-44', '45-54', '55-64', '65+']).optional(),
  isPublic: z.boolean().optional(),
});

const syncUserSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  travelerCategory: z.enum([
    'solo', 'couple', 'family', 'backpacker', 'luxury',
    'digital_nomad', 'adventure', 'cultural', 'group', 'business',
  ]).optional(),
  ageRange: z.enum(['18-24', '25-34', '35-44', '45-54', '55-64', '65+']).optional(),
});

const avatarUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().regex(/^image\/(jpeg|png|webp|heic)$/),
});

// POST /api/users/sync — Clerk webhook to create/update user
userRoutes.post('/sync', async (c) => {
  const body = await c.req.json();
  const data = syncUserSchema.parse(body);
  const user = await syncUser(prisma, data);
  return c.json(user, 201);
});

// POST /api/users/me/avatar — get presigned URL for avatar upload
userRoutes.post('/me/avatar', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const body = await c.req.json();
  const data = avatarUploadSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarR2Key: true },
  });
  if (!user) return c.json({ error: 'User not found' }, 404);

  const bucket = getBucketName();
  const cdnUrl = getCdnUrl();
  const ext = data.fileName.split('.').pop() ?? 'jpg';
  const key = `avatars/${userId}/${crypto.randomUUID()}.${ext}`;

  if (user.avatarR2Key) {
    await deleteFromR2(r2, bucket, user.avatarR2Key).catch(() => {});
  }

  const uploadUrl = await generateUploadUrl(r2, bucket, key, data.contentType, { userId });

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: `${cdnUrl}/${key}`, avatarR2Key: key },
  });

  return c.json({ uploadUrl, avatarUrl: `${cdnUrl}/${key}` }, 201);
});

// GET /api/users/me — current user profile
userRoutes.get('/me', requireAuth, async (c) => {
  const { userId } = getAuth(c);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { trips: true, followedBy: true, following: true } },
    },
  });

  if (!user) return c.json({ error: 'User not found' }, 404);

  return c.json({
    ...user,
    followersCount: user._count.followedBy,
    followingCount: user._count.following,
  });
});

// PATCH /api/users/me — update profile
userRoutes.patch('/me', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const body = await c.req.json();
  const data = updateProfileSchema.parse(body);

  if (data.username) {
    const existing = await prisma.user.findUnique({ where: { username: data.username } });
    if (existing && existing.id !== userId) {
      return c.json({ error: 'Username already taken' }, 409);
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return c.json(user);
});

// GET /api/users/me/stats — user statistics
userRoutes.get('/me/stats', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const stats = await getUserStats(prisma, userId);
  return c.json(stats);
});

// DELETE /api/users/me — GDPR delete account
userRoutes.delete('/me', requireAuth, async (c) => {
  const { userId } = getAuth(c);

  // Cascade delete handles trips, photos, comments, follows, likes
  await prisma.user.delete({ where: { id: userId } });

  // TODO: Delete R2 images, revoke Clerk session

  return c.json({ ok: true, message: 'Account and all data permanently deleted' });
});

// GET /api/users/me/export — GDPR data export
userRoutes.get('/me/export', requireAuth, async (c) => {
  const { userId } = getAuth(c);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      trips: {
        include: { budget: true, accommodation: true, photos: true, comments: true },
      },
    },
  });

  return c.json({
    exportDate: new Date().toISOString(),
    user: {
      ...user,
      trips: undefined,
    },
    trips: user?.trips || [],
  });
});

// GET /api/users/:id — public profile
userRoutes.get('/:id', requireAuth, async (c) => {
  const userId = c.req.param('id');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      displayName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      travelerCategory: true,
      countriesCount: true,
      tripsCount: true,
      isPublic: true,
      createdAt: true,
      _count: { select: { followedBy: true, following: true } },
    },
  });

  if (!user) return c.json({ error: 'User not found' }, 404);
  if (!user.isPublic) return c.json({ error: 'This profile is private' }, 403);

  return c.json(user);
});

