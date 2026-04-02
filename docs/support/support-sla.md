# Travel Checker — Support SLA

**Verzija**: 1.0
**Datum**: 2026-03-27
**Vlasnik**: CSM Agent

---

## Pregled

Support SLA (Service Level Agreement) definira standarde koje korisnicima Travel Checkera garantiramo u pogledu brzine i kvalitete podrske.

**Nasa filozofija podrske**: Brza, ljudska, rjesenje-orijentirana. Korisnik ne smije osjecati da razgovara s botom ili citati FAQ koji ne odgovara na pravo pitanje.

---

## Prioritetne razine (P0-P3)

### P0 — Kriticno (Aplikacija ne radi)

**Definicija**: Cijela aplikacija je nedostupna, login ne funkcionira, podaci su izgubljeni, sigurnosni incident.

**Primjeri**:
- Aplikacija se ruši pri otvaranju za vecinu korisnika
- Nije moguce prijaviti se (auth servis down)
- Korisnici prijavljuju nestanak tripova
- Sumnja na sigurnosni propust ili neovlasteni pristup podacima

**Response time target**: 15 minuta (24/7, ukljucujuci vikende i praznike)
**Resolution time target**: 4 sata
**Tko rjesava**: CTO + Backend inzenjer (on-call) + CSM Lead
**Eskalacija**: Odmah po detekciji → CEO informiran unutar 30 minuta

---

### P1 — Visoki prioritet (Kljucna funkcionalnost blokirana)

**Definicija**: Vazna funckionalnost ne radi za specificni segment korisnika, ali aplikacija generalno funkcionira.

**Primjeri**:
- Ne moze se kreirati novi trip
- Fotografije se ne uploadaju
- Karta se ne prikazuje
- Push notifikacije ne rade
- Apple Sign In ne funkcionira

**Response time target**: 2 sata (radni dani), 4 sata (vikendi)
**Resolution time target**: 24 sata
**Tko rjesava**: Backend ili Frontend inzenjer + CSM
**Eskalacija**: Ako nije rijeseno u 12h → Engineering Manager

---

### P2 — Srednji prioritet (Funkcionalnost ogranicena)

**Definicija**: Funkcionalnost postoji ali ne radi ispravno, korisnik ima workaround.

**Primjeri**:
- Budzet se netocno konvertira
- Statistike na profilu prikazuju krive podatke
- Pogreske u autocomplete pretrage destinacija
- Email potvrda zakasnjava vise od 10 minuta
- Filter na karti ne radi ispravno

**Response time target**: 4 sata (radni dani), 8 sata (vikendi)
**Resolution time target**: 72 sata
**Tko rjesava**: CSM + Backend inzenjer (ako je bug)
**Eskalacija**: Ako nije rijeseno u 48h → Engineering Manager

---

### P3 — Nizak prioritet (Poboljsanje / Cosmetic)

**Definicija**: Sitne greske, upiti o funkcionalnostima, prijedlozi poboljsanja, pitanja vezana za koriscenje.

**Primjeri**:
- Tipfeler u aplikaciji
- Prijevod nije ispravan
- Prijedlog nove funkcionalnosti
- Pitanje "Kako mogu..."
- Estetski problem na UI-u

**Response time target**: 24 sata (radni dani)
**Resolution time target**: Sljedeci sprint (za bugove), Product backlog (za feature requestove)
**Tko rjesava**: CSM

---

## Response Time Targets po Kanalu

| Kanal | P0 | P1 | P2 | P3 |
|-------|----|----|----|----|
| In-app chat | 15 min | 2h | 4h | 8h |
| Email (podrska@travelchecker.app) | 15 min | 2h | 4h | 24h |
| App Store review odgovor | N/A | 48h | 48h | 72h |
| Instagram / Twitter DM | N/A | 4h | 8h | 24h |
| Privatnost (privacy@travelchecker.app) | N/A | N/A | 24h | 72h |

