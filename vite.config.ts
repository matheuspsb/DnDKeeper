import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { driveImgProxy } from './proxy/driveImgProxy'

export default defineConfig({
  plugins: [react(), tailwindcss(), driveImgProxy()],
  server: {
    port: 3001,
    strictPort: true,
  },
})
