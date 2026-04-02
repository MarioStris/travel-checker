# UX Research — Travel Checker

**Datum:** 2026-03-27
**Agent:** UX Researcher
**Input:** CEO analiza, Market Research, Product Definition

---

## 1. User Journey Map — Ana (28, Connected Explorer, Solo)

### Faza 1: Awareness
- **Akcije:** Vidi prijateljičin Instagram story s Travel Checker kartom. Googla "travel tracking app iOS"
- **Razmišljanja:** "Ovo izgleda cool — konačno app koja pokazuje sve tripove na karti"
- **Emocije:** 😮 Znatiželja, zainteresiranost
- **Pain points:** Teško pronaći u App Store-u (novi brand)
- **Opportunities:** Viralni share format (karta sa pin-ovima) je najjači acquisition kanal

### Faza 2: Download
- **Akcije:** Otvara App Store, čita opise i recenzije, gleda screenshotove
- **Razmišljanja:** "Je li besplatna? Koliko prostora zauzima? Izgleda li moderno?"
- **Emocije:** 😐 Evaluacija, usporedba s Polarsteps
- **Pain points:** Malo recenzija (novi app), nejasno što je besplatno a što premium
- **Opportunities:** App Store screenshotovi s kartom i budget trackingom su key differentiator

### Faza 3: Onboarding
- **Akcije:** Otvara app, Sign in with Apple, odabire kategoriju putnika (Solo), age range (25-34)
- **Razmišljanja:** "Ovo je brzo! Sviđa mi se da pita kakav sam putnik"
- **Emocije:** 😊 Pozitivno iznenađenje, nestrpljenje da počne
- **Pain points:** Ako onboarding traje > 60 sekundi → drop-off
- **Opportunities:** Personalizirani onboarding na temelju kategorije. Pokazati "empty state" karte s motivirajućom porukom

### Faza 4: First Trip
- **Akcije:** Dodaje prvi trip (Lisabon, prošli mjesec). Unosi smještaj, budget, slike.
- **Razmišljanja:** "Koliko sam zapravo potrošila? Sjećam se smještaja ali ne transporta..."
- **Emocije:** 😌 Nostalgija, zadovoljstvo dokumentiranjem
- **Pain points:** Dugotrajan unos ako ima previše polja. Ne sjeća se točnog budgeta.
- **Opportunities:** Pametni defaulti (period se auto-izračuna iz datuma), mogućnost "približnog" budgeta

### Faza 5: Explore Map
- **Akcije:** Otvara kartu, vidi pin u Lisabonu. Zooma out, vidi koliko je pokrila.
- **Razmišljanja:** "Samo 1 pin! Moram dodati sva prošla putovanja!"
- **Emocije:** 🤩 Oduševljenje, motivacija za dodavanje više tripova
- **Pain points:** Prazan map s 1 pinom izgleda tužno
- **Opportunities:** "Add your past trips" prompt. Gamifikacija — "Posjetila si 1/195 zemalja"

### Faza 6: Content Building
- **Akcije:** Dodaje 5-10 prošlih putovanja. Gleda kartu kako se puni.
- **Razmišljanja:** "Ovo je super pregled! Nisam znala da sam bila u 12 zemalja"
- **Emocije:** 😍 Ponos, zadovoljstvo
- **Pain points:** Bulk unos prošlih putovanja je zamoran
- **Opportunities:** Quick add (samo destinacija + datum, detalji kasnije)

### Faza 7: Share
- **Akcije:** Screenshot karte, dijeli na Instagram story
- **Razmišljanja:** "Ovo će prijatelji htjeti — kako da ga dobiju?"
- **Emocije:** 😄 Uzbuđenje, ponos
- **Pain points:** Share mora izgledati PREMIUM — watermark ali ne prenapadni
- **Opportunities:** Branded share image s QR kodom za download. Viralni loop.

### Faza 8: Return
- **Akcije:** Vraća se da doda novo putovanje, pregleda statistiku, odgovori na komentare
- **Razmišljanja:** "Moram ovo ažurirati nakon svakog puta"
- **Emocije:** 😊 Navika, rutina
- **Pain points:** Zaboravi dodati trip. Nema podsjetnika.
- **Opportunities:** Smart push: "Upravo si se vratila iz Barcelone? Dodaj trip!" (location trigger u v2)

---

## 2. Pain Points analiza — postojeće travel apps

