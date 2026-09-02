import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const technologyCatalog = {
  kotlin: {
    name: 'Kotlin',
    icon: 'devicon-kotlin-plain',
    color: '#7f52ff',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
  },
  android_studio: {
    name: 'Android Studio',
    icon: 'devicon-androidstudio-plain',
    color: '#3ddc84',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
  },
  firebase: {
    name: 'Firebase',
    icon: 'devicon-firebase-plain',
    color: '#f59e0b',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'planetku', 'portfolio-website'],
  },
  gradle: {
    name: 'Gradle',
    icon: 'devicon-gradle-original',
    color: '#209b8a',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
  },
  tensorflow: {
    name: 'TensorFlow',
    icon: 'devicon-tensorflow-original',
    color: '#ff6f00',
    projectIds: ['planetku'],
  },
  react: {
    name: 'React',
    icon: 'devicon-react-original',
    color: '#0891b2',
    projectIds: ['portfolio-website', 'personal-notes'],
  },
  javascript: {
    name: 'JavaScript',
    icon: 'devicon-javascript-plain',
    color: '#ca8a04',
    projectIds: ['computer-crafter', 'portfolio-website', 'personal-notes'],
  },
  vite: {
    name: 'Vite',
    icon: 'devicon-vitejs-plain',
    color: '#646cff',
    projectIds: ['portfolio-website', 'personal-notes'],
  },
  tailwind: {
    name: 'Tailwind CSS',
    icon: 'devicon-tailwindcss-original',
    color: '#06b6d4',
    projectIds: ['portfolio-website'],
  },
  php: {
    name: 'PHP',
    icon: 'devicon-php-plain',
    color: '#777bb4',
    projectIds: ['computer-crafter'],
  },
  mysql: {
    name: 'MySQL',
    icon: 'devicon-mysql-original',
    color: '#00758f',
    projectIds: ['computer-crafter'],
  },
  python: {
    name: 'Python',
    icon: 'devicon-python-plain',
    color: '#3776ab',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'sentimen-deepseek'],
  },
  scikit_learn: {
    name: 'Scikit-Learn',
    icon: 'devicon-scikitlearn-plain',
    color: '#f7931e',
    projectIds: ['OD60ttuTSwZW62TRJFm6', 'sentimen-deepseek'],
  },
  pandas: {
    name: 'Pandas',
    icon: 'devicon-pandas-plain',
    color: '#6550a1',
    projectIds: ['sentimen-deepseek'],
  },
};

const technologiesByLens = {
  overview: ['kotlin', 'react', 'firebase', 'tensorflow', 'python', 'javascript'],
  android: ['kotlin', 'android_studio', 'firebase', 'gradle', 'tensorflow', 'scikit_learn'],
  frontend: ['react', 'javascript', 'vite', 'tailwind', 'php', 'mysql'],
  ai: ['python', 'tensorflow', 'scikit_learn', 'pandas', 'kotlin', 'firebase'],
};

const LivingTechStack = ({ mode, onTechnologySelect }) => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );
  const [selection, setSelection] = useState(null);
  const technologies = technologiesByLens[mode].map((id) => ({ id, ...technologyCatalog[id] }));
  const activeTechnology = selection?.mode === mode
    ? technologies.find((technology) => technology.id === selection.id) || technologies[0]
    : technologies[0];

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
    onTechnologySelect?.({
      id: technology.id,
      name: technology.name,
      projectIds: technology.projectIds,
    });
  };

  return (
    <div ref={sectionRef} className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-700">
      <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase text-primary">
            {t('home.recruiter_lens.living_stack.eyebrow')}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white md:text-xl">
            {t('home.recruiter_lens.living_stack.title')}
          </h3>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          {t('home.recruiter_lens.living_stack.summary')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-stretch">
        <div
          className={`living-tech-stage relative min-h-[190px] overflow-hidden border-y border-slate-200 py-4 dark:border-slate-700 ${isInView ? 'is-active' : ''}`}
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <span className="living-tech-route living-tech-route-horizontal absolute left-[16.66%] right-[16.66%] top-1/2 h-px border-t border-dashed border-slate-300 dark:border-slate-700" />
              <span className="living-tech-route living-tech-route-vertical absolute bottom-[23%] left-1/3 top-[23%] w-px border-l border-dashed border-slate-300 dark:border-slate-700" style={{ '--tech-route-delay': '-1.6s' }} />
              <span className="living-tech-route living-tech-route-vertical absolute bottom-[23%] left-2/3 top-[23%] w-px border-l border-dashed border-slate-300 dark:border-slate-700" style={{ '--tech-route-delay': '-3.2s' }} />
            </div>

            <div
              className="relative grid grid-cols-3 gap-2 sm:gap-3"
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
                      className={`group flex h-[74px] w-full min-w-0 items-center gap-2 rounded-lg border bg-white px-2 text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-950 sm:h-[78px] sm:gap-3 sm:px-3 ${
                        isSelected
                          ? 'border-slate-900 dark:border-white'
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
                        <i className={`${technology.icon} text-[25px]`} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 text-xs font-bold leading-4 text-slate-700 dark:text-slate-200 sm:text-sm">
                        {technology.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          key={`${mode}-${activeTechnology.id}`}
          className="living-tech-detail flex min-h-[190px] flex-col justify-center border-l-2 px-5 py-3 transition-colors duration-300"
          style={{ borderColor: activeTechnology.color }}
          aria-live="polite"
        >
          <span
            className="flex size-12 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${activeTechnology.color}14`,
              color: activeTechnology.color,
            }}
            aria-hidden="true"
          >
            <i className={`${activeTechnology.icon} text-[28px]`} />
          </span>
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
        </div>
      </div>
    </div>
  );
};

export default LivingTechStack;
