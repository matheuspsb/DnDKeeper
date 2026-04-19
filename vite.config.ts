import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    strictPort: true,
    proxy: {
      '/drive-img': {
        target: 'https://drive.google.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/drive-img/, '/thumbnail'),
      },
    },
  },
})
