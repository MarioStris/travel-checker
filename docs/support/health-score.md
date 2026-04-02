# Travel Checker — Model zdravstvenog rezultata korisnika (Health Score)

**Verzija**: 1.0
**Datum**: 2026-04-01
**Vlasnik**: CSM Agent
**Fokus direktorij**: /docs/support/

---

## 1. Svrha i pregled

Health Score je kompozitna metrika (0—100) koja mjeri zdravlje korisnickog odnosa s Travel Checker aplikacijom. Omogucava proaktivnu intervenciju prije nego korisnik otkaze pretplatu.

**Osvjezavanje**: Svaki dan u 03:00 CET (batch job)
**Pohrana**: AgentDB (per korisnik, historijat 90 dana)
**Primjena**: Churn prevention, expansion triggeri, CSM prioritizacija

---

## 2. Dimenzije i tezine

Health Score se racuna iz 5 dimenzija:

| Dimenzija | Tezina | Max bodova | Opis |
|-----------|--------|------------|------|
| Angazman (Engagement) | 30% | 30 | Ucestalost i dubina koristenja aplikacije |
| Usvajanje znacajki (Feature Adoption) | 25% | 25 | Postotak aktiviranih kljucnih znacajki |
| Podrska i zadovoljstvo (Support + NPS) | 20% | 20 | Kvaliteta korisnickog iskustva |
| Financijsko zdravlje (Payment) | 15% | 15 | Status pretplate i historijat placanja |
| Aktivnost profila (Profile Completeness) | 10% | 10 | Popunjenost profila i onboarding |

**Ukupno**: 100 bodova

---

## 3. Detaljna formula po dimenziji

### 3.1 Angazman — max 30 bodova

Mjeri se na 30-dnevnom kliznom prozoru.

| Pokazatelj | Max bodova | Formula |
|------------|------------|---------|
| Prijave (DAU/MAU ratio) | 12 | (Broj aktivnih dana / 30) x 12 |
| Dodana putovanja (30 dana) | 8 | min(putovanja_30d / 2, 1) x 8 |
| Dodane fotografije (30 dana) | 6 | min(fotografije_30d / 10, 1) x 6 |
| Sesije (prosjecno po tjednu) | 4 | min(sesije_tjedno / 5, 1) x 4 |

**Primjer**: Korisnik koji se prijavljuje 20 od 30 dana, dodao 3 putovanja i 15 fotografija:
- Prijave: (20/30) x 12 = 8.0
- Putovanja: (3/2) x 8 = 8.0 (max)
- Fotografije: (15/10) x 6 = 6.0 (max)
- Sesije: (4/5) x 4 = 3.2
- **Ukupno Engagement**: 25.2 / 30

---

### 3.2 Usvajanje znacajki — max 25 bodova

Svaka kljucna znacajka aktivirana = bodovi. Racuna se jednom (first-time activation).

| Znacajka | Bodovi | Aktivirana ako... |
|----------|--------|-------------------|
| Dodano 1+ putovanje | 5 | Trip count >= 1 |
| Dodana 1+ fotografija | 4 | Photo count >= 1 |
| Postavljeno putni budzet | 4 | Budget record exists |
| Koristen pin na karti | 4 | Map interaction logged |
| Podjeljeno putovanje | 3 | Share event >= 1 (Premium/Pro) |
| Aktiviran budzet alert | 3 | Budget alert setting = on |
| Popunjen profil kategorije | 2 | Traveler type != null |

**Maksimum**: 25 bodova (sve znacajke aktivirane)

---

### 3.3 Podrska i zadovoljstvo — max 20 bodova

| Pokazatelj | Max bodova | Formula |
|------------|------------|---------|
| NPS odgovor | 8 | Promoter = 8, Passive = 5, Detractor = 0, N/A = 4 |
| Otvoreni tiket (negativni utjecaj) | -5 | Oduzima po svakom otvorenom P0/P1 tiketu |
| CSAT nakon zatvaranja tiketa | 6 | Avg CSAT (1-5) / 5 x 6 |
| Dani bez tiketa (90 dana) | 6 | (Dani bez tiketa / 90) x 6 |

