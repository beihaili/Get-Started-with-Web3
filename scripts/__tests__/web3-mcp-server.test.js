import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { afterEach, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

let client;
let transport;

afterEach(async () => {
  if (client) {
    await client.close();
    client = undefined;
  }
  if (transport) {
    await transport.close();
    transport = undefined;
  }
});

describe('web3 MCP server', () => {
  it('lists tools and searches Web3 content over stdio', async () => {
    client = new Client({ name: 'web3-mcp-smoke-test', version: '1.0.0' });
    transport = new StdioClientTransport({
      command: process.execPath,
      args: [path.join(projectRoot, 'scripts/web3-mcp-server.mjs')],
      cwd: os.tmpdir(),
      stderr: 'pipe',
    });

    await client.connect(transport);

    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name)).toEqual(
      expect.arrayContaining([
        'search_web3_content',
        'read_web3_lesson',
        'compose_web3_context',
        'list_monetizable_tools',
      ])
    );

    const resources = await client.listResources();
    expect(resources.resources.map((resource) => resource.uri)).toEqual(
      expect.arrayContaining(['web3://manifest', 'web3://content-index'])
    );

    const manifestResource = await client.readResource({ uri: 'web3://manifest' });
    expect(manifestResource.contents[0].text).toContain('mcp:web3');

    const prompts = await client.listPrompts();
    expect(prompts.prompts.map((prompt) => prompt.name)).toEqual(
      expect.arrayContaining(['web3_lesson_tutor', 'web3_builder_plan'])
    );

    const result = await client.callTool({
      name: 'search_web3_content',
      arguments: { query: 'Bitcoin RPC', lang: 'zh', limit: 3 },
    });

    expect(result.isError).not.toBe(true);
    expect(result.structuredContent.results.length).toBeGreaterThan(0);
    expect(result.content[0].text).toContain('Bitcoin RPC');

    const lesson = await client.callTool({
      name: 'read_web3_lesson',
      arguments: { lang: 'zh', moduleId: 'module-4', lessonId: '4-2' },
    });
    expect(lesson.isError).not.toBe(true);
    expect(lesson.structuredContent.content).toContain('RPC');
  }, 20000);
});
