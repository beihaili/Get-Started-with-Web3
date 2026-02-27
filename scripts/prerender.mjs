/**
 * SSG 预渲染脚本
 * 使用 Playwright 访问每个路由并生成静态 HTML
 *
 * 用法: node scripts/prerender.mjs
 * 前置条件: npm install --save-dev playwright && npx playwright install chromium
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const BASE_PATH = '/Get-Started-with-Web3';
const PORT = 4173;

// 从 courseData 动态生成路由列表
function getRoutes() {
  const routes = ['/', '/dashboard', '/badges'];

  // 读取 courseData 源码提取路由
  const courseDataPath = join(__dirname, '..', 'src', 'config', 'courseData.js');
  const content = readFileSync(courseDataPath, 'utf-8');

  // 提取所有模块 ID
  const moduleIdRegex = /id:\s*'(module-\d+)'/g;
  const lessonIdRegex = /id:\s*'(\d+-\d+)'/g;

  let currentModuleId = null;
  const lines = content.split('\n');

  for (const line of lines) {
    const moduleMatch = line.match(/id:\s*'(module-\d+)'/);
    if (moduleMatch) {
      currentModuleId = moduleMatch[1];
    }
    const lessonMatch = line.match(/id:\s*'(\d+-\d+)'/);
    if (lessonMatch && currentModuleId) {
      routes.push(`/learn/${currentModuleId}/${lessonMatch[1]}`);
    }
  }

  return routes;
}

// 简单静态文件服务器
function createStaticServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.md': 'text/markdown',
    '.MD': 'text/markdown',
  };

  return createServer((req, res) => {
    let url = req.url;

    // 去掉 base path
    if (url.startsWith(BASE_PATH)) {
      url = url.slice(BASE_PATH.length) || '/';
    }

    // SPA fallback: 非静态资源都返回 index.html
    let filePath = join(DIST_DIR, url);
    if (!existsSync(filePath) || url === '/') {
      filePath = join(DIST_DIR, 'index.html');
    }

    try {
      const data = readFileSync(filePath);
      const ext = '.' + filePath.split('.').pop();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch {
      // Fallback to index.html for SPA routes
      try {
        const data = readFileSync(join(DIST_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
    }
  });
}

async function prerender() {
  const routes = getRoutes();
  console.log(`[prerender] Found ${routes.length} routes to prerender`);

  // 启动静态服务器
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[prerender] Static server running on http://localhost:${PORT}`);

  // 启动浏览器
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  let success = 0;
  let failed = 0;

  for (const route of routes) {
    const url = `http://localhost:${PORT}${BASE_PATH}${route}`;
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // 等待内容渲染（markdown 加载等）
      await page.waitForTimeout(1000);

      // 获取完整 HTML
      const html = await page.content();

      // 确定输出路径
      const outputPath =
        route === '/'
          ? join(DIST_DIR, 'index.html')
          : join(DIST_DIR, route.slice(1), 'index.html');

      // 创建目录
      const outputDir = dirname(outputPath);
      mkdirSync(outputDir, { recursive: true });

      // 写入 HTML
      writeFileSync(outputPath, html, 'utf-8');
      success++;
      console.log(`  ✓ ${route}`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${route}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  // 清理
  await browser.close();
  server.close();

  console.log(`\n[prerender] Done: ${success} succeeded, ${failed} failed out of ${routes.length} routes`);

  if (failed > 0) {
    process.exit(1);
  }
}

prerender().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