**Napomena**: Minimalni score ove dimenzije = 0 (ne ide u minus ukupnog scora).

---

### 3.4 Financijsko zdravlje — max 15 bodova

| Pokazatelj | Bodovi |
|------------|--------|
| Pretplata aktivna (Premium) | 8 |
| Pretplata aktivna (Pro) | 15 |
| Free plan | 3 |
| Pretplata istekla (grace period) | 1 |
| Pretplata otkazana (ali jos aktivna) | 4 |
| Neuspjelo placanje (payment failed) | 0 |
| Dugotrajni subscriber (> 6 mj) | +2 bonus |
| Godisnji plan (vs. miesecni) | +2 bonus |

**Maksimum s bonusima**: 19 (ali se ogranicava na 15 u ukupnom racunu)

---

### 3.5 Aktivnost profila — max 10 bodova

| Pokazatelj | Bodovi | Uvjet |
|------------|--------|-------|
| Profilna slika dodana | 2 | Avatar != null |
| Kategorija putovatelja odabrana | 2 | Traveler type set |
| Onboarding flow zavrsen | 3 | Onboarding_complete = true |
| Barem 1 zemlja oznacena na karti | 2 | Countries visited >= 1 |
| Push notifikacije ukljucene | 1 | Push permission = granted |

---

## 4. Ukupni izracun

```
Health Score =
  (Engagement score / 30 x 30) +
  (Feature Adoption score / 25 x 25) +
  (Support score / 20 x 20) +
  (Payment score / 15 x 15) +
  (Profile score / 10 x 10)

Zaokruzivanje: Na cijeli broj (0—100)
```

---

## 5. Pragovi i segmentacija

### 5.1 Kategorije zdravlja

| Raspon | Kategorija | Boja | Opis |
|--------|------------|------|------|
| 75 — 100 | Zdrav (Healthy) | Zelena | Aktivan, zadovoljan, nizak churn rizik |
| 50 — 74 | Rizican (At-Risk) | Zuta | Smanjena aktivnost, intervencija preporucena |
| 25 — 49 | Kriticni (Critical) | Narandzasta | Visok churn rizik, hitna intervencija |
| 0 — 24 | Izgubljen (Churned-Risk) | Crvena | Izuzetno visok churn rizik, zadnja sansa |

### 5.2 Distribucija po planu (ocekivana)

| Plan | Ocekivani prosjek | Zdrav cilj |
|------|-------------------|------------|
| Free | 35 — 50 | > 45 |
| Premium | 55 — 70 | > 60 |
| Pro | 65 — 85 | > 70 |

---

## 6. Automatizirane akcije po pragu

### 6.1 Zdrav (75—100)

| Trigger | Akcija | Kanal | Odgoda |
|---------|--------|-------|--------|
| Score >= 80, Premium plan, 3+ mj | Upsell nudge na Pro | In-app banner | 7 dana od zadnjeg nudge-a |
| Score >= 75, koristio sharing | "Pozovi prijatelja" referral | Push notifikacija | Jednom mjesecno |
| Score = 100 | "Power User" znacka, javni profil highlight | In-app achievement | Odmah |

### 6.2 Rizican (50—74)

| Trigger | Akcija | Kanal | Odgoda |
|---------|--------|-------|--------|
| Score pao > 15 bodova u 7 dana | "Mis you" re-engagement e-mail | E-mail | Odmah |
| Feature Adoption < 12/25 | Personaliziran tutorial push | Push notifikacija | 48h od detektiranja |
| Nema sesije 14 dana | Check-in e-mail s tip-om za kategroriju korisnika | E-mail | Dan 14 inaktivnosti |
| NPS = Passive (7-8) | Kratka anketa "Sto mozemo popraviti?" | In-app survey | 3 dana nakon NPS odgovora |

### 6.3 Kriticni (25—49)

| Trigger | Akcija | Kanal | Odgoda |
|---------|--------|-------|--------|
| Score < 50, Premium/Pro | CSM osobni e-mail (nije automatski template) | E-mail | Odmah |
| Nema sesije 21 dan | "Povratak" kampanja s premium benefitom | E-mail sekvenca (3 e-maila) | Dan 21, 28, 35 |
| NPS = Detractor (0-6) | Tiket za CSM follow-up unutar 48h | Interni tiket | Odmah |
| Payment failed | Obavijest o neuspjelom placanju + link za azuriranje | E-mail + in-app | Odmah, ponovi za 3 i 7 dana |

