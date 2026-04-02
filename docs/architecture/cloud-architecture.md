# Cloud Architecture — Travel Checker

**Datum:** 2026-03-27
**Agent:** Cloud Architect

---

## 1. Cloud Provider Odluka

### Matrica usporedbe

| Kriterij | AWS | GCP | Railway + Cloudflare | Fly.io |
|----------|:---:|:---:|:-------------------:|:------:|
| Ease of setup | 2/5 | 3/5 | 5/5 | 4/5 |
| Cost (0-10K users) | 3/5 | 3/5 | 5/5 | 4/5 |
| Cost (100K+ users) | 4/5 | 4/5 | 3/5 | 4/5 |
| Managed PostgreSQL | ✅ RDS | ✅ Cloud SQL | ✅ Neon | ✅ Supabase |
| Object Storage | ✅ S3 | ✅ GCS | ✅ R2 (0 egress!) | ❌ (need S3) |
| CDN | CloudFront | Cloud CDN | ✅ Built-in | ❌ (need CF) |
| Auto-scaling | ✅ | ✅ | ⚠️ Manual | ✅ |
| Developer experience | 2/5 | 3/5 | 5/5 | 4/5 |
| Migration path | N/A | Easy | Easy to AWS | Easy |

### Preporuka: Railway (compute) + Neon (DB) + Cloudflare (CDN/R2/WAF)

**Obrazloženje:**
- **Railway**: Deploy iz GitHub-a u 2 minute, auto-deploy na push, dobar za Node.js, jeftin za start ($5/mj)
- **Neon**: Serverless PostgreSQL, scale-to-zero, PostGIS support, free tier generous (0.5GB)
- **Cloudflare R2**: NULA egress troškova — kritično za image-heavy app. S3-compatible API.
- **Cloudflare CDN/WAF**: Besplatni plan pokriva DDoS zaštitu, caching, SSL
- **Migration path**: Kad prerastemo Railway → premjesti na AWS ECS/Fargate. Neon → AWS RDS. R2 ostaje.

---

## 2. Infrastructure dizajn

```
Internet
   │
   ▼
┌──────────────────┐
│  Cloudflare      │  ← DNS, CDN, WAF, DDoS protection
│  (Free plan)     │     SSL termination
│  ┌─────────────┐ │
│  │ R2 Storage  │ │  ← Slike (0 egress cost)
│  │ + Images    │ │     On-the-fly resize
│  └─────────────┘ │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Railway         │  ← API Server (Hono/Node.js)
│  Pro Plan        │     Auto-deploy from GitHub
│  ┌─────────────┐ │     Health checks
│  │ API Server  │ │     Horizontal scaling (v1.1+)
│  │ (container) │ │
│  └─────────────┘ │
└───┬─────────┬────┘
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│  Neon  │ │ Upstash  │  ← Redis (v1.1)
│ PgSQL  │ │  Redis   │     Caching, rate limiting
│PostGIS │ │(serverless)│    Sessions
└────────┘ └──────────┘

External:
├── Clerk (Auth) — managed, no infra needed
├── Google Maps Platform — API keys, usage monitoring
├── Sentry (Error tracking) — free tier 5K events/mj
├── PostHog (Analytics) — free tier 1M events/mj
└── Expo EAS (Build/OTA) — managed mobile builds
```

---

## 3. Cost projekcija

### Tier 1: 0-10K users (Launch — mjeseci 1-6)

| Servis | Plan | Mj. trošak |
|--------|------|:----------:|
| Railway (API) | Pro ($5 base + usage) | ~$10 |
| Neon (PostgreSQL) | Free → Launch ($19) | $0-19 |
| Cloudflare (CDN + WAF) | Free | $0 |
| Cloudflare R2 (slike) | Pay-as-you-go | ~$3 |
| Clerk (Auth) | Free tier (10K MAU) | $0 |
| Google Maps | Free tier | $0 |
| Sentry | Free tier | $0 |
| PostHog | Free tier | $0 |
| Expo EAS | Free tier | $0 |
| Domain | .com | $1 |
| **UKUPNO** | | **~$15-35/mj** |

### Tier 2: 10K-50K users (Growth — mjeseci 6-12)

| Servis | Plan | Mj. trošak |
|--------|------|:----------:|
| Railway (API, 2 instances) | Pro | ~$40 |
| Neon (PostgreSQL) | Scale ($69) | $69 |
| Cloudflare R2 (~500GB) | Pay-as-you-go | ~$8 |
| Cloudflare Images | $5 base + usage | ~$15 |
| Upstash Redis | Pay-as-you-go | ~$10 |
| Clerk (Auth) | Pro ($25 + $0.02/MAU) | ~$75 |
| Google Maps | Over free tier | ~$100 |
| Sentry | Team ($26) | $26 |
| PostHog | Free tier still | $0 |
| **UKUPNO** | | **~$345/mj** |