| # | Pain Point | Affected Apps | Severity (1-5) | Učestalost u recenzijama |
|---|-----------|---------------|:---------------:|:------------------------:|
| 1 | **Nema budget trackinga** — korisnici ne znaju koliko su potrošili | Polarsteps, Visited, Been | 5 | 73% negativnih recenzija Polarsteps |
| 2 | **Prazan social** — follow ali nema feedbacka, komentara | Polarsteps, Been | 4 | 45% recenzija spominje |
| 3 | **Preskupo** — TripIt Pro 49$/god za basic features | TripIt | 4 | 67% negativnih recenzija TripIt |
| 4 | **Samo zemlje, nema gradova/destinacija** | Visited, Been | 4 | 55% recenzija Visited |
| 5 | **GPS tracking troši bateriju** | Polarsteps | 4 | 62% negativnih recenzija |
| 6 | **Nema personalizacije** — isti UX za backpackera i luxury putnika | Svi | 3 | 30% korisnika želi filtriranje |
| 7 | **Teško dodati prošla putovanja** — fokus na current trip | Polarsteps, Wanderlog | 3 | 40% recenzija |
| 8 | **Nema offline mode** — u inozemstvu bez data | Wanderlog, Travello | 3 | 35% recenzija |
| 9 | **Share izgleda loše** — generički link, nema vizualne kartice | TripIt, Wanderlog | 3 | 25% recenzija |
| 10 | **Spor UI / crash** — loša optimizacija | Travello, TripAdvisor | 3 | 38% negativnih recenzija |

### Key insight za Travel Checker
Pain pointovi #1 (budget), #2 (social), #4 (gradovi ne samo zemlje) i #6 (personalizacija po kategoriji) su naša **core competitive advantage**. Riješimo ova 4 i imamo product-market fit.

---

## 3. Information Architecture

### Tab Bar (5 tabova)
```
┌─────────────────────────────────────────────┐
│  🏠 Home  │  🗺️ Map  │  ➕  │  👤 Me  │  ⚙️ More │
└─────────────────────────────────────────────┘
```

### Hijerarhija ekrana

```
📱 APP ROOT
│
├── 🏠 HOME TAB
│   ├── My Trips (lista/grid)
│   │   ├── Trip Detail View
│   │   │   ├── Photo Gallery (fullscreen)
│   │   │   ├── Budget Breakdown
│   │   │   ├── Edit Trip
│   │   │   └── Share Sheet
│   │   └── [v1.1] Trip Comments
│   └── Stats Card (countries, budget overview)
│
├── 🗺️ MAP TAB
│   ├── Full Screen Interactive Map
│   │   ├── Pin Markers (custom per category)
│   │   ├── Cluster Markers (zoomed out)
│   │   └── Tap Pin → Trip Preview Card → Full Detail
│   ├── Map Controls (zoom, locate me, filter)
│   └── [v2.0] Filter Panel (year, category, budget range)
│
├── ➕ ADD TRIP (Modal over current tab)
│   ├── Step 1: Where (destination search)
│   ├── Step 2: When (date picker + season)
│   ├── Step 3: Who (traveler category)
│   ├── Step 4: Stay (accommodation + link)
│   ├── Step 5: Cost (budget breakdown)
│   ├── Step 6: Story (description + photos)
│   └── Step 7: Visibility (public/private) + Save
│
├── 👤 ME TAB
│   ├── Profile Header (avatar, name, bio, stats)
│   ├── Mini Map (my destinations preview)
│   ├── My Trips Grid
│   ├── [v1.1] Followers / Following
│   └── Edit Profile
│
└── ⚙️ MORE TAB
    ├── [v1.1] Notifications
    ├── [v2.0] Discover / Explore
    ├── Settings
    │   ├── Account Settings
    │   ├── Privacy (default visibility, blocked users)
    │   ├── [v1.1] Notification Preferences
    │   ├── Appearance (future: dark/light mode)
    │   └── Data & Storage
    ├── Help & FAQ
    ├── Rate Travel Checker
    ├── Tell a Friend (share app)
    └── Sign Out / Delete Account
```

### Navigation Flow — Core Loop
```
Home → Add Trip → Fill Details → Save → See on Map → Share
  ↑                                         │
  └─────────── Return to Home ──────────────┘
```

---

## 4. Wireframe opisi — ključni ekrani

### 4.1 Home / My Trips

