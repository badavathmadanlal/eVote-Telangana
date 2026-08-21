import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { LANGUAGES, changeLanguage as i18nChangeLanguage } from '../i18n/index.js';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18nChangeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <LanguageContext.Provider
      value={{
        language: currentLanguage,
        currentLanguage,
        changeLanguage,
        languages: LANGUAGES,
        t,
        i18n,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: i18n.language || 'en',
      currentLanguage: i18n.language || 'en',
      changeLanguage: i18nChangeLanguage,
      languages: LANGUAGES,
      t: i18n.t.bind(i18n),
      i18n,
    };
  }
  return context;
};

export default LanguageContext;
