# Deployment priručnik — Travel Checker

## Arhitektura deployment-a

```
GitHub (main branch)
    │
    ├─ CI workflow (ci.yml)
    │      lint → typecheck → test → docker build verify
    │
    └─ Deploy workflow (deploy-api.yml)   [samo main]
           prisma migrate deploy
           railway up
           health check
           slack notify
```

---

## Environment varijable

### API (Railway — production i staging)

| Varijabla | Opis | Primjer |
|-----------|------|---------|
| `NODE_ENV` | Okruženje | `production` |
| `PORT` | Port na kojemu sluša | `3001` |
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@neon.tech/db?sslmode=require` |
| `CLERK_SECRET_KEY` | Clerk backend API ključ | `sk_live_...` |
| `CLERK_PUBLISHABLE_KEY` | Clerk javni ključ | `pk_live_...` |
| `CLOUDFLARE_R2_ACCOUNT_ID` | Cloudflare account ID | `abc123def456` |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 access key | `...` |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 secret | `...` |
| `CLOUDFLARE_R2_BUCKET_NAME` | Ime bucketa | `travel-checker-photos` |
| `CLOUDFLARE_R2_PUBLIC_URL` | Javni URL bucketa | `https://photos.travel-checker.app` |
| `SENTRY_DSN` | Sentry DSN za error tracking | `https://xxx@yyy.ingest.sentry.io/zzz` |

### GitHub Secrets (potrebni za CI/CD)

| Secret | Koristi se u |
|--------|-------------|
| `DATABASE_URL` | deploy-api.yml (migrate) |
| `RAILWAY_TOKEN` | deploy-api.yml (deploy) |
| `API_BASE_URL` | deploy-api.yml (health check) |
| `CLERK_SECRET_KEY` | deploy-api.yml |
| `CLERK_PUBLISHABLE_KEY` | build-mobile.yml |
| `CLERK_SECRET_KEY_TEST` | ci.yml (test job) |
| `CLERK_PUBLISHABLE_KEY_TEST` | ci.yml (test job) |
| `EXPO_TOKEN` | build-mobile.yml |
| `GOOGLE_MAPS_API_KEY` | build-mobile.yml |
| `EXPO_APPLE_APP_SPECIFIC_PASSWORD` | build-mobile.yml (TestFlight) |
| `SLACK_WEBHOOK_URL` | svi workflows (notifikacije) |

---

## Pre-deploy checklist

### Svaki deploy
- [ ] Svi testovi prolaze lokalno (`npm run test --workspace=apps/api`)
- [ ] TypeScript build čist (`npm run typecheck`)
- [ ] ESLint bez grešaka (`npm run lint`)
- [ ] `.env.example` je ažuran ako su dodane nove env varijable
- [ ] Sve nove environment varijable su dodane u Railway dashboard
- [ ] Prisma schema migracija je kreirana (`prisma migrate dev`)
- [ ] Migracija je testirana lokalno
- [ ] `DEPLOYMENT.md` ažuriran ako se promijenila arhitektura

### Samo za major release
- [ ] Backup baze podataka napravljen (Neon Point-in-time recovery provjeren)
- [ ] Staging deploy i testiran prije production
- [ ] API breaking changes konzultirani s Mobile timom
- [ ] Rollback plan definiran
- [ ] On-call engineer obavješten

---

## Deploy procedura

### 1. Staging deploy (automatski na svaki push na main)

```bash
# Workflow se triggerira automatski.
# Pratiti napredak:
gh run watch --repo your-org/travel-checker
```

Staging URL: `https://travel-checker-api-staging.up.railway.app`

### 2. Production deploy

Production deploy je identičan staging deployu — Railway koristi isti
`railway.toml` s različitim environment varijablama.

```bash
# Ručni deploy (ako treba):
railway up --service=travel-checker-api --environment=production
```

### 3. Verifikacija nakon deploya

