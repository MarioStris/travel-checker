import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, getAuth } from '../middleware/auth.js';
import {
  createR2Client,
  getBucketName,
  getCdnUrl,
  buildR2Key,
  generateUploadUrl,
  deleteFromR2,
  checkPhotoLimit,
  updateCoverIfDeleted,
} from '../services/photo.service.js';

export const photoRoutes = new Hono();

const r2 = createR2Client();

const uploadSchema = z.object({
  tripId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  contentType: z.string().regex(/^image\/(jpeg|png|webp|heic)$/),
  caption: z.string().max(500).optional(),
});

// POST /api/photos/upload-url — get presigned upload URL
photoRoutes.post('/upload-url', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const body = await c.req.json();
  const data = uploadSchema.parse(body);

  const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
  if (!trip) return c.json({ error: 'Trip not found' }, 404);
  if (trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const { count, atLimit } = await checkPhotoLimit(prisma, data.tripId);
  if (atLimit) return c.json({ error: 'Maximum 20 photos per trip' }, 400);

  const bucket = getBucketName();
  const cdnUrl = getCdnUrl();
  const key = buildR2Key(data.tripId, data.fileName);

  const uploadUrl = await generateUploadUrl(r2, bucket, key, data.contentType, {
    userId,
    tripId: data.tripId,
  });

  const sortOrder = count + 1;
  const photo = await prisma.tripPhoto.create({
    data: {
      tripId: data.tripId,
      url: `${cdnUrl}/${key}`,
      r2Key: key,
      caption: data.caption,
      sortOrder,
    },
  });

  if (sortOrder === 1) {
    await prisma.trip.update({
      where: { id: data.tripId },
      data: { coverPhotoUrl: photo.url },
    });
  }

  return c.json({ uploadUrl, photo }, 201);
});

// PATCH /api/photos/:id — update caption or sort order
photoRoutes.patch('/:id', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const photoId = c.req.param('id');

  const photo = await prisma.tripPhoto.findUnique({
    where: { id: photoId },
    include: { trip: { select: { userId: true } } },
  });

  if (!photo) return c.json({ error: 'Photo not found' }, 404);
  if (photo.trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  const body = await c.req.json();
  const data = z
    .object({
      caption: z.string().max(500).optional(),
      sortOrder: z.number().int().min(1).optional(),
    })
    .parse(body);

  const updated = await prisma.tripPhoto.update({
    where: { id: photoId },
    data,
  });

  return c.json(updated);
});

// DELETE /api/photos/:id — delete photo and remove from R2
photoRoutes.delete('/:id', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const photoId = c.req.param('id');

  const photo = await prisma.tripPhoto.findUnique({
    where: { id: photoId },
    include: { trip: { select: { userId: true, id: true, coverPhotoUrl: true } } },
  });

  if (!photo) return c.json({ error: 'Photo not found' }, 404);
  if (photo.trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  if (photo.r2Key) {
    await deleteFromR2(r2, getBucketName(), photo.r2Key);
  }

  await prisma.tripPhoto.delete({ where: { id: photoId } });

  await updateCoverIfDeleted(
    prisma,
    photo.trip.id,
    photo.url,
    photo.trip.coverPhotoUrl,
  );

  return c.json({ ok: true });
});

// POST /api/photos/:id/set-cover — set photo as trip cover
photoRoutes.post('/:id/set-cover', requireAuth, async (c) => {
  const { userId } = getAuth(c);
  const photoId = c.req.param('id');

  const photo = await prisma.tripPhoto.findUnique({
    where: { id: photoId },
    include: { trip: { select: { userId: true, id: true } } },
  });

  if (!photo) return c.json({ error: 'Photo not found' }, 404);
  if (photo.trip.userId !== userId) return c.json({ error: 'Forbidden' }, 403);

  await prisma.trip.update({
    where: { id: photo.trip.id },
    data: { coverPhotoUrl: photo.url },
  });

  return c.json({ ok: true });
});
