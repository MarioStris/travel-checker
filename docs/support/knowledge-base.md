# Travel Checker — Baza znanja (Knowledge Base)

**Verzija**: 2.0
**Datum**: 2026-04-01
**Vlasnik**: CSM Agent
**Fokus direktorij**: /docs/support/

---

## Pregled strukture

Baza znanja organizirana je u 7 glavnih kategorija. Svaki clanak sadrzi cilj, korake rjesenja i povezane resurse. Prioritet je samoposluZno rjesavanje problema bez kontaktiranja podrske.

| Kategorija | Clanci | Teme |
|------------|--------|------|
| 1. Prijava i autentikacija | KB-101 do KB-104 | Apple Sign In, e-mail, lozinka, brisanje racuna |
| 2. Upravljanje putovanjima | KB-201 do KB-204 | CRUD putovanja, dijeljenje, uvoz |
| 3. Karta i lokacije | KB-301 do KB-304 | Interaktivna karta, pinovi, offline |
| 4. Fotografije | KB-401 do KB-404 | Upload, limiti, export, brisanje |
| 5. Pracenje budzeta | KB-501 do KB-505 | Postavljanje, troskovi, valute, izvjestaji |
| 6. Pretplate i naplata | KB-601 do KB-604 | Planovi, nadogradnja, otkazivanje, povrat |
| 7. Profil i statistike | KB-701 do KB-703 | Statistike, kategorije, privatnost |

---

## Kategorija 1: Prijava i autentikacija

### KB-101 — Prijava putem Apple ID-a

**Opis**: Korak-po-korak vodic za prijavu s Apple racunom.

**Koraci**:
1. Otvorite Travel Checker aplikaciju
2. Na ekranu dobrodoslice tapnite "Nastavi s Appleom"
3. Potvrdite Touch ID / Face ID ili unesite Apple lozinku
4. Odaberite dijeljenje e-mail adrese (preporucujemo "Podijeli moj e-mail" za bolje iskustvo)
5. Tapnite "Nastavi" — profil se automatski kreira

**Cesti problemi**:

| Problem | Rjesenje |
|---------|----------|
| Apple dugme nije vidljivo | Provjerite da koristite iOS 13 ili noviji |
| Greska "Not authorized" | Provjerite Internet konekciju i pokusajte ponovo |
| Aplikacija se ne otvara | Izbrisi cache, zatvori potpuno i ponovo pokreni |

---

### KB-102 — Prijava putem e-mail adrese

**Opis**: Kreiranje racuna i prijava s e-mailom i lozinkom.

**Koraci**:
1. Tapnite "Nastavi s e-mailom"
2. Unesite e-mail adresu i kreirajte lozinku (min. 8 znakova, 1 broj, 1 poseban znak)
3. Provjerite e-mail inbox — dolazi verifikacijski OTP kod (Clerk)
4. Unesite kod u aplikaciju
5. Profil je aktivan

**Napomena**: Verifikacijski kod vrijedi 10 minuta. Ako ne stigne, provjerite Spam folder ili zatrazite novi kod.

---

### KB-103 — Zaboravljena lozinka

**Koraci**:
1. Na ekranu prijave tapnite "Zaboravili ste lozinku?"
2. Unesite e-mail adresu koristenu pri registraciji
3. Provjerite inbox — link za reset dolazi u roku 2 minute
4. Tapnite link i unesite novu lozinku
5. Prijavite se s novom lozinkom

**Validnost linka**: 24 sata od slanja. Nakon isteka, zatrazite novi link.

---

### KB-104 — Brisanje racuna i GDPR zahtjevi

**Opis**: Postupak trajnog brisanja korisnickog racuna.

**Koraci**:
1. Idite na Profil > Postavke > Upravljanje racunom
2. Tapnite "Obriši moj racun"
3. Potvrdite identitet (Face ID / lozinka)
4. Odaberite razlog odlaska (opcijsko)
5. Tapnite "Trajno obriši"

**Vazno**: Svi podaci (putovanja, fotografije, statistike) brisu se trajno unutar 30 dana. Exportirajte podatke u Settings > Izvezi podatke PRIJE brisanja. Za GDPR zahtjeve, kontaktirajte privacy@travelchecker.app.

---

## Kategorija 2: Upravljanje putovanjima

