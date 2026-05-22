# Sites.Reviews — Trust Score Browser Extension

Показывает Trust Score сайта из каталога [Sites.Reviews](https://sites.reviews) при заходе на любой домен. Badge на иконке расширения. Popup с кнопкой «открыть профиль» / «написать отзыв».

## Возможности

- Бейдж с Trust Score (0–10) на иконке расширения
- Цветовая индикация: зелёный (≥7.5), жёлтый (4–7.5), красный (<4)
- Popup с карточкой сайта и быстрыми действиями
- Кеш на 15 минут per-domain
- Manifest V3, работает в Chrome / Edge / Firefox

## Установка (dev)

1. `chrome://extensions` → включить **Developer mode**
2. **Load unpacked** → выбрать папку этого репо
3. `chrome://extensions/?options=<id>` → вставить API-ключ от sites.reviews

## API-ключ

Расширение использует Public API на `https://sites.reviews/api/v1/check`. Ключ выдаётся через:

```bash
docker exec trustbob-app-1 php artisan api:token generate --name="extension" --rate-limit=120
```

## Architecture

- `manifest.json` — MV3
- `src/background.js` — service worker, отслеживает `tabs.onUpdated`, дёргает API, ставит badge
- `src/popup.html|js|css` — UI при клике на иконку
- `src/options.html|js` — настройки (API-ключ)

## Roadmap

- Опционально content-script с tooltip on hover на ссылках
- Локальный кеш в `chrome.storage.local` (вне сессии)
- i18n EN
- Публикация в Chrome Web Store / Firefox Add-ons (после первого QA)
