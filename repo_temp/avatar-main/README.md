# 💎 TON Avatar Bot

Telegram-бот для генерации стильных аватарок для TON доменов. Работает полностью через команды и инлайн-кнопки — без веб-интерфейса.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Telegram Bot](https://img.shields.io/badge/Telegram-Bot_API-26A5E4?logo=telegram&logoColor=white)
![Canvas](https://img.shields.io/badge/Canvas-Server--side-FF6B6B)

---

## ⚡ Возможности

- 🎨 **8 уникальных тем** — TON Blue, Dark Mesh, Neon Cyber, Holographic, Deep Space, Minimal Light, Matrix Web3, Molten Gold
- 🔳 **Glassmorphism** — эффект стекла (вкл/выкл)
- 💎 **TON Logo** — логотип на аватарке (вкл/выкл)
- 🎲 **Рандомизация** — случайная тема одной кнопкой
- 📸 **Высокое разрешение** — 1200×1200px PNG
- ⚡ **Инлайн-кнопки** — всё управление прямо под сообщением
- 🔄 **Перегенерация** — мгновенная перегенерация с новыми настройками

---

## 🤖 Команды бота

| Команда | Описание |
|---------|----------|
| `/start` | Приветствие и справка |
| `/avatar <имя>` | Сгенерировать аватарку для `имя.ton` |
| `/avatar` | Аватарка с вашим Telegram username |
| `/theme` | Выбрать тему из списка (инлайн-кнопки) |
| `/settings` | Настройки glass-эффекта и TON лого |
| `/themes` | Превью всех 8 тем в одном альбоме |
| `/help` | Подробная справка |

### Инлайн-кнопки под аватаркой

После генерации под картинкой появляются кнопки:

```
[🎨 Сменить тему] [🎲 Рандом]
[🔳 Glass: ВКЛ]   [💎 Logo: ВКЛ]
[      🔄 Перегенерировать      ]
```

---

## 🚀 Быстрый старт

### 1. Получить токен бота

1. Откройте Telegram → найдите **@BotFather**
2. Отправьте `/newbot`
3. Следуйте инструкциям — скопируйте токен

### 2. Клонировать и настроить

```bash
git clone https://github.com/ignat-101/avatar.git
cd avatar/bot
```

### 3. Установить системные зависимости для Canvas

**Ubuntu / Debian:**
```bash
sudo apt-get install -y build-essential \
  libcairo2-dev libpango1.0-dev libjpeg-dev \
  libgif-dev librsvg2-dev
```

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### 4. Установить npm зависимости

```bash
npm install
```

### 5. Настроить переменные окружения

```bash
cp .env.example .env
```

Откройте `.env` и вставьте свой токен:
```
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 6. Запустить

```bash
npm start
```

Для разработки с авто-рестартом:
```bash
npm run dev
```

✅ В консоли появится: `🤖 TON Avatar Bot запущен!`

---

## 📁 Структура проекта

```
bot/
├── index.mjs        # Главный файл бота (команды, callback-кнопки)
├── generate.mjs     # Генерация аватарок (Canvas API)
├── package.json     # Зависимости бота
├── .env.example     # Шаблон переменных окружения
└── .env             # Ваш BOT_TOKEN (не коммитить!)
```

---

## ☁️ Деплой (24/7)

### Render.com (бесплатно)

1. Зарегистрируйтесь на [render.com](https://render.com)
2. **New +** → **Web Service**
3. Подключите GitHub-репозиторий
4. Настройте:
   - **Root Directory:** `bot`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. В **Environment Variables** добавьте `BOT_TOKEN`
6. Нажмите **Create Web Service**

### Railway.app

1. Зарегистрируйтесь на [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Укажите Root Directory: `bot`
4. Добавьте переменную `BOT_TOKEN`

### VPS (любой)

```bash
# Установите Node.js 18+ и системные зависимости для canvas
git clone https://github.com/ignat-101/avatar.git
cd avatar/bot
npm install
cp .env.example .env
# Вставьте BOT_TOKEN в .env

# Запуск через pm2 (рекомендуется)
npm install -g pm2
pm2 start index.mjs --name "ton-avatar-bot"
pm2 save
pm2 startup
```

---

## 🎨 Темы

| # | Тема | Описание |
|---|------|----------|
| 1 | 💎 TON Blue | Классический TON-градиент (синий) |
| 2 | 🌑 Dark Mesh | Тёмный с индиго акцентами |
| 3 | 💜 Neon Cyber | Неоновый фиолетовый |
| 4 | 🌈 Holographic | Голографический переливающийся |
| 5 | 🚀 Deep Space | Глубокий космос |
| 6 | ⬜ Minimal Light | Минималистичный светлый |
| 7 | 🟢 Matrix Web3 | Матрица / Web3 зелёный |
| 8 | 🥇 Molten Gold | Расплавленное золото |

---

## 🛠 Технологии

- **[Node.js](https://nodejs.org/)** — среда выполнения
- **[node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)** — Telegram Bot API
- **[canvas](https://github.com/Automattic/node-canvas)** — серверная генерация изображений
- **[dotenv](https://github.com/motdotla/dotenv)** — переменные окружения

---

## 📝 Лицензия

MIT
