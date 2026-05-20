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

function getCurrentLocation() {
  if (typeof window === 'undefined') {
    return {};
  }

  return window.location;
}

function sanitizeAnalyticsParam(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, 120) : undefined;
  }

  return undefined;
}

function sanitizeAnalyticsParams(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    const safeValue = sanitizeAnalyticsParam(value);
    if (safeValue !== undefined) {
      acc[key] = safeValue;
    }
    return acc;
  }, {});
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

export function buildAnalyticsEventPayload(params = {}, options = {}) {
  const location = options.location || getCurrentLocation();

  return {
    ...buildAnalyticsPagePayload(location, options),
    ...sanitizeAnalyticsParams(params),
  };
}

export function trackPageView(location, options = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', 'page_view', buildAnalyticsPagePayload(location, options));
  return true;
}

export function trackAnalyticsEvent(eventName, params = {}, options = {}) {
  if (
    typeof window === 'undefined' ||
    typeof window.gtag !== 'function' ||
    typeof eventName !== 'string' ||
    eventName.trim() === ''
  ) {
    return false;
  }

  window.gtag('event', eventName.trim(), buildAnalyticsEventPayload(params, options));
  return true;
}
