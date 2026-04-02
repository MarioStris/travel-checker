# Tehnička Arhitektura — Travel Checker

**Datum:** 2026-03-27
**Agent:** CTO + Tech Lead
**Input:** Product Definition, UX Research, Market Analysis

---

## 1. Tech Stack Odluka

### Mobile: React Native (Expo)
**Odluka:** React Native s Expo SDK 52+
**Obrazloženje:**
- Korisnik traži samo iOS za sada, ali React Native omogućuje Android expansion bez rewrite-a
- Expo upravljani workflow — brži development, OTA updates, EAS Build
- Google Maps SDK ima odličan React Native wrapper (`react-native-maps`)
- Veliki ecosystem (image picker, camera, sharing, push)
- Tim već koristi TypeScript/React — nema learning curve gap
- **Alternativa razmatrana:** SwiftUI — bolji performance ali lock-in na iOS, manji talent pool, sporiji development

### Backend: Node.js + Hono + Prisma
**Odluka:** Hono framework na Node.js
**Obrazloženje:**
- Hono: ultra-brz, TypeScript-first, radi na Node/Bun/Edge
- Prisma ORM za PostgreSQL — type-safe queries, migracije, schema-first
- Shared TypeScript tipovi između mobile i backend (monorepo)
- Alternativa razmatrana: Express (sporiji, legacy), Fastify (dobar ali Hono je moderniji)

### Database: PostgreSQL 16 (Neon ili Supabase)
**Odluka:** Managed PostgreSQL (Neon serverless)
**Obrazloženje:**
- Neon: serverless PostgreSQL, scale-to-zero, branching za dev/staging
- PostGIS extension za geospatial queries (destinacije, proximity search)
- Dovoljan za 1M+ korisnika s pravim indeksima
- Connection pooling: PgBouncer ili Neon native

### Auth: Clerk
**Odluka:** Clerk za auth management
**Obrazloženje:**
- Apple Sign In out-of-the-box
- Email/password s MFA opcijom
- JWT tokeni, session management
- React Native SDK
- Webhook za sync s našom DB
- Alternativa: NextAuth (web-only), Supabase Auth (tied to Supabase), custom (preskupo za MVP)

### Image Storage: Cloudflare R2 + Images
**Odluka:** Cloudflare R2 za storage, Cloudflare Images za transformacije
**Obrazloženje:**
- R2: S3-compatible, NULA egress troškova (ključno za image-heavy app)
- Cloudflare Images: on-the-fly resize, WebP conversion, CDN built-in
- Jeftinije od AWS S3 + CloudFront za naš use case (mnogo čitanja)
- Cost: ~$0.015/GB storage, $0/GB egress

### Maps: Google Maps SDK for iOS (via react-native-maps)
**Odluka:** Google Maps Platform
**Obrazloženje:**
- Places API za autocomplete (destinacija search)
- Maps SDK za interaktivnu kartu s custom markerima
- Geocoding za koordinate destinacija
- Free tier: 28,500 map loads/mj, 100K geocoding requests/mj
- Fallback plan: MapLibre + OpenStreetMap nakon 50K MAU ako troškovi rastu

### Real-time (v1.1): Soketi ili polling
- Za MVP: nema real-time potrebe
- Za v1.1 (social): Server-Sent Events (SSE) za comment updates
- Za v2.0: WebSocket (Socket.io) za live feed ako se pokaže potreba

### Monorepo struktura
```
travel-checker/
├── apps/
│   ├── mobile/          # React Native (Expo)
│   └── api/             # Hono backend
├── packages/
│   ├── shared/          # Shared TypeScript types
│   └── validators/      # Zod schemas (shared validation)
├── prisma/
│   └── schema.prisma    # Database schema
├── infra/               # Docker, CI/CD
└── docs/                # Dokumentacija
```

---

## 2. System Architecture

