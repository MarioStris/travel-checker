export type TravelerCategory =
  | "solo"
  | "couple"
  | "family"
  | "backpacker"
  | "luxury"
  | "digital-nomad"
  | "adventure"
  | "cultural"
  | "group"
  | "business";

export type TripVisibility = "public" | "private";

export type AccommodationType =
  | "hotel"
  | "hostel"
  | "airbnb"
  | "camping"
  | "resort"
  | "apartment"
  | "other";

export type AgeRange =
  | "18-24"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55-64"
  | "65+";

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  other: number;
}

export interface Accommodation {
  name: string;
  type: AccommodationType;
  url?: string;
  rating?: number;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  destination: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  category: TravelerCategory;
  visibility: TripVisibility;
  coverPhotoUrl?: string;
  photos: TripPhoto[];
  accommodation?: Accommodation;
  budget?: BudgetBreakdown;
  totalBudget: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripPhoto {
  id: string;
  tripId: string;
  url: string;
  caption?: string;
  order: number;
  createdAt: string;
}

export interface MapPin {
  id: string;
  tripId: string;
  destination: string;
  country: string;
  latitude: number;
  longitude: number;
  category: TravelerCategory;
  coverPhotoUrl?: string;
}

export interface UserStats {
  totalTrips: number;
  totalCountries: number;
  totalContinents: number;
  totalBudget: number;
  favoriteCategory?: TravelerCategory;
  countriesVisited: string[];
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  category?: TravelerCategory;
  ageRange?: AgeRange;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  title?: string;
  description?: string;
  destination: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  category: TravelerCategory;
  visibility: TripVisibility;
  accommodation?: Accommodation;
  budget?: BudgetBreakdown;
  totalBudget?: number;
  currency?: string;
}

export interface UpdateTripInput extends Partial<CreateTripInput> {
  id: string;
}

export interface PlaceAutocompleteResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}
