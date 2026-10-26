import { projectPath } from '../utils/projectRoutes';
import Icon from '../components/Icon';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import HomeAboutSnapshot from '../components/HomeAboutSnapshot';
import RecruiterPitchModal from '../components/RecruiterPitchModal';
import { useProjects } from '../hooks/useProjects';
import ProjectCatalogStatus from '../components/ProjectCatalogStatus';
import LivingTechStack from '../components/LivingTechStack';
import { blogs } from '../data/blogs';
import { FEATURED_PROJECT_IDS, projectHighlights } from '../data/projectHighlights';
import { caseStudyDetails } from '../data/caseStudyDetails';
import BlogCard from '../components/BlogCard';
import SpotlightCard from '../components/SpotlightCard';
import ProjectBuildNote from '../components/ProjectBuildNote';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Cpu, FileText } from 'lucide-react';
import { trackProjectView } from '../utils/analytics';

const HomePersonalPanel = lazy(() => import('../components/HomePersonalPanel'));

const DeferredPersonalPanel = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  const enabled = desktop || expanded;
  const targetRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = event => setDesktop(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || shouldRender || !enabled) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldRender, enabled]);

  return (
    <div ref={targetRef} className="md:min-h-[520px]">
      <div className="mx-4 mb-8 rounded-xl border border-slate-200 p-5 dark:border-slate-700 md:hidden">
        <p className="font-semibold">{t('common.personal_more')}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          <Link to="/afk" className="inline-flex min-h-11 items-center font-semibold text-primary">{t('hero.afk_cta.link')}</Link>
          <button type="button" aria-expanded={expanded} aria-controls="home-personal-content" onClick={() => setExpanded(value => !value)} className="min-h-11 text-sm font-semibold text-slate-600 dark:text-slate-300">{t(expanded ? 'common.personal_collapse' : 'common.personal_expand')}</button>
        </div>
      </div>
      <div id="home-personal-content" hidden={!enabled}>
      {shouldRender && enabled && (
        <Suspense fallback={<div className="container mx-auto min-h-[520px] px-4 py-14 md:py-20" aria-hidden="true" />}>
          <HomePersonalPanel />
        </Suspense>
      )}
      </div>
    </div>
  );
};

