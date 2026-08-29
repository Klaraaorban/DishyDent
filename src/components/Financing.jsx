import { useLanguage } from '../context/LanguageContext.jsx';
import useReveal from '../hooks/useReveal.js';
import BrandMark from './BrandMark.jsx';
import './financing.css';

export default function Financing() {
  const { t } = useLanguage();
  const f = t.financing;
  const ref = useReveal();

  return (
    <section id="finantare" className="section financing">
      <div className="container financing__inner">
        <div ref={ref} className="reveal">
          <p className="eyebrow">
            <BrandMark className="brand-mark" />
            {f.eyebrow}
          </p>
          <h2 className="financing__heading">{f.heading}</h2>
          <p className="financing__body">{f.body}</p>
          <ul className="financing__points">
            {f.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="financing__disclaimer">{f.disclaimer}</p>
        </div>
        <div className="financing__badge" aria-hidden="true">
          <span>TBI</span>
          <span>Bank</span>
        </div>
      </div>
    </section>
  );
}