### KB-201 — Kreiranje novog putovanja

**Opis**: Dodavanje prvog ili novog putovanja u aplikaciju.

**Koraci**:
1. Tapnite ikonu "+" na glavnom ekranu ili mapi
2. Unesite naziv putovanja i odrediste
3. Postavite datume (od — do)
4. Odaberite kategoriju putovatelja (npr. Solo Adventurer, Family Traveler)
5. Tapnite "Spremi" — putovanje je dodano, pin se pojavljuje na mapi

**Ogranicenja po planu**:

| Plan | Max aktivnih putovanja |
|------|------------------------|
| Free | 3 |
| Premium | Neograniceno |
| Pro | Neograniceno |

---

### KB-202 — Uredivanje i brisanje putovanja

**Uredivanje**:
1. Tapnite putovanje na mapi ili u listi
2. Tapnite ikonu olovke (gornji desni kut)
3. Izmijenite zeljene podatke
4. Tapnite "Spremi promjene"

**Brisanje**:
1. Otvorite putovanje
2. Tapnite "..." > "Obrisi putovanje"
3. Potvrdite brisanje

**Upozorenje**: Brisanje putovanja briše sve pridruZene fotografije i proracunske unose. Ova radnja nije reverzibilna.

---

### KB-203 — Dijeljenje putovanja s drugim korisnicima

**Dostupno**: Premium i Pro planovi

**Koraci**:
1. Otvorite putovanje
2. Tapnite "Dijeli putovanje"
3. Odaberite metodu: link, e-mail ili QR kod
4. Primatelj dobiva link za prikaz putovanja (read-only za Free korisnike)

---

### KB-204 — Uvoz putovanja iz CSV

**Dostupno**: Pro plan

**Koraci**:
1. Idite na Profil > Uvoz podataka
2. Preuzmite CSV predlozak
3. Popunite predlozak s podacima putovanja
4. Uploadajte datoteku
5. Pregledajte i potvrdite uvoz

**Podrzani formati**: CSV (Travel Checker predlozak v2)

---

## Kategorija 3: Karta i lokacije

### KB-301 — Interaktivna karta — osnove

**Geste**:
- Povuci: Pomicanje karte
- Pinch in/out: Zoom in/out
- Dvostruki tap: Zoom in na lokaciju
- Dugi pritisak: Dodaj pin rucno

**Znacenje pinova**:

| Boja pina | Znacenje |
|-----------|----------|
| Zeleni | Zavrseno putovanje |
| Plavi | Aktivno putovanje (u tijeku) |
| Sivi | Planirano putovanje |
| Zuticasti | Putovanje s budzet upozorenjem |

---

### KB-302 — Pin se ne pojavljuje na karti

| Uzrok | Rjesenje |
|-------|----------|
| Dozvola za lokaciju nije odobrena | Settings > Privacy > Location > Travel Checker > "While Using" |
| Odrediste nije pronadeno geolokacijom | Uredi putovanje, unesi tocniji naziv mjesta ili koordinate |
| Karta nije osvjezena | Povuci ekran prema dolje (pull-to-refresh) |
| Bug u aplikaciji | Zatvori potpuno i ponovo pokreni aplikaciju |
| Stara verzija aplikacije | Azuriraj na najnoviju verziju u App Store-u |

---

### KB-303 — Dozvole za lokaciju (iOS)

**Preporucena postavka**: "While Using the App" — omogucuje tocno postavljanje pinova.

**Koraci za odobrenje**:
1. Idite na iOS Settings (ne unutar aplikacije)
2. Pronađite Travel Checker
3. Tapnite "Location"
4. Odaberite "While Using the App"
5. Ukljucite "Precise Location" (za tocnost)

**Napomena**: Aplikacija ne treba lokaciju "Always" — ne prikupljamo lokaciju u pozadini.

---

### KB-304 — Offline karta i putovanje bez interneta

**Dostupno**: Pro plan

Free i Premium korisnici trebaju Internet konekciju za prikaz karte.

**Pro offline nacin**:
1. Otvorite putovanje dok imate Internet
2. Tapnite "Preuzmi za offline"
3. Odaberite regiju za preuzimanje
4. Karta je dostupna bez interneta

**Napomena**: Offline karte zauzimaju prostor na uredaju (prosjecno 50-200 MB po regiji).