const VALID_LENSES = new Set(['android', 'frontend', 'ai']);

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { projects, loading, error, retry } = useProjects();
  const [searchParams] = useSearchParams();
  const currentLang = i18n.language || 'en';
  const shouldReduceMotion = useReducedMotion();
  const [showPitchModal, setShowPitchModal] = useState(() => {
    return searchParams.get('pitch') === 'true' || searchParams.get('mode') === 'pitch';
  });

  useEffect(() => {
    const handleOpenPitch = () => setShowPitchModal(true);
    window.addEventListener('open-recruiter-pitch', handleOpenPitch);
    return () => window.removeEventListener('open-recruiter-pitch', handleOpenPitch);
  }, []);

  const requestedLens = searchParams.get('focus');
  const recruiterLens = VALID_LENSES.has(requestedLens) ? requestedLens : 'overview';
  const lensKey = 'home.recruiter_lens.modes.overview';

  const featuredProjects = FEATURED_PROJECT_IDS
    .map((projectId) => projects.find((project) => project.id === projectId))
    .filter(Boolean);
  const featuredBlogs = blogs.slice(0, 2);

  const getData = (data) => {
    if (!data) return "";

    if (typeof data === 'object' && !Array.isArray(data)) {
      return data[currentLang] || data.en || data.id || "";
    }

    return String(data);
  };

  const revealVariants = shouldReduceMotion ? {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  } : {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  const projectGridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 },
    },
  };

  // Keep previously shared Home focus links useful after moving browsing to Projects.
  if (VALID_LENSES.has(requestedLens) && !showPitchModal) {
    return <Navigate to={'/projects?' + searchParams.toString()} replace />;
  }

  return (
    <PageTransition>
      <main className="bg-white dark:bg-dark min-h-screen">
        <SEO
          title={t(`${lensKey}.seo_title`)}
          description={t(`${lensKey}.seo_desc`)}
          url="https://rafierb.me/"
          keywords="Rafie Rojagat Bachri, Software Engineer Portfolio, Android Developer, Front-End Developer, React, Kotlin, AI Developer, UPN Veteran Jakarta"
          type="website"
        />

        <Hero />
        <RecruiterPitchModal
          isOpen={showPitchModal}
          onClose={() => setShowPitchModal(false)}
          initialLens={recruiterLens}
          projects={projects}
          loading={loading}
          error={error}
          retry={retry}
        />

        <section id="selected-work" tabIndex={-1} className="scroll-mt-24 pt-12 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 container max-w-6xl mx-auto focus:outline-none" aria-live="polite">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl text-left">
              <div className="mb-3 flex items-center gap-3">
                <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-400" />
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  01 / {t('projects.featured_eyebrow')}
                </p>
              </div>
              <h2 className="text-3xl font-bold text-dark dark:text-white mb-2.5 sm:text-4xl">{t(`${lensKey}.work_title`)}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t(`${lensKey}.work_summary`)}</p>
            </div>
            <Link
              to="/projects"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
            >
              <span>{t('home.view_all')}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <ProjectCatalogStatus loading={loading} error={error} retry={retry} />
          <motion.div
            variants={projectGridVariants}
            initial={false}
            animate="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-6 sm:mb-10"
          >
            {featuredProjects.map((project) => {
              const title = getData(project.title);
              const shortDesc = getData(project.shortDesc);
              const highlight = projectHighlights[project.id];
              const result = getData(project.impactDetails?.result) || getData(highlight?.result);
              const lessonLearned = getData(project.lessonLearned) || getData(highlight?.lessonLearned);
              const archFlows = project.architecture?.length
                ? project.architecture
                : caseStudyDetails[project.id]?.architecture || [];
              const primaryFlow = archFlows[0];

              return (
                <motion.div
                  key={project.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full rounded-lg"
                >
                  <SpotlightCard className="group p-0 overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative bg-slate-900">
                      <img
                        src={project.image}
                        style={{ objectFit: project.imageFit || 'cover' }}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {primaryFlow && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent px-3.5 pb-2.5 pt-7 text-white">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                            <Cpu size={11} aria-hidden="true" className="shrink-0" />
                            <span className="truncate">{getData(primaryFlow.title)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-dark dark:text-white mb-2">{title}</h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                        {shortDesc}
                      </p>

                      {result && (
                        <div className="mb-5 border-l-2 border-emerald-400 pl-3">
                          <p className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">
                            {t('home.recruiter_lens.project_proof')}
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-slate-800 dark:text-slate-100">
                            {result}
                          </p>
                        </div>
                      )}

                      <ProjectBuildNote project={{ ...project, lessonLearned }} />

                      <Link
                        to={projectPath(project)}
                        onClick={() => trackProjectView(project.id, title)}
                        aria-label={`${title}: ${t('projects.view_details')}`}
                        className="inline-flex items-center gap-2 w-fit mt-auto rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <span>{t('projects.view_details')}</span>
                        <Icon className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-0.5"></Icon>
                      </Link>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center md:hidden">
            <Link to="/projects" className="inline-block px-8 py-3 rounded-lg border border-gray-300 dark:border-slate-700 font-semibold text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {t('home.view_all')}
            </Link>
          </div>
        </section>

        <HomeAboutSnapshot onOpenPitch={() => setShowPitchModal(true)} />
        <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6"><LivingTechStack mode="overview" /></section>

        <section className="border-y border-slate-200/80 bg-slate-50/70 py-14 dark:border-slate-800 dark:bg-slate-900/35 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-3">
                  <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-400" />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    02 / {t('navbar.blog')}
                  </p>
                </div>
                <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">{t('home.latest_blog')}</h2>
                <p className="mt-2.5 text-gray-600 dark:text-gray-400 leading-relaxed">{t('home.blog_glimpse')}</p>
              </div>
              <Link
                to="/blog"
                className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span>{t('home.view_all_blogs')}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} compact />
              ))}
            </div>
          </div>
        </section>

        <DeferredPersonalPanel />

        {/* Closing Editorial CTA — placed at the very end of the narrative */}
        <section className="container mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 px-6 py-10 text-white shadow-xl dark:border-slate-800 sm:px-10 sm:py-14">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(56 189 248 / 0.4) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-3">
                  <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                    {currentLang.startsWith('id') ? 'PENUTUP & KOLABORASI' : 'NEXT STEP & COLLABORATION'}
                  </p>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t('common.connect')}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  {t('common.connect_desc')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 shrink-0">
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <span>{t('hero.contact_me')}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPitchModal(true)}
                  aria-haspopup="dialog"
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <FileText className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                  <span>{t('home.recruiter_pitch.trigger_button')}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </PageTransition>
  );
};

export default HomePage;
