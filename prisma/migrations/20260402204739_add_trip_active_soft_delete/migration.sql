-- AlterTable
ALTER TABLE "accommodations" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "budgets" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "push_tokens" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "trip_photos" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "trips_active_idx" ON "trips"("active");
