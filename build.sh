#!/usr/bin/env bash
# Собирает чистый ZIP для загрузки в стор (Chrome/Edge/Opera/Firefox).
# Chromium и Firefox используют один и тот же билд (manifest содержит gecko-настройки).
set -e
VER=$(node -p "require('./manifest.json').version")
OUT="sites-reviews-extension-v${VER}.zip"
rm -f "../$OUT"
zip -qr "../$OUT" manifest.json src icons -x "icons/icon.svg"
echo "Собрано: ../$OUT"
unzip -l "../$OUT" | tail -3
