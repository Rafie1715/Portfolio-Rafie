import { initializeApp, getApps } from 'firebase/app';
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const services = new Map();
export function getFirebaseService(service) {
  if (!config.apiKey || !config.projectId) return Promise.reject(new Error('Firebase is not configured'));
  if (!services.has(service)) {
    const app = getApps()[0] || initializeApp(config);
    const load = service === 'auth' ? import('firebase/auth').then(m => m.getAuth(app))
      : service === 'db' ? import('firebase/database').then(m => m.getDatabase(app))
      : import('firebase/firestore').then(m => m.getFirestore(app));
    services.set(service, load.catch(error => { services.delete(service); throw error; }));
  }
  return services.get(service);
}
