import { useMemo, useState } from 'react';
import { translations } from '../data/translations';
import { LanguageContext } from './languageContext';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('mana_seva_language') || 'en');

  const value = useMemo(() => ({
    language,
    setLanguage(next) {
      localStorage.setItem('mana_seva_language', next);
      setLanguage(next);
    },
    t(key) {
      return translations[language]?.[key] || translations.en[key] || key;
    }
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
