# Pricing Model — Travel Checker

**Datum:** 2026-03-27
**Agent:** CSO (Sales Agent)
**Input:** CFO analiza (unit economics, freemium model preporuka), Market Research (competitor pricing, subscription fatigue)

---

## 1. Strateško pozicioniranje cijena

### Filozofija

Koristimo **Value-Based Freemium** pristup — cijena je postavljena temeljem percipirane vrijednosti, ne troška isporuke. Naš trošak po korisniku je ~0.02 €/mj, ali vrijednost za premium korisnika je višestruko viša.

Tri ključna principa:
1. **Freemium brana je niska** — Free tier mora biti genuinely koristan, ne zasjeka. Korisnik koji MOŽE koristiti app besplatno je korisnik koji ce OSTATI i konvertirati
2. **Plus tier je "sweet spot"** — Pokriti 80% potreba najbrojnijeg segmenta (casual traveler, 3-6 putovanja godišnje) po cijeni koja ne zahtijeva razmišljanje
3. **Pro tier je za power usere** — Digital nomadi, travel blogeri, obitelji koje aktivno koriste app. Nema price resistance jer value je jasan

### Psihologija cijena

- **2.99 € vs 3.00 €** — "ispod 3 eura" threshold smanjuje otpor
- **Godišnja ušteda = 40%** — dovoljno značajno da motivira godišnje plaćanje (bolji LTV)
- **"Kava tjedno"** framing za Plus tier — 0.75 €/tjedan je trivialno za putnika koji troši 500 €+ na putovanje
- **Pro na godišnjoj bazi = 33 €/god** — manje od jednog prosječnog večernjeg izlaska na destinaciji
- **Anchoring**: Pro tier čini Plus tier izgledati razumno, a Plus čini Free ograničenim

---

## 2. Tier Definicija

### Free Tier — "Explorer"

**Cijena:** 0 € za uvijek

**Ciljani korisnik:** Casual korisnik koji isprobava app, studenti, korisnici s manje od 3 putovanja godišnje

**Uključuje:**
- Do **5 tripova** u libraryju
- Do **5 slika** po tripu (ukupno max 25 slika)
- Interaktivna karta s pin-ovima za sve tripove
- Osnovna statistika (broj zemalja, kontinenata, gradova)
- Javni profil i dijeljenje na social media
- Pregled i komentari na javnim putovanjima drugih korisnika
- Praćenje (follow) drugih korisnika
- Budget unos po kategorijama (vidljiv samo korisniku)
- Ads u feedu (native format, tasteful — max 1 ad na 5 postova)
- App Store rating: prikazuje prompt nakon 3. dodijeljena putuanja

**Ograničenja (namjerno vidljiva):**
- Ne može pratiti više od 5 tripova (6. trip zahtijeva upgrade)
- Nema export karte kao HD sliku
- Nema napredne statistike (prosjeci, trendovi, usporedbe)
- Nema advanced filtering u discovery
- Nema batch upload slika
- Nema prioritetne podrške

**Rationale:** 5 tripova je dovoljno za 1-1.5 godinu casual putnika. Korisnik koji putuje 3x godišnje dosegne limit za 2 godine — do tada je app postala navika i konverzija je prirodna.

---

### Plus Tier — "Traveler"

**Cijena:**
- Mjesečno: **2.99 €/mj**
- Godišnje: **21.99 €/god** (~1.83 €/mj, **ušteda 39%**)

**Ciljani korisnik:** Ana persona — 25-38 godina, 3-6 putovanja godišnje, želi kompletni travel journal bez ograničenja

**Sve iz Free tiera, plus:**
- **Unlimited tripovi** bez ograničenja
- **Do 20 slika** po tripu (ukupno praktično neograničeno)
- **Bez reklama** — čisto iskustvo
- **HD export karte** — visoka rezolucija za printanje ili dijeljenje
- **Napredna statistika:**
  - Ukupna potrošnja kroz sva putovanja
  - Prosječni trošak po kategoriji (smještaj, hrana, transport)
  - Usporedba troškova po destinaciji/zemlji
  - Najpopularnije sezone za putovanje
  - Ukupni kilometri putovani (procjena)
- **Batch upload slika** — odaberi više odjednom
- **Trip templates** — kopiraj strukturu prethodnog putovanja za novi
- **Email podrška** s odgovorom u 48h

**Rationale:** Cijena ispod psihološke granice od 3 €/mj. Godišnja opcija (21.99 €) je jednaka cijeni jednog ručka na odmoru — trivijalno za segmet koji troši 500-2000 €/putovanje.

---

### Pro Tier — "Nomad"

**Cijena:**
- Mjesečno: **5.99 €/mj**
- Godišnje: **39.99 €/god** (~3.33 €/mj, **ušteda 44%**)

**Ciljani korisnik:** Marko persona — digital nomad, travel blogger, power user koji koristi app kao primarni travel hub

