# Production Infrastructure Setup — Travel Checker

**Last updated:** 2026-04-02
**Author:** Cloud Architect

This guide walks through every external service that must be provisioned before
the Travel Checker API can go live. Follow the sections in order — each one
produces values that later sections depend on.

---

## Prerequisites

- GitHub repository with admin access
- Domain registrar access for `travel-checker.app`
- Apple Developer account (or budget $99 to create one)
- Google account for Google Play Console
- Credit card for Railway / Neon (free tiers exist, but a card is required)

---

## 1. Neon PostgreSQL

### 1.1 Create the project

1. Go to [console.neon.tech](https://console.neon.tech) and sign in.
2. Click **New Project**.
3. Set:
   - **Name**: `travel-checker`
   - **PostgreSQL version**: `16`
   - **Region**: `eu-central-1` (Frankfurt) — or the region closest to your Railway deployment
4. Click **Create Project**.
5. Neon immediately shows a connection string. Copy it — you will need it shortly.

The connection string format is:
```
postgresql://neondb_owner:<password>@<endpoint>.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 1.2 Enable Point-in-Time Recovery

Neon's free tier retains 7 days of WAL history. To verify:

1. Open your project in the Neon console.
2. Go to **Settings > Backup**.
3. Confirm **Point-in-time restore** shows at least 7 days (free tier) or 30 days
   (Launch plan and above).

To restore to a specific point in time:
1. **Branches > New Branch**.
2. Under **Create from**, select **Timestamp** and enter the target time.
3. Neon creates a branch with data as of that moment.
4. Update `DATABASE_URL` in Railway to the new branch connection string.
5. Verify data, then promote the branch to main if needed.

### 1.3 Branch strategy

Neon branches are cheap (they share storage with copy-on-write). Create one
branch per environment:

| Branch | Purpose | How to create |
|--------|---------|---------------|
| `main` | Production | Created automatically |
| `staging` | Staging environment | Branches > New Branch from main |
| `dev` | Local development (optional) | Branches > New Branch from main |

Steps for staging branch:
1. **Branches > New Branch**.
2. Name: `staging`.
3. Parent: `main`.
4. Click **Create Branch**.
5. Copy the `staging` connection string — add it to Railway staging environment
   as `DATABASE_URL`.

> **Important:** The `staging` branch will diverge from `main` as migrations run.
> Periodically reset it: Branches > staging > Reset to parent.

### 1.4 Configure connection pooling (PgBouncer)

For production, use Neon's built-in PgBouncer endpoint to avoid exhausting
connection limits with many Railway container instances:

1. In the Neon console, select your compute endpoint.
2. Under **Connection Details**, toggle **Pooled connection**.
3. Copy the pooled connection string (it contains `-pooler` in the hostname).
4. Use the pooled string as `DATABASE_URL` in Railway.

> The pooled URL still requires `?sslmode=require`.

---

## 2. Clerk Authentication

### 2.1 Create the application

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and sign in.
2. Click **Add application**.
3. Set **Application name**: `Travel Checker`.
4. Under **Sign-in options**, enable:
   - **Email address** (with email verification)
   - **Google** (OAuth)
   - **Apple** (OAuth)
5. Click **Create application**.

### 2.2 Configure Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a project (or select an existing one).
3. Enable **Google+ API** or **Google Identity** under APIs & Services.
4. **Credentials > Create Credentials > OAuth 2.0 Client ID**.
   - Application type: **Web application**
   - Authorized redirect URIs: copy the redirect URI shown in Clerk's Google
     setup page (format: `https://accounts.<your-clerk-domain>.clerk.accounts.dev/v1/oauth_callback`)
5. Copy **Client ID** and **Client Secret**.
6. Back in Clerk: **User & Authentication > Social Connections > Google**.
7. Paste the Client ID and Client Secret. Click **Apply changes**.

### 2.3 Configure Apple OAuth

1. You need an active Apple Developer account ($99/year).
2. In [developer.apple.com](https://developer.apple.com):
   - **Certificates, Identifiers & Profiles > Identifiers > App IDs**.
   - Select your app, enable **Sign In with Apple**.
   - **Keys > Create a new key**, enable **Sign In with Apple**, download the
     `.p8` private key file (can only be downloaded once).
3. In Clerk: **User & Authentication > Social Connections > Apple**.
4. Provide:
   - **Services ID** (format: `com.travelchecker.siwa`)
   - **Team ID** (10-char alphanumeric from Apple Developer)
   - **Key ID** (from the key you created)
   - **Private Key** (contents of the `.p8` file)
5. Click **Apply changes**.

### 2.4 Get API keys

In Clerk dashboard: **API Keys** (left sidebar).

| Key | Variable name | Where used |
|-----|--------------|-----------|
| Publishable key (`pk_live_...`) | `CLERK_PUBLISHABLE_KEY` | Mobile app, Railway env |
| Secret key (`sk_live_...`) | `CLERK_SECRET_KEY` | Railway env only — never expose |

> For staging, use the **Development** instance keys (`pk_test_...` / `sk_test_...`).

### 2.5 Webhook for user sync

The API listens for Clerk webhooks to sync user data into PostgreSQL.

1. In Clerk dashboard: **Webhooks > Add Endpoint**.
2. **Endpoint URL**: `https://api.travel-checker.app/api/webhooks/clerk`
3. **Events to subscribe**:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Click **Create**. Copy the **Signing Secret** (`whsec_...`).
5. Add it to Railway as `CLERK_WEBHOOK_SECRET`.

For staging, create a second webhook pointing to the staging URL:
`https://travel-checker-api-staging.up.railway.app/api/webhooks/clerk`

---

## 3. Cloudflare R2 Storage

### 3.1 Create the R2 bucket

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. In the left sidebar: **R2 Object Storage**.
3. Click **Create bucket**.
4. Set:
   - **Bucket name**: `travel-checker-photos`
   - **Location hint**: `EEUR` (Eastern Europe) or `WEUR` (Western Europe)
5. Click **Create bucket**.

### 3.2 Generate R2 API tokens

1. **R2 > Manage R2 API Tokens**.
2. Click **Create API token**.
3. Set:
   - **Token name**: `travel-checker-api-production`
   - **Permissions**: `Object Read & Write`
   - **Bucket**: Specific bucket — `travel-checker-photos`
   - **TTL**: No expiry (rotate manually every 12 months)
4. Click **Create API Token**.
5. Copy:
   - **Access Key ID** → `CLOUDFLARE_R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
   - **Account ID** (top of R2 page) → `CLOUDFLARE_R2_ACCOUNT_ID`

> The secret is shown only once. Store it in a password manager immediately.

### 3.3 Configure custom domain for public access

This maps `photos.travel-checker.app` to the bucket's public endpoint.

1. Your domain `travel-checker.app` must be on Cloudflare (see Section 7).
2. In R2: open `travel-checker-photos` > **Settings > Custom Domains**.
3. Click **Connect Domain**.
4. Enter `photos.travel-checker.app`.
5. Cloudflare automatically:
   - Creates the DNS CNAME record.
   - Provisions an SSL certificate.
   - Enables public access on that subdomain.
6. Set `CLOUDFLARE_R2_PUBLIC_URL=https://photos.travel-checker.app` in Railway.

> Objects are now accessible at `https://photos.travel-checker.app/<object-key>`.

### 3.4 CORS settings

The mobile app uploads directly to R2 using presigned URLs. Configure CORS
to permit this:

1. In R2: open `travel-checker-photos` > **Settings > CORS policy**.
2. Click **Add CORS rule**.
3. Use this JSON configuration:

```json
[
  {
    "AllowedOrigins": [
      "https://api.travel-checker.app",
      "https://travel-checker-api-staging.up.railway.app",
      "http://localhost:3001",
      "exp://localhost:8081"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

4. Click **Save**.

> Expo development builds use `exp://` origins. Add your specific Expo tunnel
> URL if using `expo start --tunnel`.

---

## 4. Railway (API Hosting)

### 4.1 Create the project and service

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project**.
3. Select **Deploy from GitHub repo**.
4. Authorize Railway to access your repository.
5. Select the `travel-checker` repository.
6. Railway detects the Dockerfile. Change the root directory detection if
   needed — the Dockerfile is at `infra/docker/Dockerfile.api`.
7. Set the **Service name**: `travel-checker-api`.
8. Click **Deploy**.

> Railway creates a default environment named `production`. You will add a
> `staging` environment in step 4.5.

### 4.2 Configure the Dockerfile path

Railway needs to know which Dockerfile to use in this monorepo:

1. In the Railway service: **Settings > Build**.
2. Set:
   - **Builder**: Dockerfile
   - **Dockerfile path**: `infra/docker/Dockerfile.api`
   - **Build context**: `/` (repository root — the Dockerfile copies from workspace root)
3. Click **Save**.

### 4.3 Configure environment variables

In Railway: **Service > Variables**. Add every variable from the table below.
Reference `infra/DEPLOYMENT.md` for the full list.

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `3001` | Railway respects this |
| `DATABASE_URL` | `postgresql://...?sslmode=require` | Neon pooled connection string |
| `CLERK_SECRET_KEY` | `sk_live_...` | From Clerk dashboard |
| `CLERK_PUBLISHABLE_KEY` | `pk_live_...` | From Clerk dashboard |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` | From Clerk webhook setup |
| `CLOUDFLARE_R2_ACCOUNT_ID` | `abc123...` | From Cloudflare R2 page |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | `...` | From R2 API token |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | `...` | From R2 API token |
| `CLOUDFLARE_R2_BUCKET_NAME` | `travel-checker-photos` | |
| `CLOUDFLARE_R2_PUBLIC_URL` | `https://photos.travel-checker.app` | |
| `SENTRY_DSN` | `https://xxx@yyy.ingest.sentry.io/zzz` | From Sentry project |

> Never commit these values to Git. Railway encrypts them at rest.

### 4.4 Custom domain setup

1. Railway service: **Settings > Networking > Custom Domain**.
2. Click **+ Custom Domain**.
3. Enter `api.travel-checker.app`.
4. Railway shows a CNAME target (e.g., `travel-checker-api.up.railway.app`).
5. In your DNS provider, create:
   - **Type**: `CNAME`
   - **Name**: `api`
   - **Value**: `<railway-provided-target>.up.railway.app`
   - **TTL**: `300` (5 minutes, so you can change it quickly)
6. Back in Railway, click **Check DNS** — it turns green within 5-15 minutes.
7. Railway provisions an SSL certificate automatically (Let's Encrypt).

### 4.5 Add staging environment

1. In your Railway project: **Environments > New Environment**.
2. Name: `staging`.
3. Railway copies the production service definition.
4. Update the staging-specific variables:
   - `NODE_ENV` = `staging`
   - `DATABASE_URL` = Neon `staging` branch connection string
   - `CLERK_SECRET_KEY` = Clerk Development instance key (`sk_test_...`)
   - `CLERK_PUBLISHABLE_KEY` = Clerk Development key (`pk_test_...`)
5. The staging URL is automatically `travel-checker-api-staging.up.railway.app`
   (no custom domain needed for staging).

### 4.6 Configure GitHub Secrets for CI/CD

The GitHub Actions workflows in `.github/workflows/` require these repository
secrets (Settings > Secrets and Variables > Actions):

| Secret | Value |
|--------|-------|
| `DATABASE_URL` | Neon production connection string |
| `RAILWAY_TOKEN` | Railway API token (Railway > Account > Tokens) |
| `API_BASE_URL` | `https://api.travel-checker.app` |
| `CLERK_SECRET_KEY` | Clerk production secret key |
| `CLERK_PUBLISHABLE_KEY` | Clerk production publishable key |
| `CLERK_SECRET_KEY_TEST` | Clerk development secret key (for CI tests) |
| `CLERK_PUBLISHABLE_KEY_TEST` | Clerk development publishable key |
| `EXPO_TOKEN` | EAS personal access token (see Section 5) |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key |
| `EXPO_APPLE_APP_SPECIFIC_PASSWORD` | Apple app-specific password for TestFlight |
| `SLACK_WEBHOOK_URL` | Incoming webhook URL from Slack |

### 4.7 Auto-deploy from main branch

Railway auto-deploys by default when connected to GitHub. Verify:

1. Railway service: **Settings > Source**.
2. Confirm **Branch**: `main`.
3. Confirm **Auto Deploy**: enabled.

Every push to `main` triggers:
1. Docker build using `infra/docker/Dockerfile.api`
2. `prisma migrate deploy` (run by `infra/docker/entrypoint.sh`)
3. Container health check at `/health`
4. Traffic cutover if health check passes; automatic rollback if it fails.

---

## 5. EAS Build (Expo Application Services)

### 5.1 Install EAS CLI

```bash
npm install -g eas-cli

# Verify
eas --version
```

### 5.2 Log in and link the project

```bash
eas login
# Enter your Expo account credentials

cd apps/mobile
eas project:init
# Select or create the 'travel-checker' project on expo.dev
```

This writes the `extra.eas.projectId` field into `app.config.ts`. Commit
the updated file.

### 5.3 Review eas.json

The `apps/mobile/eas.json` file is already configured with three build profiles:

| Profile | Distribution | iOS config | Android config |
|---------|-------------|-----------|----------------|
| `development` | Internal | Simulator (Debug) | APK (Debug) |
| `preview` | Internal (ad-hoc) | Release | APK |
| `production` | Store | Release | AAB (App Bundle) |

The `production` profile points to `https://api.travel-checker.app`. No changes
needed to `eas.json` unless you change the API URL.

Update the submit section of `eas.json` with real values:
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-real-apple-id@example.com",
      "ascAppId": "YOUR_APP_STORE_CONNECT_NUMERIC_ID",
      "appleTeamId": "YOUR_10_CHAR_TEAM_ID"
    },
    "android": {
      "serviceAccountKeyPath": "./service-account.json",
      "track": "production"
    }
  }
}
```

### 5.4 Apple Developer setup

You must have an active Apple Developer Program membership ($99/year).

**Create an App ID:**
1. [developer.apple.com](https://developer.apple.com) > Certificates, IDs & Profiles > Identifiers.
2. Click `+`, select **App IDs**.
3. Bundle ID: `com.travelchecker.app` (must match `app.config.ts`).
4. Enable capabilities: **Push Notifications**, **Sign In with Apple**.
5. Click **Register**.

**Create App Store Connect record:**
1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) > My Apps > `+`.
2. Platform: **iOS**.
3. Bundle ID: select `com.travelchecker.app`.
4. SKU: `travel-checker-ios`.
5. Copy the **Apple ID** (numeric, e.g., `1234567890`) — this is `ascAppId`.

**App-specific password (for TestFlight automation):**
1. [appleid.apple.com](https://appleid.apple.com) > Sign-In and Security > App-Specific Passwords.
2. Generate a password for `EAS Build`.
3. Add it to GitHub Secrets as `EXPO_APPLE_APP_SPECIFIC_PASSWORD`.

**EAS handles code signing automatically.** On first production build, EAS will:
- Create distribution certificates and provisioning profiles.
- Store them in your Expo account (not committed to Git).

### 5.5 Google Play Service Account setup

This allows EAS to submit builds to the Play Store automatically.

1. Go to [play.google.com/console](https://play.google.com/console).
2. **Setup > API access > Create new service account**.
3. Click the Google Cloud Console link, create a service account:
   - Name: `eas-submission`
   - Role: Leave blank (set permissions in Play Console)
4. Under **Keys**, create a JSON key. Download `service-account.json`.
5. Back in Play Console: grant the service account **Release Manager** permissions.
6. Place `service-account.json` in `apps/mobile/` (this file is gitignored —
   verify `apps/mobile/.gitignore` contains `service-account.json`).

### 5.6 Get EAS personal access token

1. Go to [expo.dev](https://expo.dev) > Account Settings > Access Tokens.
2. Create a token named `github-actions`.
3. Add it to GitHub Secrets as `EXPO_TOKEN`.

### 5.7 First production build

```bash
cd apps/mobile

