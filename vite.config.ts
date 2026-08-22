import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/gsap/')) return 'animation'
          if (id.includes('/react-router') || id.includes('/@remix-run/')) return 'router'
          return undefined
        },
      },
    },
  },
})
