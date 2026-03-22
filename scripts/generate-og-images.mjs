/**
 * OG Image 生成脚本
 * 使用 satori + @resvg/resvg-js 为每个课程页面生成 1200x630 的 OG 图片
 *
 * 用法: node scripts/generate-og-images.mjs
 * 前置条件: dist/ 目录存在（在 vite build 之后运行）
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const OG_DIR = join(DIST_DIR, 'og');

// OG 图片尺寸
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * 从 courseData.js 源码中用正则提取模块和课程信息
 * 复用与 generate-sitemap.mjs / prerender.mjs 相同的解析策略
 */
function parseCourseData() {
  const courseDataPath = join(__dirname, '..', 'src', 'config', 'courseData.js');
  const content = readFileSync(courseDataPath, 'utf-8');

  const modules = [];
  let currentModule = null;

  for (const line of content.split('\n')) {
    // 匹配模块 ID，例如: id: 'module-1'
    const moduleIdMatch = line.match(/id:\s*'(module-\d+)'/);
    if (moduleIdMatch) {
      currentModule = { id: moduleIdMatch[1], title: '', lessons: [] };
      modules.push(currentModule);
    }

    // 匹配模块标题，例如: title: 'Web3 快速入门'
    if (currentModule && currentModule.title === '') {
      const titleMatch = line.match(/title:\s*'([^']+)'/);
      if (titleMatch && !titleMatch[1].match(/^\d+-\d+$/)) {
        currentModule.title = titleMatch[1];
      }
    }

    // 匹配课程 ID，例如: id: '1-1'
    const lessonIdMatch = line.match(/id:\s*'(\d+-\d+)'/);
    if (lessonIdMatch && currentModule) {
      currentModule.lessons.push({ id: lessonIdMatch[1], title: '' });
    }

    // 匹配课程标题（紧跟课程 ID 后面的 title 行）
    if (currentModule && currentModule.lessons.length > 0) {
      const lastLesson = currentModule.lessons[currentModule.lessons.length - 1];
      if (lastLesson.title === '') {
        const lessonTitleMatch = line.match(/title:\s*'([^']+)'/);
        if (lessonTitleMatch && !lessonTitleMatch[1].match(/^(module-\d+|\d+-\d+)$/)) {
          lastLesson.title = lessonTitleMatch[1];
        }
      }
    }
  }

  return modules;
}

/**
 * 加载字体数据 (satori 需要 ArrayBuffer 格式的字体)
 * 从 Google Fonts CDN 获取 Inter 字体
 */
async function loadFont() {
  const fontUrl =
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff';
  console.log('[og] Fetching font from CDN...');
  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.status} ${response.statusText}`);
  }
  return await response.arrayBuffer();
}

/**
 * 生成 OG 图片的 JSX 模板（satori 使用 React-like JSX 对象）
 * 深色渐变背景，白色标题，灰色副标题，底部品牌标识
 *
 * 注意：satori 要求所有多子元素容器显式声明 display: flex，
 * 且空 children 不被允许。
 */
function createOgTemplate(title, subtitle) {
  // 构建中央内容区的子元素列表
  const contentChildren = [
    // 主标题
    {
      type: 'div',
      props: {
        style: {
          fontSize: '48px',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: '1000px',
        },
        children: title,
      },
    },
  ];

  // 有副标题时追加
  if (subtitle) {
    contentChildren.push({
      type: 'div',
      props: {
        style: {
          fontSize: '24px',
          fontWeight: 400,
          color: '#94a3b8',
          textAlign: 'center',
          lineHeight: 1.4,
        },
        children: subtitle,
      },
    });
  }

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '60px 80px',
      },
      children: [
        // 中央内容区
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: '24px',
            },
            children: contentChildren,
          },
        },
        // 底部品牌标识
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '20px',
            },
            children: [
              // 渐变圆形图标
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  },
                },
              },
              // 品牌文字
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: '20px',
                    color: '#64748b',
                  },
                  children: 'Get Started with Web3',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

/**
 * 将 satori SVG 转换为 PNG
 */
function svgToPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

async function generateOgImages() {
  const modules = parseCourseData();
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  console.log(
    `[og] Found ${modules.length} modules with ${totalLessons} lessons`
  );

  // 加载字体
  const fontData = await loadFont();
  const fonts = [
    {
      name: 'Inter',
      data: fontData,
      weight: 400,
      style: 'normal',
    },
  ];

  // 确保输出目录存在
  mkdirSync(OG_DIR, { recursive: true });

  let generated = 0;

  // 生成默认首页 OG 图片
  const defaultTemplate = createOgTemplate(
    'Get Started with Web3',
    'Web3 & Bitcoin Interactive Learning Platform'
  );
  const defaultSvg = await satori(defaultTemplate, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const defaultPng = svgToPng(defaultSvg);
  writeFileSync(join(OG_DIR, 'default.png'), defaultPng);
  generated++;
  console.log('  [ok] default.png');

  // 为每个课程生成 OG 图片
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const filename = `${mod.id}-${lesson.id}.png`;
      const template = createOgTemplate(
        lesson.title || `Lesson ${lesson.id}`,
        mod.title || mod.id
      );

      const svg = await satori(template, {
        width: WIDTH,
        height: HEIGHT,
        fonts,
      });
      const png = svgToPng(svg);
      writeFileSync(join(OG_DIR, filename), png);
      generated++;
      console.log(`  [ok] ${filename}`);
    }
  }

  console.log(`\n[og] Done: ${generated} images generated in dist/og/`);
}

generateOgImages().catch((err) => {
  console.error('[og] Fatal error:', err);
  process.exit(1);
});
