#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "Starting Travel Checker API..."
exec node apps/api/dist/index.js
