import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadI18nSections, normalizeI18nLanguage } from './namespaceLoaders';

export function useI18nSections(sections, language) {
  const { i18n } = useTranslation();
  const lng = normalizeI18nLanguage(language ?? i18n.language);
  const sectionKey = useMemo(() => [...new Set(sections)].sort().join('|'), [sections]);
  const loadKey = `${lng}:${sectionKey}`;
  const [readyKey, setReadyKey] = useState('');

  useEffect(() => {
    let cancelled = false;
    const normalizedSections = sectionKey ? sectionKey.split('|') : [];

    if (normalizedSections.length === 0) {
      return undefined;
    }

    loadI18nSections(i18n, normalizedSections, lng).then(() => {
      if (!cancelled) {
        setReadyKey(loadKey);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [i18n, lng, loadKey, sectionKey]);

  return sectionKey === '' || readyKey === loadKey;
}
