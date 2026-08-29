// Injects server-rendered HTML into dist/index.html so the browser paints real
// content immediately instead of a blank page while the JS bundle loads —
// otherwise, as a client-rendered SPA, FCP/LCP are gated entirely behind
// downloading + parsing + executing React before anything appears at all.
// React hydrates on top client-side (see the hydrateRoot branch in main.jsx).
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')));
const appHtml = render();

const indexPath = path.join(root, 'dist', 'index.html');
const html = fs.readFileSync(indexPath, 'utf-8');
const injected = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

if (injected === html) {
  throw new Error('Prerender: could not find <div id="root"></div> in dist/index.html');
}

fs.writeFileSync(indexPath, injected);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Prerendered index.html (', appHtml.length, 'chars )');
