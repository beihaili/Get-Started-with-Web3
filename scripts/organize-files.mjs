#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 查找所有 .MD 文件并重命名为 .md
async function renameMarkdownFiles() {
  console.log('🔍 查找需要重命名的 .MD 文件...\n');

  const filesToRename = [];

  async function findFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // 跳过 node_modules, .git 等目录
        if (!['node_modules', '.git', 'dist', '_book', '.cache'].includes(entry.name)) {
          await findFiles(fullPath);
        }
      } else if (entry.name.endsWith('.MD')) {
        filesToRename.push(fullPath);
      }
    }
  }

  // 从 zh/ 目录开始查找
  const zhDir = path.join(rootDir, 'zh');
  await findFiles(zhDir);

  if (filesToRename.length === 0) {
    console.log('✅ 没有找到需要重命名的 .MD 文件\n');
    return [];
  }

  console.log(`📋 找到 ${filesToRename.length} 个 .MD 文件:\n`);

  const renamed = [];
  for (const oldPath of filesToRename) {
    const newPath = oldPath.replace(/\.MD$/, '.md');
    const relativePath = path.relative(rootDir, oldPath);

    try {
      await fs.rename(oldPath, newPath);
      console.log(`  ✓ ${relativePath} → ${path.basename(newPath)}`);
      renamed.push({ old: oldPath, new: newPath });
    } catch (error) {
      console.error(`  ✗ 重命名失败: ${relativePath}`, error.message);
    }
  }

  console.log(`\n✅ 成功重命名 ${renamed.length} 个文件\n`);
  return renamed;
}

// 更新 SUMMARY.md 文件中的链接
async function updateSummaryLinks() {
  console.log('🔧 更新 SUMMARY.md 中的链接...\n');

  const summaryFiles = [
    path.join(rootDir, 'zh', 'SUMMARY.md'),
    path.join(rootDir, 'zh', 'GetStartedWithBitcoin', 'README.md'),
    path.join(rootDir, 'zh', 'Web3QuickStart', 'README.md'),
  ];

  for (const summaryPath of summaryFiles) {
    try {
      const exists = await fs.access(summaryPath).then(() => true).catch(() => false);
      if (!exists) {
        console.log(`  ⊘ 文件不存在: ${path.relative(rootDir, summaryPath)}`);
        continue;
      }

      let content = await fs.readFile(summaryPath, 'utf-8');
      const originalContent = content;

      // 替换所有 .MD) 为 .md)
      content = content.replace(/\.MD\)/g, '.md)');

      if (content !== originalContent) {
        await fs.writeFile(summaryPath, content, 'utf-8');
        console.log(`  ✓ 更新: ${path.relative(rootDir, summaryPath)}`);
      } else {
        console.log(`  ○ 无需更新: ${path.relative(rootDir, summaryPath)}`);
      }
    } catch (error) {
      console.error(`  ✗ 处理失败: ${path.relative(rootDir, summaryPath)}`, error.message);
    }
  }

  console.log('');
}

// 检查空目录
async function checkEmptyDirectories() {
  console.log('🔍 检查空目录...\n');

  const emptyDirs = [];

  async function checkDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    if (entries.length === 0) {
      emptyDirs.push(dir);
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        if (!['node_modules', '.git', 'dist', '_book', '.cache'].includes(entry.name)) {
          await checkDir(fullPath);
        }
      }
    }
  }

  const zhDir = path.join(rootDir, 'zh');
  await checkDir(zhDir);

  if (emptyDirs.length > 0) {
    console.log(`⚠️  发现 ${emptyDirs.length} 个空目录:\n`);
    emptyDirs.forEach(dir => {
      console.log(`  • ${path.relative(rootDir, dir)}`);
    });
    console.log('\n💡 提示: 考虑删除这些空目录或添加内容\n');
  } else {
    console.log('✅ 没有发现空目录\n');
  }
}

// 主函数
async function main() {
  console.log('🚀 开始文件整理...\n');
  console.log('='.repeat(60) + '\n');

  try {
    // 1. 重命名 .MD 文件
    await renameMarkdownFiles();

    // 2. 更新 SUMMARY.md 链接
    await updateSummaryLinks();

    // 3. 检查空目录
    await checkEmptyDirectories();

    console.log('='.repeat(60));
    console.log('\n✨ 文件整理完成！\n');
  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    process.exit(1);
  }
}

main();
