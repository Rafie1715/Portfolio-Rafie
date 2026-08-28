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
    },
  },
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
          'ui-libs': ['react-helmet-async'],
          'three-core': ['three'],
          'three-react': ['@react-three/fiber'],
          'three-drei': ['@react-three/drei'],
          'rapier-runtime': ['@dimforge/rapier3d-compat'],
          'three-physics': ['@react-three/rapier'],
          'three-utils': ['three-stdlib', 'meshline'],
        },
      },
    },
    // Rapier compat ships its WASM runtime inline (~2.06 MB raw) in one lazy chunk.
    chunkSizeWarningLimit: 2100,
    // Enable minification with esbuild (default, faster than terser)
    minify: 'esbuild',
  },
})
