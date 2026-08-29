import { useLanguage } from '../context/LanguageContext.jsx';
import { clinic, images } from '../content/content.js';
import BrandMark from './BrandMark.jsx';
import './hero.css';

export default function Hero() {
  const { t, lang } = useLanguage();
  const hero = t.hero;

  return (
    <section id="top" className="hero">
      {/* CSS background, not <img> — decorative, and keeps it out of the LCP calculation */}
      <div className="hero__watermark" aria-hidden="true" />
      {images.hero.src ? (
        <img className="hero__photo" src={images.hero.src} alt={images.hero.alt[lang]} />
      ) : null}
      <div className="container hero__inner">
        <p className="eyebrow">
          <BrandMark className="brand-mark" />
          {hero.eyebrow}
        </p>
        <h1 className="hero__headline">{hero.headline}</h1>
        <p className="hero__sub">{hero.sub}</p>
        <div className="hero__actions">
          <a className="btn btn-primary" href={`tel:${clinic.phone.replace(/\s+/g, '')}`} aria-label={hero.ctaPrimaryAria}>
            {hero.ctaPrimary} — {clinic.phoneDisplay}
          </a>
          <a className="btn btn-secondary" href="#servicii">
            {hero.ctaSecondary}
          </a>
        </div>
        <p className="hero__note">{hero.note}</p>
      </div>
    </section>
  );
}
