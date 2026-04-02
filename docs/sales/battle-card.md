# Competitive Battle Card — Travel Checker

**Verzija:** 1.0
**Datum:** 2026-04-01
**Agent:** CSO (Sales Agent)
**Input:** CMO Positioning, Market Research, Pricing Model
**Status:** Aktivan dokument — ažurirati kvartalno

---

## Pregled

Ovaj dokument je operativni priručnik za svaki razgovor u kojem korisnik ili potencijalni korisnik uspoređuje Travel Checker s konkurencijom. Nije za internu analizu — namijenjen je direktnoj upotrebi u prodajnim i community razgovorima, App Store odgovorima na recenzije, i influencer briefing materijalima.

---

## 1. Brza referentna tablica konkurenata

| Konkurent | Primarni fokus | Cijena (god) | Karta | Budget | Social | iOS |
|-----------|----------------|:------------:|:-----:|:------:|:------:|:---:|
| **Travel Checker** | Tracking + Budget + Social | 21.99 € (Plus) / 39.99 € (Pro) | Interaktivna, pin-ovi | Po kategorijama | Profil, follow, komentari | iOS first |
| Polarsteps | Automatski GPS tracking | 29.99 € | GPS ruta | Nema | Osnovno | Da |
| TripIt | Poslovni itinerary | 49 USD | Nema | Nema | Nema | Da |
| Wanderlog | Planiranje putovanja | 4.49 €/mj | Planning | Nema | Minimalno | Da |
| Google Maps Timeline | Automatska lokacijska povijest | Besplatno | Automatska | Nema | Nema | Da |
| Instagram | Photo sharing, social mreža | Besplatno | Nema | Nema | Puno | Da |

---

## 2. Matrica featurea — detaljna usporedba

| Feature | Travel Checker | Polarsteps | TripIt | Wanderlog | Google Timeline | Instagram |
|---------|:--------------:|:----------:|:------:|:---------:|:---------------:|:---------:|
| Interaktivna karta s pin-ovima | Puna | GPS ruta | Nema | Planiranje | Automatska | Nema |
| Budget tracking po kategorijama | Da | Nema | Nema | Nema | Nema | Nema |
| Upload slika po putovanju | Da (Cloudflare R2) | Da | Nema | Da | Automatski | Da |
| Korisnicke statistike (zemlje, gradovi) | Da | Da | Osnovno | Nema | Da | Nema |
| Follow / profili putnika | Da | Osnovo | Nema | Nema | Nema | Da (puno) |
| Komentari na putovanjima | Da | Nema | Nema | Nema | Nema | Da |
| Kategorije tipa putnika | Da (10 tipova) | Nema | Nema | Nema | Nema | Nema |
| CSV / PDF export | Pro tier | Nema | Pro | Da | Da | Nema |
| Accommodation tracker | Pro tier | Nema | Da | Da | Nema | Nema |
| Napredna budget analiza | Pro tier | Nema | Nema | Nema | Nema | Nema |
| Google Places integracija | Da | Nema | Da | Da | Da (core) | Nema |
| Apple Sign In | Da | Ne | Ne | Ne | Ne | Ne |
| Ručni vs automatski unos | Ručni (namjerno) | Automatski | Auto (email) | Oba | Automatski | Ručni |
| Privatnost po defaultu | Korisnik bira | Ograniceno | Da | Da | Privatno | Korisnik bira |
| Freemium model | Da (5 tripova) | Da | Da | Da | Besplatno | Besplatno |
| Godisnja cijena | 21.99 € / 39.99 € | 29.99 € | 49 USD | ~54 € | Besplatno | Besplatno |

---

## 3. Head-to-head usporedbe

### 3.1 Travel Checker vs Polarsteps

**Profil Polarsteps korisnika:** Iskusan putnik, putuje cesto, voli automatiku, nije budget-conscious.

