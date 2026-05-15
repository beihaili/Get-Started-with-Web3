import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getEagerI18nResources } from './namespaceLoaders';

i18n.use(initReactI18next).init({
  resources: getEagerI18nResources(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
