# Development Guide

## Quick start

```bash
git clone https://github.com/SitesReviewsTrust/sites-reviews-extension.git
cd sites-reviews-extension
```

Никаких build steps — Manifest V3 работает с raw ES modules в браузере.

### Chrome / Edge / Brave / Opera

1. Откройте `chrome://extensions`
2. Включите **Developer mode** (правый верхний угол)
3. **Load unpacked** → выберите папку репо
4. Готово, расширение появится в toolbar

### Firefox

1. Откройте `about:debugging`
2. **This Firefox** → **Load Temporary Add-on**
3. Выберите `manifest.json`
4. Расширение загрузится до перезапуска Firefox (Firefox не позволяет постоянно загружать unsigned extensions для not-developer edition)

## Project structure

```
.
├── manifest.json            # MV3 manifest
├── icons/
│   ├── icon-16.png          # Toolbar (small)
│   ├── icon-48.png          # Extension list
│   ├── icon-128.png         # Chrome Web Store
│   └── icon.svg             # Source — regenerate PNGs from this
├── src/
│   ├── background.js        # Service worker — tab listeners, API, badge
│   ├── popup.html           # Popup UI structure
│   ├── popup.js             # Popup logic
│   ├── popup.css            # Popup styles (theme-aware)
│   ├── options.html         # Options page UI
│   └── options.js           # Options logic (API key save/load)
├── docs/                    # Документация
├── screenshots/             # SVG mockups for README/Web Store
└── README.md
```

## Regenerate PNG icons from SVG

```bash
# Через rsvg-convert (brew install librsvg)
for size in 16 48 128; do
  rsvg-convert -w $size -h $size icons/icon.svg -o icons/icon-$size.png
done

# Или через ImageMagick
for size in 16 48 128; do
  magick -background none -resize ${size}x${size} icons/icon.svg icons/icon-$size.png
done
```

## Build zip for Chrome Web Store / Firefox Add-ons

```bash
# Чистый zip без dev-файлов
zip -r sites-reviews-extension-v1.0.0.zip . \
    -x ".git/*" ".github/*" ".gitignore" \
       "docs/*" "screenshots/*" "*.md" "LICENSE"
```

## Testing

Нет автотестов сейчас. Manual smoke checklist:

- [ ] Установка через Load unpacked в Chrome — иконка появилась
- [ ] Опции открываются, API-ключ сохраняется
- [ ] Открыть `https://ozon.ru` → бейдж с числом (зелёный/жёлтый/красный)
- [ ] Клик на иконку → popup с карточкой компании
- [ ] Открыть несуществующий в каталоге сайт → popup "Не в каталоге" + кнопка добавить
- [ ] Удалить API-ключ → popup "Не задан API-ключ" + ссылка на опции
- [ ] То же самое в Firefox через about:debugging
- [ ] Rate-limit: дёрнуть 130 раз за минуту с rate=120 ключом → 429 → popup error

## Coding style

- ES modules
- `'use strict'` everywhere (IIFE wrapping)
- Async/await (не Promise chains)
- Vanilla JS, без зависимостей
- Comments only when WHY is non-obvious

## Submitting to stores

См. [docs/CHROME_WEB_STORE.md](CHROME_WEB_STORE.md) для submission checklist.

## Release process

1. Обновить версию в `manifest.json`
2. Записать изменения в `CHANGELOG.md`
3. `git tag v1.0.X && git push --tags`
4. GitHub Actions автоматически билдит zip и публикует Release
5. Upload zip в Chrome Web Store / Firefox Add-ons
