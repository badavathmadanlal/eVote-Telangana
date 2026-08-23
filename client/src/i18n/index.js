import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations, LANGUAGES } from './translations.js';

const STORAGE_KEY = 'evote-lang';

// Retrieve saved language from localStorage or default to English ('en')
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const validLanguageCodes = LANGUAGES.map(l => l.code);
const initialLanguage = (savedLanguage && validLanguageCodes.includes(savedLanguage)) ? savedLanguage : 'en';

// Format resources for i18next
const resources = {
  en: { translation: translations.en },
  te: { translation: translations.te },
  hi: { translation: translations.hi },
  ta: { translation: translations.ta },
  kn: { translation: translations.kn },
  mr: { translation: translations.mr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    returnNull: false,
    returnEmptyString: false,
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Synchronize language selection with localStorage
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
  }
});

export const changeLanguage = (lng) => {
  if (validLanguageCodes.includes(lng)) {
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lng);
    }
  }
};

export { LANGUAGES };
export default i18n;
