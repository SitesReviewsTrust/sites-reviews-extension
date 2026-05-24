# Architecture

## Overview

Manifest V3 extension с тремя компонентами: **service worker** (background), **popup** (UI при клике на иконку) и **options page** (настройки).

```
┌─────────────────────────────────────────────────────────────────┐
│                      Browser (Chrome/Firefox)                   │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │  Active tab      │    │  Extension icon  │                   │
│  │  (любой сайт)    │───▶│  с бейджем       │                   │
│  └──────────────────┘    └────────┬─────────┘                   │
│                                   │                             │
│  ┌────────────────────────────────▼─────────────────────────┐   │
│  │  background.js  (service worker, MV3)                    │   │
│  │                                                          │   │
│  │  chrome.tabs.onActivated → updateTab(tabId, url)         │   │
│  │  chrome.tabs.onUpdated   → updateTab(tabId, url)         │   │
│  │                                                          │   │
│  │  → domain = hostname(url).replace(/^www\./, '')          │   │
│  │  → cache.get(domain) || fetch /api/v1/check?domain=...   │   │
│  │  → setBadgeText + setBadgeBackgroundColor                │   │
│  └─────────────────────────────────┬────────────────────────┘   │
│                                    │                            │
│       ┌─────── click on icon ──────┘                            │
│       ▼                                                         │
│  ┌──────────────┐         ┌────────────────────┐                │
│  │  popup.html  │────────▶│  options.html      │                │
│  │  + popup.js  │  open   │  + options.js      │                │
│  │  + popup.css │  opts   │  (API key input)   │                │
│  └──────────────┘         └────────────────────┘                │
│                                                                 │
└────────────────────────────────────┬────────────────────────────┘
                                     │
                              HTTPS │ X-API-Key: sr_...
                                     ▼
                  ┌──────────────────────────────────┐
                  │  https://sites.reviews/api/v1/   │
                  │                                  │
                  │  • /check?domain=X               │
                  │  • /search?q=Y                   │
                  │  • /business/{slug}              │
                  │  • /reviews/{slug}               │
                  │                                  │
                  │  Rate-limited per token          │
                  └──────────────────────────────────┘
```

## Files

| File | Role |
|------|------|
| `manifest.json` | MV3 manifest — permissions, paths, browser_specific_settings |
| `src/background.js` | Service worker, tab listeners, API calls, badge management, in-memory cache |
| `src/popup.html` | UI structure for popup |
| `src/popup.js` | Popup logic: render score card / not-found / no-key fallback |
| `src/popup.css` | Styles for popup (light/dark theme via `@media (prefers-color-scheme)`) |
| `src/options.html` | UI for API key input |
| `src/options.js` | Saves/loads API key from `chrome.storage.sync` |
| `icons/icon-*.png` | Toolbar icons (16/48/128) |
| `icons/icon.svg` | Source SVG for icons (regenerate PNGs via `rsvg-convert` or `magick`) |

## Permissions

```json
"permissions": ["tabs", "activeTab", "storage"],
"host_permissions": ["https://sites.reviews/*"]
```

| Permission | Why |
|-----------|-----|
| `tabs` | Read URL of active tab to extract hostname |
| `activeTab` | Same, but only on user click (fallback for narrower scope) |
| `storage` | Save API key in `chrome.storage.sync` (synced across user's browser instances) |
| `host_permissions: sites.reviews/*` | Make API requests to backend |

## Cache strategy

- **In-memory Map** in service worker
- TTL = **15 minutes** per domain
- Cleared automatically on service worker restart (MV3 SW lifetime ≤ 30s idle)
- Future: persist to `chrome.storage.local` for cross-session cache

## Data flow

1. User opens `example.com`
2. `chrome.tabs.onUpdated` fires
3. SW extracts `example.com` from URL
4. Cache check → miss
5. `fetch('/api/v1/check?domain=example.com', { headers: { 'X-API-Key': apiKey } })`
6. Response: `{ id, name, trust_score, total_reviews, ... }` or `{ found: false }`
7. Cache 15 min, set badge color+text
8. User clicks icon → popup reads cache → renders

## Error states

| Error | Badge | Popup |
|-------|-------|-------|
| No API key | (empty) | "Не задан API-ключ" + link to options |
| HTTP 401 | (empty) | "Invalid API key" |
| HTTP 429 | (empty) | "Rate limit exceeded, retry in N sec" |
| Network error | (empty) | "Network error, try again" |
| Domain not found | (empty) | "Не в каталоге" + button "Добавить" |

## Future improvements

- [ ] Content script with inline tooltip on link hover (`mouseenter` → small badge near cursor)
- [ ] Persistent cache via `chrome.storage.local`
- [ ] EN locale (`_locales/en/messages.json`)
- [ ] WebAuthn for API key (passwordless via passkey)
- [ ] Telemetry opt-in (anonymous, batched, GDPR-compliant)
