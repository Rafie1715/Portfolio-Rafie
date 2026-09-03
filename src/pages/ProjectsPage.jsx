import Projects from '../components/Projects';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <main className="bg-gray-50 dark:bg-dark min-h-screen pt-20 pb-12 md:pb-20 transition-colors duration-300 relative overflow-hidden">
        <SEO
          title={t('projects.seo_title')}
          description={t('projects.seo_desc')}
          url="https://rafierb.me/projects"
          keywords="Rafie Rojagat Projects, Android Case Studies, Kotlin Apps, AI Projects, Web Development Portfolio, Software Engineer"
          type="website"
        />

        <header className="relative z-10 border-b border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30">
          <div className="container mx-auto max-w-6xl px-4 py-8 md:py-11 flex flex-col md:flex-row md:items-center gap-5 md:gap-7">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-primary flex-shrink-0">
              <i className="fas fa-briefcase text-xl"></i>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-dark dark:text-white mb-2">
                {t('pages.projects.title_prefix')} <span className="text-primary">{t('pages.projects.title_highlight')}</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                {t('pages.projects.subtitle')}
              </p>
            </div>
          </div>
        </header>

        <Projects />
      </main>
    </PageTransition>
  );
};

export default ProjectsPage;
