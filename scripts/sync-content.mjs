import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SOURCE_ROOT = path.join(projectRoot, 'zh');
const DEST_ROOT = path.join(projectRoot, 'public', 'content', 'zh');

const SOURCE_FOLDERS = [
  'Web3QuickStart',
  'GetStartedWithBitcoin',
  'Web3Thoughts',
];

const ensureExists = async (dir) => {
  await mkdir(dir, { recursive: true });
};

const safeCopy = async (source, destination) => {
  try {
    const statResult = await stat(source);
    if (!statResult.isDirectory()) {
      console.warn(`[sync-content] Skip ${source}: not a directory`);
      return;
    }
  } catch (error) {
    console.warn(`[sync-content] Skip ${source}: ${error.message}`);
    return;
  }

  await ensureExists(path.dirname(destination));
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
  console.log(`[sync-content] Copied ${source} -> ${destination}`);
};

const main = async () => {
  await ensureExists(path.join(projectRoot, 'public', 'content'));

  for (const folder of SOURCE_FOLDERS) {
    const src = path.join(SOURCE_ROOT, folder);
    const dest = path.join(DEST_ROOT, folder);
    await safeCopy(src, dest);
  }

  console.log(`[sync-content] Completed. Content root: ${path.relative(projectRoot, DEST_ROOT)}`);
};

main().catch((error) => {
  console.error('[sync-content] Failed:', error);
  process.exitCode = 1;
});