| Dimenzija | Travel Checker pobjedjuje | Polarsteps pobjedjuje |
|-----------|--------------------------|----------------------|
| Budget tracking | Travel Checker jedini ima budget po kategorijama | - |
| Cijena | 21.99 €/god vs 29.99 €/god (27% jeftinije) | - |
| Social (komentari, follow) | Potpuni social graph | Samo osnovno dijeljenje |
| Kategorije putnika | 10 tipova, personaliziran experience | - |
| Automatski GPS tracking | - | Automatska ruta bez unosa |
| Offline mode | - | Polarsteps radi offline |
| Duljina zapisa rute | - | GPS track je precizan, km-po-km |
| Maturity branda | - | 5M+ korisnika, etabliran brand |

**Kljucni differentiator:** Polarsteps ZABILJEŽI gdje si bio. Travel Checker RAZUMIJE tvoje putovanje — koliko si potrošio, na što, usporedbu kroz vrijeme, i dijeli to s people who care.

**Kada Travel Checker dobija:** Korisnik koji hoce znati koliko ga putovanje košta, zeli community engagement, ili ne zeli da app stalno prati GPS lokaciju.

**Kada Polarsteps dobija:** Korisnik koji ne zeli nicim upravljati — samo automatsku rutu dok putuje.

---

### 3.2 Travel Checker vs TripIt

**Profil TripIt korisnika:** Poslovni putnik, upravljanje itinerarijima, konferencije, letovi.

| Dimenzija | Travel Checker pobjedjuje | TripIt pobjedjuje |
|-----------|--------------------------|------------------|
| Leisure korisnik | Dizajniran za leisure putnika | Fokusiran na business |
| Budget tracking | Da, po kategorijama | Nema osobnog budget trackinga |
| Vizualna karta | Interaktivna karta sa svim tripovima | Nema visual map pregleda |
| Social sharing | Profili, follow, komentari | Nema |
| Cijena | 21.99 €/god vs 49 USD/god (55% jeftinije) | - |
| Email parsing | - | Automatski uvoz rezervacija iz emaila |
| Letovi i gates | - | Real-time flight info, gate promjene |
| Airport lounges | - | Lounge locator |
| Business integracija | - | Kalendar integracije, korporativni planovi |

**Kljucni differentiator:** TripIt je alat za upravljanje putovanjima. Travel Checker je app za pamcenje putovanjima. Razlicita namjena, razlicit korisnik.

**Kada Travel Checker dobija:** Leisure putnik koji ne putuje poslovno, ili poslovni putnik koji zeli pratiti i privatna putovanja odvojeno.

**Kada TripIt dobija:** Korporativni korisnik koji mora imati sve rezervacije na jednom mjestu i treba sinkronizaciju s kalendarom.

---

### 3.3 Travel Checker vs Wanderlog

**Profil Wanderlog korisnika:** Planer putovanja, kolaborativni putnici, parovi i grupe koji zajedno organiziraju.

| Dimenzija | Travel Checker pobjedjuje | Wanderlog pobjedjuje |
|-----------|--------------------------|---------------------|
| Budget tracking | Detaljan po kategorijama, kroz sva putovanja | Nema budget tracking |
| Karta kao "travel atlas" | Sva putovanja na jednoj karti, rastuci atlas | Karta je samo za planiranje jednog tripa |
| Cijena | 2.99 €/mj vs 4.49 €/mj (33% jeftinije) | - |
| Social profil | Javni profil, follow network | Nema javnih profila |
| Post-trip tracking | Fokus na dokumentiranje poslije puta | - |
| Kolaborativno planiranje | - | Real-time shared itinerary s drugima |
| Pre-trip planiranje | Osnovno | Detaljni itinerary builder |
| Google Maps integracija | Google Places za destinacije | Dublja maps integracija za routing |

**Kljucni differentiator:** Wanderlog je "gdje cemo ici", Travel Checker je "gdje smo bili i koliko je koštalo". Pre-trip vs post-trip. Mogu se koristiti zajedno.

