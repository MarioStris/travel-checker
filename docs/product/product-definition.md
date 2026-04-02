# Product Definition — Travel Checker

**Datum:** 2026-03-27
**Agent:** CPO
**Input:** CEO analiza, CFO analiza, Market Research

---

## 1. Persone

### Persona 1: Ana — Connected Explorer (Primarna)
- **Dob:** 28 | **Zanimanje:** UX dizajnerica, Zagreb
- **Prihod:** 55.000 €/god
- **Travel profil:** 4-5 putovanja godišnje, mix vikend i tjedan dana. Solo + s partnerom. Europa + ponekad daleke destinacije.
- **Tech profil:** iPhone 15, Instagram daily, koristi Polarsteps ali frustrirana je. Power user.
- **Motivacija:** Želi lijepi vizualni dnevnik putovanja. Voli uspoređivati budgete. Inspirira prijatelje.
- **Frustracije:** Polarsteps nema budget tracking. Instagram Stories nestanu. Nema centralno mjesto za sve tripove. Ne zna koliko je stvarno potrošila na putovanje.
- **Citat:** "Želim na jednom mjestu vidjeti sve svoje tripove na karti i znati koliko me svako putovanje koštalo."

### Persona 2: Marko — Digital Nomad
- **Dob:** 32 | **Zanimanje:** Full-stack developer, remote
- **Prihod:** 75.000 €/god
- **Travel profil:** Stalno u pokretu, 8-12 zemalja godišnje, boravci 2-8 tjedana. Solo.
- **Tech profil:** iPhone 14 Pro, tech-savvy, koristi Notion za tracking ali želi bolji alat.
- **Motivacija:** Praćenje troškova po zemlji/gradu. Želi vidjeti statistike. Community digitalnih nomada.
- **Frustracije:** Nema app koja kombinira travel log + expenses. Spreadsheetovi su dosadni. Želi vidjeti "koliko košta mjesec u Lisabonu vs Bali."
- **Citat:** "Trebam znati svoj burn rate po destinaciji da mogu planirati sljedeće mjesece."

### Persona 3: Ivana i Tomislav — Family Travelers
- **Dob:** 38 i 40 | **Zanimanje:** Učiteljica i IT manager, Split
- **Prihod:** 80.000 €/god (zajednički)
- **Travel profil:** 2-3 putovanja godišnje, sve planirano. Family-friendly destinacije. Agencija ponekad.
- **Tech profil:** iPhone 13, umjereni tech korisnici. Facebook i WhatsApp.
- **Motivacija:** Memorije za djecu, organizacija, budget kontrola za obiteljska putovanja.
- **Frustracije:** Slike rasute po telefonu. Ne sjećaju se detalja putovanja od prije 3 godine. Ne znaju koliko su ukupno potrošili.
- **Citat:** "Kad djeca odrastu, želim im pokazati sve što smo zajedno posjetili."

---

## 2. User Stories (20)

### Registracija & Profil
| # | Story | Persona |
|---|-------|---------|
| US-01 | Kao nova korisnica, želim se registrirati putem Apple ID-a, kako bih započela u 10 sekundi | Ana |
| US-02 | Kao korisnik, želim odabrati svoju kategoriju putnika (solo, par, obitelj, backpacker, digital nomad, luxury, avanturist, kulturni, grupno, poslovni), kako bih dobio personalizirani experience | Marko |
| US-03 | Kao korisnik, želim urediti svoj profil (slika, bio, zemlje koje sam posjetio), kako bi drugi vidjeli tko sam | Ana |

### Unos putovanja (Trip)
| # | Story | Persona |
|---|-------|---------|
| US-04 | Kao korisnica, želim dodati novo putovanje s nazivom, destinacijom, datumima i kategorijom, kako bih dokumentirala svoj trip | Ana |
| US-05 | Kao korisnik, želim dodati opis smještaja s linkom (Booking, Airbnb), kako bih zapamtio gdje sam bio | Marko |
| US-06 | Kao korisnik, želim unijeti ukupni budget putovanja (smještaj, hrana, transport, aktivnosti), kako bih pratio troškove | Marko |
| US-07 | Kao korisnica, želim dodati slike uz putovanje (do 20 po tripu), kako bih imala vizualni dnevnik | Ivana |
| US-08 | Kao korisnik, želim odabrati period godine (proljeće, ljeto, jesen, zima) i exact datume, kako bih znao kada sam putovao | Svi |
| US-09 | Kao korisnica, želim napisati detaljni opis/recenziju putovanja, kako bih podijelila iskustvo | Ana |

### Karta
| # | Story | Persona |
|---|-------|---------|
| US-10 | Kao korisnica, želim vidjeti interaktivnu kartu svijeta sa svim mojim destinacijama kao pin-ovima, kako bih imala pregled svih putovanja | Ana |
| US-11 | Kao korisnik, želim kliknuti na pin na karti i vidjeti detalje tog putovanja, kako bih brzo pristupio informacijama | Marko |
| US-12 | Kao korisnica, želim vidjeti statistiku na karti (broj zemalja, gradova, kontinenata), kako bih pratila napredak | Ana |

