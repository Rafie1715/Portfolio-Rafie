import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { projects } from '../data/projects';
import { blogs } from '../data/blogs';
import BlogCard from '../components/BlogCard';
import SpotlightCard from '../components/SpotlightCard';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import { motion, useReducedMotion } from 'framer-motion';

const HomePersonalPanel = lazy(() => import('../components/HomePersonalPanel'));

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const shouldReduceMotion = useReducedMotion();

  const featuredProjects = projects.slice(0, 3);
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

  return (
    <PageTransition>
      <div className="bg-white dark:bg-dark min-h-screen">
        <SEO
          title="Rafie Rojagat | Software Engineer Portfolio"
          description="Portfolio of Rafie Rojagat Bachri, a recent Informatics graduate building Android, front-end, and AI-integrated products with Kotlin and React."
          url="https://rafierb.me/"
          keywords="Rafie Rojagat Bachri, Software Engineer Portfolio, Android Developer, Front-End Developer, React, Kotlin, AI Developer, UPN Veteran Jakarta"
          type="website"
        />

        <Hero />

        <section className="py-12 md:py-20 px-4 container mx-auto">
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">{t('home.highlights')}</p>
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">{t('home.featured_work')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.glimpse')}</p>
          </motion.div>

          <motion.div
            variants={projectGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {featuredProjects.map((project) => {
              const title = getData(project.title);
              const shortDesc = getData(project.shortDesc);

              return (
                <motion.div key={project.id} variants={revealVariants} className="h-full">
                  <SpotlightCard className="group p-0 overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
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

                      <Link
                        to={`/project/${project.id}`}
                        aria-label={`${title} - View Details`}
                        className="inline-flex items-center gap-2 w-fit mt-auto rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <span>View Details</span>
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

        <section className="py-20 px-4 container mx-auto bg-gray-50 dark:bg-darkLight my-12 rounded-2xl">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">{t('home.latest_blog')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.blog_glimpse')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {featuredBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} data-aos="fade-up" data-aos-delay={index * 100} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/blog" className="inline-block px-8 py-3 rounded-full border border-gray-300 dark:border-slate-700 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {t('home.view_all_blogs')}
            </Link>
          </div>
        </section>

        <Suspense fallback={<div className="container mx-auto min-h-[520px] px-4 py-14 md:py-20" aria-hidden="true" />}>
          <HomePersonalPanel />
        </Suspense>
      </div>
    </PageTransition>
  );
};

export default HomePage;
