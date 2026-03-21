/**
 * Sitemap 生成脚本
 * 读取 courseData.js 提取所有路由，生成 sitemap.xml 到 dist/
 *
 * 用法: node scripts/generate-sitemap.mjs
 * 前置条件: dist/ 目录存在（在 vite build 之后运行）
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const BASE_URL = 'https://beihaili.github.io/Get-Started-with-Web3';

// 支持的语言前缀
const LANGS = ['zh', 'en'];

// 每种语言下的静态页面路径
const STATIC_PAGES = ['', '/dashboard', '/badges', '/articles', '/support', '/contributors'];

/**
 * 从 courseData.js 源码中用正则提取模块 ID 和课程 ID
 * 复用与 prerender.mjs 相同的解析策略
 */
function getLearnRoutes() {
  const courseDataPath = join(__dirname, '..', 'src', 'config', 'courseData.js');
  const content = readFileSync(courseDataPath, 'utf-8');

  const routes = [];
  let currentModuleId = null;

  for (const line of content.split('\n')) {
    // 匹配模块 ID，例如: id: 'module-1'
    const moduleMatch = line.match(/id:\s*'(module-\d+)'/);
    if (moduleMatch) {
      currentModuleId = moduleMatch[1];
    }

    // 匹配课程 ID，例如: id: '1-1'
    const lessonMatch = line.match(/id:\s*'(\d+-\d+)'/);
    if (lessonMatch && currentModuleId) {
      routes.push(`/learn/${currentModuleId}/${lessonMatch[1]}`);
    }
  }

  return routes;
}

/**
 * 将 URL 列表转换为合法的 XML sitemap 字符串
 */
function buildSitemapXml(urls) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function generateSitemap() {
  const learnRoutes = getLearnRoutes();
  console.log(`[sitemap] Found ${learnRoutes.length} learn routes from courseData`);

  const allUrls = [];

  for (const lang of LANGS) {
    // 静态页面：/zh, /zh/dashboard, /zh/badges, …
    for (const page of STATIC_PAGES) {
      allUrls.push(`${BASE_URL}/${lang}${page}`);
    }

    // 课程详情页：/zh/learn/module-1/1-1, …
    for (const route of learnRoutes) {
      allUrls.push(`${BASE_URL}/${lang}${route}`);
    }
  }

  console.log(`[sitemap] Total URLs: ${allUrls.length}`);

  // 确保 dist/ 存在
  mkdirSync(DIST_DIR, { recursive: true });

  const xml = buildSitemapXml(allUrls);
  const outputPath = join(DIST_DIR, 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');

  console.log(`[sitemap] Written to ${outputPath}`);
}

generateSitemap();