# iOS production build
eas build --platform ios --profile production

# Android production build
eas build --platform android --profile production

# Both platforms simultaneously
eas build --platform all --profile production
```

EAS queues the build on Expo's servers. You can monitor progress at
[expo.dev/accounts/<your-account>/projects/travel-checker/builds](https://expo.dev).

Build artifacts are stored on Expo's servers for 30 days (free) or 100 days
(EAS subscription).

**Submit to stores:**
```bash
# After build completes, submit (iOS -> TestFlight, Android -> Internal track)
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

---

## 6. Sentry Error Tracking

### 6.1 Create the project

1. Go to [sentry.io](https://sentry.io) and sign in.
2. **Projects > Create Project**.
3. Select **Node.js** (for the API).
4. Set:
   - **Project name**: `travel-checker-api`
   - **Team**: Select or create a team
5. Click **Create Project**.
6. Sentry shows the DSN on the next screen. Copy it — format:
   `https://xxxx@oXXXX.ingest.sentry.io/XXXX`

### 6.2 Add DSN to Railway

Add to Railway environment variables (production and staging):
```
SENTRY_DSN=https://xxxx@oXXXX.ingest.sentry.io/XXXX
```

For staging, you can use the same DSN but set `environment: staging` in the
Sentry SDK config so issues are separated by environment.

### 6.3 Integration points in API code

The Sentry SDK is initialized in `apps/api/src/lib/sentry.ts` (see
`infra/monitoring/alerts.md` for the exact code). Key integration points:

**In `apps/api/src/index.ts` — initialize before routes:**
```typescript
import { initSentry } from './lib/sentry';
initSentry(); // Must be called before any other imports that could throw
```

**Error handler middleware — place after all routes:**
```typescript
import * as Sentry from '@sentry/node';

// Must be registered after routes, before generic error handler
app.use(Sentry.expressErrorHandler());
```

**Performance tracing** is configured with `tracesSampleRate: 0.1` in production
(10% of requests), which keeps free tier usage within limits.

**Install the SDK** if not already in `apps/api/package.json`:
```bash
npm install @sentry/node --workspace=apps/api
```

### 6.4 Create a second Sentry project for mobile

1. **Projects > Create Project > React Native**.
2. **Project name**: `travel-checker-mobile`.
3. Install in mobile app:
   ```bash
   cd apps/mobile
   npx expo install @sentry/react-native
   ```
4. Add `EXPO_PUBLIC_SENTRY_DSN` to `eas.json` under each build profile's `env`.

---

## 7. DNS and Domain Setup

### 7.1 Move domain to Cloudflare (strongly recommended)

Cloudflare's free plan provides DDoS protection, CDN, WAF, and manages SSL
for all subdomains — including the R2 custom domain from Section 3.3.

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Add a Site** > enter `travel-checker.app`.
3. Select the **Free** plan.
4. Cloudflare scans existing DNS records and imports them.
5. Cloudflare provides two nameservers (e.g., `isla.ns.cloudflare.com`,
   `kai.ns.cloudflare.com`).
6. At your domain registrar (Namecheap, GoDaddy, etc.), replace the nameservers
   with the Cloudflare ones.
7. Propagation takes 1-48 hours. Cloudflare shows **Active** when complete.

### 7.2 Required DNS records

Once the domain is on Cloudflare, add or verify these records:

| Type | Name | Value | Proxy | Purpose |
|------|------|-------|-------|---------|
| `CNAME` | `api` | `<railway-cname>.up.railway.app` | DNS only (grey cloud) | API endpoint |
| `CNAME` | `photos` | Managed by Cloudflare R2 (auto-created in Section 3.3) | Proxied | R2 CDN |
| `CNAME` | `www` | `travel-checker.app` | Proxied | Website redirect |
| `A` | `@` | Your website host IP | Proxied | Root domain |

> **Important:** The `api` CNAME must be **DNS only** (grey cloud), not proxied.
> Railway handles SSL termination for the API. If you proxy it through Cloudflare,
> you get double SSL termination which can cause TLS handshake errors.

### 7.3 SSL certificates

| Subdomain | Certificate provider | How |
|-----------|---------------------|-----|
| `api.travel-checker.app` | Let's Encrypt via Railway | Automatic when CNAME resolves |
| `photos.travel-checker.app` | Cloudflare | Automatic when R2 domain connected |
| `travel-checker.app` | Cloudflare | Automatic (Universal SSL on free plan) |

No manual certificate management is required. All certificates auto-renew.

### 7.4 Verify the setup

```bash
# API health check
curl -s https://api.travel-checker.app/health | jq .
# Expected: { "status": "ok", "service": "travel-checker-api" }

# R2 public access (replace with a real object key after uploading a test file)
curl -I https://photos.travel-checker.app/test-upload.jpg
# Expected: HTTP 200 or 404 (not a connection error)

# SSL certificate check
openssl s_client -connect api.travel-checker.app:443 -brief
# Expected: no certificate errors
```

---

## 8. Production Checklist

Run through this checklist before announcing the launch. Check off each item.

### Infrastructure

- [ ] Neon `main` branch is running and accessible
- [ ] Neon point-in-time recovery is confirmed (7+ days history)
- [ ] Neon `staging` branch created and `DATABASE_URL` set in Railway staging
- [ ] Prisma migrations applied to production: `npx prisma migrate deploy`
- [ ] Railway production service is deployed and healthy
- [ ] `GET https://api.travel-checker.app/health` returns HTTP 200
- [ ] Railway staging service is deployed and healthy
- [ ] R2 bucket `travel-checker-photos` created in correct region
- [ ] R2 CORS policy configured (Section 3.4)
- [ ] `photos.travel-checker.app` custom domain is active on R2
- [ ] Test file uploaded to R2 and accessible via `https://photos.travel-checker.app/<key>`

### Authentication

- [ ] Clerk production instance is active
- [ ] Google OAuth is configured and tested (end-to-end sign-in works)
- [ ] Apple OAuth is configured and tested
- [ ] Clerk webhook endpoint is configured and verified (check Clerk logs)
- [ ] Production API keys (`pk_live_` / `sk_live_`) are in Railway — not test keys

### Secrets and environment

- [ ] All Railway environment variables from Section 4.3 are set
- [ ] All GitHub Actions secrets from Section 4.6 are set
- [ ] No secrets are committed to Git (`git log --all -S "sk_live_"` returns nothing)
- [ ] `.env` files are in `.gitignore`

### Mobile builds

- [ ] `eas.json` submit section updated with real Apple ID / ASC App ID / Team ID
- [ ] `service-account.json` is present locally and gitignored
- [ ] Production iOS build completed successfully
- [ ] Production Android build completed successfully
- [ ] iOS build submitted to TestFlight and passes Apple review
- [ ] Android build uploaded to Play Store internal testing track

### Monitoring

- [ ] Sentry project created and `SENTRY_DSN` is in Railway
- [ ] Sentry is receiving events (throw a test error, confirm it appears)
- [ ] Uptime monitor configured on Better Uptime or UptimeRobot (Section 8 of `infra/monitoring/alerts.md`)
- [ ] Railway spending limit configured (Railway > Account > Billing > Spending Limit)
- [ ] Neon billing alert configured (Neon > Settings > Billing)

### DNS and SSL

- [ ] Domain `travel-checker.app` is on Cloudflare
- [ ] `api.travel-checker.app` CNAME resolves (DNS only, not proxied)
- [ ] SSL certificate for `api.travel-checker.app` is valid and auto-renewing
- [ ] SSL certificate for `photos.travel-checker.app` is valid

### Deployment pipeline

- [ ] Push to `main` triggers Railway auto-deploy
- [ ] GitHub Actions CI workflow passes (lint, typecheck, tests)
- [ ] GitHub Actions deploy workflow runs successfully end-to-end
- [ ] Rollback procedure tested: `railway rollback` brings back previous version
- [ ] `infra/monitoring/health-check.sh https://api.travel-checker.app` exits 0

### Pre-launch smoke test

```bash
# Run the full health check suite
./infra/monitoring/health-check.sh https://api.travel-checker.app

# Verify Prisma can reach the database
curl -s https://api.travel-checker.app/api/health/ready | jq .

# Confirm Sentry receives an event (dev only — do not run on prod unless you have a test endpoint)
# Check Sentry dashboard for recent events
```

---

## Quick Reference

| Service | Dashboard URL | Credentials |
|---------|--------------|-------------|
| Neon | console.neon.tech | Email / GitHub |
| Clerk | dashboard.clerk.com | Email / GitHub |
| Cloudflare | dash.cloudflare.com | Email |
| Railway | railway.app | GitHub |
| Expo EAS | expo.dev | Email |
| Sentry | sentry.io | Email / GitHub |
| Apple Developer | developer.apple.com | Apple ID |
| App Store Connect | appstoreconnect.apple.com | Apple ID |
| Google Play Console | play.google.com/console | Google |

All secrets are stored in Railway environment variables and GitHub Actions secrets.
No secrets are stored in this file or any file committed to Git.
