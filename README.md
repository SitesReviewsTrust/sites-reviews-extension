<div align="center">

<img src="icons/icon-128.png" width="96" alt="Sites.Reviews"/>

# Sites.Reviews — Trust Score Extension

**Узнайте репутацию любого сайта прямо в браузере.**
Бейдж с Trust Score, отзывы, проверка безопасности — для каждого домена, на который вы заходите.

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![Chrome](https://img.shields.io/badge/Chrome-supported-success?logo=googlechrome)](https://chrome.google.com/webstore/)
[![Firefox](https://img.shields.io/badge/Firefox-supported-success?logo=firefoxbrowser)](https://addons.mozilla.org/)
[![Edge](https://img.shields.io/badge/Edge-supported-success?logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/Tracking-none-brightgreen)](docs/PRIVACY.md)

[Установить](#установка) · [Возможности](#возможности) · [API](https://sites.reviews/api) · [Сайт](https://sites.reviews) · [Wiki](../../wiki)

</div>

---

<p align="center">
  <img src="screenshots/hero.svg" alt="Hero" width="720">
</p>

## ⭐ Возможности

- **Trust Score 0–10** — мгновенная оценка надёжности сайта
- **Цветной бейдж** на иконке расширения: зелёный (≥7.5), жёлтый (4–7.5), красный (<4)
- **Popup с деталями** — количество отзывов, средний рейтинг, ссылки на профиль и форму отзыва
- **8 000+ проверенных бизнесов** — российских и международных
- **AI-сводки** плюсов/минусов из реальных отзывов
- **Проверка безопасности** домена (SSL, blacklist, возраст)
- **Manifest V3** — современный стандарт, лучшая производительность
- **Приватность** — отправляется только домен текущей вкладки, без cookie/контента/трекинга

## 📸 Скриншоты

<table>
<tr>
<td><img src="screenshots/badge.svg" width="320" alt="Badge на иконке расширения"><br><sub>Бейдж на иконке расширения</sub></td>
<td><img src="screenshots/popup-high.svg" width="320" alt="Popup для надёжного сайта"><br><sub>Popup — надёжный сайт</sub></td>
</tr>
<tr>
<td><img src="screenshots/popup-low.svg" width="320" alt="Popup для подозрительного сайта"><br><sub>Popup — подозрительный сайт</sub></td>
<td><img src="screenshots/options.svg" width="320" alt="Страница настроек"><br><sub>Страница настроек</sub></td>
</tr>
</table>

## 🚀 Установка

### Chrome Web Store / Firefox Add-ons / Edge Add-ons
*В процессе модерации — обновим эту секцию когда расширение появится в магазинах.*

### Вручную (developer mode)

#### Chrome / Edge / Brave / Opera
1. Скачайте архив: **[Latest Release](../../releases/latest)**
2. Распакуйте в удобную папку
3. Откройте `chrome://extensions` (или `edge://extensions`)
4. Включите **«Режим разработчика»** в правом верхнем углу
5. Нажмите **«Загрузить распакованное»** и выберите папку
6. Правый клик на иконке → **«Параметры»** → вставьте API-ключ от Sites.Reviews

#### Firefox
1. Скачайте архив, распакуйте
2. Откройте `about:debugging` → **«Этот Firefox»**
3. **«Загрузить временное дополнение»** → выберите `manifest.json`
4. Вставьте API-ключ через значок-меню расширения → **«Параметры»**

### API-ключ
Получить бесплатно: [api@sites.reviews](mailto:api@sites.reviews) или через [Public API форму](https://sites.reviews/api).

## 🏗 Архитектура

```
┌──────────────────────────────┐
│   Active tab                  │  ← пользователь открывает любой сайт
│   URL → hostname              │
└──────────────┬───────────────┘
               │
        background.js (MV3 service worker)
               │
               │  POST /api/v1/check?domain=hostname
               ▼
┌──────────────────────────────┐
│   sites.reviews/api/v1       │  ← Public API с rate-limit per token
│   trust_score, reviews count │
│   pros[], cons[], AI-summary │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────┐    ┌─────────┐
        │  badge  │    │  popup  │
        │  (8.4)  │    │ details │
        └─────────┘    └─────────┘
```

Подробности — [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 🔐 Приватность

- ✅ Отправляется только **hostname** активной вкладки
- ✅ API-ключ хранится в `chrome.storage.sync` (синхронизируется с вашим аккаунтом браузера)
- ❌ Никакого трекинга, аналитики, истории
- ❌ Никаких cookies, контента страницы, full URL

Полная политика: [`docs/PRIVACY.md`](docs/PRIVACY.md).

## 🛠 Разработка

```bash
git clone https://github.com/DeFiTON/sites-reviews-extension.git
cd sites-reviews-extension

# Никаких build steps — Manifest V3 работает с raw ES modules
# Просто загрузите как unpacked extension в Chrome
```

Подробности — [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## 📚 Связанные проекты

- 🌐 **[Sites.Reviews](https://sites.reviews)** — каталог проверенных бизнесов с реальными отзывами
- 📦 **[Public API](https://sites.reviews/api)** — REST API для встраивания в свои проекты
- 🎨 **[Embed Widget](https://sites.reviews/embed-widget)** — виджет Trust Score для вашего сайта
- 🆔 **[Libermall ID](https://id.libermall.com)** — единый SSO для экосистемы Libermall

## 📄 Лицензия

[MIT](LICENSE) © 2026 Sites.Reviews

---

<sub>Сделано с ❤️ командой [Sites.Reviews](https://sites.reviews) — частью экосистемы [Libermall](https://libermall.com).</sub>