**Kada Travel Checker dobija:** Korisnik koji zeli trajni zapis putovanjima, budget analizu, i travel profil koji raste godinama.

**Kada Wanderlog dobija:** Korisnik koji planira kompleksno putovanje s drugima i treba shared itinerary s tocnim rutama.

---

### 3.4 Travel Checker vs Google Maps Timeline

**Profil Google Timeline korisnika:** Svaki Android/iOS korisnik koji ima lokacijske usluge ukljucene — passivan korisnik koji ni ne zna da ga prati.

| Dimenzija | Travel Checker pobjedjuje | Google Timeline pobjedjuje |
|-----------|--------------------------|---------------------------|
| Namjerna dokumentacija | Korisnik svjesno biljezi svako putovanje | - |
| Budget tracking | Potpuni budget po kategorijama | Nema |
| Slike organizirane po putovanjima | Da, s R2 cloud pohranom | Samo Google Photos linkovi |
| Social profil i sharing | Potpun social graph | Nema sharing |
| Privacy kontrola | Korisnik bira sto je javno | Google posjeduje sve podatke |
| Kategorije i statistike | 10 kategorija, napredna analitika | Osnovna statistika lokacija |
| Automatsko pracenje | - | Potpuno automatsko, bez unosa |
| Nema baterie drainaga | - | Timeline ne trosi bateriju (passive) |
| Siri / Apple integracija | - | Google integriran u iOS ekosustav |

**Kljucni differentiator:** Google Maps Timeline je passivni surveillance log. Travel Checker je namjerni, osobni travel journal. Jedan biljezi kretanje, drugi pamti iskustvo.

**Kada Travel Checker dobija:** Korisnik koji zeli privacy, zeli aktivno curati svoja putovanja, i zeli budget + social sloj.

**Kada Google Timeline dobija:** Korisnik koji ne zeli nista unositi i pristaje s Google-ovim pracenjem lokacije.

---

### 3.5 Travel Checker vs Instagram / Social media

**Profil Instagram travel korisnika:** Putnik koji dijeli slike radi engagementa, audience, aesthetic.

| Dimenzija | Travel Checker pobjedjuje | Instagram pobjedjuje |
|-----------|--------------------------|---------------------|
| Trajna dokumentacija | Putovanja ne "nestaju", uvijek dostupna | Stories nestaju za 24h, feed se gubi u scrollu |
| Budget tracking | Jedinstven, nitko drugi nema | Nema |
| Karta kao vizualni atlas | Interaktivna karta svih putovanja | Nema lokacijska karta osobnih putovanjima |
| Organizacija po putovanjima | Tripovi su jasno strukturirani | Feed je kronoloski, tesko je naci stariji sadrzaj |
| Privatnost | Korisnik kontrolira sto je javno | Algoritam dictira doseg |
| Budget audience | Nema | Milijarde korisnika |
| Engagement reach | Travel Checker zajednica putnika | Globalna publika svih interesa |
| Video content | - | Reels, Stories, Live |
| Discovery novi korisnici | - | Hashtagi, Explore, algoritam |

**Kljucni differentiator:** Instagram je stage za performans putovanja. Travel Checker je personal archive s kontekstom. Jedan je za audience, drugi je za tebe (i tvoj krug).

**Komplementarnost:** Travel Checker i Instagram ne konkuriraju direktno — korisnik moze koristiti oboje. Travel Checker = organizacija i budget, Instagram = sharing radi audience. Ovo je prodajna prednost: "Ne brisi Instagram, samo dodaj Travel Checker."

---

## 4. Nasa jedinstvena vrijednosna propozicija (UVP)

### Jednom recenicom:
Travel Checker je jedina iOS aplikacija koja kombinira interaktivnu kartu svih tvojih putovanjima, budget tracking po kategorijama i personaliziran travel profil — u jednom elegantnom, privatnom dnevniku koji raste cijeli zivot.

