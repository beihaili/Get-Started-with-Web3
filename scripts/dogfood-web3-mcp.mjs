#!/usr/bin/env node
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

export async function runDogfood(options = {}) {
  const projectRoot = options.projectRoot || defaultProjectRoot;
  const log = options.log || console.log;
  const serverPath = path.join(projectRoot, 'scripts', 'web3-mcp-server.mjs');
  const client = new Client({ name: 'web3-mcp-dogfood', version: '1.0.0' });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    cwd: options.cwd || os.tmpdir(),
    stderr: 'pipe',
  });

  const checks = [];

  try {
    await client.connect(transport);

    const securitySearch = await client.callTool({
      name: 'search_web3_content',
      arguments: { query: '智能合约安全', lang: 'zh', limit: 3 },
    });
    checks.push({
      name: 'search smart contract security',
      ok: !securitySearch.isError && securitySearch.structuredContent.results.length > 0,
      summary: securitySearch.structuredContent.results[0]?.citation?.file || '',
    });

    const rpcContext = await client.callTool({
      name: 'compose_web3_context',
      arguments: { topic: 'Bitcoin RPC 怎么开始', lang: 'zh', limit: 3, maxChars: 2200 },
    });
    checks.push({
      name: 'compose bitcoin rpc context',
      ok:
        !rpcContext.isError &&
        rpcContext.structuredContent.context.includes('RPC') &&
        rpcContext.structuredContent.citations.length > 0,
      summary: rpcContext.structuredContent.citations[0]?.file || '',
    });

    const builderPath = await client.callTool({
      name: 'get_learning_path',
      arguments: { role: 'builder', lang: 'zh' },
    });
    checks.push({
      name: 'builder learning path',
      ok:
        !builderPath.isError &&
        builderPath.structuredContent.lessons.some((lesson) => lesson.moduleId === 'module-7'),
      summary: `${builderPath.structuredContent.lessons.length} lessons`,
    });

    const monetizable = await client.callTool({
      name: 'list_monetizable_tools',
      arguments: {},
    });
    checks.push({
      name: 'monetizable metadata',
      ok:
        !monetizable.isError &&
        monetizable.structuredContent.tools.every(
          (tool) => tool.x402?.enabled && tool.x402.route?.startsWith('/mcp/tools/')
        ),
      summary: `${monetizable.structuredContent.tools.length} future paid tools`,
    });
  } finally {
    await client.close();
    await transport.close();
  }

  for (const check of checks) {
    log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}${check.summary ? ` - ${check.summary}` : ''}`);
  }

  return {
    ok: checks.every((check) => check.ok),
    checks,
  };
}

async function main() {
  const report = await runDogfood();
  if (!report.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    console.error('[mcp:dogfood] Failed:', error);
    process.exitCode = 1;
  });
}