```
                    ┌─────────────┐
                    │   iOS App   │
                    │ React Native│
                    │   (Expo)    │
                    └──────┬──────┘
                           │ HTTPS
                           ▼
                    ┌─────────────┐
                    │  Cloudflare │
                    │   (CDN +    │
                    │   WAF +     │
                    │   R2 imgs)  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  API Server │
                    │   (Hono)    │
                    │  Node.js    │
                    │  on Railway │
                    └──┬───┬───┬──┘
                       │   │   │
              ┌────────┘   │   └────────┐
              ▼            ▼            ▼
       ┌────────────┐ ┌─────────┐ ┌──────────┐
       │ PostgreSQL │ │Cloudflare│ │  Clerk   │
       │   (Neon)   │ │  R2     │ │  (Auth)  │
       │  + PostGIS │ │ Images  │ │          │
       └────────────┘ └─────────┘ └──────────┘
              │
              ▼
       ┌────────────┐
       │   Redis    │  (v1.1 — caching, rate limiting)
       │  (Upstash) │
       └────────────┘

  External Services:
  ├── Google Maps Platform (Places, Maps SDK, Geocoding)
  ├── Apple Push Notification service (APNs) — v1.1
  ├── Sentry (error tracking)
  └── PostHog (analytics)
```

---

## 3. Data Model — PostgreSQL Schema

```sql
-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id        VARCHAR(255) UNIQUE NOT NULL,  -- Clerk external ID
  email           VARCHAR(255) UNIQUE NOT NULL,
  username        VARCHAR(50) UNIQUE,
  display_name    VARCHAR(100) NOT NULL,
  bio             TEXT,
  avatar_url      VARCHAR(500),
  traveler_category VARCHAR(30) NOT NULL DEFAULT 'solo',
    -- solo, couple, family, backpacker, luxury, digital_nomad, adventure, cultural, group, business
  age_range       VARCHAR(10),  -- 18-24, 25-34, 35-44, 45-54, 55-64, 65+
  countries_count INT NOT NULL DEFAULT 0,  -- denormalized counter
  trips_count     INT NOT NULL DEFAULT 0,  -- denormalized counter
  is_public       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_clerk ON users(clerk_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_category ON users(traveler_category);

-- ============================================================
-- TRIPS
-- ============================================================
CREATE TABLE trips (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  destination     VARCHAR(200) NOT NULL,  -- "Lisbon, Portugal"
  country         VARCHAR(100) NOT NULL,
  country_code    CHAR(2) NOT NULL,       -- ISO 3166-1 alpha-2
  city            VARCHAR(100),
  latitude        DECIMAL(10, 7) NOT NULL,
  longitude       DECIMAL(10, 7) NOT NULL,
  location        GEOGRAPHY(POINT, 4326), -- PostGIS za geo queries
  start_date      DATE NOT NULL,
  end_date        DATE,
  season          VARCHAR(10),  -- spring, summer, autumn, winter
  traveler_category VARCHAR(30) NOT NULL DEFAULT 'solo',
  age_range       VARCHAR(10),
  is_public       BOOLEAN NOT NULL DEFAULT false,
  cover_photo_url VARCHAR(500),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_trips_country ON trips(country_code);
CREATE INDEX idx_trips_date ON trips(start_date DESC);
CREATE INDEX idx_trips_public ON trips(is_public) WHERE is_public = true;
CREATE INDEX idx_trips_location ON trips USING GIST(location);
CREATE INDEX idx_trips_category ON trips(traveler_category);

-- ============================================================
-- TRIP PHOTOS
-- ============================================================
CREATE TABLE trip_photos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id         UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  url             VARCHAR(500) NOT NULL,    -- Cloudflare R2 URL
  thumbnail_url   VARCHAR(500),             -- Resized version
  caption         VARCHAR(500),
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  width           INT,
  height          INT,
  size_bytes      INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photos_trip ON trip_photos(trip_id);

-- ============================================================
-- ACCOMMODATIONS
-- ============================================================
CREATE TABLE accommodations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id         UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  type            VARCHAR(30) NOT NULL DEFAULT 'hotel',
    -- hotel, hostel, airbnb, camping, friends, other
  url             VARCHAR(500),           -- Booking/Airbnb link
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accommodations_trip ON accommodations(trip_id);

-- ============================================================
-- BUDGETS
-- ============================================================
CREATE TABLE budgets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id         UUID UNIQUE NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  currency        CHAR(3) NOT NULL DEFAULT 'EUR',
  accommodation   DECIMAL(10, 2) DEFAULT 0,
  food            DECIMAL(10, 2) DEFAULT 0,
  transport       DECIMAL(10, 2) DEFAULT 0,
  activities      DECIMAL(10, 2) DEFAULT 0,
  other           DECIMAL(10, 2) DEFAULT 0,
  total           DECIMAL(10, 2) GENERATED ALWAYS AS
                  (accommodation + food + transport + activities + other) STORED,
  is_approximate  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budgets_trip ON budgets(trip_id);

-- ============================================================
-- FOLLOWS (v1.1)
-- ============================================================
CREATE TABLE follows (
  follower_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_following ON follows(following_id);

-- ============================================================
-- COMMENTS (v1.1)
-- ============================================================
CREATE TABLE comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id         UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id       UUID REFERENCES comments(id) ON DELETE CASCADE,  -- threading
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_trip ON comments(trip_id);
CREATE INDEX idx_comments_user ON comments(user_id);

-- ============================================================
-- LIKES (v1.1)
-- ============================================================
CREATE TABLE likes (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trip_id         UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, trip_id)
);

CREATE INDEX idx_likes_trip ON likes(trip_id);
```

