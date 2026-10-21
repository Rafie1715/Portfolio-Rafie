import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Laptop, Sparkles } from 'lucide-react';

const WorkspaceDesk3D = lazy(() => import('./WorkspaceDesk3D'));

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
};

export default function WorkspaceDeskPreview() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [canRender3D, setCanRender3D] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && supportsWebGL()) {
      setCanRender3D(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px 0px' }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const fallback = (
    <div
      role="status"
      className="flex h-[440px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 p-6 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 sm:h-[520px]"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
        <Laptop size={28} aria-hidden="true" />
      </div>
      <p className="font-bold text-slate-800 dark:text-slate-200 text-base">
        {t('workspace.desk_3d.title')}
      </p>
      <p className="mt-1 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        {t('workspace.desk_3d.hint')}
      </p>
    </div>
  );

  return (
    <div ref={ref} className="w-full">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles size={13} className="text-amber-500" aria-hidden="true" />
            <span>{t('workspace.desk_3d.eyebrow')}</span>
          </p>
          <h2 className="mt-1 text-2xl font-black text-dark dark:text-white sm:text-3xl">
            {t('workspace.desk_3d.title')}
          </h2>
        </div>
      </div>

      {canRender3D && inView ? (
        <Suspense fallback={fallback}>
          <WorkspaceDesk3D
            labels={{
              title: t('workspace.desk_3d.title'),
              hint: t('workspace.desk_3d.hint'),
              touch_hint: t('workspace.desk_3d.touch_hint'),
              toggle_lamp: t('workspace.desk_3d.toggle_lamp'),
              lamp_on: t('workspace.desk_3d.lamp_on'),
              lamp_off: t('workspace.desk_3d.lamp_off'),
              view_overview: t('workspace.desk_3d.view_overview'),
              view_laptop: t('workspace.desk_3d.view_laptop'),
              view_monitor: t('workspace.desk_3d.view_monitor'),
              view_phone: t('workspace.desk_3d.view_phone'),
              reset_view: t('workspace.desk_3d.reset_view'),
            }}
          />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

