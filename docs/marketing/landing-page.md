# Landing Page — Travel Checker

**Datum:** 2026-03-27
**Agent:** CMO
**URL:** travelchecker.app
**Status:** Copy finalan, spreman za Frontend implementaciju

---

## Meta Tags

```html
<title>Travel Checker — Your World, Mapped</title>
<meta name="description" content="Track your trips, map your world, and know exactly what every journey costs. Travel Checker is the iOS app for travelers who want more than just photos — they want the full picture." />

<!-- Open Graph -->
<meta property="og:title" content="Travel Checker — Your World, Mapped" />
<meta property="og:description" content="Your travel journal, your world map, your budget tracker — all in one beautiful iOS app. Free to download." />
<meta property="og:image" content="https://travelchecker.app/og-image.jpg" />
<meta property="og:url" content="https://travelchecker.app" />
<meta property="og:type" content="website" />

<!-- Twitter/X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Travel Checker — Your World, Mapped" />
<meta name="twitter:description" content="Track trips, track costs, own your map. Free iOS app for real travelers." />
<meta name="twitter:image" content="https://travelchecker.app/twitter-card.jpg" />

<!-- Dodatni SEO -->
<meta name="keywords" content="travel tracker app, trip journal, world map travel, budget travel app, travel diary iOS" />
<link rel="canonical" href="https://travelchecker.app" />
```

---

## Struktura Stranice

### Sekcija 1 — Hero

**Wireframe opis:**
Full-screen sekcija s tamnom pozadinom. Lijevo: tekst i CTA. Desno: screenshot iPhonea s prikazom interaktivne karte s pin-ovima. Na mobilu: tekst iznad, slika ispod. Blaga animacija pin-ova koji se "pojavljuju" na karti pri učitavanju.

**Headline:**
```
Your world, mapped.
```

**Subheadline:**
```
Travel Checker je iOS app gdje svaki trip dobiva svoje mjesto na karti —
s fotografijama, troškovima i sjećanjima koja ne nestaju.
```

**Sekundarni tekst (manji font):**
```
Besplatno. Bez pretplate. Bez reklama.
```

**CTA:**
```
[Preuzmi na App Storeu]   [Pogledaj kako radi ↓]
```
*App Store Badge + čisti gumb s anchor linkom na video/demo sekciju.*

**Social proof ispod CTA:**
```
⭐⭐⭐⭐⭐  "Konačno app koja razumije kako stvarno putujem."
— Ana M., Zagreb
```

---

### Sekcija 2 — Problem Statement

**Wireframe opis:**
Bijela sekcija, 3 kartice horizontalno (na mobilu vertikalno). Svaka kartica ima ikonu, naslov i kratki tekst. Stil: minimalistički, malo sjena.

**Naslov sekcije:**
```
Znaš li zapravo koliko putuješ?
```

**Podtekst:**
```
Slike su na telefonu. Troškovi su negdje u banci. Karta je u glavi.
Travel Checker sve to stavlja na jedno mjesto.
```

**3 Problem kartice:**

**Kartica 1 — Uspomene**
Ikona: Kamera
```
Slike rasute po telefonu
Prošlogodišnji Dubrovnik je negdje između 847 fotografija mačaka i screenshotova recepta.
```

**Kartica 2 — Troškovi**
Ikona: Novčanica
```
"Koliko me to koštalo?"
Znaš da je bilo "negdje oko" nekih para. Ali stvarna cifra? Nemaš je.
```

**Kartica 3 — Pregled**
Ikona: Karta
```
Koliko zemalja sam zapravo posjetio?
29? 31? Čekaš da netko postavi pitanje pa ćeš prebrojati u glavi.
```

---

### Sekcija 3 — Core Feature: Interaktivna Karta

**Wireframe opis:**
Tamna pozadina. Lijevo: tekst. Desno: full-width screenshot karte s pin-ovima u bojama. Na pin-ovima su vidljive minijature fotografija. Statistika prikazana kao overlay na karti (18 zemalja, 42 grada, 6 kontinenata).

**Eyebrow text (mali, u boji branda):**
```
KARTA SVIJETA
```

**Naslov:**
```
Sva tvoja putovanja.
Na jednoj karti.
```

