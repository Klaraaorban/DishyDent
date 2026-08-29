import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import content from '../content/content.js';

const STORAGE_KEY = 'dishydent-lang';
const LanguageContext = createContext(null);

function readStoredLang() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'ro' || stored === 'hu') return stored;
  } catch {
    // localStorage unavailable (private mode) — fall back silently
  }
  return null;
}

export function LanguageProvider({ children }) {
  // Always starts at the default so the first client render matches the
  // prerendered server HTML (which has no access to localStorage) — a stored
  // preference, if any, is applied a moment later in the effect below.
  const [lang, setLangState] = useState('ro');

  useEffect(() => {
    const stored = readStoredLang();
    if (stored && stored !== lang) setLangState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = content[lang].htmlLang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage failures
    }
  }, [lang]);

  const setLang = (next) => setLangState(next === 'hu' ? 'hu' : 'ro');
  const toggleLang = () => setLangState((prev) => (prev === 'ro' ? 'hu' : 'ro'));

  const value = useMemo(() => ({ lang, setLang, toggleLang, t: content[lang] }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export { STORAGE_KEY as LANG_STORAGE_KEY };
