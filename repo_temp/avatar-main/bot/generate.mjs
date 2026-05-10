import { createCanvas } from 'canvas';

const SIZE = 1200;

// ─── Темы (точное повторение оригинального дизайна) ───────────────────────
export const THEMES = [
  {
    id: 'ton-blue',
    name: '💎 TON Blue',
    gradient: (ctx) => {
      const g = ctx.createLinearGradient(0, 0, SIZE, SIZE);
      g.addColorStop(0, '#0098EA');
      g.addColorStop(0.5, '#005EAA');
      g.addColorStop(1, '#001D4A');
      return g;
    },
    glassColor: 'rgba(255,255,255,0.10)',
    glassBorder: 'rgba(255,255,255,0.20)',
    textColor: '#FFFFFF',
    decoColor: 'rgba(0,152,234,0.40)',
  },
  {
    id: 'dark-mesh',
    name: '🌑 Dark Mesh',
    gradient: (ctx) => {
      const g = ctx.createRadialGradient(SIZE, 0, 0, SIZE * 0.5, SIZE * 0.5, SIZE);
      g.addColorStop(0, '#312e81');   // indigo-900
      g.addColorStop(0.5, '#111827'); // gray-900
      g.addColorStop(1, '#000000');
      return g;
    },
    glassColor: 'rgba(255,255,255,0.05)',
    glassBorder: 'rgba(255,255,255,0.10)',
    textColor: '#FFFFFF',
    decoColor: 'rgba(99,102,241,0.30)',
  },
  {
    id: 'neon-cyber',
    name: '💜 Neon Cyber',
    gradient: (ctx) => {
      const g = ctx.createRadialGradient(SIZE, 0, 0, SIZE * 0.5, SIZE * 0.5, SIZE);
      g.addColorStop(0, '#c026d3');   // fuchsia-600
      g.addColorStop(0.5, '#581c87'); // purple-900
      g.addColorStop(1, '#000000');
      return g;
    },
    glassColor: 'rgba(0,0,0,0.20)',
    glassBorder: 'rgba(255,255,255,0.10)',
    textColor: '#FFFFFF',
    decoColor: 'rgba(192,38,211,0.40)',
  },
  {
    id: 'holographic',
    name: '🌈 Holographic',
    gradient: (ctx) => {
      const g = ctx.createLinearGradient(0, SIZE, SIZE, 0);
      g.addColorStop(0, '#22d3ee');   // cyan-400
      g.addColorStop(0.5, '#3b82f6'); // blue-500
      g.addColorStop(1, '#9333ea');   // purple-600
      return g;
    },
    glassColor: 'rgba(255,255,255,0.20)',
    glassBorder: 'rgba(255,255,255,0.40)',
    textColor: '#FFFFFF',
    decoColor: 'rgba(59,130,246,0.40)',
  },
  {
    id: 'deep-space',
    name: '🚀 Deep Space',
    gradient: (ctx) => {
      const g = ctx.createRadialGradient(SIZE / 2, SIZE, 0, SIZE / 2, SIZE / 2, SIZE);
      g.addColorStop(0, '#1e293b');   // slate-900
      g.addColorStop(0.5, '#000814');
      g.addColorStop(1, '#000000');
      return g;
    },
    glassColor: 'rgba(59,130,246,0.10)',
    glassBorder: 'rgba(59,130,246,0.20)',
    textColor: '#0098EA',
    decoColor: 'rgba(0,152,234,0.20)',
  },
  {
    id: 'minimal-light',
    name: '⬜ Minimal Light',
    gradient: (ctx) => {
      const g = ctx.createLinearGradient(0, SIZE, SIZE, 0);
      g.addColorStop(0, '#f3f4f6'); // gray-100
      g.addColorStop(1, '#ffffff');
      return g;
    },
    glassColor: 'rgba(255,255,255,0.50)',
    glassBorder: 'rgba(209,213,219,1)',
    textColor: '#0f172a', // slate-900
    decoColor: 'rgba(0,152,234,0.15)',
  },
  {
    id: 'matrix-green',
    name: '🟢 Matrix Web3',
    gradient: (ctx) => {
      const g = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE);
      g.addColorStop(0, '#064e3b'); // emerald-900
      g.addColorStop(0.5, '#000000');
      g.addColorStop(1, '#000000');
      return g;
    },
    glassColor: 'rgba(16,185,129,0.10)',
    glassBorder: 'rgba(16,185,129,0.20)',
    textColor: '#34d399', // emerald-400
    decoColor: 'rgba(16,185,129,0.30)',
  },
  {
    id: 'molten-gold',
    name: '🥇 Molten Gold',
    gradient: (ctx) => {
      const g = ctx.createLinearGradient(SIZE, SIZE, 0, 0);
      g.addColorStop(0, '#fde68a');   // amber-200
      g.addColorStop(0.5, '#ca8a04'); // yellow-600
      g.addColorStop(1, '#78350f');   // amber-900
      return g;
    },
    glassColor: 'rgba(0,0,0,0.30)',
    glassBorder: 'rgba(255,255,255,0.20)',
    textColor: '#FFFFFF',
    decoColor: 'rgba(202,138,4,0.40)',
  },
];

