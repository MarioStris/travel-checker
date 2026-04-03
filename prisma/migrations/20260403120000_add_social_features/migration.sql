-- Add visibility column to trips
ALTER TABLE "trips" ADD COLUMN "visibility" VARCHAR(10) NOT NULL DEFAULT 'private';

-- Create index on visibility
CREATE INDEX "trips_visibility_idx" ON "trips"("visibility");

-- Update existing trips: sync visibility with is_public
UPDATE "trips" SET "visibility" = CASE WHEN "is_public" = true THEN 'public' ELSE 'private' END;

-- Create reactions table
CREATE TABLE "reactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "trip_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "emoji" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one reaction per user per emoji per trip
CREATE UNIQUE INDEX "reactions_trip_id_user_id_emoji_key" ON "reactions"("trip_id", "user_id", "emoji");

-- Indexes
CREATE INDEX "reactions_trip_id_idx" ON "reactions"("trip_id");
CREATE INDEX "reactions_user_id_idx" ON "reactions"("user_id");

-- Foreign keys
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create friend_requests table
CREATE TABLE "friend_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "from_id" UUID NOT NULL,
    "to_id" UUID NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one request per direction
CREATE UNIQUE INDEX "friend_requests_from_id_to_id_key" ON "friend_requests"("from_id", "to_id");

-- Indexes
CREATE INDEX "friend_requests_to_id_idx" ON "friend_requests"("to_id");
CREATE INDEX "friend_requests_status_idx" ON "friend_requests"("status");

-- Foreign keys
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