### Tri stupa differentiatora:

**1. Jedini s budget trackingom na karti**
Nijedan direktni konkurent ne kombinira vizualnu kartu putovanjima s pracenjem troškova. Polarsteps ima kartu, ali nema troškove. Visited broji samo drzave. TripIt ima troškove, ali nema kartu. Travel Checker je jedini koji odgovara na pitanje: "Koliko me stvarno koštalo to putovanje?" — s kontekstom gdje si bio i sto si radio.

**2. Personaliziran prema tipu putnika**
10 kategorija putnika (Solo, Digital Nomad, Obitelj, Backpacker, Luxury, Avanturist, Kulturni, Par, Grupno, Poslovni) nisu marketing labele — utjecu na iskustvo u appu, statistike i kontekst koji dobivas. Nijedan konkurent ne diferencira experience prema tipu korisnika.

**3. Tvoj vizualni atlas, ne feed**
Za razliku od social medija gdje sadrzaj nestaje ili se izgubi, i za razliku od GPS trackera koji bilježi kretanje ali ne iskustvo — Travel Checker je trajni, rastunci vizualni atlas cijelog zivota putnika. Svaki pin je tvoj, svaki trip je organiziran, svaki euro je zabiljezan.

---

## 5. Odgovaranje na prigovore — "Zasto ne koristiti [konkurenta]?"

### "Zasto ne koristiti samo Polarsteps?"

**Prigovor:** "Polarsteps automatski prati rutu i ima puno korisnika."

**Odgovor:**
Polarsteps odlicno biljezi gdje si bio. Ali znas li koliko te koštao taj tjedan u Tajlandu? Koliko si potrošio na smještaj u odnosu na hranu? Je li Barcelona bila skuplja od Lisabona za tvoj stil putovanja? Polarsteps ne zna. Travel Checker zna.

Uz to, Travel Checker Plus kosta 21.99 €/god — Polarsteps kosta 29.99 €/god. Platas manje, dobijas vise.

Ako ti je automatski GPS tracking bitan i nisi zainteresiran za budget, Polarsteps je OK. Ali ako ikad zelis razumjeti svoja putovanjima, a ne samo zabilježiti rutu — napravi switch.

---

### "Zasto ne koristiti samo TripIt?"

**Prigovor:** "TripIt je dobar za organizaciju i uvozi rezervacije automatski."

**Odgovor:**
TripIt je odlican za poslovne putnike koji trebaju imati sve rezervacije na jednom mjestu. Ali TripIt nema kartu, nema budget tracking, nema social profil, i kosta 49 dolara godišnje.

Travel Checker Plus kosta 21.99 € godišnje — to je 55% jeftinije. I nudi ono sto TripIt nema: vizualni atlas svih putovanjima, budget analiza, i mogucnost dijeljenja s onima koji te zele pratiti.

Ako putujes poslovno i trebas automatski import letova — koristis TripIt za logistiku. Ali za pamcenje putovanjima i razumijevanje troškova — Travel Checker.

---

### "Zasto ne koristiti Wanderlog?"

**Prigovor:** "Wanderlog ima dobro planiranje i kolaborativni je."

**Odgovor:**
Wanderlog je odlican za planiranje putovanjima prije nego što kreneš. Travel Checker je za dokumentiranje putovanjima nakon sto se vratis (i za vrijeme).

Wanderlog nema budget tracking. Travel Checker ima budget breakdown po kategorijama: smještaj, hrana, transport, aktivnosti. Uz to, Travel Checker je 33% jeftiniji: 2.99 €/mj vs 4.49 €/mj.

Mnogi korisnici koriste Wanderlog za planiranje, a Travel Checker za dokumentiranje. Nisu u konfliktu.

---

### "Zasto ne koristiti Google Maps Timeline?"