// ─── Утилита: скруглённый прямоугольник ──────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Шумовой оверлей ─────────────────────────────────────────────────────
function drawNoise(ctx) {
  const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 30;
    d[i]     = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(imageData, 0, 0);
}

// ─── Декоративные «блюр-круги» ──────────────────────────────────────────
function drawDecoCircles(ctx, theme) {
  // Верхний правый — белый
  const g1 = ctx.createRadialGradient(SIZE + 30, -30, 0, SIZE + 30, -30, SIZE * 0.35);
  g1.addColorStop(0, 'rgba(255,255,255,0.12)');
  g1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Нижний левый — акцентный
  const g2 = ctx.createRadialGradient(-30, SIZE + 30, 0, -30, SIZE + 30, SIZE * 0.35);
  g2.addColorStop(0, theme.decoColor);
  g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, SIZE, SIZE);
}

// ─── TON логотип (алмаз) ────────────────────────────────────────────────
function drawTonLogo(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);

  const s = size / 2;

  // Внешний diamond
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.85, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.85, 0);
  ctx.closePath();
  ctx.fill();

  // Внутренний вырез (буква T намёк)
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = color === '#FFFFFF' ? '#000000' : '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.55);
  ctx.lineTo(s * 0.45, 0);
  ctx.lineTo(0, s * 0.55);
  ctx.lineTo(-s * 0.45, 0);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}

// ─── Glass-панель ────────────────────────────────────────────────────────
function drawGlass(ctx, theme, y, h) {
  const panelW = SIZE * 0.82;
  const panelX = (SIZE - panelW) / 2;

  roundRect(ctx, panelX, y, panelW, h, 48);
  ctx.fillStyle = theme.glassColor;
  ctx.fill();
  ctx.strokeStyle = theme.glassBorder;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ─── Автоподбор размера шрифта ───────────────────────────────────────────
function fitFontSize(ctx, text, maxWidth, maxSize, minSize, weight = 'bold') {
  let fontSize = maxSize;
  while (fontSize > minSize) {
    ctx.font = `${weight} ${fontSize}px "Arial", "Helvetica Neue", sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 2;
  }
  return fontSize;
}

// ─── Главная функция генерации ───────────────────────────────────────────
export async function generateAvatar({
  domain = 'name',
  themeIndex = 0,
  glass = true,
  logo = true,
}) {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  const theme = THEMES[themeIndex % THEMES.length];

  // 1. Фон
  ctx.fillStyle = theme.gradient(ctx);
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. Шум
  drawNoise(ctx);

  // 3. Декоративные круги
  drawDecoCircles(ctx, theme);

  // ─── Рассчитываем лейаут ───
  const domainText = domain || 'name';
  const suffixText = '.ton';

  const maxTextWidth = SIZE * 0.72;
  const domainFontSize = fitFontSize(ctx, domainText, maxTextWidth, 96, 36);
  const suffixFontSize = Math.round(domainFontSize * 0.55);
  const logoSize = 72;

  // Считаем общую высоту контента
  let contentH = 0;
  if (logo) contentH += logoSize + 24; // logo + gap
  contentH += domainFontSize + 8;       // domain text
  contentH += suffixFontSize + 8;       // .ton

  const contentY = (SIZE - contentH) / 2;
  const panelPad = 56;

  // 4. Glass-панель
  if (glass) {
    drawGlass(ctx, theme, contentY - panelPad, contentH + panelPad * 2);
  }

  // 5. Рисуем контент
  const cx = SIZE / 2;
  let curY = contentY;

  if (logo) {
    drawTonLogo(ctx, cx, curY + logoSize / 2, logoSize, theme.textColor);
    curY += logoSize + 24;
  }

  // Domain
  ctx.fillStyle = theme.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `800 ${domainFontSize}px "Arial", "Helvetica Neue", sans-serif`;
  ctx.fillText(domainText, cx, curY);
  curY += domainFontSize + 8;

  // .ton
  ctx.globalAlpha = 0.6;
  ctx.font = `700 ${suffixFontSize}px "Arial", "Helvetica Neue", sans-serif`;
  ctx.fillText(suffixText, cx, curY);
  ctx.globalAlpha = 1;

  return canvas.toBuffer('image/png');
}