**Sve iz Plus tiera, plus:**
- **Unlimited slike** po tripu (bez 20-slika limita)
- **Trip grupe / Collections** — organiziraj tripove u kolekcije (npr. "Southeast Asia Tour 2025", "Europske metropole")
- **Privatne grupe dijeljenja** — podijeli putovanje sa specifičnom grupom (obitelj, prijatelji) bez javne objave
- **Budget insights dashboard** — detaljna analiza potrošnje s grafovima, trend linijama, prediktivnim modelom ("Na sličnim destinacijama prosječni korisnik troši X")
- **CSV/PDF export** putnih dnevnika i budgeta (za nomade koji trebaju expense reports)
- **Accommodation tracker** — integrirani praćač bookinga (link + datumi check-in/out + cijena)
- **Custom karta stilovi** — odabir vizualnog stila karte (terrain, satellite, minimal, dark)
- **Beta pristup** novim featureima prije svih
- **Priority podrška** s odgovorom u 24h (radnim danom)
- **Icloud backup** — automatski backup svih podataka
- Nema ads (inherit od Plus)

**Rationale:** 5.99 €/mj je manje od jedne kave na destinaciji. Za digital nomada koji za putovanja troši 2000-5000 €/mj, ova cijena je zanemariva. Godišnja opcija (39.99 €) odgovara cjeniku osnovne alate u nomadskom stacku.

---

## 3. Feature Matrica po Tieru

| Feature | Free (Explorer) | Plus (Traveler) | Pro (Nomad) |
|---------|:--------------:|:---------------:|:-----------:|
| **Broj tripova** | Max 5 | Unlimited | Unlimited |
| **Slike po tripu** | Max 5 | Max 20 | Unlimited |
| **Interaktivna karta** | ✅ | ✅ | ✅ |
| **Budget unos** | ✅ | ✅ | ✅ |
| **Social (follow, komentari)** | ✅ | ✅ | ✅ |
| **Javni profil** | ✅ | ✅ | ✅ |
| **Dijeljenje na social media** | ✅ | ✅ | ✅ |
| **Osnovna statistika** | ✅ | ✅ | ✅ |
| **Bez reklama** | ❌ | ✅ | ✅ |
| **Unlimited tripovi** | ❌ | ✅ | ✅ |
| **HD export karte** | ❌ | ✅ | ✅ |
| **Napredna statistika** | ❌ | ✅ | ✅ |
| **Batch upload slika** | ❌ | ✅ | ✅ |
| **Trip templates** | ❌ | ✅ | ✅ |
| **Unlimited slike po tripu** | ❌ | ❌ | ✅ |
| **Trip grupe / Collections** | ❌ | ❌ | ✅ |
| **Privatne grupe dijeljenja** | ❌ | ❌ | ✅ |
| **Budget insights dashboard** | ❌ | ❌ | ✅ |
| **CSV/PDF export** | ❌ | ❌ | ✅ |
| **Accommodation tracker** | ❌ | ❌ | ✅ |
| **Custom karta stilovi** | ❌ | ❌ | ✅ |
| **Beta pristup** | ❌ | ❌ | ✅ |
| **Podrška** | Community | Email 48h | Priority 24h |

---

## 4. Usporedba s Konkurencijom

| Produkt | Free | Paid (mj) | Paid (god) | Fokus |
|---------|------|-----------|------------|-------|
| **Travel Checker Plus** | Da | 2.99 € | 21.99 € | Karta + social + budget |
| **Travel Checker Pro** | Da | 5.99 € | 39.99 € | Power user + nomad |
| Polarsteps Pro | Da | - | 29.99 € | GPS tracking |
| Visited Pro | Da | - | 4.99 € | Scratch map |
| TripIt Pro | Da | ~4.08 € | 49 USD | Business travel |
| Wanderlog Pro | Da | 4.49 € | - | Trip planning |
| Been Premium | Da | - | 2.99 € | Minimalist map |

### Pozicioniranje

- **vs Polarsteps** (29.99 €/god): Travel Checker Plus je 24% jeftiniji (21.99 € vs 29.99 €) i nudi više featurea (budget tracking, napredna statistika, bez GPS lock-in)
- **vs TripIt** (49 USD/god): Travel Checker je 55% jeftiniji za leisure putnika, plus nudi kartu i social što TripIt nema
- **vs Wanderlog** (4.49 €/mj): Travel Checker Plus je 39% jeftiniji mjesečno (2.99 € vs 4.49 €) s eksplicitnim budget trackingom koji Wanderlog ne nudi
- **Sweet spot**: Cijenom smo između Visited (najjeftiniji) i TripIt (najskuplji), s najširim feature setom u kategoriji

---

## 5. Freemium Conversion Targets

### Funnel ciljevi

