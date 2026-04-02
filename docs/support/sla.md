# Travel Checker — Definicija razine usluge podrske (SLA)

**Verzija**: 1.0
**Datum**: 2026-04-01
**Vlasnik**: CSM Agent
**Fokus direktorij**: /docs/support/

---

## 1. Svrha dokumenta

Ovaj dokument definira obveze Travel Checker tima prema korisnicima u pogledu vremena odgovora, dostupnosti usluge i kvalitete podrske. SLA se razlikuje prema pretplatnom planu i tezini problema.

---

## 2. Planovi i kanali podrske

### 2.1 Dostupni kanali po planu

| Kanal | Free | Premium | Pro |
|-------|------|---------|-----|
| In-app chat (async) | Da | Da | Da |
| E-mail podrska | Da | Da | Da |
| Prioritetni in-app chat | Ne | Ne | Da |
| Telefonska podrska | Ne | Ne | Ne |
| Dedicirani CSM | Ne | Ne | Na zahtjev (>500 aktivnih korisnika u bazi) |

**Kontakt adrese**:
- Opca podrska: support@travelchecker.app
- Naplata i pretplate: billing@travelchecker.app
- Sigurnost i privatnost: privacy@travelchecker.app
- Pro prioritetna podrska: pro-support@travelchecker.app

### 2.2 Radno vrijeme podrske

| Tip | Raspored | Vremenska zona |
|-----|----------|----------------|
| Standardna podrska | Ponedjeljak — Petak, 09:00 — 18:00 | CET (UTC+1) |
| Pro prioritetna podrska | Ponedjeljak — Nedjelja, 08:00 — 22:00 | CET (UTC+1) |
| P0 / Kriticni incidenti | 24/7/365 | Automatizirani monitoring + on-call |

---

## 3. Razine ozbiljnosti incidenta (Prioriteti)

### 3.1 Definicija razina

| Razina | Naziv | Opis | Primjeri |
|--------|-------|------|---------|
| P0 | Kriticni | Usluga nedostupna za sve korisnike; gubitak podataka u tijeku | App server down, baza podataka nedostupna, sigurnosni proboj, masivni gubitak podataka |
| P1 | Visoki | Kljucna funkcionalnost nedostupna za vecinu korisnika | Login ne radi, upload fotografija ne funkcionira, mapa se ne ucitava, naplata blokirana |
| P2 | Umjereni | Vazna funkcionalnost degradirana; postoji zaobilazno rjesenje | Budzet grafikon ne prikazuje tocne podatke, spori load, sporadic upload greske |
| P3 | Niski | Manji problem, estetski ili rijetki rubni slucajevi | Pravopisna greska u UI-u, stilski bug, zahtjev za znacajkom, nejasna poruka greske |

### 3.2 Kriteriji eskalacije razine

Automatska eskalacija P3 → P2 ako:
- Isti problem prijavi 10+ korisnika unutar 24 sata
- Problem traje > 48 sati bez rjesenja

Automatska eskalacija P2 → P1 ako:
- Zahvaceno > 20% aktivnih korisnika
- Problem traje > 4 sata bez rjesenja

---

## 4. Vremena odgovora i rjesenja

### 4.1 Ciljana vremena po prioritetu i planu

| Prioritet | Free — 1. odgovor | Free — Rjesenje | Premium — 1. odgovor | Premium — Rjesenje | Pro — 1. odgovor | Pro — Rjesenje |
|-----------|-------------------|-----------------|----------------------|--------------------|------------------|----------------|
| P0 | 4 sata | 8 sati | 2 sata | 4 sata | 1 sat | 2 sata |
| P1 | 24 sata | 72 sata | 8 sati | 24 sata | 2 sata | 8 sati |
| P2 | 48 sati | 7 dana | 24 sata | 72 sata | 8 sati | 48 sati |
| P3 | 5 radnih dana | Best effort | 3 radna dana | 7 dana | 1 radni dan | 5 dana |

**Napomena**: "1. odgovor" = potvrda primitka i procjena tezine. "Rjesenje" = problem je ispravljen ili zaobilazno rjesenje je dostavljeno.

### 4.2 Jamstva razine usluge

- P0 incidenti: Statusna stranica azurira se svako 30 minuta (status.travelchecker.app)
- P1 incidenti: Korisnici zahvaceni incidentom dobivaju push notifikaciju o statusu
- Svi planovi: Automatska potvrda primitka tiketa unutar 15 minuta (24/7)

---

## 5. Dostupnost i uptime

### 5.1 Ciljevi dostupnosti (Uptime SLA)

| Komponenta | Cilj | Mjerenje | Planirani maintanence |
|------------|------|----------|-----------------------|
| iOS aplikacija (App Store) | 99.9% | Mjesecno | Da (najava 48h unaprijed) |
| API / Backend | 99.5% | Mjesecno | Da (najava 24h unaprijed) |
| CDN / Fotografije | 99.9% | Mjesecno | Automatski (bez prekida) |
| Mapa (tiles) | 99.0% | Mjesecno | Da (najava 24h unaprijed) |

### 5.2 Izracun dostupnosti

```
Dostupnost (%) = ((Ukupno minuta - Minuta nedostupnosti) / Ukupno minuta) x 100

Primjer: 99.5% = max 3.65 sati nedostupnosti/mjesecno
```

