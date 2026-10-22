import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../translations/en';
import { ta } from '../translations/ta';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('neurosense_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('neurosense_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const setLang = (lang) => {
    if (lang === 'en' || lang === 'ta') {
      setLanguage(lang);
    }
  };

  const t = language === 'ta' ? ta : en;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