```bash
# Provjeri health endpoint
curl -s https://api.travel-checker.app/health | jq .

# Pokreni health check script
./infra/monitoring/health-check.sh https://api.travel-checker.app

# Provjeri zadnje logove
railway logs --service=travel-checker-api --lines=100
```

---

## Rollback procedura (cilj: < 5 minuta)

### Automatski rollback
Deploy workflow automatski poziva `railway rollback` ako health check ne prode.

### Ručni rollback

**Korak 1 — Identifikacija (< 1 min)**
```bash
# Provjeri koji deploy je bio zadnji uspješan
railway deployments list --service=travel-checker-api
# Zapamti deployment ID prethodnog dobrog deploya
```

**Korak 2 — Rollback (< 2 min)**
```bash
# Rollback na prethodni deploy
railway rollback --service=travel-checker-api

# ILI rollback na specifičan deployment
railway rollback --service=travel-checker-api --deployment=<DEPLOYMENT_ID>
```

**Korak 3 — Verifikacija (< 2 min)**
```bash
./infra/monitoring/health-check.sh https://api.travel-checker.app
```

**Korak 4 — Baza podataka**

Ako je deploy uključivao Prisma migracije koje treba poništiti:
```bash
# OPREZ: Ovo može uzrokovati gubitak podataka!
# Koristi samo ako je migracija destruktivna i nema produkcijskog prometa.
npx prisma migrate resolve --rolled-back <MIGRATION_NAME> \
  --schema=prisma/schema.prisma
```

Za sigurniji pristup — koristiti Neon Point-in-Time Recovery:
1. Idi na Neon Dashboard > Project > Branches
2. Odaberi "Restore" na prethodni timestamp
3. Ažuriraj `DATABASE_URL` u Railway na novu branch URL

**Korak 5 — Postmortem**
- Kreiraj GitHub Issue s labelom `incident`
- Dokumentiraj: uzrok, timeline, rollback koraci, preventivne mjere

---

## Prisma migracije

### Lokalni razvoj
```bash
# Kreiranje nove migracije
npx prisma migrate dev --name add_feature_xyz --schema=prisma/schema.prisma

# Resetiranje baze (lokalno)
npx prisma migrate reset --schema=prisma/schema.prisma
```

### Production (CI/CD automatski)
```bash
npx prisma migrate deploy --schema=prisma/schema.prisma
```

`migrate deploy` nikad ne resetira bazu — samo primjenjuje pending migracije.

---

## DNS i SSL setup

### API (Railway)
Railway automatski generira SSL certifikat za `.up.railway.app` domenu.

Za custom domenu (`api.travel-checker.app`):
1. Railway Dashboard > Service > Settings > Custom Domain
2. Unesi `api.travel-checker.app`
3. Railway prikazuje CNAME record koji treba dodati u DNS
4. DNS postavke kod registrara:
   - Type: `CNAME`
   - Name: `api`
   - Value: `<railway-provided-cname>.up.railway.app`
5. SSL se automatski provisiona (Let's Encrypt via Railway)

### Cloudflare R2 Public URL
1. R2 Dashboard > Bucket > Settings > Custom Domains
2. Dodaj `photos.travel-checker.app`
3. Cloudflare automatski konfigurira SSL

---

## Lokalni razvoj s Dockerom

```bash
# Kopirati .env.example u .env i popuniti varijable
cp apps/api/.env.example apps/api/.env

# Pokrenuti cijeli stack (API + PostgreSQL)
docker compose -f infra/docker/docker-compose.yml up

# Pokrenuti development stack s hot reload i pgAdmin
docker compose \
  -f infra/docker/docker-compose.yml \
  -f infra/docker/docker-compose.dev.yml \
  up

# Pokrenuti migracije (unutar running containera)
docker compose exec api npx prisma migrate deploy --schema=prisma/schema.prisma

# pgAdmin dostupan na http://localhost:5050
```
