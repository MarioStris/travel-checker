# Sprint Plan — Travel Checker MVP

**Projekt**: Travel Checker
**Tip aplikacije**: iOS mobile app (React Native / Expo)
**Trajanje MVP-a**: 10–12 tjedana (5 aktivnih sprintova + 1 buffer sprint)
**Sprint duljina**: 2 tjedna
**Datum početka**: 2026-03-30
**Datum završetka (RC)**: 2026-06-19
**Agent:** Engineering Manager

**Tim kapacitet po sprintu** (80% pravilo):
- Backend developer: 80 h / sprint
- Frontend/Mobile developer: 80 h / sprint
- Full-stack developer: 64 h / sprint
- Ukupan capacity: ~224 h planiranih, ~56 h buffer

---

## Definition of Done (cijeli projekt)

Za svaki task/story:
1. Kod napisan, pregledan i mergean u `main`
2. Unit testovi napisani i prolaze (>80% pokrivenost poslovne logike)
3. Nema TypeScript grešaka (`tsc --noEmit` prođe)
4. ESLint + Prettier prolaze
5. Testirano na fizičkom iOS uređaju ili Simulatoru
6. API endpointi dokumentirani
7. Nema `console.log` u produkcijskom kodu
8. PR opisan s: što, zašto, kako testirati
9. Demo prikazan Product Owneru na Sprint Review
10. Acceptance criteria eksplicitno ispunjeni

Za cijeli MVP:
- Sve Must Have User Stories implementirane i prihvaćene
- App prolazi Apple App Store Review Guidelines
- Crash-free rate > 99% na TestFlight beta testiranju
- Nema P0 ili P1 bugova na Release Candidateu

---

## Milestone Checkpoints

| Milestone | Sprint | Datum | Kriterij |
|-----------|--------|-------|----------|
| **Alpha** | Kraj S4 | 2026-05-24 | Auth, Trip CRUD, Karta, Budget, Profil — interno testiranje |
| **Beta (TestFlight)** | Kraj S5 | 2026-06-07 | Svi featuri polirani, distribucija na 5-10 testera |
| **Release Candidate** | Sprint 6 start | 2026-06-08 | E2E testovi prolaze, App Store materijali gotovi |
| **Launch (App Store)** | Kraj S6 | 2026-06-19 | App Store Review prošao, live |

---

## Sprint 1: Project Setup + Auth + Core Models
**Trajanje**: 2026-03-30 – 2026-04-12
**Sprint Goal**: Postaviti razvojnu infrastrukturu, integrirati Clerk autentikaciju i definirati temeljne modele.
**Ukupna procjena**: 66 h

| Task | Opis | Assignee | Procjena | Dependencies |
|------|------|----------|:--------:|-------------|
| TASK-001 | Monorepo inicijalizacija (apps/mobile, apps/api, packages/shared) | Full-stack | 6h | - |
| TASK-002 | Expo projekt setup (TypeScript strict, NativeWind, EAS Build config) | Frontend | 8h | TASK-001 |
| TASK-003 | Hono API backend setup (routes/, middleware/, services/, health check) | Backend | 6h | TASK-001 |
| TASK-004 | PostgreSQL schema (Neon + Prisma): User, Trip, Location, Photo, Budget | Backend | 10h | TASK-003 |
| TASK-005 | Clerk auth — backend middleware (requireAuth, sync-user endpoint) | Backend | 8h | TASK-004 |
| TASK-006 | Clerk auth — mobile (Apple Sign In, Email, JWT Provider) | Frontend | 10h | TASK-002, TASK-005 |
| TASK-007 | Navigation setup (Expo Router, tab bar, auth guard) | Frontend | 8h | TASK-006 |
| TASK-008 | Shared TypeScript tipovi (TripDTO, UserDTO, BudgetDTO...) | Full-stack | 4h | TASK-004 |
| TASK-009 | CI/CD osnova (GitHub Actions: tsc, eslint, vitest) | Full-stack | 6h | TASK-002, TASK-003 |

**Acceptance Criteria highlights:**
- `GET /health` vraća `{ status: "ok" }`
- Login radi na iOS Simulator (Apple Sign In + Email)
- Bottom Tab navigacija (Trips, Map, Profile) s placeholder ekranima
- `prisma migrate dev` prolazi, seed skripta kreira test podatke
- CI pipeline završi u < 5 minuta

---

## Sprint 2: Trip CRUD + Google Places + Budget
**Trajanje**: 2026-04-13 – 2026-04-26
**Sprint Goal**: Korisnik može kreirati, pregledati, urediti i izbrisati putovanje, pretražiti destinacije i pratiti budget.
**Ukupna procjena**: 90 h

