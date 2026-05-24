# Chrome Web Store — Submission Listing

## Поля для CWS submission

### Name (45 chars)
`Sites.Reviews — Trust Score любого сайта`

### Summary (132 chars)
`Узнайте Trust Score любого сайта при заходе. База из тысяч проверенных бизнесов с реальными отзывами от Sites.Reviews.`

### Single Purpose
The single purpose of this extension is to display the Trust Score and review summary of the website the user is currently visiting, based on data from sites.reviews.

### Permission justifications
- `tabs` — read active tab URL to extract domain
- `activeTab` — read URL on user click
- `storage` — save API key in sync storage
- `host_permissions: https://sites.reviews/*` — query Sites.Reviews API

### Privacy Policy
https://sites.reviews/privacy (требуется добавить секцию про extension — см. ниже)

### Privacy section to add to /privacy page:
```
## Browser Extension
Sites.Reviews Browser Extension collects:
- The hostname of the active tab (to query our public API).
- API key stored in sync storage by the user.

We do NOT collect: full URLs, page content, cookies, history, PII, analytics.
Data sent only to https://sites.reviews/api/v1/check via HTTPS.
```

### Description (16,000 chars max)
```
Sites.Reviews — расширение для безопасного интернета. При заходе на любой сайт показывает Trust Score (от 0 до 10) на основе реальных отзывов.

⭐ ЧТО ДЕЛАЕТ
• Бейдж с оценкой на иконке — мгновенно видно, надёжный ли сайт
• Зелёный (≥7.5) — высокое доверие, жёлтый — средне, красный (<4) — негатив
• Клик → карточка с количеством отзывов, рейтингом, ссылкой на профиль

🔍 ОТКУДА ДАННЫЕ
База Sites.Reviews с 2008 года — тысячи проверенных российских и международных сайтов с AI-сводками плюсов/минусов и проверкой безопасности домена.

🔐 ПРИВАТНОСТЬ
• Только домен текущей вкладки (без URL/cookie/контента)
• Никакого трекинга
• Manifest V3, открытый исходный код

⚡ КАК НАЧАТЬ
1. Установите расширение
2. Откройте Options → вставьте API-ключ от sites.reviews
3. Открывайте сайты — Trust Score появится автоматически

API-ключ выдаётся бесплатно: api@sites.reviews

🌐 ССЫЛКИ
• Сайт: https://sites.reviews
• Исходники: github.com/DeFiTON/sites-reviews-extension
• API docs: sites.reviews/api
```

## Submission checklist
- [ ] Developer account на chrome.google.com/webstore/devconsole ($5 одноразово)
- [ ] 5 screenshots 1280x800
- [ ] Promo tile 440x280
- [ ] Загрузить sites-reviews-extension-v1.0.0.zip
- [ ] Заполнить поля выше
- [ ] Submit for review (1-7 дней)