---

## Kategorija 4: Fotografije

### KB-401 — Dodavanje fotografija na putovanje

**Koraci**:
1. Otvorite putovanje
2. Tapnite karticu "Fotografije"
3. Tapnite "+" ili ikonu fotoaparata
4. Odaberite: Snimi fotografiju ili Odaberi iz galerije
5. Dodajte opis i geotag (opcijsko)
6. Tapnite "Dodaj"

**Ogranicenja po planu**:

| Plan | Max fotografija/putovanju | Max velicina datoteke |
|------|---------------------------|-----------------------|
| Free | 10 | 5 MB |
| Premium | 100 | 15 MB |
| Pro | Neograniceno | 30 MB |

**Podrzani formati**: JPG, PNG, HEIC

---

### KB-402 — Fotografija se ne ucitava ili upload ne uspijeva

**Dijagnostika (redoslijedom)**:
1. Provjerite Internet konekciju (Wi-Fi preporucen za > 5 MB)
2. Provjerite dozvole: iOS Settings > Travel Checker > Photos > "Full Access"
3. Provjerite da niste dostigli limit fotografija za plan
4. Provjerite format (RAW, TIFF i BMP nisu podrzani)
5. Pokusajte komprimirati fotografiju i ponovo uploadati

Ako problem i dalje postoji: Profil > Pomoc > Prijavi problem (automatski se salje log greske).

---

### KB-403 — Brisanje i organizacija fotografija

**Brisanje jedne fotografije**:
1. Otvorite fotografiju
2. Tapnite ikonu kosa za smece
3. Potvrdite brisanje

**Brisanje vise fotografija**:
1. Tapnite "Uredi" u galeriji putovanja
2. Odaberite fotografije (kvacice se pojavljuju)
3. Tapnite "Obrisi odabrane"

**Reorganizacija**: Povucite i otpustite fotografije unutar galerije za promjenu redosljeda.

---

### KB-404 — Export fotografija

**Dostupno**: Svi planovi

**Koraci**:
1. Otvorite putovanje > Fotografije
2. Tapnite "..." > "Izvezi sve fotografije"
3. Fotografije se preuzimaju u iOS Photos galeriju
4. Alternativno: Dijeljenje pojedinacnih fotografija putem iOS Share Sheet-a

---

## Kategorija 5: Pracenje budzeta

### KB-501 — Postavljanje budzeta za putovanje

**Koraci**:
1. Otvorite putovanje
2. Tapnite karticu "Budzet"
3. Tapnite "Postavi budzet"
4. Unesite ukupni budzet u odabranoj valuti
5. Opcijsko: rasporedite po kategorijama (Smjestaj, Prijevoz, Hrana, Aktivnosti, Ostalo)
6. Tapnite "Spremi"

**Napomena**: Free korisnici mogu dodavati troskove, ali bez budzet limita i napredne analitike.

---

### KB-502 — Dodavanje troska

**Koraci**:
1. Otvorite putovanje > Budzet
2. Tapnite "+" ili "Dodaj trosak"
3. Unesite: iznos, kategoriju, datum, opis (opcijsko)
4. Dodajte fotografiju racuna (opcijsko — Pro plan)
5. Tapnite "Spremi"

**Brzi unos**: Glavni ekran > FAB gumb "+" > "Trosak" za brzo dodavanje.

---

### KB-503 — Vise valuta i konverzija

**Dostupno**: Premium i Pro planovi

**Koraci**:
1. Otvorite Budzet > Postavke valute
2. Odaberite primarnu valutu (npr. EUR)
3. Tapnite "Dodaj valutu" za putne valute (npr. USD, JPY)
4. Tecaj se automatski azurira dnevno (izvor: ECB API)
5. Svi troskovi prikazuju se u primarnoj valuti s konverzijom

---

### KB-504 — Budzet grafikoni i izvjestaji

| Znacajka | Free | Premium | Pro |
|----------|------|---------|-----|
| Pita grafikon po kategorijama | Ne | Da | Da |
| Trend potrosnje po danima | Ne | Da | Da |
| Usporedba budzet vs. stvarno | Ne | Osnovno | Puno |
| Export PDF / CSV | Ne | CSV | PDF + CSV |

