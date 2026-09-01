import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
      '/api/chat': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        rewrite: () => '/.netlify/functions/gemini',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - libraries that rarely change
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
          'i18n': ['i18next', 'react-i18next'],
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'ui-libs': ['react-helmet-async'],
          'three-core': ['three'],
          'three-react': ['@react-three/fiber'],
        },
      },
    },
    // Three.js remains lazy-loaded and isolated from the main application bundle.
    chunkSizeWarningLimit: 700,
    // Enable minification with esbuild (default, faster than terser)
    minify: 'esbuild',
  },
})