| Task | Opis | Assignee | Procjena | Dependencies |
|------|------|----------|:--------:|-------------|
| TASK-010 | Trip API — CRUD (GET/POST/PUT/DELETE /trips) + paginacija + auth | Backend | 12h | TASK-005, TASK-008 |
| TASK-011 | Location API — CRUD (/trips/:id/locations) + koordinate validacija | Backend | 10h | TASK-010 |
| TASK-012 | Budget API — CRUD (/trips/:id/budget) + summary by category | Backend | 10h | TASK-010 |
| TASK-013 | Trip List ekran (FlatList, kartice, pull-to-refresh, empty state) | Frontend | 12h | TASK-010, TASK-007 |
| TASK-014 | Trip Create/Edit ekran (forma, validacija, date picker) | Frontend | 14h | TASK-010, TASK-013 |
| TASK-015 | Google Places proxy — backend (autocomplete + details, rate limit) | Backend | 8h | TASK-005 |
| TASK-016 | Google Places search — mobile (autocomplete dropdown, debounce) | Frontend | 10h | TASK-014, TASK-015 |
| TASK-017 | Budget ekran (summary bar, kategorije, swipe-to-delete, unos forma) | Frontend | 14h | TASK-012, TASK-013 |

---

## Sprint 3: Karta (Google Maps) + Photo Upload
**Trajanje**: 2026-04-27 – 2026-05-10
**Sprint Goal**: Korisnik može pregledati putovanja na interaktivnoj karti i dodavati fotografije.
**Ukupna procjena**: 70 h

| Task | Opis | Assignee | Procjena | Dependencies |
|------|------|----------|:--------:|-------------|
| TASK-018 | Google Maps ekran — sva putovanja (react-native-maps, clustering, callout) | Frontend | 14h | TASK-011, TASK-007 |
| TASK-019 | Trip Detail — karta s lokacijama + PolyLine rute | Frontend | 12h | TASK-011, TASK-018 |
| TASK-020 | Cloudflare R2 upload — backend (presigned URL, CRUD photos) | Backend | 12h | TASK-010 |
| TASK-021 | Photo upload — mobile (expo-image-picker, progress bar, galerija) | Frontend | 14h | TASK-020 |
| TASK-022 | Lokacija dodavanje ekran (Places search, date picker, bilješka) | Frontend | 10h | TASK-019, TASK-016 |
| TASK-023 | Image compression na klijentu (expo-image-manipulator, max 1920px) | Full-stack | 8h | TASK-021 |

---

## Sprint 4: Profil + Stats + Navigation Polish
**Trajanje**: 2026-05-11 – 2026-05-24
**Sprint Goal**: Funkcionalan profil sa statistikama, navigacija i UI flow polirani za Alpha.
**Ukupna procjena**: 66 h

| Task | Opis | Assignee | Procjena | Dependencies |
|------|------|----------|:--------:|-------------|
| TASK-024 | User profil API (GET/PUT /users/me, GET /users/me/stats) | Backend | 8h | TASK-005 |
| TASK-025 | Avatar upload — backend (presigned URL, stari avatar brisanje) | Backend | 6h | TASK-024 |
| TASK-026 | Profil ekran (avatar, bio, stats kartice, edit, logout) | Frontend | 12h | TASK-024, TASK-025 |
| TASK-027 | Trip statistike (chart budget po kategorijama, trajanje, fotki) | Frontend | 10h | TASK-012 |
| TASK-028 | Trip Detail — kompletna navigacija (4 taba: Overview, Map, Photos, Budget) | Frontend | 12h | TASK-013, TASK-017, TASK-019, TASK-021 |
| TASK-029 | Push notifikacije setup (expo-notifications, token registracija) | Full-stack | 8h | TASK-024 |
| TASK-030 | UI/UX polish (Reanimated animacije, skeleton loading, 60fps scroll) | Frontend | 10h | TASK-013, TASK-028 |

**🏁 ALPHA MILESTONE — Kraj Sprint 4 → interno TestFlight testiranje**

---

## Sprint 5: Polish, Testing, App Store Prep
**Trajanje**: 2026-05-25 – 2026-06-07
**Sprint Goal**: App stabilna, testirana i pripremljena za App Store Review.
**Ukupna procjena**: 70 h

