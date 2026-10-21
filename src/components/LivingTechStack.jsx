import Icon from './Icon';
import { Link, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Sparkles } from 'lucide-react';

const TechOrbit3D = lazy(() => import('./TechOrbit3D'));

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
};

const technologyCatalog = {
  kotlin: {
    name: 'Kotlin',
    icon: 'devicon-kotlin-plain',
    color: '#7f52ff',
    category: 'Mobile',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
  },
  android_studio: {
    name: 'Android Studio',
    icon: 'devicon-androidstudio-plain',
    color: '#3ddc84',
    category: 'IDE / Tooling',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
  },
  firebase: {
    name: 'Firebase',
    icon: 'devicon-firebase-plain',
    color: '#f59e0b',
    category: 'Cloud / Auth',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'planetku', 'portfolio-website'],
  },
  gradle: {
    name: 'Gradle',
    icon: 'devicon-gradle-original',
    color: '#209b8a',
    category: 'Build Tool',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
  },
  tensorflow: {
    name: 'TensorFlow',
    icon: 'devicon-tensorflow-original',
    color: '#ff6f00',
    category: 'AI / ML',
    projectIds: ['planetku'],
  },
  react: {
    name: 'React',
    icon: 'devicon-react-original',
    color: '#0891b2',
    category: 'Front-End',
    projectIds: ['portfolio-website', 'personal-notes'],
  },
  javascript: {
    name: 'JavaScript',
    icon: 'devicon-javascript-plain',
    color: '#ca8a04',
    category: 'Front-End',
    projectIds: ['computer-crafter', 'portfolio-website', 'personal-notes'],
  },
  vite: {
    name: 'Vite',
    icon: 'devicon-vitejs-plain',
    color: '#646cff',
    category: 'Build Tool',
    projectIds: ['portfolio-website', 'personal-notes'],
  },
  tailwind: {
    name: 'Tailwind CSS',
    icon: 'devicon-tailwindcss-original',
    color: '#06b6d4',
    category: 'Styling',
    projectIds: ['portfolio-website'],
  },
  php: {
    name: 'PHP',
    icon: 'devicon-php-plain',
    color: '#777bb4',
    category: 'Backend',
    projectIds: ['computer-crafter'],
  },
  mysql: {
    name: 'MySQL',
    icon: 'devicon-mysql-original',
    color: '#00758f',
    category: 'Database',
    projectIds: ['computer-crafter'],
  },
  python: {
    name: 'Python',
    icon: 'devicon-python-plain',
    color: '#3776ab',
    category: 'AI / Data',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'sentimen-deepseek'],
  },
  scikit_learn: {
    name: 'Scikit-Learn',
    icon: 'devicon-scikitlearn-plain',
    color: '#f7931e',
    category: 'Machine Learning',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'sentimen-deepseek'],
  },
  pandas: {
    name: 'Pandas',
    icon: 'devicon-pandas-plain',
    color: '#6550a1',
    category: 'Data Analysis',
    projectIds: ['sentimen-deepseek'],
  },
  threejs: {
    name: 'Three.js',
    icon: 'devicon-threejs-original',
    color: '#10b981',
    category: '3D / WebGL',
    projectIds: ['portfolio-website'],
  },
};

const technologiesByLens = {
  overview: ['kotlin', 'react', 'python', 'threejs', 'tailwind', 'firebase'],
  android: ['kotlin', 'android_studio', 'firebase', 'gradle', 'tensorflow', 'scikit_learn'],
  frontend: ['react', 'javascript', 'vite', 'tailwind', 'threejs', 'mysql'],
  ai: ['python', 'tensorflow', 'scikit_learn', 'pandas', 'kotlin', 'firebase'],
};