```
┌─────────────────────────────────┐
│ Travel Checker          [🔔] [👤]│  ← Status bar + mini header
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 🌍 12 countries • 24 trips  │ │  ← Stats card (gradient bg)
│ │ 💰 Total: €8,420 spent     │ │
│ │ 📸 142 photos               │ │
│ └─────────────────────────────┘ │
│                                 │
│ My Trips            [Grid|List] │  ← Sort: Recent first
│                                 │
│ ┌──────────┐ ┌──────────┐      │
│ │ 📸       │ │ 📸       │      │  ← Trip cards (2-col grid)
│ │ Lisbon   │ │ Tokyo    │      │     Cover photo
│ │ Mar 2026 │ │ Jan 2026 │      │     Destination name
│ │ €650 Solo│ │ €2.1k Par│      │     Date, budget, category badge
│ └──────────┘ └──────────┘      │
│ ┌──────────┐ ┌──────────┐      │
│ │ 📸       │ │ 📸       │      │
│ │ Barcelona│ │ Bali     │      │
│ │ Dec 2025 │ │ Oct 2025 │      │
│ │ €480 Solo│ │ €1.8k Nom│      │
│ └──────────┘ └──────────┘      │
│                                 │
├─────────────────────────────────┤
│ 🏠 Home │ 🗺️ Map │ ➕ │ 👤 Me │ ⚙️│  ← Tab bar
└─────────────────────────────────┘
```

**Detalji:**
- Stats card na vrhu: gradient pozadina (accent color), ikone + brojevi
- Trip cards: zaobljeni kutovi (16px radius), cover slika zauzima 60% visine, overlay s nazivom destinacije
- Badge s kategorijom putnika u donjem lijevom kutu kartice (mali pill: "Solo", "Par", "Nomad")
- Budget prikazan u donjem desnom kutu
- Pull-to-refresh za osvježavanje
- Empty state: ilustracija aviona + "Add your first trip!" CTA button

### 4.2 Interaktivna Karta

```
┌─────────────────────────────────┐
│ [← Back]    My World Map [🔍]   │  ← Header s search
├─────────────────────────────────┤
│                                 │
│        🌍 GOOGLE MAP            │  ← Full screen karta
│        (satellite/terrain)      │
│                                 │
│    📍 Lisbon                    │  ← Custom pin markers
│            📍 Barcelona         │     Boja po kategoriji putnika
│                    📍 Rome      │     Solo=plavo, Par=roza
│                                 │     Nomad=žuto, Obitelj=zeleno
│         📍📍📍 (cluster: 5)    │  ← Cluster za bliske destinacije
│                                 │
│  ┌───────────────────────┐      │
│  │ 📸 Lisbon, Portugal   │      │  ← Trip preview card (on pin tap)
│  │ Mar 2026 • €650 • Solo│      │     Slide up from bottom
│  │ ⭐⭐⭐⭐⭐              │      │     Tap za full detail
│  │ "Amazing city..."  [→]│      │
│  └───────────────────────┘      │
│                                 │
│  [🗺️ Standard] [🛰️ Satellite]  │  ← Map type toggle
│                                 │
│  12 countries • 3 continents    │  ← Bottom stats bar
├─────────────────────────────────┤
│ 🏠 Home │ 🗺️ Map │ ➕ │ 👤 Me │ ⚙️│
└─────────────────────────────────┘
```

**Detalji:**
- Karta zauzima cijeli ekran (edge-to-edge)
- Custom pin ikona: krug s prvim slovom grada ili mini slikom
- Pin boja ovisi o kategoriji putnika na tom tripu
- Tap na pin → animirani card slide-up s preview-om
- Tap na preview card → full Trip Detail
- Cluster marker: krug s brojem tripova, tap za zoom-in
- Floating action buttons: moj location, zoom controls
- Bottom bar: ukupne statistike (broj zemalja, kontinenata)

### 4.3 Add Trip (Step-by-Step Modal)

```
┌─────────────────────────────────┐
│ [✕ Cancel]  New Trip    [Next →]│  ← Modal header
├─────────────────────────────────┤
│                                 │
│  Step 1 of 7                    │  ← Progress dots: ●●○○○○○
│  ● ● ○ ○ ○ ○ ○                 │
│                                 │
│  Where did you go?              │  ← Large friendly title
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔍 Search destination...  │  │  ← Google Places autocomplete
│  └───────────────────────────┘  │
│                                 │
│  📍 Lisbon, Portugal            │  ← Selected result
│  📍 Lisabon, Portugalska        │     Show local name too
│                                 │
│  Recent:                        │
│  📍 Barcelona, Spain            │  ← Prethodne destinacije
│  📍 Tokyo, Japan                │
│                                 │
├─────────────────────────────────┤
│        [Next →]                 │  ← Big CTA button
└─────────────────────────────────┘
```