---

## 4. API Endpoints

### Auth
| Method | Path | Opis | Auth |
|--------|------|------|------|
| POST | `/api/auth/webhook` | Clerk webhook za user sync | Clerk signature |
| GET | `/api/auth/me` | Trenutni korisnik | ✅ |

### Users
| Method | Path | Opis | Auth |
|--------|------|------|------|
| GET | `/api/users/:id` | Profil korisnika | ✅ |
| PATCH | `/api/users/me` | Update profil | ✅ |
| DELETE | `/api/users/me` | Brisanje accounta (GDPR) | ✅ |
| GET | `/api/users/:id/trips` | Tripovi korisnika | ✅ |
| GET | `/api/users/:id/stats` | Statistika (countries, trips, budget) | ✅ |
| GET | `/api/users/me/export` | Export svih podataka (GDPR) | ✅ |

### Trips
| Method | Path | Opis | Auth |
|--------|------|------|------|
| POST | `/api/trips` | Kreiraj trip | ✅ |
| GET | `/api/trips/:id` | Detalji tripa | ✅ |
| PATCH | `/api/trips/:id` | Update trip | ✅ Owner |
| DELETE | `/api/trips/:id` | Obriši trip | ✅ Owner |
| GET | `/api/trips/me` | Moji tripovi | ✅ |
| GET | `/api/trips/me/map` | Moji tripovi za kartu (lat/lng/basic) | ✅ |

### Photos
| Method | Path | Opis | Auth |
|--------|------|------|------|
| POST | `/api/trips/:id/photos` | Upload slika (multipart) | ✅ Owner |
| DELETE | `/api/trips/:tripId/photos/:photoId` | Obriši sliku | ✅ Owner |
| PATCH | `/api/trips/:id/photos/reorder` | Promijeni redoslijed | ✅ Owner |

### Budget
| Method | Path | Opis | Auth |
|--------|------|------|------|
| PUT | `/api/trips/:id/budget` | Set/update budget | ✅ Owner |
| GET | `/api/trips/:id/budget` | Budget detalji | ✅ |

### Accommodation
| Method | Path | Opis | Auth |
|--------|------|------|------|
| PUT | `/api/trips/:id/accommodation` | Set/update smještaj | ✅ Owner |

### Stats
| Method | Path | Opis | Auth |
|--------|------|------|------|
| GET | `/api/stats/me` | Moja statistika (countries, cities, total budget, avg budget) | ✅ |

### Places (proxy za Google)
| Method | Path | Opis | Auth |
|--------|------|------|------|
| GET | `/api/places/autocomplete?q=` | Google Places autocomplete | ✅ |
| GET | `/api/places/:placeId` | Place details (lat/lng, country) | ✅ |

### v1.1 — Social
| Method | Path | Opis | Auth |
|--------|------|------|------|
| POST | `/api/users/:id/follow` | Follow korisnika | ✅ |
| DELETE | `/api/users/:id/follow` | Unfollow | ✅ |
| GET | `/api/feed` | Social feed (trips od praćenih) | ✅ |
| POST | `/api/trips/:id/comments` | Dodaj komentar | ✅ |
| GET | `/api/trips/:id/comments` | Lista komentara | ✅ |
| POST | `/api/trips/:id/like` | Like trip | ✅ |
| DELETE | `/api/trips/:id/like` | Unlike | ✅ |

