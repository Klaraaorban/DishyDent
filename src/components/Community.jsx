import { useLanguage } from '../context/LanguageContext.jsx';
import { clinic } from '../content/content.js';
import useReveal from '../hooks/useReveal.js';
import BrandMark from './BrandMark.jsx';
import './community.css';

export default function Community() {
  const { t } = useLanguage();
  const c = t.community;
  const ref = useReveal();

  return (
    <section id="comunitate" className="section community">
      <div className="container community__inner">
        <div ref={ref} className="reveal">
          <p className="eyebrow">
            <BrandMark className="brand-mark" />
            {c.eyebrow}
          </p>
          <h2 className="community__heading">{c.heading}</h2>
          <p className="community__body">{c.body}</p>
          <a className="btn btn-primary" href={clinic.facebook} target="_blank" rel="noopener noreferrer">
            {c.cta}
          </a>
        </div>
        <div className="community__stat">
          <span className="community__stat-number">{c.statNumber}</span>
          <span className="community__stat-label">{c.statLabel}</span>
        </div>
      </div>
    </section>
  );
}
