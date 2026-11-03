# Vinyl Store — фронтенд

[![CI](https://github.com/lubenkov/vinyl_store_frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/lubenkov/vinyl_store_frontend/actions/workflows/ci.yml)

SPA для REST API [lubenkov/vinyl_store](https://github.com/lubenkov/vinyl_store):
каталог пластинок, карточка релиза с отзывами, авторизация, профиль, покупка через
Stripe и админ-панель.

## Стек

| Слой    | Что используется                       |
| ------- | -------------------------------------- |
| Сборка  | Vite 5 + TypeScript                    |
| UI      | React 18, Tailwind CSS 3, lucide-react |
| Роутинг | React Router 7                         |
| Данные  | TanStack Query 5, `fetch`              |
| Линт    | ESLint 9 + typescript-eslint           |

## Быстрый старт

1. Запустите бэкенд из репозитория `vinyl_store` на `http://localhost:3000`
   (MySQL, миграции, `.env` — см. README бэкенда).
2. Установите зависимости фронтенда и запустите dev-сервер:

```bash
npm install
npm run dev
```

3. Откройте `http://localhost:5173`.

Vite проксирует `/api/*` на `http://localhost:3000`, сохраняя префикс
(`/api/vinyls` → `http://localhost:3000/api/vinyls`). Бэкенд сам монтирует все
роуты под `/api`, а префикс заодно не даёт прокси перехватывать SPA-маршрут
`/vinyls/:id`.

### Другой адрес API

Создайте `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

При заданном `VITE_API_URL` запросы идут напрямую на бэкенд (CORS в нём включён
по списку origin'ов из `CORS_ORIGINS`/`FRONTEND_URL`). Для продакшена укажите
полный адрес API вместе с `/api`, например
`https://vinyl-store-api.vercel.app/api`. Переменная встраивается в сборку, поэтому
после изменения нужен новый деплой.

### Вход через Google

Кнопка «Продолжить с Google» ведёт на `GET /api/auth/google` бэкенда. После
авторизации бэкенд возвращает JWT на `/auth/google/callback` фронтенда, а SPA
сохраняет токен и очищает адресную строку.

На бэкенде задайте `FRONTEND_URL` (origin фронтенда, по умолчанию
`http://localhost:5173`) и добавьте `GOOGLE_CALLBACK_URL` в список разрешённых
redirect URI в Google Console. Локально это
`http://localhost:3000/api/auth/google/callback`, на Vercel —
`https://<backend>.vercel.app/api/auth/google/callback`.

### Права администратора

Регистрация через `/auth/register` всегда создаёт роль `user`. Чтобы открыть
`/admin`, повысьте пользователя в MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

После этого перезайдите в аккаунт.

## Скрипты

| Команда             | Что делает                                   |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev-сервер Vite на :5173                     |
| `npm run build`     | Проверка типов + production-сборка в `dist/` |
| `npm run preview`   | Локальный просмотр собранной версии          |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm run lint`      | ESLint по проекту                            |
| `npm run test`      | Vitest: юнит-тесты форматтеров и API-клиента |

## Маршруты

| Путь                    | Доступ   | Что внутри                                                            |
| ----------------------- | -------- | --------------------------------------------------------------------- |
| `/`                     | публично | Каталог: поиск, сортировка, пагинация                                 |
| `/vinyls/:id`           | публично | Карточка пластинки, отзывы, покупка                                   |
| `/login`, `/register`   | публично | Вход по email/паролю или Google, регистрация                          |
| `/auth/google/callback` | публично | Приём JWT после Google OAuth                                          |
| `/profile`              | JWT      | Профиль, редактирование, история покупок и отзывов, удаление аккаунта |
| `/admin/vinyls`         | admin    | CRUD пластинок                                                        |
| `/admin/discogs`        | admin    | Поиск релиза по ID и импорт в каталог                                 |
| `/admin/telegram`       | admin    | Отправка карточки в Telegram                                          |
| `/admin/logs`           | admin    | Журнал действий                                                       |

## Работа с API

Типы и вызовы собраны в `src/types/api.ts` и `src/lib/api.ts` по реальным
контроллерам и DTO бэкенда. Все пути ниже указаны без общего префикса `/api`.

| Возможность | Эндпоинты                                                                         |
| ----------- | --------------------------------------------------------------------------------- |
| Авторизация | `POST /auth/register`, `POST /auth/login` → `{ accessToken }`, `GET /auth/google` |
| Профиль     | `GET/PUT/DELETE /users/profile`                                                   |
| Каталог     | `GET /vinyls?limit&offset&sortBy&order&searchBy&searchTerm` → `{ rows, count }`   |
| Пластинка   | `GET /vinyls/:id`, `POST/PUT/DELETE /vinyls[/:id]`                                |
| Отзывы      | `GET/POST /vinyls/:id/reviews`, `DELETE /reviews/:id`                             |
| Покупка     | `POST /purchases` (`vinylId`, `currency: 'usd'`)                                  |
| Discogs     | `GET /discogs/vinyls/:id/scores`, `POST /discogs/vinyls/:id`                      |
| Telegram    | `POST /telegram/sendVinyl`                                                        |
| Логи        | `GET /logs`                                                                       |

JWT хранится в `localStorage` и отправляется заголовком `Authorization: Bearer …`.
При ответе 401 токен сбрасывается, пользователь возвращается на `/login`.

## Ограничения бэкенда, учтённые в UI

1. **Stripe.** `POST /purchases` создаёт PaymentIntent, но не возвращает
   `client_secret`, поэтому Stripe Elements на фронтенде не подключён. Модальное
   окно показывает созданный заказ и его статус. Создание заказа и запись в
   историю покупок при этом работают.
2. **Пагинация отзывов.** `GET /vinyls/:id/reviews` возвращает только массив без
   общего количества, поэтому кнопка «Дальше» активна, пока страница заполнена
   целиком.
3. **Импорт Discogs** требует `DISCOGS_KEY`/`DISCOGS_SECRET`, Telegram —
   `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` в `.env` бэкенда.
4. **Цена** в БД хранится как `DECIMAL`, поэтому приходит строкой; в UI она
   приводится к числу и показывается в USD. Валюта покупки фиксирована — доллар
   США.
5. **Журнал действий.** Колонка `logs.action` хранит полный JSON пластинки.
   Миграция `20241116000000-fix-logs-action-text.js` в бэкенде меняет её на
   `TEXT`; для уже существующей базы достаточно применить миграции бэкенда.

## Структура

```
src/
  components/       UI-кит, карточки, layout, защищённые маршруты
  context/          AuthContext (JWT + профиль), ToastContext
  lib/              API-клиент, queryClient, форматирование, debounce
  pages/            страницы каталога, карточки, авторизации, профиля
  pages/admin/      админ-раздел с вложенными маршрутами
  types/            типы ответов API
```

## Деплой на Vercel

Фронтенд — отдельный статический Vercel-проект, бэкенд — отдельный NestJS
Vercel Function. Общего origin и reverse-proxy нет, поэтому API задаётся
абсолютным URL.

1. Импортируйте репозиторий на <https://vercel.com/new>. Vercel определит Vite;
   build command — `npm run build`, output directory — `dist`.
2. В Project Settings → Environment Variables добавьте:

```env
VITE_API_URL=https://<backend>.vercel.app/api
```

3. В бэкенде на Vercel задайте `FRONTEND_URL=https://<frontend>.vercel.app` и
   `CORS_ORIGINS=https://<frontend>.vercel.app`. Для preview-деплоев можно
   добавить `https://*.vercel.app`.
4. В Google Console добавьте backend-callback
   `https://<backend>.vercel.app/api/auth/google/callback`.
5. `vercel.json` уже содержит SPA-fallback на `index.html`, поэтому deep-link'и
   `/vinyls/:id`, `/profile` и `/admin/*` не дают 404.

Первый запрос к backend-функции после простоя может быть медленнее из-за
холодного старта. Задайте `VITE_API_URL` и для окружения Preview, иначе
preview-сборка будет обращаться к `/api` на собственном домене и получит 404.

## Проверки

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Vitest проверяет форматирование цены и дат, склонение, подсчёт среднего балла и
`ApiError` — 9 тестов. CI (`.github/workflows/ci.yml`) прогоняет те же команды
на каждый push и pull request в `master`.
