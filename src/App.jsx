import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';
import { ConsentProvider } from './context/ConsentContext.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Financing from './components/Financing.jsx';
import Contact from './components/Contact.jsx';
import Reviews from './components/Reviews.jsx';
import Footer from './components/Footer.jsx';
import CookieConsent from './components/CookieConsent.jsx';

function Page() {
  const { t } = useLanguage();
  return (
    <>
      <a href="#main" className="skip-link">
        {t.skipLink}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Services />
        <Financing />
        <Contact />
        <Reviews />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ConsentProvider>
        <Page />
      </ConsentProvider>
    </LanguageProvider>
  );
}
