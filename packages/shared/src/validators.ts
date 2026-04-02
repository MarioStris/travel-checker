import { z } from 'zod';

// ---- Reusable field schemas -----------------------------------------------

export const travelerCategorySchema = z.enum([
  'solo',
  'couple',
  'family',
  'backpacker',
  'luxury',
  'digital_nomad',
  'adventure',
  'cultural',
  'group',
  'business',
]);

export const ageRangeSchema = z.enum([
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
]);

export const seasonSchema = z.enum(['spring', 'summer', 'autumn', 'winter']);

export const accommodationTypeSchema = z.enum([
  'hotel',
  'hostel',
  'airbnb',
  'camping',
  'friends',
  'other',
]);

export const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: 'Date must be in YYYY-MM-DD format',
});

export const uuidSchema = z.string().uuid();

// ---- User validators ------------------------------------------------------

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers and underscores')
    .optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  travelerCategory: travelerCategorySchema.optional(),
  ageRange: ageRangeSchema.optional(),
  isPublic: z.boolean().optional(),
});

export const syncUserSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
  travelerCategory: travelerCategorySchema.optional(),
  ageRange: ageRangeSchema.optional(),
});

// ---- Accommodation validators ---------------------------------------------

export const upsertAccommodationSchema = z.object({
  name: z.string().min(1).max(200),
  type: accommodationTypeSchema.default('hotel'),
  url: z.string().url().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// ---- Budget validators ----------------------------------------------------

export const upsertBudgetSchema = z.object({
  currency: z.string().length(3).default('EUR'),
  accommodation: z.number().min(0).default(0),
  food: z.number().min(0).default(0),
  transport: z.number().min(0).default(0),
  activities: z.number().min(0).default(0),
  other: z.number().min(0).default(0),
  isApproximate: z.boolean().default(false),
});

// ---- Trip validators ------------------------------------------------------

export const createTripSchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  countryCode: z.string().length(2),
  city: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  startDate: dateStringSchema,
  endDate: dateStringSchema.optional(),
  season: seasonSchema.optional(),
  travelerCategory: travelerCategorySchema.default('solo'),
  ageRange: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  accommodation: upsertAccommodationSchema.optional(),
  budget: upsertBudgetSchema.optional(),
});

export const updateTripSchema = createTripSchema.partial();

// ---- Photo validators -----------------------------------------------------

export const requestUploadUrlSchema = z.object({
  tripId: uuidSchema,
  fileName: z.string().min(1).max(255),
  contentType: z.string().regex(/^image\/(jpeg|png|webp|heic)$/, {
    message: 'contentType must be image/jpeg, image/png, image/webp, or image/heic',
  }),
  caption: z.string().max(500).optional(),
});

export const updatePhotoSchema = z.object({
  caption: z.string().max(500).optional(),
  sortOrder: z.number().int().min(1).optional(),
});

// ---- Pagination -----------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ---- Inferred types -------------------------------------------------------

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SyncUserInput = z.infer<typeof syncUserSchema>;
export type UpsertAccommodationInput = z.infer<typeof upsertAccommodationSchema>;
export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type RequestUploadUrlInput = z.infer<typeof requestUploadUrlSchema>;
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;
