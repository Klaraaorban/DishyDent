import { useLanguage } from '../context/LanguageContext.jsx';
import { clinic } from '../content/content.js';
import BrandMark from './BrandMark.jsx';
import './footer.css';

export default function Footer() {
  const { t } = useLanguage();
  const fo = t.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <BrandMark className="brand-mark" />
          <span>{clinic.name}</span>
        </div>

        <dl className="site-footer__legal">
          <div>
            <dt>{fo.companyLabel}</dt>
            <dd>{fo.companyValue}</dd>
          </div>
          <div>
            <dt>{fo.cuiLabel}</dt>
            <dd>{fo.cuiValue}</dd>
          </div>
          <div>
            <dt>{fo.regComLabel}</dt>
            <dd>{fo.regComValue}</dd>
          </div>
        </dl>

        <nav className="site-footer__links" aria-label="Legal">
          <a href="/confidentialitate.html">{fo.privacyLink}</a>
          <a href="/cookie-uri.html">{fo.cookiesLink}</a>
          <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">
            {fo.anpcText}
          </a>
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
            {fo.solText}
          </a>
        </nav>

        <p className="site-footer__rights">{fo.rights(year)}</p>
      </div>
    </footer>
  );
}
