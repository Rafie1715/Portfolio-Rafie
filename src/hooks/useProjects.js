import { useCallback, useEffect, useState } from 'react';

export function useProjects() {
  const [state, setState] = useState({ projects: [], loading: true, error: false });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => controller.abort(), 10000);
    const load = async () => {
      setState({ projects: [], loading: true, error: false });
      try {
        const response = await fetch('/.netlify/functions/projects', { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Project catalog unavailable');
        const data = await response.json();
        if (!Array.isArray(data.projects)) throw new Error('Invalid project catalog');
        if (active) setState({ projects: data.projects, loading: false, error: false });
      } catch {
        if (active) setState({ projects: [], loading: false, error: true });
      } finally { clearTimeout(timer); }
    };
    load();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);
  return { ...state, retry };
}
