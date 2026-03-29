import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3464,
    proxy: {
      '/api': { target: 'http://localhost:3086', changeOrigin: true }
    }
  }
})
