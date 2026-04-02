# CEO Strateška Analiza — Travel Checker

**Datum:** 2026-03-27
**Status:** GO ✅

---

## 1. Vizija proizvoda

Travel Checker je iOS aplikacija koja transformira način na koji putnici dokumentiraju, dijele i otkrivaju putovanja. Kombiniramo vizualni travel journal s interaktivnom kartom svijeta i social platformom — omogućujući korisnicima da grade svoj putni digitalni identitet, inspiriraju druge putnike i donose informirane odluke o budućim destinacijama na temelju stvarnih iskustava i budgeta.

---

## 2. Strateški ciljevi (12 mjeseci)

| # | Cilj | Metrika | Target |
|---|------|---------|--------|
| 1 | Product-Market Fit | Retention D30 | > 40% |
| 2 | User Acquisition | Registrirani korisnici | 50.000 u prvih 12 mj |
| 3 | Engagement | MAU/DAU ratio | > 25% |
| 4 | Monetizacija | MRR | 10.000 €/mj do kraja Y1 |
| 5 | Kvaliteta | App Store rating | > 4.5 zvjezdica |

---

## 3. GO/NO-GO Odluka

### ✅ GO — s uvjetima

**Obrazloženje:**

**Zašto GO:**
1. **Tržište raste** — global travel tech market raste 8-12% godišnje, post-COVID travel boom je u punom zamahu
2. **Jasna praznina** — nijedna app ne kombinira kvalitetno: karta + social + budget tracking + kategorije putnika. Polarsteps je najbliži ali nema budget tracking ni social engagement
3. **Viralni potencijal** — sharing na društvene mreže s vizualnom kartom je inherentno viralan (user-generated content marketing)
4. **Niski inicijalni troškovi** — iOS only smanjuje development scope, besplatni Google Maps tier pokriva prvih 28.000 loads/mj
5. **Jasna monetizacija** — freemium model s premium features (unlimited slike, napredna statistika, privatne grupe)

**Uvjeti za GO:**
1. MVP mora biti out u roku 3 mjeseca
2. Fokus na core loop: Dodaj trip → Označi na karti → Podijeli
3. Social features u drugoj iteraciji (v1.1), ne u MVP-u
4. Budget za prvih 6 mjeseci osiguran unaprijed

---

## 4. Top 5 rizika i mitigation

| # | Rizik | Vjerojatnost | Impact | Mitigation |
|---|-------|-------------|--------|------------|
| 1 | **Google Maps API troškovi eskaliraju** s rastom korisnika | Srednja | Visok | Implementirati caching tile-ova, koristiti MapLibre/OpenStreetMap kao fallback, optimizirati API pozive (cluster markers) |
| 2 | **Niska retencija** — korisnici dodaju tripove i odlaze | Visoka | Visok | Gamifikacija (badges, streaks), social feed koji donosi korisnike natrag, push notifikacije za komentare |
| 3 | **Konkurent kopira feature set** (Polarsteps, TripAdvisor) | Srednja | Srednji | First-mover advantage u budget+social nišu, graditi community koji je teško replicirati, brzina iteracija |
| 4 | **Skalabilnost** pri velikom broju slika | Visoka | Srednji | CDN od dana 1 (CloudFront/Cloudflare), image compression pipeline, progressive loading, S3 s lifecycle policies |
| 5 | **App Store rejection** ili promjena pravila | Niska | Visok | Strogo pratiti Apple HIG, in-app purchase za monetizaciju, redovni compliance audit |

---

## 5. SWOT Analiza

### Strengths (Snage)
- **Jedinstvena kombinacija:** karta + social + budget tracking u jednoj app
- **iOS focus** = kvalitetniji UX, viši ARPU korisnika
- **Vizualni viralni loop** — karta s pin-ovima je "shareabilna"
- **Kategorije putnika** — personalizacija koju nitko nema
- **Budget transparency** — jedini koji nude pravi cost breakdown po destinaciji

### Weaknesses (Slabosti)
- **Samo iOS** — gubimo 45%+ globalnog tržišta (Android)
- **Novi brand** — nema prepoznatljivosti ni trust-a
- **Ovisnost o Google Maps API** — pricing i dostupnost
- **Hladni start** — prazan social feed bez kritične mase korisnika
- **Mali tim** — ograničen development bandwidth

### Opportunities (Prilike)
- **Post-COVID travel boom** — rekordni brojevi putnika globalno
- **Creator economy** — travel influenceri traže bolji alat od Instagrama za travel content
- **Partnership potencijal** — hoteli, booking platforme, turističke agencije
- **Data monetizacija** — anonimni travel trend podaci su vrijedni za turističku industriju
- **Affiliate revenue** — linkovi na booking, smještaj, aktivnosti

### Threats (Prijetnje)
- **Polarsteps** već ima 5M+ korisnika i dobru kartu
- **TripAdvisor** može dodati travel tracking u postojeću app
- **Instagram/TikTok** su default za travel sharing
- **Ekonomska recesija** može smanjiti putovanja
- **GDPR/privacy** — lokacijski podaci su osjetljivi

---

## 6. Competitive Moat

Naš moat se gradi na 3 stupa:

1. **Budget Intelligence** — jedini koji kombiniraju vizualni travel log s transparentnim budget trackingom. Korisnici vide "Koliko STVARNO košta tjedan u Lisabonu za par?" — to je podatak koji ne postoji nigdje tako strukturirano.

2. **Kategorija putnika** — personaliziran feed i preporuke. Solo backpacker ne treba iste info kao obitelj s djecom ili luxury traveler. Nitko ne segmentira iskustva po tipu putnika.

3. **Network efekt + UGC** — svaki novi korisnik dodaje vrijednost za sve ostale. Više tripova = bogatija karta = bolji podaci = više korisnika. Kada korisnik ima 20+ tripova na karti, switching cost je visok.

---

## 7. Key Success Metrics — Dan 1

### Aktivacija
- **Time to First Trip** < 3 minute (od registracije do prvog unesenog putovanja)
- **Completion Rate** > 60% (korisnici koji završe onboarding)

### Engagement
- **Trips per User** — prosjek > 3 u prvih 30 dana
- **Photos per Trip** — prosjek > 2
- **Map Views per Session** — prosjek > 2

### Retencija
- **D1 Retention** > 60%
- **D7 Retention** > 35%
- **D30 Retention** > 20% (target 40% u 6 mj)

### Viralnost
- **Share Rate** > 15% korisnika dijeli barem 1 trip
- **Invite Rate** > 10% korisnika pozove barem 1 prijatelja
- **K-factor** target > 0.5

### Kvaliteta
- **Crash Rate** < 0.5%
- **App Store Rating** > 4.3 na launchu
- **Support Ticket Rate** < 2% MAU
