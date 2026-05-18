import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { writeAiArtifacts } from '../generate-ai-index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

let tempDir;

afterEach(async () => {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  }
});

describe('generate-ai-index', () => {
  it('writes manifest, content index, and llms.txt artifacts', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'web3-ai-index-'));

    const result = await writeAiArtifacts({
      projectRoot,
      outputDir: tempDir,
      generatedAt: '2026-05-09T00:00:00.000Z',
    });

    expect(result.files.map((file) => path.basename(file))).toEqual([
      'manifest.json',
      'content-index.json',
      'llms.txt',
    ]);

    const manifest = JSON.parse(await readFile(path.join(tempDir, 'manifest.json'), 'utf8'));
    const contentIndex = JSON.parse(
      await readFile(path.join(tempDir, 'content-index.json'), 'utf8')
    );
    const llmsTxt = await readFile(path.join(tempDir, 'llms.txt'), 'utf8');

    expect(manifest.counts.modules).toBe(11);
    expect(manifest.mcp.command).toBe('npm run mcp:web3');
    expect(manifest.mcp.clientConfig.mcpServers['get-started-with-web3']).toMatchObject({
      command: 'npm',
      args: ['run', 'mcp:web3'],
      cwd: '/absolute/path/to/Get-Started-with-Web3',
    });
    expect(contentIndex.lessons.length).toBeGreaterThan(40);
    expect(llmsTxt).toContain('Get Started With Web3 AI Index');
    expect(llmsTxt).toContain('"get-started-with-web3"');
    expect(llmsTxt).not.toMatch(/TBD|TODO|placeholder/i);
  });
});
