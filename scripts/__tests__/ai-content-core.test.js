import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildAiIndex,
  composeContext,
  createManifest,
  getLearningPath,
  listMonetizableTools,
  lookupGlossary,
  readLesson,
  searchContent,
} from '../ai-content-core.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

describe('ai-content-core', () => {
  it('builds a machine-readable index with citations and x402-ready metadata', async () => {
    const index = await buildAiIndex({ projectRoot, generatedAt: '2026-05-09T00:00:00.000Z' });

    expect(index.schemaVersion).toBe('2026-05-09');
    expect(index.artifactContract).toMatchObject({
      version: '1.0.0',
      status: 'stable',
      localMcpPolicy: {
        free: true,
        readOnly: true,
        paymentEnforcement: false,
        chainOperations: false,
      },
      monetizationPolicy: {
        futurePaidMetadataOnly: true,
        x402EnforcementLive: false,
      },
    });
    expect(index.repository.name).toBe('Get-Started-with-Web3');
    expect(index.languages).toEqual(['zh', 'en']);
    expect(index.modules).toHaveLength(11);
    expect(index.lessons.length).toBeGreaterThan(40);
    expect(index.tools.map((tool) => tool.name)).toEqual(
      expect.arrayContaining([
        'search_web3_content',
        'read_web3_lesson',
        'get_learning_path',
        'lookup_web3_glossary',
        'compose_web3_context',
        'list_monetizable_tools',
      ])
    );

    const rpcLesson = index.lessons.find(
      (lesson) => lesson.lang === 'zh' && lesson.path === 'GetStartedWithBitcoin/16_BitcoinRPC'
    );
    expect(rpcLesson).toMatchObject({
      lang: 'zh',
      moduleId: 'module-4',
      lessonId: '4-2',
      citation: expect.objectContaining({
        file: 'zh/GetStartedWithBitcoin/16_BitcoinRPC/README.MD',
        siteUrl: expect.stringContaining('/zh/learn/module-4/4-2'),
      }),
    });
    expect(rpcLesson.headings.length).toBeGreaterThan(3);
    expect(rpcLesson.excerpt.length).toBeGreaterThan(40);

    const futurePaidTool = index.tools.find(
      (tool) => tool.name === 'generate_personalized_web3_plan'
    );
    expect(futurePaidTool.availability).toBe('future-hosted-metadata');
    expect(futurePaidTool.localMcp.exposed).toBe(false);
    expect(futurePaidTool.x402).toMatchObject({
      enabled: true,
      network: 'base',
      priceUsd: expect.any(Number),
    });

    const manifest = createManifest(index);
    expect(manifest.artifactContract.version).toBe('1.0.0');
    expect(manifest.mcp.readOnly).toBe(true);
  });

  it('searches lessons and glossary entries with stable citations', async () => {
    const index = await buildAiIndex({ projectRoot });
    const result = searchContent(index, { query: 'Bitcoin RPC', lang: 'zh', limit: 5 });

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results[0]).toMatchObject({
      type: 'lesson',
      title: expect.stringContaining('RPC'),
      citation: expect.objectContaining({
        file: expect.stringContaining('GetStartedWithBitcoin/16_BitcoinRPC'),
      }),
    });

    const glossaryHit = searchContent(index, { query: 'UTXO', lang: 'zh', limit: 5 }).results.find(
      (item) => item.type === 'glossary'
    );
    expect(glossaryHit.definition).toContain('Unspent Transaction Output');
  });

  it('reads Chinese and English lessons by module and lesson id', async () => {
    const index = await buildAiIndex({ projectRoot });

    const zhLesson = await readLesson(index, { lang: 'zh', moduleId: 'module-1', lessonId: '1-1' });
    expect(zhLesson.title).toBe('创建第一个 Web3 身份');
    expect(zhLesson.content).toContain('Web3');
    expect(zhLesson.citation.file).toBe('zh/Web3QuickStart/01_FirstWeb3Identity/README.MD');

    const enLesson = await readLesson(index, { lang: 'en', moduleId: 'module-1', lessonId: '1-1' });
    expect(enLesson.title).toBe('创建第一个 Web3 身份');
    expect(enLesson.content).toContain('Web3');
    expect(enLesson.citation.file).toBe('en/Web3QuickStart/01_FirstWeb3Identity/README.md');
  });

  it('composes bounded context packs with citations', async () => {
    const index = await buildAiIndex({ projectRoot });
    const pack = await composeContext(index, {
      topic: '智能合约安全',
      lang: 'zh',
      limit: 3,
      maxChars: 1600,
    });

    expect(pack.context.length).toBeGreaterThan(100);
    expect(pack.context.length).toBeLessThanOrEqual(1800);
    expect(pack.citations.length).toBeGreaterThan(0);
    expect(pack.citations[0]).toHaveProperty('file');
  });

  it('returns role-based learning paths and monetization metadata', async () => {
    const index = await buildAiIndex({ projectRoot });

    const builderPath = getLearningPath(index, { role: 'builder', lang: 'zh' });
    expect(builderPath.role).toBe('builder');
    expect(builderPath.lessons.some((lesson) => lesson.moduleId === 'module-7')).toBe(true);

    const glossary = lookupGlossary(index, { query: 'Gas', limit: 3 });
    expect(glossary.results[0].term).toContain('Gas');

    const monetizableTools = listMonetizableTools(index);
    expect(monetizableTools.some((tool) => tool.x402.enabled)).toBe(true);
    expect(monetizableTools.every((tool) => tool.x402.route.startsWith('/mcp/tools/'))).toBe(true);
    expect(monetizableTools.every((tool) => tool.availability === 'future-hosted-metadata')).toBe(
      true
    );
    expect(monetizableTools.every((tool) => tool.localMcp.exposed === false)).toBe(true);
  });
});