| Faza | Cilj | Metrika | Target |
|------|------|---------|--------|
| Instalacija → Registracija | Onboarding | Conv. rate | > 65% |
| Registracija → 1. trip | Aktivacija | Conv. rate | > 70% |
| 1. trip → 5. trip | Engagement | Time to limit | < 4 mj |
| Free → Plus/Pro | Konverzija | Conv. rate | **5% (cilj Y1)** |
| Plus → Pro | Upsell | Conv. rate | 15% Plus korisnika |
| Godišnje vs Mjesečno | Plan mix | % godišnjih | > 60% |

### Konverzija triggers (kada nuditi upgrade)

1. **Limit trigger**: Kad korisnik pokuša dodati 6. trip → paywall s jasnom porukom + "Vidiš koliko si postigao — nastavi" CTA
2. **Stats trigger**: Nakon 3. tripa, prikaži "locked" naprednu statistiku s preview-om podataka
3. **Export trigger**: Kad korisnik klikne "Podijeli kartu" → HD export je locked za Plus
4. **Social trigger**: Kad korisnik dobije prvi komentar na trip → "Tvoj sadržaj je popularan — otključaj sve alate"
5. **Anniversary trigger**: Push notifikacija na godišnjicu registracije s "Ovo si postigao — podrži daljnji put"

### Konverzija model (12 mj, realistični scenarij)

| Mj | MAU | Free | Plus | Pro | MRR |
|----|-----|------|------|-----|-----|
| 3 | 5.000 | 4.750 | 200 | 50 | 898 € |
| 6 | 14.000 | 13.020 | 770 | 210 | 3.561 € |
| 9 | 22.000 | 20.240 | 1.320 | 440 | 6.579 € |
| 12 | 30.000 | 27.300 | 1.950 | 750 | 10.331 € |

Pretpostavke: 5% ukupna konverzija (Free → paid), od plaćajućih 72% Plus / 28% Pro, 60% na godišnjem planu.

---

## 6. Revenue Projekcija — 12 Mjeseci

### Prihodi po izvoru

| Izvor | Mj 6 | Mj 9 | Mj 12 | Y1 ukupno |
|-------|------|------|-------|-----------|
| Plus (mjesečni pretplatnici) | 770 € | 1.188 € | 1.482 € | ~9.800 € |
| Plus (godišnji pretplatnici, amortiz.) | 1.155 € | 1.782 € | 2.223 € | ~14.700 € |
| Pro (mjesečni pretplatnici) | 503 € | 1.054 € | 1.797 € | ~8.400 € |
| Pro (godišnji pretplatnici, amortiz.) | 753 € | 1.581 € | 2.695 € | ~12.600 € |
| Ad revenue (Free tier) | 195 € | 308 € | 420 € | ~2.500 € |
| **UKUPNI MRR** | **3.376 €** | **5.913 €** | **8.617 €** | **~48.000 €** |

Napomena: Godišnji pretplatnici su amortizirati na 12 mj za MRR prikaz. Stvarni cash inflow u momentu plaćanja je viši.

### Scenariji Y1 ukupni prihod

| Scenarij | MAU (mj 12) | Konverzija | Ukupni Y1 prihod |
|----------|------------|------------|------------------|
| Pesimistično | 10.000 | 3% | ~14.000 € |
| **Realistično** | **30.000** | **5%** | **~48.000 €** |
| Optimistično | 60.000 | 7% | ~145.000 € |

---

## 7. Pricing Psychology — Detaljno Obrazloženje

### Zašto 2.99 € (ne 2.50 € ili 3.49 €)?

- **2.99 €** je standardni App Store pricing tier — poznato korisnicima, bez friction
- **Ispod 3 €** je psihološki "besplatno za mene" za ciljni demografski segment (prihod 40-80K €/god)
- **2.50 €** bi izgledalo "jeftino" i umanjilo percipiranu vrijednost
- **3.49 €** je iznad psihološke granice bez razloga

### Zašto 5.99 € (ne 4.99 € ili 6.99 €)?

- **4.99 €** je Wanderlog cijena — ne želimo biti percipirani kao "isti"
- **5.99 €** je "premium ali pristupačno" — jasno odvojeno od Plus
- **6.99 €** testiramo u A/B testu u Q3 (kad imamo traction)
- Gap od 3 € između tiera (2.99 → 5.99) je dovoljno velik da Pro izgleda kao ozbiljan upgrade

### Zašto godišnja ušteda 39-44%?

- Industrijna norma je 20-30% — mi nudimo više da potaknemo dugoročnu commitment
- **LTV korisnika na godišnjem planu** je 2.5x viši od mjesečnog (manje churn, više cash upfront)
- **21.99 €/god za Plus** je "jednako večeri van" — trivialna odluka za traveler koji troši 500 €/putovanje
- **39.99 €/god za Pro** je emotivno sidro — "manje od jednog hotela u godini za sve moje putovane zauvijek"
