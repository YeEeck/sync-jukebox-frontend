// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 导入 Node.js 的 path 模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 添加 resolve.alias 配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
