import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Get-Started-with-Web3/', // 正确的GitHub仓库名
  build: {
    // 避免CSP问题 - 不在生产环境使用eval
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 确保资源路径正确
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 智能代码分割优化
        manualChunks(id) {
          // React核心库单独打包
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router-dom')
          ) {
            return 'react-vendor';
          }
          // 状态管理库
          if (id.includes('node_modules/zustand')) {
            return 'store';
          }
          // UI组件库
          if (id.includes('node_modules/lucide-react')) {
            return 'ui';
          }
          // Markdown渲染库（按需加载）
          if (
            id.includes('node_modules/react-markdown') ||
            id.includes('node_modules/remark') ||
            id.includes('node_modules/rehype') ||
            id.includes('node_modules/unified') ||
            id.includes('node_modules/mdast') ||
            id.includes('node_modules/hast') ||
            id.includes('node_modules/micromark') ||
            id.includes('node_modules/unist')
          ) {
            return 'markdown';
          }
          // AI相关库
          if (id.includes('node_modules/@google')) {
            return 'ai';
          }
        },
      },
    },
  },
  // 开发环境配置
  server: {
    // 确保开发环境也遵循CSP
    hmr: {
      protocol: 'ws',
    },
  },
});
