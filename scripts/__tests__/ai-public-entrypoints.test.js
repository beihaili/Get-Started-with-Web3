import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { publishAiArtifacts } from '../publish-ai-artifacts.mjs';
import { verifyAiEntrypoints } from '../verify-ai-entrypoints.mjs';
import { writeAiArtifacts } from '../generate-ai-index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const siteBaseUrl = 'https://beihaili.github.io/Get-Started-with-Web3';

let tempRoot;

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
    tempRoot = undefined;
  }
});

describe('AI public entrypoints', () => {
  it('publishes llms.txt and AI JSON artifacts into public routes', async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'web3-ai-public-'));
    await mkdir(path.join(tempRoot, 'public'), { recursive: true });

    const sourceDir = path.join(tempRoot, 'ai');
    await writeAiArtifacts({
      projectRoot,
      outputDir: sourceDir,
      generatedAt: '2026-05-10T00:00:00.000Z',
    });

    const result = await publishAiArtifacts({ projectRoot: tempRoot });
    expect(result.files.map((file) => path.relative(tempRoot, file))).toEqual([
      'public/llms.txt',
      'public/ai/manifest.json',
      'public/ai/content-index.json',
    ]);

    const publicLlms = await readFile(path.join(tempRoot, 'public', 'llms.txt'), 'utf8');
    expect(publicLlms).toContain(`${siteBaseUrl}/llms.txt`);
    expect(publicLlms).toContain(`${siteBaseUrl}/ai/manifest.json`);
    expect(publicLlms).toContain(`${siteBaseUrl}/ai/content-index.json`);

    const report = await verifyAiEntrypoints({ projectRoot: tempRoot });
    expect(report.ok).toBe(true);
    expect(report.checks.map((check) => check.name)).toEqual(
      expect.arrayContaining([
        'source artifacts exist',
        'public artifacts exist',
        'manifest contains local MCP tools',
        'llms.txt points to public URLs',
        'content index covers zh and en lessons',
        'x402 metadata is complete',
      ])
    );
  });
});
