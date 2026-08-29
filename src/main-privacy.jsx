import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-ext-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-ext-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-ext-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-ext-700.css';
import './styles/global.css';
import { LanguageProvider } from './context/LanguageContext.jsx';
import LegalPage from './pages/LegalPage.jsx';
import { privacy } from './content/legal.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <LegalPage data={privacy} />
    </LanguageProvider>
  </StrictMode>
);