**Napomena**: P0 response time je 24/7 ukljucujuci praznike. Ostale razine vrijede za radne dane 9:00-18:00 CET.

---

## Support Sati

### Redovni support (P2, P3)
- Ponedjeljak — Petak: 9:00 - 18:00 CET
- Subota: 10:00 - 14:00 CET
- Nedjelja: zatvoreno

### Prosirenisupport (P1)
- Ponedjeljak — Nedjelja: 9:00 - 21:00 CET

### On-call (P0 kriticni incidenti)
- 24/7/365
- Rotacija: Backend inzenjer svaki tjedan (on-call schedule u PagerDuty-u)

---

## Eskalacijski Put

```
Korisnik kontaktira podrsku
         |
         v
     CSM Agent (first line)
     - Triage: odredi prioritet
     - Provjeri knowledge base
     - Pokusaj rijesiti unutar 15 minuta
         |
         |-- Rijeseno? --> Zatvori ticket + CSAT anketa
         |
         v
   Engineering Support (second line)
     - P0/P1 bugovi koji zahtijevaju kod fix
     - Backend/Frontend inzenjer
     - Target: fix ili workaround u < 24h
         |
         |-- Rijeseno? --> CSM komunicira s korisnikom
         |
         v
   Engineering Manager (third line)
     - Rjesava deadlockove i prioritizira
     - Koordinira s CTO-om za arhitekturne probleme
         |
         v
   CTO (security incidents, data loss)
         |
         v
   CEO (korisnik zeli pravnu akciju, PR krizna situacija)
```

---

## Support Workflow

### Prijem zahtjeva

1. **Automatski triage** — Support bot klasificira zahtjev na osnovu kljucnih rijeci i assignira inicial prioritet
2. **Potvrda primanja** — Korisnik odmah dobiva automatski email/poruku: "Primili smo tvoj zahtjev. Broj tiketa: #XXXXX. Odgovaramo unutar [SLA target]."
3. **CSM pregled** — CSM agent pregledava klasifikaciju i adjustira prioritet ako je potrebno
4. **Rjesavanje** — CSM pokusava rijesiti s knowledge base-om i poznavanjem aplikacije
5. **Eskalacija** — Ako CSM ne moze rijesiti, eskalira prema gore

### Komunikacija s korisnikom tokom rjesavanja

- **P0**: Svako update svakih 30 minuta dok se ne rijesi
- **P1**: Update svakih 4 sata
- **P2**: Javljamo kad imamo novo na konkretan status
- **P3**: Javljamo kad je rijeseno

### Zatvaranje tiketa

1. Ponudi rjesenje ili objasnjenje
2. Pitaj korisnika: "Je li ovo rijesilo tvoj problem?"
3. Ako DA: zatvoraj tiket, posalji CSAT anketu 24h nakon zatvaranja
4. Ako NE: reopen, eskalacija

---

## Tools i Workflow

### Support Stack

| Alat | Koristimo za |
|------|-------------|
| Intercom | In-app chat, email tickets, knowledge base hosting |
| PagerDuty | On-call alerts za P0 incidente |
| Linear | Bug tracking i koordinacija s engineeringom |
| Notion | Interna support dokumentacija, playbooki |
| Slack #support-alerts | Notifikacije za P0/P1 u realnom vremenu |

### Tiket lifecycle u Intercomu

```
New → In Progress → Waiting for Customer → Resolved → Closed
```

- **New**: Pristigao tiket, nije assigniran
- **In Progress**: CSM aktivno rjesava
- **Waiting for Customer**: Poslali odgovor, cekamo korisnikovu potvrdu
- **Resolved**: Rjesenje pruzeno, korisnik potvrdio ili nema odgovora 48h
- **Closed**: CSAT anketa poslana, tiket arhiviran

### Macro odgovori (predlosci)

