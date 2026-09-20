import { useEffect, useState } from 'react';
export const useFirebaseInit = (service = 'all') => {
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    let active = true;
    const names = service === 'all' ? ['auth', 'db', 'dbFirestore'] : [service];
    import('../config/firebase').then(async ({ getFirebaseService }) => {
      const values = await Promise.all(names.map(getFirebaseService));
      if (active) setState({ ...Object.fromEntries(names.map((name, i) => [name, values[i]])), loading: false });
    }).catch(() => { if (active) setState({ loading: false, error: true }); });
    return () => { active = false; };
  }, [service]);
  return state;
};
