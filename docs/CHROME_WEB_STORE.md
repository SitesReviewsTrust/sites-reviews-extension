# Chrome Web Store — Submission Listing (v1.1.0)

Всё ниже отражает шипнутую версию **1.1.0**: публичный API без ключа, без страницы настроек, права `tabs` + `activeTab` + host `sites.reviews`.

## Store listing

### Name (≤45 chars)
`Sites.Reviews — Trust Score of any site`

### Summary (≤132 chars)
`See any website's Trust Score as you browse — based on real user reviews from the Sites.Reviews catalog. Free, no sign-up.`

### Category
`Productivity` (альтернатива — `Tools`).

### Language
Primary: English. Также можно добавить русскую локализацию листинга.

### Description
```
Sites.Reviews shows you how trustworthy a website is — right as you browse.

⭐ WHAT IT DOES
• A colored Trust Score badge on the toolbar icon for the site you're on
• Green (≥7.5) = high trust, yellow = mixed, red (<4) = poor
• Click for details: review count, average rating, and a link to the full profile
• Not in the catalog yet? One click to add the site and leave the first review

🔍 WHERE THE DATA COMES FROM
The Sites.Reviews catalog — thousands of businesses and websites with real user reviews and trust ratings.

🔐 PRIVACY
• Only the hostname of the active tab is sent, to look up its score
• No API key, no account, no setup — it just works
• No tracking, no cookies, no page content, no full URLs
• Manifest V3, minimal permissions, fully open source

🌐 LINKS
• Website: https://sites.reviews
• Source code: https://github.com/SitesReviewsTrust/sites-reviews-extension
• Public API: https://sites.reviews/api
```

## Privacy practices tab (mandatory)

### Single purpose
The single purpose of this extension is to show the Trust Score and review summary of the website the user is currently visiting, using public data from Sites.Reviews.

### Permission justifications
- `tabs` — read the active tab's URL to extract its hostname and show that site's Trust Score badge.
- `activeTab` — read the current tab on user interaction (opening the popup).
- `host_permissions: https://sites.reviews/*` — send the hostname to the public Sites.Reviews API over HTTPS to fetch the score.

### Data usage disclosures
- Data collected: **Web history** — only the *hostname* of the active tab (e.g. `example.com`), sent to our public API to look up its score. No full URLs, no page content.
- **Not** collected: personally identifiable info, health, financial, authentication, personal communications, location, user activity, website content.
- Certifications: data is **not** sold to third parties; **not** used or transferred for purposes unrelated to the single purpose; **not** used to determine creditworthiness or for lending.

### Privacy policy URL
`https://sites.reviews/privacy-policy` (contains a dedicated "Browser Extension" section).

## Assets
- Icon 128×128 — `branding/store-icon-128.png`
- Small promo tile 440×280 — `branding/promo-tile-440x280.png`
- Marquee 1400×560 (optional) — `branding/promo-marquee-1400x560.png`
- Screenshots 1280×800 — **capture from the running extension (real UI, min 1, max 5)**

## Submission checklist
- [ ] Developer account (chrome.google.com/webstore/devconsole, $5 one-time) with verified contact email
- [ ] Upload `sites-reviews-extension-v1.1.0.zip` (run `./build.sh`)
- [ ] Fill store listing (name, summary, description, category)
- [ ] Fill Privacy practices tab (single purpose, permission justifications, data disclosures, policy URL)
- [ ] Add icon + promo tile + 1–5 screenshots 1280×800
- [ ] Submit for review (typically 1–3 days)

> After Chrome: the same ZIP works for Edge Add-ons and Opera; Firefox AMO uses the same build (see `build.sh`).
