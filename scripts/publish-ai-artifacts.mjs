#!/usr/bin/env node
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

const PUBLIC_FILES = [
  { source: 'ai/llms.txt', target: 'public/llms.txt' },
  { source: 'ai/manifest.json', target: 'public/ai/manifest.json' },
  { source: 'ai/content-index.json', target: 'public/ai/content-index.json' },
];

export async function publishAiArtifacts(options = {}) {
  const projectRoot = options.projectRoot || defaultProjectRoot;
  const copied = [];

  await mkdir(path.join(projectRoot, 'public', 'ai'), { recursive: true });

  for (const file of PUBLIC_FILES) {
    const source = path.join(projectRoot, file.source);
    const target = path.join(projectRoot, file.target);
    await copyFile(source, target);
    copied.push(target);
  }

  return { files: copied };
}

async function main() {
  const result = await publishAiArtifacts();
  console.log(`[ai:publish] Published ${result.files.length} artifact(s) into public/`);
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    console.error('[ai:publish] Failed:', error);
    process.exitCode = 1;
  });
}
