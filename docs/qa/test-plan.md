# Travel Checker — Test Plan

**Verzija**: 1.0
**Datum**: 2026-03-27
**QA Agent**: Faza 6
**Status**: Aktivan

---

## 1. Opseg testiranja

### 1.1 Što se testira
- Backend API (Hono, Node.js) — svi endpointi navedeni u OpenAPI specifikaciji
- React Native komponente (Expo) — kritične UI komponente
- Integracije: Clerk auth, Prisma ORM, Cloudflare R2

### 1.2 Što se NE testira
- Clerk auth server (third-party, ne naš kod)
- AWS S3 / Cloudflare R2 infrastruktura (mock u testovima)
- Expo build pipeline
- Native iOS/Android specifičnosti (nije u scope ovog plana)

---

## 2. Test strategija

### Piramida testiranja

```
         /\
        /E2E\          <- 10% — Maestro flowovi, kritični user journeys
       /------\
      /  Integ  \      <- 30% — API route testovi s mock Prisma/Clerk
     /------------\
    /    Unit       \  <- 60% — Servisni sloj, validacija, utilities
   /----------------\
```

### 2.1 Unit testovi (Vitest)
- **Lokacija**: `tests/unit/`
- **Scope**: Services (`trip.service`, `user.service`, `photo.service`), Zod validatori, helper funkcije
- **Pattern**: AAA (Arrange, Act, Assert)
- **Mocking**: Prisma Client mock, Clerk SDK mock, AWS S3 mock

### 2.2 Integracijski testovi (Vitest + Hono testClient)
- **Lokacija**: `tests/unit/` (API route testovi)
- **Scope**: Svi API endpointi — happy path + error cases
- **Mocking**: Prisma mock, auth middleware mock — nema prave DB konekcije
- **Minimum po endpointu**: 5 testova (success, auth fail, validation fail, not found, server error)

### 2.3 Komponentni testovi (React Native Testing Library)
- **Lokacija**: `tests/component/`
- **Scope**: TripCard, BudgetBreakdown, StatsCard
- **Mocking**: expo-router, expo-linear-gradient, @clerk/clerk-expo

### 2.4 E2E testovi (Maestro)
- **Lokacija**: `tests/e2e/`
- **Scope**: Kritični user journeys na simulatoru
- **Okruženje**: iOS Simulator (Expo Go)

---

## 3. Coverage ciljevi

| Sloj | Cilj | Minimum |
|------|------|---------|
| API routes | >85% | >80% |
| Services | >90% | >85% |
| Validators | 100% | 100% |
| Components | >70% | >60% |
| E2E flows | 6 kritičnih | 6 kritičnih |

---

## 4. API endpointi — test matrica

| Endpoint | Happy Path | Auth Fail | Validation Fail | Not Found | Server Error |
|----------|-----------|-----------|-----------------|-----------|--------------|
| GET /health | ✓ | N/A | N/A | N/A | ✓ |
| POST /api/users/sync | ✓ | N/A | ✓ | N/A | ✓ |
| GET /api/users/me | ✓ | ✓ | N/A | ✓ | ✓ |
| PATCH /api/users/me | ✓ | ✓ | ✓ | N/A | ✓ |
| GET /api/users/me/stats | ✓ | ✓ | N/A | N/A | ✓ |
| DELETE /api/users/me | ✓ | ✓ | N/A | N/A | ✓ |
| GET /api/users/me/export | ✓ | ✓ | N/A | N/A | ✓ |
| GET /api/users/:id | ✓ | ✓ | N/A | ✓ | ✓ |
| GET /api/trips | ✓ | ✓ | N/A | N/A | ✓ |
| POST /api/trips | ✓ | ✓ | ✓ | N/A | ✓ |
| GET /api/trips/:id | ✓ | ✓ | N/A | ✓ | ✓ |
| PATCH /api/trips/:id | ✓ | ✓ | ✓ | ✓ | ✓ |
| DELETE /api/trips/:id | ✓ | ✓ | N/A | ✓ | ✓ |
| GET /api/trips/map/pins | ✓ | ✓ | N/A | N/A | ✓ |
| POST /api/photos/upload-url | ✓ | ✓ | ✓ | ✓ | ✓ |
| PATCH /api/photos/:id | ✓ | ✓ | ✓ | ✓ | ✓ |
| DELETE /api/photos/:id | ✓ | ✓ | N/A | ✓ | ✓ |
| POST /api/photos/:id/set-cover | ✓ | ✓ | N/A | ✓ | ✓ |
| PUT /api/trips/:id/budget | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /api/trips/:id/budget | ✓ | ✓ | N/A | ✓ | ✓ |
| PUT /api/trips/:id/accommodation | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /api/trips/:id/accommodation | ✓ | ✓ | N/A | ✓ | ✓ |
| GET /api/places/autocomplete | ✓ | ✓ | ✓ | N/A | ✓ |
| GET /api/places/details | ✓ | ✓ | ✓ | ✓ | ✓ |
| GET /api/stats/me | ✓ | ✓ | N/A | N/A | ✓ |

