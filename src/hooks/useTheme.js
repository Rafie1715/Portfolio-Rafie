import { useState, useEffect } from 'react';
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch { return 'light'; }
  });
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); try { localStorage.setItem('theme', theme); } catch { /* Storage may be unavailable. */ } }, [theme]);
  return { theme, toggleTheme: () => setTheme(value => value === 'dark' ? 'light' : 'dark') };
}
