# Market Research Analiza — Travel Checker

**Datum:** 2026-03-27
**Verzija:** 1.0

---

## 1. TAM / SAM / SOM

### TAM — Total Addressable Market
- **Globalno tržište travel aplikacija (2025):** ~48 mlrd USD
- **Travel tech segment (booking + planning + tracking):** ~12 mlrd USD
- **Rast:** 8-12% CAGR (2024-2030)

### SAM — Serviceable Addressable Market
- **iOS korisnici globalno:** ~1.4 mlrd
- **Putnici koji koriste travel apps na iOS:** ~280M (20%)
- **Travel tracking/journaling segment:** ~35M korisnika globalno
- **SAM procjena:** ~2.1 mlrd USD (35M × ~60 USD/god spend na travel apps/services)

### SOM — Serviceable Obtainable Market
- **Realistično dostiživo u 12 mjeseci:** 30.000-50.000 korisnika
- **Realistično dostiživo u 24 mjeseca:** 100.000-250.000 korisnika
- **SOM revenue (Y1):** 30.000-100.000 € (ovisno o konverziji)
- **Geografski fokus:** Europa + Sjeverna Amerika (engleski + HR)
- **Target: 0.1% SAM-a u 24 mjeseca**

---

## 2. Konkurentska analiza — Top 7

### 2.1 Polarsteps
- **Users:** 5M+ downloads
- **Strengths:** Automatski GPS tracking, lijepa karta, offline mode, travel statistika
- **Weaknesses:** Slabi social features, nema budget tracking, nema kategorije putnika, ograničena community
- **Pricing:** Free + Premium 29.99 €/god
- **Key differentiator:** Automatsko praćenje rute

### 2.2 Visited (visited.app)
- **Users:** 1M+
- **Strengths:** Scratch map koncept, jednostavan UI, zemlje i regije
- **Weaknesses:** Samo tracking zemalja (nema detalje), nema social, nema budget, nema slike
- **Pricing:** Free + Premium 4.99 €
- **Key differentiator:** Vizualna scratch map

### 2.3 TripIt
- **Users:** 20M+
- **Strengths:** Automatski import iz emaila, itinerary management, airport info
- **Weaknesses:** Fokus na poslovne putnike, nema karta pregleda, nema social sharing, star dizajn
- **Pricing:** Free + Pro 49 USD/god
- **Key differentiator:** Email parsing za itinerary

### 2.4 Wanderlog
- **Users:** 2M+
- **Strengths:** Trip planning + journal, kolaborativno planiranje, Google Maps integracija
- **Weaknesses:** Previše fokusiran na planiranje (ne tracking), nema budget per trip, ograničeni social
- **Pricing:** Free + Pro 4.49 €/mj
- **Key differentiator:** Kolaborativno trip planiranje

### 2.5 TripAdvisor
- **Users:** 500M+
- **Strengths:** Ogromna baza recenzija, brand prepoznatljivost, SEO dominacija
- **Weaknesses:** Prenatrpan UI, fokus na review/booking ne tracking, nema personalna karta, nema travel journal
- **Pricing:** Free (ad-supported)
- **Key differentiator:** Review database

### 2.6 Been (by FlatCube)
- **Users:** 500K+
- **Strengths:** Jednostavan tracking posjećenih zemalja, lijepa vizualizacija
- **Weaknesses:** Samo zemlje (nema gradove/destinacije), nema social, nema detalje, minimalne features
- **Pricing:** Free + Premium 2.99 €
- **Key differentiator:** Minimalistički scratch map

### 2.7 Travello
- **Users:** 1M+
- **Strengths:** Social travel network, matchmaking s putnicima, group trips
- **Weaknesses:** Nema karta tracking, nema budget, fokus na upoznavanje ne dokumentaciju
- **Pricing:** Free + Premium
- **Key differentiator:** Social matching za putnike

### Feature Comparison Matrica

