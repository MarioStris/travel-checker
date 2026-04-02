# Travel Checker — Onboarding Flow

**Verzija**: 1.0
**Datum**: 2026-03-27
**Vlasnik**: CSM Agent

---

## Cilj onboardinga

Svaki novi korisnik mora doživjeti "aha moment" u manje od 90 sekundi od prvog otvaranja aplikacije.

**Aha moment** = prvi pin na karti svijeta (vidljiv trip na mapi)

---

## Korak-po-korak onboarding flow

### Korak 0 — App Store / Download
- **Trigger**: Korisnik preuzima aplikaciju
- **Target**: N/A (izvan kontrole)
- **Cilj**: Postavljanje očekivanja kroz App Store screenshots i opis

App Store opis (prva rečenica):
> "Svako putovanje zaslužuje biti zapamceno. Travel Checker ti pomaže da pratis, spremas i dijelis svoja iskustva — sve na jednoj interaktivnoj karti."

---

### Korak 1 — First Launch Screen (0-10 sekundi)
- **Ekran**: Splash + onboarding slideshow (3 slajda)
- **Target trajanje**: 8 sekundi (auto-play s opcijom skip)

Sadrzaj slajdova:
1. "Dodaj trip za 60 sekundi" — ilustracija karte s pinovima
2. "Prati budzet, fotografije i uspomene" — kolaž elemenata
3. "Podijeli s prijateljima ili zadrzi za sebe" — opcija privatnosti

**Tooltip/hint**: "Preskocat cemo tutorial ako vec znas sto radis — [Skip]"

---

### Korak 2 — Registracija / Sign In (10-30 sekundi)
- **Ekran**: Auth ekran
- **Target trajanje**: 20 sekundi
- **Opcije**: Apple Sign In (primarno), Email registracija

**Copy za Apple Sign In button**: "Nastavi s Appleom — brzo i sigurno"

**In-app hint ispod gumba**:
> "Nikad ne objavljujemo bez tvoje dozvole. Tvoji tripovi su tvoji."

**Greska handling**:
- Email vec postoji: "Vec imas racun! Prijavi se s istim emailom ili resetiraj lozinku."
- Apple Sign In fail: "Nesto je poslo po krivu s Apple prijavom. Pokusaj s emailom ili kontaktiraj podrsku."

**Activation metrika**: % korisnika koji zavrse registraciju

---

### Korak 3 — Personalizacija (30-50 sekundi)
- **Ekran**: "Reci nam nesto o sebi"
- **Target trajanje**: 20 sekundi
- **Polja**: Kategorija putnika (10 opcija), Age range

**Copy za naslov**: "Kakav si putnik?"

**10 kategorija s ikonama**:
1. Solo Adventurer — "Sam, slobodan, nepokolebljiv"
2. Digital Nomad — "Radim odakle zelim"
3. Family Traveler — "Obiteljna avantura"
4. Couple Explorer — "Dvoje je druzba"
5. Group Traveler — "Sto vise, to vesele"
6. Budget Backpacker — "Daleko za malo"
7. Luxury Traveler — "Samo najbolje"
8. Business Traveler — "Posao + malo uzivanja"
9. Weekend Warrior — "Svaki vikend nova destinacija"
10. Adventure Seeker — "Sto teze, to bolje"

**Age range opcije**: 18-24, 25-34, 35-44, 45-54, 55+

**In-app hint**: "Ovo koristimo samo za personalizaciju prijedloga. Mozes promijeniti u postavkama."

**Skip opcija**: "Preskoci za sada" (link ispod gumba)

---

### Korak 4 — Kreiranje prvog tripa (50-90 sekundi)
- **Ekran**: 7-step wizard
- **Target trajanje**: 40 sekundi za minimalni unos
- **Cilj**: Bar jedan trip kreiran

#### Wizard koraci:

**Step 1 — Where (5 sek)**
- Polje za pretragu destinacije
- Autocomplete s Google Places API
- **Placeholder**: "npr. Tokyo, Japan"
- **Hint**: "Upisite grad, drzavu ili naziv mjesta"

**Step 2 — When (5 sek)**
- Date picker za pocetak i kraj putovanja
- **Hint**: "Ne znas tocne datume? Unesi priblizne — mozes ih promijeniti kasnije."
- Opcija: "Jos planiram" (buduci trip)

**Step 3 — Who (5 sek)**
- Tko putuje s tobom?
- Checkboxes: Solo, Partner, Prijatelji, Obitelj, Kolege
- Broj pratilaca (stepper: 0-20+)

