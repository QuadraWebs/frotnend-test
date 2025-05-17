import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      // Redirect all requests to /sanctum/csrf-cookie to the production server
      '/sanctum/csrf-cookie': {
        target: 'http://47.250.14.113',
        changeOrigin: true,
      },
      // Redirect all API requests to the production server
      '/api': {
        target: 'http://47.250.14.113',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia', 'axios'],
          'stores': ['./src/stores/auth.ts', './src/stores/chat.ts'],
        }
      }
    }
  }
})
