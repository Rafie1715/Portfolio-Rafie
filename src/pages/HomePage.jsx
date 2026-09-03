import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import Hero from '../components/Hero';
import HomeAboutSnapshot from '../components/HomeAboutSnapshot';
import RecruiterLens from '../components/RecruiterLens';
import { projects } from '../data/projects';
import { blogs } from '../data/blogs';
import BlogCard from '../components/BlogCard';
import SpotlightCard from '../components/SpotlightCard';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import { motion, useReducedMotion } from 'framer-motion';
import { trackEvent } from '../utils/analytics';

const HomePersonalPanel = lazy(() => import('../components/HomePersonalPanel'));

const DeferredPersonalPanel = () => {
  const targetRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target || shouldRender) return undefined;

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
  }, [shouldRender]);

  return (
    <div ref={targetRef} className="min-h-[520px]">
      {shouldRender && (
        <Suspense fallback={<div className="container mx-auto min-h-[520px] px-4 py-14 md:py-20" aria-hidden="true" />}>
          <HomePersonalPanel />
        </Suspense>
      )}
    </div>
  );
};

const FEATURED_PROJECTS_BY_LENS = {
  overview: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
  android: ['mandiri-news', 'planetku', 'OD60ttuTSwZW62TRJFm6'],
  frontend: ['computer-crafter', 'portfolio-website', 'personal-notes'],
  ai: ['OD60ttuTSwZW62TRJFm6', 'planetku', 'sentimen-deepseek'],
};

const VALID_LENSES = new Set(Object.keys(FEATURED_PROJECTS_BY_LENS));

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = i18n.language || 'en';
  const shouldReduceMotion = useReducedMotion();
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const requestedLens = searchParams.get('focus');
  const recruiterLens = VALID_LENSES.has(requestedLens) ? requestedLens : 'overview';
  const lensKey = `home.recruiter_lens.modes.${recruiterLens}`;

  const featuredProjects = FEATURED_PROJECTS_BY_LENS[recruiterLens]
    .map((projectId) => projects.find((project) => project.id === projectId))
    .filter(Boolean);
  const featuredBlogs = blogs.slice(0, 2);

  const handleLensChange = (nextLens) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextLens === 'overview') nextParams.delete('focus');
    else nextParams.set('focus', nextLens);
    setSearchParams(nextParams, { replace: true });
    setSelectedTechnology(null);
    trackEvent('Recruiter Lens', 'select', nextLens, 1);
  };

  const handleTechnologySelect = (technology) => {
    setSelectedTechnology(technology);
    trackEvent('Living Tech Stack', 'select', technology.id, 1);
  };

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

        <Hero recruiterLens={recruiterLens} onRecruiterLensChange={handleLensChange} />
        <RecruiterLens
          value={recruiterLens}
          onChange={handleLensChange}
          onTechnologySelect={handleTechnologySelect}
        />

        <section id="selected-work" className="py-12 md:py-20 px-4 container mx-auto" aria-live="polite">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 mb-3">{t('home.highlights')}</p>
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">{t(`${lensKey}.work_title`)}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t(`${lensKey}.work_summary`)}</p>
            {selectedTechnology && (
              <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
                <span className="truncate">
                  {t('home.recruiter_lens.highlighting_technology', {
                    technology: selectedTechnology.name,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTechnology(null)}
                  title={t('home.recruiter_lens.clear_technology')}
                  aria-label={t('home.recruiter_lens.clear_technology')}
                  className="inline-flex size-7 flex-none items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={projectGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            key={recruiterLens}
          >
            {featuredProjects.map((project) => {
              const title = getData(project.title);
              const shortDesc = getData(project.shortDesc);
              const result = getData(project.impactDetails?.result);
              const isRelatedTechnology = selectedTechnology?.projectIds.includes(project.id);
              const isDimmed = selectedTechnology && !isRelatedTechnology;

              return (
                <motion.div
                  key={project.id}
                  variants={revealVariants}
                  className={`h-full rounded-lg transition-[opacity,filter,box-shadow] duration-300 ${
                    isRelatedTechnology
                      ? 'ring-2 ring-primary ring-offset-4 ring-offset-white dark:ring-offset-dark'
                      : ''
                  } ${isDimmed ? 'opacity-45 grayscale-[0.35]' : 'opacity-100'}`}
                >
                  <SpotlightCard className="group p-0 overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {isRelatedTechnology && (
                        <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          {t('home.recruiter_lens.related_project', {
                            technology: selectedTechnology.name,
                          })}
                        </span>
                      )}
                      {project.conceptualCover && (
                        <span className="absolute bottom-3 right-3 rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                          {t('projects.conceptual_cover')}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-dark dark:text-white mb-2">{title}</h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                        {shortDesc}
                      </p>

                      {result && (
                        <div className="mb-5 border-l-2 border-emerald-400 pl-3">
                          <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                            {t('home.recruiter_lens.project_proof')}
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-slate-800 dark:text-slate-100">
                            {result}
                          </p>
                        </div>
                      )}

                      <Link
                        to={`/project/${project.id}`}
                        aria-label={`${title} - View Details`}
                        className="inline-flex items-center gap-2 w-fit mt-auto rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <span>{t('projects.view_details')}</span>
                        <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-0.5"></i>
                      </Link>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center">
            <Link to="/projects" className="inline-block px-8 py-3 rounded-full border border-gray-300 dark:border-slate-700 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {t('home.view_all')}
            </Link>
          </div>
        </section>

        <HomeAboutSnapshot />

        <section className="py-20 px-4 container mx-auto bg-gray-50 dark:bg-darkLight my-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">{t('home.latest_blog')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.blog_glimpse')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/blog" className="inline-block px-8 py-3 rounded-full border border-gray-300 dark:border-slate-700 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {t('home.view_all_blogs')}
            </Link>
          </div>
        </section>

        <DeferredPersonalPanel />
      </main>
    </PageTransition>
  );
};

export default HomePage;
