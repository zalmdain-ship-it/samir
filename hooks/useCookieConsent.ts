import { useState, useEffect, useCallback } from 'react';

const COOKIE_CONSENT_KEY = 'hrms_cookie_consent';

export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState<boolean>(true);

  useEffect(() => {
    try {
      const consent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent !== 'true') {
        setHasConsented(false);
      }
    } catch (error) {
      console.error('Could not read from localStorage', error);
      // If localStorage is unavailable, assume consent to not block the UI
      setHasConsented(true);
    }
  }, []);

  const giveConsent = useCallback(() => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
      setHasConsented(true);
    } catch (error) {
      console.error('Could not write to localStorage', error);
      // Still update state to hide banner even if localStorage fails
      setHasConsented(true);
    }
  }, []);

  return { hasConsented, giveConsent };
}
