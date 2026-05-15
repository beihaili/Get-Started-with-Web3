import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSE_DATA } from '../src/config/courseData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const ensureExists = async (dir) => {
  await mkdir(dir, { recursive: true });
};

const IMAGE_EXTENSIONS = new Set(['.gif', '.jpeg', '.jpg', '.png']);
const IMAGE_METADATA_FILE = 'image-metadata.json';
const README_FILE_PATTERN = /^README\.md$/i;

const isImageFile = (filePath) => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());

const readPngDimensions = (buffer) => {
  const pngSignature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== pngSignature) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
};

const readGifDimensions = (buffer) => {
  if (buffer.length < 10 || !['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString())) {
    return null;
  }

  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
};

const readJpegDimensions = (buffer) => {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);

  while (offset < buffer.length) {
    while (buffer[offset] === 0xff) {
      offset += 1;
    }

    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) {
      break;
    }

    if (offset + 2 > buffer.length) {
      break;
    }

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) {
      break;
    }

    if (startOfFrameMarkers.has(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      };
    }

    offset += segmentLength;
  }

  return null;
};

export const readImageDimensions = async (filePath) => {
  const buffer = await readFile(filePath);
  return readPngDimensions(buffer) || readJpegDimensions(buffer) || readGifDimensions(buffer);
};

export const collectImageMetadata = async (contentRoot) => {
  const metadata = {};

  const visit = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await visit(entryPath);
        continue;
      }

      if (!entry.isFile() || entry.name === IMAGE_METADATA_FILE || !isImageFile(entryPath)) {
        continue;
      }

      const dimensions = await readImageDimensions(entryPath);
      if (!dimensions) {
        continue;
      }

      const relativePath = path.relative(contentRoot, entryPath).split(path.sep).join('/');
      metadata[relativePath] = dimensions;
    }
  };

  await visit(contentRoot);
  return metadata;
};

const writeImageMetadata = async (contentRoot, logger = console) => {
  const metadata = await collectImageMetadata(contentRoot);
  await writeFile(
    path.join(contentRoot, IMAGE_METADATA_FILE),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8'
  );
  logger.log(`[sync-content] Wrote ${Object.keys(metadata).length} image metadata entries`);
};

const cleanLocalAssetReference = (rawReference) => {
  const reference = rawReference.split(/[?#]/)[0].trim();

  if (
    !reference ||
    /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(reference) ||
    /^(?:data|mailto|tel):/i.test(reference) ||
    reference.startsWith('#')
  ) {
    return null;
  }

  const normalized = path.normalize(reference);
  if (path.isAbsolute(normalized) || normalized.startsWith('..')) {
    return null;
  }

  return normalized;
};

const extractLocalImageReferences = (content) => {
  const references = new Set();
  const markdownImagePattern = /!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  const htmlImagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;

  for (const pattern of [markdownImagePattern, htmlImagePattern]) {
    for (const match of content.matchAll(pattern)) {
      const reference = cleanLocalAssetReference(match[1]);
      if (reference && isImageFile(reference)) {
        references.add(reference);
      }
    }
  }

  return [...references];
};

const copyMissingReferencedImages = async (fallbackFolder, targetFolder, logger = console) => {
  const visit = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await visit(entryPath);
        continue;
      }

      if (!entry.isFile() || !README_FILE_PATTERN.test(entry.name)) {
        continue;
      }

      const content = await readFile(entryPath, 'utf8');
      const readmeDir = path.dirname(entryPath);

      for (const reference of extractLocalImageReferences(content)) {
        const targetImage = path.resolve(readmeDir, reference);
        const targetRelative = path.relative(targetFolder, targetImage);

        if (targetRelative.startsWith('..') || path.isAbsolute(targetRelative)) {
          continue;
        }

        if (existsSync(targetImage)) {
          continue;
        }

        const fallbackImage = path.join(fallbackFolder, targetRelative);
        if (!existsSync(fallbackImage)) {
          continue;
        }

        await ensureExists(path.dirname(targetImage));
        await cp(fallbackImage, targetImage);
        logger.log(
          `[sync-content] Copied fallback image ${fallbackImage} -> ${targetImage}`
        );
      }
    }
  };

  await visit(targetFolder);
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

  const contentRoot = path.join(root, 'public', 'content');
  await ensureExists(contentRoot);

  for (const folder of sourceFolders) {
    const src = path.join(root, 'zh', folder);
    const dest = path.join(contentRoot, 'zh', folder);
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
      await copyMissingReferencedImages(path.join(root, 'zh', folder), dest, logger);
    }
  }

  await writeImageMetadata(contentRoot, logger);

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
