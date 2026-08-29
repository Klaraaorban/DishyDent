// DishyDent's real logo mark (assets/brand/logo-mark.png), processed by
// scripts/process-logo.mjs. Every on-page use of this component is small
// (~20px) and white, so it ships a 96px source rather than the full-res one —
// the hero's large purple glow watermark is a plain CSS background instead
// (see Hero.jsx / hero.css), both because it's decorative and to keep it out
// of the page's Largest Contentful Paint candidate pool.
export default function BrandMark({ className, decorative = true }) {
  return (
    <img
      className={className}
      src="/brand-mark-icon.png"
      width="96"
      height="96"
      alt={decorative ? '' : 'DishyDent'}
      aria-hidden={decorative ? 'true' : undefined}
    />
  );
}
