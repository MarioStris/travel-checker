# Security Architecture — Travel Checker

**Datum:** 2026-03-27
**Agent:** Security Architect

---

## 1. Threat Model (STRIDE)

### S — Spoofing (lažno predstavljanje)
| Prijetnja | Severity | Mitigation |
|-----------|:--------:|------------|
| Lažna autentifikacija — napadač se prijavi kao drugi korisnik | Kritična | Clerk managed auth, Apple Sign In verified, JWT validation |
| Fake API requests — bot se predstavlja kao mobilna app | Visoka | API key + JWT, rate limiting, certificate pinning |
| Phishing — lažna login stranica | Srednja | Apple Sign In (ne može se phishati), educacija korisnika |

### T — Tampering (neovlaštena promjena)
| Prijetnja | Severity | Mitigation |
|-----------|:--------:|------------|
| Izmjena tuđih tripova/komentara | Kritična | Owner-based authorization na svakom endpointu |
| SQL injection | Kritična | Prisma ORM (parameterized queries), Zod input validation |
| Manipulacija slika u uploadu | Srednja | File type validation (magic bytes), max size 10MB, virus scan |

### R — Repudiation (poricanje akcija)
| Prijetnja | Severity | Mitigation |
|-----------|:--------:|------------|
| Korisnik tvrdi da nije objavio sadržaj | Niska | Audit log (created_at, user_id na svakom zapisu) |
| Korisnik tvrdi da nije dao consent | Srednja | Timestamp consent-a u DB, double opt-in za email |

### I — Information Disclosure (curenje podataka)
| Prijetnja | Severity | Mitigation |
|-----------|:--------:|------------|
| Leak privatnih tripova | Visoka | is_public provjera u svakom query-ju, middleware auth |
| Leak osobnih podataka (email, lokacija) | Visoka | API nikad ne vraća email drugih korisnika, minimalni profil podaci |
| Slike dostupne bez auth | Srednja | Signed URLs za privatne slike (expiry 1h), R2 access policy |
| Database dump | Kritična | Encryption at rest (Neon default), network isolation, MFA za admin |

### D — Denial of Service
| Prijetnja | Severity | Mitigation |
|-----------|:--------:|------------|
| API DDoS | Visoka | Cloudflare WAF (free), rate limiting (100 req/min/user) |
| Image upload abuse (ogromne datoteke) | Srednja | Max 10MB per file, max 10 files per trip, daily upload limit |
| Expensive DB queries | Srednja | Query timeout (5s), pagination obavezna, indeksi |

### E — Elevation of Privilege
| Prijetnja | Severity | Mitigation |
|-----------|:--------:|------------|
| Regular user pristupa admin endpointima | Kritična | Role-based middleware, admin routes odvojeni |
| Korisnik modificira tuđe resurse | Kritična | Owner check na svakom PATCH/DELETE |
| JWT manipulation | Visoka | Clerk managed tokens, RS256 signature verification |

---

## 2. Authentication strategija

### Apple Sign In
```
Flow:
1. iOS app → Apple Sign In SDK → Apple ID token
2. iOS app → POST /api/auth/webhook s tokenom
3. Backend → Clerk verificira token → kreira/pronađe usera
4. Backend → vraća JWT (access + refresh token)
5. iOS app sprema tokene u Keychain
```

### Email/Password
- Clerk managed — ne čuvamo passworde u našoj DB
- Password policy: min 8 znakova, 1 uppercase, 1 broj
- Bcrypt hashing (Clerk internal)
- Email verification obavezna

### JWT Token Management
```
Access Token:
- Lifetime: 15 minuta
- Signed: RS256 (Clerk private key)
- Contains: userId, email, role
- Storage: in-memory (React Native state)

Refresh Token:
- Lifetime: 30 dana
- Storage: iOS Keychain (encrypted)
- Rotation: novi refresh token pri svakom refreshu
- Revocation: na logout, password change, suspicion
```

### Session Management
- Max 5 concurrent sessions per user
- Session listing u settings (v1.1)
- Force logout all sessions opcija
- Auto-logout nakon 30 dana inaktivnosti

---

## 3. Authorization