---

## 5. Edge case scenariji

### Auth
- Token bez `Bearer ` prefiksa → 401
- Istekli JWT token → 401
- Validan Clerk token ali user ne postoji u DB → 401
- Token s pogrešnim potpisom → 401

### Trips
- Kreiranje tripa s datumom završetka prije datuma početka
- Paginacija: page=0, page=999999, limit=0, limit=100 (max 50)
- Pristup tuđem privatnom tripu → 403
- Pristup javnom tuđem tripu → 200
- PATCH tripa s praznim tijelom → 200 (no-op)
- Brisanje tripa koji ima fotografije → kaskadno brisanje

### Budget
- Negativne vrijednosti (food: -100) → 400
- Sve nule → total = 0
- Jako veliki brojevi (accommodation: 999999999) → overflow test
- Dvostruki PUT → upsert, ne duplikat

### Photos
- Upload 21. fotografije → 400 "Maximum 20 photos per trip"
- Brisanje cover fotografije → automatski postavi sljedeću kao cover
- contentType koji nije slika (video/mp4) → 400
- Presigned URL za nepostojeći trip → 404

### Users
- Username koji već postoji → 409
- GDPR delete → kaskadno briše tripove, fotografije, komentare
- Export → vraća sve podatke korisnika

### Places
- Prazni `q` parametar → 400
- Nepostojeći `placeId` → 404

---

## 6. Performance ciljevi

| Metrika | Target | P95 Limit |
|---------|--------|-----------|
| API response time | <100ms | <200ms |
| GET /api/trips (paginacija) | <150ms | <300ms |
| POST /api/trips (transakcija) | <200ms | <400ms |
| App cold start | <2s | <3s |
| App warm start | <500ms | <1s |
| Lighthouse Performance | >85 | >80 |
| FCP (web) | <1.5s | <2s |
| LCP (web) | <2.5s | <3s |

---

## 7. Accessibility checklist

- [ ] Svi interaktivni elementi imaju `accessibilityLabel`
- [ ] Slike imaju `accessibilityHint` ili `accessible={false}` ako su dekorativne
- [ ] Minimalni touch target: 44x44pt
- [ ] Kontrast teksta: minimum 4.5:1 (WCAG AA)
- [ ] Keyboard navigacija radi na svim formama
- [ ] Screen reader (VoiceOver/TalkBack) čita smislene opise
- [ ] Focus management u modalima i navigaciji
- [ ] Error poruke su povezane s odgovarajućim input poljem

---

## 8. Bug severity definicije

### P0 — Blocker (fix unutar 2 sata)
- App crash pri pokretanju
- Autentikacija ne radi
- Podaci korisnika se gube
- Sigurnosni propust (unauthorized access)
- GDPR delete ne briše podatke

### P1 — Critical (fix unutar 24 sata)
- Core flow ne radi (kreiranje tripa, upload fotografije)
- Podaci se ne prikazuju ili prikazuju pogrešno
- Plaćena funkcionalnost ne radi
- Performance degradacija >50%

### P2 — Major (fix unutar sprinta)
- Sporedni flow ne radi (uređivanje profila, statistike)
- UI ne odgovara dizajnu na >10% razlike
- Accessibility propust na kritičnom elementu
- Validacija ne funkcionira ispravno

### P3 — Minor (backlog)
- Kozmetički UI problemi
- Spori non-critical API pozivi
- Edge case koji pogađa <1% korisnika
- Tekst greške nije user-friendly

---

## 9. Definition of Done za testove

- [ ] Svaki endpoint ima minimum 5 testova (success, auth fail, validation fail, not found, server error)
- [ ] Test data se generira, ne hardkodira
- [ ] Cleanup se izvodi nakon svakog testa
- [ ] Code coverage >80% za API routes
- [ ] Svi testovi prolaze u CI/CD pipeline
- [ ] Nema `console.log` u testovima (osim debugging sesija)
- [ ] Testovi su neovisni — svaki test može raditi izolirano
- [ ] E2E testovi rade na iOS Simulatoru

---

## 10. Alati i konfiguracija

| Alat | Svrha | Verzija |
|------|-------|---------|
| Vitest | Unit i integracijski testovi | ^1.3.0 |
| Maestro | E2E mobilni testovi | latest |
| React Native Testing Library | Komponentni testovi | ^12.x |
| @testing-library/jest-native | Custom matchers | ^5.x |
| v8 coverage | Coverage report | (Vitest built-in) |

---

## 11. CI/CD integracija

```yaml
# .github/workflows/test.yml
- name: Run unit tests
  run: cd apps/api && npm test -- --coverage

- name: Run component tests
  run: cd apps/mobile && npx jest --coverage

- name: Run E2E tests (CI)
  run: maestro test tests/e2e/
  env:
    MAESTRO_DRIVER: ios-simulator
```

**Gate**: Zero failing tests, coverage threshold met → merge dopušten.
