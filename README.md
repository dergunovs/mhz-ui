# mhz-ui + mhz-helpers

Библиотека UI компонентов (mhz-ui) и набор хелперов (mhz-helpers) для Vue. Для работы с приложениями на Vue 3 и Vue Router. Поддерживается русский и английский язык. Линтинг, проверка типов и юнит-тесты в комплекте.

**Storybook:** https://ui.9000mhz.ru

**Полный обзор:** https://deepwiki.com/dergunovs/mhz-ui или https://zread.ai/dergunovs/mhz-ui

**Примеры использования в приложениях:** https://github.com/dergunovs/fit и https://github.com/dergunovs/mhz

## Установка для использования

Если нужны только хелперы, например, для бэкенда, то mhz-ui можно не устанавливать.

1. `npm install mhz-ui mhz-helpers` - установите пакеты
2. `import { UiButton } from 'mhz-ui'` - пример импорта ui компонента
3. `import { removeDataTest } from 'mhz-helpers'` - пример импорта хелпера

## Установка для разработки

1. Установите Node.js 25
2. `npm install` - установите зависимости
3. `npm run build` - билд хелперов, библиотеки UI компонентов и сторибука
4. `npm run dev` - запуск дев режима со сторибуком на 6006 порте