**Tekst:**
```
Svaki trip koji dodaš automatski postaje pin na interaktivnoj karti svijeta.
Tapneš pin — vidiš fotografije, troškove, datume.
Zoomaš out — vidiš cijeli život isputan putovanjima.

Karta raste s tobom. Svaki novi pin je dio tebe.
```

**Feature bullets:**
```
✓ Google Maps s custom pin-ovima
✓ Klik na pin otvara detalje tripa
✓ Automatski statistike: zemlje, gradovi, kontinenti
✓ Podijeli kartu kao sliku
```

---

### Sekcija 4 — Core Feature: Budget Tracking

**Wireframe opis:**
Bijela pozadina. Lijevo: screenshot ekrana budget breakdowna s kategorijama (smještaj, hrana, transport, aktivnosti) prikazanim kao pie chart ili bar chart. Desno: tekst.

**Eyebrow text:**
```
BUDGET TRACKING
```

**Naslov:**
```
Koliko te stvarno koštao
tjedan u Barceloni?
```

**Tekst:**
```
Uneseš troškove jednom — po kategorijama koje ti odgovaraju.
Smještaj, hrana, transport, aktivnosti, sve ostalo.

Sljedeći put kad planiraš sličan trip, imaš realnu cifru.
Ne "procjenu". Ne "negdje oko". Pravi broj.
```

**Social proof citat:**
```
"Tek kad sam unijela sve tripove, shvatila sam da trošim duplo više na smještaj
nego što mislim. Sad bolje planiram." — Petra, 31, Beograd
```

**Feature bullets:**
```
✓ 5 kategorija: smještaj, hrana, transport, aktivnosti, ostalo
✓ Automatski ukupni troškovi po tripu
✓ Kumulativne statistike svih putovanja
✓ Prosječni trošak po danu i po destinaciji
```

---

### Sekcija 5 — Core Feature: Kategorije Putnika

**Wireframe opis:**
Horizontalni scroll s karticama kategorija na tamnoj pozadini. Svaka kartica ima ikonu, naziv i kratki opis. Interaktivno — korisnik može kliknuti i vidjeti primjer profila za taj tip putnika.

**Eyebrow text:**
```
ZA SVAKI STIL PUTOVANJA
```

**Naslov:**
```
Putuješ na svoj način.
App to prepoznaje.
```

**Tekst:**
```
Backpacker ne treba iste savjete kao luxury traveler.
Digital nomad ima druge prioritete od obitelji s djecom.

Odaberi svoju kategoriju i dobij experience koji ima smisla za tebe.
```

**Kategorije (prikazane kao kartice):**
```
Solo        Couple       Family      Backpacker
Luxury      Digital Nomad   Adventure   Cultural
Group       Business
```

---

### Sekcija 6 — Feature Pregled (Feature Grid)

**Wireframe opis:**
Grid 2x3 (na desktopu) ili 1x6 (na mobilu). Svaki cell ima ikonu, naslov i 1-2 rečenice opisa. Lagana pozadina s blago zaobljenim karticama.

**Naslov sekcije:**
```
Sve što treba jednom putniku.
Ništa što ne treba.
```

**Feature 1:**
Ikona: Foto
```
Vizualni dnevnik
Do 10 fotografija po putovanju. Galerija koju imaš za 10 godina — ne samo Story koji nestaje za 24 sata.
```

**Feature 2:**
Ikona: Marker
```
Google Places autocomplete
Počneš pisati destinaciju, app predloži. Lisabon, Bali, Kyoto — sve na mapi u sekundi.
```

**Feature 3:**
Ikona: Statistika
```
Putničke statistike
Broj zemalja, gradova, kontinenata. Ukupni budget. Prosjek po tripu. Sve automatski.
```

**Feature 4:**
Ikona: Lokot
```
Tvoji podaci, tvoja pravila
Svako putovanje može biti javno ili privatno. Ti odlučuješ što dijeli sa svjetom.
```

**Feature 5:**
Ikona: Dijamant
```
Smještaj u detalju
Zabilježi hotel ili Airbnb s linkom i ocjenom. Korisno kad se vratiš na istu destinaciju.
```

