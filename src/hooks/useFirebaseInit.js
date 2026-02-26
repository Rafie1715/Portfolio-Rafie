import { useEffect, useState } from 'react';

let firebaseModule = null;
let firebaseInitializing = false;
let firebaseInitPromise = null;

/**
 * Hook to lazy-load Firebase only when needed
 * Defers Firebase initialization until first use
 * @param {string} service - Which service to load: 'auth', 'db', 'dbFirestore', or 'all'
 * @returns {object} Firebase service(s) or empty object if loading
 */
export const useFirebaseInit = (service = 'all') => {
  const [firebase, setFirebase] = useState(() => {
    // If Firebase already loaded, return immediately
    if (firebaseModule) {
      return getService(firebaseModule, service);
    }
    return null;
  });

  const [loading, setLoading] = useState(!firebaseModule);

  useEffect(() => {
    if (firebaseModule) {
      // Already loaded
      setFirebase(getService(firebaseModule, service));
      setLoading(false);
      return;
    }

    // Start loading if not already in progress
    if (!firebaseInitializing) {
      firebaseInitializing = true;
      firebaseInitPromise = import('../config/firebase').then(module => {
        firebaseModule = module;
        firebaseInitializing = false;
        return module;
      });
    }

    // Wait for Firebase to load
    firebaseInitPromise.then(module => {
      setFirebase(getService(module, service));
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load Firebase:', err);
      setLoading(false);
    });
  }, [service]);

  return { ...firebase, loading };
};

/**
 * Helper to get specific Firebase service
 */
function getService(firebaseModule, service) {
  const result = {};
  
  if (service === 'all') {
    result.auth = firebaseModule.auth;
    result.db = firebaseModule.db;
    result.dbFirestore = firebaseModule.dbFirestore;
    result.analytics = firebaseModule.analytics;
  } else if (service === 'auth') {
    result.auth = firebaseModule.auth;
  } else if (service === 'db') {
    result.db = firebaseModule.db;
  } else if (service === 'dbFirestore') {
    result.dbFirestore = firebaseModule.dbFirestore;
  }
  
  return result;
}
