import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '5173'),
    proxy: {
      // Every request starting with /api is forwarded to the backend
      '/api': {
        target: process.env.VITE_SERVER_URL || 'http://server:3000',
        changeOrigin: true,
      }
    }
  }
})
