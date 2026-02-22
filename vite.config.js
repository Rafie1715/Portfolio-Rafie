import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@react-three/rapier'] 
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
          'ui-libs': ['react-helmet-async', 'react-fast-marquee', 'typewriter-effect'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
})
