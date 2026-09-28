import { defineConfig, loadEnv } from 'vite'
import { handler as projectHandler } from './netlify/functions/projects.js'
import { handler as certificationHandler } from './netlify/functions/public-certifications.js'
import react from '@vitejs/plugin-react'

Object.assign(process.env, loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''));
const publicCatalog = () => {
  const mount = server => { server.middlewares.use(async (request, response, next) => {
    const handlers = { '/api/projects': projectHandler, '/api/public-certifications': certificationHandler };
    const handler = handlers[request.url?.split('?')[0]];
    if (!handler) return next();
    const result = await handler({ httpMethod: request.method });
    response.writeHead(result.statusCode, result.headers); response.end(result.body);
  }); };
  return { name: 'public-project-catalog', configureServer: mount, configurePreviewServer: mount };
};
// https://vite.dev/config/
export default defineConfig({
  // Only these deliberately public values may enter the browser bundle.
  // In particular, legacy VITE_* server secrets are no longer exposed automatically.
  envPrefix: [],
  define: Object.fromEntries([
    'VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_DATABASE_URL',
    'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID', 'VITE_FIREBASE_MEASUREMENT_ID', 'VITE_GA_ID', 'VITE_ADMIN_EMAILS',
  ].map(name => [`import.meta.env.${name}`, JSON.stringify(process.env[name] || '')])),
  plugins: [react(), publicCatalog()],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        rewrite: path => path === '/api/chat' ? '/.netlify/functions/gemini' : path.replace('/api/', '/.netlify/functions/'),
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
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-store': ['firebase/firestore'],
          'firebase-database': ['firebase/database'],
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
