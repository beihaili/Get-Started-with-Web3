import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
});
