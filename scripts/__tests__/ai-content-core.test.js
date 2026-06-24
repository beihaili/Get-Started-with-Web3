import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildAiIndex,
  composeContext,
  getLearningPath,
  listMonetizableTools,
  lookupGlossary,
  readLesson,
  searchContent,
} from '../ai-content-core.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

function lessonKeys(pathResult) {
  return pathResult.lessons.map((lesson) => `${lesson.moduleId}:${lesson.lessonId}`);
}

describe('ai-content-core', () => {
  it('builds a machine-readable index with citations and x402-ready metadata', async () => {
    const index = await buildAiIndex({ projectRoot, generatedAt: '2026-05-09T00:00:00.000Z' });

    expect(index.schemaVersion).toBe('2026-05-09');
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
    expect(futurePaidTool.x402).toMatchObject({
      enabled: true,
      network: 'base',
      priceUsd: expect.any(Number),
    });
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
    expect(lessonKeys(builderPath)).toEqual(
      expect.arrayContaining(['module-7:7-4', 'module-11:11-2', 'module-8:8-4', 'module-8:8-5'])
    );
    expect(builderPath.description).toContain('智能账户');

    const researcherPath = getLearningPath(index, { role: 'researcher', lang: 'zh' });
    expect(lessonKeys(researcherPath)).toEqual(
      expect.arrayContaining(['module-11:11-1', 'module-11:11-2', 'module-8:8-4', 'module-8:8-5'])
    );
    expect(researcherPath.description).toContain('账户抽象');

    const investorPath = getLearningPath(index, { role: 'investor', lang: 'zh' });
    expect(lessonKeys(investorPath)).toEqual(
      expect.arrayContaining(['module-1:1-6', 'module-8:8-4', 'module-8:8-5', 'module-11:11-2'])
    );
    expect(investorPath.description).toContain('稳定币');

    const glossary = lookupGlossary(index, { query: 'Gas', limit: 3 });
    expect(glossary.results[0].term).toContain('Gas');

    const monetizableTools = listMonetizableTools(index);
    expect(monetizableTools.some((tool) => tool.x402.enabled)).toBe(true);
    expect(monetizableTools.every((tool) => tool.x402.route.startsWith('/mcp/tools/'))).toBe(true);
  });
});
