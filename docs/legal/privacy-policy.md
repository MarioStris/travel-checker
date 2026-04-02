# Privacy Policy — Travel Checker

**Version:** 1.0
**Effective Date:** 2026-04-02
**Last Reviewed:** 2026-04-02

> NOTICE: This document is a draft prepared for legal review. It does not constitute legal advice and must be reviewed by a qualified attorney before publication.

---

## 1. Introduction

Welcome to Travel Checker ("we," "our," or "us"), a mobile application operated by [COMPANY_NAME]. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use our iOS and Android application ("the App").

By creating an account or using the App, you acknowledge that you have read and understood this Privacy Policy. If you do not agree, please do not use the App.

The App is intended for adults aged 18 and over. We do not knowingly collect personal data from anyone under 18.

---

## 2. Who We Are (Data Controller)

**Controller:** [COMPANY_NAME]
**Contact:** [CONTACT_EMAIL]
**Address:** [COMPANY_ADDRESS]

For EU/EEA users, [COMPANY_NAME] is the data controller under the General Data Protection Regulation (GDPR).

---

## 3. What Personal Data We Collect

### 3.1 Account & Identity Data
- **Email address** — collected at registration via Clerk (our authentication provider)
- **Display name** — the public name shown on your profile
- **Username** — your unique handle within the App
- **Avatar / profile photo** — optional image you choose to upload
- **Traveler category** — the type of traveler you self-identify as (e.g., solo, family, digital nomad)
- **Age range** — optional, self-reported

### 3.2 Trip & Travel Content Data
- **Trip records** — destination names, country codes, dates, descriptions, ratings, trip categories, and season/period
- **Accommodation details** — names and optional booking links (Booking.com, Airbnb) you voluntarily enter
- **Budget data** — amounts you enter for accommodation, food, transport, activities, and other expenses
- **Travel reviews and notes** — text content you write about your trips

### 3.3 Photos
- Photos you upload to trips are stored on **Cloudflare R2** (object storage). We store a reference URL in our database. Photos are accessible via a CDN-delivered URL and are visible to other users when your trip is set to public.

### 3.4 Location Data
- **Trip pin locations** — when you add a trip, you select a destination using our location search. The geographic coordinates and place name are stored as part of the trip record.
- **Google Places Autocomplete** — when you search for a destination, your search query is sent to the Google Places API. This is not stored by us beyond the selected result, but is subject to Google's privacy policy.
- We do **not** collect your real-time device GPS location in the background. Location data is only associated with trips you manually create.

### 3.5 Social Interaction Data
- **Follows** — records of users you follow and users who follow you
- **Likes** — records of trips you have liked
- **Comments** — text content you post on trips

### 3.6 Device & Technical Data
- **Push notification tokens** — to send you notifications about social interactions (likes, follows, comments). Tokens are stored in our database and can be revoked by disabling notifications in your device settings.
- **Device type and OS version** — collected passively by our infrastructure for compatibility purposes

### 3.7 Data We Do Not Collect
- We do **not** use advertising SDKs or sell your data to advertisers.
- We do **not** use behavioral analytics SDKs (e.g., Mixpanel, Amplitude) at this time.
- We do **not** track your location outside the App.

---

## 4. Legal Basis for Processing (GDPR)

For users in the EU/EEA, we rely on the following lawful bases:

| Processing Activity | Legal Basis |
|---|---|
| Creating and managing your account | Contract performance (Art. 6(1)(b)) |
| Storing trips, photos, budget data | Contract performance (Art. 6(1)(b)) |
| Sending push notifications | Consent (Art. 6(1)(a)) |
| Social features (follows, likes, comments) | Contract performance (Art. 6(1)(b)) |
| Fraud prevention and security | Legitimate interests (Art. 6(1)(f)) |
| Compliance with legal obligations | Legal obligation (Art. 6(1)(c)) |

You may withdraw consent for push notifications at any time through your device notification settings.

---

## 5. How We Use Your Data

We use your personal data to:

- Create and maintain your account
- Display your profile and public trips to other users
- Enable you to create, edit, and delete trip records and photos
- Provide the interactive map showing trip pins
- Enable social features (follows, likes, comments, notifications)
- Respond to support requests
- Detect and prevent fraud, abuse, or violations of our Terms of Service
- Comply with applicable legal obligations

We do **not** use your data for automated decision-making or profiling that produces legal or similarly significant effects.

---

## 6. Third-Party Services and Data Sharing

We share personal data with the following third parties only to the extent necessary to operate the App.

### 6.1 Clerk (Authentication)
- **Purpose:** User sign-up, sign-in, session management, and identity verification
- **Data shared:** Email address, name, social login tokens
- **Location:** United States (Clerk, Inc. is a US company; data transfers covered by Standard Contractual Clauses)
- **Privacy Policy:** https://clerk.com/privacy

### 6.2 Cloudflare R2 (Photo Storage)
- **Purpose:** Storing and serving user-uploaded photos via CDN
- **Data shared:** Photo files and their metadata
- **Location:** Cloudflare operates globally; storage region is configurable
- **Privacy Policy:** https://www.cloudflare.com/privacypolicy/

