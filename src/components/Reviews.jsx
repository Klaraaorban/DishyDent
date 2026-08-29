import { useLanguage } from '../context/LanguageContext.jsx';
import useReveal from '../hooks/useReveal.js';
import BrandMark from './BrandMark.jsx';
import './reviews.css';

function Stars({ rating }) {
  return (
    <span className="review-card__stars" aria-hidden="true">
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

function ReviewCard({ name, rating, quote }) {
  const ref = useReveal();
  return (
    <li ref={ref} className="review-card reveal">
      <Stars rating={rating} />
      <p className="review-card__quote">{quote}</p>
      <p className="review-card__name">{name}</p>
    </li>
  );
}

export default function Reviews() {
  const { t } = useLanguage();
  const r = t.reviews;

  return (
    <section id="recenzii" className="section reviews">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">
            <BrandMark className="brand-mark" />
            {r.eyebrow}
          </p>
          <h2>{r.heading}</h2>
          <p>{r.intro}</p>
        </div>
        <ul className="reviews__grid">
          {r.items.map((item) => (
            <ReviewCard key={item.name} {...item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