const LivingTechStack = ({ mode = 'overview' }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );
  const [canUse3D, setCanUse3D] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selection, setSelection] = useState(null);

  const selectedLensList = technologiesByLens[mode] || technologiesByLens.overview;
  const technologies = selectedLensList.map((id) => ({ id, ...technologyCatalog[id] }));
  const activeTechnology = selection?.mode === mode
    ? technologies.find((technology) => technology.id === selection.id) || technologies[0]
    : technologies[0];

  const projectSearch = new URLSearchParams({ q: activeTechnology.name });
  const language = new URLSearchParams(location.search).get('lang');
  if (language) projectSearch.set('lang', language);

  useEffect(() => {
    if (typeof window !== 'undefined' && supportsWebGL()) {
      setCanUse3D(true);
      setViewMode('3d');
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '80px 0px', threshold: 0.12 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleTechnologySelect = (technology) => {
    setSelection({ mode, id: technology.id });
  };

  const renderGridView = () => (
    <div
      className={`living-tech-stage relative min-h-[220px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 ${isInView ? 'is-active' : ''}`}
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="living-tech-route living-tech-route-horizontal absolute left-[16.66%] right-[16.66%] top-1/2 h-px border-t border-dashed border-slate-300 dark:border-slate-700" />
          <span className="living-tech-route living-tech-route-vertical absolute bottom-[23%] left-1/3 top-[23%] w-px border-l border-dashed border-slate-300 dark:border-slate-700" style={{ '--tech-route-delay': '-1.6s' }} />
          <span className="living-tech-route living-tech-route-vertical absolute bottom-[23%] left-2/3 top-[23%] w-px border-l border-dashed border-slate-300 dark:border-slate-700" style={{ '--tech-route-delay': '-3.2s' }} />
        </div>

        <div
          className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
          role="group"
          aria-label={t('home.recruiter_lens.living_stack.control_label')}
        >
          {technologies.map((technology, index) => {
            const isSelected = activeTechnology.id === technology.id;

            return (
              <div
                key={`${mode}-${technology.id}`}
                className="living-tech-node min-w-0"
                style={{
                  '--tech-enter-delay': `${index * 55}ms`,
                  '--tech-slide-origin': index < 3 ? '-20px' : '20px',
                }}
              >
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleTechnologySelect(technology)}
                  className={`group flex h-[74px] w-full min-w-0 items-center gap-2 rounded-lg border bg-white px-2.5 text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-950 sm:h-[78px] sm:gap-3 sm:px-3 ${
                    isSelected
                      ? 'border-slate-900 ring-1 ring-slate-900 dark:border-white dark:ring-white'
                      : 'border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500'
                  }`}
                >
                  <span
                    className={`living-tech-mark flex size-9 flex-none items-center justify-center rounded-md sm:size-11 ${isSelected ? 'is-selected' : ''}`}
                    style={{
                      backgroundColor: `${technology.color}14`,
                      color: technology.color,
                    }}
                  >
                    <Icon className={`${technology.icon} text-[24px]`} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold leading-4 text-slate-800 dark:text-slate-200 sm:text-sm">
                      {technology.name}
                    </span>
                    {technology.category && (
                      <span className="block truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {technology.category}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-700">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase text-primary">
            {t('home.recruiter_lens.living_stack.eyebrow')}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white md:text-xl">
            {t('home.recruiter_lens.living_stack.title')}
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t('home.recruiter_lens.living_stack.summary')}
          </p>
        </div>

        {/* View Mode Switcher: 3D Orbit vs Classic Grid */}
        {canUse3D && (
          <div className="flex flex-none items-center gap-1 self-start rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700/80 dark:bg-slate-900 md:self-auto">
            <button
              type="button"
              aria-pressed={viewMode === '3d'}
              onClick={() => setViewMode('3d')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles size={13} className="text-amber-500" aria-hidden="true" />
              <span>{t('home.recruiter_lens.living_stack.orbit_view')}</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid size={13} aria-hidden="true" />
              <span>{t('home.recruiter_lens.living_stack.grid_view')}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-stretch">
        {/* Stage: 3D Orbit or Grid */}
        <div className="min-w-0">
          {viewMode === '3d' && canUse3D ? (
            <Suspense fallback={renderGridView()}>
              <TechOrbit3D
                technologies={technologies}
                activeTechnology={activeTechnology}
                onSelectTechnology={(tech) => handleTechnologySelect(tech)}
                labels={{
                  orbit_view: t('home.recruiter_lens.living_stack.orbit_view'),
                  orbit_hint: t('home.recruiter_lens.living_stack.orbit_hint'),
                  orbit_touch_hint: t('home.recruiter_lens.living_stack.orbit_touch_hint'),
                  orbit_reset: t('home.recruiter_lens.living_stack.orbit_reset'),
                  orbit_pause: t('home.recruiter_lens.living_stack.orbit_pause'),
                  orbit_play: t('home.recruiter_lens.living_stack.orbit_play'),
                }}
              />
            </Suspense>
          ) : (
            renderGridView()
          )}
        </div>

        {/* Detail Panel */}
        <div
          key={`${mode}-${activeTechnology.id}`}
          className="living-tech-detail flex min-h-[220px] flex-col justify-center rounded-xl border-2 bg-white p-5 shadow-sm transition-all duration-300 dark:bg-slate-900/80 sm:p-6"
          style={{ borderColor: activeTechnology.color }}
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-4">
            <span
              className="flex size-12 items-center justify-center rounded-lg shadow-sm"
              style={{
                backgroundColor: `${activeTechnology.color}18`,
                color: activeTechnology.color,
              }}
              aria-hidden="true"
            >
              <Icon className={`${activeTechnology.icon} text-[28px]`} />
            </span>
            {activeTechnology.category && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${activeTechnology.color}15`,
                  color: activeTechnology.color,
                }}
              >
                {activeTechnology.category}
              </span>
            )}
          </div>

          <p className="mt-4 text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
            {t('home.recruiter_lens.living_stack.active_label')}
          </p>
          <h4 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {activeTechnology.name}
          </h4>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t(`home.recruiter_lens.technologies.${activeTechnology.id}.role`)}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">
              {t('home.recruiter_lens.living_stack.used_in')}:{' '}
            </span>
            {t(`home.recruiter_lens.technologies.${activeTechnology.id}.usage`)}
          </p>
          <Link
            to={{ pathname: '/projects', search: '?' + projectSearch.toString() }}
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg font-semibold text-primary underline decoration-primary/40 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span>{t('common.related_work', { technology: activeTechnology.name })}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LivingTechStack;
