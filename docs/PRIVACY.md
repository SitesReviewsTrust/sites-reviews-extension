# Privacy Policy — Sites.Reviews Browser Extension

**Effective date:** 2026-05-24

## TL;DR

Расширение Sites.Reviews отправляет **только домен текущей вкладки** (например, `example.com`) на наш API для получения Trust Score. Никакого трекинга, аналитики, истории браузера или содержимого страниц мы не получаем.

## What we collect

1. **Hostname активной вкладки** (например, `example.com`) — отправляется только когда вы открываете/переключаете на вкладку, исключительно для запроса оценки сайта в Sites.Reviews API.
2. **Ваш API-ключ** — сохраняется в `chrome.storage.sync` (синхронизируется с вашим аккаунтом браузера, не отправляется никому кроме Sites.Reviews API).

## What we DO NOT collect

- ❌ Full URLs (только hostname, без пути, query, fragment)
- ❌ Page content (HTML, текст, формы)
- ❌ Cookies или сессионные данные сайтов
- ❌ Историю браузера
- ❌ Personally identifiable information (PII)
- ❌ Аналитику или телеметрию
- ❌ IP-адреса (вне rate-limit логирования на API стороне, см. ниже)

## Where data goes

Расширение делает только один тип сетевого запроса:

```
GET https://sites.reviews/api/v1/check?domain=<HOSTNAME>
Headers:
  X-API-Key: <ваш ключ>
```

Сервер Sites.Reviews:
- Логирует request для rate-limit (per API-token, не per-user)
- НЕ связывает request с вашим личностью или другими сервисами
- Не передаёт данные третьим сторонам

## Storage

- `chrome.storage.sync` — API-ключ (зашифрован Chrome на устройстве, синхронизируется через ваш Google-аккаунт если включена sync)
- In-memory cache в service worker — последние 15 минут запросов domain→trust_score (сбрасывается при restart browser/service worker)

## Permissions explanation

| Permission | Why |
|-----------|-----|
| `tabs` | Read URL of active tab to extract hostname |
| `activeTab` | Same, restricted to user-initiated actions |
| `storage` | Save your API key in browser-synced storage |
| `host_permissions: https://sites.reviews/*` | Make HTTPS API requests to Sites.Reviews |

Расширение **не имеет** permissions:
- `<all_urls>` или `*://*/*` (нет доступа к контенту страниц)
- `webRequest` / `webRequestBlocking` (не модифицирует запросы)
- `history`, `bookmarks`, `downloads`, `cookies`

## Open source

Весь код — open source MIT: https://github.com/DeFiTON/sites-reviews-extension. Любой может проверить что мы реально делаем.

## Контакт

Вопросы по privacy: privacy@sites.reviews
General support: support@sites.reviews

## Изменения

Все изменения этой политики коммитятся в git с timestamp — смотрите [git history](https://github.com/DeFiTON/sites-reviews-extension/commits/main/docs/PRIVACY.md).
