# Travel Checker — Playbook za prevenciju odljeva korisnika (Churn Prevention)

**Verzija**: 1.0
**Datum**: 2026-04-01
**Vlasnik**: CSM Agent
**Fokus direktorij**: /docs/support/
**Referenca**: /docs/support/health-score.md, /docs/support/onboarding.md

---

## 1. Svrha i filozofija

Cilj ovog playboka je sprijeciti odljev korisnika intervencijom PRIJE nego korisnik donese odluku o otkazivanju. Svaka intervencija mora biti:
- **Personalizirana** — prema segmentu, planu i putnickoj kategoriji
- **Pravovremena** — u kriticnom trenutku, ne prekasno i ne prerano
- **Vrijednosna** — nuditi stvarnu korist, ne samo popust

**Kljucna metrika**: Monthly Churn Rate < 3% (Premium), < 2% (Pro)

---

## 2. Rani znakovi odljeva (Early Warning Signals)

### 2.1 Automatski detektirani signali

| Signal | Prag | Prioritet | Izvor podataka |
|--------|------|-----------|----------------|
| Inaktivnost | Nema sesije 14+ dana | Visoki | Session tracking |
| Health Score pad | Pad > 20 bodova u 7 dana | Visoki | Health Score model |
| Health Score kriticni | Score < 40 | Kriticni | Health Score model |
| NPS Detractor | Odgovor 0-6 | Kriticni | NPS anketa |
| Neuspjelo placanje | Prva greska naplate | Visoki | Billing sustav |
| Otkaz pretplate | Korisnik pokrenuo otkaz | Kriticni | App Store webhook |
| Smanjeno koristenje znacajki | Feature adoption < 10/25 bodova | Umjereni | Feature tracking |
| Negativna recenzija App Store | 1-2 zvjezdice | Visoki | App Store API |
| Visoki broj tiketa | 3+ tiketa u 14 dana | Umjereni | Support sustav |
| Konverzija nije dogod ila | Free korisnik 21+ dan, < 3 znacajke | Umjereni | Onboarding tracking |

### 2.2 Kontekstualni signali (rucna analiza)

- Korisnik pita "kako izvesti podatke" ili "kako otkazati" (namjera odlaska)
- Support tiket s frustracijom ili ljutnjom
- Izostanak odgovora na 2 uzastopna re-engagement e-maila
- Downgrade zahtjev (Pro → Premium → Free)

---

## 3. Segmentacija i intervencijski putevi

### 3.1 Matrica intervencija po planu i zdravlju

| Segment | Health Score | Plan | Pristup | Vlasnik |
|---------|-------------|------|---------|---------|
| VIP at-risk | < 60 | Pro | Osobni CSM kontakt unutar 48h | CSM (rucno) |
| Premium at-risk | < 50 | Premium | Automatizirana e-mail sekvenca + CSM review | Automatski + CSM |
| Free at-risk | < 40 | Free | Automatizirana sekvenca + upsell | Automatski |
| Svi detractori | N/A (NPS 0-6) | Svi | CSM follow-up tiket | CSM (rucno) |
| Neaktivni | 14+ dana bez sesije | Svi | Re-engagement sekvenca | Automatski |

---

## 4. Playbook po fazi odljeva

### Faza 1: Rani znakovi (Health Score 50—74)

**Cilj**: Podsjetiti korisnika na vrijednost, povecati angazman.

**Trigger**: Health Score pao u "Rizicni" segment ili inaktivnost 14 dana.

**Akcije**:

1. **Dan 1 — In-app personalizirani tip**
   - Sadrzaj: Personaliziran prema putnickoj kategoriji
   - Primjer za Budget Backpacker: "Jesi li znao da mozete pratiti troskove u 40+ valuta?"
   - Primjer za Family Traveler: "Podijeli sljedece obiteljsko putovanje sa svima — jedan link, sve informacije."
   - Format: In-app tooltip / bottom sheet
   - A/B test: Tip vs. mini tutorial video

2. **Dan 3 — E-mail "Tvoja putovacka statistika"**
   - Sadrzaj: Personaliziran pregled aktivnosti (broj zemalja, prijedeni km, fotografija)
   - CTA: "Dodaj sljedece putovanje" — deep link na kreiranje
   - Ton: Emocionalan, inspirativan (referenca na vrijednost, ne na znacajke)

