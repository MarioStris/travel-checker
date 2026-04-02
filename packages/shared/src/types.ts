// ---- Enums ----------------------------------------------------------------

export type TravelerCategory =
  | 'solo'
  | 'couple'
  | 'family'
  | 'backpacker'
  | 'luxury'
  | 'digital_nomad'
  | 'adventure'
  | 'cultural'
  | 'group'
  | 'business';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';

export type AccommodationType =
  | 'hotel'
  | 'hostel'
  | 'airbnb'
  | 'camping'
  | 'friends'
  | 'other';

// ---- User DTOs ------------------------------------------------------------

export type UserDTO = {
  id: string;
  clerkId: string;
  email: string;
  username: string | null;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  travelerCategory: TravelerCategory;
  ageRange: AgeRange | null;
  countriesCount: number;
  tripsCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicUserDTO = Pick<
  UserDTO,
  | 'id'
  | 'username'
  | 'displayName'
  | 'bio'
  | 'avatarUrl'
  | 'travelerCategory'
  | 'countriesCount'
  | 'tripsCount'
  | 'isPublic'
  | 'createdAt'
>;

export type UpdateProfileInput = {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  travelerCategory?: TravelerCategory;
  ageRange?: AgeRange;
  isPublic?: boolean;
};

// ---- Trip DTOs ------------------------------------------------------------

export type TripDTO = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  destination: string;
  country: string;
  countryCode: string;
  city: string | null;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string | null;
  season: Season | null;
  travelerCategory: TravelerCategory;
  ageRange: AgeRange | null;
  isPublic: boolean;
  coverPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  budget?: BudgetDTO | null;
  accommodation?: AccommodationDTO | null;
  photos?: TripPhotoDTO[];
};

export type CreateTripInput = {
  title: string;
  destination: string;
  country: string;
  countryCode: string;
  city?: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate?: string;
  season?: Season;
  travelerCategory?: TravelerCategory;
  ageRange?: string;
  description?: string;
  isPublic?: boolean;
  accommodation?: CreateAccommodationInput;
  budget?: CreateBudgetInput;
};

export type UpdateTripInput = Partial<CreateTripInput>;

// ---- Photo DTOs -----------------------------------------------------------

export type TripPhotoDTO = {
  id: string;
  tripId: string;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  sortOrder: number;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  createdAt: string;
};

export type RequestUploadUrlInput = {
  tripId: string;
  fileName: string;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/heic';
  caption?: string;
};

export type UploadUrlResponse = {
  uploadUrl: string;
  photo: TripPhotoDTO;
};

// ---- Accommodation DTOs ---------------------------------------------------

export type AccommodationDTO = {
  id: string;
  tripId: string;
  name: string;
  type: AccommodationType;
  url: string | null;
  rating: number | null;
  notes: string | null;
  createdAt: string;
};

export type CreateAccommodationInput = {
  name: string;
  type?: AccommodationType;
  url?: string;
  rating?: number;
  notes?: string;
};

// ---- Budget DTOs ----------------------------------------------------------

export type BudgetDTO = {
  id: string;
  tripId: string;
  currency: string;
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  other: number;
  total: number;
  isApproximate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateBudgetInput = {
  currency?: string;
  accommodation?: number;
  food?: number;
  transport?: number;
  activities?: number;
  other?: number;
  isApproximate?: boolean;
};

// ---- Stats DTOs -----------------------------------------------------------

export type UserStatsDTO = {
  trips: number;
  countries: number;
  continents: number;
  photos: number;
  totalBudget: number;
  budgetBreakdown: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
    other: number;
  };
  countriesList: { code: string; name: string; continent: string }[];
};

// ---- API response wrapper -------------------------------------------------

export type ApiResponse<T> = {
  data: T;
  error?: never;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  data?: never;
  error: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ---- Map Pin DTO ----------------------------------------------------------

export type MapPin = {
  id: string;
  title: string;
  destination: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  startDate: string;
  travelerCategory: TravelerCategory;
  coverPhotoUrl: string | null;
  totalBudget: number | null;
  currency: string;
};

// ---- Places DTOs ----------------------------------------------------------

export type PlacePrediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

export type PlaceDetails = {
  name: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  city: string;
};
