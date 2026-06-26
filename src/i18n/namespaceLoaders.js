import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import zhCommon from './locales/zh/common.json';
import zhNav from './locales/zh/nav.json';

export const EAGER_I18N_SECTIONS = ['common', 'nav'];

export const I18N_SECTIONS = [
  'common',
  'nav',
  'landing',
  'dashboard',
  'reader',
  'badges',
  'ai',
  'quiz',
  'search',
  'share',
  'articles',
  'support',
  'contributors',
  'donation',
  'sponsor',
  'thankAuthor',
  'error',
  'markdown',
  'glossary',
  'walletLab',
  'siweLab',
  'accountAbstractionLab',
];

export const eagerI18nResources = {
  en: {
    translation: {
      common: enCommon,
      nav: enNav,
    },
  },
  zh: {
    translation: {
      common: zhCommon,
      nav: zhNav,
    },
  },
};

export function getEagerI18nResources() {
  return JSON.parse(JSON.stringify(eagerI18nResources));
}

const localeSectionLoaders = import.meta.glob([
  './locales/*/*.json',
  '!./locales/*/common.json',
  '!./locales/*/nav.json',
]);
const pendingSectionLoads = new Map();

export function normalizeI18nLanguage(language) {
  return language?.split('-')[0] === 'zh' ? 'zh' : 'en';
}

function hasSection(i18n, language, section) {
  return i18n.getResource(normalizeI18nLanguage(language), 'translation', section) !== undefined;
}

async function loadI18nSection(i18n, section, language) {
  const lng = normalizeI18nLanguage(language);

  if (hasSection(i18n, lng, section)) {
    return true;
  }

  const cacheKey = `${lng}/${section}`;
  if (pendingSectionLoads.has(cacheKey)) {
    return pendingSectionLoads.get(cacheKey);
  }

  const loader = localeSectionLoaders[`./locales/${lng}/${section}.json`];
  if (!loader) {
    const error = new Error(`Unknown i18n section: ${section}`);
    console.warn(`[i18n] Failed to load ${cacheKey}`, error);
    return false;
  }

  const loadPromise = loader()
    .then((module) => {
      const sectionMessages = module.default ?? module;
      i18n.addResourceBundle(lng, 'translation', { [section]: sectionMessages }, true, true);
      return true;
    })
    .catch((error) => {
      console.warn(`[i18n] Failed to load ${cacheKey}`, error);
      return false;
    })
    .finally(() => {
      pendingSectionLoads.delete(cacheKey);
    });

  pendingSectionLoads.set(cacheKey, loadPromise);
  return loadPromise;
}

export async function loadI18nSections(i18n, sections, language) {
  const uniqueSections = [...new Set(sections)];
  const results = await Promise.all(
    uniqueSections.map((section) => loadI18nSection(i18n, section, language))
  );

  return results.every(Boolean);
}

export function getRouteI18nSections(pathname) {
  const normalizedPath = pathname.replace(/^\/Get-Started-with-Web3(?=\/|$)/, '');
  const [, maybeLang, route] = normalizedPath.split('/');
  const langAwareRoute = ['en', 'zh'].includes(maybeLang) ? route : maybeLang;

  if (!langAwareRoute) {
    return ['landing', 'support', 'donation', 'sponsor'];
  }

  if (langAwareRoute === 'dashboard') {
    return ['dashboard'];
  }

  if (langAwareRoute === 'learn') {
    return ['reader', 'markdown', 'quiz', 'ai', 'thankAuthor', 'share', 'sponsor'];
  }

  if (langAwareRoute === 'badges') {
    return ['badges', 'share'];
  }

  if (langAwareRoute === 'articles') {
    return ['articles'];
  }

  if (langAwareRoute === 'support') {
    return ['support', 'donation'];
  }

  if (langAwareRoute === 'contributors') {
    return ['contributors', 'support'];
  }

  if (langAwareRoute === 'glossary') {
    return ['glossary'];
  }

  if (langAwareRoute === 'labs' && normalizedPath.includes('/labs/account-abstraction')) {
    return ['accountAbstractionLab'];
  }

  if (langAwareRoute === 'labs' && normalizedPath.includes('/labs/siwe')) {
    return ['siweLab'];
  }

  if (langAwareRoute === 'labs') {
    return ['walletLab'];
  }

  return [];
}