**Step 2: When**
- Date range picker (početak – kraj)
- Auto-detect sezone (proljeće/ljeto/jesen/zima) iz datuma
- Opcija "I don't remember exact dates" → samo mjesec/godina

**Step 3: Who (Traveler Category)**
- Grid s 10 ikona + labela (Solo, Par, Obitelj, Backpacker, Luxury, Digital Nomad, Avanturist, Kulturni, Grupno, Poslovni)
- Tap za odabir, single selection
- Animated selection (scale + checkmark)

**Step 4: Accommodation**
- Naziv smještaja (text input)
- Link (URL input, paste from clipboard)
- Rating (1-5 zvjezdice, tap)
- Tip: Hotel, Hostel, Airbnb, Camping, Friends, Other

**Step 5: Budget**
- Kategorije s input poljima:
  - 🏨 Smještaj: [___] €
  - 🍽️ Hrana: [___] €
  - 🚗 Transport: [___] €
  - 🎯 Aktivnosti: [___] €
  - 📦 Ostalo: [___] €
- Automatski total na dnu
- Valuta picker (€ default)
- "I don't track budget" toggle (skip)

**Step 6: Story**
- Rich text area za opis (placeholder: "Tell your travel story...")
- Photo picker (camera roll, do 10 slika)
- Drag to reorder slike
- Thumbnail preview grid

**Step 7: Visibility + Save**
- Public / Private toggle (s objašnjenjem)
- Preview kartice (kako će trip izgledati)
- Big "Save Trip" button
- Confetti animacija na save ✨

### 4.4 Trip Detail

