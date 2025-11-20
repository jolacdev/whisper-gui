import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

i18n.use(initReactI18next).init({
  defaultNS: 'app',
  fallbackLng: 'en',
  lng: 'en',
  supportedLngs: ['en', 'es'],
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en,
    es,
  },
});

export default i18n;