Svaki CSM agent ima pristup predloscima za ceste situacije:
- Reset lozinke
- Problem s Apple Sign In
- Trip se nije spremi
- Zatraziti screenshot za debugging
- Eskalacija na engineering
- Zatvaranje tiketa s CSAT anketom

---

## CSAT Targets

**CSAT (Customer Satisfaction Score)** mjerimo nakon svakog zatvorenog tiketa.

Pitanje: "Koliko si zadovoljan/na s podrskcm koju si dobio/la?" (1-5 zvjezdica)

| Metrika | Target | Kriticni minimum |
|---------|--------|-----------------|
| CSAT Score | > 4.3 / 5.0 | > 3.8 / 5.0 |
| Response rate na CSAT | > 25% | > 15% |
| First Contact Resolution (FCR) | > 70% | > 55% |
| Avg. Resolution Time (P3) | < 18h | < 24h |
| Avg. Resolution Time (P2) | < 48h | < 72h |
| Reopen rate | < 5% | < 10% |

**Monitoring**: CSAT izvjestaj generiramo tjedno. Ako CSAT pada ispod 4.0, provodimo retrospektivu unutar 48h.

### Odgovor na negativne ocjene (1-2 zvjezdice)

Svaki tiket s ocjenom 1 ili 2 automatski:
1. Assignira se CSM Leadu za review
2. Generira alert u Slacku (#support-alerts)
3. CSM Lead kontaktira korisnika unutar 24h za follow-up

---

## Primjeri Odgovora po Situaciji

### Situacija: Korisnik izgubio trip

**Odgovor:**

> Bok [Ime],
>
> Razumijemo koliko je to neugodno — tripovi su ti uspomene i vazno je da su sigurni.
>
> Odmah smo provjerili na nasoj strani i evo sto smo nasli: [rezultat provjere]
>
> [Ako je trip pronadeni]: Tvoj trip "[Naziv]" je dostupan — mozda je doslo do problama s prikazom. Pokusaj: zatvori aplikaciju u potpunosti (swipe up i makni) i otvori ponovo. Javi nam je li trip sada vidljiv.
>
> [Ako trip nije pronadeni]: Na zalost, ne mozemo pronaci ovaj trip u nasoj bazi podataka. Ovo je vrlo rijetka situacija i ozbiljno istrazujemo sto se dogodilo. Kontaktirat cemo te s azuriranjem unutar 4 sata.
>
> Ispricavamo se zbog nevolje.
> [Ime], Travel Checker podrska

---

### Situacija: Korisnik zeli povrat novca (ako postoji premium)

> Bok [Ime],
>
> Razumijemo tvoj zahtjev. Da bismo ga mogli obraditi, trebamo:
> - Datum pretplate
> - Razlog za povrat
>
> Povrat procesiramo unutar 5-7 radnih dana. Javit cemo se s potvrdom.
>
> [Ime], Travel Checker podrska

---

### Situacija: Bug koji je poznat (engineering rjesava)

> Bok [Ime],
>
> Hvala sto si nas kontaktirala/o — ovo je problem koji smo svjesni i aktivno radimo na popravku.
>
> Ocekujemo da ce biti rijeseno do [datum / "sljedece azuriranje aplikacije"].
>
> Za sada, workaround je: [opis ako postoji]
>
> Dobit ces obavijest cim bug bude popravljen. Ispricavamo se zbog nevolje!
>
> [Ime], Travel Checker podrska

---

## Reporting i Metrrike

### Tjedni support report (za interni tim)

Svaki ponedjeljak generiramo izvjestaj koji ukljucuje:
- Broj tiketa po prioritetu
- Prosjecno response i resolution time
- CSAT score
- Top 5 ceste teme tiketa
- Broj bugseva eskaliranih na engineering
- Trend: rast/pad volumena tiketa

### Mjesecni report (za leadership)

- Trend CSAT-a (3-month rolling average)
- Support cost per ticket
- Top problemi koji zahtijevaju product fix
- Korelacija: support volumena s novim releasima