### Request/Response primjeri

**POST /api/trips**
```json
// Request
{
  "title": "Weekend in Lisbon",
  "destination": "Lisbon, Portugal",
  "placeId": "ChIJO_PkYRozGQ0R0DaQ7L1rXXo",
  "startDate": "2026-03-12",
  "endDate": "2026-03-18",
  "season": "spring",
  "travelerCategory": "solo",
  "description": "Amazing city with great food...",
  "isPublic": false,
  "accommodation": {
    "name": "Casa Central Airbnb",
    "type": "airbnb",
    "url": "https://airbnb.com/rooms/12345",
    "rating": 4
  },
  "budget": {
    "currency": "EUR",
    "accommodation": 220,
    "food": 180,
    "transport": 95,
    "activities": 120,
    "other": 35,
    "isApproximate": false
  }
}

// Response (201)
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Weekend in Lisbon",
  "destination": "Lisbon, Portugal",
  "country": "Portugal",
  "countryCode": "PT",
  "latitude": 38.7223,
  "longitude": -9.1393,
  "startDate": "2026-03-12",
  "endDate": "2026-03-18",
  "season": "spring",
  "travelerCategory": "solo",
  "description": "Amazing city with great food...",
  "isPublic": false,
  "coverPhotoUrl": null,
  "accommodation": { ... },
  "budget": { ..., "total": 650 },
  "photos": [],
  "createdAt": "2026-03-27T10:00:00Z"
}
```

---

## 5. Non-Functional Requirements

### Performance
| Metrika | Target | Mjerenje |
|---------|--------|----------|
| API response time (p95) | < 200ms | Sentry/PostHog |
| API response time (p99) | < 500ms | Sentry |
| Image upload | < 3s za 5MB | Client-side |
| Map initial load | < 1.5s | Client-side |
| App cold start | < 2s | React Native Perf |
| Trip list load (50 items) | < 300ms | API |

### Skalabilnost
| Faza | Users | Strategija |
|------|-------|-----------|
| Launch (0-10K) | 10K MAU | Single Railway instance, Neon free tier |
| Growth (10-50K) | 50K MAU | 2x Railway instances, Neon Pro, Redis cache |
| Scale (50K-100K) | 100K MAU | Auto-scaling, read replicas, CDN optimization |
| Large (100K-500K) | 500K MAU | Kubernetes, DB sharding, dedicated image pipeline |

### Availability
- Target: 99.5% uptime (MVP), 99.9% (v2.0)
- Health check endpoint: GET `/api/health`
- Automatic restart on crash (Railway)
- Database backups: daily automated (Neon)

### Security
- Sve API calls over HTTPS (TLS 1.3)
- JWT validation na svakom authenticated endpointu
- Rate limiting: 100 req/min per user, 1000 req/min global
- Input validation: Zod schemas na svakom endpointu
- SQL injection prevention: Prisma (parameterized queries)
- CORS: samo naš mobile app bundle ID
- Image upload: max 10MB, samo JPEG/PNG/WebP, virus scan

---

## 6. Technical Debt strategija

### "Quick for MVP" (refaktor u v1.1)
| Stavka | MVP pristup | Proper rješenje (v1.1+) |
|--------|------------|------------------------|
| Caching | Nema cachiranja | Redis za user profiles, trip lists, stats |
| Search | Basic ILIKE query | PostgreSQL full-text search ili Meilisearch |
| Image processing | Sync upload → R2 | Async queue (BullMQ) → resize → R2 |
| Stats | Izračun pri svakom requestu | Materialized views, denormalized counters |
| Feed | N/A (nema u MVP) | Fan-out on write ili fan-out on read |
| Rate limiting | Basic in-memory | Redis-based sliding window |
| Monitoring | Sentry errors only | Full observability (metrics, traces, logs) |

### Nikad ne skraćuj na:
- ❌ Auth/Security — uvijek full implementation
- ❌ Data validation — Zod schemas od dana 1
- ❌ Database migracije — Prisma migrate, nikad raw ALTER
- ❌ TypeScript strict — no `any`, no `@ts-ignore`
- ❌ Error handling — proper error codes i poruke