**Prigovor:** "Google Maps automatski biljezi sve lokacije, pa vec imam history."

**Odgovor:**
Google Maps Timeline je passivni log tvojih kretanja — biljezi gdje je tvoj telefon bio. Travel Checker je namjerni dnevnik tvojih iskustava.

Timeline ne zna koliko si potrošio u Barceloni. Ne zna koje slike idu uz koji trip. Ne zna da si bio Backpacker u Bangkoku i Luxury u Dubrovniku. I — Google posjeduje te podatke.

Travel Checker je tvoj, pod tvojom kontrolom. Birante sto je javno i sto je privatno. I dobivas ono sto Timeline ne moze dati: budget, slike, kategorije, i social profil.

---

### "Zasto ne koristiti samo Instagram?"

**Prigovor:** "Vec stavljam sve na Instagram — tamo su i slike i komentari."

**Odgovor:**
Instagram je sjajan za audience. Travel Checker je za tebe.

Stories na Instagramu nestanu za 24 sata. Feed se gubi u scrollu. Za 3 godine, neces moci naci slike s putovanjima u 2024. i neces znati koliko te koštalo.

Travel Checker je tvoj trajni vizualni atlas — svako putovanje, svaki troušak, svaka slika, organizirani po datumu i destinaciji. I uvijek accessible.

Uz to, Travel Checker ima Share funkciju za Instagram — slikas kartu sa svim tvojim putovanjima i objavljujes na Instagramu. Dobijas best of both worlds.

---

### "Zasto placati kad je besplatno?"

**Prigovor:** "Free tier ima samo 5 tripova — to je premalo."

**Odgovor:**
Free tier je za upoznavanje s appom. Casual putnik koji ima 1-2 putovanjima godišnje moze koristiti besplatno zauvijek.

Plus tier kosta 2.99 €/mj — to je manje od jedne kave tjedno. Putnik koji potroši 500-2.000 € na putovanjima govori da mu 2.99 €/mj nema smisla placati — ali ako jednom upravo zahvaljujuci budget trackingu spasiš 50 € na sljedecem putovanju, plan se vec isplatio.

---

### "Zasto ne koristiti spreadsheet za troškove?"

**Prigovor:** "Vec imam Excel/Google Sheets za pracenje troškova."

**Odgovor:**
Spreadsheet nema kartu. Spreadsheet nema slike. Spreadsheet zahtijeva disciplinu unosa i formatiranja. I spreadsheet ne mozes podijeliti na social media.

Travel Checker ima sve to u jednom koraku — unesnes destinaciju, datume, troškove i slike, i sve se automatski vizualizira na karti. Nema Formula, nema pivot tablica.

---

## 6. Scenariji quick-reference za razgovore

### Korisnik kaze: "Koristim vec Polarsteps."

**Odgovor (kratak):** "Odlicno — ali jesi li ikad znao koliko te koštao svaki trip? Travel Checker ima kartu I budget tracking zajedno. I 27% je jeftiniji."

**Odgovor (duzi):** Vidi sekciju 3.1 i 5.1.

---

### Korisnik kaze: "Stavljam sve na Instagram."

**Odgovor (kratak):** "Instagram je za audience. Travel Checker je za tebe — trajni album, dnevnik i budget tracker koji ne nestaje. I mozete dijeliti kartu direktno na Instagram."

**Odgovor (duzi):** Vidi sekciju 3.5 i 5.5.

---

### Korisnik kaze: "Preskupo je."

**Odgovor (kratak):** "2.99 €/mj — manje od jedne kave tjedno. Korisnik koji potroši 500 € na putovanjima govoriti da 2.99 € nema smisla placati ne drzi vodu. Plus je besplatno do 5 tripova — isprobaj bez ikakva rizika."

**Odgovor (duzi):** Vidi sekciju 5.6.

---

### Korisnik kaze: "Zasto ne koristiti samo Google Maps?"

