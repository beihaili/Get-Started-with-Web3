import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { getSourceFoldersFromCourseData, syncContent } from '../sync-content.mjs';

let tempDir;

afterEach(async () => {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  }
});

describe('sync-content', () => {
  it('derives source folders from configured course paths', () => {
    const folders = getSourceFoldersFromCourseData([
      {
        lessons: [
          { path: 'EthereumSmartAccounts/01_EthereumAfterPectra' },
          { path: '其它学习资源整理/DeFi' },
        ],
      },
    ]);

    expect(folders).toEqual(['EthereumSmartAccounts', '其它学习资源整理/DeFi']);
  });

  it('copies derived Chinese and English course folders into public content', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'web3-sync-content-'));
    await mkdir(path.join(tempDir, 'zh', 'EthereumSmartAccounts', '01_EthereumAfterPectra'), {
      recursive: true,
    });
    await mkdir(path.join(tempDir, 'en', 'EthereumSmartAccounts', '01_EthereumAfterPectra'), {
      recursive: true,
    });

    await writeFile(
      path.join(tempDir, 'zh', 'EthereumSmartAccounts', '01_EthereumAfterPectra', 'README.md'),
      '# 中文\n',
      'utf8'
    );
    await writeFile(
      path.join(tempDir, 'en', 'EthereumSmartAccounts', '01_EthereumAfterPectra', 'README.md'),
      '# English\n',
      'utf8'
    );

    await syncContent({
      projectRoot: tempDir,
      courseData: [
        {
          lessons: [{ path: 'EthereumSmartAccounts/01_EthereumAfterPectra' }],
        },
      ],
      logger: { log() {}, warn() {}, error() {} },
    });

    await expect(
      readFile(
        path.join(
          tempDir,
          'public',
          'content',
          'zh',
          'EthereumSmartAccounts',
          '01_EthereumAfterPectra',
          'README.md'
        ),
        'utf8'
      )
    ).resolves.toContain('中文');
    await expect(
      readFile(
        path.join(
          tempDir,
          'public',
          'content',
          'en',
          'EthereumSmartAccounts',
          '01_EthereumAfterPectra',
          'README.md'
        ),
        'utf8'
      )
    ).resolves.toContain('English');
  });

  it('publishes canonical README.md aliases for uppercase source readmes', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'web3-sync-content-'));
    const lessonDir = path.join(tempDir, 'zh', 'Web3QuickStart', '01_FirstWeb3Identity');
    await mkdir(lessonDir, { recursive: true });
    await writeFile(path.join(lessonDir, 'README.MD'), '# 中文大写 README\n', 'utf8');

    await syncContent({
      projectRoot: tempDir,
      courseData: [
        {
          lessons: [{ path: 'Web3QuickStart/01_FirstWeb3Identity' }],
        },
      ],
      logger: { log() {}, warn() {}, error() {} },
    });

    const publishedDir = path.join(
      tempDir,
      'public',
      'content',
      'zh',
      'Web3QuickStart',
      '01_FirstWeb3Identity'
    );

    await expect(readFile(path.join(publishedDir, 'README.md'), 'utf8')).resolves.toContain(
      '中文大写 README'
    );

    if (await supportsCaseDistinctReadmes(tempDir)) {
      await expect(readdir(publishedDir)).resolves.toEqual(
        expect.arrayContaining(['README.MD', 'README.md'])
      );
    }
  });

  it('writes image dimension metadata for copied lesson images', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'web3-sync-content-'));
    const lessonDir = path.join(tempDir, 'zh', 'EthereumSmartAccounts', '01_EthereumAfterPectra');
    await mkdir(path.join(lessonDir, 'img'), { recursive: true });
    await writeFile(path.join(lessonDir, 'README.md'), '# 中文\n', 'utf8');
    await writeFile(path.join(lessonDir, 'img', 'diagram.png'), createPngHeader(640, 360));

    await syncContent({
      projectRoot: tempDir,
      courseData: [
        {
          lessons: [{ path: 'EthereumSmartAccounts/01_EthereumAfterPectra' }],
        },
      ],
      logger: { log() {}, warn() {}, error() {} },
    });

    const metadata = JSON.parse(
      await readFile(path.join(tempDir, 'public', 'content', 'image-metadata.json'), 'utf8')
    );

    expect(metadata['zh/EthereumSmartAccounts/01_EthereumAfterPectra/img/diagram.png']).toEqual({
      width: 640,
      height: 360,
    });
  });

  it('fills missing English lesson images from the matching Chinese lesson assets', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'web3-sync-content-'));
    const zhLessonDir = path.join(tempDir, 'zh', 'Web3QuickStart', '02_FirstWeb3Transaction');
    const enLessonDir = path.join(tempDir, 'en', 'Web3QuickStart', '02_FirstWeb3Transaction');
    const image = createPngHeader(800, 450);

    await mkdir(path.join(zhLessonDir, 'img'), { recursive: true });
    await mkdir(enLessonDir, { recursive: true });
    await writeFile(path.join(zhLessonDir, 'README.MD'), '# 中文\n', 'utf8');
    await writeFile(path.join(zhLessonDir, 'img', '01.png'), image);
    await writeFile(
      path.join(enLessonDir, 'README.md'),
      '# English\n\n<div><img src="./img/01.png" /></div>\n',
      'utf8'
    );

    await syncContent({
      projectRoot: tempDir,
      courseData: [
        {
          lessons: [{ path: 'Web3QuickStart/02_FirstWeb3Transaction' }],
        },
      ],
      logger: { log() {}, warn() {}, error() {} },
    });

    await expect(
      readFile(
        path.join(
          tempDir,
          'public',
          'content',
          'en',
          'Web3QuickStart',
          '02_FirstWeb3Transaction',
          'img',
          '01.png'
        )
      )
    ).resolves.toEqual(image);

    const metadata = JSON.parse(
      await readFile(path.join(tempDir, 'public', 'content', 'image-metadata.json'), 'utf8')
    );

    expect(metadata['en/Web3QuickStart/02_FirstWeb3Transaction/img/01.png']).toEqual({
      width: 800,
      height: 450,
    });
  });
});

const createPngHeader = (width, height) => {
  const buffer = Buffer.alloc(24);
  buffer.writeUInt8(0x89, 0);
  buffer.write('PNG\r\n\u001a\n', 1, 'binary');
  buffer.writeUInt32BE(13, 8);
  buffer.write('IHDR', 12, 'ascii');
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
};

const supportsCaseDistinctReadmes = async (root) => {
  const probeDir = path.join(root, 'case-probe');
  await mkdir(probeDir, { recursive: true });
  await writeFile(path.join(probeDir, 'README.MD'), 'upper', 'utf8');
  await writeFile(path.join(probeDir, 'README.md'), 'lower', 'utf8');
  const entries = await readdir(probeDir);

  return entries.includes('README.MD') && entries.includes('README.md');
};
