import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IDCard from './IDCard';

const ThreeIDCard = lazy(() => import('./ThreeIDCard'));

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
};

export default function DeveloperIDPreview() {
  const ref = useRef(null);
  const [mode, setMode] = useState('pending');
  const { t } = useTranslation();
  useEffect(() => {
    const load = () => setMode(supportsWebGL() ? '3d' : 'static');
    if (!('IntersectionObserver' in window)) { load(); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { load(); observer.disconnect(); }
    }, { rootMargin: '200px 0px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const placeholder = <div role="status" className="flex h-[440px] items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 md:h-[500px]">{t('common.developer_id_loading')}</div>;
  return (
    <div ref={ref} data-developer-id className="mx-auto w-full min-w-0 max-w-sm text-center lg:max-w-none">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary">{t('about.profile_lab.title')}</h3>
      {mode === 'pending' ? placeholder : mode === 'static' ? <IDCard /> : (
        <Suspense fallback={placeholder}><ThreeIDCard /></Suspense>
      )}
      <p className="sr-only">{t('common.developer_id_description')}</p>
    </div>
  );
}
