import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaClient } from '@prisma/client';

const PRESIGNED_EXPIRY_SECONDS = 600;
const MAX_PHOTOS_PER_TRIP = 20;

export function createR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export function getBucketName(): string {
  return process.env.R2_BUCKET ?? 'travel-checker-photos';
}

export function getCdnUrl(): string {
  return process.env.R2_CDN_URL ?? process.env.R2_ENDPOINT ?? '';
}

export function buildR2Key(tripId: string, fileName: string): string {
  const ext = fileName.split('.').pop() ?? 'jpg';
  return `trips/${tripId}/${crypto.randomUUID()}.${ext}`;
}

export async function generateUploadUrl(
  r2: S3Client,
  bucket: string,
  key: string,
  contentType: string,
  metadata: Record<string, string>,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    Metadata: metadata,
  });
  return getSignedUrl(r2, command, { expiresIn: PRESIGNED_EXPIRY_SECONDS });
}

export async function deleteFromR2(
  r2: S3Client,
  bucket: string,
  key: string,
): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function createPhotoRecord(
  prisma: PrismaClient,
  params: {
    tripId: string;
    url: string;
    r2Key: string;
    caption?: string;
    sortOrder: number;
  },
) {
  return prisma.tripPhoto.create({ data: params });
}

export async function checkPhotoLimit(
  prisma: PrismaClient,
  tripId: string,
): Promise<{ count: number; atLimit: boolean }> {
  const count = await prisma.tripPhoto.count({ where: { tripId } });
  return { count, atLimit: count >= MAX_PHOTOS_PER_TRIP };
}

export async function updateCoverIfDeleted(
  prisma: PrismaClient,
  tripId: string,
  deletedUrl: string,
  currentCoverUrl: string | null,
): Promise<void> {
  if (currentCoverUrl !== deletedUrl) return;

  const next = await prisma.tripPhoto.findFirst({
    where: { tripId },
    orderBy: { sortOrder: 'asc' },
  });

  await prisma.trip.update({
    where: { id: tripId },
    data: { coverPhotoUrl: next?.url ?? null },
  });
}
