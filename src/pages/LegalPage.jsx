import { useLanguage } from '../context/LanguageContext.jsx';
import LegalHeader from '../components/LegalHeader.jsx';
import Footer from '../components/Footer.jsx';
import './legal.css';

export default function LegalPage({ data }) {
  const { lang } = useLanguage();
  const page = data[lang];

  return (
    <>
      <LegalHeader />
      <main id="main" className="legal-page">
        <div className="container legal-page__inner">
          <h1>{page.title}</h1>
          <p className="legal-page__updated">{page.updated}</p>
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
