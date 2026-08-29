import { useLanguage } from '../context/LanguageContext.jsx';
import { useConsent } from '../context/ConsentContext.jsx';
import './cookie-consent.css';

export default function CookieConsent() {
  const { t } = useLanguage();
  const { consent, accept, decline } = useConsent();
  const b = t.cookieBanner;

  if (consent) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label={b.linkText}>
      <div className="cookie-banner__inner">
        <p>
          {b.text} <a href="/cookie-uri.html">{b.linkText}</a>
        </p>
        <div className="cookie-banner__actions">
          <button type="button" className="btn btn-secondary" onClick={decline}>
            {b.decline}
          </button>
          <button type="button" className="btn btn-primary" onClick={accept}>
            {b.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