### Tier 3: 50K-100K+ users (Scale — mjeseci 12-18)

| Servis | Plan | Mj. trošak |
|--------|------|:----------:|
| Railway (API, 4 instances) | Pro | ~$120 |
| Neon (PostgreSQL + read replica) | Scale | ~$150 |
| Cloudflare R2 (~2TB) | Pay-as-you-go | ~$30 |
| Cloudflare Images | Usage-based | ~$50 |
| Upstash Redis | Pro | ~$30 |
| Clerk (Auth) | Pro | ~$225 |
| Google Maps | Heavy usage | ~$400 |
| Sentry | Team | $26 |
| PostHog | Growth tier | ~$50 |
| **UKUPNO** | | **~$1,080/mj** |

### Migration trigger: Kad mjesečni troškovi prijeđu $2,000/mj → evaluirati AWS ECS/Fargate

---

## 4. Disaster Recovery

### RTO / RPO

| Metrika | MVP Target | Growth Target |
|---------|:----------:|:-------------:|
| RTO (Recovery Time Objective) | < 4 sata | < 1 sat |
| RPO (Recovery Point Objective) | < 24 sata | < 1 sat |

### Backup strategija

| Što | Kako | Učestalost | Retencija |
|-----|------|:----------:|:---------:|
| PostgreSQL | Neon automated snapshots | Kontinuirano (WAL) | 7 dana (free), 30 dana (pro) |
| Slike (R2) | R2 je durable by design (11 9s) | N/A | Permanentno |
| Config/secrets | Railway environment variables | Na svaku promjenu | Git history |
| Kod | GitHub | Svaki commit | Permanentno |

### Failover plan
1. **API down**: Railway auto-restart container (< 30s). Ako persistent → redeploy iz GitHub.
2. **Database down**: Neon ima automatski failover. Manual: restore iz snapshota.
3. **R2 down**: Cloudflare globalna infrastruktura, 99.999% durability. Fallback: placeholder slike.
4. **Complete region outage**: Deploy novi Railway instance u drugoj regiji (US/EU). Neon cross-region backup.

---

## 5. Skalabilnost plan

### Image Pipeline

```
Upload Flow:
Mobile App → Presigned URL (API) → Direct upload to R2 → Webhook → API saves metadata

Serving Flow:
Mobile App → Cloudflare Images URL (with transforms) → CDN cache → R2 origin

Transform primjeri:
- Thumbnail: /cdn-cgi/image/width=200,height=200,fit=cover/{image_id}
- Detail: /cdn-cgi/image/width=800,quality=80/{image_id}
- Full: /cdn-cgi/image/width=1600,quality=90/{image_id}
```

### Database Scaling

| Korisnici | Strategija |
|-----------|-----------|
| 0-10K | Single Neon instance, dobri indeksi |
| 10-50K | Connection pooling (PgBouncer), query optimization |
| 50-100K | Neon read replica za čitanja (feed, search, profiles) |
| 100K+ | Partitioning trips tablice po datumu, materialized views za stats |

### API Scaling

| Korisnici | Strategija |
|-----------|-----------|
| 0-10K | 1 Railway instance (1 vCPU, 512MB) |
| 10-50K | 2 instance + Railway load balancer |
| 50-100K | 4 instance + Redis caching layer |
| 100K+ | Migrate to AWS ECS/Fargate s auto-scaling |

---

## 6. FinOps Plan

### Cost Monitoring
- Railway dashboard: CPU/memory/bandwidth po servisu
- Neon dashboard: compute hours, storage
- Cloudflare dashboard: R2 operations, bandwidth
- Google Maps: Cloud Console billing alerts
- **Alert thresholds**: Email notifikacija na 80% budgeta

### Optimizacije
| Optimizacija | Ušteda | Kada |
|-------------|:------:|------|
| Cloudflare R2 umjesto S3 | ~60% na egress | Od početka |
| Image compression (WebP, quality 80) | ~40% storage | Od početka |
| Neon scale-to-zero (dev/staging) | ~$50/mj | Od početka |
| Redis caching (hot data) | ~30% DB load | v1.1 |
| Lazy loading slika | ~20% bandwidth | Od početka |
| Google Maps marker clustering | ~50% API calls | Od početka |

### Budget Alerts
- $50/mj → review spending (Tier 1)
- $200/mj → optimize queries, check anomalies (Tier 1→2)
- $500/mj → evaluate reserved capacity (Tier 2)
- $1,500/mj → evaluate AWS migration (Tier 2→3)
