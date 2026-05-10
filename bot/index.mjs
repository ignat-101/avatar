import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { generateAvatar, THEMES } from './generate.mjs';

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error('❌ BOT_TOKEN не задан! Создайте .env файл (см. .env.example)');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });
console.log('🤖 TON Avatar Bot запущен!');

// ─── Хранилище состояний пользователей ───────────────────────────────────
const userState = new Map();

function getState(userId) {
  if (!userState.has(userId)) {
    userState.set(userId, {
      theme: 0,
      glass: true,
      logo: true,
      domain: null,
    });
  }
  return userState.get(userId);
}

// ─── Инлайн-клавиатура настроек под аватаркой ────────────────────────────
function settingsKeyboard(state) {
  return {
    inline_keyboard: [
      [
        { text: '🎨 Сменить тему', callback_data: 'show_themes' },
        { text: '🎲 Рандом', callback_data: 'random_theme' },
      ],
      [
        { text: state.glass ? '🔳 Glass: ВКЛ' : '▫️ Glass: ВЫКЛ', callback_data: 'toggle_glass' },
        { text: state.logo ? '💎 Logo: ВКЛ' : '▫️ Logo: ВЫКЛ', callback_data: 'toggle_logo' },
      ],
      [
        { text: '🔄 Перегенерировать', callback_data: 'regenerate' },
      ],
    ],
  };
}

// ─── /start ──────────────────────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'друг';

  bot.sendMessage(
    chatId,
    `👋 *Привет, ${name}!*\n\n` +
    `Я — *TON Avatar Bot* 💎\n` +
    `Создаю стильные аватарки для TON доменов.\n\n` +
    `📝 *Команды:*\n` +
    `• /avatar \\<имя\\> — сгенерировать аватарку\n` +
    `• /theme — выбрать тему оформления\n` +
    `• /settings — настройки \\(glass, logo\\)\n` +
    `• /themes — предпросмотр всех тем\n` +
    `• /help — справка\n\n` +
    `Просто отправь /avatar и своё имя\\! 🚀`,
    { parse_mode: 'MarkdownV2' }
  );
});

// ─── /help ───────────────────────────────────────────────────────────────
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `ℹ️ *TON Avatar Bot — Справка*\n\n` +
    `*Генерация аватарки:*\n` +
    `/avatar myname — создаёт аватарку «myname.ton»\n` +
    `/avatar — использует твой Telegram username\n\n` +
    `*Настройки:*\n` +
    `/theme — выбрать одну из 8 тем\n` +
    `/settings — вкл/выкл glass-эффект и TON лого\n\n` +
    `*Темы:*\n` +
    `/themes — показать превью всех 8 тем\n\n` +
    `После генерации под аватаркой появятся кнопки для быстрой смены темы, ` +
    `переключения настроек и перегенерации 🔄`,
    { parse_mode: 'Markdown' }
  );
});

// ─── /theme — выбор темы ─────────────────────────────────────────────────
bot.onText(/\/theme/, (msg) => {
  const state = getState(msg.from.id);
  const buttons = THEMES.map((t, i) => [{
    text: (i === state.theme ? '✅ ' : '') + t.name,
    callback_data: `theme_${i}`,
  }]);

  bot.sendMessage(msg.chat.id, '🎨 *Выбери тему оформления:*', {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons },
  });
});

// ─── /settings — настройки glass и logo ──────────────────────────────────
bot.onText(/\/settings/, (msg) => {
  const state = getState(msg.from.id);

  bot.sendMessage(msg.chat.id, '⚙️ *Настройки аватарки:*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: state.glass ? '🔳 Glassmorphism: ВКЛ' : '▫️ Glassmorphism: ВЫКЛ',
            callback_data: 'settings_glass',
          },
        ],
        [
          {
            text: state.logo ? '💎 TON Logo: ВКЛ' : '▫️ TON Logo: ВЫКЛ',
            callback_data: 'settings_logo',
          },
        ],
      ],
    },
  });
});

// ─── /themes — превью всех тем ───────────────────────────────────────────
bot.onText(/\/themes/, async (msg) => {
  const chatId = msg.chat.id;
  const state = getState(msg.from.id);
  const domain = state.domain || msg.from.username || 'preview';
  const loading = await bot.sendMessage(chatId, '⏳ Генерирую превью всех тем...');

  try {
    const media = [];
    for (let i = 0; i < THEMES.length; i++) {
      const buf = await generateAvatar({
        domain,
        themeIndex: i,
        glass: state.glass,
        logo: state.logo,
      });
      media.push({
        type: 'photo',
        media: buf,
        caption: `${i + 1}. ${THEMES[i].name}`,
      });
    }

    // Telegram позволяет до 10 фото в альбоме
    await bot.sendMediaGroup(chatId, media);
    await bot.deleteMessage(chatId, loading.message_id);
  } catch (err) {
    console.error('Themes preview error:', err);
    await bot.editMessageText('❌ Не удалось сгенерировать превью.', {
      chat_id: chatId,
      message_id: loading.message_id,
    });
  }
});