3. **Dan 7 — Push notifikacija (ako nema reakcije)**
   - Sadrzaj: "Tvoja karta te ceka — gdje ides sljedece?"
   - Deep link: Karta s pinovima korisnika
   - Uvjet slanja: Push dozvola odobrena

**Uspjeh faze**: Korisnik se vratio u sesiju + Health Score porastao > 55

---

### Faza 2: Visoki rizik (Health Score 25—49)

**Cilj**: Identifikacija temeljnog uzroka, osobna intervencija, vrednosna ponuda.

**Trigger**: Health Score u "Kriticnom" segmentu.

**Akcije**:

1. **Odmah — Automatski tiket za CSM**
   - Za Pro korisnike: Assign CSM-u, manual follow-up obavezan
   - Za Premium korisnike: Assign senior support tier, template dostupan

2. **Dan 1 — "Jesmo li pogrijesili?" e-mail**
   - Posiljalac: Prikazuje se kao ime CSM-a (npr. "Ana iz Travel Checker tima")
   - Sadrzaj: Kratki osobni e-mail, pita sto mozemo popraviti
   - CTA: Link na kratku 3-pitanje anketu ILI direktni reply na e-mail
   - Ton: Iskren, bez marketinga, bez promo ponuda u prvom e-mailu

3. **Dan 3 — Personalizirana vrijednosna ponuda (ako nema odgovora)**
   - Za korisnike koji nisu iskoristili kljucne znacajke: Mini onboarding refresh
   - Ponuda: "Besplatni 1:1 onboarding poziv" (za Pro; link na Calendly)
   - Za Premium: "Besplatni Premium tjedan za prijatelja kojeg pozoves"

4. **Dan 7 — Zadnja automatska poruka u fazi**
   - Sadrzaj: "Paznja — tvoji podaci su sigurni, ali zelimo biti sigurni da si zadovoljan"
   - CTA: Survey s jednim pitanjem: "Sto bi te motiviralo da koristis Travel Checker vise?"
   - Prilog: Link na bazu znanja, videi tutoriala

**Za NPS Detractor (0-6) — specijalni put**:
- Automatski tiket dodijeljen CSM-u unutar 2 sata
- CSM personalno odgovara unutar 48h s konkretnom akcijskim planom
- Ako je uzrok tech bug: Koordinacija s engineering timom za hotfix + status update korisniku
- Ako je uzrok UX problem: Bug report + "hvala, evo sto cemo popraviti" mail

---

### Faza 3: Kritican rizik / Otkaz u tijeku (Health Score < 25 ili otkaz pokrenut)

**Cilj**: Save — zaustaviti otkaz ili osigurati lijep odlazak i otvorena vrata za povratak.

**Trigger**: Korisnik pokrenuo otkaz u App Store ILI Health Score < 25.

#### 3.1 Optimizacija toka otkazivanja (Cancellation Flow)

Kada korisnik pokusava otkazati pretplatu kroz app (ako je moguce putem deep linka iz aplikacije ili in-app upozorenja):

**Korak 1 — Razlog otkazivanja** (obavezan, max 30 sek):
- Preskupo
- Nemam vremena za putovanja
- Nedostaje mi znacajka [unos teksta]
- Prelazim na drugu aplikaciju
- Tehnickih problema imam previse
- Drugo

**Korak 2 — Personalizirana save ponuda** (na temelju odabranog razloga):

| Razlog | Save ponuda |
|--------|-------------|
| Preskupo | Ponuda pauziranja 1-3 mj ILI 30% popust na 3 mj |
| Nema vremena | "Pausiraj plan umjesto otkazivanja" — sve ostaje, nema naplate |
| Nedostaje znacajka | Roadmap pregled znacajke + mogucnost glasanja |
| Prelazak na drugu app | "Sto ima tamo sto mi nedostaje?" — kratki survey, bez retencijske ponude |
| Tehnicki problemi | Brzi eskalacijski tiket + "Rjesit cemo to za 24h" garancija |

