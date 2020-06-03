import i18n from 'i18next';
import zh from './zh';
import en from './en';

i18n.init({
  resources: {
    en,
    zh
  },
  lng: 'zh',
  fallbackLng: 'zh',
  debug: true,
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  }
});

export default i18n;
