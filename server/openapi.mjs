const errorResponse = {
  description: 'Invalid request',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
    },
  },
};

const languageParameter = {
  name: 'lang',
  in: 'query',
  schema: { type: 'string', enum: ['zh', 'en'], default: 'zh' },
};

const limitParameter = {
  name: 'limit',
  in: 'query',
  schema: { type: 'integer', minimum: 1, maximum: 20, default: 5 },
};

export const OPENAPI_DOCUMENT = {
  openapi: '3.1.0',
  info: {
    title: 'Get Started with Web3 API',
    version: '1.0.0',
    description: 'Free, read-only access to bilingual Web3 lessons, glossary, and learning paths.',
    license: {
      name: 'MIT',
      identifier: 'MIT',
    },
  },
  servers: [{ url: 'https://get-started-with-web3.vercel.app' }],
  paths: {
    '/api/v1': {
      get: {
        summary: 'Describe the API',
        responses: { 200: { description: 'API metadata' } },
      },
    },
    '/api/v1/manifest': {
      get: {
        summary: 'Read the AI-native service manifest',
        responses: { 200: { description: 'Service manifest' } },
      },
    },
    '/api/v1/search': {
      get: {
        summary: 'Search lessons and glossary entries',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string', maxLength: 120 } },
          languageParameter,
          limitParameter,
        ],
        responses: { 200: { description: 'Ranked search results' }, 400: errorResponse },
      },
    },
    '/api/v1/lessons': {
      get: {
        summary: 'List lesson metadata',
        parameters: [
          languageParameter,
          { name: 'moduleId', in: 'query', schema: { type: 'string' } },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, default: 0 } },
        ],
        responses: { 200: { description: 'Paginated lessons' }, 400: errorResponse },
      },
    },
    '/api/v1/lessons/{lang}/{moduleId}/{lessonId}': {
      get: {
        summary: 'Read lesson metadata by stable identifiers',
        parameters: [
          {
            name: 'lang',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: ['zh', 'en'] },
          },
          { name: 'moduleId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'lessonId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Lesson metadata and citations' },
          400: errorResponse,
          404: { description: 'Lesson not found' },
        },
      },
    },
    '/api/v1/glossary': {
      get: {
        summary: 'Search Web3 glossary entries',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string', maxLength: 120 } },
          limitParameter,
        ],
        responses: { 200: { description: 'Glossary entries' }, 400: errorResponse },
      },
    },
    '/api/v1/learning-path': {
      get: {
        summary: 'Get a role-based learning path',
        parameters: [
          {
            name: 'role',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['beginner', 'builder', 'researcher', 'investor'],
              default: 'beginner',
            },
          },
          languageParameter,
        ],
        responses: { 200: { description: 'Ordered learning path' }, 400: errorResponse },
      },
    },
    '/api/v1/openapi.json': {
      get: {
        summary: 'Download this OpenAPI document',
        responses: { 200: { description: 'OpenAPI 3.1 contract' } },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
