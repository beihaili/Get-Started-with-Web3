import { createServer } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { handleWeb3ApiRequest } from '../web3-api.mjs';

let server;
let baseUrl;

beforeAll(async () => {
  server = createServer(handleWeb3ApiRequest);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe('Web3 REST API', () => {
  it('describes the public API when requesting the root endpoint', async () => {
    // Given: the API server is running
    // When: a client requests the versioned root endpoint
    const response = await fetch(`${baseUrl}/api/v1`);

    // Then: it receives a cacheable, CORS-enabled API description
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(await response.json()).toMatchObject({
      name: 'Get Started with Web3',
      version: 'v1',
      authentication: 'None',
    });
  });

  it('searches bilingual course content when given a valid query', async () => {
    // Given: a Chinese search query for Bitcoin RPC content
    const url = new URL('/api/v1/search', baseUrl);
    url.searchParams.set('q', 'Bitcoin RPC');
    url.searchParams.set('lang', 'zh');
    url.searchParams.set('limit', '2');

    // When: a client searches the public content index
    const response = await fetch(url);
    const body = await response.json();

    // Then: matching lessons and stable citations are returned
    expect(response.status).toBe(200);
    expect(body.meta).toMatchObject({ query: 'Bitcoin RPC', lang: 'zh', limit: 2 });
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].citation).toHaveProperty('githubUrl');
  });

  it('advertises the hosted REST surface in the service manifest', async () => {
    // Given: the AI-native service manifest endpoint
    // When: a client requests the manifest
    const response = await fetch(`${baseUrl}/api/v1/manifest`);
    const body = await response.json();

    // Then: the versioned REST and OpenAPI URLs are discoverable
    expect(response.status).toBe(200);
    expect(body.data.restApi).toMatchObject({
      version: 'v1',
      authentication: 'none',
      readOnly: true,
      baseUrl: 'https://get-started-with-web3.vercel.app/api/v1',
      openapiUrl: 'https://get-started-with-web3.vercel.app/api/v1/openapi.json',
    });
  });

  it('lists and reads lessons through stable identifiers', async () => {
    // Given: a known lesson and language in the generated index
    const listUrl = new URL('/api/v1/lessons', baseUrl);
    listUrl.searchParams.set('lang', 'en');
    listUrl.searchParams.set('moduleId', 'module-1');
    listUrl.searchParams.set('limit', '3');

    // When: a client lists lessons and follows a stable lesson path
    const listResponse = await fetch(listUrl);
    const listBody = await listResponse.json();
    const detailResponse = await fetch(`${baseUrl}/api/v1/lessons/en/module-1/1-1`);
    const detailBody = await detailResponse.json();

    // Then: both responses expose lesson metadata and citations
    expect(listResponse.status).toBe(200);
    expect(listBody.meta).toMatchObject({ lang: 'en', moduleId: 'module-1', limit: 3 });
    expect(listBody.data).toHaveLength(3);
    expect(detailResponse.status).toBe(200);
    expect(detailBody.data).toMatchObject({ lang: 'en', moduleId: 'module-1', lessonId: '1-1' });
    expect(detailBody.data.citation.siteUrl).toContain('/en/learn/module-1/1-1');
  });

  it('returns glossary entries and role-based learning paths', async () => {
    // Given: a glossary term and a supported learner role
    const glossaryUrl = new URL('/api/v1/glossary', baseUrl);
    glossaryUrl.searchParams.set('q', 'Gas');
    glossaryUrl.searchParams.set('limit', '2');
    const pathUrl = new URL('/api/v1/learning-path', baseUrl);
    pathUrl.searchParams.set('role', 'builder');
    pathUrl.searchParams.set('lang', 'zh');

    // When: a client requests both resources
    const glossaryResponse = await fetch(glossaryUrl);
    const glossaryBody = await glossaryResponse.json();
    const pathResponse = await fetch(pathUrl);
    const pathBody = await pathResponse.json();

    // Then: useful public data is returned without authentication
    expect(glossaryResponse.status).toBe(200);
    expect(glossaryBody.data[0].term).toContain('Gas');
    expect(pathResponse.status).toBe(200);
    expect(pathBody.data.role).toBe('builder');
    expect(pathBody.data.lessons.some((lesson) => lesson.moduleId === 'module-7')).toBe(true);
  });

  it('publishes an OpenAPI contract for every public endpoint', async () => {
    // Given: the documented OpenAPI endpoint
    // When: a client downloads the machine-readable contract
    const response = await fetch(`${baseUrl}/api/v1/openapi.json`);
    const document = await response.json();

    // Then: the versioned public routes are declared
    expect(response.status).toBe(200);
    expect(document.openapi).toBe('3.1.0');
    expect(Object.keys(document.paths)).toEqual(
      expect.arrayContaining([
        '/api/v1/search',
        '/api/v1/lessons',
        '/api/v1/lessons/{lang}/{moduleId}/{lessonId}',
        '/api/v1/glossary',
        '/api/v1/learning-path',
      ])
    );
  });

  it('rejects invalid boundary input with a stable error shape', async () => {
    // Given: an unsupported language value
    // When: a client sends it to the search endpoint
    const response = await fetch(`${baseUrl}/api/v1/search?q=wallet&lang=fr`);
    const body = await response.json();

    // Then: the API returns a structured client error
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: {
        code: 'INVALID_QUERY',
        message: 'lang must be one of: zh, en',
      },
    });
  });

  it('supports CORS preflight without executing a resource handler', async () => {
    // Given: a browser preflight request
    // When: it targets a public endpoint
    const response = await fetch(`${baseUrl}/api/v1/search`, { method: 'OPTIONS' });

    // Then: the API advertises its read-only CORS contract
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('access-control-allow-methods')).toBe('GET, OPTIONS');
  });
});
