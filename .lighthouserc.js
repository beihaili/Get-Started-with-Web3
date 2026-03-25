// .lighthouserc.js
// 根据你的框架修改 startServerCommand 和 url 👇

// 框架对应的构建输出目录：
// next.js  (静态导出)  → "npx serve ./out -p 3000"
// next.js  (SSR)       → "npx next start -p 3000"  (需先 next build)
// vite                 → "npx serve ./dist -p 3000"
// create React App     → "npx serve ./build -p 3000"
// nuxt (静态)          → "npx serve ./.output/public -p 3000"
// astro                → "npx serve ./dist -p 3000"

module.exports = {
  ci: {
    collect: {
      // 👇 根据框架修改这里
      startServerCommand: 'npx serve ./dist -p 3000',
      startServerReadyPattern: 'Accepting connections',
      startServerReadyTimeout: 30000,

      // 👇 如果有多个页面需要检测，在这里添加
      url: [
        'http://localhost:3000',
        // 'http://localhost:3000/about',
        // 'http://localhost:3000/contact',
      ],

      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu',
      },
    },

    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // 低于以下分数时 PR 构建失败 (error) 或警告 (warn)
        'categories:performance':    ['error', { minScore: 0.8 }],  // 性能 ≥ 80
        'categories:accessibility':  ['error', { minScore: 0.9 }],  // 无障碍 ≥ 90
        'categories:seo':            ['error', { minScore: 0.9 }],  // SEO ≥ 90
        'categories:best-practices': ['warn',  { minScore: 0.8 }],  // 最佳实践 ≥ 80 (仅警告)
      },
    },

    upload: {
      // 结果上传到临时公共存储，链接会显示在 GitHub Actions 日志中
      target: 'temporary-public-storage',
    },
  },
};
