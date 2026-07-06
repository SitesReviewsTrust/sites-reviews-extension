# Contributing to Sites.Reviews Extension

Спасибо за интерес к проекту! Ниже — как помочь.

## Сообщить о баге

1. Проверьте, что бага ещё нет в [Issues](../../issues)
2. Создайте новый Issue с шаблоном **Bug Report**
3. Приложите:
   - Версию расширения, браузер, ОС
   - Шаги воспроизведения
   - Скриншоты или GIF
   - Console errors (`F12 → Console`)

## Предложить фичу

Используйте шаблон **Feature Request** и опишите:
- Проблему, которую фича решает
- Предполагаемое поведение
- Альтернативы, которые вы рассмотрели

## Pull Request

1. Fork репо
2. `git checkout -b feature/my-feature`
3. Сделайте изменения — следуйте существующему стилю кода
4. `git commit -m "feat: краткое описание"` ([conventional commits](https://www.conventionalcommits.org/ru/))
5. Push → откройте PR в `main`

Перед merge:
- [ ] Локально протестировано в Chrome **и** Firefox
- [ ] Никаких новых permissions без обоснования
- [ ] README/CHANGELOG обновлены если изменилось поведение

## Стиль кода

- ES modules, без транспиляции
- `'use strict'` в каждом файле
- Без `console.log` в production-коде (используйте `console.debug` для dev)
- Async/await > Promise chains
- Никаких внешних зависимостей в runtime (vanilla JS)

## Local development

```bash
git clone https://github.com/SitesReviewsTrust/sites-reviews-extension.git
cd sites-reviews-extension

# Chrome / Edge / Brave
# chrome://extensions → Developer mode → Load unpacked → выберите эту папку

# Firefox
# about:debugging → This Firefox → Load Temporary Add-on → выберите manifest.json

# После изменений — нажмите «Reload» рядом с расширением
```

## Лицензия

Контрибутируя, вы соглашаетесь с тем, что ваш код будет под [MIT](LICENSE).