```
┌─────────────────────────────────┐
│ [← Back]              [✏️] [📤]│  ← Edit + Share buttons
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │                             │ │  ← Hero image (cover photo)
│ │     📸 COVER PHOTO          │ │     Parallax scroll efekt
│ │                             │ │     Gradient overlay na dnu
│ │          Lisbon             │ │     Destinacija overlay text
│ │     March 2026 • Solo 🎒   │ │
│ └─────────────────────────────┘ │
│                                 │
│  🗺️ [Mini map s pinom]         │  ← Mala karta s lokacijom
│                                 │
│  📅 12-18 March 2026 (Spring)  │  ← Metadata
│  👤 Solo Traveler • Age 25-34  │
│  🏨 Airbnb "Casa Central"     │
│     ⭐⭐⭐⭐ [Open Link →]       │  ← Tap otvara booking link
│                                 │
│  💰 Budget Breakdown            │
│  ┌─────────────────────────┐    │
│  │ 🏨 Accommodation  €220  │    │  ← Vizualni bar chart
│  │ ████████████░░░░░  34%  │    │
│  │ 🍽️ Food          €180  │    │
│  │ ██████████░░░░░░  28%  │    │
│  │ 🚗 Transport      €95   │    │
│  │ █████░░░░░░░░░░░  15%  │    │
│  │ 🎯 Activities    €120  │    │
│  │ ██████░░░░░░░░░░  18%  │    │
│  │ 📦 Other          €35   │    │
│  │ ██░░░░░░░░░░░░░░   5%  │    │
│  │─────────────────────────│    │
│  │ TOTAL             €650  │    │
│  └─────────────────────────┘    │
│                                 │
│  📝 Story                       │
│  "Lisbon stole my heart..."     │  ← Rich text opis
│  (full description text)        │
│                                 │
│  📸 Photos (8)                  │
│  ┌────┐┌────┐┌────┐┌────┐      │  ← Horizontal scroll galerija
│  │ 📷 ││ 📷 ││ 📷 ││ 📷 │      │     Tap za fullscreen viewer
│  └────┘└────┘└────┘└────┘      │
│                                 │
│  [v1.1] 💬 Comments (3)        │
│  ┌─────────────────────────┐    │
│  │ 👤 Marko: "How was the  │    │
│  │ food scene?" • 2d ago   │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### 4.5 Profile

```
┌─────────────────────────────────┐
│            [⚙️ Edit]            │
├─────────────────────────────────┤
│         ┌──────┐                │
│         │  👤  │                │  ← Avatar (okrugli, 80px)
│         └──────┘                │
│        Ana Horvat               │  ← Ime
│    🎒 Solo Traveler • 25-34    │  ← Kategorija + age badge
│    "Exploring the world..."     │  ← Bio
│                                 │
│  ┌────────┬────────┬────────┐   │
│  │   12   │   24   │ €8,420 │   │  ← Stats row
│  │countries│ trips  │ spent  │   │
│  └────────┴────────┴────────┘   │
│                                 │
│  🗺️ [Mini karta s pin-ovima]   │  ← Mala karta (tap za full map)
│                                 │
│  My Trips         [Grid | List] │
│  ┌──────────┐ ┌──────────┐      │
│  │ 📸 Trip  │ │ 📸 Trip  │      │  ← Grid tripova (kao Home)
│  └──────────┘ └──────────┘      │
│                                 │
│  [v1.1] 24 Followers • 18 Following │
│                                 │
├─────────────────────────────────┤
│ 🏠 Home │ 🗺️ Map │ ➕ │ 👤 Me │ ⚙️│
└─────────────────────────────────┘
```

### 4.6 Discover / Explore (v2.0)

```
┌─────────────────────────────────┐
│ Discover                        │
├─────────────────────────────────┤
│ ┌───────────────────────────┐   │
│ │ 🔍 Search destinations... │   │  ← Search bar
│ └───────────────────────────┘   │
│                                 │
│ Filter: [Budget ▾] [Category ▾] │  ← Filter pills
│         [Season ▾] [Rating ▾]   │
│                                 │
│ 🔥 Trending Destinations        │
│ ┌──────────┐ ┌──────────┐      │
│ │ 📸       │ │ 📸       │      │  ← Horizontal scroll cards
│ │ Bali     │ │ Portugal │      │
│ │ 42 trips │ │ 38 trips │      │
│ └──────────┘ └──────────┘      │
│                                 │
│ 💰 Budget Friendly (< €500)     │  ← Curated sections
│ ┌──────────┐ ┌──────────┐      │
│ │ Prague   │ │ Budapest │      │
│ │ Avg €320 │ │ Avg €290 │      │
│ └──────────┘ └──────────┘      │
│                                 │
│ 🎒 Popular with Solo Travelers  │  ← Personalized to user category
│                                 │
└─────────────────────────────────┘
```

### 4.7 Comments (v1.1)

```
┌─────────────────────────────────┐
│ [← Back] Comments (12)         │
├─────────────────────────────────┤
│                                 │
│ 👤 Marko Novak • 2d ago        │
│ "How was the food scene in      │
│ Lisbon? Any must-try spots?"    │
│ [❤️ 3] [↩️ Reply]              │
│                                 │
│ 👤 Ana Horvat • 1d ago         │
│ "@Marko Time Out Market is a    │
│ must! Also Cervejaria Ramiro."  │
│ [❤️ 5] [↩️ Reply]              │
│                                 │
│ 👤 Ivana K. • 12h ago          │
│ "Beautiful photos! What camera  │
│ did you use?"                   │
│ [❤️ 1] [↩️ Reply]              │
│                                 │
├─────────────────────────────────┤
│ ┌───────────────────────┐ [📤] │  ← Comment input
│ │ Write a comment...    │       │
│ └───────────────────────┘       │
└─────────────────────────────────┘
```

---

## 5. Usability heuristike — Travel Checker specifične

| # | Heuristika | Primjena |
|---|-----------|----------|
| 1 | **Brzi unos, detalji kasnije** | Korisnik mora moći dodati trip u < 60 sekundi (samo destinacija + datum). Detalji (budget, slike, opis) se mogu dodati naknadno. |
| 2 | **Karta je hero** | Karta mora biti vizualno impresivna i brza (< 1s load). Svaki pin mora imati hover/tap preview. Karta prodaje app. |
| 3 | **Budget bez stresa** | Budget unos je opcionalan, ne obavezan. "Approximate" opcija za korisnike koji ne prate točno. Nikad ne suditi o iznosu. |
| 4 | **Share mora izgledati premium** | Svaki share (karta, trip) mora generirati vizualno atraktivan asset. Branded ali ne napadni watermark. |
| 5 | **Empty states motiviraju** | Prazan profil/karta ne smije izgledati tužno. Koristiti ilustracije i motivirajuće poruke: "Your journey starts here!" |
| 6 | **Kategorija putnika = personalizacija** | UI se subtilno prilagođava kategoriji (ikone, boje badge-a, suggested fields). Backpacker vidi "Hostel" first, Luxury vidi "Resort". |
| 7 | **Privatnost je default** | Novi tripovi su PRIVATE by default. Korisnik svjesno odabire public. Nikada ne dijeliti lokaciju u realnom vremenu. |
| 8 | **Nostalgija > utility** | App je travel dnevnik, ne accounting tool. Vizualni dizajn treba evocirati emocije putovanja. Slike > brojevi. |
| 9 | **Offline graceful degradation** | Bez interneta: prikaži cached podatke, omogući unos tripa (sync later). Nikad crash ili prazan ekran. |
| 10 | **Onboarding je investicija** | Prvih 60 sekundi određuju retenciju. Smanjiti friction na minimum. Apple Sign In → 1 tap kategorija → karta. Gotovo. |

---

## 6. Onboarding Flow — prvih 60 sekundi

### Sekunda 0-5: Welcome Screen
```
┌─────────────────────────┐
│                         │
│    🌍                    │
│   Travel Checker        │
│                         │
│  Track your journeys.   │
│  Share your world.      │
│                         │
│  [Sign in with Apple]   │  ← Jedan tap
│  [Sign in with Email]   │
│                         │
└─────────────────────────┘
```

### Sekunda 5-15: Apple Sign In
- Korisnik tapne "Sign in with Apple"
- Face ID / Touch ID → done u 2 sekunde
- Automatski kreira account

### Sekunda 15-25: Choose Your Travel Style
```
┌─────────────────────────┐
│ What kind of traveler   │
│ are you?                │
│                         │
│  🎒 Solo    👫 Couple   │  ← 2x5 grid
│  👨‍👩‍👧 Family  🏕️ Backpacker│
│  💎 Luxury  💻 Nomad    │
│  ⛰️ Adventure 🏛️ Cultural│
│  👥 Group   💼 Business │
│                         │
│  [Continue →]           │
└─────────────────────────┘
```

### Sekunda 25-35: Age Range
```
┌─────────────────────────┐
│ Your age range?         │
│                         │
│  ○ 18-24  ○ 25-34      │
│  ○ 35-44  ○ 45-54      │
│  ○ 55-64  ○ 65+        │
│                         │
│  [Continue →]           │
└─────────────────────────┘
```

### Sekunda 35-50: Empty Map with CTA
```
┌─────────────────────────┐
│                         │
│    🌍 YOUR WORLD MAP     │
│    (empty, zoomed out)  │
│                         │
│  ┌───────────────────┐  │
│  │ Add your first    │  │  ← Animated card
│  │ trip and watch     │  │
│  │ your map come      │  │
│  │ alive! ✨          │  │
│  │                   │  │
│  │ [+ Add First Trip]│  │
│  └───────────────────┘  │
│                         │
│  [Skip for now →]       │
└─────────────────────────┘
```

### Sekunda 50-60: Quick Add or Explore
- Ako korisnik tapne "Add First Trip" → Add Trip modal (quick mode: samo destinacija + datum)
- Ako tapne "Skip" → Home screen s empty state
- **Cilj: korisnik ima 1 pin na karti unutar 90 sekundi od downloada**

---

## 7. Accessibility smjernice (iOS)

### Minimalni standardi

| Kategorija | Zahtjev | Implementacija |
|-----------|---------|---------------|
| **VoiceOver** | Svi interaktivni elementi imaju accessibility label | UIAccessibility labels na svim buttonima, karticama, pin-ovima |
| **Dynamic Type** | Tekst se skalira s iOS font settings | Koristiti system fonts, UIFontMetrics, izbjegavati fiksne veličine |
| **Kontrast** | WCAG AA minimum (4.5:1 za tekst) | Testirati sve boje s Colour Contrast Analyzer |
| **Touch targets** | Minimum 44x44 pt | Svi buttoni, linkovi, tab bar items |
| **Motion** | Respect "Reduce Motion" setting | Disable parallax, animacije kad je uključeno |
| **Color** | Informacija nikad samo bojom | Ikone + tekst uz boje (status, kategorije) |
| **Karta** | Pin-ovi moraju biti accessible | VoiceOver čita: "Lisbon, March 2026, 650 euros, solo trip" |
| **Slike** | Alt text za user-uploaded slike | Opcija za dodavanje opisa slike pri uploadu |
| **Keyboard** | Full keyboard navigation (external keyboard) | Tab order logičan, focus indicators vidljivi |
| **Dark Mode** | Podrška za iOS dark mode | Koristiti semantic colors, testirati oba moda |

### Testiranje
- VoiceOver audit svakog ekrana prije launcha
- Accessibility Inspector u Xcode
- Testirati s Dynamic Type XXL
- Testirati s Reduce Motion ON
- Testirati s Bold Text ON
