# CFO Financijska Analiza — Travel Checker

**Datum:** 2026-03-27
**Verzija:** 1.0

---

## 1. Procjena budžeta

### Development (jednokratno)

| Stavka | Procjena | Napomena |
|--------|----------|----------|
| iOS app (React Native) | 15.000 € | 3 mj, 1-2 developera |
| Backend API + DB | 8.000 € | Node.js/Express, PostgreSQL |
| Cloud infrastruktura setup | 3.000 € | AWS/GCP, CDN, S3 |
| UI/UX dizajn | 5.000 € | Design system, wireframes, prototipi |
| QA + testiranje | 3.000 € | E2E, performance, security |
| **Ukupno development** | **34.000 €** | |

### Infrastruktura (mjesečno)

| Stavka | Mj. trošak (0-10K users) | Mj. trošak (10-50K) | Mj. trošak (50K+) |
|--------|--------------------------|----------------------|--------------------|
| Cloud hosting (compute) | 80 € | 250 € | 600 € |
| Database (managed PostgreSQL) | 50 € | 150 € | 400 € |
| Object storage (slike) | 30 € | 200 € | 800 € |
| CDN | 20 € | 80 € | 250 € |
| Google Maps API | 0 € (free tier) | 150 € | 500 € |
| Monitoring/logging | 0 € | 30 € | 80 € |
| Email/Push notifikacije | 10 € | 40 € | 100 € |
| **Ukupno infra/mj** | **190 €** | **900 €** | **2.730 €** |

### Marketing (prvih 6 mjeseci)

| Stavka | Budžet | Napomena |
|--------|--------|----------|
| App Store Optimization (ASO) | 1.000 € | Screenshots, opisi, A/B test |
| Social media ads (Instagram, TikTok) | 6.000 € | 1.000 €/mj, travel niche targeting |
| Influencer partnerships | 3.000 € | 5-10 micro-influencera (travel niche) |
| Content marketing | 1.500 € | Blog, SEO, travel guides |
| PR / Launch kampanja | 1.500 € | Product Hunt, tech press |
| **Ukupno marketing** | **13.000 €** | |

### Ukupni budžet — prvih 12 mjeseci

| Kategorija | Iznos |
|------------|-------|
| Development | 34.000 € |
| Infrastruktura (12 mj, prosječno) | 6.000 € |
| Marketing | 13.000 € |
| Operativno (Apple Dev Account, tooling) | 1.200 € |
| Nepredviđeno (15%) | 8.100 € |
| **UKUPNO** | **62.300 €** |

---

## 2. ROI Projekcija

### Pretpostavke
- Freemium model: 5% konverzija u premium
- Premium cijena: 4.99 €/mj ili 39.99 €/god
- Ad revenue: 0.50 € CPM za free tier korisnike
- Affiliate revenue: 0.20 € po booking referral

### 12-mjesečna projekcija

| Scenarij | Korisnici (12 mj) | Premium % | MRR (mj 12) | Ukupni prihod Y1 | ROI |
|----------|--------------------|-----------|-------------|-------------------|-----|
| **Pesimistično** | 10.000 | 3% | 1.500 € | 8.000 € | -87% |
| **Realistično** | 30.000 | 5% | 7.500 € | 32.000 € | -49% |
| **Optimistično** | 80.000 | 7% | 28.000 € | 95.000 € | +52% |

### 24-mjesečna projekcija

| Scenarij | Korisnici (24 mj) | Premium % | MRR (mj 24) | Ukupni prihod Y2 | Kumulativni ROI |
|----------|--------------------|-----------|-------------|-------------------|-----------------|
| **Pesimistično** | 25.000 | 4% | 5.000 € | 38.000 € | -26% |
| **Realistično** | 80.000 | 6% | 24.000 € | 155.000 € | +49% |
| **Optimistično** | 250.000 | 8% | 100.000 € | 650.000 € | +443% |

---

## 3. Unit Economics

| Metrika | Target | Napomena |
|---------|--------|----------|
| **CAC (Customer Acquisition Cost)** | < 1.50 € | Organic + paid mix, travel niche |
| **LTV (Lifetime Value)** | 8-12 € | Pretpostavljamo 12 mj avg lifetime, mix free/premium |
| **LTV/CAC ratio** | > 5:1 | Zdrav ratio za mobile app |
| **ARPU (mjesečni)** | 0.35 € (free) / 4.99 € (premium) | Blended: ~0.60 €/mj |
| **Payback period** | < 3 mjeseca | Vrijeme do povrata CAC-a |
| **Gross margin** | > 75% | Niski COGS (cloud + API troškovi) |

### Cost per User (mjesečno)

| Stavka | Trošak/user/mj |
|--------|----------------|
| Hosting | 0.005 € |
| Storage (avg 50MB slika/user) | 0.010 € |
| CDN | 0.003 € |
| Google Maps API | 0.002 € |
| Push/Email | 0.001 € |
| **Ukupno** | **~0.02 €/user/mj** |

---

## 4. Break-even analiza

### Fiksni troškovi (mjesečno nakon launcha)
- Infrastruktura: ~500 €/mj (prosječno)
- Maintenance/bugfix: ~1.500 €/mj (part-time)
- Marketing: ~1.000 €/mj
- **Ukupno fiksno:** ~3.000 €/mj