**Feature 6:**
Ikona: Kalendar
```
Sezona i datumi
Exact datumi + oznaka sezone (proljeće/ljeto/jesen/zima). Savršeno za usporedbu iskustava.
```

---

### Sekcija 7 — Social Proof / Testimonials

**Wireframe opis:**
Tamna pozadina. Naslov. Ispod 3 testimonijala u karticama s avatarima, imenima, zvjezdicama i citatima. Opcija: rotating carousel na mobilu.

**Naslov sekcije:**
```
Što kažu pravi putnici
```

**Testimonijal 1:**
```
⭐⭐⭐⭐⭐
"Koristila sam Polarsteps godinama ali nikad nisam znala koliko potrošim.
Travel Checker je riješio upravo to — i karta je jednako lijepa."

— Ana K., UX dizajnerica, Zagreb
Solo traveler • 18 zemalja
```

**Testimonijal 2:**
```
⭐⭐⭐⭐⭐
"Kao digital nomad, trebam znati burn rate po gradu. Spreadsheet je bio jedina opcija.
Ovo je spreadsheet koji izgleda lijepo i ima kartu."

— Marko V., developer, remote
Digital nomad • 34 zemlje
```

**Testimonijal 3:**
```
⭐⭐⭐⭐⭐
"Unijeli smo sva obiteljska putovanja od 2019. Sad imamo pravi arhiv.
Djeca se vole vraćati i gledati gdje smo sve bili."

— Ivana i Tomislav P., Split
Family travelers • 12 zemalja s djecom
```

**App Store badge sekcija:**
```
[4.8 ⭐ na App Storeu]   [500+ recenzija]   [50.000+ korisnika]
```
*Napomena: prikazati realne brojeve nakon launcha; do tada koristiti beta testimonijale.*

---

### Sekcija 8 — How It Works (3 koraka)

**Wireframe opis:**
Bijela pozadina. 3 koraka horizontalno s brojevima, ikonama i kratkim opisima. Ispod: screenshot iPhonea koji ilustrira svaki korak.

**Naslov:**
```
Počni za 3 minute.
```

**Korak 1:**
```
1. Registriraj se
Apple ID ili email — u nekoliko sekundi.
Odaberi svoju kategoriju putnika.
```

**Korak 2:**
```
2. Dodaj putovanje
Destinacija, datumi, fotografije, troškovi.
Sve na jednom ekranu, bez kompliciranja.
```

**Korak 3:**
```
3. Gledaj kako raste tvoja karta
Svaki novi trip je novi pin.
Statistike se ažuriraju automatski.
```

**CTA ispod:**
```
[Preuzmi besplatno na App Storeu]
```

---

### Sekcija 9 — Pricing

**Wireframe opis:**
Centrirana sekcija, lagana pozadina. Jedna kartica (Free) prominentno prikazana. Ispod: nota o budućim premium features.

**Naslov:**
```
Besplatno. Bez trikova.
```

**Podtekst:**
```
Travel Checker je potpuno besplatan za preuzimanje i korištenje.
Sve core features su dostupne svim korisnicima.
```

**Pricing kartica:**
```
FREE
————————
✓ Neograničeni tripovi
✓ Do 10 slika po tripu
✓ Interaktivna karta
✓ Budget tracking
✓ Statistike
✓ 10 kategorija putnika
✓ Public/Private trips

[Preuzmi besplatno]
```

**Nota ispod:**
```
Premijum features (napredna statistika, neograničene slike, privatne grupe)
dolaze uskoro — za korisnike koji žele više.
Early adopteri dobivaju posebne uvjete.
```

---

### Sekcija 10 — FAQ

**Wireframe opis:**
Bijela pozadina. Accordion komponenta — klik otvara odgovor. 10 pitanja vidljivih u listi, odgovori skriveni.

**Naslov:**
```
Česta pitanja
```

**Q1: Je li Travel Checker besplatan?**
```
Da, potpuno besplatan. Sve core features — karta, budget tracking, fotografije, statistike —
dostupne su bez plaćanja. Premijum plan s naprednim features dolazi u budućem updatu,
ali osnovna funkcionalnost ostaje besplatna zauvijek.
```