| Feature | Travel Checker | Polarsteps | Visited | TripIt | Wanderlog | TripAdvisor | Been | Travello |
|---------|---------------|------------|---------|--------|-----------|-------------|------|----------|
| Interaktivna karta | ✅ Full | ✅ Ruta | ⚠️ Samo zemlje | ❌ | ✅ Planning | ❌ | ⚠️ Zemlje | ❌ |
| Budget tracking | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Social/profili | ✅ | ⚠️ Basic | ❌ | ❌ | ⚠️ Collab | ✅ Reviews | ❌ | ✅ |
| Komentari | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Slike | ✅ Unlimited* | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Social sharing | ✅ | ✅ | ⚠️ | ❌ | ⚠️ | ❌ | ⚠️ | ✅ |
| Kategorije putnika | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ |
| Period/sezona | ✅ | ✅ Auto | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Smještaj link | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Offline mode | ❌ v1 | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |

**Zaključak:** Nijedan konkurent ne pokriva kombinaciju: karta + social + budget + kategorije. To je naša niša.

---

## 3. SWOT Analiza (vs konkurencija)

### Strengths
- **Jedina app s budget tracking po destinaciji** — ogromna vrijednost za budget-conscious putnike
- **Kategorije putnika** — personaliziran experience, relevantnije preporuke
- **Social + karta combo** — Polarsteps ima kartu bez social-a, Travello ima social bez karte
- **Moderan tech stack** — brže iteracije od legacy konkurenata (TripIt, TripAdvisor)

### Weaknesses
- **Zero user base** — hladni start, prazan social feed
- **Nema automatski GPS tracking** — Polarsteps to ima, mi zahtijevamo ručni unos
- **iOS only** — Polarsteps, Wanderlog su cross-platform
- **Nema offline** u v1

### Opportunities
- **Travel creator economy** eksplodira — 2M+ travel influencera traži bolje alate
- **"How much did it really cost?"** je #1 pitanje u travel community-ju — mi to rješavamo
- **Gen Z travel boom** — mladi putuju više nego ikad, žele dijeliti digitalno
- **Partnerships:** Booking.com affiliate, Airbnb, turističke zajednice

### Threats
- **Polarsteps** može dodati budget tracking (ali nisu 3+ godine)
- **Apple Maps** poboljšanja mogu smanjiti Google Maps prednost
- **Social media zamor** — korisnici možda ne žele JOŠ jednu social platformu
- **Privacy regulacije** mogu ograničiti lokacijske podatke

---

## 4. Trendovi u industriji

### Travel Tech 2024-2026
1. **AI-powered personalizacija** — preporuke na temelju prošlih putovanja i preferencija
2. **Sustainable travel** — carbon footprint tracking, eco-friendly opcije
3. **Micro-adventures** — kratka putovanja, vikend getaway, lokalni turizam
4. **Bleisure travel** — mix poslovnih i leisure putovanja (post-COVID trend)
5. **Solo female travel** — najbrže rastući segment (+40% YoY)

### Social Travel Sharing
1. **Vertikalni video** dominira (TikTok, Reels) — travel content je #3 kategorija
2. **Autentičnost > estetika** — korisnici žele "real costs" i "honest reviews"
3. **Community-based recommendations** — trust u peer reviews raste, trust u influencere pada
4. **Map-based discovery** — vizualne karte su engaging format (Pinterest Maps, Google Maps Explore)

### Monetizacija trendovi
1. **Freemium je standard** — 3-7% konverzija je norma za travel apps
2. **Affiliate revenue** je stabilan stream (Booking.com plaća 3-4% komisije)
3. **B2B upsell** — turističke agencije i DMO-ovi plaćaju za insights
4. **Subscription fatigue** — cijena mora biti < 5 €/mj da ne bude barrier

---

## 5. Kategorije putnika — istraživanje

Na temelju analize travel industrije, travel subreddita, i competitor patterns, preporučamo **10 kategorija:**

