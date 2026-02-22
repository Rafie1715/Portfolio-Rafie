import Projects from '../components/Projects';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-dark min-h-screen pt-20 md:pt-24 pb-12 md:pb-20 transition-colors duration-300 relative overflow-hidden">
        <SEO
          title={t('projects.seo_title')}
          description={t('projects.seo_desc')}
          url="https://rafie-dev.netlify.app/projects"
          keywords="Portfolio Projects, Mobile Apps, Web Applications, React Projects, Flutter Apps, Python Projects, Software Development Portfolio, Coding Projects"
          type="website"
        />

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50 dark:from-dark dark:via-transparent dark:to-dark"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10 mb-16">
          <div className="text-center mb-12 md:mb-20">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block relative"
            >
              <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl relative z-10">
                <i className="fas fa-briefcase text-3xl md:text-5xl text-dark dark:text-white bg-clip-text bg-gradient-to-r from-primary to-secondary"></i>
              </div>
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full transform scale-150 z-0 animate-pulse"></div>
            </motion.div>

            <h1 className="mt-6 md:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-dark dark:text-white mb-4 md:mb-6 tracking-tight px-4">
              {t('pages.projects.title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{t('pages.projects.title_highlight')}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              {t('pages.projects.subtitle')}
            </p>
          </div>
        </div>

        <Projects />
      </div>
    </PageTransition>
  );
};

export default ProjectsPage;