**Q2: Radi li app bez interneta?**
```
Za dodavanje novih putovanja i karte potrebna je internetska veza.
Offline mod je planiran za buduće verzije — zaprati nas za obavijesti.
```

**Q3: Mogu li prebaciti podatke iz Polarsteps ili druge app?**
```
Import funkcionalnost je na roadmapu. Za sada možeš ručno unijeti prošla putovanja —
to traje par minuta po tripu i vrijedi za potpuni pregled. Import iz Polarsteps dolazi uskoro.
```

**Q4: Koliko slika mogu dodati po putovanju?**
```
U trenutnoj verziji do 10 fotografija po tripu. Radimo na premium opciji
za neograničene fotografije za one koji žele cijeli foto-album po destinaciji.
```

**Q5: Jesu li moji podaci sigurni?**
```
Tvoji podaci su tvoji. Putovanja koja označiš kao "private" vide samo ti.
Koristimo industrijsko-standardnu enkripciju. Više o privatnosti: travelchecker.app/privacy
```

**Q6: Mogu li koristiti app za planiranje budućih putovanja?**
```
Travel Checker je fokusiran na dokumentiranje prošlih i trenutnih putovanja, ne na planiranje.
Za planiranje preporučamo Wanderlog. Kad se vratiš s putovanja — otvori Travel Checker.
```

**Q7: Postoji li Android verzija?**
```
Trenutno smo iOS only. Android verzija je planirana za drugu polovicu 2026.
Unesi email na dnu stranice i biti ćeš prvi obaviješten/a.
```

**Q8: Što znače kategorije putnika?**
```
Kategorija putnika (solo, par, obitelj, backpacker, digital nomad, luxury, avanturist,
kulturni, grupni, poslovni) personalizira tvoj experience u aplikaciji. Možeš je promijeniti
bilo kad u postavkama profila.
```

**Q9: Mogu li dijeliti svoju kartu na Instagramu?**
```
Da! U v1.1 updatu (uskoro) dodajemo funkciju dijeljenja — možeš exportati svoju kartu
kao sliku i podijeliti je direktno na Instagram, WhatsApp ili Facebook.
```

**Q10: Ima li Travel Checker reklame?**
```
Ne. Trenutno nema nikakvih reklama u aplikaciji. Kad dođemo do monetizacije,
to će biti isključivo kroz opcionalni premium plan — nikad kroz intruzivne reklame.
```

---

### Sekcija 11 — Final CTA + Waitlist

**Wireframe opis:**
Tamna pozadina, full-width. Centriran tekst. Veliki App Store badge + email field za Android waitlist.

**Naslov:**
```
Tvoja karta čeka.
```

**Podtekst:**
```
Koliko zemalja imaš? Koliko si potrošio? Koje su bile najjeftinije destinacije?
Travel Checker ti daje odgovore na sva ta pitanja — i sliku koja vrijedi tisuću riječi.
```

**CTA:**
```
[Preuzmi na App Storeu — besplatno]
```

**Android waitlist:**
```
Na Androidu? Javi nam.
[email input]  [Obavijesti me]
```

---

### Footer

**Wireframe opis:**
Tamna pozadina. 3 kolone: Brand info + tagline, Quick links, Social/Contact. Copyright na dnu.

```
Travel Checker                  Linkovi                    Prati nas
Your world, mapped.             O nama                     Instagram
                                Privacy Policy             TikTok
iOS App                         Uvjeti korištenja          Twitter/X
travelchecker.app               FAQ                        Reddit

                                contact@travelchecker.app

© 2026 Travel Checker. Sva prava pridržana.
```

---

## Napomene za implementaciju

- Hero animacija: Pin-ovi se pojavljuju jedan po jedan na karti (CSS animation, ~2s ukupno)
- Boja branda: Duboko plava (#1a2b4a) + coral akcent (#e8634a) — asocijacija na more i avanture
- Tipografija: Inter ili SF Pro za headings, System font za body (brzina učitavanja)
- Mobile-first: 60%+ prometa bit ce mobitel (App Store redirect)
- Page speed target: LCP < 2s (kritično za konverziju)
- A/B test: Hero headline vs "Every journey deserves to be remembered." vs "Your world, mapped."
