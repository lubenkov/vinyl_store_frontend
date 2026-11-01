# Vinyl Store — фронтенд

[![CI](https://github.com/lubenkov/vinyl_store_frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/lubenkov/vinyl_store_frontend/actions/workflows/ci.yml)

SPA для REST API [lubenkov/vinyl_store](https://github.com/lubenkov/vinyl_store):
каталог пластинок, карточка релиза с отзывами, авторизация, профиль, покупка через
Stripe и админ-панель.

## Стек

| Слой | Что используется |
| --- | --- |
| Сборка | Vite 5 + TypeScript |
| UI | React 18, Tailwind CSS 3, lucide-react |
| Роутинг | React Router 7 |
| Данные | TanStack Query 5, `fetch` |
| Линт | ESLint 9 + typescript-eslint |

## Быстрый старт

1. Запустите бэкенд из репозитория `vinyl_store` на `http://localhost:3000`
   (MySQL, миграции, `.env` — см. README бэкенда).
2. Установите зависимости фронтенда и запустите dev-сервер:

```bash
npm install
npm run dev
```

3. Откройте `http://localhost:5173`.

Vite проксирует `/api/*` на `http://localhost:3000`, убирая префикс `/api`
(`/api/vinyls` → `http://localhost:3000/vinyls`). Префикс нужен, чтобы SPA-маршрут
`/vinyls/:id` не перехватывался прокси.

### Другой адрес API

Создайте `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

При заданном `VITE_API_URL` запросы идут напрямую на бэкенд (CORS в нём уже
включён). Для продакшена это единственный вариант: соберите `npm run build` и
раздайте `dist/`, либо настройте reverse-proxy для `/api`.

### Права администратора

Регистрация через `/auth/register` всегда создаёт роль `user`. Чтобы открыть
`/admin`, повысьте пользователя в MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

После этого перезайдите в аккаунт.

## Скрипты

| Команда | Что делает |
| --- | --- |
| `npm run dev` | Dev-сервер Vite на :5173 |
| `npm run build` | Проверка типов + production-сборка в `dist/` |
| `npm run preview` | Локальный просмотр собранной версии |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint по проекту |

## Маршруты

| Путь | Доступ | Что внутри |
| --- | --- | --- |
| `/` | публично | Каталог: поиск, сортировка, пагинация |
| `/vinyls/:id` | публично | Карточка пластинки, отзывы, покупка |
| `/login`, `/register` | публично | Вход и регистрация по email/паролю |
| `/profile` | JWT | Профиль, редактирование, история покупок и отзывов, удаление аккаунта |
| `/admin/vinyls` | admin | CRUD пластинок |
| `/admin/discogs` | admin | Поиск релиза по ID и импорт в каталог |
| `/admin/telegram` | admin | Отправка карточки в Telegram |
| `/admin/logs` | admin | Журнал действий |

## Работа с API

Типы и вызовы собраны в `src/types/api.ts` и `src/lib/api.ts` по реальным
контроллерам и DTO бэкенда.

| Возможность | Эндпоинты |
| --- | --- |
| Авторизация | `POST /auth/register`, `POST /auth/login` → `{ accessToken }` |
| Профиль | `GET/PUT/DELETE /users/profile` |
| Каталог | `GET /vinyls?limit&offset&sortBy&order&searchBy&searchTerm` → `{ rows, count }` |
| Пластинка | `GET /vinyls/:id`, `POST/PUT/DELETE /vinyls[/:id]` |
| Отзывы | `GET/POST /vinyls/:id/reviews`, `DELETE /reviews/:id` |
| Покупка | `POST /purchases` (`vinylId`, `currency`) |
| Discogs | `GET /discogs/vinyls/:id/scores`, `POST /discogs/vinyls/:id` |
| Telegram | `POST /telegram/sendVinyl` |
| Логи | `GET /logs` |

JWT хранится в `localStorage` и отправляется заголовком `Authorization: Bearer …`.
При ответе 401 токен сбрасывается, пользователь возвращается на `/login`.

## Ограничения бэкенда, учтённые в UI

1. **Google OAuth.** `GET /auth/google/callback` кладёт JWT в httpOnly-cookie, а
   `AuthGuard`/`AdminGuard` читают только заголовок `Authorization`. Поэтому вход
   через Google из SPA сейчас не работает; в форме входа выведено пояснение.
   Исправление на бэкенде: отдавать токен фронтенду или читать cookie в guard.
2. **Stripe.** `POST /purchases` создаёт PaymentIntent, но не возвращает
   `client_secret`, поэтому Stripe Elements на фронтенде не подключён. Модальное
   окно показывает созданный заказ и его статус.
3. **Пагинация отзывов.** `GET /vinyls/:id/reviews` возвращает только массив без
   общего количества, поэтому кнопка «Дальше» активна, пока страница заполнена
   целиком.
4. **Импорт Discogs** требует `DISCOGS_KEY`/`DISCOGS_SECRET`, Telegram —
   `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` в `.env` бэкенда.
5. **Цена** в БД хранится как `DECIMAL`, поэтому приходит строкой; в UI она
   приводится к числу и показывается в USD.
6. **Журнал действий.** Колонка `logs.action` создаётся миграцией как
   `VARCHAR(255)`, а сервис пишет туда полный JSON пластинки. На длинном
   описании или URL обложки импорт Discogs падал с 500. В текущей базе колонка
   расширена до `TEXT`; для чистой установки нужно применить
   `ALTER TABLE logs MODIFY action TEXT NOT NULL;`.

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

## Проверки

```bash
npm run typecheck
npm run build
npm run lint
```

Тестового набора пока нет: сценарии проверялись типами, production-сборкой и
прогоном dev-сервера против мок-API.
