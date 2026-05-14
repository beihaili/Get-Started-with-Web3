import { existsSync } from 'node:fs';
import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSE_DATA } from '../src/config/courseData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const ensureExists = async (dir) => {
  await mkdir(dir, { recursive: true });
};

export const getSourceFoldersFromCourseData = (courseData = COURSE_DATA) => {
  const folders = new Set();

  for (const module of courseData) {
    for (const lesson of module.lessons || []) {
      const parts = String(lesson.path || '')
        .split('/')
        .filter(Boolean);

      if (parts.length === 0) {
        continue;
      }

      if (parts[0] === '其它学习资源整理' && parts.length > 1) {
        folders.add(parts.slice(0, 2).join('/'));
      } else {
        folders.add(parts[0]);
      }
    }
  }

  return [...folders];
};

const safeCopy = async (source, destination, logger = console) => {
  try {
    const statResult = await stat(source);
    if (!statResult.isDirectory()) {
      logger.warn(`[sync-content] Skip ${source}: not a directory`);
      return;
    }
  } catch (error) {
    logger.warn(`[sync-content] Skip ${source}: ${error.message}`);
    return;
  }

  await ensureExists(path.dirname(destination));
  await rm(destination, { recursive: true, force: true });
  await cp(source, destination, { recursive: true });
  logger.log(`[sync-content] Copied ${source} -> ${destination}`);
};

export const syncContent = async (options = {}) => {
  const root = options.projectRoot || projectRoot;
  const sourceFolders = options.sourceFolders || getSourceFoldersFromCourseData(options.courseData);
  const logger = options.logger || console;

  await ensureExists(path.join(root, 'public', 'content'));

  for (const folder of sourceFolders) {
    const src = path.join(root, 'zh', folder);
    const dest = path.join(root, 'public', 'content', 'zh', folder);
    await safeCopy(src, dest, logger);
  }

  // Sync en/ folders (skip silently if source doesn't exist)
  const enSource = path.resolve(root, 'en');
  const enTarget = path.resolve(root, 'public', 'content', 'en');

  for (const folder of sourceFolders) {
    const src = path.join(enSource, folder);
    const dest = path.join(enTarget, folder);
    if (existsSync(src)) {
      await safeCopy(src, dest, logger);
    }
  }

  logger.log(
    `[sync-content] Completed. Content root: ${path.relative(root, path.join(root, 'public', 'content', 'zh'))}`
  );
};

if (process.argv[1] === __filename) {
  syncContent().catch((error) => {
    console.error('[sync-content] Failed:', error);
    process.exitCode = 1;
  });
}
