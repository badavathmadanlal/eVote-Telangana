import en from './locales/en.js';
import te from './locales/te.js';
import hi from './locales/hi.js';
import ta from './locales/ta.js';
import kn from './locales/kn.js';
import mr from './locales/mr.js';

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export const translations = {
  en,
  te,
  hi,
  ta,
  kn,
  mr,
};

export default translations;
