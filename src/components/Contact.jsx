import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useConsent } from '../context/ConsentContext.jsx';
import { clinic } from '../content/content.js';
import useReveal from '../hooks/useReveal.js';
import BrandMark from './BrandMark.jsx';
import './contact.css';

const MAP_MARGIN_LNG = 0.006;
const MAP_MARGIN_LAT = 0.003;

function mapEmbedUrl() {
  const left = clinic.lng - MAP_MARGIN_LNG;
  const right = clinic.lng + MAP_MARGIN_LNG;
  const bottom = clinic.lat - MAP_MARGIN_LAT;
  const top = clinic.lat + MAP_MARGIN_LAT;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${clinic.lat}%2C${clinic.lng}`;
}

function encodeForm(data) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

function MapPanel() {
  const { t } = useLanguage();
  const { consent, accept } = useConsent();
  const showMap = consent === 'accepted';

  return (
    <div className="map-panel">
      {showMap ? (
        <iframe
          className="map-panel__frame"
          title="DishyDent — OpenStreetMap"
          src={mapEmbedUrl()}
          loading="lazy"
        />
      ) : (
        <div className="map-panel__gate">
          <p>{t.contact.mapConsent.text}</p>
          <button type="button" className="btn btn-secondary" onClick={accept}>
            {t.contact.mapConsent.button}
          </button>
        </div>
      )}
    </div>
  );
}

function ContactForm() {
  const { t } = useLanguage();
  const f = t.contact.form;
  const [values, setValues] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (field) => (event) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = f.requiredName;
    if (!/^[+0-9 ()-]{6,}$/.test(values.phone.trim())) next.phone = f.requiredPhone;
    if (!values.message.trim()) next.message = f.requiredMessage;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm({ 'form-name': 'contact', ...values }),
      });
      if (!response.ok) throw new Error('Form submission failed');
      setStatus('success');
      setValues({ name: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form
      className="contact-form"
      name="contact"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value="contact" />
      <h3>{f.heading}</h3>

      <div className="contact-form__field">
        <label htmlFor="cf-name">{f.name}</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={f.namePlaceholder}
          value={values.name}
          onChange={handleChange('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'cf-name-error' : undefined}
        />
        {errors.name ? (
          <p className="contact-form__error" id="cf-name-error" role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-phone">{f.phone}</label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={f.phonePlaceholder}
          value={values.phone}
          onChange={handleChange('phone')}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'cf-phone-error' : undefined}
        />
        {errors.phone ? (
          <p className="contact-form__error" id="cf-phone-error" role="alert">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-message">{f.message}</label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          placeholder={f.messagePlaceholder}
          value={values.message}
          onChange={handleChange('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
        />
        {errors.message ? (
          <p className="contact-form__error" id="cf-message-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className="btn btn-primary contact-form__submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? f.submitting : f.submit}
      </button>

      <p className="contact-form__privacy">{f.privacyNote}</p>

      <div role="status" aria-live="polite">
        {status === 'success' ? <p className="contact-form__status contact-form__status--ok">{f.success}</p> : null}
        {status === 'error' ? <p className="contact-form__status contact-form__status--bad">{f.error}</p> : null}
      </div>
    </form>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const ref = useReveal();
  const telHref = `tel:${clinic.phone.replace(/\s+/g, '')}`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div ref={ref} className="reveal section-head">
          <p className="eyebrow">
            <BrandMark className="brand-mark" />
            {c.eyebrow}
          </p>
          <h2>{c.heading}</h2>
          <p>{c.intro}</p>
        </div>

        <div className="contact__grid">
          <div className="contact__details">
            <dl>
              <div>
                <dt>{c.addressLabel}</dt>
                <dd>
                  {clinic.addressLine1}
                  <br />
                  {clinic.addressLine2}
                  <br />
                  <a href={directionsHref} target="_blank" rel="noopener noreferrer">
                    {c.directionsText} ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt>{c.hoursLabel}</dt>
                <dd>
                  {c.hours.map((line) => (
                    <span key={line} className="contact__hours-line">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{c.phoneLabel}</dt>
                <dd>
                  <a href={telHref}>{clinic.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt>{c.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
                </dd>
              </div>
              <div>
                <dt>{c.facebookLabel}</dt>
                <dd>
                  <a href={clinic.facebook} target="_blank" rel="noopener noreferrer">
                    {c.facebookLinkText} ↗
                  </a>
                </dd>
              </div>
            </dl>

            <MapPanel />
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