**Korak 3 — Pauziranje kao alternativa**:
- Dostupno za Premium i Pro
- Trajanje: 1, 2 ili 3 mjeseca
- Podaci i sadrzaj ostaju sacuvani
- Naplata se nastavlja automatski na kraju pauze
- Korisnik moze otkazati u bilo koje vrijeme

**Korak 4 — Lijep odlazak** (ako i dalje otkazuje):
- "Znamo da putovacki planovi se mijenjaju. Vrati se kad budes spreman."
- Reminder da podaci ostaju sacuvani 90 dana
- Link za export podataka (KB-404)
- CTA: "Obavijesti me o novim znacajkama" (newsletter opt-in)

---

#### 3.2 Win-back sekvenca (korisnik vec otkazao)

**Trigger**: Pretplata istekla, korisnik presao na Free tier.

| Dan | Poruka | Kanal | Ponuda |
|-----|--------|-------|--------|
| 0 | Potvrda otkaza + export podataka podsjetnik | E-mail | Bez ponude |
| 7 | "Nedostajes nam — evo sto je novo" | E-mail | Bez ponude |
| 14 | Release notes + nova znacajka (ako postoji) | E-mail | 20% popust na 1 mj |
| 30 | "Planirate li putovanje uskoro?" | E-mail | 30% popust na 3 mj |
| 60 | Godisnji "Year in Travel" pregled | E-mail | 50% popust na 1 mj (zadnja ponuda) |
| 90 | "Vasim podacima istice rok" upozorenje | E-mail | Bez ponude (urgentnost) |

**Uvjeti win-back sekvence**:
- Ne salje se ako je korisnik se vratio (pretplata obnovljena)
- Ne salje se ako je korisnik unsubscribao s e-mail komunikacije
- Popusti su kumulativni — ako korisnik iskoristi Dan 30 ponudu, Dan 60 se ne salje

---

### Faza 4: Trajno izgubljen korisnik

**Cilj**: Zatvoriti petlju, nauciti iz odlaska, ostati na dobrim uvjetima.

**Akcije**:
- Finalni exit survey (ako nije popunjen ranije) — 3 pitanja maksimum
- Automatski tag u CRM-u: razlog odlaska, plan, Health Score pri odlasku, trajanje pretplate
- Ako je korisnik bio Premium/Pro > 6 mj: Osobni "hvala" e-mail od CSM-a
- Unos u "potential return" segment za buduci godisnji win-back

---

## 5. Strategije prema putnickim segmentima

### 5.1 Business Traveler

**Specifican rizik**: Promjena posla, tvrtka placala, sada placa sam.

**Intervencija**: Naglasak na ROI pracenja troskova, podrska za expense reports (KB-504), ponuda godisnjeg plana s popustom vs. miesecnog.

### 5.2 Family Traveler

**Specifican rizik**: Sezonski korisnik — niska aktivnost zimi ne znaci churn.

**Intervencija**: Aktivirati "Sezonski mod" — smanji zdravstveni score prag za intervenciju za ovu kategoriju. Pokrenuti re-engagement prije ljetne sezone (travanj — svibanj).

### 5.3 Budget Backpacker

**Specifican rizik**: Cijena je primarni odlucujuci faktor.

**Intervencija**: Ranije nuditi popuste, referral program ("pozovi 2 prijatelja = 1 mj besplatno"), naglasiti sto gube u Free tieru (budzet analitika, vise valuta).

### 5.4 Digital Nomad

**Specifican rizik**: Visoki standardi, kompariraju alate, traze napredne znacajke.

**Intervencija**: Prioritetan pristup beta znacajkama, direktni feedback kanal s product timom, smanji odgovor NPS Detractor s 48h na 24h.

### 5.5 Solo Adventurer / Adventure Seeker

**Specifican rizik**: Koristenje u "burst" modelu — aktivni pred putovanje, neaktivni izmedju.

**Intervencija**: Ne tretirati inaktivnost kao churn signal bez konteksta. Pokrenuti re-engagement 4 tjedna prije tipicnog godisnjeg odmora (procjeni iz historijata korisnika).

---

## 6. Retencijske ponude — pravila i limiti

### 6.1 Dostupne ponude

