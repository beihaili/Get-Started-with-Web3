import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
      }
    },
    // 确保资源路径正确
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 避免代码分割导致的动态导入问题
        manualChunks: undefined,
      }
    }
  },
  // 开发环境配置
  server: {
    // 确保开发环境也遵循CSP
    hmr: {
      protocol: 'ws',
    }
  }
})