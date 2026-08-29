import { useLanguage } from '../context/LanguageContext.jsx';
import { clinic } from '../content/content.js';
import BrandMark from './BrandMark.jsx';
import './header.css';

export default function LegalHeader() {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <header className="site-header is-scrolled">
      <div className="container site-header__inner">
        <a href="/" className="site-header__brand">
          <BrandMark className="brand-mark" />
          <span>{clinic.name}</span>
        </a>
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
          <a className="btn btn-secondary" href="/">
            {t.backHome}
          </a>
        </div>
      </div>
    </header>
  );
}
