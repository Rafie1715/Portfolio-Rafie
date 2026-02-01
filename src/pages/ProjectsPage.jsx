import Projects from '../components/Projects';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <div className="pt-20 bg-gray-50 dark:bg-dark min-h-screen">
        <SEO
          title={t('projects.seo_title')}
          description={t('projects.seo_desc')}
          url="https://rafierojagat.netlify.app/projects"
        />

        <Projects />
      </div>
    </PageTransition>
  );
};

export default ProjectsPage;