**Step 4 — Stay (5 sek)**
- Tip smjestaja: Hotel, Hostel, Airbnb, Kamp, Kod prijatelja, Ostalo
- Naziv (opcionalno)
- **Hint**: "Opcionalno — mozes dodati kasnije"

**Step 5 — Cost (5 sek)**
- Ukupni budzet (opcionalno)
- Valuta (dropdown, default: EUR)
- **Hint**: "Pocni s ukupnim budzetom — mozes razraditi kategorije kasnije"
- **Skip link**: "Preskoci budzet"

**Step 6 — Story (5 sek)**
- Kratki opis/biljeska (textarea, max 500 znakova)
- Dodavanje fotografija (max 5 u ovom koraku)
- **Placeholder**: "Sto te ceka na ovom putovanju?"
- **Hint**: "Mozes dodati vise fotografija i biljeske naknadno"

**Step 7 — Visibility (5 sek)**
- Javno / Samo prijatelji / Privatno
- **Default**: Privatno
- **Copy**: "Tko moze vidjeti tvoj trip?"
- **Hint za javno**: "Javni tripovi pojavljuju se u Discovery feedi"

**Zavrsni ekran — "Tvoj pin je na karti!"**
- Animacija: pin se spusta na kartu
- **CTA**: "Pogledaj na karti" (primary button)
- **Sekundarni CTA**: "Dodaj jos jedan trip"

---

## Ukupno trajanje onboardinga

| Korak | Naziv | Target trajanje |
|-------|-------|-----------------|
| 1 | First launch / splash | 8 sek |
| 2 | Registracija | 20 sek |
| 3 | Personalizacija | 20 sek |
| 4 | Kreiranje tripa (min) | 40 sek |
| **Ukupno** | **Do prvog pina** | **~88 sek** |

---

## In-App Tooltips i Hints — puni popis

### Karta ekran
- **Prvi posjet**: "Ovo je tvoja karta. Svaki trip = jedan pin. Dodaj vise tripova da karta ozivi!"
- **Pin tap**: "Tap na pin za detalje tripa"
- **Pinch to zoom**: "Makni prste da vidis cijeli svijet"

### Profil ekran
- **Statistike**: "Ove statistike se azuriraju automatski dok dodajes tripove"
- **Prazne statistike**: "Nemas jos tripova! Dodaj prvi trip da vidis svoje statistike."

### Trip detalji
- **Budzet sekcija**: "Dodaj troskove po kategorijama da vidis raspodjelu budgeta"
- **Fotke sekcija**: "Do 50 fotografija po tripu. Tap za dodavanje."

---

## Onboarding Email Sequence

### Email 1 — Welcome (odmah po registraciji)

**Subject**: Dobrodosao u Travel Checker, [Ime]!
**Preheader**: Tvoja karta svijeta te ceka.

---

Bok [Ime],

Drago nam je da si tu!

Travel Checker je napravljen za ljude koji vole putovati i zele imati sve uspomene na jednom mjestu — s kartom, fotografijama i budzetom koji prate svaku avanturu.

**Sto te ceka:**
- Interaktivna karta s tvojim tripovima
- Pracenje budzeta po kategorijama
- Fotografije i price uz svaki trip
- Statistike: koliko si putovao, koliko potrosio, koje drzave posjetio

**Kreni odmah** — dodaj svoj prvi trip za manje od 60 sekundi.

[DODAJ PRVI TRIP]

Sretno putovanje,
Tim Travel Checker

P.S. Imas pitanje? Odgovori na ovaj email ili nas kontaktiraj u aplikaciji.

---

### Email 2 — Day 1 (24h po registraciji, samo za korisnike koji NISU kreirali trip)

**Subject**: Jos nisi dodao prvi trip?
**Preheader**: Treba ti manje od 60 sekundi.

---

Bok [Ime],

Primijetili smo da jos nisi dodao/la prvi trip.

Razumijemo — poceti s novom aplikacijom nekad izgleda kao veliki korak. Ali u Travel Checkeru, to je zaista 60 sekundi posla.

**Samo 3 stvari trebase:**
1. Destinacija (npr. "Paris, Francuska")
2. Datumi (ili priblizni)
3. Tap na "Spremi"

I gotovo! Tvoj pin je na karti.

[DODAJ PRVI TRIP — TRAJE 60 SEKUNDI]

Ako imas kakvih pitanja ili si se zaglavila/zaglavila, odgovori na ovaj email — tu smo.

Ekipa Travel Checker

---

