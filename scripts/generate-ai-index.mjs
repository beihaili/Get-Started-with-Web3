#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAiIndex, createLlmsTxt, createManifest } from './ai-content-core.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

export async function writeAiArtifacts(options = {}) {
  const projectRoot = options.projectRoot || defaultProjectRoot;
  const outputDir = options.outputDir || path.join(projectRoot, 'ai');
  const generatedAt = options.generatedAt;

  await mkdir(outputDir, { recursive: true });

  const index = await buildAiIndex({ projectRoot, generatedAt });
  const manifest = createManifest(index);
  const llmsTxt = createLlmsTxt(index);

  const files = [
    {
      path: path.join(outputDir, 'manifest.json'),
      content: `${JSON.stringify(manifest, null, 2)}\n`,
    },
    {
      path: path.join(outputDir, 'content-index.json'),
      content: `${JSON.stringify(index, null, 2)}\n`,
    },
    {
      path: path.join(outputDir, 'llms.txt'),
      content: llmsTxt,
    },
  ];

  for (const file of files) {
    await writeFile(file.path, file.content, 'utf8');
  }

  return {
    outputDir,
    files: files.map((file) => file.path),
    counts: manifest.counts,
  };
}

async function main() {
  const result = await writeAiArtifacts();
  console.log(`[ai:index] Wrote ${result.files.length} artifact(s) to ${path.relative(defaultProjectRoot, result.outputDir)}`);
  console.log(
    `[ai:index] ${result.counts.modules} modules, ${result.counts.lessons} lesson entries, ${result.counts.glossaryEntries} glossary entries`
  );
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    console.error('[ai:index] Failed:', error);
    process.exitCode = 1;
  });
}