### Social
| # | Story | Persona |
|---|-------|---------|
| US-13 | Kao korisnica, želim objaviti putovanje kao public post, kako bi drugi korisnici mogli vidjeti | Ana |
| US-14 | Kao korisnik, želim komentirati nečiju public objavu, kako bih podijelio savjet ili postavio pitanje | Marko |
| US-15 | Kao korisnica, želim pratiti (follow) druge korisnike, kako bih vidjela njihova nova putovanja u feedu | Ana |
| US-16 | Kao korisnik, želim vidjeti profil drugog korisnika s njegovom kartom i putovanjima, kako bih se inspirirao | Marko |

### Sharing
| # | Story | Persona |
|---|-------|---------|
| US-17 | Kao korisnica, želim podijeliti putovanje na Instagram/WhatsApp/Facebook kao vizualnu karticu, kako bih inspirirala prijatelje | Ana |
| US-18 | Kao korisnica, želim podijeliti svoju kompletnu kartu kao sliku, kako bih pokazala sve destinacije | Ivana |

### Discovery
| # | Story | Persona |
|---|-------|---------|
| US-19 | Kao korisnik, želim pretraživati destinacije i vidjeti iskustva drugih korisnika, kako bih planirao sljedeće putovanje | Marko |
| US-20 | Kao korisnica, želim filtrirati putovanja po budgetu, kategoriji putnika i sezoni, kako bih našla relevantne tripove | Ana |

---

## 3. MoSCoW Prioritizacija

### Must Have (MVP — v1.0)
- ✅ Registracija (Apple ID + email)
- ✅ Onboarding s odabirom kategorije putnika
- ✅ Kreiranje/uređivanje profila
- ✅ Dodavanje putovanja (naziv, destinacija, datumi, period)
- ✅ Budget unos po kategorijama (smještaj, hrana, transport, aktivnosti, ostalo)
- ✅ Upload slika (do 10 po tripu u MVP)
- ✅ Opis putovanja (rich text)
- ✅ Smještaj link
- ✅ Interaktivna karta s pin-ovima (Google Maps SDK)
- ✅ Klik na pin → trip detail
- ✅ Statistika (broj zemalja, gradova, ukupni budget)
- ✅ Public/private toggle za putovanja
- ✅ Osnovna navigacija (5 tabova)

### Should Have (v1.1 — mjesec 4-5)
- 📌 Social feed (vidjeti putovanja praćenih korisnika)
- 📌 Follow/unfollow korisnika
- 📌 Komentari na public objave
- 📌 Pregled profila drugog korisnika
- 📌 Share na društvene mreže (Instagram, WhatsApp, Facebook)
- 📌 Share karte kao slika
- 📌 Push notifikacije (novi komentari, novi followeri)

### Could Have (v2.0 — mjesec 6-8)
- 💡 Discover/Explore sekcija s filterima (budget, kategorija, sezona)
- 💡 Search destinacija
- 💡 Napredna statistika (prosjeci po zemlji, kategoriji, sezoni)
- 💡 Badges i gamifikacija
- 💡 AI preporuke destinacija
- 💡 Privatne grupe za dijeljenje
- 💡 Import iz Polarsteps/Instagram

### Won't Have (za sada)
- ❌ Android verzija
- ❌ Web verzija
- ❌ Automatski GPS tracking
- ❌ Offline mode
- ❌ Trip planning (budući putovi)
- ❌ Booking integracija (affiliate)
- ❌ B2B dashboard za agencije
- ❌ Video upload
- ❌ Real-time chat između korisnika

---

## 4. MVP Scope — jasna definicija

### IDE u MVP (v1.0):
1. Auth: Apple Sign In + Email/Password
2. Onboarding: Odabir kategorije putnika (10 opcija) + age range
3. Profil: Slika, ime, bio, statistika
4. Trip CRUD: Create, Read, Update, Delete putovanja
5. Trip fields: Naziv, destinacija (Google Places autocomplete), datumi, period/sezona, kategorija putnika, budget breakdown, opis, smještaj link, do 10 slika, public/private
6. Karta: Google Maps SDK, custom pin-ovi po statusu, zoom, pan, cluster za bliske pin-ove
7. Trip Detail: Svi podaci + galerija slika + karta pozicija
8. My Trips: Lista svih putovanja (sort by datum, destinacija)
9. Stats: Broj zemalja, gradova, kontinenata, ukupni budget, prosječni budget
10. Settings: Edit profil, notifikacije, privacy, logout, delete account

### NE IDE u MVP:
- Social feed, follow, komentari (v1.1)
- Sharing na mreže (v1.1)
- Discover/Explore (v2.0)
- Bilo kakva AI funkcionalnost
- Bilo kakva monetizacija (paywall dolazi u v1.1)

### Definition of Done za MVP:
- [ ] Sve Must Have user stories implementirane
- [ ] 0 critical/high bugova
- [ ] Performance: app start < 2s, karta load < 1s
- [ ] Accessibility: VoiceOver support za core flows
- [ ] Testovi: >70% code coverage, E2E za core flows
- [ ] App Store review guidelines compliance
- [ ] Privacy policy i Terms of Service