// ─── /avatar [имя] — генерация аватарки ──────────────────────────────────
bot.onText(/\/avatar(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const state = getState(userId);

  const rawDomain = match?.[1]?.trim();
  const domain = rawDomain
    ? rawDomain.replace(/\.ton$/i, '')
    : msg.from.username || 'username';
  state.domain = domain;

  const loading = await bot.sendMessage(chatId, '⏳ Генерирую аватарку...');

  try {
    const buffer = await generateAvatar({
      domain: state.domain,
      themeIndex: state.theme,
      glass: state.glass,
      logo: state.logo,
    });

    await bot.sendPhoto(chatId, buffer, {
      caption:
        `🎨 Аватарка для *${domain}.ton*\n` +
        `Тема: ${THEMES[state.theme].name}`,
      parse_mode: 'Markdown',
      reply_markup: settingsKeyboard(state),
    });

    await bot.deleteMessage(chatId, loading.message_id);
  } catch (err) {
    console.error('Avatar generation error:', err);
    await bot.editMessageText('❌ Ошибка при генерации. Попробуйте /avatar снова.', {
      chat_id: chatId,
      message_id: loading.message_id,
    });
  }
});

// ─── Обработка инлайн-кнопок ─────────────────────────────────────────────
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const state = getState(userId);
  const data = query.data;

  // ── Показать темы ──
  if (data === 'show_themes') {
    const buttons = THEMES.map((t, i) => [{
      text: (i === state.theme ? '✅ ' : '') + t.name,
      callback_data: `theme_${i}`,
    }]);

    await bot.sendMessage(chatId, '🎨 *Выбери тему:*', {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons },
    });
    return bot.answerCallbackQuery(query.id);
  }

  // ── Выбор конкретной темы ──
  if (data.startsWith('theme_')) {
    const idx = parseInt(data.split('_')[1], 10);
    state.theme = idx;

    if (state.domain) {
      await regenerateAndSend(chatId, state);
      await bot.answerCallbackQuery(query.id, { text: `Тема: ${THEMES[idx].name}` });
    } else {
      await bot.answerCallbackQuery(query.id, {
        text: `✅ Тема: ${THEMES[idx].name}. Теперь /avatar имя`,
      });
    }
    return;
  }

  // ── Рандомная тема ──
  if (data === 'random_theme') {
    let next;
    do {
      next = Math.floor(Math.random() * THEMES.length);
    } while (next === state.theme && THEMES.length > 1);
    state.theme = next;

    if (state.domain) {
      await regenerateAndSend(chatId, state);
      await bot.answerCallbackQuery(query.id, { text: `🎲 ${THEMES[next].name}` });
    } else {
      await bot.answerCallbackQuery(query.id, { text: `Тема: ${THEMES[next].name}` });
    }
    return;
  }

  // ── Переключение glass ──
  if (data === 'toggle_glass' || data === 'settings_glass') {
    state.glass = !state.glass;
    const label = state.glass ? 'ВКЛ' : 'ВЫКЛ';

    if (data === 'settings_glass') {
      // Обновляем inline-клавиатуру настроек
      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: [
            [{
              text: state.glass ? '🔳 Glassmorphism: ВКЛ' : '▫️ Glassmorphism: ВЫКЛ',
              callback_data: 'settings_glass',
            }],
            [{
              text: state.logo ? '💎 TON Logo: ВКЛ' : '▫️ TON Logo: ВЫКЛ',
              callback_data: 'settings_logo',
            }],
          ],
        },
        { chat_id: chatId, message_id: query.message.message_id }
      );
      return bot.answerCallbackQuery(query.id, { text: `Glass: ${label}` });
    }

    if (state.domain) {
      await regenerateAndSend(chatId, state);
    }
    return bot.answerCallbackQuery(query.id, { text: `Glass: ${label}` });
  }

  // ── Переключение logo ──
  if (data === 'toggle_logo' || data === 'settings_logo') {
    state.logo = !state.logo;
    const label = state.logo ? 'ВКЛ' : 'ВЫКЛ';

    if (data === 'settings_logo') {
      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: [
            [{
              text: state.glass ? '🔳 Glassmorphism: ВКЛ' : '▫️ Glassmorphism: ВЫКЛ',
              callback_data: 'settings_glass',
            }],
            [{
              text: state.logo ? '💎 TON Logo: ВКЛ' : '▫️ TON Logo: ВЫКЛ',
              callback_data: 'settings_logo',
            }],
          ],
        },
        { chat_id: chatId, message_id: query.message.message_id }
      );
      return bot.answerCallbackQuery(query.id, { text: `Logo: ${label}` });
    }

    if (state.domain) {
      await regenerateAndSend(chatId, state);
    }
    return bot.answerCallbackQuery(query.id, { text: `Logo: ${label}` });
  }

  // ── Перегенерация ──
  if (data === 'regenerate') {
    if (state.domain) {
      await regenerateAndSend(chatId, state);
      return bot.answerCallbackQuery(query.id, { text: '🔄 Перегенерировано!' });
    }
    return bot.answerCallbackQuery(query.id, {
      text: 'Сначала отправь /avatar имя',
    });
  }

  await bot.answerCallbackQuery(query.id);
});

// ─── Генерация + отправка в чат ──────────────────────────────────────────
async function regenerateAndSend(chatId, state) {
  const loading = await bot.sendMessage(chatId, '⏳ Генерирую...');

  try {
    const buffer = await generateAvatar({
      domain: state.domain,
      themeIndex: state.theme,
      glass: state.glass,
      logo: state.logo,
    });

    await bot.sendPhoto(chatId, buffer, {
      caption:
        `🎨 *${state.domain}.ton*\n` +
        `Тема: ${THEMES[state.theme].name}`,
      parse_mode: 'Markdown',
      reply_markup: settingsKeyboard(state),
    });

    await bot.deleteMessage(chatId, loading.message_id);
  } catch (err) {
    console.error('Regeneration error:', err);
    await bot.editMessageText('❌ Ошибка при генерации.', {
      chat_id: chatId,
      message_id: loading.message_id,
    });
  }
}
