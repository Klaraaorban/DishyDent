// Generates public/og-image.png (1200x630) from scratch — brand mark, no photography.
// Fontsource ships base-Latin and Latin-Extended glyphs as separate subset files;
// napi-rs/canvas doesn't merge two registrations under one family, so mixed
// Romanian/Hungarian diacritics are drawn by switching family per character run.
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const fontFile = (p) => path.join(root, 'node_modules', p);

GlobalFonts.registerFromPath(
  fontFile('@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2'),
  'Fraunces Base'
);
GlobalFonts.registerFromPath(
  fontFile('@fontsource-variable/fraunces/files/fraunces-latin-ext-wght-normal.woff2'),
  'Fraunces Ext'
);
GlobalFonts.registerFromPath(fontFile('@fontsource/inter/files/inter-latin-700-normal.woff'), 'Inter Base');
GlobalFonts.registerFromPath(fontFile('@fontsource/inter/files/inter-latin-ext-700-normal.woff'), 'Inter Ext');

// Characters only present in the Latin-Extended subset (empirically verified above).
const EXT_CHARS = new Set(['ă', 'Ă', 'î', 'Î', 'ș', 'Ș', 'ț', 'Ț', 'ő', 'Ő', 'ű', 'Ű']);

function familyFor(base, ext, char) {
  return EXT_CHARS.has(char) ? ext : base;
}

// Draws text left-aligned at (x, baselineY), switching font family per run so
// every character — ASCII or Romanian/Hungarian diacritic — resolves to a real glyph.
function drawMixedText(ctx, text, x, y, { size, base, ext, weight = '', color }) {
  ctx.fillStyle = color;
  let cursor = x;
  let run = '';
  let runFamily = null;

  const flush = () => {
    if (!run) return;
    ctx.font = `${weight} ${size}px "${runFamily}"`;
    ctx.fillText(run, cursor, y);
    cursor += ctx.measureText(run).width;
    run = '';
  };

  for (const char of text) {
    const family = familyFor(base, ext, char);
    if (runFamily !== null && family !== runFamily) flush();
    runFamily = family;
    run += char;
  }
  flush();
  return cursor - x;
}

function measureMixedText(ctx, text, { size, base, ext, weight = '' }) {
  let total = 0;
  let run = '';
  let runFamily = null;
  const flush = () => {
    if (!run) return;
    ctx.font = `${weight} ${size}px "${runFamily}"`;
    total += ctx.measureText(run).width;
    run = '';
  };
  for (const char of text) {
    const family = familyFor(base, ext, char);
    if (runFamily !== null && family !== runFamily) flush();
    runFamily = family;
    run += char;
  }
  flush();
  return total;
}

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#0c0b10';
const TEXT = '#f6f4f6';
const BRAND_TINT = '#e7ace0';

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = BG;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// DishyDent's real logo mark (processed by scripts/process-logo.mjs), drawn at
// (cx, cy) as a `size`-square box — white for the small mark, purple (with a
// soft glow, matching the hero section) for the large background watermark.
const brandMarkWhite = await loadImage(path.join(root, 'public', 'brand-mark-white.png'));
const brandMarkPurple = await loadImage(path.join(root, 'public', 'brand-mark-purple.png'));

function drawBrandMark(img, cx, cy, size, alpha, glow = false) {
  ctx.save();
  ctx.globalAlpha = alpha;
  if (glow) {
    ctx.shadowColor = 'rgba(147, 25, 140, 0.9)';
    ctx.shadowBlur = 45;
  }
  ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
  ctx.restore();
}

// Large background watermark, bleeding off the right edge — the hero's glow, echoed.
drawBrandMark(brandMarkPurple, 1040, 300, 680, 0.6, true);

// Small mark beside the eyebrow label — the full mark, at legible scale.
drawBrandMark(brandMarkWhite, 112, 146, 40, 1);

// Eyebrow
ctx.font = '600 24px "Inter Base"';
ctx.fillStyle = BRAND_TINT;
ctx.fillText('CABINET STOMATOLOGIC', 148, 158);
const eyebrowWidth = measureMixedText(ctx, 'CABINET STOMATOLOGIC · ', {
  size: 24,
  base: 'Inter Base',
  ext: 'Inter Ext',
  weight: '600',
});
drawMixedText(ctx, 'TÂRGU MUREȘ', 148 + eyebrowWidth, 158, {
  size: 24,
  base: 'Inter Base',
  ext: 'Inter Ext',
  weight: '600',
  color: '#e59ddd',
});

// Brand
ctx.font = '600 128px "Fraunces Base"';
ctx.fillStyle = TEXT;
ctx.fillText('DishyDent', 92, 320);

// Tagline
ctx.font = 'italic 500 44px "Fraunces Base"';
ctx.fillStyle = BRAND_TINT;
ctx.fillText('Precizie, nu presupuneri.', 96, 400);

// Footer line: phone + url
ctx.font = '600 28px "Inter Base"';
ctx.fillStyle = TEXT;
ctx.fillText('0799 646 666', 96, 520);

ctx.font = '400 24px "Inter Base"';
ctx.fillStyle = '#8a8690';
ctx.fillText('dishydent.ro', 96, 556);

// Base rule
ctx.strokeStyle = 'rgba(246,244,246,0.15)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(96, 480);
ctx.lineTo(560, 480);
ctx.stroke();

const outPath = path.join(root, 'public', 'og-image.png');
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log('Wrote', outPath);