### 6.4 Izgubljen (0—24)

| Trigger | Akcija | Kanal | Odgoda |
|---------|--------|-------|--------|
| Score < 25, Premium/Pro | Win-back kampanja: 30% popust na 3 mj | E-mail | Odmah |
| Nema sesije 30 dana | "Sto se dogada?" survey + reminder za export podataka | E-mail | Dan 30 inaktivnosti |
| Otkazao pretplatu (grace period) | Save flow: ponuda pauziranja umjesto otkazivanja | In-app modal + e-mail | Odmah po otkazivanju |
| Score < 10 | Automatski flag za manualnu CSM reviziju | Interni Slack alert | Odmah |

---

## 7. Segmentacija po tipu korisnika

Health Score se interpretira u kontekstu putnicke kategorije jer razliciti tipovi imaju razlicite obrasce koristenja:

| Kategorija | Ocekivana sesije/mj | Ocekivana putovanja/mj | Napomena |
|------------|---------------------|------------------------|---------|
| Business Traveler | 12-20 | 2-4 | Cesti krace sesije, budzet kljucan |
| Digital Nomad | 20-30 | 1-2 (duga) | Visoka foto aktivnost, budzet pracenje |
| Solo Adventurer | 8-15 | 1-2 | Vikend spikes, manje redovit |
| Family Traveler | 5-10 | 1-2 (godisnji odmori) | Sezonski obrazac, niski DAU/MAU |
| Weekend Warrior | 15-25 | 4-8 | Kratka, cesta putovanja |
| Budget Backpacker | 10-20 | 2-3 | Budzet kljucan, duZa putovanja |

**Ponder korekcija**: Za Family Traveler i Luxury Traveler, minimalni threshold za "Zdrav" snizava se za 10 bodova (sezonski obrazac).

---

## 8. NPS integracija

### 8.1 Timing ankete

| Korisnik | Kada se salje NPS anketa |
|----------|--------------------------|
| Novi korisnik (Free) | Dan 30 od registracije |
| Novi Premium/Pro | Dan 14 od nadogradnje |
| Svi aktivni korisnici | Kvartalno (uz podsjetnik) |
| Nakon zatvaranja P1/P0 tiketa | 48h nakon rjesenja |

### 8.2 Utjecaj NPS na Health Score

| NPS kategorija | Score (0-10) | Dodan NPS bod | Akcija |
|----------------|--------------|---------------|--------|
| Promoter | 9-10 | 8 | Referral program poziv |
| Passive | 7-8 | 5 | Follow-up anketa za poboljsanje |
| Detractor | 0-6 | 0 | Tiket za CSM + osobni odgovor u 48h |

---

## 9. Dashboard i monitoring

### 9.1 CSM dashboard (interni)

Svakodnevno generiran izvjestaj koji prikazuje:
- Distribuciju Health Score za sve Premium/Pro korisnike
- Korisnike koji su promijenili kategoriju (posebno Zdrav → Rizican)
- Korisnike s Health Score padom > 20 bodova u 7 dana
- Sve Pro korisnike u Kriticnom ili Izgubljenom segmentu

### 9.2 Automatski alerti (Slack #csm-alerts)

| Alert | Uvjet |
|-------|-------|
| Churn Risk Alert | Pro korisnik pao ispod 40 bodova |
| Payment Alert | Neuspjelo placanje za Premium/Pro |
| NPS Detractor | NPS odgovor 0-6 od Premium/Pro korisnika |
| Bulk Drop | > 100 korisnika palo za 10+ bodova u 24h (signal o tehnickom problemu) |

---

## 10. Verzioniranje i kalibracija

Health Score model kalibrira se kvartalno na temelju:
- Korelacije Score-a s churn ratom (cilj: r > 0.7)
- Feedback CSM tima o akcijabilnosti alertova
- A/B testova intervencija

**Sljedeca kalibracija**: 2026-07-01
**Odgovorna osoba**: CSM Agent + Data Analyst
