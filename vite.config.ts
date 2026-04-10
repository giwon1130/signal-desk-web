import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react'
          if (id.includes('lightweight-charts')) return 'vendor-chart'
        },
      },
    },
  },
  server: {
    port: 4178,
  },
})
