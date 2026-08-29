import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { clinic } from '../content/content.js';
import BrandMark from './BrandMark.jsx';
import './header.css';

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <a href="#top" className="site-header__brand" onClick={closeMenu}>
          <BrandMark className="brand-mark" />
          <span>{clinic.name}</span>
        </a>

        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">Menu</span>
          <span className="site-header__toggle-bar" />
        </button>

        <nav id="primary-nav" className={`site-header__nav${open ? ' is-open' : ''}`} aria-label="Primary">
          <ul>
            <li>
              <a href="#servicii" onClick={closeMenu}>
                {t.nav.services}
              </a>
            </li>
            <li>
              <a href="#finantare" onClick={closeMenu}>
                {t.nav.financing}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={closeMenu}>
                {t.nav.contact}
              </a>
            </li>
          </ul>

          <div className="site-header__actions">
            <button
              type="button"
              className="site-header__lang"
              onClick={toggleLang}
              lang={lang === 'ro' ? 'hu' : 'ro'}
              aria-label={t.nav.langName}
            >
              {t.nav.langCode}
            </button>
            <a className="btn btn-primary site-header__call" href={`tel:${clinic.phone.replace(/\s+/g, '')}`}>
              {t.nav.callNow}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
