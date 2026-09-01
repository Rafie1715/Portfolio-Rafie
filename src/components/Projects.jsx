import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Figma,
  FolderGit2,
  Github,
  Play,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { projects as manualProjects } from '../data/projects';
import { trackExternalLink, trackProjectView } from '../utils/analytics';
import LazyImage from './LazyImage';

const ARCHIVE_PREVIEW_COUNT = 6;

const RESTUP_IMPACT = {
  role: {
    en: 'Thesis Researcher and ML Developer',
    id: 'Peneliti Skripsi dan ML Developer',
  },
  team: {
    en: 'Independent thesis project',
    id: 'Proyek skripsi mandiri',
  },
  result: {
    en: '92.06% Random Forest accuracy',
    id: 'Akurasi Random Forest 92,06%',
  },
  scope: {
    en: 'Sleep quality monitoring and prediction',
    id: 'Pemantauan dan prediksi kualitas tidur',
  },
};

const getLocalized = (data, language) => {
  if (!data) return '';
  if (typeof data === 'object' && !Array.isArray(data)) {
    return data[language] || data.en || data.id || '';
  }
  return String(data);
};

const normalizeText = (value) => String(value || '').toLowerCase().trim();

const normalizeTitle = (project) => normalizeText(
  typeof project?.title === 'object'
    ? project.title.en || project.title.id
    : project?.title
).replace(/[^a-z0-9]+/g, '');

const isRestUpProject = (project) => {
  const title = normalizeTitle(project);
  return title.includes('restup') || title.includes('sleepqualitymonitoring');
};

const enhanceProject = (project) => {
  if (!isRestUpProject(project)) return project;

  return {
    ...project,
    featuredOrder: 1,
    year: project.year || '2026',
    impactDetails: project.impactDetails || RESTUP_IMPACT,
    impact: project.impact || {
      en: 'Thesis Researcher | Sleep quality prediction | 92.06% accuracy',
      id: 'Peneliti Skripsi | Prediksi kualitas tidur | Akurasi 92,06%',
    },
  };
};

const getProjectDomains = (project) => {
  const category = normalizeText(project?.category);
  const title = normalizeTitle(project);
  const tech = Array.isArray(project?.techStack)
    ? project.techStack.map((item) => normalizeText(item?.name || item)).join(' ')
    : '';
  const domains = [];

  if (['mobile', 'flutter', 'android'].includes(category)) domains.push('mobile');
  if (category === 'web') domains.push('web');
  if (['ui', 'ux', 'design'].includes(category)) domains.push('ui');
  if (
    ['ai', 'ml', 'machine-learning'].includes(category)
    || /tensorflow|scikit|opencv|machine learning|random forest/.test(tech)
    || /sentiment|mangosteen|restup|sleepquality/.test(title)
  ) domains.push('ai');

  return domains.length > 0 ? domains : ['other'];
};

const getProjectDomain = (project) => getProjectDomains(project)[0];