### 6.3 Google Maps Platform / Google Places API
- **Purpose:** Destination search autocomplete and map display
- **Data shared:** Destination search queries and selected location data
- **Location:** United States (Google LLC)
- **Privacy Policy:** https://policies.google.com/privacy

### 6.4 Neon (Database Hosting)
- **Purpose:** PostgreSQL database hosting for all App data
- **Data shared:** All data you create in the App
- **Location:** Neon operates on AWS infrastructure; data resides in the configured region
- **Privacy Policy:** https://neon.tech/privacy-policy

### 6.5 Railway (API Hosting)
- **Purpose:** Hosting and running the App's backend API
- **Data shared:** Application data processed through the API
- **Privacy Policy:** https://railway.app/legal/privacy

### 6.6 Legal Disclosure
We may disclose personal data if required by law, court order, or regulatory authority, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.

### 6.7 Business Transfer
If [COMPANY_NAME] is involved in a merger, acquisition, or asset sale, your personal data may be transferred. We will notify you via email or a prominent in-app notice before your data becomes subject to a different privacy policy.

We do **not** sell your personal data to third parties.

---

## 7. Data Retention

| Data Category | Retention Period |
|---|---|
| Account data (email, name, username) | Until account deletion |
| Trip records and budget data | Until account deletion or manual deletion |
| Photos (Cloudflare R2) | Until photo deletion or account deletion |
| Social data (follows, likes, comments) | Until deletion or account deletion |
| Push notification tokens | Until account deletion or token revocation |
| Backup copies | Up to 30 days after deletion |

When you delete your account via the DELETE /api/users/me endpoint or through the App settings, we initiate deletion of your data from our active database within 7 days. Residual copies in backups are purged within 30 days. Some data may be retained longer if required by applicable law.

---

## 8. Your Rights

### 8.1 Rights for All Users
- **Access:** Request a copy of the personal data we hold about you
- **Correction:** Request correction of inaccurate or incomplete data
- **Deletion:** Request deletion of your account and personal data
- **Data Portability:** Export your data in a structured, machine-readable format

### 8.2 Additional Rights for EU/EEA Users (GDPR)
- **Right to restrict processing:** Request that we limit how we use your data
- **Right to object:** Object to processing based on legitimate interests
- **Right to withdraw consent:** Withdraw consent for push notifications at any time without affecting lawfulness of prior processing
- **Right to lodge a complaint:** You have the right to lodge a complaint with your local supervisory authority. For EU users, you can find your authority at https://edpb.europa.eu/about-edpb/about-edpb/members_en

### 8.3 Rights for California Residents (CCPA)
California residents have the right to:
- Know what personal information we collect, use, disclose, and sell
- Delete personal information we have collected
- Opt out of the sale of personal information (we do not sell personal information)
- Non-discrimination for exercising your rights

To exercise any of these rights, contact us at [CONTACT_EMAIL].

### 8.4 How to Exercise Your Rights (In-App)
- **Export your data:** Use the data export feature at GET /api/users/me/export (accessible from Profile > Settings > Export My Data)
- **Delete your account:** Use the account deletion feature (Profile > Settings > Delete Account), which calls DELETE /api/users/me
- **Update your information:** Edit your profile directly in the App

We will respond to all valid requests within 30 days (EU/EEA: within one month as required by GDPR).

---

## 9. Data Security

We implement the following technical and organisational measures to protect your personal data:

- All data in transit is encrypted using TLS 1.2 or higher
- Database connections use SSL/TLS encryption
- Authentication is handled by Clerk, which maintains SOC 2 Type II certification
- Photos are stored on Cloudflare R2 with access control
- Our API uses Clerk JWT verification for all authenticated endpoints
- Database access is restricted to application service accounts with least-privilege permissions
- Push notification tokens are stored hashed where feasible

No method of transmission over the internet or electronic storage is 100% secure. In the event of a data breach that is likely to result in a high risk to your rights and freedoms, we will notify you and relevant supervisory authorities as required by applicable law.

---

## 10. International Data Transfers

[COMPANY_NAME] is based in [COUNTRY]. Your data may be processed in the United States and other countries where our service providers operate.

For transfers of EU/EEA personal data to third countries, we rely on:
- Standard Contractual Clauses (SCCs) approved by the European Commission
- Adequacy decisions where applicable

By using the App, you acknowledge that your data may be transferred internationally in accordance with this policy.

---

## 11. Cookies and Tracking Technologies

The App is a mobile application and does not use browser cookies. We do not employ tracking pixels or third-party advertising trackers within the App.

Our web-based services (if any) may use session cookies required for authentication. A separate Cookie Policy will be published if and when a web interface is launched.

---

## 12. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we make material changes, we will:

- Update the "Effective Date" at the top of this document
- Notify you via a push notification or prominent in-app notice
- Where required by law, seek your renewed consent

Continued use of the App after the effective date of any changes constitutes acceptance of the updated Privacy Policy.

---

## 13. Contact Us

For any questions, concerns, or to exercise your data rights, please contact:

**[COMPANY_NAME]**
Email: [CONTACT_EMAIL]
Address: [COMPANY_ADDRESS]

We aim to respond to all inquiries within 5 business days and to all formal data rights requests within 30 days.

---

*Travel Checker Privacy Policy — Version 1.0 — Effective 2026-04-02*
*This document must be reviewed by a qualified legal professional before publication.*
