import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['en', 'zh'];

/**
 * Reads :lang from URL and syncs it to i18next.
 * URL is the single source of truth for language.
 */
export default function LanguageProvider({ children }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
    if (i18n.language !== resolvedLang) {
      i18n.changeLanguage(resolvedLang);
    }
  }, [lang, i18n]);

  return children;
}