---

## 5. Feature-Effort Matrica

| Feature | Impact (1-5) | Effort (1-5) | Prioritet | Komentar |
|---------|:------------:|:------------:|:---------:|----------|
| Interaktivna karta | 5 | 4 | MVP | Core feature, Google Maps SDK |
| Trip kreiranje | 5 | 2 | MVP | Osnovna CRUD forma |
| Budget tracking | 5 | 2 | MVP | Kategorije + total |
| Slike upload | 4 | 3 | MVP | S3 + compression |
| Apple Sign In | 5 | 1 | MVP | Apple SDK, brz setup |
| Kategorija putnika | 4 | 1 | MVP | Selection UI |
| Profil | 3 | 2 | MVP | Standardan CRUD |
| Statistika | 4 | 2 | MVP | Aggregacija iz DB |
| Social feed | 5 | 4 | v1.1 | Kompleksan, trebamo korisnike prvo |
| Komentari | 4 | 3 | v1.1 | Real-time, moderation |
| Follow sustav | 4 | 3 | v1.1 | Social graph |
| Share na mreže | 4 | 2 | v1.1 | Deep links + image gen |
| Push notifikacije | 3 | 2 | v1.1 | APNs setup |
| Discover/filteri | 4 | 4 | v2.0 | Search + filter engine |
| AI preporuke | 3 | 5 | v2.0 | LLM integracija |
| Badges/gamifikacija | 3 | 3 | v2.0 | Design + logic |
| Privatne grupe | 2 | 4 | v2.0 | Group management |

---

## 6. Success KPIs — MVP Launch

### Aktivacija (prvih 30 dana)
| KPI | Target | Mjerenje |
|-----|--------|----------|
| Downloads | 2.000 | App Store Connect |
| Registration rate | > 70% (download → register) | Analytics |
| First Trip rate | > 50% (register → first trip u 7 dana) | Analytics |
| Time to First Trip | < 3 minute | Analytics |
| Onboarding completion | > 80% | Analytics |

### Engagement (mjesečno)
| KPI | Target | Mjerenje |
|-----|--------|----------|
| MAU / Downloads | > 40% | Analytics |
| Trips per User (30d) | > 2 | Analytics |
| Photos per Trip | > 3 | Analytics |
| Map opens per session | > 1.5 | Analytics |
| Session length | > 3 min | Analytics |
| Sessions per week | > 2 | Analytics |

### Retencija
| KPI | Target | Mjerenje |
|-----|--------|----------|
| D1 Retention | > 55% | Analytics |
| D7 Retention | > 30% | Analytics |
| D30 Retention | > 20% | Analytics |

### Kvaliteta
| KPI | Target | Mjerenje |
|-----|--------|----------|
| Crash-free rate | > 99.5% | Crashlytics |
| App Store rating | > 4.3 | App Store Connect |
| Avg review score | > 4.0 | App Store Connect |

---

## 7. Information Architecture

### Tab Bar (5 tabova)
```
[🏠 Home] [🗺️ Map] [➕ Add] [👤 Profile] [⚙️ More]
```

### Navigacija

```
HOME (Tab 1)
├── My Trips (lista, sort by date)
│   └── Trip Detail
│       ├── Galerija slika
│       ├── Budget breakdown
│       └── Edit Trip
└── Stats Overview (countries, cities, total budget)

MAP (Tab 2)
├── Interaktivna karta (full screen)
│   ├── Pin-ovi svih destinacija
│   ├── Cluster za bliske pin-ove
│   └── Tap pin → Trip Detail popup → Full detail
└── Filter (po godini, kategoriji, budgetu) [v2.0]

ADD TRIP (Tab 3 — modal)
├── Step 1: Destinacija (Google Places autocomplete)
├── Step 2: Datumi + Period/Sezona
├── Step 3: Kategorija putnika + Age range
├── Step 4: Smještaj (naziv, link, rating)
├── Step 5: Budget (kategorije: smještaj, hrana, transport, aktivnosti, ostalo)
├── Step 6: Opis (rich text)
├── Step 7: Slike (upload, do 10)
└── Step 8: Public/Private + Save

PROFILE (Tab 4)
├── Header (slika, ime, bio, stats)
├── My Trips grid/list toggle
├── Countries visited counter
├── Kategorija putnika badge
└── Edit Profile

MORE (Tab 5)
├── Settings
│   ├── Account
│   ├── Privacy
│   ├── Notifications [v1.1]
│   └── About
├── Help & FAQ
├── Rate App
├── Share App
└── Logout / Delete Account
```

### Buduće sekcije (v1.1+)
```
FEED (zamjenjuje Home ili novi tab)
├── Following Feed
├── Trending / Popular
└── Post → Trip Detail

DISCOVER (unutar More ili novi tab)
├── Search destinacija
├── Filter (budget, kategorija, sezona)
└── Rezultati → Trip Detail → User Profile
```
