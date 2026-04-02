# Monthly Cost Estimate — Travel Checker

**Last updated:** 2026-04-02
**Author:** Cloud Architect

This document provides a realistic monthly cost breakdown for each tier of
growth. All prices are in USD. Prices are based on public pricing as of Q1 2026
and may change — always verify on the provider's pricing page before budgeting.

---

## Summary table

| Service | MVP (0-1K users) | Launch (1K-10K users) | Growth (10K-50K users) |
|---------|:----------------:|:---------------------:|:----------------------:|
| Railway | $5 | $10-20 | $30-60 |
| Neon PostgreSQL | $0 | $0-19 | $19-69 |
| Clerk | $0 | $0 | $0-25 |
| Cloudflare R2 | $0 | $1-3 | $5-15 |
| EAS Build | $0 | $0 | $0-99 |
| Sentry | $0 | $0 | $0 |
| Apple Developer | $8/mj* | $8/mj* | $8/mj* |
| Google Play | $0** | $0** | $0** |
| Domain | $1 | $1 | $1 |
| **Total** | **~$14/mj** | **~$20-52/mj** | **~$63-277/mj** |

*Apple Developer is $99/year, shown as ~$8.25/month.
**Google Play is a one-time $25 fee, $0/month thereafter.

---

## 1. Railway