| Task | Opis | Assignee | Procjena | Dependencies |
|------|------|----------|:--------:|-------------|
| TASK-031 | E2E testovi (Maestro: login, trip CRUD, karta, photos, budget) | Full-stack | 14h | Svi |
| TASK-032 | API integracijski testovi (Vitest, >80% coverage routes/) | Backend | 12h | TASK-010→024 |
| TASK-033 | Performance optimizacija API (indeksi, N+1, caching stats) | Backend | 8h | TASK-010, TASK-024 |
| TASK-034 | App Store materijali (icon, screenshots, opis, Privacy Policy) | Full-stack | 8h | TASK-028 |
| TASK-035 | Sentry crash reporting (react-native + node, source maps) | Full-stack | 6h | TASK-009 |
| TASK-036 | Accessibility audit (VoiceOver, labels, kontrast ≥ 4.5:1) | Frontend | 8h | TASK-028 |
| TASK-037 | Security pregled (OWASP, secrets, rate limiting, CORS) | Backend | 8h | Svi backend |
| TASK-038 | Beta TestFlight distribucija (EAS build, upload, invite testera) | Full-stack | 6h | TASK-031, TASK-034 |

**🏁 BETA MILESTONE — Kraj Sprint 5 → TestFlight distribucija testerima**

---

## Sprint 6 (Buffer): Bug Fixes, Performance, Launch
**Trajanje**: 2026-06-08 – 2026-06-19
**Sprint Goal**: Adresirati kritične bugove, finalizirati App Store submission, LAUNCH.
**Ukupna procjena**: 50 h

| Task | Opis | Assignee | Procjena |
|------|------|----------|:--------:|
| TASK-039 | P0/P1 bugovi s TestFlight feedbacka | Backend + Frontend | 24h |
| TASK-040 | Performance bugfixevi (jank, spori ekrani) | Frontend | 10h |
| TASK-041 | App Store submission + Review praćenje | Full-stack | 6h |
| TASK-042 | Produkcijska baza — monitoring, seed data | Backend | 4h |
| TASK-043 | Developer onboarding dokumentacija | Full-stack | 6h |

**🚀 LAUNCH MILESTONE — Kraj Sprint 6 → App Store LIVE**

---

## Dependency Graf

```
TASK-001 (Monorepo)
  ├── TASK-002 (Expo) → TASK-006 (Clerk Mobile) → TASK-007 (Navigation)
  │     ├── TASK-013 (Trip List) → TASK-014 (Create/Edit) → TASK-016 (Places Mobile)
  │     ├── TASK-017 (Budget Ekran)
  │     ├── TASK-018 (Map) → TASK-019 (Trip Map) → TASK-022 (Add Location)
  │     ├── TASK-021 (Photo Mobile) → TASK-023 (Compression)
  │     └── TASK-028 (Trip Detail Nav) → TASK-030 (UI Polish)
  │
  ├── TASK-003 (Hono) → TASK-004 (Prisma) → TASK-005 (Clerk Backend)
  │     ├── TASK-010 (Trip API) → TASK-011 (Location API)
  │     │                       → TASK-012 (Budget API)
  │     │                       → TASK-020 (Photo Backend)
  │     ├── TASK-015 (Places Proxy)
  │     └── TASK-024 (User API) → TASK-025 (Avatar)
  │
  └── TASK-008 (Shared Types) → svi API i mobilni taskovi od S2+

Kritični put: TASK-001 → 003 → 004 → 005 → 010 → (011,012,020) → integracija
```

---

## Risk Register

| # | Rizik | Vjerojatn. | Impact | Mitigation |
|---|-------|:----------:|:------:|------------|
| R1 | Expo/RN kompatibilnost s libraryima (maps, image picker) | 3/5 | 4/5 | Dependency spike 4h u S1, ne upgradeati SDK mid-sprint |
| R2 | Google Maps/Places API billing eskalira | 2/5 | 3/5 | Rate limiting, billing alert na $50/mj, debounce 500ms |
| R3 | Apple App Store Review odbijanje | 3/5 | 4/5 | Privacy Policy u S5, demo account za reviewera, buffer sprint |
| R4 | Neon PostgreSQL cold start latencija (1-3s) | 3/5 | 3/5 | Connection pooling, health-check ping, Neon Pro ako treba |
| R5 | Cloudflare R2 presigned URL edge cases (CORS, expiry) | 2/5 | 3/5 | Testirati na fizičkom uređaju, retry 3x, fallback multipart |

---

## Capacity Planning

| Sprint | Backend | Frontend | Full-stack | Ukupno | % kapaciteta |
|--------|:-------:|:--------:|:----------:|:------:|:------------:|
| S1 | 24h | 26h | 16h | 66h | 42% |
| S2 | 40h | 50h | 8h | 98h | 62% |
| S3 | 12h | 50h | 8h | 70h | 44% |
| S4 | 14h | 44h | 8h | 66h | 42% |
| S5 | 28h | 8h | 34h | 70h | 44% |
| S6 | 28h | 10h | 12h | 50h | 40% |
| **TOTAL** | **146h** | **188h** | **86h** | **420h** | **Avg 46%** |

Kapacitet ispod 65% jer je nova tech kombinacija — learning curve je realna.
