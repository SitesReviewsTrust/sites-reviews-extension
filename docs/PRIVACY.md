# Privacy Policy — Sites.Reviews Browser Extension

**Effective date:** 2026-07-06

## TL;DR

Расширение Sites.Reviews отправляет **только домен текущей вкладки** (например, `example.com`) на наш публичный API для получения Trust Score. Никакого трекинга, аналитики, истории браузера, содержимого страниц или личных данных мы не получаем. Регистрация и ключи не требуются.

## What we collect

1. **Hostname активной вкладки** (например, `example.com`) — отправляется только когда вы открываете/переключаете вкладку, исключительно для запроса оценки сайта в публичном API Sites.Reviews.

Больше ничего. Расширение не хранит никаких ваших данных.

## What we DO NOT collect

- ❌ Full URLs (только hostname, без пути, query, fragment)
- ❌ Page content (HTML, текст, формы)
- ❌ Cookies или сессионные данные сайтов
- ❌ Историю браузера
- ❌ Personally identifiable information (PII)
- ❌ Аналитику или телеметрию
- ❌ Аккаунты, логины, API-ключи

## Where data goes

Расширение делает только один тип сетевого запроса — к публичному read-API без авторизации:

```
GET https://sites.reviews/api/public/v1/check?domain=<HOSTNAME>
```

Сервер Sites.Reviews:
- Применяет обезличенный rate-limit (60 запросов/мин на IP), как любой публичный API
- НЕ связывает запрос с вашей личностью или другими сервисами
- Не передаёт данные третьим сторонам

## Storage

- **In-memory cache** в service worker — последние 15 минут запросов `domain → trust_score` (сбрасывается при перезапуске браузера/воркера). На диск ничего не сохраняется.

## Permissions explanation

| Permission | Why |
|-----------|-----|
| `tabs` | Read hostname of the active tab to look up its Trust Score |
| `activeTab` | Same, restricted to user-initiated actions |
| `host_permissions: https://sites.reviews/*` | Make HTTPS requests to the public Sites.Reviews API |

Расширение **не имеет** permissions:
- `<all_urls>` или `*://*/*` (нет доступа к контенту страниц)
- `webRequest` / `webRequestBlocking` (не модифицирует запросы)
- `storage` (ничего не хранит на устройстве)
- `history`, `bookmarks`, `downloads`, `cookies`

## Open source

Весь код — open source MIT: https://github.com/SitesReviewsTrust/sites-reviews-extension. Любой может проверить, что мы реально делаем.

## Контакт

Вопросы по privacy: privacy@sites.reviews
General support: support@sites.reviews

## Изменения

Все изменения этой политики коммитятся в git с timestamp — смотрите [git history](https://github.com/SitesReviewsTrust/sites-reviews-extension/commits/main/docs/PRIVACY.md).
