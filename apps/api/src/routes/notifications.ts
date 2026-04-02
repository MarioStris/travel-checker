import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';

export const notificationRoutes = new Hono();

const registerTokenSchema = z.object({
  token: z.string().min(1).max(200),
  platform: z.enum(['expo', 'apns', 'fcm']).default('expo'),
});

// POST /api/notifications/register-token — register or upsert Expo push token
notificationRoutes.post('/register-token', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const body = await c.req.json();
  const data = registerTokenSchema.parse(body);

  await prisma.pushToken.upsert({
    where: { userId_token: { userId, token: data.token } },
    create: { userId, token: data.token, platform: data.platform },
    update: { platform: data.platform, updatedAt: new Date() },
  });

  return c.json({ ok: true }, 201);
});

// DELETE /api/notifications/register-token — remove a push token
notificationRoutes.delete('/register-token', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const body = await c.req.json();
  const { token } = z.object({ token: z.string().min(1) }).parse(body);

  const existing = await prisma.pushToken.findUnique({
    where: { userId_token: { userId, token } },
  });

  if (!existing) return c.json({ error: 'Token not found' }, 404);
  if (existing.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  await prisma.pushToken.delete({
    where: { userId_token: { userId, token } },
  });

  return c.json({ ok: true });
});
