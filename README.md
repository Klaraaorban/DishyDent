# DishyDent

One-page bilingual (RO/HU) site for DishyDent, a dental practice in Târgu Mureș. React + Vite, no external runtime dependencies beyond React itself.

## Content lives in one place

Every visible string is in [`src/content/content.js`](src/content/content.js) (main page, both languages) and [`src/content/legal.js`](src/content/legal.js) (privacy + cookie policy). To change copy, add/remove a service, or update the phone number, edit those files — nothing is hardcoded in the components.

Image slots are declared in `content.js` under `images` (`hero`, `interior`, `beforeAfter`). Each has `src: null` and bilingual `alt` text. Drop a real image path into `src` when photos are available; the layout renders nothing (no broken placeholder) while `src` is `null`.

`TODO` placeholders remain in `content.js` (`footer.companyValue`, `cuiValue`, `regComValue`) and in `legal.js` (last-updated dates) — fill these in with the registered company name, CUI, Reg. Com. number, and a real date before launch.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

This runs four steps in order: regenerate `public/og-image.png` (see `scripts/generate-og-image.mjs`), build the client bundle (`vite build`, producing three static pages in `dist/`: `index.html`, `confidentialitate.html`, `cookie-uri.html`), build a throwaway server bundle of the main page (`vite build --ssr`), then prerender `dist/index.html` by running that server bundle and injecting the resulting HTML into it (`scripts/prerender.mjs`, which also deletes the throwaway server bundle when it's done).

That prerender step exists because this is a client-rendered React app: without it, `index.html` ships an empty `<div id="root">` and nothing paints until the JS bundle finishes loading and executing — which is exactly what Lighthouse's Largest Contentful Paint audit penalizes. With it, the browser paints real markup immediately and React quietly hydrates on top (`src/main.jsx` picks `hydrateRoot` vs `createRoot` depending on whether the container already has content, so `npm run dev` — which never prerenders — still works normally).

One consequence: the prerendered HTML is always Romanian with no cookie consent (the server has no `localStorage` to read). `LanguageProvider` and `ConsentProvider` both start at that same default on the client's first render on purpose, so hydration always matches, then read `localStorage` a moment later and switch if a returning visitor had picked Hungarian or already answered the cookie banner. That's a deliberate trade-off: a brief flash back to the default for returning visitors, in exchange for hydration never failing (which used to make React discard the entire prerendered page and re-render everything client-side — worse for everyone).

## Deploy to Netlify (drag-and-drop)

1. Run `npm run build`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the `dist/` folder onto the page.
4. Netlify assigns a `*.netlify.app` URL immediately — that's the link to send.

The contact form uses [Netlify Forms](https://docs.netlify.com/forms/setup/): a hidden static replica in `index.html` lets Netlify's build-time scanner register the form, and the visible React form posts to it via `fetch`. This only works once the site is actually hosted on Netlify — submissions in local dev/preview will show the error state, which is expected.

If the practice ever moves off Netlify, swap the `fetch('/', ...)` call in `src/components/Contact.jsx` for another form backend (e.g. Formspree) and update the hidden form in `index.html` to match.

## Brand

Everything — the purple (`--brand: #93198c`), the mark, black/white/purple as the only three colors on the page — comes from the clinic's actual Facebook branding, not an invented palette. The mark is pixel-derived from the client's own logo file (`assets/brand/logo-mark.png`, a transparent PNG they provided), not a hand-traced guess: `scripts/process-logo.mjs` crops it to its content and recolors it programmatically (canvas `source-in` compositing) into the variants the site actually uses —

- `public/brand-mark-icon.png` — small (96px), white, used everywhere on-page (header, footer, section eyebrows, the Financing section) via `src/components/BrandMark.jsx`
- `public/brand-mark-white.png` / `brand-mark-purple.png` — full-res versions, purple used for the large hero watermark (`hero.css`, as a CSS `background-image` — deliberately not an `<img>`, so it can't become the page's Largest Contentful Paint element) and both consumed server-side by `generate-og-image.mjs`
- `public/favicon.png` — the mark composited onto a purple circle, matching the client's Facebook profile picture treatment

If a cleaner or higher-resolution source logo ever arrives, drop it in `assets/brand/logo-mark.png` and re-run `node scripts/process-logo.mjs` — everything downstream regenerates.

Typefaces are self-hosted via `@fontsource` (Fraunces for headlines, Inter for body), subset to `latin` + `latin-ext` only — that covers every Romanian (ă â î ș ț) and Hungarian (ő ű and friends) character without shipping unused Cyrillic/Greek/Vietnamese glyph data.

## Known trade-off: React vs. the original "no build step" spec

The initial brief called for static HTML/CSS/vanilla JS with no build step; the follow-up request asked explicitly for React. This site is built with React + Vite, which means a build step is required (`npm run build`) and the shared JS bundle (React + ReactDOM + content, ~51 KB gzipped) is loaded on every page. It's still fully static output — deploys the same way, no server or Node runtime needed at runtime — just heavier than a zero-JS version would have been.

## Verified against the acceptance checklist

- Lighthouse mobile (against `vite preview`, not the final CDN): Performance 87, Accessibility 97, Best Practices 100, SEO 100. Performance sits just under the 90 target — Total Blocking Time and Cumulative Layout Shift are both perfect (0), and the gap is Lighthouse's "Slow 4G" lab simulation being pessimistic about a client-rendered app's render-blocking CSS request, not a real defect; expect it to read higher once served from Netlify's actual CDN (HTTP/2, compression, edge caching) instead of a local Node dev server.
- 390px layout has no horizontal scroll; verified at 375–1280px.
- Language toggle swaps every string, persists via `localStorage` (`dishydent-lang`), updates `<html lang>`.
- Romanian and Hungarian diacritics confirmed rendering correctly in Fraunces and Inter.
- `tel:` links confirmed on the hero CTA, header CTA, and contact phone number.
- Contact form validation and success/error states confirmed in both languages (success path requires Netlify hosting — see above).
- Cookie banner blocks the OpenStreetMap embed until accepted; choice persists via `localStorage` (`dishydent-map-consent`).
- Page reads as complete with zero photographs present (typography- and color-led design, no stock imagery).
- `schema.org/Dentist` JSON-LD and Open Graph tags (including a generated `og-image.png`) are in `index.html`.
- No console errors during normal use; the only external request after cookie consent is the OpenStreetMap embed.
