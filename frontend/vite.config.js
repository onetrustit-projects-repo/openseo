import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3460,
    proxy: {
      '/api': { target: 'http://localhost:3082', changeOrigin: true }
    }
  }
})
