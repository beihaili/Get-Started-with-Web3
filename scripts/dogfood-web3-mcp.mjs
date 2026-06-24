#!/usr/bin/env node
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

function hasLesson(lessons, moduleId, lessonId) {
  return lessons.some((lesson) => lesson.moduleId === moduleId && lesson.lessonId === lessonId);
}

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

    const stablecoinSearch = await client.callTool({
      name: 'search_web3_content',
      arguments: { query: '稳定币 脱锚 风险', lang: 'zh', limit: 5 },
    });
    checks.push({
      name: 'search stablecoin risk lesson',
      ok:
        !stablecoinSearch.isError &&
        stablecoinSearch.structuredContent.results.some(
          (result) => result.moduleId === 'module-8' && result.lessonId === '8-4'
        ),
      summary:
        stablecoinSearch.structuredContent.results.find(
          (result) => result.moduleId === 'module-8' && result.lessonId === '8-4'
        )?.citation?.file || '',
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
        hasLesson(builderPath.structuredContent.lessons, 'module-7', '7-4') &&
        hasLesson(builderPath.structuredContent.lessons, 'module-11', '11-2') &&
        hasLesson(builderPath.structuredContent.lessons, 'module-8', '8-4') &&
        hasLesson(builderPath.structuredContent.lessons, 'module-8', '8-5'),
      summary: `${builderPath.structuredContent.lessons.length} lessons`,
    });

    const researcherPath = await client.callTool({
      name: 'get_learning_path',
      arguments: { role: 'researcher', lang: 'zh' },
    });
    checks.push({
      name: 'researcher learning path',
      ok:
        !researcherPath.isError &&
        hasLesson(researcherPath.structuredContent.lessons, 'module-11', '11-1') &&
        hasLesson(researcherPath.structuredContent.lessons, 'module-11', '11-2') &&
        hasLesson(researcherPath.structuredContent.lessons, 'module-8', '8-4') &&
        hasLesson(researcherPath.structuredContent.lessons, 'module-8', '8-5'),
      summary: `${researcherPath.structuredContent.lessons.length} lessons`,
    });

    const investorPath = await client.callTool({
      name: 'get_learning_path',
      arguments: { role: 'investor', lang: 'zh' },
    });
    checks.push({
      name: 'investor learning path',
      ok:
        !investorPath.isError &&
        hasLesson(investorPath.structuredContent.lessons, 'module-1', '1-6') &&
        hasLesson(investorPath.structuredContent.lessons, 'module-8', '8-4') &&
        hasLesson(investorPath.structuredContent.lessons, 'module-8', '8-5') &&
        hasLesson(investorPath.structuredContent.lessons, 'module-11', '11-2'),
      summary: `${investorPath.structuredContent.lessons.length} lessons`,
    });

    const smartAccountLesson = await client.callTool({
      name: 'read_web3_lesson',
      arguments: { lang: 'zh', moduleId: 'module-11', lessonId: '11-2' },
    });
    checks.push({
      name: 'read smart account lesson',
      ok:
        !smartAccountLesson.isError &&
        smartAccountLesson.structuredContent.content.includes('ERC-4337') &&
        smartAccountLesson.structuredContent.content.includes('EIP-7702'),
      summary: smartAccountLesson.structuredContent.citation?.file || '',
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