**Pristup**: Putovanje > Budzet > tapnite ikonu grafa (gornji desni kut)

---

### KB-505 — Budzet upozorenja

**Automatska upozorenja** (Premium + Pro):

| Prag | Akcija |
|------|--------|
| 75% budzeta | Push notifikacija "Blizite se limitu" |
| 90% budzeta | Push notifikacija "Paznja — samo 10% preostalo" |
| 100% budzeta | Crveni indikator na putovanju + notifikacija |

**Iskljucivanje**: Profil > Postavke > Obavijesti > Budzet upozorenja

---

## Kategorija 6: Pretplate i naplata

### KB-601 — Usporedba planova

| Znacajka | Free | Premium ($4.99/mo) | Pro ($9.99/mo) |
|----------|------|--------------------|----------------|
| Aktivna putovanja | max 3 | Neograniceno | Neograniceno |
| Fotografije/putovanju | 10 | 100 | Neograniceno |
| Budzet pracenje | Osnovno | Napredno + vise valuta | Puno + izvjestaji |
| Offline karte | Ne | Ne | Da |
| Dijeljenje putovanja | Ne | Da | Da |
| Export podataka | Ne | CSV | CSV + PDF |
| Prioritetna podrska | Ne | Ne | Da |
| Analitika profila | Osnovna | Napredna | Potpuna |

---

### KB-602 — Nadogradnja na Premium ili Pro

**Koraci**:
1. Idite na Profil > Plan i pretplata
2. Tapnite "Nadogradi"
3. Odaberite Premium ili Pro
4. Potvrdite kupnju putem Apple Pay ili kreditne kartice
5. Pretplata je aktivna odmah

**Napomena**: Naplata ide kroz Apple App Store. Travel Checker nema pristup podacima kartice.

---

### KB-603 — Otkazivanje pretplate

**Koraci (kroz App Store)**:
1. Otvorite iOS Settings > Apple ID > Pretplate
2. Pronadite Travel Checker
3. Tapnite "Otkaži pretplatu"
4. Potvrdite

**Posljedice**: Pristup Premium/Pro znacajkama traje do kraja placenog perioda. Racun prelazi na Free tier. Podaci su sacuvani, ali dio sadrzaja postaje read-only.

---

### KB-604 — Povrat novca

**Politika**: Povrati se procesiraju kroz Apple App Store politiku povrata.

**Za zahtjev**:
1. Posjetite reportaproblem.apple.com
2. Prijavite se s Apple ID-om
3. Pronadite Travel Checker u kupnjama
4. Tapnite "Zahtjev za povrat"

**Travel Checker ne procesira povrate direktno** — sve kupnje su kroz Apple.

---

## Kategorija 7: Profil i statistike

### KB-701 — Putnicke statistike i znacke

**Dostupne statistike**:
- Ukupno posjeta zemalja
- Ukupno prijedenih kilometara (procjena)
- Najposjeceniji kontinent
- Ukupno putovanja i fotografija
- Omiljene kategorije putovanja
- Godisnji pregled (Year in Travel)

**Pristup**: Profil > "Moje statistike"

---

### KB-702 — Promjena kategorije putovatelja

**Kategorije**: Solo Adventurer, Digital Nomad, Family Traveler, Couple Explorer, Group Traveler, Budget Backpacker, Luxury Traveler, Business Traveler, Weekend Warrior, Adventure Seeker

**Koraci**:
1. Profil > Uredi profil
2. Tapnite "Kategorija putovatelja"
3. Odaberite novu kategoriju
4. Tapnite "Spremi"

---

### KB-703 — Privatnost profila

**Opcije**:

| Opcija | Opis |
|--------|------|
| Javni profil | Drugi korisnici vide broj putovanja i posjécene zemlje |
| Privatni profil | Nitko ne moze vidjeti vase podatke |

**Promjena**: Profil > Postavke > Privatnost > Toggle "Javni profil"

---

## Pretrazivanje i odrZavanje

Svi clanci pretrazivi su po: kljucnoj rijeci, kategoriji (1-7), planu (Free/Premium/Pro), iOS verziji.

**Azuriranje**: Baza znanja se azurira uz svaki release aplikacije.
**Sljedece azuriranje**: Travel Checker v2.0
**Kontakt za ispravke**: support@travelchecker.app
