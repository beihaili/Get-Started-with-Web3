export const DEFAULT_SITE_BASE_URL = 'https://beihaili.github.io/Get-Started-with-Web3';
export const DEFAULT_BASE_PATH = '/Get-Started-with-Web3/';

export function normalizeSiteBaseUrl(value, fallback = DEFAULT_SITE_BASE_URL) {
  const raw = String(value || fallback).trim();
  return raw.replace(/\/+$/, '');
}

export function normalizeBasePath(value, fallback = DEFAULT_BASE_PATH) {
  const raw = String(value || fallback).trim();
  if (!raw || raw === '/') return '/';
  return `/${raw.replace(/^\/+|\/+$/g, '')}/`;
}

export function joinBasePath(basePath, routePath = '/') {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedRoute = `/${String(routePath || '/').replace(/^\/+/, '')}`;
  if (normalizedBasePath === '/') return normalizedRoute;
  return `${normalizedBasePath.replace(/\/$/, '')}${normalizedRoute}`;
}

export function buildSiteUrl(routePath = '/', siteBaseUrl = DEFAULT_SITE_BASE_URL) {
  const baseUrl = normalizeSiteBaseUrl(siteBaseUrl);
  const normalizedRoute = `/${String(routePath || '/').replace(/^\/+/, '')}`;
  if (normalizedRoute === '/') return `${baseUrl}/`;
  return `${baseUrl}${normalizedRoute}`;
}

export const SITE_BASE_URL = normalizeSiteBaseUrl(import.meta.env?.VITE_SITE_BASE_URL);
export const APP_BASE_PATH = normalizeBasePath(import.meta.env?.VITE_BASE_PATH);