### Roles
| Role | Opis | Pristup |
|------|------|---------|
| `user` | Registrirani korisnik | CRUD svojih resursa, read public resursa |
| `moderator` | Content moderator (v1.1) | Read/delete bilo čiji public content |
| `admin` | Administrator | Full access |

### Resource-based Authorization

```typescript
// Middleware primjer
const requireOwner = (resourceType: string) => async (c, next) => {
  const userId = c.get('userId'); // iz JWT-a
  const resourceId = c.req.param('id');

  const resource = await db[resourceType].findUnique({ where: { id: resourceId } });
  if (!resource) throw new HTTPException(404);
  if (resource.userId !== userId) throw new HTTPException(403);

  await next();
};

// Primjena
app.patch('/api/trips/:id', auth(), requireOwner('trip'), updateTrip);
app.delete('/api/trips/:id', auth(), requireOwner('trip'), deleteTrip);

// Public access - ne zahtijeva ownership
app.get('/api/trips/:id', auth(), async (c) => {
  const trip = await db.trip.findUnique({ where: { id } });
  if (!trip.isPublic && trip.userId !== c.get('userId')) {
    throw new HTTPException(403);
  }
  return c.json(trip);
});
```

---

## 4. Data Encryption

### At Rest
| Podatak | Encryption | Metoda |
|---------|:----------:|--------|
| PostgreSQL (Neon) | ✅ | AES-256, Neon managed |
| Slike (Cloudflare R2) | ✅ | AES-256, Cloudflare managed |
| Backups | ✅ | Encrypted by provider |
| iOS Keychain (tokens) | ✅ | iOS hardware encryption |

### In Transit
| Kanal | Encryption | Metoda |
|-------|:----------:|--------|
| App ↔ API | ✅ | TLS 1.3 (Cloudflare) |
| API ↔ Database | ✅ | TLS (Neon enforced) |
| API ↔ R2 | ✅ | HTTPS |
| App ↔ Google Maps | ✅ | HTTPS (Google enforced) |

### Certificate Pinning (iOS)
```swift
// React Native - ssl-pinning library
// Pin Cloudflare intermediate cert
// Update pins svaka 3 mjeseca
// Fallback: disable pinning na pin failure (graceful degradation)
```

### Sensitive Fields
- Budget iznosi: encrypted u DB nije potreban (Neon encrypts at rest)
- Email: nikad ne izlaži email drugih korisnika u API response-ima
- Lokacija: precizne koordinate samo za vlastite tripove, zaokružene za tuđe

---

## 5. GDPR Compliance Checklist

### Consent Management
- [ ] Consent za Terms of Service pri registraciji
- [ ] Consent za Privacy Policy pri registraciji
- [ ] Consent timestamp pohranjen u DB (`users.consent_at`)
- [ ] Opcionalni consent za marketing email-ove
- [ ] Consent za push notifikacije (iOS native)
- [ ] Cookie consent — N/A (native app, nema cookies)

### Right to Access (Članak 15)
- [ ] Endpoint: `GET /api/users/me/export`
- [ ] Vraća JSON s svim korisnikovim podacima
- [ ] Uključuje: profil, svi tripovi, slike (URL-ovi), budgeti, komentari
- [ ] Response time: < 72 sata (ali cilj: instant za < 1GB podataka)

### Right to Portability (Članak 20)
- [ ] Export u standardnom formatu (JSON)
- [ ] Uključuje slike (download ZIP)
- [ ] Endpoint: `GET /api/users/me/export?format=zip`

### Right to Erasure — "Right to be Forgotten" (Članak 17)
- [ ] Endpoint: `DELETE /api/users/me`
- [ ] Briše: user profil, svi tripovi, sve slike, svi komentari, svi followsi
- [ ] Cascade delete u DB (ON DELETE CASCADE)
- [ ] R2 slike: batch delete putem API-ja
- [ ] 30-dnevni grace period (soft delete → hard delete)
- [ ] Email potvrda brisanja
- [ ] Clerk account deletion

### Right to Rectification (Članak 16)
- [ ] Korisnik može editirati sve svoje podatke kroz app
- [ ] `PATCH /api/users/me` za profil
- [ ] `PATCH /api/trips/:id` za tripove

