# Monitoring i Alerting plan — Travel Checker API

## 1. Slojevi monitoringa

| Sloj | Alat | Što prati |
|------|------|-----------|
| Uptime | Better Uptime / UptimeRobot | `/health` endpoint svakih 60s |
| Error tracking | Sentry (Node.js SDK) | Unhandled exceptions, 5xx greške |
| Performance APM | Railway Metrics + Sentry Perf | P50/P95/P99 latencija, throughput |
| Infrastruktura | Railway Dashboard | CPU, memory, restartovi |
| Baza podataka | Neon Dashboard | Connection pool, slow queries |
| Logovi | Railway Logs + Sentry Breadcrumbs | Structured JSON logs |

---

## 2. Health check endpointi

### `GET /health` — liveness
```json
{
  "status": "ok",
  "timestamp": "2026-03-27T10:00:00.000Z",
  "service": "travel-checker-api"
}
```
- HTTP 200 = server je živ
- Timeout: 10s
- Frekvencija provjere: 30s (Docker), 60s (Better Uptime)

### `GET /api/health/ready` — readiness (preporučeno dodati)
Treba provjeriti:
- DB ping (`SELECT 1`)
- Prisma connection pool

---

## 3. Alert pravila

### Kritično (PagerDuty / SMS — odmah)
| Trigger | Threshold | Akcija |
|---------|-----------|--------|
| Uptime check fail | 2 uzastopna neuspjeha (2 min) | Page on-call engineer |
| Error rate | > 5% 5xx u zadnjih 5 min | Page on-call engineer |
| Response time P95 | > 2000ms u zadnjih 5 min | Page on-call engineer |
| Memory usage | > 90% kroz 10 min | Page on-call engineer |
| DB connections | > 80% pool kapaciteta | Page on-call engineer |

### Upozorenje (Slack #alerts — pažnja)
| Trigger | Threshold | Akcija |
|---------|-----------|--------|
| Error rate | > 1% 5xx u zadnjih 15 min | Slack notification |
| Response time P95 | > 1000ms u zadnjih 15 min | Slack notification |
| Memory usage | > 75% kroz 15 min | Slack notification |
| Failed deploys | Svaki failed deploy | Slack notification |
| Container restart | Svaki neočekivani restart | Slack notification |

### Informativno (Slack #deployments)
- Svaki uspješni deploy
- EAS build completed
- Health check passing nakon deploy-a

---

## 4. Sentry konfiguracija

### Instalacija u API
```bash
npm install @sentry/node --workspace=apps/api
```

### Inicijalizacija (`apps/api/src/lib/sentry.ts`)
```typescript
import * as Sentry from '@sentry/node';

export function initSentry(): void {
  if (!process.env.SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      Sentry.prismaIntegration(),
    ],
  });
}
```

### Environment varijable
```
SENTRY_DSN=https://xxxx@oXXXX.ingest.sentry.io/XXXX
```

---

## 5. Structured logging format

Svaki log entry mora biti JSON:
```json
{
  "level": "error",
  "message": "Database query failed",
  "service": "travel-checker-api",
  "timestamp": "2026-03-27T10:00:00.000Z",
  "requestId": "req_abc123",
  "userId": "user_xyz",
  "path": "/api/trips",
  "method": "POST",
  "statusCode": 500,
  "durationMs": 245,
  "error": {
    "name": "PrismaClientKnownRequestError",
    "code": "P2002",
    "message": "Unique constraint failed"
  }
}
```

---

## 6. SLA ciljevi

| Metrika | Target | Critical |
|---------|--------|----------|
| Uptime | 99.5% (monthly) | < 99% |
| P50 latencija | < 200ms | > 500ms |
| P95 latencija | < 500ms | > 2000ms |
| P99 latencija | < 1000ms | > 5000ms |
| Error rate (5xx) | < 0.5% | > 5% |
| MTTR | < 30 min | > 2 sata |

---

## 7. On-call runbook

### API ne odgovara
1. Provjeri Railway dashboard — je li kontejner pokrenut?
2. Pogledaj zadnji deploy log — je li deploy uspio?
3. Provjeri DATABASE_URL — je li Neon DB dostupan?
4. Ako sve izgleda OK, restarti service u Railway dashboardu
5. Ako restart ne pomaže — rollback na prethodni deploy

### Visoka latencija
1. Provjeri Neon slow query log
2. Provjeri memory usage — ako > 90%, scale up
3. Provjeri Sentry Perf za N+1 query probleme
4. Ako je batch job uzrok — throttle ili rasporedi van peak-a

### Visok error rate
1. Otvori Sentry — identificiraj najčešću grešku
2. Je li nova greška vezana uz zadnji deploy? Rollback.
3. Je li problem vanjski (Clerk, Cloudflare R2)? Provjeri status page-ove.
4. Implementiraj fix, test, deploy

---

## 8. Status page-ovi vanjskih servisa

- Clerk: https://clerkstatus.com
- Cloudflare: https://www.cloudflarestatus.com
- Neon: https://neonstatus.com
- Railway: https://status.railway.app
- Expo / EAS: https://expo.dev/status
