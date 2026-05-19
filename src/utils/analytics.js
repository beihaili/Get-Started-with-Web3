import {
  APP_BASE_PATH,
  SITE_BASE_URL,
  buildSiteUrl,
  joinBasePath,
  normalizeBasePath,
  normalizeSiteBaseUrl,
} from '../config/siteConfig';

function buildRoutePath(location = {}) {
  const pathname = location.pathname || '/';
  const search = location.search || '';
  const hash = location.hash || '';
  return `${pathname}${search}${hash}`;
}

export function buildAnalyticsPagePayload(location, options = {}) {
  const basePath = normalizeBasePath(options.basePath || APP_BASE_PATH);
  const siteBaseUrl = normalizeSiteBaseUrl(options.siteBaseUrl || SITE_BASE_URL);
  const routePath = buildRoutePath(location);
  const pageLocation = buildSiteUrl(routePath, siteBaseUrl);
  const pageUrl = new URL(pageLocation);
  const pageTitle = typeof document === 'undefined' ? undefined : document.title;
  const referrer = typeof document === 'undefined' ? undefined : document.referrer || undefined;

  return {
    page_path: joinBasePath(basePath, routePath),
    page_location: pageLocation,
    page_title: pageTitle,
    page_referrer: referrer,
    page_hostname: pageUrl.hostname,
  };
}

export function trackPageView(location, options = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', 'page_view', buildAnalyticsPagePayload(location, options));
  return true;
}
