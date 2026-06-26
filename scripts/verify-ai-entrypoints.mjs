#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_AI_ENTRYPOINTS } from './ai-content-core.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

const SOURCE_ARTIFACTS = ['ai/manifest.json', 'ai/content-index.json', 'ai/llms.txt'];
const PUBLIC_ARTIFACTS = ['public/llms.txt', 'public/ai/manifest.json', 'public/ai/content-index.json'];
const REQUIRED_LOCAL_MCP_TOOLS = [
  'search_web3_content',
  'read_web3_lesson',
  'get_learning_path',
  'lookup_web3_glossary',
  'compose_web3_context',
  'list_monetizable_tools',
];

export async function verifyAiEntrypoints(options = {}) {
  const projectRoot = options.projectRoot || defaultProjectRoot;
  const checks = [];

  const sourceArtifactsExist = SOURCE_ARTIFACTS.every((file) => existsSync(path.join(projectRoot, file)));
  checks.push({
    name: 'source artifacts exist',
    ok: sourceArtifactsExist,
    details: SOURCE_ARTIFACTS,
  });

  const publicArtifactsExist = PUBLIC_ARTIFACTS.every((file) => existsSync(path.join(projectRoot, file)));
  checks.push({
    name: 'public artifacts exist',
    ok: publicArtifactsExist,
    details: PUBLIC_ARTIFACTS,
  });

  let manifest;
  let index;
  let llmsTxt = '';
  let publicLlmsTxt = '';

  if (sourceArtifactsExist) {
    manifest = JSON.parse(await readFile(path.join(projectRoot, 'ai', 'manifest.json'), 'utf8'));
    index = JSON.parse(await readFile(path.join(projectRoot, 'ai', 'content-index.json'), 'utf8'));
    llmsTxt = await readFile(path.join(projectRoot, 'ai', 'llms.txt'), 'utf8');
  }

  if (existsSync(path.join(projectRoot, 'public', 'llms.txt'))) {
    publicLlmsTxt = await readFile(path.join(projectRoot, 'public', 'llms.txt'), 'utf8');
  }

  const toolNames = manifest?.tools?.map((tool) => tool.name) || [];
  checks.push({
    name: 'artifact contract is stable v1',
    ok:
      manifest?.artifactContract?.version === '1.0.0' &&
      manifest.artifactContract.status === 'stable' &&
      manifest.artifactContract.publicSurfaces?.includes('public/ai/manifest.json') &&
      manifest.artifactContract.publicSurfaces?.includes('web3://manifest'),
    details: manifest?.artifactContract,
  });

  checks.push({
    name: 'manifest contains local MCP tools',
    ok: REQUIRED_LOCAL_MCP_TOOLS.every((tool) => toolNames.includes(tool)),
    details: REQUIRED_LOCAL_MCP_TOOLS,
  });

  const localMcpTools =
    manifest?.tools?.filter((tool) => REQUIRED_LOCAL_MCP_TOOLS.includes(tool.name)) || [];
  checks.push({
    name: 'local MCP remains free and read-only',
    ok:
      manifest?.mcp?.readOnly === true &&
      manifest?.artifactContract?.localMcpPolicy?.free === true &&
      manifest?.artifactContract?.localMcpPolicy?.readOnly === true &&
      manifest?.artifactContract?.localMcpPolicy?.paymentEnforcement === false &&
      manifest?.artifactContract?.localMcpPolicy?.chainOperations === false &&
      localMcpTools.every(
        (tool) =>
          tool.availability === 'local-read-only' &&
          tool.localMcp?.exposed === true &&
          tool.localMcp?.readOnly === true &&
          tool.localMcp?.free === true &&
          tool.x402?.enabled === false
      ),
    details: {
      mcp: manifest?.mcp,
      localMcpPolicy: manifest?.artifactContract?.localMcpPolicy,
      tools: localMcpTools.map((tool) => ({
        name: tool.name,
        availability: tool.availability,
        localMcp: tool.localMcp,
        x402: tool.x402,
      })),
    },
  });

  const llmsText = `${llmsTxt}\n${publicLlmsTxt}`;
  checks.push({
    name: 'llms.txt points to public URLs',
    ok: Object.values(PUBLIC_AI_ENTRYPOINTS).every((url) => llmsText.includes(url)),
    details: PUBLIC_AI_ENTRYPOINTS,
  });

  const lessonLangs = new Set(index?.lessons?.map((lesson) => lesson.lang) || []);
  checks.push({
    name: 'content index covers zh and en lessons',
    ok: lessonLangs.has('zh') && lessonLangs.has('en'),
    details: { languages: [...lessonLangs] },
  });

  const paidTools = manifest?.tools?.filter((tool) => tool.x402?.enabled) || [];
  const paidToolsComplete =
    paidTools.length > 0 &&
    paidTools.every(
      (tool) =>
        typeof tool.x402.priceUsd === 'number' &&
        tool.x402.priceUsd > 0 &&
        typeof tool.x402.network === 'string' &&
        tool.x402.network.length > 0 &&
        typeof tool.x402.route === 'string' &&
        tool.x402.route.startsWith('/mcp/tools/')
    );
  checks.push({
    name: 'x402 metadata is complete',
    ok: paidToolsComplete,
    details: paidTools.map((tool) => ({ name: tool.name, x402: tool.x402 })),
  });

  checks.push({
    name: 'future paid tools are not described as live local tools',
    ok:
      paidTools.length > 0 &&
      paidTools.every(
        (tool) =>
          tool.availability === 'future-hosted-metadata' &&
          tool.localMcp?.exposed === false &&
          tool.description.startsWith('Future paid remote tool')
      ) &&
      manifest?.artifactContract?.monetizationPolicy?.futurePaidMetadataOnly === true &&
      manifest?.artifactContract?.monetizationPolicy?.x402EnforcementLive === false,
    details: {
      monetizationPolicy: manifest?.artifactContract?.monetizationPolicy,
      tools: paidTools.map((tool) => ({
        name: tool.name,
        availability: tool.availability,
        localMcp: tool.localMcp,
        description: tool.description,
      })),
    },
  });

  const ok = checks.every((check) => check.ok);
  return { ok, checks };
}

async function main() {
  const report = await verifyAiEntrypoints();
  for (const check of report.checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}`);
  }
  if (!report.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    console.error('[ai:verify] Failed:', error);
    process.exitCode = 1;
  });
}