const getTimestamp = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const ProjectActions = ({ project, title, compact = false, t }) => {
  const externalActions = [
    project.live && {
      href: project.live,
      label: t('projects.live_site'),
      icon: <ExternalLink size={18} aria-hidden="true" />,
      analytics: 'live_demo',
    },
    project.github && {
      href: project.github,
      label: t('projects.source_code'),
      icon: <Github size={18} aria-hidden="true" />,
      analytics: 'github_repo',
    },
    project.figma && {
      href: project.figma,
      label: t('projects.design'),
      icon: <Figma size={18} aria-hidden="true" />,
      analytics: 'figma_design',
    },
    project.prototype && {
      href: project.prototype,
      label: t('projects.prototype'),
      icon: <Play size={18} aria-hidden="true" />,
      analytics: 'figma_prototype',
    },
  ].filter(Boolean);

  return (
    <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-slate-700">
      <Link
        to={`/project/${project.id}`}
        onClick={() => trackProjectView(project.id, title)}
        className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 font-semibold text-white transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}
      >
        <span>{compact ? t('projects.view_details') : t('projects.case_study')}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>

      {externalActions.map(({ href, label, icon, analytics }) => (
        <a
          key={analytics}
          href={href}
          target="_blank"
          rel="noreferrer"
          title={label}
          aria-label={`${label}: ${title}`}
          onClick={() => trackExternalLink(analytics, href)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

const ProjectCard = ({
  project,
  language,
  t,
  featured = false,
  lead = false,
  animateLayout = false,
  reduceMotion = false,
}) => {
  const title = getLocalized(project.title, language);
  const shortDesc = getLocalized(project.shortDesc, language);
  const impactDetails = project.impactDetails || {};
  const role = getLocalized(impactDetails.role, language);
  const result = getLocalized(impactDetails.result, language);
  const scope = getLocalized(impactDetails.scope, language);
  const impactFallback = getLocalized(project.impact, language);
  const techStack = Array.isArray(project.techStack) ? project.techStack.slice(0, featured ? 5 : 3) : [];
  const domain = getProjectDomain(project);
  const animationProps = animateLayout && !reduceMotion
    ? {
        layout: true,
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: {
          duration: 0.24,
          ease: 'easeOut',
          layout: { duration: 0.28, ease: 'easeOut' },
        },
      }
    : {};

  return (
    <motion.article
      {...animationProps}
      className={`group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-darkLight ${lead ? 'lg:col-span-2 lg:grid lg:h-[32rem] lg:grid-cols-[1.25fr_1fr]' : 'flex h-full flex-col'}`}
    >
      <Link
        to={`/project/${project.id}`}
        onClick={() => trackProjectView(project.id, title)}
        className={`relative block aspect-video overflow-hidden bg-gray-100 dark:bg-slate-800 ${lead ? 'lg:h-full lg:aspect-auto' : ''}`}
        aria-label={`${t('projects.case_study')}: ${title}`}
      >
        <LazyImage
          src={project.image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          wrapperClassName="absolute inset-0 h-full w-full"
          placeholderClassName="rounded-none"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold uppercase text-gray-800 shadow-sm backdrop-blur dark:bg-slate-900/95 dark:text-gray-100">
            {t(`projects.filter.${domain}`)}
          </span>
          {project.year && (
            <span className="rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              {project.year}
            </span>
          )}
        </div>
        {project.conceptualCover && (
          <span className="absolute bottom-3 right-3 rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {t('projects.conceptual_cover')}
          </span>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? 'p-5 sm:p-6' : 'p-5'}`}>
        <div className="mb-4">
          <Link
            to={`/project/${project.id}`}
            onClick={() => trackProjectView(project.id, title)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <h3 className={`${lead ? 'text-2xl sm:text-3xl' : 'text-xl'} mb-2 font-bold leading-tight text-dark transition-colors group-hover:text-primary dark:text-white`}>
              {title}
            </h3>
          </Link>
          <p className={`text-sm leading-relaxed text-gray-600 dark:text-gray-300 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {shortDesc}
          </p>
        </div>

        {featured && (role || result || scope) ? (
          <dl className="mb-4 grid grid-cols-1 gap-3 border-y border-gray-100 py-4 sm:grid-cols-2 dark:border-slate-700">
            {(role || scope) && (
              <div className="min-w-0">
                <dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
                  <Users size={14} aria-hidden="true" /> {t('projectDetail.impact.role')}
                </dt>
                <dd className="text-sm font-semibold leading-snug text-gray-800 dark:text-gray-100">{role || scope}</dd>
              </div>
            )}
            {result && (
              <div className="min-w-0">
                <dt className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
                  <BarChart3 size={14} aria-hidden="true" /> {t('projectDetail.impact.result')}
                </dt>
                <dd className="text-sm font-semibold leading-snug text-gray-800 dark:text-gray-100">{result}</dd>
              </div>
            )}
          </dl>
        ) : impactFallback ? (
          <p className="mb-4 line-clamp-2 text-sm font-medium leading-relaxed text-primary dark:text-blue-400">
            {impactFallback}
          </p>
        ) : null}

        {techStack.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-2" aria-label={t('projectDetail.tech_used')}>
            {techStack.map((tech) => (
              <li
                key={tech?.name || String(tech)}
                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-gray-300"
              >
                {tech?.name || String(tech)}
              </li>
            ))}
          </ul>
        )}

        <ProjectActions project={project} title={title} compact={!featured} t={t} />
      </div>
    </motion.article>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cmsProjects, setCmsProjects] = useState([]);
  const [showAllArchive, setShowAllArchive] = useState(false);
  const [repos, setRepos] = useState([]);
  const [githubState, setGithubState] = useState('idle');
  const [shouldLoadGithub, setShouldLoadGithub] = useState(false);
  const githubSectionRef = useRef(null);
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const currentLang = i18n.language || 'en';

  useEffect(() => {
    let cancelled = false;

    const fetchCmsProjects = async () => {
      try {
        const [firebaseModule, firestoreModule] = await Promise.all([
          import('../config/firebase'),
          import('firebase/firestore'),
        ]);
        const { dbFirestore } = firebaseModule;
        const { collection, getDocs, orderBy, query } = firestoreModule;
        if (!dbFirestore || cancelled) return;

        let snapshot;
        try {
          const projectQuery = query(collection(dbFirestore, 'projects'), orderBy('createdAt', 'desc'));
          snapshot = await getDocs(projectQuery);
        } catch (orderedError) {
          console.warn('CMS ordering unavailable, using a local sort.', orderedError);
          snapshot = await getDocs(collection(dbFirestore, 'projects'));
        }

        if (cancelled) return;
        const list = snapshot.docs
          .map((projectDoc) => ({ id: projectDoc.id, ...projectDoc.data() }))
          .filter((project) => project.isPublished !== false)
          .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

        setCmsProjects(list);
      } catch (error) {
        console.error('Failed to load CMS projects:', error);
        if (!cancelled) setCmsProjects([]);
      }
    };

    let idleId;
    let timeoutId;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(fetchCmsProjects, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(fetchCmsProjects, 600);
    }

    return () => {
      cancelled = true;
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const section = githubSectionRef.current;
    if (!section || shouldLoadGithub) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadGithub(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadGithub]);

  useEffect(() => {
    if (!shouldLoadGithub) return undefined;

    const controller = new AbortController();
    const fetchRepos = async () => {
      setGithubState('loading');
      try {
        const response = await fetch('/.netlify/functions/github', { signal: controller.signal });
        if (!response.ok) throw new Error(`GitHub request failed with ${response.status}`);
        const data = await response.json();
        setRepos(Array.isArray(data) ? data.slice(0, 3) : []);
        setGithubState('success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load GitHub repositories:', error);
          setGithubState('error');
        }
      }
    };

    fetchRepos();
    return () => controller.abort();
  }, [shouldLoadGithub]);

  const allProjects = useMemo(() => {
    const localIds = new Set(manualProjects.map((project) => normalizeText(project.id)));
    const localTitles = new Set(manualProjects.map(normalizeTitle));
    const uniqueCms = cmsProjects.filter((project) => (
      !localIds.has(normalizeText(project.id)) && !localTitles.has(normalizeTitle(project))
    ));

    return [...manualProjects, ...uniqueCms].map(enhanceProject);
  }, [cmsProjects]);

  const featuredProjects = useMemo(() => allProjects
    .filter((project) => Number(project.featuredOrder) > 0)
    .sort((a, b) => Number(a.featuredOrder) - Number(b.featuredOrder)), [allProjects]);

  const featuredIds = useMemo(
    () => new Set(featuredProjects.map((project) => project.id)),
    [featuredProjects]
  );

  const normalizedSearch = normalizeText(searchTerm);
  const isBrowsing = filter !== 'all' || Boolean(normalizedSearch);

  const filteredProjects = useMemo(() => allProjects.filter((project) => {
    if (filter !== 'all' && !getProjectDomains(project).includes(filter)) return false;
    if (!normalizedSearch) return true;

    const searchableText = [
      getLocalized(project.title, currentLang),
      getLocalized(project.shortDesc, currentLang),
      getLocalized(project.impact, currentLang),
      project.category,
      ...(Array.isArray(project.techStack) ? project.techStack.map((tech) => tech?.name || tech) : []),
    ].map(normalizeText).join(' ');

    return searchableText.includes(normalizedSearch);
  }), [allProjects, currentLang, filter, normalizedSearch]);

  const archiveProjects = useMemo(
    () => allProjects.filter((project) => !featuredIds.has(project.id)),
    [allProjects, featuredIds]
  );

  const visibleArchive = showAllArchive
    ? archiveProjects
    : archiveProjects.slice(0, ARCHIVE_PREVIEW_COUNT);
  const displayedProjects = isBrowsing ? filteredProjects : visibleArchive;

  const filters = [
    { id: 'all', label: t('projects.filter.all') },
    { id: 'mobile', label: t('projects.filter.mobile') },
    { id: 'web', label: t('projects.filter.web') },
    { id: 'ai', label: t('projects.filter.ai') },
    { id: 'ui', label: t('projects.filter.ui') },
    { id: 'other', label: t('projects.filter.other') },
  ];

  const languageColors = {
    JavaScript: 'bg-yellow-400',
    TypeScript: 'bg-blue-500',
    HTML: 'bg-orange-500',
    CSS: 'bg-sky-500',
    Python: 'bg-emerald-500',
    Dart: 'bg-cyan-500',
    Kotlin: 'bg-violet-500',
    default: 'bg-gray-400',
  };

  return (
    <section id="projects" className="bg-gray-50 py-10 transition-colors duration-300 dark:bg-dark md:py-14">
      <div className="container mx-auto max-w-6xl px-4">
        {!isBrowsing && (
          <section aria-labelledby="featured-projects-title" className="mb-16 md:mb-20">
            <div className="mb-7 max-w-2xl">
              <p className="mb-2 text-xs font-bold uppercase text-primary">{t('projects.featured_eyebrow')}</p>
              <h2 id="featured-projects-title" className="mb-3 text-2xl font-bold text-dark dark:text-white md:text-3xl">
                {t('projects.featured_title')}
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                {t('projects.featured_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  language={currentLang}
                  t={t}
                  featured
                  lead={index === 0 && isRestUpProject(project)}
                />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="project-archive-title">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-xs font-bold uppercase text-primary">
                {isBrowsing ? t('projects.search_results') : t('projects.archive_eyebrow')}
              </p>
              <h2 id="project-archive-title" className="mb-2 text-2xl font-bold text-dark dark:text-white md:text-3xl">
                {isBrowsing ? t('projects.results_title') : t('projects.archive_title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {isBrowsing
                  ? t('projects.project_count', { count: filteredProjects.length })
                  : t('projects.archive_desc')}
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <label htmlFor="project-search" className="sr-only">{t('projects.search_placeholder')}</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={19} aria-hidden="true" />
                <input
                  id="project-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t('projects.search_placeholder')}
                  className="min-h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-11 pr-11 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    title={t('projects.clear_search')}
                    aria-label={t('projects.clear_search')}
                    className="absolute right-1.5 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-2" role="group" aria-label={t('projects.filter_label')}>
            {filters.map((item) => {
              const isActive = filter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id);
                    setShowAllArchive(false);
                  }}
                  aria-pressed={isActive}
                  className={`relative isolate min-h-10 shrink-0 overflow-hidden rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    isActive
                      ? 'border-primary text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={shouldReduceMotion ? undefined : 'projects-active-filter'}
                      className="absolute inset-0 bg-primary"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {displayedProjects.length > 0 ? (
              <motion.div
                key="project-grid"
                layout={!shouldReduceMotion}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      language={currentLang}
                      t={t}
                      animateLayout
                      reduceMotion={shouldReduceMotion}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="project-empty"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="border-y border-gray-200 py-16 text-center dark:border-slate-700"
              >
                <Search className="mx-auto mb-3 text-gray-300 dark:text-slate-600" size={34} aria-hidden="true" />
                <p className="font-medium text-gray-600 dark:text-gray-300">{t('projects.no_projects')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isBrowsing && archiveProjects.length > ARCHIVE_PREVIEW_COUNT && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowAllArchive((current) => !current)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
              >
                {showAllArchive ? t('projects.show_less') : t('projects.show_all', { count: archiveProjects.length })}
                {showAllArchive ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
              </button>
            </div>
          )}
        </section>

        <section ref={githubSectionRef} aria-labelledby="github-projects-title" className="mt-20 border-t border-gray-200 pt-12 dark:border-slate-700">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-primary">
                <Github size={15} aria-hidden="true" /> {t('projects.github_eyebrow')}
              </p>
              <h2 id="github-projects-title" className="mb-2 text-2xl font-bold text-dark dark:text-white md:text-3xl">
                {t('projects.subtitle')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{t('projects.subtitle_desc')}</p>
            </div>
            <a
              href="https://github.com/Rafie1715"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackExternalLink('github_profile', 'https://github.com/Rafie1715')}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:text-gray-200"
            >
              {t('projects.view_github')} <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>

          {(githubState === 'idle' || githubState === 'loading') && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3" aria-label={t('projects.loading')}>
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-48 animate-pulse rounded-lg border border-gray-200 bg-gray-100 dark:border-slate-700 dark:bg-slate-800" />
              ))}
            </div>
          )}

          {githubState === 'success' && repos.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {repos.map((repo) => (
                <article key={repo.id} className="flex min-h-48 flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <FolderGit2 className="text-primary" size={25} aria-hidden="true" />
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      title={t('projects.open_repository')}
                      aria-label={`${t('projects.open_repository')}: ${repo.name}`}
                      onClick={() => trackExternalLink('github_repo', repo.html_url)}
                      className="inline-flex size-10 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:bg-slate-700"
                    >
                      <ExternalLink size={18} aria-hidden="true" />
                    </a>
                  </div>
                  <h3 className="mb-2 text-lg font-bold capitalize text-dark dark:text-white">{repo.name.replace(/-/g, ' ')}</h3>
                  <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {repo.description || t('projects.no_repo_description')}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`size-2.5 rounded-full ${languageColors[repo.language] || languageColors.default}`} aria-hidden="true" />
                      {repo.language || 'Code'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-500" aria-hidden="true" />
                      {repo.stargazers_count ?? 0}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {(githubState === 'error' || (githubState === 'success' && repos.length === 0)) && (
            <div className="flex flex-col items-start gap-3 border-y border-gray-200 py-8 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600 dark:text-gray-300">
                {githubState === 'error' ? t('projects.github_error') : t('projects.github_empty')}
              </p>
              <a
                href="https://github.com/Rafie1715"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:text-secondary"
              >
                {t('projects.view_github')} <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Projects;