| Vrsta ponude | Vrijednost | Uvjet za ponudu | Max puta po korisniku |
|--------------|-----------|-----------------|----------------------|
| Pauziranje plana | Privremeno zaustavljanje naplate | Korisnik pokrenuo otkaz | 1x godisnje |
| Popust 1 mj | 30% | Health Score < 40, Premium/Pro | 1x sveukupno |
| Popust 3 mj | 25% | Win-back dan 14 | 1x sveukupno |
| Popust 3 mj | 30% | Win-back dan 30 | 1x sveukupno |
| Besplatni Premium 14 dana | Ekstenzija trialnog perioda | Free korisnik 21+ dana bez konverzije | 1x sveukupno |
| Godisnji plan popust | 20% vs. miesecni | Upsell u save flow | 1x godisnje |

### 6.2 Pravila davanja popusta

- Popuste NIKAD ne nuditi kao prvu poruku — najprije razumjeti uzrok
- Korisnici koji su vec dobili popust ne dobivaju isti popust ponovo unutar 12 mj
- Pro korisnici imaju prednost u save ponudama (visi LTV)
- Popusti se procesiraju kroz App Store promotional codes ili Stripe coupon (ovisno o kanalu kupnje)

---

## 7. Onboarding re-engagement

Korisnici koji nisu zavrsili onboarding (referenca: /docs/support/onboarding.md) imaju poseban re-engagement put:

**Trigger**: Dan 7 od registracije, onboarding_complete = false

**Sekvenca**:

| Dan | Akcija | Kanal |
|-----|--------|-------|
| 7 | "Gdje si stao/stala?" — podsjetnik s nastavak tockom | In-app |
| 10 | E-mail s kratkim "5 minutni setup" videom | E-mail |
| 14 | Push "Dodaj svoje prvo putovanje — traje 30 sekundi" | Push |
| 21 | CSM personalizirani e-mail (samo Free koji su se prijavljali < 3 puta) | E-mail |

**Mjerenje uspjeha**: onboarding_complete rate > 60% unutar prvih 21 dana.

---

## 8. KPI-ji i mjerenje uspjeha playboka

| KPI | Cilj | Mjerenje |
|-----|------|----------|
| Monthly Churn Rate (Premium) | < 3% | Miesecno |
| Monthly Churn Rate (Pro) | < 2% | Miesecno |
| Save Rate (korisnici u Faza 3) | > 25% | Po kampanji |
| Win-back Rate (otkazani 30 dana) | > 10% | Miesecno |
| Re-engagement Rate (neaktivni 14d) | > 20% | Tjedni |
| Cancellation Flow Pause Rate | > 15% odabere pauzu umjesto otkaza | Miesecno |
| NPS Detractor Recovery | > 30% postaju Passive unutar 30 dana | Kvartalno |

---

## 9. Alati i integracije

| Alat | Namjena |
|------|---------|
| AgentDB / Health Score model | Izvor podataka za triggere |
| Klaviyo (ili SendGrid) | E-mail sekvence i personalizacija |
| Expo Push API | In-app i push notifikacije |
| Calendly | Booking 1:1 onboarding/save poziva (Pro) |
| App Store Connect | Webhooks za otkaz i obnovu pretplate |
| Slack #csm-alerts | Interni alertovi za manual intervencije |
| Notion / Linear | Praćenje manual intervencija i outcomes |

---

## 10. Odgovornosti i eskalacija

| Situacija | Odgovorna osoba | Rok |
|-----------|-----------------|-----|
| Automatizirani e-mail/push sekvence | CSM Agent (konfiguracija) | Setup jednom, monitoring tjedni |
| Pro korisnik u Kriticnom segmentu | CSM manual outreach | 48h od triggera |
| NPS Detractor | CSM personal response | 48h od odgovora |
| Otkaz Pro korisnika > 6 mj trajanja | CSM + CEO informiran | Odmah |
| Churn Rate premasen ciljeve | CSM + CPO hitni sastanak | Tjedni pregled |

---

**Napomena**: Ovaj playbook revizija se vrsi kvartalno ili nakon znacajnih promjena u produktu ili cjenovnom modelu.
**Sljedeca planirana revizija**: 2026-07-01
