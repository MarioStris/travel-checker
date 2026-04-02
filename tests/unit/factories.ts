/**
 * Test Data Factory — generates typed test fixtures.
 * Never hardcode IDs or dates in test files — use these factories.
 */

import { randomUUID } from 'crypto';

export function makeUserId(): string {
  return `user_${randomUUID()}`;
}

export function makeTripId(): string {
  return randomUUID();
}

export function makePhotoId(): string {
  return randomUUID();
}

export function makeUser(overrides: Partial<UserFixture> = {}): UserFixture {
  const id = makeUserId();
  return {
    id,
    clerkId: `clerk_${randomUUID()}`,
    email: `user_${id}@test.com`,
    displayName: 'Test User',
    username: `testuser_${id.slice(0, 8)}`,
    bio: null,
    avatarUrl: null,
    travelerCategory: 'solo',
    ageRange: null,
    isPublic: false,
    tripsCount: 0,
    countriesCount: 0,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    _count: { trips: 0, followedBy: 0, following: 0 },
    ...overrides,
  };
}

export function makeTrip(overrides: Partial<TripFixture> = {}): TripFixture {
  const id = makeTripId();
  const userId = makeUserId();
  return {
    id,
    userId,
    title: 'Test Trip to Paris',
    destination: 'Paris, France',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    startDate: new Date('2024-06-01T00:00:00Z'),
    endDate: new Date('2024-06-10T00:00:00Z'),
    season: 'summer',
    travelerCategory: 'solo',
    ageRange: '25-34',
    description: null,
    isPublic: false,
    coverPhotoUrl: null,
    budget: null,
    accommodation: null,
    photos: [],
    _count: { photos: 0, comments: 0, likes: 0 },
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function makeBudget(tripId: string, overrides: Partial<BudgetFixture> = {}): BudgetFixture {
  return {
    id: randomUUID(),
    tripId,
    currency: 'EUR',
    accommodation: 500,
    food: 300,
    transport: 200,
    activities: 150,
    other: 50,
    isApproximate: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function makeAccommodation(
  tripId: string,
  overrides: Partial<AccommodationFixture> = {},
): AccommodationFixture {
  return {
    id: randomUUID(),
    tripId,
    name: 'Hotel Test Paris',
    type: 'hotel',
    url: 'https://hotel-test.example.com',
    rating: 4,
    notes: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function makePhoto(tripId: string, overrides: Partial<PhotoFixture> = {}): PhotoFixture {
  const id = makePhotoId();
  return {
    id,
    tripId,
    url: `https://cdn.example.com/photos/${id}.jpg`,
    r2Key: `photos/${tripId}/${id}.jpg`,
    caption: null,
    sortOrder: 1,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function makeAuthContext(userId: string) {
  return {
    userId,
    clerkId: `clerk_${randomUUID()}`,
    email: `user@test.com`,
  };
}

// Type definitions for fixtures
export interface UserFixture {
  id: string;
  clerkId: string;
  email: string;
  displayName: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  travelerCategory: string;
  ageRange: string | null;
  isPublic: boolean;
  tripsCount: number;
  countriesCount: number;
  createdAt: Date;
  updatedAt: Date;
  _count: { trips: number; followedBy: number; following: number };
}

export interface TripFixture {
  id: string;
  userId: string;
  title: string;
  destination: string;
  country: string;
  countryCode: string;
  city: string | null;
  latitude: number;
  longitude: number;
  startDate: Date;
  endDate: Date | null;
  season: string | null;
  travelerCategory: string;
  ageRange: string | null;
  description: string | null;
  isPublic: boolean;
  coverPhotoUrl: string | null;
  budget: BudgetFixture | null;
  accommodation: AccommodationFixture | null;
  photos: PhotoFixture[];
  _count: { photos: number; comments: number; likes: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetFixture {
  id: string;
  tripId: string;
  currency: string;
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  other: number;
  isApproximate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccommodationFixture {
  id: string;
  tripId: string;
  name: string;
  type: string;
  url: string | null;
  rating: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotoFixture {
  id: string;
  tripId: string;
  url: string;
  r2Key: string;
  caption: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