**URL:** [railway.app/pricing](https://railway.app/pricing)

Railway bills by resource consumption (CPU + RAM + bandwidth) on top of a base
plan fee. There is no reserved capacity — you pay for what you use.

### Plans

| Plan | Base fee | Included credits | Overage |
|------|----------|-----------------|---------|
| **Hobby** | $5/month | $5 in credits | $0.000463/vCPU-min, $0.000231/GB-min RAM |
| **Pro** | $20/month | $20 in credits | Same rates |

### Realistic usage

**MVP — 1 container instance, 0.5 vCPU average, 256MB RAM:**
- Compute: ~$4/month (included in Hobby base)
- Bandwidth: ~$0.10/GB outbound ($0.10/GB)
- **Estimated: $5-8/month (Hobby plan)**

**Launch — 1 container instance, 1 vCPU average, 512MB RAM:**
- Compute: ~$8/month
- Bandwidth: ~$0.50 (higher traffic)
- **Estimated: $10-20/month (Hobby plan)**

**Growth — 2-3 container instances:**
- Compute: ~$25-40/month
- Bandwidth: ~$2-5
- **Estimated: $30-50/month (Pro plan recommended)**

### When to upgrade from Hobby to Pro

Upgrade to Pro when:
- Monthly bill consistently exceeds $15 (Pro's higher included credits save money)
- You need priority support
- You need team collaboration features (multiple members per project)

### Cost control tips

- Railway does not have auto-scaling on Hobby. Set memory limits in
  `railway.toml` to prevent runaway consumption.
- Monitor usage in Railway Dashboard > Metrics. Set a spending limit in
  Account > Billing to cap unexpected charges.
- Scale-to-zero is not available on Railway for web services — the container
  always runs. This is by design for low-latency response.

---

## 2. Neon PostgreSQL

**URL:** [neon.tech/pricing](https://neon.tech/pricing)

Neon is serverless PostgreSQL with scale-to-zero for inactive branches. Billing
is based on compute hours (active connection time) and storage.

### Plans

| Plan | Monthly fee | Compute | Storage | Branches | PITR |
|------|-------------|---------|---------|----------|------|
| **Free** | $0 | 191.9 compute hours/mj | 0.5 GB | 10 | 7 days |
| **Launch** | $19 | 300 compute hours/mj included | 10 GB included | 100 | 7 days |
| **Scale** | $69 | 750 compute hours/mj included | 50 GB included | 500 | 30 days |

Overage rates (Launch/Scale): $0.16/compute hour, $0.15/GB storage/month.

### Realistic usage

**MVP (0-1K users, low traffic):**
- Compute: well under 191.9 hours/month
- Storage: well under 0.5 GB
- **Estimated: $0/month (Free plan)**

**Launch (1K-10K users, moderate traffic):**
- Compute: 100-250 hours/month depending on connection pooling configuration
- Storage: 1-5 GB
- Free tier likely sufficient for most of this range with PgBouncer pooling
- **Estimated: $0-19/month (Free to Launch)**

**Growth (10K-50K users):**
- Compute: 300-600 hours/month
- Storage: 5-20 GB
- **Estimated: $19-69/month (Launch to Scale)**

### Free tier considerations

The free tier is generous but has limits that matter at scale:
- **0.5 GB storage** — can be hit if users upload many trips with metadata.
  Keep media out of the database (use R2 for photos).
- **Compute autosuspend** — inactive branches suspend after 300 seconds (5 min).
  The cold start is ~500ms, acceptable for development but not staging if you
  need instant availability.
- **10 branches max** — enough for main, staging, and 8 feature branches.

**Upgrade trigger**: Upgrade to Launch when:
- Storage approaches 400 MB, OR
- Monthly compute hours exceed 150 (leaves buffer before 191.9 cap)

### Cost control tips

- Staging and dev branches scale to zero automatically — zero cost when idle.
- Use the pooled connection string (PgBouncer) to reduce compute hours from
  connection overhead.
- Enable autosuspend on the production compute endpoint only if you can tolerate
  cold starts (not recommended for production).

---

## 3. Clerk Authentication

**URL:** [clerk.com/pricing](https://clerk.com/pricing)

### Plans

| Plan | Monthly fee | MAU included | Overage |
|------|-------------|-------------|---------|
| **Free** | $0 | 10,000 MAU | No overage — must upgrade |
| **Pro** | $25/month | 10,000 MAU included | $0.02/MAU |
| **Enterprise** | Custom | Custom | — |

MAU = Monthly Active User (a user who signs in at least once in the billing
period).

### Realistic usage

**MVP / Launch (0-10K MAU):**
- **Estimated: $0/month (Free plan)**
- Free tier includes: Social login, MFA, webhooks, user management UI

**Growth (10K-50K MAU):**
- 10K MAU: $25 + ($0.02 × 0) = $25
- 25K MAU: $25 + ($0.02 × 15,000) = $25 + $300 = **$325/month**
- 50K MAU: $25 + ($0.02 × 40,000) = $25 + $800 = **$825/month**

> Clerk becomes the single largest cost item at scale. Plan the upgrade budget
> accordingly once MAU approaches 10K.

### Free tier limitations

- No custom domain for the Clerk-hosted sign-in page (shows `accounts.clerk.dev`)
- No organization/team features (not needed for Travel Checker MVP)
- Limited support (community only)

**Upgrade trigger**: Upgrade to Pro when:
- You need a custom sign-in domain (brand consistency)
- MAU exceeds 9,500 (buffer before hard limit)

---

## 4. Cloudflare R2

**URL:** [developers.cloudflare.com/r2/pricing](https://developers.cloudflare.com/r2/pricing)

### Pricing model

R2 charges for storage and operations. There are **zero egress fees** — serving
photos to users from the CDN costs nothing extra. This is the key advantage over
AWS S3.

| Component | Free allowance | Paid rate |
|-----------|---------------|----------|
| Storage | 10 GB/month | $0.015/GB/month |
| Class A operations (write, list) | 1 million/month | $4.50 per million |
| Class B operations (read, head) | 10 million/month | $0.36 per million |
| Egress | Unlimited | $0 |

### Realistic usage

**Assumptions:**
- Average photo size after compression: 300 KB
- Photos per trip: 5
- Trips created per user per month: 2

**MVP (500 users, ~5,000 photos/month):**
- Storage: 5,000 photos × 300 KB = 1.5 GB/month accumulated
- Class A ops: ~5,000 (writes) — within free allowance
- Class B ops: ~50,000 (reads per active user) — within free allowance
- **Estimated: $0/month**

**Launch (5,000 users, ~50,000 photos/month):**
- Storage: ~15 GB accumulated
- Paid storage: (15 - 10) GB × $0.015 = $0.075
- Operations: within free allowances
- **Estimated: ~$1-3/month**

**Growth (25,000 users, ~250,000 photos/month):**
- Storage: ~75 GB accumulated
- Paid storage: (75 - 10) GB × $0.015 = ~$1
- Class A ops: 250,000/month — within free allowance
- Class B ops: ~2.5 million reads/month (10 reads per photo served) — within allowance
- **Estimated: ~$5-15/month**

### Cost control tips

- Compress images to WebP before upload (target: quality 80, max width 1600px).
  This alone reduces storage by ~40% versus JPEG.
- Implement lifecycle rules to delete orphaned uploads (photos not linked to
  any trip after 24 hours).
- R2 does not charge for inter-region data transfer within Cloudflare's network.

---

## 5. EAS Build (Expo Application Services)

**URL:** [expo.dev/pricing](https://expo.dev/pricing)

### Plans

| Plan | Monthly fee | iOS builds/month | Android builds/month | Concurrent |
|------|-------------|-----------------|---------------------|-----------|
| **Free** | $0 | 15 | 15 | 1 |
| **Production** | $99/month | 200 | 200 | 5 |
| **Enterprise** | Custom | Unlimited | Unlimited | Custom |

### Realistic usage

**MVP / Launch:**
- You typically need 1-2 production builds per release.
- With 1-2 releases per week, that is 8-16 builds/month.
- Free tier (15 builds/platform) is sufficient.
- **Estimated: $0/month**

**Growth (active release cycle):**
- CI/CD building on every merge to main would exhaust free tier quickly.
- Recommendation: trigger production builds manually or on tag pushes, not
  every commit. This keeps usage under 15 builds/month.
- **Estimated: $0/month (with discipline) or $99/month (Production plan)**

### Free tier limitations

- 1 concurrent build — iOS and Android builds queue behind each other.
- Build artifact retention: 30 days (Production: 100 days).
- No priority queue — builds may wait up to 20 minutes during peak hours.

**Upgrade trigger**: Upgrade to Production when:
- You consistently need iOS and Android builds simultaneously (saves ~1 hour)
- You release more than 15 times/month on either platform
- Build queue wait times are blocking your team

### GitHub Actions integration

The `.github/workflows/build-mobile.yml` workflow uses `EXPO_TOKEN` to trigger
EAS builds from CI. This counts against the free tier limits. Configure the
workflow to trigger only on release tags to avoid burning through the free quota
on every commit.

---

## 6. Sentry Error Tracking

**URL:** [sentry.io/pricing](https://sentry.io/pricing)

### Plans

| Plan | Monthly fee | Errors/month | Sessions | Performance |
|------|-------------|-------------|---------|-------------|
| **Free** | $0 | 5,000 | 10,000 | 10,000 spans |
| **Team** | $26/month | 50,000 | 100,000 | 100,000 spans |
| **Business** | $80/month | 100,000 | 500,000 | Unlimited |

### Realistic usage

**MVP / Launch:**
- With `tracesSampleRate: 0.1` (10% sampling), the API sends roughly:
  - 100 requests/day × 0.1 = 10 performance spans/day = 300/month
  - Error volume is typically <100/month in a healthy app
- **Estimated: $0/month (Free plan)**

**Growth (10K+ users):**
- ~5,000 requests/day × 0.1 = 500 spans/day = 15,000/month — within free tier
- Error volume depends on code quality; budget for Team plan at $26/month
- **Estimated: $0-26/month**

### Free tier limitations

- 30-day event retention (Team: 90 days).
- No uptime monitoring (use UptimeRobot free tier separately).
- 1 team member on free (Team plan: unlimited members).

**Upgrade trigger**: Upgrade to Team when:
- Error or session volume consistently exceeds free tier limits
- You need more than 30-day retention for debugging production issues

---

## 7. Apple Developer Program

**URL:** [developer.apple.com/programs](https://developer.apple.com/programs)

| Item | Cost |
|------|------|
| Annual membership | $99/year (~$8.25/month) |
| Renewal | $99/year |
| One-time enrollment | $0 (included in first year) |

The Apple Developer membership is required to:
- Publish on the App Store
- Use TestFlight for beta distribution
- Enable Sign In with Apple
- Sign production iOS builds

There is no free tier. Budget $99 annually from day one.

### What is included

- App Store distribution (unlimited apps)
- TestFlight (up to 10,000 beta testers)
- Xcode Cloud (25 compute hours/month free)
- Access to iOS/macOS beta SDKs
- Code signing certificates and provisioning profiles

---

## 8. Google Play Developer Account

**URL:** [play.google.com/console/signup](https://play.google.com/console/signup)

| Item | Cost |
|------|------|
| One-time registration fee | $25 (one-time only) |
| Ongoing | $0/month |

The Google Play one-time fee gives lifetime access. There are no annual fees
and no per-app charges.

### Distribution costs

| Item | Cost |
|------|------|
| App publishing | $0 |
| Play Store bandwidth | $0 |
| In-app purchases | 15% Google fee (first $1M/year), 30% above |
| Subscriptions | 15% Google fee (after first year of subscription) |

For Travel Checker's current pricing model (one-time purchase or subscription),
budget for Google's 15-30% cut on revenue, not on infrastructure.

---

## 9. Domain Registration

| Item | Annual cost | Monthly |
|------|-------------|---------|
| `travel-checker.app` (.app TLD) | ~$14-20/year | ~$1.50/month |
| DNS hosting (Cloudflare) | $0 | $0 |
| SSL (Cloudflare Universal) | $0 | $0 |

`.app` domains require HTTPS (Google's HSTS preload list). Cloudflare handles
this automatically.

---

## Total cost by growth tier

### Tier 1 — MVP (0-1,000 users, months 1-3)

| Service | Plan | Monthly cost |
|---------|------|:------------:|
| Railway | Hobby | $5 |
| Neon PostgreSQL | Free | $0 |
| Clerk | Free | $0 |
| Cloudflare R2 | Free allowance | $0 |
| EAS Build | Free | $0 |
| Sentry | Free | $0 |
| Apple Developer | Annual | $8.25 |
| Google Play | One-time amortized | ~$2* |
| Domain | Annual | $1.50 |
| **Total** | | **~$17/month** |

*$25 one-time fee amortized over 12 months for first year, then $0.

### Tier 2 — Launch (1,000-10,000 users, months 3-12)

| Service | Plan | Monthly cost |
|---------|------|:------------:|
| Railway | Hobby/Pro | $10-20 |
| Neon PostgreSQL | Free → Launch | $0-19 |
| Clerk | Free (under 10K MAU) | $0 |
| Cloudflare R2 | Minimal overage | $1-3 |
| EAS Build | Free | $0 |
| Sentry | Free | $0 |
| Apple Developer | Annual | $8.25 |
| Domain | Annual | $1.50 |
| **Total** | | **~$21-52/month** |

### Tier 3 — Growth (10,000-50,000 users, months 12-24)

| Service | Plan | Monthly cost |
|---------|------|:------------:|
| Railway | Pro (2 instances) | $40-60 |
| Neon PostgreSQL | Launch → Scale | $19-69 |
| Clerk | Pro | $25-325 |
| Cloudflare R2 | Growing storage | $5-15 |
| EAS Build | Free (with discipline) | $0 |
| Sentry | Free → Team | $0-26 |
| Apple Developer | Annual | $8.25 |
| Domain | Annual | $1.50 |
| **Total** | | **~$99-505/month** |

> The wide range in Tier 3 is driven by Clerk's MAU-based pricing. At 10K MAU
> it costs $25. At 50K MAU it costs $825. This is the primary cost driver
> to manage at scale — consider whether all MAUs are actually active or if the
> definition can be optimized.

---

## Cost optimization decision points

| Monthly spend | Action |
|---------------|--------|
| $50+ | Review Railway instance size — is 512MB RAM actually being used? |
| $100+ | Enable Neon connection pooling if not already active |
| $200+ | Audit Clerk MAU — are old/inactive users being cleaned up? |
| $300+ | Evaluate Railway Pro vs AWS Fargate spot instances |
| $500+ | Review image storage — implement aggressive WebP compression |
| $1,000+ | Begin AWS migration planning (Cloud Architect decision point) |
| $2,000+ | AWS ECS/Fargate migration is likely cheaper at this scale |

---

## Annual one-time costs

| Item | Cost | When |
|------|------|------|
| Apple Developer Program | $99 | Before first iOS build |
| Google Play registration | $25 | Before first Android submission |
| **Total first year** | **$124** | |
| **Total subsequent years** | **$99/year** | |
