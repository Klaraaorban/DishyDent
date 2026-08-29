// One-time processing of the client's real logo (assets/brand/logo-mark.png — a
// transparent PNG of the white line mark) into the color variants the site needs:
// a purple version for light backgrounds, a white version for dark backgrounds,
// and a composited favicon. Re-run this if a cleaner/higher-res source arrives.
import { loadImage, createCanvas } from '@napi-rs/canvas';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'assets', 'brand', 'logo-mark.png');
const publicDir = path.join(root, 'public');

const BRAND = '#93198c';
const PADDING_RATIO = 0.06; // breathing room around the traced mark

async function getAlphaBBox(ctx, width, height) {
  const data = ctx.getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

function cropToCanvas(img, bbox, padding) {
  const boxW = bbox.maxX - bbox.minX;
  const boxH = bbox.maxY - bbox.minY;
  const side = Math.max(boxW, boxH) * (1 + padding * 2);
  const canvas = createCanvas(Math.round(side), Math.round(side));
  const ctx = canvas.getContext('2d');
  const cx = (bbox.minX + bbox.maxX) / 2;
  const cy = (bbox.minY + bbox.maxY) / 2;
  ctx.drawImage(img, cx - side / 2, cy - side / 2, side, side, 0, 0, side, side);
  return canvas;
}

function tint(canvas, color) {
  const out = createCanvas(canvas.width, canvas.height);
  const ctx = out.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return out;
}

function resize(canvas, size) {
  const out = createCanvas(size, size);
  out.getContext('2d').drawImage(canvas, 0, 0, size, size);
  return out;
}

const img = await loadImage(sourcePath);
const probe = createCanvas(img.width, img.height);
probe.getContext('2d').drawImage(img, 0, 0);
const bbox = await getAlphaBBox(probe.getContext('2d'), img.width, img.height);

const cropped = cropToCanvas(img, bbox, PADDING_RATIO);

fs.writeFileSync(path.join(publicDir, 'brand-mark-white.png'), cropped.toBuffer('image/png'));

const purple = tint(cropped, BRAND);
fs.writeFileSync(path.join(publicDir, 'brand-mark-purple.png'), purple.toBuffer('image/png'));

// Small icon (white only — every on-page mark except the hero watermark is white and
// displayed at ~20px) so those spots don't ship a full-resolution source for nothing.
const icon = resize(cropped, 96);
fs.writeFileSync(path.join(publicDir, 'brand-mark-icon.png'), icon.toBuffer('image/png'));

// Favicon: purple circle with the white mark centered on top.
const FAV = 512;
const fav = createCanvas(FAV, FAV);
const fctx = fav.getContext('2d');
fctx.fillStyle = BRAND;
fctx.beginPath();
fctx.arc(FAV / 2, FAV / 2, FAV / 2, 0, Math.PI * 2);
fctx.fill();
const markSize = FAV * 0.62;
fctx.drawImage(cropped, (FAV - markSize) / 2, (FAV - markSize) / 2, markSize, markSize);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), fav.toBuffer('image/png'));

console.log('Wrote brand-mark-white.png, brand-mark-purple.png, brand-mark-icon.png, favicon.png');
console.log('Source bbox:', bbox, 'cropped size:', cropped.width, 'x', cropped.height);
