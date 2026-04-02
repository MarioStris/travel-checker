#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate --schema=prisma/schema.prisma

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "Seeding database..."
npx tsx prisma/seed.ts 2>/dev/null || echo "Seed skipped (already seeded or error)"

echo "Starting API in dev mode..."
exec node --import tsx/esm --watch apps/api/src/index.ts
