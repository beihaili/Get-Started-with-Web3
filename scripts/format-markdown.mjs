#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pangu from 'pangu';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 格式化单个文件
async function formatFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const formatted = pangu.spacing(content);

    if (content !== formatted) {
      await fs.writeFile(filePath, formatted, 'utf-8');
      return { changed: true, path: filePath };
    }

    return { changed: false, path: filePath };
  } catch (error) {
    return { error: error.message, path: filePath };
  }
}

// 查找所有 markdown 文件
async function findMarkdownFiles(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // 跳过这些目录
      if (!['node_modules', '.git', 'dist', '_book', '.cache', 'public'].includes(entry.name)) {
        await findMarkdownFiles(fullPath, files);
      }
    } else if (entry.name.match(/\.(md|MD)$/)) {
      files.push(fullPath);
    }
  }

  return files;
}

// 主函数
async function main() {
  console.log('📝 开始格式化 Markdown 文件（中英文空格）...\n');
  console.log('='.repeat(60) + '\n');

  try {
    const zhDir = path.join(rootDir, 'zh');
    const files = await findMarkdownFiles(zhDir);

    console.log(`📋 找到 ${files.length} 个 Markdown 文件\n`);

    let changedCount = 0;
    let errorCount = 0;

    for (const file of files) {
      const result = await formatFile(file);
      const relativePath = path.relative(rootDir, result.path);

      if (result.error) {
        console.log(`  ✗ ${relativePath}: ${result.error}`);
        errorCount++;
      } else if (result.changed) {
        console.log(`  ✓ ${relativePath}`);
        changedCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n✨ 格式化完成！`);
    console.log(`  • 已处理: ${files.length} 个文件`);
    console.log(`  • 已修改: ${changedCount} 个文件`);
    console.log(`  • 无需修改: ${files.length - changedCount - errorCount} 个文件`);
    if (errorCount > 0) {
      console.log(`  • 错误: ${errorCount} 个文件`);
    }
    console.log('');
  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    process.exit(1);
  }
}

// 如果作为主模块运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { formatFile, findMarkdownFiles };
