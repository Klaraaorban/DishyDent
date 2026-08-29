import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'dishydent-map-consent';
const ConsentContext = createContext(null);

function readStoredConsent() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'declined') return stored;
  } catch {
    // ignore
  }
  return null;
}

export function ConsentProvider({ children }) {
  // Starts at null (matching the server, which has no localStorage) so the
  // first client render doesn't fight the prerendered HTML; a stored choice,
  // if any, is picked up a moment later in the effect below.
  const [consent, setConsentState] = useState(null);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) setConsentState(stored);
  }, []);

  useEffect(() => {
    if (!consent) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // ignore storage failures
    }
  }, [consent]);

  const accept = () => setConsentState('accepted');
  const decline = () => setConsentState('declined');

  return (
    <ConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