### Break-even kalkulacija
- Blended ARPU: 0.60 €/mj (5% premium konverzija)
- Potrebno MAU za break-even na operativnim troškovima: **5.000 MAU**
- Potrebno korisnika za povrat ukupne investicije (62.300 €):
  - Pri 0.60 € blended ARPU: **~104.000 user-mjeseci**
  - Realistično: **break-even u mjesecu 14-16**

### Milestone targets

| Milestone | Korisnici | MRR | Mjesec |
|-----------|-----------|-----|--------|
| Operativni break-even | 5.000 MAU | 3.000 € | Mj 6-8 |
| Investicija break-even | 25.000 MAU | 7.500 € | Mj 14-16 |
| Profitabilnost | 50.000 MAU | 15.000 € | Mj 18-20 |

---

## 5. Monetizacija — preporučeni modeli

### Model A: Freemium (PREPORUČENO)

**Free tier:**
- Do 10 tripova
- Do 5 slika po tripu
- Osnovna karta s pin-ovima
- Javni profil
- Ads u feedu (tasteful, native)

**Premium (4.99 €/mj ili 39.99 €/god):**
- Unlimited tripovi i slike
- Napredna statistika (ukupni budget, prosjeci po destinaciji, kategoriji)
- Custom karta stilovi i export HD karte
- Privatne grupe za dijeljenje
- Bez reklama
- Priority support
- Advanced filteri (po budgetu, sezoni, kategoriji putnika)

### Model B: Freemium + Affiliate

Sve iz Model A, plus:
- Affiliate linkovi na Booking.com, Airbnb, GetYourGuide
- Komisija 3-5% na bookinge kroz app
- Potencijalni prihod: 0.20-0.50 € po referral-u

### Model C: Freemium + B2B

Sve iz Model A, plus:
- Turistička agencija dashboard (plaćeni)
- Agencije vide trendove, mogu promovirati destinacije
- Pricing: 49-199 €/mj po agenciji
- Potencijal za značajan B2B revenue stream

**Preporuka:** Kreni s Model A, dodaj Model B u v1.2, istražuj Model C nakon 50K korisnika.

---

## 6. Cash Flow projekcija — prvih 12 mjeseci (realistični scenarij)

| Mjesec | Korisnici | Prihod | Troškovi | Neto | Kumulativno |
|--------|-----------|--------|----------|------|-------------|
| 0 (pre-launch) | 0 | 0 € | -34.000 € | -34.000 € | -34.000 € |
| 1 | 1.000 | 200 € | -3.500 € | -3.300 € | -37.300 € |
| 2 | 2.500 | 500 € | -3.500 € | -3.000 € | -40.300 € |
| 3 | 5.000 | 1.200 € | -3.500 € | -2.300 € | -42.600 € |
| 4 | 8.000 | 2.000 € | -3.800 € | -1.800 € | -44.400 € |
| 5 | 11.000 | 3.000 € | -3.800 € | -800 € | -45.200 € |
| 6 | 14.000 | 4.200 € | -4.000 € | +200 € | -45.000 € |
| 7 | 17.000 | 5.000 € | -4.000 € | +1.000 € | -44.000 € |
| 8 | 20.000 | 6.000 € | -4.200 € | +1.800 € | -42.200 € |
| 9 | 23.000 | 6.500 € | -4.200 € | +2.300 € | -39.900 € |
| 10 | 26.000 | 7.000 € | -4.500 € | +2.500 € | -37.400 € |
| 11 | 28.000 | 7.200 € | -4.500 € | +2.700 € | -34.700 € |
| 12 | 30.000 | 7.500 € | -4.500 € | +3.000 € | -31.700 € |

**Napomena:** Operativni break-even oko mjeseca 6. Investicija se vraća oko mjeseca 16.

---

## 7. Financijski rizici i contingency

| # | Rizik | Impact | Mitigation |
|---|-------|--------|------------|
| 1 | **Google Maps API troškovi rastu brže od prihoda** | Visok | Prebaciti na OpenStreetMap/MapLibre nakon 10K korisnika, koristiti caching agresivno |
| 2 | **Konverzija u premium < 3%** | Visok | A/B test paywall positioning, dodati exclusive features, testirati niže cijene (2.99 €) |
| 3 | **Storage troškovi za slike eksplodiraju** | Srednji | Image compression (WebP), limit na rezoluciju, progressive loading, lifecycle policies (archive stare slike) |
| 4 | **CAC raste iznad 3 €** | Srednji | Fokus na organic growth (ASO, referral program, viral sharing), smanjiti paid spend |
| 5 | **Runway < 6 mjeseci** | Kritičan | Rezerva od 15% u budgetu, mogućnost smanjenja marketing spenda, prioritizirati monetizaciju ranije |

### Contingency plan
- Ako MRR < 2.000 € u mjesecu 6 → Pivot na purer B2B model (turistička industrija)
- Ako CAC > 3 € → Zaustavi paid marketing, fokus 100% organic
- Ako churn > 80% → Fundamentalni product pivot ili shut down