| # | Kategorija | Opis | Veličina segmenta | Specifične potrebe |
|---|-----------|------|-------------------|-------------------|
| 1 | **Solo putnik** | Putuje sam/a, fleksibilan | ~25% svih putnika | Sigurnost, hosteli, solo-friendly destinacije |
| 2 | **Par / Couple** | Romantična putovanja | ~30% | Romantični restorani, boutique hoteli, aktivnosti za dvoje |
| 3 | **Obitelj s djecom** | Roditelji + djeca | ~20% | Kid-friendly mjesta, family resorts, sigurnost |
| 4 | **Backpacker** | Budget putnik, duža putovanja | ~8% | Najjeftinije opcije, hosteli, javni prijevoz, dugi boravci |
| 5 | **Luxury putnik** | Premium iskustvo | ~5% | 5* hoteli, premium restorani, privatni transferi |
| 6 | **Digital Nomad** | Radi remote i putuje | ~7% | WiFi kvaliteta, coworking, dugi boravci, visa info |
| 7 | **Avanturist** | Outdoor, sport, adrenalin | ~10% | Planinarenje, ronjenje, surfanje, oprema |
| 8 | **Kulturni putnik** | Muzeji, povijest, lokalna kultura | ~15% | Povijesni lokaliteti, festivali, lokalna kuhinja |
| 9 | **Grupno / Agencija** | Organizirani grupni obilasci | ~12% | Cijena paketa, itinerary, vodič |
| 10 | **Poslovni putnik** | Službena putovanja + leisure | ~10% | Blizina centra, lounge, brzi WiFi, bleisure opcije |

### Dodatne sub-kategorije za v2:
- **Senior putnik** (60+) — pristupačnost, tempo, zdravstvena infrastruktura
- **Pet-friendly putnik** — smještaj koji prima kućne ljubimce
- **Festival/event putnik** — koncerti, festivali, sportski eventi
- **Foodie putnik** — fokus na gastronomiju
- **Wellness putnik** — spa, retreat, yoga

### Age Range kategorije:
- 18-24 (Student/Young adult)
- 25-34 (Young professional)
- 35-44 (Established professional)
- 45-54 (Mid-career)
- 55-64 (Pre-retirement)
- 65+ (Retirement)

---

## 6. User Demographics — idealni korisnik

### Primarna persona
- **Dob:** 25-35
- **Spol:** 55% ženski, 45% muški (žene više koriste travel apps)
- **Lokacija:** Zapadna Europa, Sjeverna Amerika
- **Prihod:** Srednji do viši srednji (40-80K €/god)
- **Putovanja:** 3-6 puta godišnje (mix vikend i dulja putovanja)
- **Tech savviness:** Visoka, iPhone korisnik, aktivan na Instagramu
- **Motivacija:** Želi dokumentirati putovanja, inspirirati druge, vidjeti koliko je stvarno potrošio/la

### Sekundarna persona
- **Dob:** 20-28
- **Profil:** Digital nomad / backpacker
- **Putovanja:** Dugotrajnija (1-6 mjeseci)
- **Motivacija:** Budget planning, community, pronalaženje suputnika
- **Cijena-osjetljiv:** Da — free tier je ključan

### Tercijarna persona
- **Dob:** 35-50
- **Profil:** Obitelj s djecom
- **Putovanja:** 2-3 puta godišnje, planirano
- **Motivacija:** Organizacija, memorije za djecu, budget kontrola

---

## 7. Barriers to Entry

| Barrier | Težina | Naš odgovor |
|---------|--------|-------------|
| **Network efekt** — postojeći igrači imaju korisnike | Visoka | Fokus na niche (budget tracking) koji nema nitko, viralni sharing |
| **App Store discovery** — teško se probiti | Visoka | ASO optimizacija, influencer marketing, Product Hunt launch |
| **Brand trust** — novi brand, korisnici oprezni | Srednja | Freemium model smanjuje rizik za korisnika, social proof (reviews) |
| **Content cold start** — prazan feed na početku | Visoka | Seed sadržaj od beta testera, gamifikacija za rane korisnike, import iz Polarsteps |
| **Technical complexity** — karta + social + real-time | Srednja | Proven tech stack, Google Maps SDK, websocket za real-time |
| **Google Maps API costs** — skalira s korisnicima | Srednja | Caching, cluster markers, mogući switch na OpenStreetMap |
| **Retention** — travel apps imaju sezonski pattern | Visoka | Social feed drži korisnike aktivnima između putovanja, push notifikacije |

### Ključni insight
Najveća barrier je **cold start problem** — social app bez korisnika nema vrijednost. Mitigation:
1. Lansirati s **travel journal** fokusom (vrijednost i za jednog korisnika)
2. Social features su **bonus**, ne core value prop
3. Uvoziti podatke iz drugih app (Polarsteps export, Instagram)
4. Beta program s 200-500 travel enthusiasta prije javnog launcha
