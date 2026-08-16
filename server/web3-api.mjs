import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import {
  createManifest,
  getLearningPath,
  lookupGlossary,
  searchContent,
} from '../scripts/ai-content-core.mjs';
import { OPENAPI_DOCUMENT } from './openapi.mjs';

const API_PREFIX = '/api/v1';
const CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=86400';
const LANGUAGES = ['zh', 'en'];
const ROLES = ['beginner', 'builder', 'researcher', 'investor'];
const REST_API = {
  version: 'v1',
  authentication: 'none',
  readOnly: true,
  baseUrl: 'https://bhbtc.xyz/api/v1',
  openapiUrl: 'https://bhbtc.xyz/api/v1/openapi.json',
  documentationUrl: 'https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/api.md',
};
const contentIndexPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../ai/content-index.json'
);
const languageSchema = z.enum(LANGUAGES);
const roleSchema = z.enum(ROLES);
let contentIndexPromise;

class ApiInputError extends Error {}

export async function handleWeb3ApiRequest(request, response) {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== 'GET') {
    sendJson(response, {
      status: 405,
      body: {
        error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET and OPTIONS are supported' },
      },
    });
    return;
  }

  try {
    const url = new URL(request.url || '/', 'http://localhost');
    const route = normalizeRoute(url.pathname);
    const index = route === 'openapi.json' ? null : await loadContentIndex();
    const result = dispatchRoute(route, url.searchParams, index);
    sendJson(response, result);
  } catch (error) {
    if (error instanceof ApiInputError) {
      sendJson(response, {
        status: 400,
        body: { error: { code: 'INVALID_QUERY', message: error.message } },
        cacheable: false,
      });
      return;
    }

    sendJson(response, {
      status: 500,
      body: {
        error: { code: 'INTERNAL_ERROR', message: 'The API could not process this request' },
      },
      cacheable: false,
    });
  }
}

function dispatchRoute(route, searchParams, index) {
  if (route === '') {
    return { status: 200, body: createApiDescription() };
  }

  if (route === 'openapi.json') {
    return { status: 200, body: OPENAPI_DOCUMENT };
  }

  if (route === 'manifest') {
    return { status: 200, body: { data: { ...createManifest(index), restApi: REST_API } } };
  }

  if (route === 'search') {
    const query = parseText(searchParams.get('q'), 'q', true);
    const lang = parseLanguage(searchParams.get('lang'));
    const limit = parseInteger(searchParams.get('limit'), 'limit', {
      fallback: 5,
      minimum: 1,
      maximum: 20,
    });
    const result = searchContent(index, { query, lang, limit });
    return { status: 200, body: { data: result.results, meta: { query, lang, limit } } };
  }

  if (route === 'lessons') {
    return listLessons(index, searchParams);
  }

  if (route.startsWith('lessons/')) {
    return findLesson(index, route);
  }

  if (route === 'glossary') {
    const query = parseText(searchParams.get('q'), 'q');
    const limit = parseInteger(searchParams.get('limit'), 'limit', {
      fallback: 5,
      minimum: 1,
      maximum: 20,
    });
    const result = lookupGlossary(index, { query, limit });
    return { status: 200, body: { data: result.results, meta: { query, limit } } };
  }

  if (route === 'learning-path') {
    const role = parseRole(searchParams.get('role'));
    const lang = parseLanguage(searchParams.get('lang'));
    return { status: 200, body: { data: getLearningPath(index, { role, lang }) } };
  }

  return { status: 404, body: { error: { code: 'NOT_FOUND', message: 'Endpoint not found' } } };
}

function listLessons(index, searchParams) {
  const lang = parseLanguage(searchParams.get('lang'));
  const moduleId = parseText(searchParams.get('moduleId'), 'moduleId');
  const limit = parseInteger(searchParams.get('limit'), 'limit', {
    fallback: 20,
    minimum: 1,
    maximum: 100,
  });
  const offset = parseInteger(searchParams.get('offset'), 'offset', {
    fallback: 0,
    minimum: 0,
    maximum: Number.MAX_SAFE_INTEGER,
  });
  const lessons = index.lessons.filter(
    (lesson) => lesson.lang === lang && (!moduleId || lesson.moduleId === moduleId)
  );

  return {
    status: 200,
    body: {
      data: lessons.slice(offset, offset + limit),
      meta: { lang, moduleId: moduleId || null, limit, offset, total: lessons.length },
    },
  };
}

function findLesson(index, route) {
  const segments = route.split('/');
  if (segments.length !== 4) {
    return { status: 404, body: { error: { code: 'NOT_FOUND', message: 'Endpoint not found' } } };
  }

  const [, rawLang, moduleId, lessonId] = segments;
  const lang = parseLanguage(rawLang);
  const lesson = index.lessons.find(
    (candidate) =>
      candidate.lang === lang && candidate.moduleId === moduleId && candidate.lessonId === lessonId
  );

  if (!lesson) {
    return {
      status: 404,
      body: { error: { code: 'LESSON_NOT_FOUND', message: 'Lesson not found' } },
    };
  }

  return { status: 200, body: { data: lesson } };
}

function parseLanguage(value) {
  const result = languageSchema.safeParse(value || 'zh');
  if (!result.success) {
    throw new ApiInputError(`lang must be one of: ${LANGUAGES.join(', ')}`);
  }
  return result.data;
}

function parseRole(value) {
  const result = roleSchema.safeParse(value || 'beginner');
  if (!result.success) {
    throw new ApiInputError(`role must be one of: ${ROLES.join(', ')}`);
  }
  return result.data;
}

function parseInteger(value, name, { fallback, minimum, maximum }) {
  if (value === null) {
    return fallback;
  }
  const result = z.coerce.number().int().min(minimum).max(maximum).safeParse(value);
  if (!result.success) {
    throw new ApiInputError(`${name} must be an integer between ${minimum} and ${maximum}`);
  }
  return result.data;
}

function parseText(value, name, required = false) {
  const normalized = String(value || '').trim();
  if (required && !normalized) {
    throw new ApiInputError(`${name} is required`);
  }
  if (normalized.length > 120) {
    throw new ApiInputError(`${name} must be at most 120 characters`);
  }
  return normalized;
}

function normalizeRoute(pathname) {
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/';
  if (normalizedPathname === API_PREFIX) {
    return '';
  }
  if (!normalizedPathname.startsWith(`${API_PREFIX}/`)) {
    return '__not_found__';
  }
  return normalizedPathname.slice(API_PREFIX.length + 1);
}

function createApiDescription() {
  return {
    name: 'Get Started with Web3',
    version: 'v1',
    description: 'Free, read-only access to bilingual Web3 learning content.',
    authentication: 'None',
    documentation: `${API_PREFIX}/openapi.json`,
    endpoints: [
      `${API_PREFIX}/manifest`,
      `${API_PREFIX}/lessons`,
      `${API_PREFIX}/search`,
      `${API_PREFIX}/glossary`,
      `${API_PREFIX}/learning-path`,
    ],
  };
}

function loadContentIndex() {
  contentIndexPromise ||= readFile(contentIndexPath, 'utf8').then((content) => JSON.parse(content));
  return contentIndexPromise;
}

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('X-Content-Type-Options', 'nosniff');
}

function sendJson(response, { status, body, cacheable = true }) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', cacheable ? CACHE_CONTROL : 'no-store');
  response.end(JSON.stringify(body));
}
