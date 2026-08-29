import { useLanguage } from '../context/LanguageContext.jsx';
import useReveal from '../hooks/useReveal.js';
import BrandMark from './BrandMark.jsx';
import './services.css';

function ServiceCard({ index, title, desc }) {
  const ref = useReveal();
  return (
    <li ref={ref} className="service-card reveal" style={{ transitionDelay: `${Math.min(index, 6) * 40}ms` }}>
      <span className="service-card__index">{String(index + 1).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </li>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const s = t.services;

  return (
    <section id="servicii" className="section services">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">
            <BrandMark className="brand-mark" />
            {s.eyebrow}
          </p>
          <h2>{s.heading}</h2>
          <p>{s.intro}</p>
        </div>
        <ul className="services__grid">
          {s.items.map((item, i) => (
            <ServiceCard key={item.id} index={i} title={item.title} desc={item.desc} />
          ))}
        </ul>
      </div>
    </section>
  );
}