### Email 3 — Day 3 (72h, samo za korisnike s bar 1 tripom)

**Subject**: Imas [X] trip/tripova — evo sto jos mozes
**Preheader**: Nisi jos otkrio/la sve funkcije.

---

Bok [Ime],

Super — imas vec [X] trip/tripova na karti!

Evo par stvari koje mnogi korisnici otkriju tek nakon tjedan dana, a ti ih mozes odmah:

**Budzet tracking**
Otvori bilo koji trip → tap na "Troskovi" → dodaj sto si potrosio/la. Na kraju vidis lijepi breakdown po kategorijama.

**Statistike profila**
Tap na svoju profilnu sliku → vidi koliko si km prevalio/la, koliko drzava posjetio/la, koliko si ukupno potrosio/la na putovanjima.

**Dijeljenje tripa**
Svaki trip mozes podijeliti kao link ili postaviti javnim da ga vide prijatelji.

[OTVORI TRAVEL CHECKER]

Uzivaj!
Tim Travel Checker

---

### Email 4 — Day 7 (7 dana, engagement checkpoint)

**Subject**: Tjedan s Travel Checkerom — kako ide?
**Preheader**: Tvoji tripovi te cekaju.

---

Bok [Ime],

Prosao je tjedan od kad si se pridruzio/la Travel Checkeru.

Brza anketa — koliko si zadovoljan/na aplikacijom? (1 klik)

[UZASNO] [LOSE] [OK] [DOBRO] [ODLICNO]

Na osnovu tvog odgovora, poslat cemo ti savjete koji ce ti najvise koristiti.

Ako imas bilo kakav feedback — dobro ili lose — odgovori na ovaj email. Sve citamo.

Hvala!
Tim Travel Checker

---

## Activation Metrics i Targets

| Metrika | Definicija | Target |
|---------|-----------|--------|
| Registration rate | % koji zavrse registraciju od downloada | > 70% |
| Onboarding completion | % koji dodaju prvi trip unutar 24h | > 50% |
| Time to first pin | Median trajanje od open do prvog pina | < 90 sek |
| Day 1 retention | % aktivnih 24h po registraciji | > 60% |
| Day 7 retention | % aktivnih 7 dana po registraciji | > 40% |
| Day 30 retention | % aktivnih 30 dana po registraciji | > 25% |
| Photos uploaded (D7) | % korisnika koji su uploadali bar 1 foto | > 35% |
| Budget entry (D7) | % korisnika koji su unijeli bar 1 trosak | > 25% |

---

## Re-Engagement Strategija za Drop-Offs

### Drop-off tocka 1 — Nakon registracije, prije prvog tripa

**Trigger**: 24h bez kreiranog tripa
**Akcija**: Email 2 (Day 1 sequence)
**Push notifikacija**: "Tvoja karta te ceka! Dodaj prvi trip za 60 sekundi."
**In-app banner** (sljedeci open): "Jos nisi dodao prvi trip? Pocni ovdje →"

### Drop-off tocka 2 — Nakon prvog tripa, bez aktivnosti 7 dana

**Trigger**: 7 dana bez novog tripa ili interakcije
**Akcija**: Push notifikacija: "Planirates li neko putovanje? Dodaj ga na kartu!"
**Email**: "Vidimo da nisi bio/la u aplikaciji tjedan dana — sve u redu?"

### Drop-off tocka 3 — Neaktivnost 30 dana

**Trigger**: 30 dana bez sesije
**Akcija**: Win-back email (vidi churn-prevention.md)
**Push notifikacija**: "Dugo te nismo vidjeli! Imas [X] trip/tripova na karti koji te cekaju."

### Drop-off tocka 4 — Wizard abandon (nije zavrsio kreiranje tripa)

**Trigger**: Korisnik zapocne wizard ali ne zavrsi
**Akcija**: In-app reminder sljedeci open: "Zapoceo/la si dodavati trip u [Destinacija]. Zavrsi ga?"
**CTA**: "Nastavi" / "Obrisi"

### Segmentacija re-engagement kampanja

| Segment | Kriterij | Kanal | Poruka |
|---------|---------|-------|--------|
| Novi bez tripa | Registriran, 0 tripova, 24h | Push + Email | "Dodaj prvi trip" |
| Jednom aktivni | 1 trip, 7d neaktivan | Push | "Imas li planova?" |
| Bivsi aktivni | 3+ tripova, 30d neaktivan | Email | Win-back + nostalgija |
| Wizard abandon | Zapoceo, nije zavrsio | In-app | "Nastavi gdje si stao/la" |