### Data Minimization (Članak 5)
- [ ] Samo prikupljamo podatke koji su potrebni za funkcionalnost
- [ ] Nema tracking korisnika (lokacija u realnom vremenu)
- [ ] Nema prodaje podataka trećim stranama
- [ ] Analytics: PostHog s anonimiziranim podacima

### Privacy Policy Requirements
- [ ] Jasno objašnjenje koji podaci se prikupljaju
- [ ] Svrha obrade podataka
- [ ] Treće strane koje primaju podatke (Clerk, Cloudflare, Google Maps)
- [ ] Prava korisnika (access, deletion, portability)
- [ ] Kontakt DPO-a (Data Protection Officer)
- [ ] Dostupan u app-u i na web stranici

---

## 6. Security Testing Plan

### OWASP Top 10 — API Checklist

| # | Prijetnja | Status | Implementacija |
|---|-----------|:------:|---------------|
| A01 | Broken Access Control | ✅ Planned | Owner-based auth, role middleware |
| A02 | Cryptographic Failures | ✅ Planned | TLS 1.3, AES-256, no plaintext secrets |
| A03 | Injection | ✅ Planned | Prisma ORM, Zod validation |
| A04 | Insecure Design | ✅ Planned | STRIDE threat model, security review |
| A05 | Security Misconfiguration | ⚠️ Ongoing | Automated config audit, no default creds |
| A06 | Vulnerable Components | ✅ Planned | npm audit, Dependabot, automated updates |
| A07 | Auth Failures | ✅ Planned | Clerk managed, JWT RS256 |
| A08 | Software/Data Integrity | ✅ Planned | Signed builds (EAS), integrity checks |
| A09 | Logging/Monitoring Failures | ✅ Planned | Sentry, structured logging, audit trail |
| A10 | SSRF | ✅ Planned | URL validation za accommodation links, allowlist za external calls |

### iOS Security Checklist
- [ ] Keychain za token storage (ne AsyncStorage)
- [ ] Jailbreak detection (warning, ne block)
- [ ] Certificate pinning za API calls
- [ ] Screenshot protection za sensitive screens (v1.1)
- [ ] Biometric auth opcija za app lock (v1.1)
- [ ] No sensitive data u logs (redact tokens, emails)
- [ ] ProGuard/obfuscation za release build

### Penetration Testing Scope
- API endpoint security (auth bypass, IDOR)
- Image upload exploitation (XXE, malicious files)
- JWT manipulation attempts
- Rate limiting effectiveness
- Social engineering via comments (XSS)
- **Timing:** Prije public launch, zatim kvartalno

---

## 7. Content Moderation (v1.1 — Social features)

### Image Moderation
```
Upload Flow:
1. User uploads image → R2 storage
2. Async job: send to moderation API (AWS Rekognition ili Cloudflare AI)
3. Check za: NSFW, violence, hate symbols
4. If flagged → hide image, notify moderator
5. Moderator reviews → approve/delete
6. If delete → notify user, strike system
```

### Comment Moderation
- Profanity filter (basic word list + ML v2.0)
- Spam detection (repeated text, links)
- Report button na svakom komentaru
- 3 strikes → temporary ban (7 dana)
- 5 strikes → permanent ban

### Report/Block mehanizam
```
Report types:
- Inappropriate content
- Spam
- Harassment
- Fake/misleading information
- Copyright violation

Flow:
1. User taps "Report" → selects reason → optional comment
2. Report saved in DB (reports table)
3. Auto-hide if 3+ reports on same content
4. Moderator review queue
5. Action: dismiss, warn, delete, ban
```

### Block mehanizam
- `POST /api/users/:id/block`
- Blocked user: ne vidi tvoje public tripove, ne može komentirati, ne može followati
- Obostrano: ako A blokira B, B ne vidi A
- Block lista u settings

### Strike System
| Strikes | Akcija |
|:-------:|--------|
| 1 | Warning email |
| 2 | Content removal + in-app warning |
| 3 | 7-day comment/social ban |
| 4 | 30-day full feature restriction |
| 5 | Permanent account suspension |
