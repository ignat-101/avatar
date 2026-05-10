import { useState } from 'react';
import {
  Bot,
  MessageSquare,
  Palette,
  Settings,
  Eye,
  Terminal,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Diamond,
  Zap,
  Globe,
  Server,
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// ─── Данные тем (соответствуют bot/generate.mjs) ─────────────────────────
const THEMES = [
  { id: 'ton-blue', name: '💎 TON Blue', css: 'bg-gradient-to-br from-[#0098EA] via-[#005EAA] to-[#001D4A]' },
  { id: 'dark-mesh', name: '🌑 Dark Mesh', css: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black' },
  { id: 'neon-cyber', name: '💜 Neon Cyber', css: 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-fuchsia-600 via-purple-900 to-black' },
  { id: 'holographic', name: '🌈 Holographic', css: 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600' },
  { id: 'deep-space', name: '🚀 Deep Space', css: 'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-[#000814] to-black' },
  { id: 'minimal-light', name: '⬜ Minimal Light', css: 'bg-gradient-to-tr from-gray-100 to-white' },
  { id: 'matrix-green', name: '🟢 Matrix Web3', css: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-black to-black' },
  { id: 'molten-gold', name: '🥇 Molten Gold', css: 'bg-gradient-to-bl from-amber-200 via-yellow-600 to-amber-900' },
];

const COMMANDS = [
  { cmd: '/start', desc: 'Приветствие и справка', icon: Bot },
  { cmd: '/avatar <имя>', desc: 'Сгенерировать аватарку', icon: Sparkles },
  { cmd: '/theme', desc: 'Выбрать тему оформления', icon: Palette },
  { cmd: '/settings', desc: 'Настройки (glass, logo)', icon: Settings },
  { cmd: '/themes', desc: 'Превью всех 8 тем', icon: Eye },
  { cmd: '/help', desc: 'Подробная справка', icon: MessageSquare },
];

// ─── Компонент кнопки копирования ────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
      title="Скопировать"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

// ─── Компонент блока кода ────────────────────────────────────────────────
function CodeBlock({ children, copyText }: { children: string; copyText?: string }) {
  return (
    <div className="relative group bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={copyText || children} />
      </div>
      <pre className="whitespace-pre-wrap">{children}</pre>
    </div>
  );
}

// ─── Аккордеон ───────────────────────────────────────────────────────────
function Accordion({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#1a1a20]/80">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0098ea]/15 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#0098ea]" />
          </div>
          <span className="font-semibold text-white">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Главный компонент ───────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white font-sans antialiased">
      {/* ─── Noise overlay ─── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* ─── Hero ─── */}
      <header className="relative overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0098ea]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0098ea] to-[#005eaa] shadow-[0_0_60px_rgba(0,152,234,0.3)] mb-8">
            <Diamond className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            TON Avatar{' '}
            <span className="bg-gradient-to-r from-[#0098ea] to-cyan-400 bg-clip-text text-transparent">
              Bot
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Telegram-бот для генерации стильных аватарок для TON доменов.
            <br />
            Инлайн-кнопки, 8 тем, glassmorphism — всё прямо в чате.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, text: 'Мгновенная генерация' },
              { icon: Palette, text: '8 уникальных тем' },
              { icon: Bot, text: 'Inline-кнопки' },
              { icon: Globe, text: '.ton домены' },
            ].map(({ icon: I, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
              >
                <I className="w-4 h-4 text-[#0098ea]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ─── Main content ─── */}
      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-16">

        {/* ─── Как работает ─── */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#0098ea]" />
            Как это работает
          </h2>
          <p className="text-gray-400 mb-6">
            Никакого веб-интерфейса — всё управление через команды и инлайн-кнопки прямо в Telegram.
          </p>

          {/* Chat mockup */}
          <div className="bg-[#1a1a20] border border-white/10 rounded-2xl p-5 space-y-4 max-w-lg mx-auto">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-[#0098ea] text-white px-4 py-2 rounded-2xl rounded-tr-md text-sm max-w-xs">
                /avatar ignat
              </div>
            </div>
            {/* Bot response */}
            <div className="flex justify-start">
              <div className="bg-[#2a2a35] px-4 py-3 rounded-2xl rounded-tl-md text-sm max-w-xs space-y-3">
                {/* Mini avatar preview */}
                <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-[#0098EA] via-[#005EAA] to-[#001D4A] flex flex-col items-center justify-center mx-auto relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 blur-2xl rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#0098ea]/40 blur-2xl rounded-full" />
                  <div className="relative z-10 bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center">
                    <Diamond className="w-5 h-5 text-white mb-1" />
                    <span className="font-bold text-white text-sm">ignat</span>
                    <span className="text-white/60 text-xs">.ton</span>
                  </div>
                </div>
                <p className="text-gray-300">
                  🎨 Аватарка для <strong>ignat.ton</strong>
                  <br />
                  <span className="text-gray-500">Тема: 💎 TON Blue</span>
                </p>
                {/* Inline buttons mockup */}
                <div className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <div className="flex-1 text-center text-xs py-1.5 rounded-md bg-white/10 text-[#0098ea]">
                      🎨 Сменить тему
                    </div>
                    <div className="flex-1 text-center text-xs py-1.5 rounded-md bg-white/10 text-[#0098ea]">
                      🎲 Рандом
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="flex-1 text-center text-xs py-1.5 rounded-md bg-white/10 text-[#0098ea]">
                      🔳 Glass: ВКЛ
                    </div>
                    <div className="flex-1 text-center text-xs py-1.5 rounded-md bg-white/10 text-[#0098ea]">
                      💎 Logo: ВКЛ
                    </div>
                  </div>
                  <div className="text-center text-xs py-1.5 rounded-md bg-white/10 text-[#0098ea]">
                    🔄 Перегенерировать
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Команды ─── */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-[#0098ea]" />
            Команды бота
          </h2>
          <div className="grid gap-3">
            {COMMANDS.map(({ cmd, desc, icon: Icon }) => (
              <div
                key={cmd}
                className="flex items-center gap-4 bg-[#1a1a20]/80 border border-white/5 rounded-xl px-5 py-4 hover:border-[#0098ea]/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0098ea]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#0098ea]" />
                </div>
                <div>
                  <code className="text-[#0098ea] font-mono text-sm font-semibold">{cmd}</code>
                  <p className="text-gray-400 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Темы ─── */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Palette className="w-6 h-6 text-[#0098ea]" />
            8 тем оформления
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {THEMES.map((t) => (
              <div key={t.id} className="group">
                <div
                  className={`aspect-square rounded-2xl ${t.css} relative overflow-hidden flex flex-col items-center justify-center shadow-lg transition-transform group-hover:scale-[1.03]`}
                >
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 blur-2xl rounded-full" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#0098ea]/30 blur-2xl rounded-full" />
                  <div className="relative z-10 bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm flex flex-col items-center">
                    <Diamond className={`w-4 h-4 mb-1 ${t.id === 'minimal-light' ? 'text-slate-900' : 'text-white'}`} />
                    <span className={`text-xs font-bold ${t.id === 'minimal-light' ? 'text-slate-900' : t.id === 'deep-space' ? 'text-[#0098ea]' : t.id === 'matrix-green' ? 'text-emerald-400' : 'text-white'}`}>
                      name
                    </span>
                    <span className={`text-[10px] opacity-60 ${t.id === 'minimal-light' ? 'text-slate-900' : t.id === 'deep-space' ? 'text-[#0098ea]' : t.id === 'matrix-green' ? 'text-emerald-400' : 'text-white'}`}>
                      .ton
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Установка и запуск ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-[#0098ea]" />
            Установка и запуск
          </h2>

          <Accordion title="Шаг 1 — Получить токен бота" icon={Bot} defaultOpen={true}>
            <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
              <li>Откройте Telegram и найдите <strong className="text-white">@BotFather</strong></li>
              <li>Отправьте команду <code className="text-[#0098ea]">/newbot</code></li>
              <li>Следуйте инструкциям — получите токен вида <code className="text-[#0098ea]">123456:ABC-DEF...</code></li>
            </ol>
          </Accordion>

          <Accordion title="Шаг 2 — Клонировать репозиторий" icon={GithubIcon}>
            <CodeBlock copyText="git clone https://github.com/ignat-101/avatar.git && cd avatar/bot">
{`git clone https://github.com/ignat-101/avatar.git
cd avatar/bot`}
            </CodeBlock>
          </Accordion>

          <Accordion title="Шаг 3 — Установить зависимости" icon={Terminal}>
            <p className="text-gray-400 text-sm mb-3">
              Для <code className="text-[#0098ea]">canvas</code> нужны системные зависимости:
            </p>
            <CodeBlock copyText="# Ubuntu/Debian
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg">
{`# Ubuntu / Debian
sudo apt-get install -y build-essential \\
  libcairo2-dev libpango1.0-dev libjpeg-dev \\
  libgif-dev librsvg2-dev

# macOS
brew install pkg-config cairo pango \\
  libpng jpeg giflib librsvg`}
            </CodeBlock>
            <CodeBlock copyText="npm install">{`npm install`}</CodeBlock>
          </Accordion>

          <Accordion title="Шаг 4 — Настроить .env" icon={Settings}>
            <CodeBlock copyText='cp .env.example .env
# Откройте .env и вставьте свой токен
BOT_TOKEN=ваш_токен_от_BotFather'>
{`cp .env.example .env

# Откройте .env и вставьте свой токен
BOT_TOKEN=ваш_токен_от_BotFather`}
            </CodeBlock>
          </Accordion>

          <Accordion title="Шаг 5 — Запустить бота" icon={Zap}>
            <CodeBlock copyText="npm start">{`npm start`}</CodeBlock>
            <p className="text-gray-400 text-sm">
              Или для разработки с авто-рестартом:
            </p>
            <CodeBlock copyText="npm run dev">{`npm run dev`}</CodeBlock>
            <p className="text-emerald-400 text-sm mt-2">
              ✅ В консоли появится: <code>🤖 TON Avatar Bot запущен!</code>
            </p>
          </Accordion>
        </section>

        {/* ─── Deploy ─── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#0098ea]" />
            Деплой (24/7)
          </h2>

          <div className="bg-[#1a1a20]/80 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Render.com (бесплатно)</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-400 text-sm">
              <li>Зарегистрируйтесь на <a href="https://render.com" className="text-[#0098ea] hover:underline" target="_blank" rel="noreferrer">render.com</a></li>
              <li>Нажмите <strong className="text-white">New +</strong> → <strong className="text-white">Web Service</strong></li>
              <li>Подключите GitHub репозиторий</li>
              <li>
                Настройте:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong className="text-white">Root Directory:</strong> <code className="text-[#0098ea]">bot</code></li>
                  <li><strong className="text-white">Build Command:</strong> <code className="text-[#0098ea]">npm install</code></li>
                  <li><strong className="text-white">Start Command:</strong> <code className="text-[#0098ea]">npm start</code></li>
                </ul>
              </li>
              <li>В <strong className="text-white">Environment Variables</strong> добавьте <code className="text-[#0098ea]">BOT_TOKEN</code></li>
              <li>Нажмите <strong className="text-white">Create Web Service</strong></li>
            </ol>
          </div>

          <div className="bg-[#1a1a20]/80 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Railway.app / Fly.io / VPS</h3>
            <p className="text-gray-400 text-sm">
              Бот работает на любой платформе, поддерживающей Node.js 18+.
              <br />
              Главное — установить системные зависимости для <code className="text-[#0098ea]">canvas</code> и задать переменную окружения <code className="text-[#0098ea]">BOT_TOKEN</code>.
            </p>
          </div>
        </section>

        {/* ─── Структура проекта ─── */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#0098ea]" />
            Структура проекта
          </h2>
          <CodeBlock>
{`bot/
├── index.mjs        # Главный файл бота (команды, кнопки)
├── generate.mjs     # Генерация аватарок (Canvas API)
├── package.json     # Зависимости бота
├── .env.example     # Шаблон переменных окружения
└── .env             # Ваш BOT_TOKEN (не коммитить!)`}
          </CodeBlock>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Diamond className="w-4 h-4 text-[#0098ea]" />
            TON Avatar Bot
          </div>
          <a
            href="https://github.com/ignat-101/avatar"
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