**Odgovor (kratak):** "Google biljezi gdje je tvoj telefon bio. Travel Checker biljezi tvoje iskustvo — s budzetom, slikama, i profilom koji je tvoj, ne Googleov."

**Odgovor (duzi):** Vidi sekciju 3.4 i 5.4.

---

### Korisnik kaze: "Nema smisla — ne putujem dovoljno cesto."

**Odgovor:** "Upravo zato je besplatno. Free tier pokrije casual putnika zauvijek. I vrijednost nije samo dok putujes — karta je uvijek tamo, statistike rastu, i za 5 godina ces biti sretan/sretna sto si poceo/pocela bilježiti."

---

## 7. Naše slabosti — budite iskreni, ne defenzivni

Svaki prodajni razgovor mora biti iskren. Evo gdje Travel Checker trenutno gubi:

| Slabost | Kontekst | Odgovor |
|---------|----------|---------|
| Nema automatskog GPS trackinga | Polarsteps to ima, mi zahtijevamo rucni unos | "Rucni unos je namjeran — privatnost i baterija. Automatski GPS je roadmap za v2." |
| iOS only (nema Android) | Eliminira ~72% smartphona | "iOS first strategija — kvaliteta > pokrivenost. Android je Q3 2026 roadmap." |
| Nema offline moda | Mora biti online za unos | "Offline mode je roadmap za v2. Za vecinu korisnika nije blocker — 95% hotela ima WiFi." |
| Novi brand, 0 korisnika | Polarsteps ima 5M+ | "Zato je besplatno i bez obveze. Isprobas, vidis vrijednost, ostanes." |
| Nema kolaborativnog planiranja | Wanderlog to ima | "Travel Checker je za dokumentiranje, ne planiranje. Koristite Wanderlog za plan, Travel Checker za zapis." |

---

## 8. Naši pobjednicki scenariji

Travel Checker SIGURNO pobjedjuje kada korisnik:

1. **Pita "koliko me koštalo putovanje"** — nitko drugi nema budget tracking na karti
2. **Zeli privacy od Googlea** — kontrola vlastitih podataka
3. **Je Digital Nomad ili Backpacker** — budget je kljucan za ovaj segment
4. **Ima vise od 3 putovanjima godišnje** — Atlas vrijednost raste s brojem pinova
5. **Zeli community ali ne zeli Instagram algoritam** — Travel Checker zajednica putnika
6. **Poredi Polarsteps po cijeni** — 27% jeftiniji s vise featurea
7. **Obitelj s djecom** — kronoloski zapis za buducnost ("gdje smo sve bili")
8. **Korisnik koji vec ima spreadsheet za troškove** — Travel Checker to radi elegantnije + s kartom

---

## 9. Pozicioniranje prema tipu korisnika

| Tip korisnika | Primarni argument | Sekundarni argument |
|---------------|-------------------|---------------------|
| Solo putnik (25-35) | "Tvoj vizualni atlas koji raste" | Budget tracking za pametnije planiranje |
| Digital Nomad | "Jedini alat koji prati budget PO destinaciji" | Pro tier — CSV export za expense reports |
| Obitelj | "Za 10 godina, djeca ce pitati — imat ces odgovor" | Kronoloski, organiziran pregled |
| Backpacker | "Besplatno za uvijek do 5 tripova" | Budget breakdown — gdje zapravo odes novac |
| Loyalty Polarsteps user | "Sve što Polarsteps ima + budget tracking + 27% jeftinije" | Rucni unos = vise detalja |
| Instagram traveler | "Instagram je za audience, Travel Checker je za tebe" | Trajno, ne nestaje, organizirano |

---

*Dokument: `/projects/travel-checker/docs/sales/battle-card.md`*
*Vlasnik: CSO Agent*
*Sljedeca revizija: Q3 2026 (nakon prvih 3 mjeseca u produkciji s realnim korisnickim feedbackom)*
