#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  composeContext,
  createManifest,
  getLearningPath,
  listMonetizableTools,
  lookupGlossary,
  readLesson,
  searchContent,
} from './ai-content-core.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function loadGeneratedIndex() {
  const indexPath = path.join(projectRoot, 'ai', 'content-index.json');
  try {
    const index = JSON.parse(await readFile(indexPath, 'utf8'));
    index.projectRoot = projectRoot;
    return index;
  } catch (error) {
    throw new Error(
      `AI content index is missing or invalid at ai/content-index.json. Run "npm run ai:index" before starting the MCP server. Original error: ${error.message}`
    );
  }
}

function jsonResult(data, summary) {
  return {
    content: [
      {
        type: 'text',
        text: summary ? `${summary}\n\n${JSON.stringify(data, null, 2)}` : JSON.stringify(data, null, 2),
      },
    ],
    structuredContent: data,
  };
}

function toolAnnotations() {
  return {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };
}

export async function createWeb3McpServer() {
  const index = await loadGeneratedIndex();
  const manifest = createManifest(index);

  const server = new McpServer(
    {
      name: 'get-started-with-web3',
      version: '1.0.0',
    },
    {
      instructions:
        'Read-only Web3 learning content server. Use citations from returned results when answering.',
    }
  );

  server.registerTool(
    'search_web3_content',
    {
      title: 'Search Web3 Course Content',
      description: 'Search lesson titles, headings, excerpts, and glossary definitions.',
      inputSchema: {
        query: z.string().min(1).describe('Search query, such as "Bitcoin RPC" or "智能合约安全".'),
        lang: z.enum(['zh', 'en']).default('zh').describe('Preferred lesson language.'),
        limit: z.number().int().min(1).max(20).default(5).describe('Maximum result count.'),
        includeGlossary: z.boolean().default(true).describe('Whether to include glossary matches.'),
      },
      annotations: toolAnnotations(),
      _meta: { x402: { enabled: false } },
    },
    async ({ query, lang, limit, includeGlossary }) => {
      const result = searchContent(index, { query, lang, limit, includeGlossary });
      return jsonResult(result, `Found ${result.results.length} result(s) for ${query}.`);
    }
  );

  server.registerTool(
    'read_web3_lesson',
    {
      title: 'Read Web3 Lesson',
      description: 'Read a full lesson by lang plus moduleId/lessonId or content path.',
      inputSchema: {
        lang: z.enum(['zh', 'en']).default('zh'),
        moduleId: z.string().optional().describe('Course module id, for example module-4.'),
        lessonId: z.string().optional().describe('Lesson id inside the module, for example 4-2.'),
        path: z.string().optional().describe('Language-agnostic content path from courseData.js.'),
      },
      annotations: toolAnnotations(),
      _meta: { x402: { enabled: false } },
    },
    async ({ lang, moduleId, lessonId, path: lessonPath }) => {
      const lesson = await readLesson(index, { lang, moduleId, lessonId, path: lessonPath });
      return jsonResult(lesson, `Read ${lesson.lang}/${lesson.moduleId}/${lesson.lessonId}: ${lesson.title}.`);
    }
  );

  server.registerTool(
    'get_learning_path',
    {
      title: 'Get Learning Path',
      description: 'Return a role-based learning path for a Web3 learner.',
      inputSchema: {
        role: z.enum(['beginner', 'builder', 'researcher', 'investor']).default('beginner'),
        lang: z.enum(['zh', 'en']).default('zh'),
      },
      annotations: toolAnnotations(),
      _meta: { x402: { enabled: false } },
    },
    async ({ role, lang }) => {
      const result = getLearningPath(index, { role, lang });
      return jsonResult(result, `Learning path for ${role} (${lang}) has ${result.lessons.length} lesson(s).`);
    }
  );

  server.registerTool(
    'lookup_web3_glossary',
    {
      title: 'Lookup Web3 Glossary',
      description: 'Search concise glossary entries for Web3 concepts.',
      inputSchema: {
        query: z.string().optional().describe('Glossary term or concept to search.'),
        limit: z.number().int().min(1).max(20).default(5),
      },
      annotations: toolAnnotations(),
      _meta: { x402: { enabled: false } },
    },
    async ({ query, limit }) => {
      const result = lookupGlossary(index, { query, limit });
      return jsonResult(result, `Found ${result.results.length} glossary entrie(s).`);
    }
  );

  server.registerTool(
    'compose_web3_context',
    {
      title: 'Compose Web3 Context',
      description: 'Build a bounded context pack with citations for a topic.',
      inputSchema: {
        topic: z.string().min(1),
        lang: z.enum(['zh', 'en']).default('zh'),
        limit: z.number().int().min(1).max(8).default(4),
        maxChars: z.number().int().min(500).max(12000).default(4000),
      },
      annotations: toolAnnotations(),
      _meta: { x402: { enabled: false } },
    },
    async ({ topic, lang, limit, maxChars }) => {
      const result = await composeContext(index, { topic, lang, limit, maxChars });
      return jsonResult(result, `Composed context for ${topic} with ${result.citations.length} citation(s).`);
    }
  );

  server.registerTool(
    'list_monetizable_tools',
    {
      title: 'List Monetizable Tools',
      description: 'List future x402-ready paid tool metadata. This server does not enforce payment.',
      annotations: toolAnnotations(),
      _meta: { x402: { enabled: false } },
    },
    async () => {
      const tools = listMonetizableTools(index);
      return jsonResult(
        { tools },
        `Found ${tools.length} future monetizable tool(s). Payment metadata is advisory only in local MCP.`
      );
    }
  );

  server.registerResource(
    'manifest',
    'web3://manifest',
    {
      title: 'Get Started With Web3 AI Manifest',
      description: 'Machine-readable service manifest with MCP and x402 metadata.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(manifest, null, 2) }],
    })
  );

  server.registerResource(
    'content-index',
    'web3://content-index',
    {
      title: 'Get Started With Web3 Content Index',
      description: 'Searchable bilingual lesson and glossary index.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(index, null, 2) }],
    })
  );

  server.registerPrompt(
    'web3_lesson_tutor',
    {
      title: 'Web3 Lesson Tutor',
      description: 'Teach a Web3 topic using repository citations.',
      argsSchema: {
        topic: z.string().describe('Topic to teach.'),
        lang: z.enum(['zh', 'en']).default('zh'),
      },
    },
    ({ topic, lang }) => ({
      description: `Teach ${topic} with Get-Started-with-Web3 citations.`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Use the MCP tools from this server to teach "${topic}" in ${lang}. Cite lesson files and public URLs from returned results.`,
          },
        },
      ],
    })
  );

  server.registerPrompt(
    'web3_builder_plan',
    {
      title: 'Web3 Builder Plan',
      description: 'Turn a Web3 build goal into a study and implementation path.',
      argsSchema: {
        goal: z.string().describe('Project or learning goal.'),
        lang: z.enum(['zh', 'en']).default('zh'),
      },
    },
    ({ goal, lang }) => ({
      description: `Build plan for ${goal}.`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Use get_learning_path, search_web3_content, and compose_web3_context to create a practical ${lang} Web3 builder plan for: ${goal}. Include citations.`,
          },
        },
      ],
    })
  );

  return server;
}

async function main() {
  const server = await createWeb3McpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    console.error('[mcp:web3] Failed:', error.message);
    process.exitCode = 1;
  });
}