### 5.3 Planirano odrzavanje

- **Prozor za maintanence**: Cetvrtak, 02:00 — 04:00 CET
- **Najava**: Najmanje 24 sata unaprijed putem in-app banner-a i e-maila
- **Iskljucenje**: Planirani maintanence ne ulazi u racun dostupnosti

---

## 6. Putanje eskalacije

### 6.1 Standardna eskalacija

```
Korisnik prijavljuje problem
        |
        v
Tier 1 podrska (in-app / e-mail)
  - Standardni problemi, baza znanja, reset lozinke
  - Rjesava: ~70% tiketa
        |
        v (ako ne rjesavaju u roku ili P0/P1)
Tier 2 podrska (Senior Support Engineer)
  - Tehnicka dijagnostika, log analiza, bug reprodukcija
  - Rjesava: ~25% tiketa
        |
        v (ako zahtijeva code fix ili arhitekturnu odluku)
Tier 3 Engineering (Backend/Frontend/DevOps tim)
  - Bugfix, hotfix deploy, infrastrukturni incident
  - Rjesava: ~5% tiketa
        |
        v (ako zahvaca sigurnost, gubitak podataka ili pravne implikacije)
Management (CTO / CEO)
```

### 6.2 P0 eskalacija (Kriticni incidenti)

1. Automatizirani monitoring detektira incident (Sentry / UptimeRobot)
2. On-call inzenjer dobiva PagerDuty alert unutar 5 minuta
3. War room se otvara u Slack kanalu #incident-p0
4. Statusna stranica se azurira unutar 15 minuta
5. CEO/CTO su obavijesteni unutar 30 minuta
6. Post-mortem dokument sprema se unutar 48 sati od rjesenja

---

## 7. Performansni ciljevi aplikacije

### 7.1 Tehnicke metrike (mjereno Sentry + internal monitoring)

| Metrika | Cilj | Kriticno (P1 ako premasen) |
|---------|------|---------------------------|
| API P95 latencija | < 500 ms | > 2000 ms |
| API P99 latencija | < 1000 ms | > 5000 ms |
| Ucitavanje karte (tiles) | < 2 s | > 5 s |
| Upload fotografije (5 MB) | < 10 s | > 30 s |
| App cold start | < 3 s | > 8 s |
| Crash rate | < 0.1% sesija | > 1% sesija |
| Error rate API | < 0.5% zahtjeva | > 2% zahtjeva |

### 7.2 iOS App Store metrike

| Metrika | Cilj |
|---------|------|
| App Store Rating | >= 4.5 zvjezdice |
| Crash-free sessions | >= 99.5% |
| Lighthouse Score (web fallback) | >= 90 |

---

## 8. Kompenzacija i krediti

### 8.1 SLA krediti (za Premium i Pro planove)

Ako Travel Checker ne ispuni uptime ciljeve u bilo kojem kalendarskom mjesecu:

| Dostupnost (mjesecno) | Kredit |
|-----------------------|--------|
| 99.0% — 99.5% | 10% sljedeceg miesecnog racuna |
| 95.0% — 99.0% | 25% sljedeceg miesecnog racuna |
| < 95.0% | 50% sljedeceg miesecnog racuna |

**Kako zatraziti kredit**: Kontaktirajte billing@travelchecker.app unutar 30 dana od incidenta s brojem tiketa ili referencom statusne stranice.

**Ogranicenja**: Krediti se ne primjenjuju na planirano odrzavanje ili incidente uzrokovane trecim stranama (Apple, AWS, Mapbox).

---

## 9. Iskljucenja iz SLA

SLA se ne primjenjuje u sljedecim slucajevima:
- Planirano odrzavanje (najavljeno 24h unaprijed)
- Incidenti uzrokovani Apple App Store ili iOS sustavom
- Incidenti uzrokovani trecim stranama (Mapbox, Clerk, AWS)
- Incidenti uzrokovani zlouporabom ili napadom korisnika
- Visi sila (prirodne katastrofe, ratovi, pandemije)

---

## 10. Mjerenje i izvjestavanje

### 10.1 Interni KPI-ji podrske

| KPI | Cilj | Mjerenje |
|-----|------|----------|
| CSAT (Customer Satisfaction) | >= 4.2 / 5.0 | Nakon zatvaranja tiketa |
| First Contact Resolution (FCR) | >= 70% | Tjedni izvjestaj |
| Avg. First Response Time | < 4h (svi planovi prosjek) | Tjedni izvjestaj |
| Ticket backlog | < 50 otvorenih tiketa | Dnevni monitoring |
| Eskalacija rate | < 5% tiketa | Mjesecni izvjestaj |

### 10.2 Korisnicko izvjestavanje

- **Statusna stranica**: status.travelchecker.app (javno dostupna, azurira se realno-vremenski)
- **Mjesecni izvjestaj**: Pro korisnici dobivaju uptime report e-mailom
- **Incident post-mortem**: Javno dostupan na status stranici za P0/P1 incidente

---

**Napomena**: Ovaj SLA dokument revizija se vrsi kvartalno ili nakon svakog P0 incidenta.
**Sljedeca planirana revizija**: 2026-07-01
